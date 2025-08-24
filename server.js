// server.js  — Node 18+
// npm i express cors dotenv
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.static("public")); // sirve index.html desde /public

// ---------- OpenAI (ChatGPT) ----------
app.post("/api/openai", async (req, res) => {
  try {
    const { messages = [] } = req.body || {};
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages,
      }),
    });
    if (!r.ok) return res.status(r.status).send(await r.text());
    const data = await r.json();
    const answer = data?.choices?.[0]?.message?.content ?? "";
    res.json({ answer });
  } catch (e) {
    res.status(500).send(String(e));
  }
});

// ---------- Google Gemini ----------
app.post("/api/gemini", async (req, res) => {
  try {
    const { messages = [] } = req.body || {};
    const contents = messages.map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: String(m.content || "") }],
    }));
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL || "gemini-1.5-flash"}:generateContent?key=${process.env.GOOGLE_API_KEY}`;
    const r = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents }),
    });
    if (!r.ok) return res.status(r.status).send(await r.text());
    const data = await r.json();
    const parts = data?.candidates?.[0]?.content?.parts || [];
    const answer = parts.map(p => p.text || "").join("\n");
    res.json({ answer });
  } catch (e) {
    res.status(500).send(String(e));
  }
});

// ---------- xAI Grok ----------
app.post("/api/grok", async (req, res) => {
  try {
    const { messages = [] } = req.body || {};
    const r = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.XAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.GROK_MODEL || "grok-2",
        messages,
      }),
    });
    if (!r.ok) return res.status(r.status).send(await r.text());
    const data = await r.json();
    const answer = data?.choices?.[0]?.message?.content ?? "";
    res.json({ answer });
  } catch (e) {
    res.status(500).send(String(e));
  }
});

// ---------- Copilot (*vía Azure OpenAI opcional) ----------
app.post("/api/copilot", async (req, res) => {
  try {
    const { AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_API_KEY, AZURE_OPENAI_DEPLOYMENT } = process.env;
    if (!AZURE_OPENAI_ENDPOINT || !AZURE_OPENAI_API_KEY || !AZURE_OPENAI_DEPLOYMENT) {
      return res.status(501).json({ answer: "Copilot no tiene API pública. Configurá Azure OpenAI en .env para habilitar esta columna." });
    }
    const { messages = [] } = req.body || {};
    const version = process.env.AZURE_OPENAI_API_VERSION || "2024-08-01-preview";
    const url = `${AZURE_OPENAI_ENDPOINT}/openai/deployments/${AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=${version}`;
    const r = await fetch(url, {
      method: "POST",
      headers: {
        "api-key": AZURE_OPENAI_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });
    if (!r.ok) return res.status(r.status).send(await r.text());
    const data = await r.json();
    const answer = data?.choices?.[0]?.message?.content ?? "";
    res.json({ answer });
  } catch (e) {
    res.status(500).send(String(e));
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`QuadBoard listo en http://localhost:${PORT}`));
