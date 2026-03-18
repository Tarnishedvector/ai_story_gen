const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { db } = require("../db/index.js");
const { stories } = require("../db/schema.js");
const { desc, eq } = require("drizzle-orm");
const auth = require("../middleware/auth.js");

const router = express.Router();

function buildPrompt({ title, genre, character, setting, length }) {
  return `Write a creative ${length} ${genre} story titled '${title}'.\n` +
    `The main character is ${character}.\n` +
    `The story takes place in ${setting}.\n` +
    `Make the story engaging with dialogue and a clear ending.`;
}

router.post("/generate-story", auth, async (req, res) => {
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
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = buildPrompt({ title, genre, character, setting, length });

    const result = await model.generateContent(prompt);
    const story = result?.response?.text?.() || "";

    if (!story.trim()) {
      return res.status(502).json({
        error: "Gemini returned an empty response. Please try again.",
      });
    }

    // Save properly generated story to DB
    try {
      // Create a unique ID or let Drizzle/Postgres handle it. Actually our schema requires text id. Let's install uuid or generate simple random.
      // Wait, let's use a simple ID generator since uuid is not installed, or just default crypto.
      const id = require("crypto").randomUUID();
      await db.insert(stories).values({
        id,
        userId: req.user.id,
        title,
        genre,
        character,
        setting,
        length,
        content: story
      });
    } catch (saveError) {
      console.error("Failed to save story to Neon DB", saveError);
      // We can still return the generated story even if saving fails.
    }

    return res.json({ story });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Failed to generate story. Please try again later.",
    });
  }
});

// Added GET /stories endpoint to list all stories
router.get("/stories", auth, async (req, res) => {
  try {
    const allStories = await db.select().from(stories).where(eq(stories.userId, req.user.id)).orderBy(desc(stories.createdAt));
    return res.json({ stories: allStories });
  } catch (err) {
    console.error("Failed to list stories", err);
    return res.status(500).json({
      error: "Failed to list stories.",
    });
  }
});

module.exports = router;

