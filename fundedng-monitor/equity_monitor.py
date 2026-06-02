import os
import sys
import time
import logging
import argparse
import signal
import atexit
import threading
import random
from datetime import datetime, timezone, timedelta
from logging.handlers import RotatingFileHandler
from pathlib import Path
from threading import Event
from concurrent.futures import ThreadPoolExecutor, as_completed

import requests
from dotenv import load_dotenv
import MetaTrader5 as mt5
from supabase import create_client, Client


load_dotenv()

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
API_ENDPOINT = os.environ["API_ENDPOINT"]
API_SECRET = os.environ["API_SECRET"]
MT5_PATH = os.environ.get("MT5_PATH")

SCRIPT_DIR = Path(__file__).parent
LOG_FILE = SCRIPT_DIR / "equity_monitor.log"

logger = logging.getLogger("equity_monitor")
logger.setLevel(logging.INFO)
handler = RotatingFileHandler(LOG_FILE, maxBytes=5 * 1024 * 1024, backupCount=3)
formatter = logging.Formatter(
    "%(asctime)s | %(levelname)s | %(message)s", datefmt="%Y-%m-%d %H:%M:%S"
)
handler.setFormatter(formatter)
logger.addHandler(handler)
console = logging.StreamHandler()
console.setFormatter(formatter)
logger.addHandler(console)

mt5_lock = threading.Lock()

_shutdown = Event()

def _handle_signal(signum, frame):
    logger.info(f"Signal {signum} received, shutting down...")
    _shutdown.set()

if hasattr(signal, "SIGINT"):
    signal.signal(signal.SIGINT, _handle_signal)
if hasattr(signal, "SIGTERM"):
    signal.signal(signal.SIGTERM, _handle_signal)
if hasattr(signal, "SIGBREAK"):
    signal.signal(signal.SIGBREAK, _handle_signal)


def _safe_shutdown():
    try:
        mt5.shutdown()
    except Exception:
        pass


def connect_supabase() -> Client:
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def fetch_accounts(supabase: Client) -> list[dict]:
    result = (
        supabase.table("trader_accounts")
        .select(
            "id, mt5_login, mt5_password, investor_password, mt5_server, "
            "starting_balance, peak_equity, status, user_id"
        )
        .in_("status", ["active", "funded"])
        .neq("investor_password", "")
        .not_.is_("investor_password", "null")
        .execute()
    )
    return result.data or []


def read_mt5_account(login: str, password: str, server: str, starting_balance: float = 0) -> dict:
    mt5.shutdown()

    initialized = mt5.initialize(timeout=15000)
    if not initialized and MT5_PATH:
        initialized = mt5.initialize(path=MT5_PATH, timeout=60000)
    if not initialized:
        err = mt5.last_error()
        code, desc = err if isinstance(err, tuple) else (0, str(err))
        raise RuntimeError(f"MT5 initialize failed (code={code}): {desc}")

    connected = mt5.account_info()
    if connected is None or str(connected.login) != str(login):
        if not mt5.login(login=int(login), password=password, server=server):
            err = mt5.last_error()
            code, desc = err if isinstance(err, tuple) else (0, str(err))
            raise RuntimeError(f"Login to {login} failed (code={code}): {desc}")

    info = mt5.account_info()
    if info is None:
        raise RuntimeError(f"account_info() returned None for {login}")

    now = datetime.utcnow()
    since = now - timedelta(hours=24)
    deals = mt5.history_deals_get(since, now)
    scalping = []

    if deals:
        opens = {}
        for d in deals:
            if d.entry == 0:
                opens[d.position_id] = d.time
        for d in deals:
            if d.entry == 1:
                ot = opens.get(d.position_id)
                if ot is not None:
                    secs = int(d.time - ot)
                    if 0 < secs < 180:
                        scalping.append({
                            "symbol": d.symbol,
                            "open_time": int(ot),
                            "close_time": int(d.time),
                            "duration_seconds": secs,
                            "profit": round(d.profit, 2),
                            "volume": d.volume,
                            "ticket": d.ticket,
                        })

    return {
        "equity": round(info.equity, 2),
        "balance": round(info.balance, 2),
        "profit": round(info.profit, 2),
        "scalping_violations": scalping,
    }


