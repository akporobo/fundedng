/**
 * Paystack PUBLIC (publishable) key — safe to ship in the browser bundle.
 *
 * This key only identifies your merchant account. It cannot move money,
 * issue refunds, or access customer data on its own. The actual security
 * lives server-side with PAYSTACK_SECRET_KEY (used in
 * src/routes/api.verify-payment.ts) which re-verifies every transaction
 * with Paystack before any account is delivered.
 *
 * To go LIVE:
 *   1. Replace `pk_test_...` below with your `pk_live_...` from the
 *      Paystack dashboard → Settings → API Keys & Webhooks.
 *   2. Update the PAYSTACK_SECRET_KEY runtime secret to your `sk_live_...`.
 *   3. Publish → Update.
 */
export const PAYSTACK_PUBLIC_KEY =
  "pk_test_64d51d8df21c9b1efd78c0651a1be0b6804a7b72";
