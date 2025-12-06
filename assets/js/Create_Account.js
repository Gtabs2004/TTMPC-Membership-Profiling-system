// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
// import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js"; // optional

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
// const auth = getAuth(app); // optional

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

  try {
    // Store user info in Firestore (development/testing only)
    await addDoc(collection(db, "TTMPC_USERS"), {
      firstName,
      lastName,
      // ⚠️ Storing plain passwords is insecure. Use Firebase Auth in production.
      password,
      createdAt: serverTimestamp()
    });

    showAlert("Account created successfully!", "success");
    document.getElementById("createAccountForm").reset();

    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);

    /* 
    // Optional: Firebase Auth Integration (recommended for production)
    const email = document.getElementById("email").value.trim();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    await setDoc(doc(db, "TTMPC_USERS", uid), { firstName, lastName, email, createdAt: serverTimestamp() });
    */

  } catch (error) {
    console.error('Firestore write error:', error);
    const msg = error?.message || String(error);
    const isPermission = error?.code === 'permission-denied' || (msg && msg.includes('Missing or insufficient permissions'));
    if (isPermission) {
      showAlert('Permission denied: cannot write to Firestore. Update Firestore rules to allow writes.', 'error');
      console.info('Developer hint: temporary development rules:\n',
        `service cloud.firestore {\n  match /databases/{database}/documents {\n    match /{document=**} { allow read, write: if true; }\n  }\n}`);
    } else {
      showAlert('Error: ' + msg, 'error');
    }
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
