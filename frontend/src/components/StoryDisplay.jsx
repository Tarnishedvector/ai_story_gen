import { useMemo, useState } from "react";

export default function StoryDisplay({ story, error, loading }) {
  const [copied, setCopied] = useState(false);

  const disabled = useMemo(() => loading || !story?.trim(), [loading, story]);

  async function handleCopy() {
    if (disabled) return;
    try {
      await navigator.clipboard.writeText(story);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = story;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    }
  }

  function handleDownload() {
    if (disabled) return;
    const blob = new Blob([story], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "story.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="card">
      <div className="cardHeader row">
        <div>
          <h2 className="h2">Generated story</h2>
          <p className="subtitle">
            {loading
              ? "Writing… this can take a few seconds."
              : "Copy it, download it, or generate another one."}
          </p>
        </div>

        <div className="actions">
          <button className="button secondary" onClick={handleCopy} disabled={disabled}>
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            className="button secondary"
            onClick={handleDownload}
            disabled={disabled}
          >
            Download
          </button>
        </div>
      </div>

      {error ? <div className="error">{error}</div> : null}

      <textarea
        className="textarea"
        readOnly
        value={story}
        placeholder="Your story will appear here…"
        aria-label="Generated story"
      />
    </section>
  );
}

