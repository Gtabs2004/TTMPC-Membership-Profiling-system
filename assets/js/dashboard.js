// ------------------------------------------------------------------
// 1. FIREBASE IMPORTS & CONFIG
// ------------------------------------------------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    getDocs, 
    query, 
    where,
    orderBy,
    limit 
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Collections
const membersCollection = collection(db, "TTMPC_MEMBERS");
const staffCollection = collection(db, "TTMPC_STAFF");

// ------------------------------------------------------------------
// 2. INITIALIZATION
// ------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // Start Real-Time Clock
    updateDateDisplay(); 
    setInterval(updateDateDisplay, 1000); // Update every 1 second

    loadDashboardStats();
    loadStaffTable();
    loadRecentMembersTable();
    setupDropdown();
});

// ------------------------------------------------------------------
// 3. LOAD STATS
// ------------------------------------------------------------------
async function loadDashboardStats() {
    try {
        // 1. Total Members
        const membersSnap = await getDocs(membersCollection);
        const totalMembers = membersSnap.size;
        document.getElementById('totalMembersCount').textContent = totalMembers;

        // 2. Staff Count
        const staffSnap = await getDocs(staffCollection);
        document.getElementById('staffMembersCount').textContent = staffSnap.size;

        // 3. Active Members
        const activeQuery = query(membersCollection, where("status", "==", "Active"));
        const activeSnap = await getDocs(activeQuery);
        document.getElementById('activeMembersCount').textContent = activeSnap.size;

    } catch (error) {
        console.error("Error loading stats:", error);
    }
}

// ------------------------------------------------------------------
// 4. LOAD STAFF TABLE (Top 5)
// ------------------------------------------------------------------
async function loadStaffTable() {
    const tbody = document.getElementById('staffTableBody');
    
    try {
        const q = query(staffCollection, limit(5)); 
        const querySnapshot = await getDocs(q);

        tbody.innerHTML = ""; 

        if (querySnapshot.empty) {
            tbody.innerHTML = "<tr><td colspan='4'>No staff found.</td></tr>";
            return;
        }

        querySnapshot.forEach(doc => {
            const data = doc.data();
            const statusClass = (data.status === 'Active') ? 'status active' : 'status inactive';
            
            const row = `
                <tr>
                    <td>${data.firstName} ${data.lastName}</td>
                    <td>${data.role || "N/A"}</td>
                    <td>${data.department || "N/A"}</td>
                    <td><span class="${statusClass}">${data.status}</span></td>
                </tr>
            `;
            tbody.innerHTML += row;
        });

    } catch (error) {
        console.error("Error loading staff:", error);
        tbody.innerHTML = "<tr><td colspan='4'>Error loading data.</td></tr>";
    }
}

// ------------------------------------------------------------------
// 5. LOAD RECENT MEMBERS TABLE (Top 5 by Created Date)
// ------------------------------------------------------------------
async function loadRecentMembersTable() {
    const tbody = document.getElementById('recentMembersTableBody');

    try {
        const q = query(membersCollection, orderBy("createdAt", "desc"), limit(5));
        
        let querySnapshot;
        try {
            querySnapshot = await getDocs(q);
        } catch (idxError) {
            console.warn("Index missing, fetching unordered.");
            const fallbackQ = query(membersCollection, limit(5));
            querySnapshot = await getDocs(fallbackQ);
        }

        tbody.innerHTML = "";

        if (querySnapshot.empty) {
            tbody.innerHTML = "<tr><td colspan='5'>No members found.</td></tr>";
            return;
        }

        querySnapshot.forEach(doc => {
            const data = doc.data();
            const statusClass = (data.status === 'Active') ? 'status active' : 'status inactive';
            
            const row = `
                <tr>
                    <td>${data.memberCode || "PENDING"}</td>
                    <td>${data.firstName} ${data.lastName}</td>
                    <td>${data.dateJoined || "N/A"}</td>
                    <td><span class="${statusClass}">${data.status}</span></td>
                    <td>${data.migsStatus || "N/A"}</td>
                </tr>
            `;
            tbody.innerHTML += row;
        });

    } catch (error) {
        console.error("Error loading members:", error);
        tbody.innerHTML = "<tr><td colspan='5'>Error loading data.</td></tr>";
    }
}

// ------------------------------------------------------------------
// 6. UTILITIES (Real-Time Clock & Dropdown & Logout)
// ------------------------------------------------------------------
function updateDateDisplay() {
    const dateElement = document.getElementById('timeDisplay');
    const now = new Date();
    
    // Format: Monday, January 1, 2025 · 10:00:05 AM
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    };
    
    dateElement.textContent = now.toLocaleDateString('en-US', options);
}

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