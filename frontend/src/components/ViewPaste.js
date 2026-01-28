import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPaste } from "../services/api";
import "../styles/ViewPaste.css";

function ViewPaste({ onBack }) {
  const { pasteId } = useParams();
  const [paste, setPaste] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPaste = async () => {
      try {
        setLoading(true);
        const data = await getPaste(pasteId);
        setPaste(data);
        setError("");
      } catch (err) {
        setError(err.message || "Failed to load paste");
        setPaste(null);
      } finally {
        setLoading(false);
      }
    };

    if (pasteId) {
      fetchPaste();
    }
  }, [pasteId]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(paste.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="view-paste-container">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="view-paste-container">
        <div className="error-message">{error}</div>
        <button onClick={onBack} className="back-btn">
          ← Back to Create
        </button>
      </div>
    );
  }

  if (!paste) {
    return (
      <div className="view-paste-container">
        <p>Paste not found.</p>
        <button onClick={onBack} className="back-btn">
          ← Back to Create
        </button>
      </div>
    );
  }

  return (
    <div className="view-paste-container">
      <div className="paste-header">
        <div>
          <h2>Paste ID: {paste.id}</h2>
          <p className="views-count">Views: {paste.views}</p>
        </div>
        <button onClick={copyToClipboard} className="copy-btn">
          {copied ? "✓ Copied!" : "Copy"}
        </button>
      </div>

      <pre className="paste-content">{paste.content}</pre>

      <button onClick={onBack} className="back-btn">
        ← Back to Create
      </button>
    </div>
  );
}

export default ViewPaste;
