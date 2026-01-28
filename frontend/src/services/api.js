const API_BASE_URL = "http://localhost:8000";

// Health check
export const healthCheck = async () => {
  const response = await fetch(`${API_BASE_URL}/api/healthz`);
  if (!response.ok) throw new Error("Backend is not available");
  return response.json();
};

// Create a new paste
export const createPaste = async (content, ttlSeconds = null, maxViews = null) => {
  const payload = {
    content,
    ...(ttlSeconds && { ttl_seconds: ttlSeconds }),
    ...(maxViews && { max_views: maxViews }),
  };

  const response = await fetch(`${API_BASE_URL}/api/pastes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error("Failed to create paste");
  return response.json();
};

// Get paste by ID
export const getPaste = async (pasteId) => {
  const response = await fetch(`${API_BASE_URL}/api/pastes/${pasteId}`);
  if (!response.ok) throw new Error("Paste not found or expired");
  return response.json();
};
