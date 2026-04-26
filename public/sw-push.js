// Push event handler — shown when the page is closed/backgrounded.
self.addEventListener("push", (event) => {
  if (!event.data) return;
  let data = {};
  try { data = event.data.json(); } catch { data = { title: "FundedNG", body: event.data.text() }; }
  const title = data.title || "FundedNG";
  const options = {
    body: data.body || "",
    icon: "/favicon.png",
    badge: "/favicon-32.png",
    data: { url: data.url || "/dashboard" },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((wins) => {
      for (const c of wins) {
        if ("focus" in c) return c.focus();
      }
      return clients.openWindow(url);
    }),
  );
});