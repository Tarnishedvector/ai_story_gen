import { useMemo, useState } from "react";
import StoryForm from "./components/StoryForm";
import StoryDisplay from "./components/StoryDisplay";
import StoryHistory from "./components/StoryHistory";
import Auth from "./components/Auth";
import { useAuth } from "./context/AuthContext";
import "./App.css";

function App() {
  const { user, token, logout } = useAuth();
  const [view, setView] = useState("generate"); // 'generate' | 'history'
  const [historyStory, setHistoryStory] = useState(null); // the story payload from history
  
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiBase = useMemo(() => {
    const base = import.meta.env.VITE_API_BASE;
    return (base ? base : "").replace(/\/$/, "");
  }, []);

  async function handleGenerate(payload) {
    setView("generate");
    setHistoryStory(null);
    setLoading(true);
    setError("");
    setStory("");

    try {
      const url = apiBase ? `${apiBase}/generate-story` : "/api/generate-story";
      const res = await fetch(url, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
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

  if (!user) {
    return (
      <div className="page" style={{ justifyContent: 'center' }}>
        <h1 style={{ textAlign: 'center', background: 'linear-gradient(90deg, var(--accent), #38bdf8)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '36px', marginBottom: '8px' }}>Scribe AI</h1>
        <p style={{ textAlign: 'center', color: 'var(--text)', marginBottom: '16px' }}>Unlock the power of AI story generation.</p>
        <Auth apiBase={apiBase} />
      </div>
    );
  }

  return (
    <div className="page">
      <header className="app-header">
        <h1>Scribe AI</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <nav className="app-nav">
            <button 
              className={`nav-btn ${view === "generate" ? "active" : ""}`}
              onClick={() => { setView("generate"); setHistoryStory(null); }}
            >
              Generate
            </button>
            <button 
              className={`nav-btn ${view === "history" ? "active" : ""}`}
              onClick={() => { setView("history"); setHistoryStory(null); }}
            >
              History
            </button>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text)', fontWeight: 500 }}>{user.username}</span>
            <button onClick={logout} className="back-btn" style={{ fontSize: '12px', padding: '4px 8px', border: '1px solid var(--border)', borderRadius: '6px' }}>Sign Out</button>
          </div>
        </div>
      </header>

      <main className="container">
        {view === "generate" && (
          <>
            <StoryForm onGenerate={handleGenerate} loading={loading} />
            <StoryDisplay story={story} error={error} loading={loading} />
          </>
        )}
        
        {view === "history" && !historyStory && (
          <StoryHistory 
            apiBase={apiBase} 
            onSelectStory={(s) => setHistoryStory(s)} 
          />
        )}
        
        {view === "history" && historyStory && (
          <div className="history-view">
            <button className="back-btn" onClick={() => setHistoryStory(null)}>
              ← Back to History
            </button>
            <StoryDisplay story={historyStory.content} error="" loading={false} />
          </div>
        )}
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
