import { c as createServerRpc } from "./createServerRpc-XR156M8O.js";
import { o as objectType, n as numberType, s as stringType, b as supabaseAdmin, e as enumType, d as booleanType } from "./client.server-B4evwzKW.js";
import { s as sendEventEmail } from "./email.server-Czm4Ciez.js";
import { a2 as createServerFn } from "./worker-entry-DS7H0w4O.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const AddSocialProofInput = objectType({
  accessToken: stringType().min(1),
  label: stringType().min(1),
  image_url: stringType().url(),
  storage_path: stringType().optional(),
  category: stringType().min(1),
  display_order: numberType().int().min(0)
});
const addSocialProofServer_createServerFn_handler = createServerRpc({
  id: "ec9f1207ed3d78a5b0b82f5f62d21f3b5a2a773b4592c884efff1c5b4fc28997",
  name: "addSocialProofServer",
  filename: "src/server/admin.functions.ts"
}, (opts) => addSocialProofServer.__executeServer(opts));
const addSocialProofServer = createServerFn({
  method: "POST"
}).inputValidator((input) => AddSocialProofInput.parse(input)).handler(addSocialProofServer_createServerFn_handler, async ({
  data
}) => {
  try {
    const auth = await assertAdmin(data.accessToken);
    if (!auth.ok) return auth;
    const {
      error: insertError
    } = await supabaseAdmin.from("social_proof_items").insert({
      label: data.label,
      image_url: data.image_url,
      storage_path: data.storage_path ?? null,
      category: data.category,
      display_order: data.display_order
    });
    if (insertError) return {
      ok: false,
      error: insertError.message
    };
    return {
      ok: true
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Add failed";
    console.error("[addSocialProofServer] unexpected", msg);
    return {
      ok: false,
      error: msg
    };
  }
});
async function assertAdmin(token) {
  const {
    data: authData,
    error: authErr
  } = await supabaseAdmin.auth.getUser(token);
  if (authErr || !authData?.user) return {
    ok: false,
    error: "Please sign in again"
  };
  const {
    data: roles
  } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", authData.user.id);
  if (!roles?.some((r) => r.role === "admin")) return {
    ok: false,
    error: "Forbidden: admin role required"
  };
  return {
    ok: true,
    userId: authData.user.id
  };
}
async function assertUser(token) {
  const {
    data: authData,
    error: authErr
  } = await supabaseAdmin.auth.getUser(token);
  if (authErr || !authData?.user) return {
    ok: false,
    error: "Please sign in again"
  };
  return {
    ok: true,
    userId: authData.user.id
  };
}
const RequestPayoutInput = objectType({
  accessToken: stringType().min(1),
  userId: stringType().uuid(),
  traderAccountId: stringType().uuid(),
  amountNaira: numberType().positive(),
  profitPercent: numberType(),
  bankDetails: objectType({
    account_number: stringType(),
    bank_name: stringType(),
    account_name: stringType()
  })
});
const requestPayoutServer_createServerFn_handler = createServerRpc({
  id: "241fcdae4221a5d948f519a42ea34eb338ac194bcf45021db857c38fbfc462ac",
  name: "requestPayoutServer",
  filename: "src/server/admin.functions.ts"
}, (opts) => requestPayoutServer.__executeServer(opts));
const requestPayoutServer = createServerFn({
  method: "POST"
}).inputValidator((input) => RequestPayoutInput.parse(input)).handler(requestPayoutServer_createServerFn_handler, async ({
  data
}) => {
  try {
    const auth = await assertUser(data.accessToken);
    if (!auth.ok) return auth;
    if (auth.userId !== data.userId) return {
      ok: false,
      error: "Unauthorized"
    };
    const {
      data: payoutInsert,
      error: insertErr
    } = await supabaseAdmin.from("payouts").insert({
      user_id: data.userId,
      trader_account_id: data.traderAccountId,
      amount_naira: data.amountNaira,
      profit_percent: data.profitPercent,
      payment_method: "bank_transfer",
      wallet_address: null,
      bank_details: data.bankDetails
    }).select("id").single();
    if (insertErr || !payoutInsert) return {
      ok: false,
      error: insertErr?.message ?? "Insert failed"
    };
    await sendEventEmail({
      type: "payout_requested",
      payoutId: payoutInsert.id
    }).catch((e) => console.error("[requestPayoutServer] email send failed", e));
    return {
      ok: true,
      payoutId: payoutInsert.id
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Request failed";
    console.error("[requestPayoutServer] unexpected", msg);
    return {
      ok: false,
      error: msg
    };
  }
});
const UpdatePayoutInput = objectType({
  accessToken: stringType().min(1),
  payoutId: stringType().uuid(),
  status: enumType(["approved", "paid", "rejected"])
});
const updatePayoutServer_createServerFn_handler = createServerRpc({
  id: "26c1ae62ae9bff76e560195e6800be1f00625d0a56d662a2bee4c01ba8931408",
  name: "updatePayoutServer",
  filename: "src/server/admin.functions.ts"
}, (opts) => updatePayoutServer.__executeServer(opts));
const updatePayoutServer = createServerFn({
  method: "POST"
}).inputValidator((input) => UpdatePayoutInput.parse(input)).handler(updatePayoutServer_createServerFn_handler, async ({
  data
}) => {
  try {
    const auth = await assertAdmin(data.accessToken);
    if (!auth.ok) return auth;
    const {
      error
    } = await supabaseAdmin.from("payouts").update({
      status: data.status,
      processed_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", data.payoutId);
    if (error) return {
      ok: false,
      error: error.message
    };
    if (data.status === "approved") {
      await sendEventEmail({
        type: "payout_approved",
        payoutId: data.payoutId
      }).catch((e) => console.error("[updatePayoutServer] payout_approved email failed", e));
    } else if (data.status === "paid") {
      const {
        data: payout
      } = await supabaseAdmin.from("payouts").select("trader_account_id").eq("id", data.payoutId).maybeSingle();
      if (payout?.trader_account_id) {
        const {
          data: account
        } = await supabaseAdmin.from("trader_accounts").select("id, starting_balance").eq("id", payout.trader_account_id).maybeSingle();
        if (account) {
          await supabaseAdmin.from("trader_accounts").update({
            current_equity: account.starting_balance,
            peak_equity: account.starting_balance,
            daily_peak_equity: account.starting_balance,
            daily_peak_date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
            trading_days: 0
          }).eq("id", account.id);
          await supabaseAdmin.from("account_snapshots").insert({
            trader_account_id: account.id,
            equity: account.starting_balance,
            balance: account.starting_balance,
            profit: 0,
            drawdown_percent: 0,
            snapshot_time: (/* @__PURE__ */ new Date()).toISOString()
          });
        }
      }
      await sendEventEmail({
        type: "payout_paid",
        payoutId: data.payoutId
      }).catch((e) => console.error("[updatePayoutServer] payout_paid email failed", e));
    } else if (data.status === "rejected") {
      await sendEventEmail({
        type: "payout_rejected",
        payoutId: data.payoutId,
        reason: "Rejected by admin."
      }).catch((e) => console.error("[updatePayoutServer] payout_rejected email failed", e));
    }
    return {
      ok: true
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Update failed";
    console.error("[updatePayoutServer] unexpected", msg);
    return {
      ok: false,
      error: msg
    };
  }
});
const ApprovePhase2Input = objectType({
  accessToken: stringType().min(1),
  accountId: stringType().uuid()
});
const approvePhase2Server_createServerFn_handler = createServerRpc({
  id: "56ea72c1990f4b1dab7cf114c6ed25b093d89b75696ef372efaecde1cc726670",
  name: "approvePhase2Server",
  filename: "src/server/admin.functions.ts"
}, (opts) => approvePhase2Server.__executeServer(opts));
const approvePhase2Server = createServerFn({
  method: "POST"
}).inputValidator((input) => ApprovePhase2Input.parse(input)).handler(approvePhase2Server_createServerFn_handler, async ({
  data
}) => {
  try {
    const auth = await assertAdmin(data.accessToken);
    if (!auth.ok) return auth;
    const {
      data: acc
    } = await supabaseAdmin.from("trader_accounts").select("user_id, starting_balance").eq("id", data.accountId).maybeSingle();
    if (!acc) return {
      ok: false,
      error: "Account not found"
    };
    if (acc.current_phase >= 2) return {
      ok: false,
      error: "Already in Phase 2 or beyond"
    };
    const startingBalance = acc.starting_balance;
    const {
      error: updateErr
    } = await supabaseAdmin.from("trader_accounts").update({
      current_phase: 2,
      current_equity: startingBalance,
      peak_equity: startingBalance,
      daily_peak_equity: startingBalance,
      daily_peak_date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      phase1_passed_at: (/* @__PURE__ */ new Date()).toISOString(),
      phase2_requested_at: null,
      status: "active",
      trading_days: 0
    }).eq("id", data.accountId);
    if (updateErr) return {
      ok: false,
      error: updateErr.message
    };
    await supabaseAdmin.from("account_snapshots").insert({
      trader_account_id: data.accountId,
      equity: startingBalance,
      balance: startingBalance,
      profit: 0,
      drawdown_percent: 0
    });
    await supabaseAdmin.from("notifications").insert({
      user_id: acc.user_id,
      title: "🎯 Phase 1 Passed",
      message: "Congratulations — you're now in Phase 2. Your equity has been reset to the starting balance.",
      type: "success"
    });
    await sendEventEmail({
      type: "phase1_passed",
      accountId: data.accountId
    }).catch((e) => console.error("[approvePhase2Server] email send failed", e));
    return {
      ok: true
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Approval failed";
    console.error("[approvePhase2Server] unexpected", msg);
    return {
      ok: false,
      error: msg
    };
  }
});
const ApproveFundedInput = objectType({
  accessToken: stringType().min(1),
  accountId: stringType().uuid()
});
const approveFundedServer_createServerFn_handler = createServerRpc({
  id: "7703501861b71c3ef8c59f289626420639cdc6a782069c3f61ad13a7efa0573f",
  name: "approveFundedServer",
  filename: "src/server/admin.functions.ts"
}, (opts) => approveFundedServer.__executeServer(opts));
const approveFundedServer = createServerFn({
  method: "POST"
}).inputValidator((input) => ApproveFundedInput.parse(input)).handler(approveFundedServer_createServerFn_handler, async ({
  data
}) => {
  try {
    const auth = await assertAdmin(data.accessToken);
    if (!auth.ok) return auth;
    const {
      data: acc
    } = await supabaseAdmin.from("trader_accounts").select("user_id, starting_balance, status").eq("id", data.accountId).maybeSingle();
    if (!acc) return {
      ok: false,
      error: "Account not found"
    };
    if (acc.status === "funded") return {
      ok: false,
      error: "Already funded"
    };
    const startingBalance = acc.starting_balance;
    const {
      error: updateErr
    } = await supabaseAdmin.from("trader_accounts").update({
      status: "funded",
      current_equity: startingBalance,
      peak_equity: startingBalance,
      daily_peak_equity: startingBalance,
      daily_peak_date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      phase2_passed_at: (/* @__PURE__ */ new Date()).toISOString(),
      funded_at: (/* @__PURE__ */ new Date()).toISOString(),
      funded_requested_at: null,
      trading_days: 0
    }).eq("id", data.accountId);
    if (updateErr) return {
      ok: false,
      error: updateErr.message
    };
    await supabaseAdmin.from("account_snapshots").insert({
      trader_account_id: data.accountId,
      equity: startingBalance,
      balance: startingBalance,
      profit: 0,
      drawdown_percent: 0
    });
    await supabaseAdmin.from("notifications").insert({
      user_id: acc.user_id,
      title: "🏆 You're Funded!",
      message: "Congratulations — your account is now funded. Equity has been reset to the starting balance. Start trading and request payouts.",
      type: "success"
    });
    await sendEventEmail({
      type: "funded",
      accountId: data.accountId
    }).catch((e) => console.error("[approveFundedServer] email send failed", e));
    return {
      ok: true
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Approval failed";
    console.error("[approveFundedServer] unexpected", msg);
    return {
      ok: false,
      error: msg
    };
  }
});
const MarkBreachedInput = objectType({
  accessToken: stringType().min(1),
  accountId: stringType().uuid(),
  reason: stringType().min(1)
});
const markBreachedServer_createServerFn_handler = createServerRpc({
  id: "b126811ba9bc4bec0a9f2ab02c0c579a70e34892d847cb7e81c5cb02e98290fd",
  name: "markBreachedServer",
  filename: "src/server/admin.functions.ts"
}, (opts) => markBreachedServer.__executeServer(opts));
const markBreachedServer = createServerFn({
  method: "POST"
}).inputValidator((input) => MarkBreachedInput.parse(input)).handler(markBreachedServer_createServerFn_handler, async ({
  data
}) => {
  try {
    const auth = await assertAdmin(data.accessToken);
    if (!auth.ok) return auth;
    const {
      error
    } = await supabaseAdmin.from("trader_accounts").update({
      status: "breached",
      breach_reason: data.reason.trim()
    }).eq("id", data.accountId);
    if (error) return {
      ok: false,
      error: error.message
    };
    await sendEventEmail({
      type: "breached",
      accountId: data.accountId,
      reason: data.reason.trim()
    }).catch((e) => console.error("[markBreachedServer] email send failed", e));
    return {
      ok: true
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Breach failed";
    console.error("[markBreachedServer] unexpected", msg);
    return {
      ok: false,
      error: msg
    };
  }
});
const UpdateSocialProofInput = objectType({
  accessToken: stringType().min(1),
  id: stringType().uuid(),
  display_order: numberType().int().min(0).optional(),
  is_visible: booleanType().optional()
});
const updateSocialProofServer_createServerFn_handler = createServerRpc({
  id: "36fcffd2197f1839182024166c9db66bfc07f83f9065b3899025bd9eb19f6a20",
  name: "updateSocialProofServer",
  filename: "src/server/admin.functions.ts"
}, (opts) => updateSocialProofServer.__executeServer(opts));
const updateSocialProofServer = createServerFn({
  method: "POST"
}).inputValidator((input) => UpdateSocialProofInput.parse(input)).handler(updateSocialProofServer_createServerFn_handler, async ({
  data
}) => {
  try {
    const auth = await assertAdmin(data.accessToken);
    if (!auth.ok) return auth;
    const updates = {};
    if (data.display_order !== void 0) updates.display_order = data.display_order;
    if (data.is_visible !== void 0) updates.is_visible = data.is_visible;
    if (Object.keys(updates).length === 0) return {
      ok: false,
      error: "No fields to update"
    };
    const {
      error
    } = await supabaseAdmin.from("social_proof_items").update(updates).eq("id", data.id);
    if (error) return {
      ok: false,
      error: error.message
    };
    return {
      ok: true
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Update failed";
    console.error("[updateSocialProofServer] unexpected", msg);
    return {
      ok: false,
      error: msg
    };
  }
});
const DeleteSocialProofInput = objectType({
  accessToken: stringType().min(1),
  id: stringType().uuid(),
  storage_path: stringType().optional()
});
const deleteSocialProofServer_createServerFn_handler = createServerRpc({
  id: "cc29132cf230fd2efd1298c5be8d93fa7675541df4140eb3472e48cfa703d675",
  name: "deleteSocialProofServer",
  filename: "src/server/admin.functions.ts"
}, (opts) => deleteSocialProofServer.__executeServer(opts));
const deleteSocialProofServer = createServerFn({
  method: "POST"
}).inputValidator((input) => DeleteSocialProofInput.parse(input)).handler(deleteSocialProofServer_createServerFn_handler, async ({
  data
}) => {
  try {
    const auth = await assertAdmin(data.accessToken);
    if (!auth.ok) return auth;
    if (data.storage_path) {
      await supabaseAdmin.storage.from("social-proof").remove([data.storage_path]);
    }
    const {
      error
    } = await supabaseAdmin.from("social_proof_items").delete().eq("id", data.id);
    if (error) return {
      ok: false,
      error: error.message
    };
    return {
      ok: true
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Delete failed";
    console.error("[deleteSocialProofServer] unexpected", msg);
    return {
      ok: false,
      error: msg
    };
  }
});
export {
  addSocialProofServer_createServerFn_handler,
  approveFundedServer_createServerFn_handler,
  approvePhase2Server_createServerFn_handler,
  deleteSocialProofServer_createServerFn_handler,
  markBreachedServer_createServerFn_handler,
  requestPayoutServer_createServerFn_handler,
  updatePayoutServer_createServerFn_handler,
  updateSocialProofServer_createServerFn_handler
};
