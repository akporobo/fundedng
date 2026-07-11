import { c as createServerRpc } from "./createServerRpc-XR156M8O.js";
import { o as objectType, f as arrayType, s as stringType, b as supabaseAdmin } from "./client.server-B4evwzKW.js";
import { a2 as createServerFn } from "./worker-entry-DS7H0w4O.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
async function assertPartner(token) {
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
  if (!roles?.some((r) => r.role === "partner")) return {
    ok: false,
    error: "Forbidden: partner role required"
  };
  return {
    ok: true,
    userId: authData.user.id
  };
}
const GetBuyerInfoInput = objectType({
  accessToken: stringType().min(1),
  userIds: arrayType(stringType().uuid())
});
const getBuyerInfo_createServerFn_handler = createServerRpc({
  id: "ad940f6248f636634e2ce234c17324e050727e8ce4bcf815feab5a83707835ae",
  name: "getBuyerInfo",
  filename: "src/server/partner.functions.ts"
}, (opts) => getBuyerInfo.__executeServer(opts));
const getBuyerInfo = createServerFn({
  method: "POST"
}).inputValidator((input) => GetBuyerInfoInput.parse(input)).handler(getBuyerInfo_createServerFn_handler, async ({
  data
}) => {
  try {
    const auth = await assertPartner(data.accessToken);
    if (!auth.ok) return auth;
    const emails = {};
    const names = {};
    await Promise.all(data.userIds.map(async (uid) => {
      const {
        data: userData
      } = await supabaseAdmin.auth.admin.getUserById(uid);
      if (userData?.user?.email) emails[uid] = userData.user.email;
    }));
    const {
      data: profiles
    } = await supabaseAdmin.from("profiles").select("id, full_name").in("id", data.userIds);
    if (profiles) {
      for (const p of profiles) {
        names[p.id] = p.full_name;
      }
    }
    return {
      ok: true,
      emails,
      names
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to fetch buyer info";
    return {
      ok: false,
      error: msg
    };
  }
});
export {
  getBuyerInfo_createServerFn_handler
};
