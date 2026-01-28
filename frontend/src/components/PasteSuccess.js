import React, { useState } from "react";
import "../styles/PasteSuccess.css";

function PasteSuccess({ paste, onViewPaste, onCreate }) {
  const [copied, setCopied] = useState(false);

  const pasteUrl = `${window.location.origin}/view/${paste.id}`;

  const copyLink = () => {
    navigator.clipboard.writeText(pasteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="success-container">
      <div className="success-card">
        <h2>✓ Paste Created Successfully!</h2>

        <div className="paste-info">
          <div className="info-item">
            <label>Paste ID:</label>
            <code>{paste.id}</code>
          </div>

          <div className="info-item">
            <label>Shareable Link:</label>
            <div className="link-container">
              <input type="text" value={pasteUrl} readOnly />
              <button onClick={copyLink} className="copy-link-btn">
                {copied ? "✓" : "Copy"}
              </button>
            </div>
          </div>

          {paste.ttl_seconds && (
            <div className="info-item">
              <label>Expires in:</label>
              <span>{paste.ttl_seconds} seconds</span>
            </div>
          )}

          {paste.max_views && (
            <div className="info-item">
              <label>Max Views:</label>
              <span>{paste.max_views}</span>
            </div>
          )}
        </div>

        <div className="button-group">
          <button onClick={() => onViewPaste(paste.id)} className="view-btn">
            View Paste
          </button>
          <button onClick={onCreate} className="create-new-btn">
            Create Another
          </button>
        </div>
      </div>
    </div>
  );
}

export default PasteSuccess;
