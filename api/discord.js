export default async function handler(req, res) {
  const DISCORD_BASE = "https://discord.com";
  const { path, token } = req.query;

  // keep authorization priority: query > header
  const authHeader =
    token ? `Bot ${token}` : req.headers.authorization || req.headers.Authorization;

  if (!authHeader) {
    return res.status(400).json({ error: "Missing bot token" });
  }

  // clone all headers from the request
  const headers = { ...req.headers };
  // enforce correct Authorization and UA
  headers["Authorization"] = authHeader;
  headers["User-Agent"] =
    req.headers["user-agent"] ||
    "ChannelSorter (https://minandliang.com,1.0)";
  headers["Content-Type"] = "application/json";

  try {
    const r = await fetch(`${DISCORD_BASE}/${path}`, {
      method: req.method,
      headers,
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
