import os
import sys
import time
import logging
import argparse
import signal
import atexit
from datetime import datetime, timezone, timedelta
from logging.handlers import RotatingFileHandler
from pathlib import Path
from threading import Event

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


def connect_supabase() -> Client:
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def mt5_init() -> bool:
    mt5.shutdown()
    kwargs = {"timeout": 15000}
    if MT5_PATH:
        kwargs["path"] = MT5_PATH
    for attempt in range(3):
        if _shutdown.is_set():
            return False
        if mt5.initialize(**kwargs):
            logger.info("MT5 initialized")
            return True
        err = mt5.last_error()
        code, desc = err if isinstance(err, tuple) else (0, str(err))
        logger.warning(f"MT5 init attempt {attempt+1}/3 failed (code={code}): {desc}")
        if attempt < 2:
            time.sleep(3)
    return False


def mt5_ensure_alive() -> bool:
    if mt5.terminal_info() is None:
        logger.warning("MT5 terminal disconnected, reinitializing...")
        mt5.shutdown()
        return mt5_init()
    return True


def mt5_switch_account(login: str, password: str, server: str) -> bool:
    if not mt5_ensure_alive():
        return False
    result = mt5.login(login=int(login), password=password, server=server)
    if not result:
        err = mt5.last_error()
        code, desc = err if isinstance(err, tuple) else (0, str(err))
        logger.error(f"Login to {login} failed (code={code}): {desc}")
        return False
    info = mt5.account_info()
    if info is None or str(info.login) != str(login):
        logger.error(f"Login mismatch after switch: expected {login}, got {getattr(info, 'login', None)}")
        return False
    return True


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


def read_account(login: str) -> dict | None:
    info = mt5.account_info()
    if info is None:
        logger.error(f"account_info() returned None for {login}")
        return None

    now = datetime.utcnow()
    since = now - timedelta(hours=24)
    deals = mt5.history_deals_get(since, now)
    scalping = []

    if deals:
        opens = {}
        for d in deals:
            if d.entry == 0:
                opens[d.order] = d.time
        for d in deals:
            if d.entry == 1:
                ot = opens.get(d.order)
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


def process_all(supabase: Client, http: requests.Session) -> tuple[int, int]:
    accounts = fetch_accounts(supabase)
    count = len(accounts)
    logger.info(f"Fetched {count} account(s)")

    if count == 0:
        return 0, 0

    ok = 0
    fail = 0

    for i, acct in enumerate(accounts):
        if _shutdown.is_set():
            break

        login = str(acct.get("mt5_login", ""))
        aid = acct.get("id", "")
        pw = acct.get("investor_password") or acct.get("mt5_password", "")
        srv = acct.get("mt5_server", "")

        if not mt5_switch_account(login, pw, srv):
            fail += 1
            continue

        data = read_account(login)
        if data is None:
            fail += 1
            continue

        ok_flag = post_snapshot(aid, login, data["equity"], data["balance"],
                                data["profit"], data.get("scalping_violations"), http)
        if ok_flag:
            if data["scalping_violations"]:
                det = ", ".join(f"{v['symbol']} {v['duration_seconds']}s"
                                for v in data["scalping_violations"])
                logger.warning(f"[{login}] SCALPING ({len(data['scalping_violations'])}): {det}")
            logger.info(f"[{login}] OK  e={data['equity']} b={data['balance']} p={data['profit']}")
            ok += 1
        else:
            fail += 1

        if i < count - 1 and not _shutdown.is_set():
            time.sleep(2)

    return ok, fail


def run_daemon(supabase: Client, http: requests.Session, interval: int, skip_market: bool = False):
    logger.info(f"Daemon mode active (poll every {interval}s)")
    consec_fail = 0

    while not _shutdown.is_set():
        if not skip_market and not is_market_hours():
            logger.info("Market closed, sleeping 5min")
            _shutdown.wait(300)
            continue

        try:
            ok, fail = process_all(supabase, http)
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

    atexit.register(mt5.shutdown)

    if not mt5_init():
        logger.error("Failed to initialize MT5, aborting")
        sys.exit(1)

    http = requests.Session()
    http.headers.update({"Content-Type": "application/json"})

    try:
        supabase = connect_supabase()
    except Exception as e:
        logger.error(f"Supabase connection failed: {e}")
        mt5.shutdown()
        sys.exit(1)

    try:
        if args.daemon:
            run_daemon(supabase, http, args.interval, args.skip_market)
        else:
            ok, fail = process_all(supabase, http)
            elapsed = int((time.time() - start) * 1000)
            logger.info(f"Done — {ok} ok, {fail} failed, {elapsed}ms")
            if fail > 0:
                sys.exit(1)
    finally:
        mt5.shutdown()
        http.close()


if __name__ == "__main__":
    main()
