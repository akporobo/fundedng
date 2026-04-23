import { supabaseAdmin } from "@/integrations/supabase/client.server";

const PROVISIONING_BASE = "https://mt-provisioning-api-v1.agiliumtrade.agiliumtrade.ai";
const CLIENT_API_BASE = "https://mt-client-api-v1.new-york.agiliumtrade.ai";
const ACCOUNT_INFO_BASE = "https://metaapi-v1.new-york.agiliumtrade.ai";

// Exness demo defaults via custom MetaApi provisioning profile.
const PRIMARY_SERVER = "Exness-MT5Trial3";
const FALLBACK_SERVER = "Exness-MT5Trial9";
const DEFAULT_LEVERAGE = 200;

function token(): string {
  const t = process.env.METAAPI_TOKEN;
  if (!t) throw new Error("METAAPI_TOKEN env var is not set");
  return t;
}

function profileId(): string {
  const p = process.env.METAAPI_PROFILE_ID;
  if (!p) throw new Error("METAAPI_PROFILE_ID env var is not set");
  return p;
}

function randomTransactionId(): string {
  return Array.from({ length: 32 }, () =>
    "abcdef0123456789"[Math.floor(Math.random() * 16)],
  ).join("");
}

export interface MetaApiCreateInput {
  email: string;
  name: string;
  phone: string;
  balance: number;
  leverage?: number;
  serverName?: string;
  keywords?: string[];
  accountType?: string;
}

export interface MetaApiCreateResult {
  login: string;
  password: string;
  investorPassword: string;
  serverName: string;
}

/**
 * Create an MT5 demo account via MetaApi provisioning REST API.
 * Uses provisioning profile "default" so the broker is selected by serverName/keywords.
 */
export async function createMt5DemoAccount(
  input: MetaApiCreateInput,
): Promise<MetaApiCreateResult> {
  const body = {
    accountType: input.accountType ?? DEFAULT_ACCOUNT_TYPE,
    balance: input.balance,
    email: input.email,
    leverage: input.leverage ?? DEFAULT_LEVERAGE,
    name: input.name,
    phone: input.phone || "+2348000000000",
    serverName: input.serverName ?? DEFAULT_SERVER,
    keywords: input.keywords ?? DEFAULT_KEYWORDS,
  };

  const url = `${PROVISIONING_BASE}/users/current/provisioning-profiles/default/mt5-demo-accounts`;

  // 202 polling: reuse same transaction-id until terminal status.
  const txId = randomTransactionId();
  const maxAttempts = 12;
  const delayMs = 2500;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "auth-token": token(),
        "transaction-id": txId,
      },
      body: JSON.stringify(body),
    });

    if (res.status === 201) {
      const data = (await res.json()) as MetaApiCreateResult;
      return data;
    }
    if (res.status === 202) {
      // Provisioning still in progress; wait and retry with same tx id.
      await new Promise((r) => setTimeout(r, delayMs));
      continue;
    }
    const text = await res.text();
    throw new Error(`MetaApi provisioning ${res.status}: ${text}`);
  }
  throw new Error("MetaApi provisioning timed out (still pending after 30s)");
}

/**
 * Deploy a MetaApi cloud account so the client API can stream/read its state.
 * Required after provisioning so we can later fetch equity. Returns metaapi account id.
 */
export async function deployMetaApiAccount(args: {
  login: string;
  password: string;
  serverName: string;
  name: string;
}): Promise<string | null> {
  // Add account to MetaApi cloud
  const res = await fetch(
    `${CLIENT_API_BASE.replace("mt-client-api-v1", "mt-provisioning-api-v1")}/users/current/accounts`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "auth-token": token(),
      },
      body: JSON.stringify({
        login: args.login,
        password: args.password,
        name: args.name,
        server: args.serverName,
        platform: "mt5",
        magic: 0,
        application: "MetaApi",
        type: "cloud-g1",
        region: "new-york",
        reliability: "regular",
      }),
    },
  );
  if (!res.ok) {
    // Soft-fail: account is already created, polling will just be unavailable until admin retries.
    console.error("[metaapi] deploy failed", res.status, await res.text());
    return null;
  }
  const data = (await res.json()) as { id?: string };
  return data.id ?? null;
}

/**
 * Fetch live equity/balance for a deployed MetaApi account.
 * Returns null if not deployed yet or account is unreachable.
 */
export async function fetchAccountInformation(metaapiAccountId: string): Promise<{
  equity: number;
  balance: number;
} | null> {
  const res = await fetch(
    `${CLIENT_API_BASE}/users/current/accounts/${metaapiAccountId}/account-information`,
    {
      headers: {
        "auth-token": token(),
        Accept: "application/json",
      },
    },
  );
  if (!res.ok) {
    console.error("[metaapi] account-information failed", metaapiAccountId, res.status);
    return null;
  }
  const data = (await res.json()) as { equity?: number; balance?: number };
  if (typeof data.equity !== "number" || typeof data.balance !== "number") return null;
  return { equity: data.equity, balance: data.balance };
}

/**
 * Resolve the email for a user via auth admin API.
 */
export async function getUserEmail(userId: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);
  if (error || !data?.user?.email) return null;
  return data.user.email;
}