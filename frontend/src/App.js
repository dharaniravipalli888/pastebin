import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import CreatePaste from "./components/CreatePaste";
import ViewPaste from "./components/ViewPaste";
import PasteSuccess from "./components/PasteSuccess";
import { healthCheck } from "./services/api";
import "./App.css";

function AppContent() {
  const [currentPaste, setCurrentPaste] = useState(null);
  const [backendStatus, setBackendStatus] = useState("checking");
  const navigate = useNavigate();

  useEffect(() => {
    // Check backend health on mount
    const checkBackend = async () => {
      try {
        await healthCheck();
        setBackendStatus("connected");
      } catch (err) {
        setBackendStatus("disconnected");
      }
    };

    checkBackend();
  }, []);

  const handlePasteCreated = (paste) => {
    setCurrentPaste(paste);
    navigate(`/success/${paste.id}`);
  };

  const handleViewPaste = (pasteId) => {
    navigate(`/view/${pasteId}`);
  };

  const handleCreateNew = () => {
    setCurrentPaste(null);
    navigate("/");
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 onClick={handleCreateNew} style={{ cursor: "pointer" }}>📝 Pastebin Lite</h1>
          <div className="status-badge" data-status={backendStatus}>
            {backendStatus === "connected" ? "✓ Connected" : "✗ Disconnected"}
          </div>
        </div>
      </header>

      <main className="app-main">
        {backendStatus === "disconnected" && (
          <div className="warning-banner">
            ⚠️ Backend server is not available. Make sure the backend is running on
            http://localhost:8000
          </div>
        )}

        <Routes>
          <Route path="/" element={<CreatePaste onPasteCreated={handlePasteCreated} />} />
          <Route
            path="/success/:pasteId"
            element={
              currentPaste ? (
                <PasteSuccess
                  paste={currentPaste}
                  onViewPaste={handleViewPaste}
                  onCreate={handleCreateNew}
                />
              ) : (
                <CreatePaste onPasteCreated={handlePasteCreated} />
              )
            }
          />
          <Route path="/view/:pasteId" element={<ViewPaste onBack={handleCreateNew} />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <p>Share your code & text snippets easily</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
