/* global google */
import React, { useEffect, useState, useCallback } from "react";

const LoginOrSubmissions = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [submissions, setSubmissions] = useState([]);

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
        setSubmissions(data.shared_submissions);
      } else if(response.status === 404) {
        setSubmissions([]);
      } else {
        console.error("Failed to fetch submissions.");
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
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
    }
  }, [handleGoogleResponse]);

  return (
    <div>
      {!isLoggedIn ? (
        <div>
          <h1>Login with Google</h1>
          <div id="signInDiv"></div>
        </div>
      ) : (
        <div>
          <h1>Submissions</h1>
          <ul>
            {submissions.map((submission, index) => (
              <li key={index}>{submission.title}</li>
            ))}
          </ul>
          <button onClick={() => (window.location.href = "/settings")}>
            Go to Settings
          </button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default LoginOrSubmissions;
