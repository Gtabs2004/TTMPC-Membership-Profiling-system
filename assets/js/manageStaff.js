/* --- Mock Data (Simulating Database) --- */
let staffList = [
    { id: 1, staffCode: "STF001", firstName: "Alice", lastName: "Smith", email: "alice@ttmpc.com", phone: "09170001111", role: "Manager", department: "Administration", hireDate: "2020-03-15", salary: 25000, status: "Active" },
    { id: 2, staffCode: "STF002", firstName: "Bob", lastName: "Jones", email: "bob@ttmpc.com", phone: "09180002222", role: "Cashier", department: "Finance", hireDate: "2021-06-01", salary: 18000, status: "Active" },
    { id: 3, staffCode: "STF003", firstName: "Charlie", lastName: "Brown", email: "charlie@ttmpc.com", phone: "09190003333", role: "Secretary", department: "Operations", hireDate: "2022-01-10", salary: 16000, status: "Active" },
    { id: 4, staffCode: "STF004", firstName: "Diana", lastName: "Prince", email: "diana@ttmpc.com", phone: "09200004444", role: "Treasurer", department: "Finance", hireDate: "2019-11-20", salary: 22000, status: "Inactive" },
    { id: 5, staffCode: "STF005", firstName: "Evan", lastName: "Wright", email: "evan@ttmpc.com", phone: "09210005555", role: "Board of Directors", department: "Board", hireDate: "2018-05-05", salary: 0, status: "Active" }
];

/* --- State Management --- */
let filteredStaff = [...staffList];
let currentPage = 1;
const itemsPerPage = 5;

/* --- Initialization --- */
document.addEventListener('DOMContentLoaded', () => {
    // Setup Listeners
    setupEventListeners();
    
    // Initial Render
    renderTable();
});

/* --- Event Handlers --- */
function setupEventListeners() {
    // Add Staff
    document.getElementById('addStaffForm').addEventListener('submit', handleAddStaff);

    // Edit Staff
    document.getElementById('editStaffForm').addEventListener('submit', handleSaveEdit);

    // Filters
    document.getElementById('searchInput').addEventListener('input', handleFilter);
    document.getElementById('roleFilter').addEventListener('change', handleFilter);
    document.getElementById('statusFilter').addEventListener('change', handleFilter);

    // Reset Form
    document.getElementById('resetAddFormBtn').addEventListener('click', () => {
        document.getElementById('addStaffForm').reset();
    });
}

/* --- Core Logic --- */

// 1. Add Staff
function handleAddStaff(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newId = staffList.length > 0 ? Math.max(...staffList.map(s => s.id)) + 1 : 1;

    const newStaff = {
        id: newId,
        staffCode: `STF${String(newId).padStart(3, '0')}`,
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        role: formData.get('role'),
        department: formData.get('department') || "General",
        hireDate: formData.get('hireDate'),
        salary: parseFloat(formData.get('salary')) || 0,
        status: "Active"
    };

    staffList.unshift(newStaff);
    handleFilter(); // Refresh list
    showAlert('Staff member added successfully!', 'success');
    e.target.reset();
}

// 2. Delete Staff
function deleteStaff(id) {
    if(confirm('Are you sure you want to delete this staff member?')) {
        staffList = staffList.filter(s => s.id !== id);
        handleFilter();
        showAlert('Staff member removed.', 'success');
    }
}

// 3. Edit Staff (Open Modal)
function openEditModal(id) {
    const staff = staffList.find(s => s.id === id);
    if (!staff) return;

    // Fill form
    document.getElementById('editStaffId').value = staff.id;
    document.getElementById('editFirstName').value = staff.firstName;
    document.getElementById('editLastName').value = staff.lastName;
    document.getElementById('editEmail').value = staff.email;
    document.getElementById('editPhone').value = staff.phone;
    document.getElementById('editRole').value = staff.role;
    document.getElementById('editDepartment').value = staff.department;
    document.getElementById('editSalary').value = staff.salary;
    document.getElementById('editStatus').value = staff.status;

    document.getElementById('editStaffModal').classList.add('show');
}

// 4. Save Edit
function handleSaveEdit(e) {
    e.preventDefault();
    const id = parseInt(document.getElementById('editStaffId').value);
    const index = staffList.findIndex(s => s.id === id);

    if (index !== -1) {
        staffList[index].firstName = document.getElementById('editFirstName').value;
        staffList[index].lastName = document.getElementById('editLastName').value;
        staffList[index].email = document.getElementById('editEmail').value;
        staffList[index].phone = document.getElementById('editPhone').value;
        staffList[index].role = document.getElementById('editRole').value;
        staffList[index].department = document.getElementById('editDepartment').value;
        staffList[index].salary = document.getElementById('editSalary').value;
        staffList[index].status = document.getElementById('editStatus').value;

        handleFilter();
        closeEditModal();
        showAlert('Staff details updated.', 'success');
    }
}

function closeEditModal() {
    document.getElementById('editStaffModal').classList.remove('show');
}

/* --- Display & Filtering --- */
function handleFilter() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const role = document.getElementById('roleFilter').value;
    const status = document.getElementById('statusFilter').value;

    filteredStaff = staffList.filter(s => {
        const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
        const matchesSearch = fullName.includes(search) || s.email.toLowerCase().includes(search);
        const matchesRole = role === '' || s.role === role;
        const matchesStatus = status === '' || s.status === status;

        return matchesSearch && matchesRole && matchesStatus;
    });

    currentPage = 1;
    renderTable();
}

function renderTable() {
    const tbody = document.getElementById('staffTableBody');
    const start = (currentPage - 1) * itemsPerPage;
    const paginatedItems = filteredStaff.slice(start, start + itemsPerPage);

    tbody.innerHTML = '';

    if (paginatedItems.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 2rem;">No staff found.</td></tr>`;
        renderPagination();
        return;
    }

    paginatedItems.forEach(s => {
        const row = `
            <tr>
                <td><strong>${s.staffCode}</strong></td>
                <td>
                    <div style="font-weight:600">${s.firstName} ${s.lastName}</div>
                </td>
                <td>
                    <div style="font-size:0.85rem">${s.email}</div>
                    <div style="font-size:0.8rem; color:#64748b">${s.phone}</div>
                </td>
                <td><span class="role-badge">${s.role}</span></td>
                <td>${s.department}</td>
                <td>${s.hireDate}</td>
                <td><span class="status-badge ${s.status.toLowerCase()}">${s.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-edit" onclick="openEditModal(${s.id})" title="Edit">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteStaff(${s.id})" title="Delete">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });

    renderPagination();
}

function renderPagination() {
    const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
    const pagination = document.getElementById('pagination');
    
    let buttons = '';
    for (let i = 1; i <= totalPages; i++) {
        buttons += `<button class="btn btn-sm ${i === currentPage ? 'btn-primary' : 'btn-secondary'}" onclick="goToPage(${i})">${i}</button>`;
    }
    pagination.innerHTML = buttons;
}

function goToPage(page) {
    currentPage = page;
    renderTable();
}

function showAlert(msg, type) {
    const alertBox = document.getElementById('alertMessage');
    const alertText = document.getElementById('alertText');
    
    alertBox.className = `alert ${type}`;
    alertText.innerText = msg;
    alertBox.style.display = 'block';

    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 3000);
}