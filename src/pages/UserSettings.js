import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
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
    <div className="setting-container">
      <div className="button-container">
        <button onClick={() => navigate("/")}>
          Homepage
        </button>
      </div>
      <h1 className="title">User Settings</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

<div className="leetcode-form">
  <input type="text"
      value={leetcodeUsername}
      onChange={(e) => setLeetcodeUsername(e.target.value)}
   />
  <label htmlFor="text" className="leetcode-label-name">
    <span className="leetcode-content-name">
      Leetcode Username
    </span>
  </label>
</div>
      <br />
      <label className="submission-checkbox">
        <input
          type="checkbox"
          checked={shareSubmissions}
          onChange={(e) => setShareSubmissions(e.target.checked)}
        />
        <div>
          <svg className="submission-check" viewBox="-2 -2 35 35" aria-hidden="true">
            <title>checkmark-circle</title>
            <polyline points="7.57 15.87 12.62 21.07 23.43 9.93" />
          </svg>
        </div>
        <div>Share Submissions</div>
      </label>
      <br />
      <button className="save-button" onClick={handleSave} disabled={loading}>
        <span className="save-button_lg">
          <span className="save-button_sl"></span>
          <span className="save-button_text">save</span>
        </span>
      </button>
    </div>
  );
};

export default UserSettings;
