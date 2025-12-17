// ------------------------------------------------------------------
// 1. FIREBASE IMPORTS & CONFIG
// ------------------------------------------------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    updateDoc, 
    deleteDoc,
    query,
    orderBy,
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your Config
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
const staffCollection = collection(db, "TTMPC_STAFF"); 

let allStaffData = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchStaff();
    setupEventListeners();
});

async function fetchStaff() {
    const tableBody = document.getElementById('staffTableBody');
    const totalElem = document.getElementById('totalStaff');
    
    tableBody.innerHTML = '<tr><td colspan="8" style="text-align:center;">Loading staff data...</td></tr>';

    try {
        let q = query(staffCollection, orderBy("createdAt", "desc"));
        let snapshot;
        try {
            snapshot = await getDocs(q);
        } catch {
            snapshot = await getDocs(staffCollection);
        }

        allStaffData = [];
        snapshot.forEach(doc => {
            allStaffData.push({ id: doc.id, ...doc.data() });
        });

        totalElem.textContent = allStaffData.length;
        renderTable(allStaffData);

    } catch (error) {
        console.error("Error fetching staff:", error);
        tableBody.innerHTML = '<tr><td colspan="8" style="text-align:center; color:red;">Failed to load data.</td></tr>';
    }
}

function renderTable(data) {
    const tableBody = document.getElementById('staffTableBody');
    tableBody.innerHTML = "";

    if (data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" style="text-align:center;">No staff members found.</td></tr>';
        return;
    }

    data.forEach(staff => {
        const statusClass = staff.status === "Active" ? "active-badge" : "inactive-badge";
        const displayCode = staff.staffCode || "N/A";

        const row = `
            <tr>
                <td><strong>${displayCode}</strong></td>
                <td><div style="font-weight:600">${staff.firstName} ${staff.lastName}</div></td>
                <td>
                    <div style="font-size:0.85rem">${staff.email}</div>
                    <div style="font-size:0.8rem; color:#64748b">${staff.phone}</div>
                </td>
                <td><span class="role-badge">${staff.role}</span></td>
                <td>${staff.department || "-"}</td>
                <td>${staff.hireDate}</td>
                <td><span class="status-badge ${statusClass}">${staff.status}</span></td>
                <td>
                    <button class="btn btn-edit" onclick="window.openEditModal('${staff.id}')"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn btn-danger" onclick="window.deleteStaff('${staff.id}')"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}


async function handleAddStaff(e) {
    e.preventDefault();
    const btn = document.getElementById('addBtn');
    const form = e.target;
    
    btn.textContent = "Adding...";
    btn.disabled = true;

    const formData = new FormData(form);
    const code = `STF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newStaff = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        role: formData.get('role'),
        department: formData.get('department'),
        hireDate: formData.get('hireDate'),
        salary: formData.get('salary'),
        status: "Active",
        staffCode: code,
        createdAt: serverTimestamp()
    };

    try {
        await addDoc(staffCollection, newStaff);
        showAlert("Staff added successfully!", "success");
        form.reset();
        fetchStaff();
    } catch (err) {
        console.error(err);
        showAlert("Error adding staff.", "error");
    } finally {
        btn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Staff';
        btn.disabled = false;
    }
}


window.openEditModal = function(id) {
    const staff = allStaffData.find(s => s.id === id);
    if (!staff) return;

    document.getElementById('editStaffId').value = id;
    document.getElementById('editFirstName').value = staff.firstName;
    document.getElementById('editLastName').value = staff.lastName;
    document.getElementById('editEmail').value = staff.email;
    document.getElementById('editPhone').value = staff.phone;
    document.getElementById('editRole').value = staff.role;
    document.getElementById('editDepartment').value = staff.department || "";
    document.getElementById('editSalary').value = staff.salary || "";
    document.getElementById('editStatus').value = staff.status;

    document.getElementById('editStaffModal').classList.add('show');
}

window.closeEditModal = function() {
    document.getElementById('editStaffModal').classList.remove('show');
}

async function handleEditSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('editStaffId').value;
    
    const updates = {
        firstName: document.getElementById('editFirstName').value,
        lastName: document.getElementById('editLastName').value,
        email: document.getElementById('editEmail').value,
        phone: document.getElementById('editPhone').value,
        role: document.getElementById('editRole').value,
        department: document.getElementById('editDepartment').value,
        salary: document.getElementById('editSalary').value,
        status: document.getElementById('editStatus').value
    };

    try {
        await updateDoc(doc(db, "TTMPC_STAFF", id), updates);
        showAlert("Staff updated!", "success");
        window.closeEditModal();
        fetchStaff();
    } catch (err) {
        console.error(err);
        showAlert("Update failed.", "error");
    }
}

window.deleteStaff = async function(id) {
    if(!confirm("Delete this staff member?")) return;
    try {
        await deleteDoc(doc(db, "TTMPC_STAFF", id));
        showAlert("Staff deleted.", "success");
        fetchStaff();
    } catch (err) {
        console.error(err);
        showAlert("Delete failed.", "error");
    }
}


function setupEventListeners() {
    document.getElementById('addStaffForm').addEventListener('submit', handleAddStaff);
    document.getElementById('editStaffForm').addEventListener('submit', handleEditSubmit);
    document.getElementById('resetBtn').addEventListener('click', () => {
        document.getElementById('addStaffForm').reset();
    });

    const filterFunc = () => {
        const search = document.getElementById('searchInput').value.toLowerCase();
        const role = document.getElementById('roleFilter').value;
        const status = document.getElementById('statusFilter').value;

        const filtered = allStaffData.filter(s => {
            const nameMatch = (s.firstName + " " + s.lastName).toLowerCase().includes(search);
            const roleMatch = role === "" || s.role === role;
            const statusMatch = status === "" || s.status === status;
            return nameMatch && roleMatch && statusMatch;
        });
        renderTable(filtered);
    };

    document.getElementById('searchInput').addEventListener('input', filterFunc);
    document.getElementById('roleFilter').addEventListener('change', filterFunc);
    document.getElementById('statusFilter').addEventListener('change', filterFunc);
}

function showAlert(msg, type) {
    const box = document.getElementById('alertMessage');
    const text = document.getElementById('alertText');
    box.className = `alert ${type}`;
    text.textContent = msg;
    box.style.display = 'block';
    setTimeout(() => { box.style.display = 'none'; }, 3000);
}