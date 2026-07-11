import { s as supabase } from "./router-DudJYIfW.js";
async function notifyEmail(event) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) return;
    await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`
      },
      body: JSON.stringify({ event })
    });
  } catch (e) {
    console.warn("[notifyEmail] failed", e);
  }
}
export {
  notifyEmail as n
};
