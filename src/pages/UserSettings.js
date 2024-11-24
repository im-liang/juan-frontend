import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './UserSettings.css';

const UserSettings = () => {
  const [leetcodeUsername, setLeetcodeUsername] = useState("");
  const [shareSubmissions, setShareSubmissions] = useState(false);
  const [loading, setLoading] = useState(false); // To manage loading state
  const [error, setError] = useState(""); // To manage error messages

  const navigate = useNavigate(); // React Router's hook for navigation

  const fetchUserSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");

      const response = await fetch(process.env.REACT_APP_API_GET_USER, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLeetcodeUsername(data.user.leetcode_username || "");
        setShareSubmissions(data.user.share_submission || false);
      } else {
        console.error("Failed to fetch user settings.");
      }
    } catch (err) {
      console.error("Error fetching user settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(""); // Clear previous errors

      const token = localStorage.getItem("access_token");

      const response = await fetch(process.env.REACT_APP_API_PATCH_USER, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          leetcode_username: leetcodeUsername,
          share_submission: shareSubmissions,
        }),
      });

      if (response.ok) {
        alert("Settings updated!");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to update settings.");
      }
    } catch (err) {
      setError("An error occurred while updating settings.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch user settings on component mount
    fetchUserSettings();
  }, []);

  return (
    <div class="setting-container">
      <div class="button-container">
        <button onClick={() => navigate("/")}>
          Homepage
        </button>
      </div>
      <h1 class="title">User Settings</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

<div class="leetcode-form">
  <input type="text"
      value={leetcodeUsername}
      onChange={(e) => setLeetcodeUsername(e.target.value)}
   />
  <label for="text" class="leetcode-label-name">
    <span class="leetcode-content-name">
      Leetcode Username
    </span>
  </label>
</div>
      <br />
      <label class="submission-checkbox">
        <input
          type="checkbox"
          checked={shareSubmissions}
          onChange={(e) => setShareSubmissions(e.target.checked)}
        />
        <div>
          <svg class="submission-check" viewBox="-2 -2 35 35" aria-hidden="true">
            <title>checkmark-circle</title>
            <polyline points="7.57 15.87 12.62 21.07 23.43 9.93" />
          </svg>
        </div>
        <div>Share Submissions</div>
      </label>
      <br />
      <button class="save-button" onClick={handleSave} disabled={loading}>
        <span class="save-button_lg">
          <span class="save-button_sl"></span>
          <span class="save-button_text">save</span>
        </span>
      </button>
    </div>
  );
};

export default UserSettings;
