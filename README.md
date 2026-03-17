# AI Story Generator (Gemini)

Full‑stack web app that generates stories using the **Gemini API** (model: **`gemini-1.5-flash`**).

## Project structure

```
ai-story-generator/
  frontend/
    src/
      components/
        StoryForm.jsx
        StoryDisplay.jsx
      main.jsx
      App.jsx
  backend/
    server.js
    routes/
      storyRoutes.js
```

## Prerequisites

- Node.js (recommended: 18+)
- A Gemini API key (Google AI Studio)

## Setup (local dev)

### 1) Backend

```bash
cd backend
copy .env.example .env
```

Edit `backend/.env` and set:

- `GEMINI_API_KEY=...`

Install and run:

```bash
npm install
npm run dev
```

Backend runs on `http://localhost:5000`.

### 2) Frontend

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Notes

- The frontend calls `POST /generate-story` on the backend.
- If your backend runs somewhere else, set `VITE_API_BASE` in `frontend/.env`.

## Deploy to Vercel

This repo is ready to deploy on Vercel as a single project:

- **Frontend**: `frontend/` (Vite)
- **API**: `api/generate-story.js` (Vercel Serverless Function)

### Vercel settings

- **Framework preset**: Vite
- **Root directory**: `frontend`

### Environment variables (Vercel)

Set this in your Vercel Project → Settings → Environment Variables:

- `GEMINI_API_KEY`: your Gemini API key

After deploying, the frontend will call the API at **`/api/generate-story`** automatically.

