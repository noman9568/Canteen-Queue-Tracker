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

    onMessageListener((payload) => {
      // console.log("Foreground notification:", payload);

      const title = payload.notification?.title;
      const body = payload.notification?.body;

      if (Notification.permission === "granted") {
        new Notification(title, { body });
      }
    });
  }, []);


  useEffect(() => {
    if (fcmtoken && decoded?.userId) {
      sendToken(fcmtoken);
    }
  }, [fcmtoken, decoded]);

  const sendToken = async (fcmtoken) => {
    try {
      // console.log(fcmtoken);
      const response = await fetch(`${API_URL}/api/queue/saveToken`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ token: fcmtoken, userId: decoded.userId }),
      });
      const result = await response.json();
      // console.log("Token saved:", result);
    } catch (error) {
      console.error("Error in saving the token: ", error);
    }
  };

  return <>{children}</>;
};

export default NotificationSetup;
