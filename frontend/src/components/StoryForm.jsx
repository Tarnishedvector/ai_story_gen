import { useMemo, useState } from "react";

const GENRES = ["Fantasy", "Sci‑Fi", "Horror", "Romance", "Mystery", "Adventure"];
const LENGTHS = [
  { value: "short", label: "Short (≈ 400–700 words)" },
  { value: "medium", label: "Medium (≈ 900–1400 words)" },
  { value: "long", label: "Long (≈ 1700–2400 words)" },
];

export default function StoryForm({ onGenerate, loading }) {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState(GENRES[0]);
  const [character, setCharacter] = useState("");
  const [setting, setSetting] = useState("");
  const [length, setLength] = useState(LENGTHS[0].value);

  const canSubmit = useMemo(() => {
    return (
      title.trim() &&
      genre.trim() &&
      character.trim() &&
      setting.trim() &&
      length.trim() &&
      !loading
    );
  }, [title, genre, character, setting, length, loading]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    onGenerate({
      title: title.trim(),
      genre: genre.trim(),
      character: character.trim(),
      setting: setting.trim(),
      length: length.trim(),
    });
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <div className="cardHeader">
        <div>
          <h1 className="title">AI Story Generator</h1>
          <p className="subtitle">
            Fill in a few details and generate a complete story with Gemini.
          </p>
        </div>
      </div>

      <div className="grid">
        <label className="field">
          <span className="label">Story title</span>
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="The Clockwork Lighthouse"
            maxLength={120}
            autoComplete="off"
            required
          />
        </label>

        <label className="field">
          <span className="label">Genre</span>
          <select
            className="input"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          >
            {GENRES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="label">Main character</span>
          <input
            className="input"
            value={character}
            onChange={(e) => setCharacter(e.target.value)}
            placeholder="Ava, a stubborn apprentice cartographer"
            maxLength={160}
            autoComplete="off"
            required
          />
        </label>

        <label className="field">
          <span className="label">Setting</span>
          <input
            className="input"
            value={setting}
            onChange={(e) => setSetting(e.target.value)}
            placeholder="A floating city above an endless storm"
            maxLength={180}
            autoComplete="off"
            required
          />
        </label>

        <label className="field fieldSpan">
          <span className="label">Story length</span>
          <select
            className="input"
            value={length}
            onChange={(e) => setLength(e.target.value)}
          >
            {LENGTHS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button className="button" type="submit" disabled={!canSubmit}>
        {loading ? (
          <>
            <span className="spinner" aria-hidden="true" />
            Generating…
          </>
        ) : (
          "Generate Story"
        )}
      </button>
    </form>
  );
}

