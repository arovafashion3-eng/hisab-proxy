export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-gemini-key, x-grok-key, x-provider");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const provider = req.headers["x-provider"] || "gemini";

  try {
    let response;

    if (provider === "grok") {
      const apiKey = req.headers["x-grok-key"];
      if (!apiKey) return res.status(400).json({ error: "x-grok-key header missing" });
      response = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": Bearer ${apiKey}
        },
        body: JSON.stringify(req.body),
      });
    } else {
      const apiKey = req.headers["x-gemini-key"];
      if (!apiKey) return res.status(400).json({ error: "x-gemini-key header missing" });
      response = await fetch(
        https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey},
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(req.body),
        }
      );
    }

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
