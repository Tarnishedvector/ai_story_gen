const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const storyRoutes = require("./routes/storyRoutes");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/", storyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

