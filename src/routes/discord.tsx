import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/discord")({
  component: DiscordRedirect,
  ssr: false,
});

const DISCORD_URL = "https://discord.gg/FXXCGPZ6w3";

function DiscordRedirect() {
  useEffect(() => {
    window.location.replace(DISCORD_URL);
  }, []);

  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content={`0; url=${DISCORD_URL}`} />
        <title>Redirecting...</title>
      </head>
      <body style={{ fontFamily: "sans-serif", textAlign: "center", padding: 40 }}>
        <p>Redirecting to Discord...</p>
        <a href={DISCORD_URL}>Click here if not redirected</a>
      </body>
    </html>
  );
}
