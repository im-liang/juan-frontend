import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import LoginOrSubmissions from "./pages/LoginOrSubmissions";
import UserSettings from "./pages/UserSettings";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginOrSubmissions />} />
        <Route path="/settings" element={<UserSettings />} />
      </Routes>
    </Router>
  );
}

export default App;
