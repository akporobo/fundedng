import { a3 as TSS_SERVER_FUNCTION, a7 as getServerFnById, a2 as createServerFn } from "./worker-entry-DS7H0w4O.js";
import { o as objectType, s as stringType } from "./client.server-B4evwzKW.js";
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const VerifyInput = objectType({
  userId: stringType().uuid(),
  accountNumber: stringType().regex(/^\d{10}$/, "Account number must be 10 digits"),
  accessToken: stringType().min(1)
});
const verifyKycServer = createServerFn({
  method: "POST"
}).inputValidator((input) => VerifyInput.parse(input)).handler(createSsrRpc("2b5ac38d67a9a5dc132ecccc04caae2c51228d8ff221c63ff0eb2595cbb2819e"));
const VerifyDocumentInput = objectType({
  userId: stringType().uuid(),
  accessToken: stringType().min(1)
});
const verifyKycDocumentServer = createServerFn({
  method: "POST"
}).inputValidator((input) => VerifyDocumentInput.parse(input)).handler(createSsrRpc("c86b11215c93f639aa92a96ebaa2ec7ba6ad2d4b78d2327cc066a3f8bdb3f08f"));
const RejectDocumentInput = objectType({
  userId: stringType().uuid(),
  reason: stringType().max(500),
  accessToken: stringType().min(1)
});
const rejectKycDocumentServer = createServerFn({
  method: "POST"
}).inputValidator((input) => RejectDocumentInput.parse(input)).handler(createSsrRpc("ef23b6026953c18491d44dd93ba9f2d927732a35b64d3124e4ed5c26830407d4"));
const listNigerianBanks = createServerFn({
  method: "GET"
}).handler(createSsrRpc("6ae2fdba5d8be89d4f04a68a6bc15a3115c1b74b732acbc8e1674abb9049532f"));
const ResolveInput = objectType({
  accessToken: stringType().min(1),
  accountNumber: stringType().regex(/^\d{10}$/, "Account number must be 10 digits"),
  bankCode: stringType().min(2).max(10),
  bankName: stringType().min(2).max(120)
});
const verifyKycPaystack = createServerFn({
  method: "POST"
}).inputValidator((input) => ResolveInput.parse(input)).handler(createSsrRpc("04a748c02e387d74c4089c1f8905650598bec97d8a1374350a9e792f7c18e29f"));
export {
  verifyKycDocumentServer as a,
  verifyKycServer as b,
  createSsrRpc as c,
  listNigerianBanks as l,
  rejectKycDocumentServer as r,
  verifyKycPaystack as v
};
