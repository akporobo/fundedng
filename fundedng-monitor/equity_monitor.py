"""
FundedNG Equity Monitor
=======================
Reads live equity from Exness MT5 accounts via investor password
and posts each account's data to the FundedNG API endpoint.

Run via Task Scheduler every 60 seconds.
Uses pythonw.exe to run silently with no console window.

How it works:
  1. Load env vars from .env in the same folder
  2. Fetch all active/funded accounts that have an investor_password
  3. For each account, connect to MT5 with investor password (read-only)
  4. Read equity, balance, profit
  5. Check last 24h of closed trades for scalping violations (<3 min)
  6. Verify the connected login matches what was requested (prevents cross-account corruption)
  7. POST the data to the API endpoint
  8. Log results to equity_monitor.log (rotating, max 5MB, 3 backups)

Safety checks built in:
  - Login mismatch detection: if MT5 connects to wrong account, skip it
  - Zero equity guard: never post equity=0 (prevents false breaches)
  - Balance sanity check: if balance < 10% of starting, skip it
"""

import os
import sys
import time
import logging
import threading
import random
from datetime import datetime, timedelta, timezone
from logging.handlers import RotatingFileHandler
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

import requests
from dotenv import load_dotenv
import MetaTrader5 as mt5
from supabase import create_client, Client


# ─────────────────────────────────────────────
#  CONFIG — loaded from .env
# ─────────────────────────────────────────────

load_dotenv()

SUPABASE_URL      = os.environ["SUPABASE_URL"]
SUPABASE_KEY      = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
API_ENDPOINT      = os.environ["API_ENDPOINT"]
API_SECRET        = os.environ["API_SECRET"]
MT5_PATH          = os.environ.get("MT5_PATH", "")   # optional

# How many accounts to process at the same time.
# MT5 reads are still sequential (thread-safe lock),
# but API posts overlap with the next MT5 read.
# Keep at 4 — increasing it doesn't help MT5 speed.
MAX_WORKERS = 4


# ─────────────────────────────────────────────
#  LOGGING
# ─────────────────────────────────────────────

SCRIPT_DIR = Path(__file__).parent
LOG_FILE   = SCRIPT_DIR / "equity_monitor.log"

logger = logging.getLogger("fundedng_monitor")
logger.setLevel(logging.INFO)

