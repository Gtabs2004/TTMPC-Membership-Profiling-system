// ------------------------------------------------------------------
// 1. FIREBASE IMPORTS & CONFIGURATION
// ------------------------------------------------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCs8xLwJfTsVDhSQvFsMHGPPfFAmFq-pxY",
  authDomain: "ttmpc-member-profiling.firebaseapp.com",
  projectId: "ttmpc-member-profiling",
  storageBucket: "ttmpc-member-profiling.firebasestorage.app",
  messagingSenderId: "83279335158",
  appId: "1:83279335158:web:7060b6ccff4e88d31aa6d7",
  measurementId: "G-SLLY23H3YF"
};

// Initialize Backend Connection
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const membersCollection = collection(db, "TTMPC_MEMBERS");

// ------------------------------------------------------------------
// 2. INITIALIZATION
// ------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    if(window.flatpickr) {
        flatpickr(".date-picker", {
            dateFormat: "Y-m-d",
            maxDate: "today"
        });
    }

    const dateJoinedInput = document.getElementById('dateJoined');
    if(dateJoinedInput) {
        dateJoinedInput.value = new Date().toISOString().split('T')[0];
    }

    setupEventListeners();
});

// ------------------------------------------------------------------
// 3. EVENT LISTENERS
// ------------------------------------------------------------------
function setupEventListeners() {
    const dobInput = document.getElementById('dateOfBirth');
    if(dobInput) {
        dobInput.addEventListener('change', function() {
            document.getElementById('age').value = calculateAge(this.value);
        });
    }

    const form = document.getElementById('addMemberForm');
    if(form) {
        form.addEventListener('submit', saveMemberToDatabase);
    }

    const resetBtn = document.getElementById('resetAddFormBtn');
    if(resetBtn) {
        resetBtn.addEventListener('click', () => {
            form.reset();
            document.getElementById('age').value = '';
            document.getElementById('dateJoined').value = new Date().toISOString().split('T')[0];
        });
    }
}

// ------------------------------------------------------------------
// 4. CORE FUNCTION: SAVE TO DATABASE
// ------------------------------------------------------------------
async function saveMemberToDatabase(e) {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const form = e.target;

    if (!form.checkValidity()) {
        showAlert("Please fill out all required fields.", "error");
        return;
    }

    // UI Feedback
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerText = "Generating ID & Saving...";
    submitBtn.disabled = true;

    // --- GENERATE MEMBER CODE ---
    // Format: MEM-2025-XXXX (Random 4 digits)
    const currentYear = new Date().getFullYear();
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const generatedMemberCode = `MEM-${currentYear}-${randomId}`;

    // Gather Data
    const formData = new FormData(form);
    
    const newMemberData = {
        // Personal Info
        firstName: formData.get('firstName').trim(),
        middleName: formData.get('middleName').trim(),
        lastName: formData.get('lastName').trim(),
        gender: formData.get('gender'),
        dateOfBirth: formData.get('dateOfBirth'),
        age: document.getElementById('age').value,
        contactNumber: formData.get('contactNumber').trim(),
        email: formData.get('emailAddress').trim(),
        
        // Membership Info
        civilStatus: formData.get('civilStatus'),
        occupation: formData.get('occupation').trim(),
        permanentAddress: formData.get('permanentAddress').trim(),
        dateJoined: formData.get('dateJoined'),
        
        // HERE IS THE CHANGE: Use the generated code instead of "PENDING"
        memberCode: generatedMemberCode, 
        
        // System Data
        status: "Active",
        createdAt: serverTimestamp()
    };

    try {
        await addDoc(membersCollection, newMemberData);
        
        // Show success message with the new code
        showAlert(`Member Added! Assigned Code: ${generatedMemberCode}`, "success");
        
        // Reset Form
        form.reset();
        document.getElementById('age').value = '';
        document.getElementById('dateJoined').value = new Date().toISOString().split('T')[0];

    } catch (error) {
        console.error("Error adding document: ", error);
        showAlert("Error saving to database: " + error.message, "error");
    } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
}

// ------------------------------------------------------------------
// 5. HELPER FUNCTIONS
// ------------------------------------------------------------------
function calculateAge(dateString) {
    if(!dateString) return '';
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

function showAlert(msg, type) {
    const alertBox = document.getElementById('alertMessage');
    const alertText = document.getElementById('alertText');
    
    alertBox.className = `alert ${type}`;
    alertText.innerText = msg;
    alertBox.style.display = 'block';

    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 5000);
}