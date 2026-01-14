import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LevelsPage from "./pages/LevelsPage";
import PlaybookPage from "./pages/PlaybookPage";
import "./App.css";

/**
 * App root. Defines client-side routes.
 *
 * Routes:
 * - "/" -> Levels of Engagement
 * - "/playbook" -> Playbook (detailed)
 */
// PUBLIC_INTERFACE
function App() {
  return (
    <div className="appRoot">
      <Routes>
        <Route path="/" element={<LevelsPage />} />
        <Route path="/playbook" element={<PlaybookPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
