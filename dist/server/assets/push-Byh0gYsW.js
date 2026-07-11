const VAPID_PUBLIC_KEY = "BE4NYIa7gCCmstoLynuae9JmZOxJaN5R-RblTq3oEy9D9CFpRg_R2WYzn9Azdbal00MFyd-eD2uS1HK17anczV8";
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}
function isPreviewOrIframe() {
  try {
    if (window.self !== window.top) return true;
  } catch {
    return true;
  }
  const h = window.location.hostname;
  return h.includes("id-preview--") || h.includes("lovableproject.com") || h.includes("lovable.dev");
}
async function subscribeToPush(userId, supabase) {
  if (typeof window === "undefined") return false;
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return false;
  if (isPreviewOrIframe()) {
    console.warn("[push] Skipping push subscription in preview/iframe context");
    return false;
  }
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return false;
  const registration = await navigator.serviceWorker.ready;
  const sub = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
  });
  const json = sub.toJSON();
  await supabase.from("push_subscriptions").upsert(
    {
      user_id: userId,
      endpoint: json.endpoint,
      p256dh: json.keys.p256dh,
      auth: json.keys.auth,
      user_agent: navigator.userAgent
    },
    { onConflict: "user_id,endpoint" }
  );
  return true;
}
export {
  subscribeToPush as s
};
