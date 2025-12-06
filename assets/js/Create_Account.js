// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
import { getFirestore, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

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
const auth = getAuth(app);

// Form Submit Handler
document.getElementById("createAccountForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const firstName = document.getElementById("First_Name").value.trim();
  const lastName = document.getElementById("Last_Name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("create_password").value;
  const confirmPassword = document.getElementById("confirm_password").value;

  if (password !== confirmPassword) {
    showAlert("Passwords do not match!", "error");
    return;
  }

  try {
    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Store extra info in Firestore
    await setDoc(doc(db, "TTMPC_USERS", uid), {
      firstName,
      lastName,
      email,
      createdAt: serverTimestamp()
    });

    showAlert("Account created successfully!", "success");
    document.getElementById("createAccountForm").reset();

    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);

  } catch (error) {
    console.error(error);
    showAlert("Error: " + error.message, "error");
  }
});

// Show alert
function showAlert(message, type) {
  const alertContainer = document.getElementById("alertContainer");
  alertContainer.innerHTML = `<div class="alert ${type}">${message}</div>`;
  setTimeout(() => { alertContainer.innerHTML = ""; }, 3000);
}

// Toggle password visibility
document.querySelectorAll(".password-toggle").forEach(icon => {
  icon.addEventListener("click", () => {
    const input = document.getElementById(icon.dataset.target);
    input.type = input.type === "password" ? "text" : "password";
    icon.classList.toggle("fa-eye-slash");
  });
});
