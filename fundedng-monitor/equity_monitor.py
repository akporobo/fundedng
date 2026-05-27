import os
import sys
import time
import logging
from datetime import datetime, timezone
from logging.handlers import RotatingFileHandler
from pathlib import Path

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


def connect_supabase() -> Client:
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def fetch_accounts(supabase: Client) -> list[dict]:
    result = (
        supabase.table("trader_accounts")
        .select(
            "id, mt5_login, mt5_password, investor_password, mt5_server, starting_balance, peak_equity, status, user_id"
        )
        .in_("status", ["active", "funded"])
        .neq("investor_password", "")
        .not_.is_("investor_password", "null")
        .execute()
    )
    return result.data or []


def read_mt5_account(mt5_login: str, password: str, server: str) -> dict:
    init_kwargs = {
        "login": int(mt5_login),
        "password": password,
        "server": server,
        "timeout": 10000,
    }
    if MT5_PATH:
        init_kwargs["path"] = MT5_PATH

    initialized = mt5.initialize(**init_kwargs)
    if not initialized:
        err = mt5.last_error()
        code, desc = err if isinstance(err, tuple) else (0, str(err))
        raise RuntimeError(f"MT5 initialize failed (code={code}): {desc}")

    info = mt5.account_info()
    if info is None:
        raise RuntimeError("mt5.account_info() returned None")

    data = {
        "equity": info.equity,
        "balance": info.balance,
        "profit": info.profit,
    }
    return data


def post_snapshot(account_id: str, mt5_login: str, equity: float, balance: float, profit: float) -> bool:
    payload = {
        "account_id": account_id,
        "mt5_login": mt5_login,
        "equity": equity,
        "balance": balance,
        "profit": profit,
    }
    headers = {
        "Content-Type": "application/json",
        "x-cron-secret": API_SECRET,
    }
    resp = requests.post(API_ENDPOINT, json=payload, headers=headers, timeout=15)
    if resp.status_code >= 400:
        raise RuntimeError(f"API returned {resp.status_code}: {resp.text[:200]}")
    return True


def is_market_hours() -> bool:
    now = datetime.now(timezone.utc)
    if now.weekday() == 5:
        return False
    if now.weekday() == 6 and now.hour < 22:
        return False
    return True


def main():
    if not is_market_hours():
        logger.info("Market closed — skipping run (weekend)")
        return

    start = time.time()
    logger.info("=== Equity Monitor start ===")

    try:
        supabase = connect_supabase()
    except Exception as e:
        logger.error(f"Supabase connection failed: {e}")
        sys.exit(1)

    accounts = fetch_accounts(supabase)
    count = len(accounts)
    logger.info(f"Fetched {count} account(s) from Supabase")

    if count == 0:
        elapsed = int((time.time() - start) * 1000)
        logger.info(f"=== Equity Monitor end — 0 accounts, {elapsed}ms ===")
        return

    succeeded = 0
    failed = 0

    for i, acct in enumerate(accounts):
        mt5_login = str(acct.get("mt5_login", ""))
        account_id = acct.get("id", "")
        investor_password = acct.get("investor_password", "")
        server = acct.get("mt5_server", "")

        try:
            data = read_mt5_account(mt5_login, investor_password, server)
        except Exception as e:
            logger.error(f"[{mt5_login}] MT5 read error: {e}")
            failed += 1
            _safe_shutdown()
            continue

        try:
            _safe_shutdown()
        except Exception:
            pass

        try:
            post_snapshot(
                account_id=account_id,
                mt5_login=mt5_login,
                equity=data["equity"],
                balance=data["balance"],
                profit=data["profit"],
            )
            logger.info(
                f"[{mt5_login}] OK \u2014 equity={data['equity']}, balance={data['balance']}, profit={data['profit']}"
            )
            succeeded += 1
        except Exception as e:
            logger.error(f"[{mt5_login}] API post error: {e}")
            failed += 1

        if i < count - 1:
            time.sleep(2)

    elapsed = int((time.time() - start) * 1000)
    logger.info(
        f"=== Equity Monitor end \u2014 {succeeded} succeeded, {failed} failed, {elapsed}ms ==="
    )

    if failed > 0:
        sys.exit(1)


def _safe_shutdown():
    try:
        mt5.shutdown()
    except Exception:
        pass


if __name__ == "__main__":
    main()
