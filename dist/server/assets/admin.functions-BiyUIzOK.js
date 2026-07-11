import { c as createSsrRpc } from "./kyc.functions-Ddgzg7nS.js";
import { a2 as createServerFn } from "./worker-entry-DS7H0w4O.js";
import { o as objectType, s as stringType, n as numberType, d as booleanType, e as enumType } from "./client.server-B4evwzKW.js";
const AddSocialProofInput = objectType({
  accessToken: stringType().min(1),
  label: stringType().min(1),
  image_url: stringType().url(),
  storage_path: stringType().optional(),
  category: stringType().min(1),
  display_order: numberType().int().min(0)
});
const addSocialProofServer = createServerFn({
  method: "POST"
}).inputValidator((input) => AddSocialProofInput.parse(input)).handler(createSsrRpc("ec9f1207ed3d78a5b0b82f5f62d21f3b5a2a773b4592c884efff1c5b4fc28997"));
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
const requestPayoutServer = createServerFn({
  method: "POST"
}).inputValidator((input) => RequestPayoutInput.parse(input)).handler(createSsrRpc("241fcdae4221a5d948f519a42ea34eb338ac194bcf45021db857c38fbfc462ac"));
const UpdatePayoutInput = objectType({
  accessToken: stringType().min(1),
  payoutId: stringType().uuid(),
  status: enumType(["approved", "paid", "rejected"])
});
createServerFn({
  method: "POST"
}).inputValidator((input) => UpdatePayoutInput.parse(input)).handler(createSsrRpc("26c1ae62ae9bff76e560195e6800be1f00625d0a56d662a2bee4c01ba8931408"));
const ApprovePhase2Input = objectType({
  accessToken: stringType().min(1),
  accountId: stringType().uuid()
});
createServerFn({
  method: "POST"
}).inputValidator((input) => ApprovePhase2Input.parse(input)).handler(createSsrRpc("56ea72c1990f4b1dab7cf114c6ed25b093d89b75696ef372efaecde1cc726670"));
const ApproveFundedInput = objectType({
  accessToken: stringType().min(1),
  accountId: stringType().uuid()
});
createServerFn({
  method: "POST"
}).inputValidator((input) => ApproveFundedInput.parse(input)).handler(createSsrRpc("7703501861b71c3ef8c59f289626420639cdc6a782069c3f61ad13a7efa0573f"));
const MarkBreachedInput = objectType({
  accessToken: stringType().min(1),
  accountId: stringType().uuid(),
  reason: stringType().min(1)
});
createServerFn({
  method: "POST"
}).inputValidator((input) => MarkBreachedInput.parse(input)).handler(createSsrRpc("b126811ba9bc4bec0a9f2ab02c0c579a70e34892d847cb7e81c5cb02e98290fd"));
const UpdateSocialProofInput = objectType({
  accessToken: stringType().min(1),
  id: stringType().uuid(),
  display_order: numberType().int().min(0).optional(),
  is_visible: booleanType().optional()
});
const updateSocialProofServer = createServerFn({
  method: "POST"
}).inputValidator((input) => UpdateSocialProofInput.parse(input)).handler(createSsrRpc("36fcffd2197f1839182024166c9db66bfc07f83f9065b3899025bd9eb19f6a20"));
const DeleteSocialProofInput = objectType({
  accessToken: stringType().min(1),
  id: stringType().uuid(),
  storage_path: stringType().optional()
});
const deleteSocialProofServer = createServerFn({
  method: "POST"
}).inputValidator((input) => DeleteSocialProofInput.parse(input)).handler(createSsrRpc("cc29132cf230fd2efd1298c5be8d93fa7675541df4140eb3472e48cfa703d675"));
export {
  addSocialProofServer as a,
  deleteSocialProofServer as d,
  requestPayoutServer as r,
  updateSocialProofServer as u
};
