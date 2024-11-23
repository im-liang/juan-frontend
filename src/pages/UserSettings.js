import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserSettings = () => {
  const [leetcodeUsername, setLeetcodeUsername] = useState("");
  const [shareSubmissions, setShareSubmissions] = useState(false);
  const [loading, setLoading] = useState(false); // To manage loading state
  const [error, setError] = useState(""); // To manage error messages

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
        setLeetcodeUsername(data.leetcode_username || "");
        setShareSubmissions(data.share_submissions || false);
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
          share_submissions: shareSubmissions,
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
    <div>
      <h1>User Settings</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <label>
        LeetCode Username:
        <input
          type="text"
          value={leetcodeUsername}
          onChange={(e) => setLeetcodeUsername(e.target.value)}
          placeholder="Enter your LeetCode username"
        />
      </label>
      <br />
      <label>
        Share Submissions:
        <input
          type="checkbox"
          checked={shareSubmissions}
          onChange={(e) => setShareSubmissions(e.target.checked)}
        />
      </label>
      <br />
      <button onClick={handleSave} disabled={loading}>
        Save
      </button>
      <button onClick={() => navigate("/")} style={{ marginLeft: "10px" }}>
        Back to Homepage
      </button>
    </div>
  );
};

export default UserSettings;
