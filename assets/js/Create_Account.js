// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

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

// Form Submit Handler
document.getElementById("createAccountForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const firstName = document.getElementById("First_Name").value.trim();
  const lastName = document.getElementById("Last_Name").value.trim();
  const password = document.getElementById("create_password").value;
  const confirmPassword = document.getElementById("confirm_password").value;

  if (password !== confirmPassword) {
    showAlert("Passwords do not match!", "error");
    return;
  }

  // --- NEW LOGIC: Auto-generate Username ---
  // Combines First and Last name, removes spaces, and makes it lowercase
  // Example: "John Doe" -> "johndoe"
  const username = (firstName + lastName).replace(/\s+/g, '').toLowerCase(); 

  try {
    // Store user info in Firestore
    await addDoc(collection(db, "TTMPC_USERS"), {
      firstName,
      lastName,
      username, // <--- SAVING THE GENERATED USERNAME HERE
      // ⚠️ Storing plain passwords is insecure. Use Firebase Auth in production.
      password,
      createdAt: serverTimestamp()
    });

    // Updated alert to show the generated username to the user
    showAlert(`Account created! Your username is: ${username}`, "success");
    
    document.getElementById("createAccountForm").reset();

    // Increased timeout slightly so they have time to read the username
    setTimeout(() => {
      window.location.href = "index.html";
    }, 2500);

  } catch (error) {
    console.error('Firestore write error:', error);
    const msg = error?.message || String(error);
    const isPermission = error?.code === 'permission-denied' || (msg && msg.includes('Missing or insufficient permissions'));
    if (isPermission) {
      showAlert('Permission denied: cannot write to Firestore. Update Firestore rules.', 'error');
    } else {
      showAlert('Error: ' + msg, 'error');
    }
  }
});

// Show alert
function showAlert(message, type) {
  const alertContainer = document.getElementById("alertContainer");
  alertContainer.innerHTML = `<div class="alert ${type}">${message}</div>`;
  // Increased alert time slightly
  setTimeout(() => { alertContainer.innerHTML = ""; }, 4000);
}

// Toggle password visibility
document.querySelectorAll(".password-toggle").forEach(icon => {
  icon.addEventListener("click", () => {
    const input = document.getElementById(icon.dataset.target);
    input.type = input.type === "password" ? "text" : "password";
    icon.classList.toggle("fa-eye-slash");
  });
});