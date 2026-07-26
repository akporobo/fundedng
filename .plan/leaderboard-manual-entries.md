# Plan: Manual Leaderboard Entries + "Your Position" Feature

## Context
The leaderboard page (`/leaderboard`) currently shows a Top 10 from the `leaderboard_cache` table (auto-computed from real trading data). The user wants admins to **manually add leaderboard entries** (trader name, profit %, amount, total profit) — similar to how they can manually log activity in `admin/social`. Additionally, logged-in traders not in the top 10 should see **their own position and stats** at the bottom of the leaderboard.

## Changes

### 1. New DB table: `manual_leaderboard`
**File:** `supabase/migrations/20260726000000_add_manual_leaderboard.sql`

```sql
CREATE TABLE IF NOT EXISTS public.manual_leaderboard (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trader_name text NOT NULL,
  avatar_initials text NOT NULL,
  challenge_name text NOT NULL DEFAULT 'Standard',
  profit_percent numeric NOT NULL DEFAULT 0,
  profit_amount numeric NOT NULL DEFAULT 0,
  total_profit numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'NGN',
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
-- RLS: public read, service role manage
-- Realtime enabled
```

### 2. Server function: `addManualLeaderboardServer` + `deleteManualLeaderboardServer`
**File:** `src/server/admin.functions.ts`

Add two new server functions at the end of the file:
- `addManualLeaderboardServer` — admin-only, inserts into `manual_leaderboard`
- `deleteManualLeaderboardServer` — admin-only, deletes from `manual_leaderboard`

Input schema: `{ accessToken, traderName, challengeName, profitPercent, profitAmount, totalProfit }`

### 3. Admin form in `admin/social.tsx`
**File:** `src/routes/_admin/admin.social.tsx`

Add a new section "Manual Leaderboard Entries" with:
- Form fields: Trader Name, Challenge Name, Profit %, Profit Amount (₦), Total Profit (₦)
- "Add to Leaderboard" button
- Table showing all manual leaderboard entries with delete buttons

### 4. Leaderboard page: merge manual entries + "Your Position"
**File:** `src/routes/leaderboard.tsx`

**Merge:** Fetch from both `leaderboard_cache` (top 10) and `manual_leaderboard`, combine into a single sorted list by profit, show top 10.

**Your Position:** For logged-in users:
- Query `leaderboard_cache` for the user's entry (by `user_id`)
- Count how many entries in the combined list rank higher
- Display a card at the bottom showing: position number, name, challenge, profit %, amount, total profit

## Files to modify
1. `supabase/migrations/20260726000000_add_manual_leaderboard.sql` (new)
2. `src/server/admin.functions.ts` (add 2 functions)
3. `src/routes/_admin/admin.social.tsx` (add form + table)
4. `src/routes/leaderboard.tsx` (merge data + your position card)

## Verification
1. Run `npm run typecheck` to ensure no type errors
2. Check the admin form renders and can submit
3. Check the leaderboard merges manual + automatic entries
4. Check "Your Position" card appears for logged-in users not in top 10
