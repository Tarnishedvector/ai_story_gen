import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function StoryHistory({ apiBase, onSelectStory }) {
  const { token } = useAuth();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStories() {
      try {
        const url = apiBase ? `${apiBase}/stories` : "/api/stories";
        const res = await fetch(url, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error("Failed to load history");
        const data = await res.json();
        setStories(data.stories || []);
      } catch (err) {
        setError("Could not load your stories.");
      } finally {
        setLoading(false);
      }
    }
    fetchStories();
  }, [apiBase]);

  if (loading) {
    return <div className="history-loading">Loading your creations...</div>;
  }

  if (error) {
    return <div className="history-error">{error}</div>;
  }

  if (stories.length === 0) {
    return (
      <div className="history-empty">
        <p>You haven't generated any stories yet.</p>
        <p>Head to the Generator to create some magic!</p>
      </div>
    );
  }

  return (
    <div className="story-history">
      <h2>Your Saved Stories</h2>
      <div className="history-grid">
        {stories.map((story) => (
          <div 
            key={story.id} 
            className="history-card"
            onClick={() => onSelectStory(story)}
          >
            <h3>{story.title}</h3>
            <div className="card-meta">
              <span>{story.genre}</span>
              <span>•</span>
              <span>{story.length}</span>
            </div>
            <p className="card-preview">
              {story.content.substring(0, 100)}...
            </p>
            <div className="card-date">
              {new Date(story.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
