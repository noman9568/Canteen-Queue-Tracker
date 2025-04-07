import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC2n4ajvOAZSiZJMbPm4ka3mKN5-e0Q6OQ",
  authDomain: "canteen-queue-tracker.firebaseapp.com",
  projectId: "canteen-queue-tracker",
  storageBucket: "canteen-queue-tracker.firebasestorage.app",
  messagingSenderId: "316006159670",
  appId: "1:316006159670:web:d4a2a852e8f06c525f8f97",
  measurementId: "G-GQ65XDHTPC"
};

export const firebaseApp = initializeApp(firebaseConfig);