def process_account(acct: dict) -> dict:
    mt5_login = str(acct.get("mt5_login", ""))
    account_id = acct.get("id", "")
    investor_password = acct.get("investor_password") or acct.get("mt5_password", "")
    server = acct.get("mt5_server", "")
    starting_balance = float(acct.get("starting_balance") or 0)

    result = {
        "login": mt5_login,
        "success": False,
        "error": None,
    }

    time.sleep(random.uniform(0, 0.3))

    try:
        with mt5_lock:
            data = read_mt5_account(
                mt5_login,
                investor_password,
                server,
                starting_balance=starting_balance,
            )
            _safe_shutdown()
    except Exception as e:
        logger.error(f"[{mt5_login}] MT5 read error: {e}")
        _safe_shutdown()
        result["error"] = str(e)
        return result

    violations = data.get("scalping_violations", [])
    try:
        post_snapshot(
            account_id=account_id,
            mt5_login=mt5_login,
            equity=data["equity"],
            balance=data["balance"],
            profit=data["profit"],
            violations=violations,
        )
        if violations:
            logger.warning(
                f"[{mt5_login}] SCALPING DETECTED — "
                f"{len(violations)} violation(s): "
                + ", ".join([
                    f"{v['symbol']} {v['duration_seconds']}s"
                    for v in violations
                ])
            )
        logger.info(
            f"[{mt5_login}] OK  "
            f"e={data['equity']} "
            f"b={data['balance']} "
            f"p={data['profit']}"
        )
        result["success"] = True
    except Exception as e:
        logger.error(f"[{mt5_login}] API post error: {e}")
        result["error"] = str(e)

    return result


def post_snapshot(
    account_id: str, mt5_login: str, equity: float,
    balance: float, profit: float, violations: list | None = None,
    session: requests.Session | None = None,
) -> bool:
    payload = {
        "account_id": account_id,
        "mt5_login": mt5_login,
        "equity": equity,
        "balance": balance,
        "profit": profit,
        "scalping_violations": violations or [],
    }
    headers = {"Content-Type": "application/json", "x-cron-secret": API_SECRET}
    http = session or requests
    try:
        resp = http.post(API_ENDPOINT, json=payload, headers=headers, timeout=20)
        if resp.status_code >= 400:
            logger.error(f"API {resp.status_code}: {resp.text[:200]}")
            return False
        return True
    except requests.Timeout:
        logger.error("API timeout")
        return False
    except requests.ConnectionError as e:
        logger.error(f"API connection: {e}")
        return False
    except Exception as e:
        logger.error(f"API error: {e}")
        return False


def is_market_hours() -> bool:
    now = datetime.utcnow()
    wd = now.weekday()
    if wd == 5:
        return False
    if wd == 6 and now.hour < 22:
        return False
    if wd == 4 and now.hour >= 21:
        return False
    return True


def process_all(supabase: Client) -> tuple[int, int]:
    accounts = fetch_accounts(supabase)
    count = len(accounts)
    logger.info(f"Fetched {count} account(s)")

    if count == 0:
        return 0, 0

    succeeded = 0
    failed = 0

    max_workers = min(len(accounts), 4)

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {
            executor.submit(process_account, acct): acct
            for acct in accounts
        }
        for future in as_completed(futures):
            acct = futures[future]
            try:
                result = future.result(timeout=55)
                if result["success"]:
                    succeeded += 1
                else:
                    failed += 1
            except Exception as e:
                logger.error(
                    f"[{acct.get('mt5_login')}] "
                    f"Thread error: {e}"
                )
                failed += 1

    return succeeded, failed


def run_daemon(supabase: Client, interval: int, skip_market: bool = False):
    logger.info(f"Daemon mode active (poll every {interval}s)")
    consec_fail = 0

    while not _shutdown.is_set():
        if not skip_market and not is_market_hours():
            logger.info("Market closed, sleeping 5min")
            _shutdown.wait(300)
            continue

        try:
            ok, fail = process_all(supabase)
            if fail:
                consec_fail += fail
                if consec_fail >= 10:
                    logger.warning(f"High failure rate ({consec_fail} total failures)")
            else:
                consec_fail = 0
        except Exception as e:
            logger.error(f"Cycle error: {e}")
            consec_fail += 1

        if not _shutdown.is_set():
            _shutdown.wait(interval)

    logger.info("Daemon stopped")


def main():
    parser = argparse.ArgumentParser(description="Live Equity Monitor")
    parser.add_argument("--daemon", action="store_true", help="Continuous daemon mode")
    parser.add_argument("--interval", type=int, default=60, help="Poll interval (s)")
    parser.add_argument("--skip-market", action="store_true", help="Skip market hours check")
    args = parser.parse_args()

    start = time.time()
    logger.info("=" * 50)
    logger.info("Equity Monitor started")

    if not args.skip_market and not is_market_hours():
        logger.info("Market closed, exiting")
        return

    try:
        supabase = connect_supabase()
    except Exception as e:
        logger.error(f"Supabase connection failed: {e}")
        sys.exit(1)

    try:
        if args.daemon:
            run_daemon(supabase, args.interval, args.skip_market)
        else:
            ok, fail = process_all(supabase)
            elapsed = int((time.time() - start) * 1000)
            logger.info(f"Done — {ok} ok, {fail} failed, {elapsed}ms")
            if fail > 0:
                sys.exit(1)
    finally:
        _safe_shutdown()


if __name__ == "__main__":
    main()
