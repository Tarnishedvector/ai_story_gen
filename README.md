# AI Story Generator

**Live Demo:** [https://ai-story-gen-frontend.vercel.app/](https://ai-story-gen-frontend.vercel.app/)

Full‑stack web app that generates stories using **Groq** (model: **`llama-3.3-70b-versatile`**).

### Why Groq?
Groq was chosen for this project because of its **blazing fast inference speed** and **ultra-low latency**. When generating long-form content like stories, traditional LLM APIs can take several seconds to respond, which impacts user engagement. Groq's uniquely optimized LPU (Language Processing Unit) architecture allows us to generate entire stories almost instantly, resulting in a much more responsive and seamless user experience.

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
- A Groq API key (from [GroqCloud](https://console.groq.com/))

## Setup (local dev)

### 1) Backend

```bash
cd backend
copy .env.example .env
```

Edit `backend/.env` and set:

- `GROQ_API_KEY=...`

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

- `GROQ_API_KEY`: your Groq API key

After deploying, the frontend will call the API at **`/api/generate-story`** automatically.

### Note on Gemini Migration

This project was originally built using the **Google Gemini API** (`gemini-1.5-flash`). However, it was rewritten to use Groq because Gemini's generation latency would occasionally exceed the strict execution time limits of Vercel Serverless Functions on the free tier (resulting in 504 Gateway Timeout errors). Migrating to Groq's high-speed inference completely eliminates these timeouts, guaranteeing that stories are generated and returned within the serverless function's execution window.
