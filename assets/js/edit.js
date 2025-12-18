// ------------------------------------------------------------------
// 1. FIREBASE IMPORTS & CONFIGURATION
// ------------------------------------------------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCs8xLwJfTsVDhSQvFsMHGPPfFAmFq-pxY",
  authDomain: "ttmpc-member-profiling.firebaseapp.com",
  projectId: "ttmpc-member-profiling",
  storageBucket: "ttmpc-member-profiling.firebasestorage.app",
  messagingSenderId: "83279335158",
  appId: "1:83279335158:web:7060b6ccff4e88d31aa6d7",
  measurementId: "G-SLLY23H3YF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let currentMemberId = null;
let newPhotoBase64 = null; // Variable to hold the new image string

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    currentMemberId = urlParams.get('id');

    if (!currentMemberId) {
        alert("No Member ID found.");
        window.location.href = 'manageMember.html';
        return;
    }

    fetchMemberData(currentMemberId);
    setupEventListeners();
});

// ------------------------------------------------------------------
// 2. FETCH DATA
// ------------------------------------------------------------------
async function fetchMemberData(id) {
    try {
        const docRef = doc(db, "TTMPC_MEMBERS", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            populateForm(docSnap.data());
        } else {
            showAlert("Member not found!", "error");
        }
    } catch (error) {
        console.error("Error:", error);
        showAlert("Connection error.", "error");
    }
}

// ------------------------------------------------------------------
// 3. POPULATE UI
// ------------------------------------------------------------------
function populateForm(data) {
    // Header Info
    document.getElementById('displayName').textContent = `${data.firstName || ''} ${data.lastName || ''}`;
    document.getElementById('displayMemberCode').textContent = data.memberCode || "N/A";
    document.getElementById('displayStatus').textContent = data.status || "Active";

    // ** PROFILE PICTURE LOGIC **
    if (data.profilePicture) {
        document.getElementById('profileImage').src = data.profilePicture;
    } else {
        // Reset to default if no picture exists
        document.getElementById('profileImage').src = "https://via.placeholder.com/150";
    }

    // Inputs
    setVal('firstName', data.firstName);
    setVal('middleName', data.middleName);
    setVal('lastName', data.lastName);
    setVal('email', data.email);
    setVal('contactNumber', data.contactNumber);
    setVal('gender', data.gender);
    setVal('civilStatus', data.civilStatus);
    setVal('dateOfBirth', data.dateOfBirth);
    setVal('age', data.age);
    setVal('occupation', data.occupation);
    setVal('permanentAddress', data.permanentAddress);
    
    // Extra
    setVal('maidenName', data.maidenName);
    setVal('placeOfBirth', data.placeOfBirth);
    setVal('religion', data.religion);
    setVal('citizenship', data.citizenship);
    
    // Membership
    setVal('memberCode', data.memberCode);
    setVal('dateJoined', data.dateJoined);
    setVal('status', data.status);
    setVal('bodResolution', data.bodResolution);
    setVal('numberOfShares', data.numberOfShares);
    setVal('amount', data.amount);
}

function setVal(id, val) {
    const el = document.getElementById(id);
    if(el) el.value = val || "";
}

// ------------------------------------------------------------------
// 4. SAVE CHANGES (Including Image)
// ------------------------------------------------------------------
async function handleSaveChanges(e) {
    e.preventDefault();
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.innerText = "Updating...";
    saveBtn.disabled = true;

    // 1. Gather Text Data
    const updatedData = {
        firstName: getVal('firstName'),
        middleName: getVal('middleName'),
        lastName: getVal('lastName'),
        email: getVal('email'),
        contactNumber: getVal('contactNumber'),
        gender: getVal('gender'),
        civilStatus: getVal('civilStatus'),
        dateOfBirth: getVal('dateOfBirth'),
        age: getVal('age'),
        occupation: getVal('occupation'),
        permanentAddress: getVal('permanentAddress'),
        maidenName: getVal('maidenName'),
        placeOfBirth: getVal('placeOfBirth'),
        religion: getVal('religion'),
        citizenship: getVal('citizenship'),
        dateJoined: getVal('dateJoined'),
        status: getVal('status'),
        bodResolution: getVal('bodResolution'),
        numberOfShares: getVal('numberOfShares'),
        amount: getVal('amount')
    };

    // 2. Add Profile Picture (Only if a new one was selected)
    if (newPhotoBase64) {
        updatedData.profilePicture = newPhotoBase64;
    }

    try {
        const docRef = doc(db, "TTMPC_MEMBERS", currentMemberId);
        await updateDoc(docRef, updatedData);
        
        showAlert("Profile updated successfully!", "success");
        
        // Update Header Immediately
        document.getElementById('displayName').textContent = `${updatedData.firstName} ${updatedData.lastName}`;
        document.getElementById('displayStatus').textContent = updatedData.status;
        
        // Reset state
        newPhotoBase64 = null; // Clear pending photo
        toggleEditMode(false);

    } catch (error) {
        console.error("Update Error:", error);
        if (error.code === 'invalid-argument') {
            showAlert("Image too large! Please choose a smaller file.", "error");
        } else {
            showAlert("Failed to update profile.", "error");
        }
    } finally {
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
        saveBtn.disabled = false;
    }
}

