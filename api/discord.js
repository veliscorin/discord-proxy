export default async function handler(req, res) {
  const DISCORD_BASE = "https://discord.com";
  const { path, token } = req.query; // token passed in query

  const auth = token ? `Bot ${token}` : req.headers.authorization;
  const ua =
    req.headers["user-agent"] ||
    "ChannelSorter (https://minandliang.com,1.0)";

  if (!auth) {
    return res.status(400).json({ error: "Missing bot token" });
  }

  try {
    const r = await fetch(`${DISCORD_BASE}/${path}`, {
      method: req.method,
      headers: {
        Authorization: auth,
        "User-Agent": ua,
        "Content-Type": "application/json",
      },
      body:
        req.method === "GET" || req.method === "HEAD"
          ? null
          : JSON.stringify(req.body || {}),
    });

    const text = await r.text();
    res.status(r.status).send(text);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Proxy failed", details: err.message });
  }
}
