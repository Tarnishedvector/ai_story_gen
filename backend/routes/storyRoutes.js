const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();

function buildPrompt({ title, genre, character, setting, length }) {
  return `Write a creative ${length} ${genre} story titled '${title}'.\n` +
    `The main character is ${character}.\n` +
    `The story takes place in ${setting}.\n` +
    `Make the story engaging with dialogue and a clear ending.`;
}

router.post("/generate-story", async (req, res) => {
  try {
    const { title, genre, character, setting, length } = req.body || {};

    // Minimal validation to keep API errors clear for the frontend.
    if (!title || !genre || !character || !setting || !length) {
      return res.status(400).json({
        error:
          "Missing required fields: title, genre, character, setting, length.",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error:
          "Server misconfiguration: GEMINI_API_KEY is not set in the environment.",
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

    return res.json({ story });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Failed to generate story. Please try again later.",
    });
  }
});

module.exports = router;

