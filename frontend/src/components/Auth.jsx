import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Auth({ apiBase }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const url = apiBase ? `${apiBase}${endpoint}` : `/api${endpoint}`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      login(data.user, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card auth-card" style={{ maxWidth: '400px', margin: '40px auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>
        {isLogin ? "Welcome Back" : "Create Account"}
      </h2>
      
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="grid" style={{ gridTemplateColumns: '1fr' }}>
        <div className="field">
          <label className="label">Username</label>
          <input 
            type="text" 
            className="input" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
        </div>
        <div className="field">
          <label className="label">Password</label>
          <input 
            type="password" 
            className="input" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={isLogin ? "current-password" : "new-password"}
          />
        </div>
        <button type="submit" className="button" disabled={loading} style={{ marginTop: '12px' }}>
          {loading ? "Please wait..." : (isLogin ? "Sign In" : "Register")}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
        <span style={{ color: 'var(--text)' }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
        </span>
        <button 
          className="back-btn" 
          style={{ display: 'inline', marginLeft: '6px' }}
          onClick={() => { setIsLogin(!isLogin); setError(""); }}
        >
          {isLogin ? "Sign Up" : "Log In"}
        </button>
      </div>
    </div>
  );
}