function getVal(id) {
    return document.getElementById(id)?.value || "";
}

// ------------------------------------------------------------------
// 5. UI & EVENT LISTENERS
// ------------------------------------------------------------------
function setupEventListeners() {
    const editBtn = document.getElementById('editInfoBtn');
    const cancelBtn = document.getElementById('cancelEditBtn');
    const form = document.getElementById('memberForm');
    const dobInput = document.getElementById('dateOfBirth');

    editBtn.addEventListener('click', () => toggleEditMode(true));
    
    cancelBtn.addEventListener('click', () => {
        if(confirm("Discard changes?")) {
            fetchMemberData(currentMemberId); // Reload original data
            newPhotoBase64 = null; // Clear unsaved photo
            toggleEditMode(false);
        }
    });

    form.addEventListener('submit', handleSaveChanges);

    if(dobInput) {
        dobInput.addEventListener('change', function() {
            document.getElementById('age').value = calculateAge(this.value);
        });
    }

    setupImageUpload();
}

function setupImageUpload() {
    const photoContainer = document.querySelector('.profile-avatar');
    const photoInput = document.getElementById('profile-photo-input');

    // Only allow clicking the photo if in Edit Mode
    photoContainer.addEventListener('click', () => {
        const saveBtn = document.getElementById('saveBtn');
        if (saveBtn.style.display !== 'none') {
            photoInput.click();
        } else {
            // Optional: Tell user they need to click Edit first
            showAlert("Click 'Edit Info' to change photo", "info");
        }
    });
    
    photoInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const file = this.files[0];

            // Limit file size (e.g., 500KB to prevent Database issues)
            if (file.size > 800000) { 
                alert("File is too big! Please select an image under 800KB.");
                this.value = ""; // Clear input
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                // 1. Show preview
                document.getElementById('profileImage').src = e.target.result;
                // 2. Store string to save later
                newPhotoBase64 = e.target.result; 
            }
            reader.readAsDataURL(file);
        }
    });
}

function toggleEditMode(isEditing) {
    const inputs = document.querySelectorAll('.member-form input, .member-form select');
    const editBtn = document.getElementById('editInfoBtn');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelEditBtn');
    const uploadOverlay = document.querySelector('.upload-overlay');

    inputs.forEach(input => {
        if (input.id !== 'memberCode') {
            input.disabled = !isEditing;
        }
    });

    // Show/Hide Upload Overlay on image
    if (uploadOverlay) {
        uploadOverlay.style.opacity = isEditing ? '1' : '0';
        uploadOverlay.style.cursor = isEditing ? 'pointer' : 'default';
    }

    editBtn.style.display = isEditing ? 'none' : 'inline-flex';
    saveBtn.style.display = isEditing ? 'inline-flex' : 'none';
    cancelBtn.style.display = isEditing ? 'inline-flex' : 'none';
}

function calculateAge(dateString) {
    if(!dateString) return '';
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
}

function showAlert(msg, type) {
    const box = document.getElementById('alertMessage');
    box.textContent = msg;
    box.className = `alert ${type === 'success' ? 'alert-success' : 'alert-error'}`;
    box.style.display = 'block';
    setTimeout(() => box.style.display = 'none', 3000);
}