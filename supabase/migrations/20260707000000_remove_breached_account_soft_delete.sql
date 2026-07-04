-- Remove auto soft-delete of breached accounts
-- Traders should see their breached accounts as "archived" on their dashboard
-- instead of them being soft-deleted after 5 minutes

-- First, unschedule the old cron job
SELECT cron.unschedule('soft-delete-old-breached-accounts');
SELECT cron.unschedule('delete-old-breached-accounts');

-- Drop the index that filters on deleted_at
DROP INDEX IF EXISTS idx_trader_accounts_active;

-- Drop the column since we no longer use it for breach flow
ALTER TABLE public.trader_accounts DROP COLUMN IF EXISTS deleted_at;
