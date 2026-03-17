const { GoogleGenerativeAI } = require("@google/generative-ai");

function buildPrompt({ title, genre, character, setting, length }) {
  return (
    `Write a creative ${length} ${genre} story titled '${title}'.\n` +
    `The main character is ${character}.\n` +
    `The story takes place in ${setting}.\n` +
    `Make the story engaging with dialogue and a clear ending.`
  );
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = await readJsonBody(req);
    const { title, genre, character, setting, length } = body || {};

    if (!title || !genre || !character || !setting || !length) {
      return res.status(400).json({
        error: "Missing required fields: title, genre, character, setting, length.",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "Server misconfiguration: GEMINI_API_KEY is not set.",
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = buildPrompt({ title, genre, character, setting, length });
    const result = await model.generateContent(prompt);
    const story = result?.response?.text?.() || "";

    if (!story.trim()) {
      return res.status(502).json({
        error: "Gemini returned an empty response. Please try again.",
      });
    }

    return res.status(200).json({ story });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Failed to generate story. Please try again later.",
    });
  }
};

