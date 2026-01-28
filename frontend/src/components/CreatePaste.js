import React, { useState } from "react";
import { createPaste } from "../services/api";
import "../styles/CreatePaste.css";

function CreatePaste({ onPasteCreated }) {
  const [content, setContent] = useState("");
  const [ttlSeconds, setTtlSeconds] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!content.trim()) {
        setError("Please enter some content");
        setLoading(false);
        return;
      }

      const paste = await createPaste(
        content,
        ttlSeconds ? parseInt(ttlSeconds) : null,
        maxViews ? parseInt(maxViews) : null
      );

      onPasteCreated(paste);
      setContent("");
      setTtlSeconds("");
      setMaxViews("");
    } catch (err) {
      setError(err.message || "Failed to create paste");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-paste-container">
      <h1>Create a Paste</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="content">Paste Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your code or text here..."
            rows="10"
            disabled={loading}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="ttl">
              TTL (Seconds)
              <span className="help-text">Optional: Auto-expire after N seconds</span>
            </label>
            <input
              id="ttl"
              type="number"
              value={ttlSeconds}
              onChange={(e) => setTtlSeconds(e.target.value)}
              placeholder="e.g., 3600"
              min="1"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="maxviews">
              Max Views
              <span className="help-text">Optional: Auto-expire after N views</span>
            </label>
            <input
              id="maxviews"
              type="number"
              value={maxViews}
              onChange={(e) => setMaxViews(e.target.value)}
              placeholder="e.g., 5"
              min="1"
              disabled={loading}
            />
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "Creating..." : "Create Paste"}
        </button>
      </form>
    </div>
  );
}

export default CreatePaste;
