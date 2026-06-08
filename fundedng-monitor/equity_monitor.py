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
  3. Initialize MT5 terminal once
  4. For each account (in parallel threads, MT5 locked):
     a. Login with investor password (read-only)
     b. Verify connected login matches requested login
     c. Read equity, balance, profit
     d. Check last 24h trades for scalping violations (<3 min)
     e. On error: attempt MT5 recovery before next account
  5. POST each account's data to the FundedNG API (parallel)
  6. Log everything to equity_monitor.log

Safety checks:
  - Login mismatch detection     → skips account, prevents data corruption
  - Zero equity guard            → skips account, prevents false breaches
  - Balance sanity check         → skips if balance < 10% of starting
  - MT5 recovery on error        → re-initializes MT5 if login fails
  - Thread-local HTTP sessions   → each thread has its own connection
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
#  CONFIG — loaded from .env in the same folder
# ─────────────────────────────────────────────

load_dotenv()

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
API_ENDPOINT = os.environ["API_ENDPOINT"]
API_SECRET   = os.environ["API_SECRET"]

# Only use MT5_PATH if it's actually set to a non-empty value
_raw_mt5_path = os.environ.get("MT5_PATH", "").strip()
MT5_PATH = _raw_mt5_path if _raw_mt5_path else None

# Max parallel workers. MT5 reads are still sequential
# (protected by lock) but API posts run in parallel.
MAX_WORKERS = 4

# MT5 initialize timeout in milliseconds.
# 30 seconds is enough — if MT5 isn't responding in 30s it won't in 120s.
MT5_INIT_TIMEOUT_MS = 30000


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

# Console handler — visible when running manually
_ch = logging.StreamHandler(sys.stdout)
_ch.setFormatter(_fmt)
logger.addHandler(_ch)


# ─────────────────────────────────────────────
#  MT5 LOCK — only one MT5 call at a time
# ─────────────────────────────────────────────

mt5_lock = threading.Lock()


# ─────────────────────────────────────────────
#  THREAD-LOCAL HTTP SESSION
#  Each worker thread gets its own requests.Session
#  Avoids thread-safety issues with shared sessions
# ─────────────────────────────────────────────

_thread_local = threading.local()

def get_http_session() -> requests.Session:
    """Return a per-thread requests.Session, creating it if needed."""
    if not hasattr(_thread_local, "session"):
        s = requests.Session()
        s.headers.update({
            "Content-Type":  "application/json",
            "x-cron-secret": API_SECRET,
        })
        _thread_local.session = s
    return _thread_local.session


# ─────────────────────────────────────────────
#  MARKET HOURS CHECK
# ─────────────────────────────────────────────

def is_market_open() -> bool:
    """
    Returns False on weekends when Exness demo servers are idle.
    Uses UTC time:
      Saturday all day           → closed
      Sunday before 22:00 UTC   → closed
      Monday – Friday            → open
    """
    now = datetime.now(timezone.utc)
    wd  = now.weekday()  # 0=Mon … 6=Sun
    if wd == 5:
        return False
    if wd == 6 and now.hour < 22:
        return False
    return True


# ─────────────────────────────────────────────
#  SUPABASE
# ─────────────────────────────────────────────

def get_supabase() -> Client:
    return create_client(SUPABASE_URL, SUPABASE_KEY)


