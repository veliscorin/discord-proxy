export default async function handler(req, res) {
  const DISCORD_BASE = "https://discord.com";
  const { path } = req.query;

  const r = await fetch(`${DISCORD_BASE}/${path}`, {
    method: req.method,
    headers: {
      Authorization: req.headers.authorization,
      "User-Agent": req.headers["user-agent"] || "ChannelSorter (https://minandliang.com,1.0)",
      "Content-Type": "application/json",
    },
    body: req.method === "GET" ? null : JSON.stringify(req.body || {}),
  });

  const text = await r.text();
  res.status(r.status).send(text);
}
