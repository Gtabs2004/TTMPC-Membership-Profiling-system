// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCs8xLwJfTsVDhSQvFsMHGPPfFAmFq-pxY",
  authDomain: "ttmpc-member-profiling.firebaseapp.com",
  projectId: "ttmpc-member-profiling",
  storageBucket: "ttmpc-member-profiling.firebasestorage.app",
  messagingSenderId: "83279335158",
  appId: "1:83279335158:web:7060b6ccff4e88d31aa6d7",
  measurementId: "G-SLLY23H3YF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Global login function (called by inline onclick in HTML)
window.login = async function() {
  // MODIFIED: Get username instead of names
  const usernameInput = document.getElementById("username").value.trim().toLowerCase(); // Normalize input to lowercase
  const password = document.getElementById("password").value;

  if (!usernameInput || !password) {
    showAlert("Please enter username and password", "error");
    return;
  }

  try {
    // MODIFIED: Query Firestore by 'username'
    const usersRef = collection(db, "TTMPC_USERS");
    const q = query(usersRef, where("username", "==", usernameInput));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      showAlert("Username not found", "error");
      return;
    }

    // Check password against stored records
    let foundMatch = false;
    let userData = null;

    querySnapshot.forEach((doc) => {
      const user = doc.data();
      // Simple password check (Note: In production, use Firebase Auth)
      if (user.password === password) {
        foundMatch = true;
        userData = { ...user, uid: doc.id };
      }
    });

    if (!foundMatch) {
      showAlert("Incorrect password", "error");
      return;
    }

    // Store login info in sessionStorage
    sessionStorage.setItem("currentUser", JSON.stringify({
      uid: userData.uid,
      username: userData.username, // Added username to session storage
      firstName: userData.firstName,
      lastName: userData.lastName,
      loginTime: new Date().toISOString()
    }));

    showAlert("Login successful! Redirecting...", "success");
    
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1500);

  } catch (error) {
    console.error('Login error:', error);
    const msg = error?.message || String(error);
    const isPermission = error?.code === 'permission-denied' || (msg && msg.includes('Missing or insufficient permissions'));
    
    if (isPermission) {
      showAlert('Permission denied: cannot read from Firestore. Update Firestore rules.', 'error');
    } else {
      showAlert('Error: ' + msg, 'error');
    }
  }
};

// Show alert
function showAlert(message, type) {
  const alertContainer = document.getElementById("alertContainer");
  alertContainer.innerHTML = `<div class="alert ${type}">${message}</div>`;
  setTimeout(() => { alertContainer.innerHTML = ""; }, 3000);
}

// Toggle password visibility
document.addEventListener('DOMContentLoaded', () => {
  const togglePasswordIcon = document.getElementById("togglePassword");
  if (togglePasswordIcon) {
    togglePasswordIcon.addEventListener("click", () => {
      const passwordInput = document.getElementById("password");
      passwordInput.type = passwordInput.type === "password" ? "text" : "password";
      togglePasswordIcon.classList.toggle("fa-eye-slash");
    });
  }
});