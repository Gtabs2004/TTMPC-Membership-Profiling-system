// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
  import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCs8xLwJfTsVDhSQvFsMHGPPfFAmFq-pxY",
    authDomain: "ttmpc-member-profiling.firebaseapp.com",
    databaseURL: "https://ttmpc-member-profiling-default-rtdb.firebaseio.com",
    projectId: "ttmpc-member-profiling",
    storageBucket: "ttmpc-member-profiling.firebasestorage.app",
    messagingSenderId: "83279335158",
    appId: "1:83279335158:web:7060b6ccff4e88d31aa6d7",
    measurementId: "G-SLLY23H3YF"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

// Firestore reference
const db = getFirestore(app);
