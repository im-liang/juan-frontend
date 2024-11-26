/* global google */
import React, { useEffect, useState, useCallback } from "react";
import './LoginOrSubmissions.css'

const LoginOrSubmissions = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false); // To manage loading state
  const [error, setError] = useState(""); // For error handling

  const handleGoogleResponse = useCallback(async (response) => {
    try {
      const res = await fetch(process.env.REACT_APP_API_GOOGLE_CALLBACK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: response.credential }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("access_token", data.access_token);
        setIsLoggedIn(true);
        fetchSubmissions(data.access_token);
      } else {
        console.error("Failed to authenticate with Google.");
      }
    } catch (error) {
      console.error("Error during Google authentication:", error);
    }
  }, []);

  const fetchSubmissions = async (token) => {
    setLoading(true);
    setError(""); // Reset error state
    try {
      const response = await fetch(process.env.REACT_APP_API_GET_SUBMISSION, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSubmissions(data || []);
      } else if (response.status === 404) {
        setSubmissions([]);
      } else {
        setError("Failed to fetch submissions.");
      }
    } catch (error) {
      setError("Error fetching submissions.");
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    google.accounts.id.disableAutoSelect();

    localStorage.removeItem("google_user");
    localStorage.removeItem("access_token");

    setIsLoggedIn(false);
    setSubmissions([]);
  };

  const initializeGoogleSignIn = (handleGoogleResponse) => {
    google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
      ux_mode: "popup",
    });
    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      {
        theme: "outline",
        size: "large",
      }
    );
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);

    if (!token) {
      initializeGoogleSignIn(handleGoogleResponse);
    } else {
      fetchSubmissions(token); // Fetch submissions when already logged in
    }
  }, [handleGoogleResponse]);

  return (
    <div>
      {!isLoggedIn ? (
        <div className="google-sigin-container">
          <h1>Login with Google</h1>
          <div className="g-signin2" data-onsuccess="onSignIn" id="signInDiv"></div>
        </div>
      ) : (
        <div>
          <div className="button-container">
            <button onClick={() => (window.location.href = "/settings")}>
              Settings
            </button>
            <button onClick={handleLogout}>Logout</button>
          </div>
          <h1 className="title">Submissions</h1>

          {loading && <p>Loading your submissions...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {submissions.length === 0 ? (
            <p>No submissions found for today.</p>
          ) : (
        <div className="submission-table-container">
          <table className="submission-table">
            <thead>
              <tr>
                <th>LeetCode Username</th>
                <th>Title</th>
              </tr>
            </thead>
            <tbody>
            {submissions.map((submission, index) => (
              <tr key={index}>
                <td>{submission.leetcode_username}</td>
                <td>{submission.today_submissions}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      )}
        </div>
      )}
    </div>
  );
};

export default LoginOrSubmissions;
