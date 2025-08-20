import { useEffect, useState } from "react";
import { requestForToken, onMessageListener } from "../firebase/fcm";
import { jwtDecode } from "jwt-decode";

const NotificationSetup = ({ children }) => {
  const [isTokenFound, setTokenFound] = useState(false);
  const [fcmtoken, setFcmToken] = useState("");
  const [decoded, setDecoded] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL; // ✅ use only one consistent env var

  // Decode JWT token from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setDecoded(decodedToken);
    }
  }, []);

  // Ask for notification permission once on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
        } else {
          console.warn("Notification permission denied.");
        }
      });
    }
  }, []);

  // Request FCM token + setup foreground listener
  useEffect(() => {
    requestForToken(setTokenFound, setFcmToken);

    onMessageListener()
      .then((payload) => {
        console.log("Foreground notification received:", payload);
        const { title, body } = payload.notification;
        if (Notification.permission === "granted" && isTokenFound) {
          new Notification(title, { body });
        }
        // Optional alert fallback
        alert(`${title}\n${body}`);
      })
      .catch((err) => console.log("Failed to receive notification - ", err));
  }, [isTokenFound]);

  // Send FCM token to backend when both token + userId available
  useEffect(() => {
    if (fcmtoken && decoded?.userId) {
      console.log("Sending token to backend...");
      sendToken(fcmtoken);
    }
  }, [fcmtoken, decoded]);

  const sendToken = async (fcmtoken) => {
    try {
      const response = await fetch(`${API_URL}/api/queue/saveToken`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ token: fcmtoken, userId: decoded.userId }),
      });
      const result = await response.json();
      console.log("Token saved:", result);
    } catch (error) {
      console.error("Error in saving the token: ", error);
    }
  };

  return <>{children}</>;
};

export default NotificationSetup;