_fmt = logging.Formatter(
    "%(asctime)s | %(levelname)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

# File handler — rotates at 5 MB, keeps 3 backups
_fh = RotatingFileHandler(LOG_FILE, maxBytes=5 * 1024 * 1024, backupCount=3)
_fh.setFormatter(_fmt)
logger.addHandler(_fh)

# Console handler — visible when running manually in a terminal
_ch = logging.StreamHandler(sys.stdout)
_ch.setFormatter(_fmt)
logger.addHandler(_ch)


# ─────────────────────────────────────────────
#  MT5 LOCK — only one MT5 call at a time
# ─────────────────────────────────────────────

mt5_lock = threading.Lock()


# ─────────────────────────────────────────────
#  MARKET HOURS CHECK
# ─────────────────────────────────────────────

def is_market_open() -> bool:
    """
    Returns False on weekends when MT5 demo servers are idle.
    UTC times:
      Saturday all day  → closed
      Sunday before 22:00 UTC → closed
    Monday–Friday → open
    """
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    wd  = now.weekday()          # 0=Mon … 6=Sun
    if wd == 5:                  # Saturday
        return False
    if wd == 6 and now.hour < 22:  # Sunday before 22:00 UTC
        return False
    return True


# ─────────────────────────────────────────────
#  SUPABASE
# ─────────────────────────────────────────────

def get_supabase() -> Client:
    return create_client(SUPABASE_URL, SUPABASE_KEY)


def fetch_accounts(supabase: Client) -> list[dict]:
    """
    Return all active/funded accounts that have an investor_password set.
    Accounts without investor_password are silently skipped.
    """
    res = (
        supabase.table("trader_accounts")
        .select(
            "id, mt5_login, investor_password, mt5_server, "
            "starting_balance, peak_equity, status, user_id"
        )
        .in_("status", ["active", "funded"])
        .not_.is_("investor_password", "null")
        .neq("investor_password", "")
        .execute()
    )
    return res.data or []


# ─────────────────────────────────────────────
#  MT5 READ
# ─────────────────────────────────────────────

def _safe_mt5_shutdown():
    try:
        mt5.shutdown()
    except Exception:
        pass


def read_account(login: str, investor_pw: str, server: str,
                 starting_balance: float = 0) -> dict:
    """
    Connect to MT5 with investor (read-only) password.
    Returns dict with equity, balance, profit, scalping_violations.
    Raises RuntimeError on any problem — caller will log and skip.
    """
    # Log in with investor password
    login_ok = mt5.login(
        login   = int(login),
        password= investor_pw,
        server  = server,
    )
    if not login_ok:
        code, desc = mt5.last_error() if isinstance(mt5.last_error(), tuple) else (0, str(mt5.last_error()))
        raise RuntimeError(f"Login to {login} failed ({code}): {desc}")

    # Fetch account info
    info = mt5.account_info()
    if info is None:
        raise RuntimeError(f"account_info() returned None for {login}")

    # ── Safety check 1: verify we're on the right account ──
    if str(info.login) != str(login):
        raise RuntimeError(
            f"Login mismatch: requested {login} but MT5 returned {info.login}. "
            f"Skipping to prevent data corruption."
        )

    # ── Safety check 2: reject zero / negative equity ──
    if info.equity <= 0:
        raise RuntimeError(
            f"Equity is {info.equity} for {login} — "
            f"looks like a bad read, skipping."
        )

    # ── Safety check 3: reject suspiciously low balance ──
    if starting_balance > 0 and info.balance < starting_balance * 0.10:
        raise RuntimeError(
            f"Balance {info.balance} is below 10% of starting "
            f"{starting_balance} for {login} — skipping."
        )

    # ── Scalping check: closed trades under 3 minutes in last 24h ──
    now   = datetime.now(timezone.utc).replace(tzinfo=None)
    since = now - timedelta(hours=24)
    deals = mt5.history_deals_get(since, now) or []

    open_times: dict[int, int] = {}
    for d in deals:
        if d.entry == 0:                        # trade opened
            open_times[d.position_id] = d.time  # unix timestamp

    scalping: list[dict] = []
    for d in deals:
        if d.entry == 1:                        # trade closed
            ot = open_times.get(d.position_id)
            if ot is not None:
                secs = int(d.time - ot)
                if 0 < secs < 180:              # under 3 minutes
                    scalping.append({
                        "symbol":           d.symbol,
                        "open_time":        int(ot),
                        "close_time":       int(d.time),
                        "duration_seconds": secs,
                        "profit":           round(d.profit, 2),
                        "volume":           d.volume,
                        "ticket":           d.ticket,
                    })

    return {
        "equity":               round(info.equity,  2),
        "balance":              round(info.balance, 2),
        "profit":               round(info.profit,  2),
        "scalping_violations":  scalping,
    }


# ─────────────────────────────────────────────
#  API POST
# ─────────────────────────────────────────────

_session = requests.Session()
_session.headers.update({
    "Content-Type":  "application/json",
    "x-cron-secret": API_SECRET,
})


def post_snapshot(account_id: str, mt5_login: str,
                  equity: float, balance: float, profit: float,
                  scalping_violations: list) -> None:
    """
    POST equity data to the FundedNG API.
    Raises requests.HTTPError if the server returns 4xx/5xx.
    """
    payload = {
        "account_id":          account_id,
        "mt5_login":           mt5_login,
        "equity":              equity,
        "balance":             balance,
        "profit":              profit,
        "scalping_violations": scalping_violations,
    }
    resp = _session.post(API_ENDPOINT, json=payload, timeout=20)
    if resp.status_code >= 400:
        raise requests.HTTPError(
            f"API returned {resp.status_code}: {resp.text[:200]}"
        )


# ─────────────────────────────────────────────
#  PROCESS ONE ACCOUNT
# ─────────────────────────────────────────────

def process_account(acct: dict) -> dict:
    """
    Full pipeline for one trader account:
      1. Acquire MT5 lock (prevents concurrent MT5 calls)
      2. Connect, read equity, check scalping, shutdown
      3. Release lock
      4. POST to API (runs in parallel with next account's MT5 read)
    Returns a result dict with success flag.
    """
    login    = str(acct.get("mt5_login", ""))
    acct_id  = str(acct.get("id", ""))
    inv_pw   = str(acct.get("investor_password") or "")
    server   = str(acct.get("mt5_server") or "Exness-MT5Trial9")
    start_bal= float(acct.get("starting_balance") or 0)

    result = {"login": login, "ok": False, "error": ""}

    # Tiny random delay so threads don't all hit the lock at once
    time.sleep(random.uniform(0, 0.5))

    # ── Step 1: MT5 read (serialised) ────────────────────────────
    try:
        with mt5_lock:
            data = read_account(login, inv_pw, server, start_bal)
    except Exception as exc:
        logger.error(f"[{login}] MT5 error: {exc}")
        result["error"] = str(exc)
        return result

    # ── Step 2: API post (runs in parallel) ──────────────────────
    violations = data.get("scalping_violations", [])
    try:
        post_snapshot(
            account_id          = acct_id,
            mt5_login           = login,
            equity              = data["equity"],
            balance             = data["balance"],
            profit              = data["profit"],
            scalping_violations = violations,
        )
    except Exception as exc:
        logger.error(f"[{login}] API error: {exc}")
        result["error"] = str(exc)
        return result

    # ── Log result ────────────────────────────────────────────────
    if violations:
        logger.warning(
            f"[{login}] SCALPING DETECTED — "
            + ", ".join(f"{v['symbol']} {v['duration_seconds']}s"
                        for v in violations)
        )

    logger.info(
        f"[{login}] OK  "
        f"e={data['equity']}  "
        f"b={data['balance']}  "
        f"p={data['profit']}"
    )
    result["ok"] = True
    return result


# ─────────────────────────────────────────────
#  MAIN
# ─────────────────────────────────────────────

def main():
    start = time.time()
    logger.info("=" * 50)
    logger.info("Equity Monitor started")

    # Skip on weekends — no point connecting to idle servers
    if not is_market_open():
        logger.info("Market closed — skipping run (weekend)")
        return

    # Connect to Supabase
    try:
        supabase = get_supabase()
    except Exception as exc:
        logger.error(f"Supabase connection failed: {exc}")
        sys.exit(1)

    # Fetch accounts
    accounts = fetch_accounts(supabase)
    total = len(accounts)
    logger.info(f"Fetched {total} account(s) from Supabase")

    if total == 0:
        logger.info("No accounts to monitor — exiting")
        return

    # Initialize MT5 once (reused across all account reads)
    init_ok = mt5.initialize(path=MT5_PATH, timeout=120000) if MT5_PATH else mt5.initialize(timeout=120000)
    if not init_ok:
        code, desc = mt5.last_error() if isinstance(mt5.last_error(), tuple) else (0, str(mt5.last_error()))
        logger.error(f"MT5 initialisation failed ({code}): {desc}")
        sys.exit(1)

    try:
        # Process all accounts using thread pool
        # MT5 reads are locked (sequential), API posts are parallel
        succeeded = 0
        failed    = 0
        workers   = min(total, MAX_WORKERS)

        with ThreadPoolExecutor(max_workers=workers) as pool:
            future_to_acct = {
                pool.submit(process_account, acct): acct
                for acct in accounts
            }
            for future in as_completed(future_to_acct):
                acct = future_to_acct[future]
                try:
                    res = future.result(timeout=55)
                    if res["ok"]:
                        succeeded += 1
                    else:
                        failed += 1
                except Exception as exc:
                    logger.error(
                        f"[{acct.get('mt5_login', '?')}] "
                        f"Thread crashed: {exc}"
                    )
                    failed += 1
    finally:
        _safe_mt5_shutdown()

    elapsed_s = round(time.time() - start, 1)
    logger.info(
        f"Done — {succeeded} ok, {failed} failed, {elapsed_s}s"
    )

    # Exit with error code if any accounts failed
    # Task Scheduler logs this in its history
    if failed > 0:
        sys.exit(1)


if __name__ == "__main__":
    main()
