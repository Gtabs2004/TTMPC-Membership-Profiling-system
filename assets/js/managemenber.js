// ------------------------------------------------------------------
// 1. FIREBASE IMPORTS & CONFIG
// ------------------------------------------------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    getDocs, 
    doc, 
    deleteDoc,
    query,
    orderBy 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
const db = getFirestore(app);
const membersCollection = collection(db, "TTMPC_MEMBERS");

// ------------------------------------------------------------------
// 2. INITIALIZATION
// ------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    fetchMembers(); // Load data when page opens
    setupDropdown();
    setupSearchListeners();
});

// ------------------------------------------------------------------
// 3. FETCH & RENDER DATA
// ------------------------------------------------------------------
let allMembersData = []; // Store data locally for search/filter

async function fetchMembers() {
    const tableBody = document.getElementById('memberTableBody');
    const totalCount = document.getElementById('totalMembers');
    
    // Show Loading State
    tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Loading data...</td></tr>';

    try {
        // Fetch from Firebase
        // Note: If you haven't created a 'createdAt' index yet, this might error. 
        // If it fails, we fall back to standard fetching.
        let querySnapshot;
        try {
            const q = query(membersCollection, orderBy("createdAt", "desc")); 
            querySnapshot = await getDocs(q);
        } catch (idxError) {
            console.warn("Index not found, fetching unordered:", idxError);
            querySnapshot = await getDocs(membersCollection);
        }

        allMembersData = []; // Reset local storage

        querySnapshot.forEach((doc) => {
            allMembersData.push({ id: doc.id, ...doc.data() });
        });

        // Update Total Count
        totalCount.textContent = allMembersData.length;

        // Render Table
        renderTable(allMembersData);

    } catch (error) {
        console.error("Error fetching members:", error);
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:red;">Error loading data.</td></tr>';
    }
}

function renderTable(data) {
    const tableBody = document.getElementById('memberTableBody');
    tableBody.innerHTML = ""; // Clear existing rows

    if (data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No members found.</td></tr>';
        return;
    }

    data.forEach(member => {
        // CHANGED: Display Email instead of Income
        const emailDisplay = member.email || "No Email Provided";

        const row = `
            <tr>
                <td>${member.memberCode || "PENDING"}</td>
                <td>
                    <div style="font-weight:600">${member.lastName}, ${member.firstName}</div>
                </td>
                <td>${member.dateJoined || "N/A"}</td>
                <td>${member.gender || "N/A"}</td>
                <td>${emailDisplay}</td>
                <td>
                    <a href="editMember.html?id=${member.id}" class="btn btn-edit" title="Edit">
                        <i class="fas fa-edit"></i>
                    </a>
                    <button class="btn btn-delete" title="Delete" onclick="window.deleteMember('${member.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// ------------------------------------------------------------------
// 4. DELETE FUNCTION
// ------------------------------------------------------------------
// We attach this to 'window' so the onclick in the HTML string can find it
window.deleteMember = async function(id) {
    if (!confirm("Are you sure you want to delete this member? This cannot be undone.")) return;

    // Optional: Visual feedback on the button
    // (We can't easily target the specific button from here without the event object, 
    // so we just rely on the alert/refresh)

    try {
        await deleteDoc(doc(db, "TTMPC_MEMBERS", id));
        alert("Member deleted successfully.");
        
        // Remove from local array and re-render (faster than re-fetching)
        allMembersData = allMembersData.filter(m => m.id !== id);
        document.getElementById('totalMembers').textContent = allMembersData.length;
        renderTable(allMembersData);
        
    } catch (error) {
        console.error("Error deleting document: ", error);
        alert("Failed to delete member. Check console for details.");
    }
}

// ------------------------------------------------------------------
// 5. SEARCH & FILTER LOGIC
// ------------------------------------------------------------------
function setupSearchListeners() {
    const searchBtn = document.getElementById('searchBtn');
    const clearBtn = document.getElementById('clearBtn');

    searchBtn.addEventListener('click', filterMembers);
    
    // Allow pressing "Enter" in search box
    document.getElementById('searchInput').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submit refresh
            filterMembers();
        }
    });

    clearBtn.addEventListener('click', () => {
        document.querySelector('.search-section').reset();
        renderTable(allMembersData);
    });
}

function filterMembers() {
    const searchVal = document.getElementById('searchInput').value.toLowerCase();
    const genderVal = document.getElementById('genderFilter').value;

    const filtered = allMembersData.filter(member => {
        // 1. Text Search (Checks Name OR Email)
        const fullName = `${member.lastName} ${member.firstName}`.toLowerCase();
        const email = (member.email || "").toLowerCase();
        
        const matchesSearch = fullName.includes(searchVal) || email.includes(searchVal);

        // 2. Gender Check
        const matchesGender = genderVal === "" || member.gender === genderVal;

        return matchesSearch && matchesGender;
    });

    renderTable(filtered);
}

// ------------------------------------------------------------------
// 6. UI DROPDOWN LOGIC
// ------------------------------------------------------------------
function setupDropdown() {
    const userProfile = document.getElementById('userProfile');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const logoutBtn = document.querySelector('.logout'); // Select the logout button

    if(userProfile && dropdownMenu) {
        // Toggle dropdown
        userProfile.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!userProfile.contains(e.target)) {
                dropdownMenu.classList.remove('show');
            }
        });
    }

    // Logout Functionality
    if(logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Stop any default link behavior
            if(confirm("Are you sure you want to logout?")) {
                // Redirect to login page (assuming index.html is your login)
                window.location.href = "index.html"; 
            }
        });
    }
}