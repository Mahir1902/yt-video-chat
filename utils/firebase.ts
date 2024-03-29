// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIRBASE_API_KEY,
  authDomain: "yt-video-chat.firebaseapp.com",
  projectId: "yt-video-chat",
  storageBucket: "yt-video-chat.appspot.com",
  messagingSenderId: "185072590428",
  appId: "1:185072590428:web:4bd67da24f49cbae071099",
  measurementId: "G-HCLSGLG0D7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);