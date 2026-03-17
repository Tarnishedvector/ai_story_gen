import { useMemo, useState } from "react";
import StoryForm from "./components/StoryForm";
import StoryDisplay from "./components/StoryDisplay";
import "./App.css";

function App() {
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiBase = useMemo(() => {
    const base = import.meta.env.VITE_API_BASE;
    return (base ? base : "").replace(/\/$/, "");
  }, []);

  async function handleGenerate(payload) {
    setLoading(true);
    setError("");
    setStory("");

    try {
      const url = apiBase ? `${apiBase}/generate-story` : "/api/generate-story";
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || "Request failed.");
      }

      setStory(data?.story || "");
    } catch (err) {
      setError(err?.message || "Failed to generate story.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <main className="container">
        <StoryForm onGenerate={handleGenerate} loading={loading} />
        <StoryDisplay story={story} error={error} loading={loading} />
      </main>

      <footer className="footer">
        <span className="muted">
          Tip: Set <code>VITE_API_BASE</code> if your backend runs elsewhere.
        </span>
      </footer>
    </div>
  );
}

export default App;