def fetch_accounts(supabase: Client) -> list[dict]:
    """
    Return active/funded accounts that have investor_password set.
    Accounts without investor_password are silently skipped
    — they can still be manually updated via the admin panel.
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
#  MT5 HELPERS
# ─────────────────────────────────────────────

def _safe_mt5_shutdown() -> None:
    """Shutdown MT5 without raising — safe to call even if not initialized."""
    try:
        mt5.shutdown()
    except Exception:
        pass


def _init_mt5() -> bool:
    """
    Initialize the MT5 terminal.
    Returns True on success, False on failure.
    Logs the error if initialization fails.
    """
    if MT5_PATH:
        ok = mt5.initialize(path=MT5_PATH, timeout=MT5_INIT_TIMEOUT_MS)
    else:
        ok = mt5.initialize(timeout=MT5_INIT_TIMEOUT_MS)

    if not ok:
        err = mt5.last_error()
        code = err[0] if isinstance(err, tuple) else 0
        desc = err[1] if isinstance(err, tuple) else str(err)
        logger.error(f"MT5 init failed ({code}): {desc}")

    return ok


def _recover_mt5() -> bool:
    """
    Called after a failed account read.
    Shuts down MT5 and re-initializes to clear any bad state.
    Returns True if recovery succeeded.
    """
    _safe_mt5_shutdown()
    time.sleep(1)  # Brief pause before re-init
    return _init_mt5()


# ─────────────────────────────────────────────
#  MT5 ACCOUNT READ
# ─────────────────────────────────────────────

def read_account(
    login: str,
    investor_pw: str,
    server: str,
    starting_balance: float = 0,
) -> dict:
    """
    Login to MT5 account with investor password and read live data.

    Returns:
        dict with equity, balance, profit, scalping_violations

    Raises:
        RuntimeError — on any problem (caller logs and skips account)
    """
    # Switch to this account using investor (read-only) password
    login_ok = mt5.login(
        login    = int(login),
        password = investor_pw,
        server   = server,
    )
    if not login_ok:
        err  = mt5.last_error()
        code = err[0] if isinstance(err, tuple) else 0
        desc = err[1] if isinstance(err, tuple) else str(err)
        raise RuntimeError(f"Login to {login} failed ({code}): {desc}")

    # Read account info
    info = mt5.account_info()
    if info is None:
        raise RuntimeError(f"account_info() returned None for {login}")

    # ── Safety 1: verify we're actually on the right account ──────
    if str(info.login) != str(login):
        raise RuntimeError(
            f"Login mismatch: requested {login} "
            f"but MT5 returned {info.login} — "
            f"skipping to prevent data corruption"
        )

    # ── Safety 2: reject zero or negative equity ──────────────────
    if info.equity <= 0:
        raise RuntimeError(
            f"Equity is {info.equity} for {login} — "
            f"bad read, skipping"
        )

    # ── Safety 3: reject suspiciously low balance ─────────────────
    if starting_balance > 0 and info.balance < starting_balance * 0.10:
        raise RuntimeError(
            f"Balance {info.balance} is below 10% of starting "
            f"{starting_balance} for {login} — bad read, skipping"
        )

    # ── Scalping check: look for trades closed in under 3 min ─────
    now   = datetime.now(timezone.utc).replace(tzinfo=None)
    since = now - timedelta(hours=24)
    deals = mt5.history_deals_get(since, now) or []

    # Map position_id → open time for IN deals
    open_times: dict[int, int] = {}
    for d in deals:
        if d.entry == 0:  # DEAL_ENTRY_IN
            open_times[d.position_id] = d.time

    # Find OUT deals that closed within 3 minutes of opening
    scalping: list[dict] = []
    for d in deals:
        if d.entry == 1:  # DEAL_ENTRY_OUT
            ot = open_times.get(d.position_id)
            if ot is not None:
                secs = int(d.time - ot)
                if 0 < secs < 180:
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
        "equity":              round(info.equity,  2),
        "balance":             round(info.balance, 2),
        "profit":              round(info.profit,  2),
        "scalping_violations": scalping,
    }


# ─────────────────────────────────────────────
#  API POST
# ─────────────────────────────────────────────

def post_snapshot(
    account_id: str,
    mt5_login: str,
    equity: float,
    balance: float,
    profit: float,
    scalping_violations: list,
) -> None:
    """
    POST equity data to the FundedNG sync endpoint.
    Uses a per-thread session for thread safety.
    Raises requests.HTTPError on 4xx/5xx responses.
    """
    session = get_http_session()
    payload = {
        "account_id":          account_id,
        "mt5_login":           mt5_login,
        "equity":              equity,
        "balance":             balance,
        "profit":              profit,
        "scalping_violations": scalping_violations,
    }
    resp = session.post(API_ENDPOINT, json=payload, timeout=20)
    if resp.status_code >= 400:
        raise requests.HTTPError(
            f"API {resp.status_code}: {resp.text[:200]}"
        )


# ─────────────────────────────────────────────
#  PROCESS ONE ACCOUNT  (runs in thread pool)
# ─────────────────────────────────────────────

def process_account(acct: dict) -> dict:
    """
    Full pipeline for one trader account:
      1. Acquire MT5 lock (ensures sequential MT5 access)
      2. Login, read equity, check scalping
      3. On error: attempt MT5 recovery so next account isn't affected
      4. Release MT5 lock
      5. POST data to API (runs in parallel with next account's MT5 read)

    Returns a result dict { login, ok, error }.
    """
    login     = str(acct.get("mt5_login", ""))
    acct_id   = str(acct.get("id", ""))
    inv_pw    = str(acct.get("investor_password") or "")
    server    = str(acct.get("mt5_server") or "Exness-MT5Trial9")
    start_bal = float(acct.get("starting_balance") or 0)

    result = {"login": login, "ok": False, "error": ""}

    # Small random jitter so threads don't all slam the lock together
    time.sleep(random.uniform(0, 0.5))

    # ── Step 1 & 2: MT5 read (serialized via lock) ────────────────
    data: dict | None = None
    with mt5_lock:
        try:
            data = read_account(login, inv_pw, server, start_bal)
        except Exception as exc:
            logger.error(f"[{login}] MT5 error: {exc}")
            result["error"] = str(exc)
            # ── BUG FIX: recover MT5 after failed read ────────────
            # Without this, the next account's mt5.login() may fail
            # because MT5 is left in an inconsistent state.
            logger.info(f"[{login}] Recovering MT5 for next account...")
            recovered = _recover_mt5()
            if not recovered:
                logger.warning(
                    "[MT5] Recovery failed — remaining accounts may also fail"
                )
            return result

    # ── Step 3: POST to API (runs while next thread reads MT5) ────
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

    # ── Log ───────────────────────────────────────────────────────
    if violations:
        logger.warning(
            f"[{login}] SCALPING DETECTED — "
            + ", ".join(
                f"{v['symbol']} {v['duration_seconds']}s"
                for v in violations
            )
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

def main() -> None:
    start = time.time()
    logger.info("=" * 50)
    logger.info("Equity Monitor started")

    # Skip runs on weekends — Exness demo servers are idle
    if not is_market_open():
        logger.info("Market closed (weekend) — skipping")
        return

    # Connect to Supabase and fetch accounts
    try:
        supabase = get_supabase()
    except Exception as exc:
        logger.error(f"Supabase failed: {exc}")
        sys.exit(1)

    accounts = fetch_accounts(supabase)
    total    = len(accounts)
    logger.info(f"Fetched {total} account(s)")

    if total == 0:
        logger.info("No accounts to monitor — done")
        return

    # Initialize MT5 once — reused across all account reads via mt5.login()
    logger.info("Initializing MT5...")
    if not _init_mt5():
        # Error already logged in _init_mt5()
        sys.exit(1)
    logger.info("MT5 initialized")

    # Process accounts — MT5 reads sequential, API posts parallel
    succeeded = 0
    failed    = 0
    workers   = min(total, MAX_WORKERS)

    try:
        with ThreadPoolExecutor(max_workers=workers) as pool:
            future_map = {
                pool.submit(process_account, acct): acct
                for acct in accounts
            }
            for future in as_completed(future_map):
                acct = future_map[future]
                try:
                    res = future.result(timeout=60)
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

    elapsed = round(time.time() - start, 1)
    logger.info(f"Done — {succeeded} ok, {failed} failed, {elapsed}s")

    if failed > 0:
        sys.exit(1)


if __name__ == "__main__":
    main()