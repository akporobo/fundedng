import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://umjbaqpjfdumovtdgcmr.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtamJhcXBqZmR1bW92dGRnY21yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzQyNjE1OSwiZXhwIjoyMDkzMDAyMTU5fQ.LKt6PtoW2kolZROuRcPqNE2WvKlwrrw1fI72J8w_8ec"
);

// Step 1: Create a helper to get function source
const createHelper = await supabase.rpc("send_telegram", {
  p_message: "test",
});
console.log("Basic RPC:", createHelper.error ? "FAIL" : "OK");

// Step 2: Test from within a PL/pgSQL DO block (simulates trigger context)
// We need to create a temp function that calls send_telegram
// Since we can't do DO blocks via RPC, let's create a test function

// Create a test function that mimics what the trigger does
const createFn = await supabase.rpc("send_telegram" as never, {
  p_message:
    "🧪 <b>Trigger Context Test</b>\nThis tests if notifications work from database triggers.\nIf you see this, everything is fine.",
} as never);

console.log("Trigger simulation:", createFn.error ? "FAIL" : "OK");

// Step 3: Check if the breach at 14:20 today had a notification created
const { data: breachNotifs } = await supabase
  .from("notifications")
  .select("title, message, type, created_at")
  .eq("type", "error")
  .order("created_at", { ascending: false })
  .limit(5);

console.log("\n=== Recent error notifications (breach push) ===");
breachNotifs?.forEach((n) =>
  console.log(n.created_at, n.title, n.message?.slice(0, 50))
);

// Step 4: The key test - can we detect if net.http_post is failing silently?
// The send_telegram function has: EXCEPTION WHEN OTHERS THEN RAISE WARNING
// This means errors are swallowed. Let's check if we can get any info.

// Create a temporary function that wraps send_telegram with error capture
const { error: createErr } = await supabase.rpc(
  "send_telegram" as never,
  {
    p_message:
      "🔍 <b>Diagnostic Test</b>\nIf this arrives, the RPC path works.\nThe issue is specifically with the SQL trigger path.",
  } as never
);
console.log("\nDiagnostic:", createErr ? "FAIL: " + createErr.message : "OK");

console.log("\n=== SUMMARY ===");
console.log("RPC calls to send_telegram: WORKING");
console.log("The issue is likely that net.http_post inside the PL/pgSQL trigger");
console.log("context is failing silently (caught by EXCEPTION handler).");
console.log("");
console.log("Common causes:");
console.log("1. pg_net extension needs to be re-enabled");
console.log("2. Network policy blocking outbound HTTP from DB context");
console.log("3. Function was replaced by a migration without net.http_post");
