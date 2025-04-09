// src/firebase/fcm.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyC2n4ajvOAZSiZJMbPm4ka3mKN5-e0Q6OQ",
  authDomain: "canteen-queue-tracker.firebaseapp.com",
  projectId: "canteen-queue-tracker",
  storageBucket: "canteen-queue-tracker.appspot.com",
  messagingSenderId: "316006159670",
  appId: "1:316006159670:web:d4a2a852e8f06c525f8f97",
  measurementId: "G-GQ65XDHTPC"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestForToken = async (setTokenFound , setfcmToken) => {
  try {
    // ✅ Register Service Worker FIRST and wait until it's ready
    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    await navigator.serviceWorker.ready; // Wait for it to become active

    const token = await getToken(messaging, {
      vapidKey: "BIDzAC3SNgIBHRzv22OX7JGr3BTfQHupYMq-kFJmHv9MWEzwgWxS-ex3DMBelQ1QlYcFKod14iVUuemerj_rcBE", // Replace this
      serviceWorkerRegistration: registration,
    });

    if (token) {
      // console.log("FCM Token:", token);
      // alert(token);
      setfcmToken(token);
      setTokenFound(true);
    } else {
      console.log("No registration token available.");
      setTokenFound(false);
    }
  } catch (err) {
    console.error("An error occurred while retrieving token. ", err);
    setTokenFound(false);
  }
};


export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
