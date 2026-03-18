const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { db } = require("../db/index.js");
const { users } = require("../db/schema.js");
const { eq } = require("drizzle-orm");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required." });
    }

    const existingUser = await db.select().from(users).where(eq(users.username, username)).limit(1);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "Username already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const id = crypto.randomUUID();
    await db.insert(users).values({
      id,
      username,
      passwordHash
    });

    const token = jwt.sign({ id, username }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.status(201).json({ token, user: { id, username } });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ error: "Failed to register user." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required." });
    }

    const userList = await db.select().from(users).where(eq(users.username, username)).limit(1);
    if (userList.length === 0) {
      return res.status(400).json({ error: "Invalid username or password." });
    }

    const user = userList[0];
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid username or password." });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.json({ token, user: { id: user.id, username: user.username } });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Failed to login user." });
  }
});

module.exports = router;
