/* global firebase, self, importScripts */
importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js");


firebase.initializeApp({
  apiKey: "AIzaSyC2n4ajvOAZSiZJMbPm4ka3mKN5-e0Q6OQ",
  authDomain: "canteen-queue-tracker.firebaseapp.com",
  projectId: "canteen-queue-tracker",
  storageBucket: "canteen-queue-tracker.appspot.com",
  messagingSenderId: "316006159670",
  appId: "1:316006159670:web:d4a2a852e8f06c525f8f97",
  measurementId: "G-GQ65XDHTPC"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {

  const title = payload.notification?.title || "Canteen Queue";
  const body = payload.notification?.body || "You have a new notification.";

  self.registration.showNotification(title, { body, icon: "/icon.png" });
});
