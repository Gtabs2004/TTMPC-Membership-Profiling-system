/* --- Mock Data (Simulating Database) --- */
let members = [
    { id: 1, memberCode: "MEM2025001", firstName: "Maria", middleName: "Santos", lastName: "Cruz", gender: "Female", dateOfBirth: "1985-05-15", contactNumber: "+639171234567", email: "maria@test.com", status: "Active", dateJoined: "2023-01-10", civilStatus: "Married", occupation: "Teacher", permanentAddress: "Tubungan, Iloilo" },
    { id: 2, memberCode: "MEM2025002", firstName: "Jose", middleName: "R.", lastName: "Rizal", gender: "Male", dateOfBirth: "1990-06-19", contactNumber: "+639181234567", email: "jose@test.com", status: "Active", dateJoined: "2023-02-15", civilStatus: "Single", occupation: "Doctor", permanentAddress: "Tubungan, Iloilo" },
    { id: 3, memberCode: "MEM2025003", firstName: "Juan", middleName: "D.", lastName: "Dela Cruz", gender: "Male", dateOfBirth: "1975-12-01", contactNumber: "+639191234567", email: "juan@test.com", status: "Inactive", dateJoined: "2022-11-05", civilStatus: "Married", occupation: "Farmer", permanentAddress: "Igbaras, Iloilo" },
    { id: 4, memberCode: "MEM2025004", firstName: "Ana", middleName: "L.", lastName: "Reyes", gender: "Female", dateOfBirth: "1995-08-20", contactNumber: "+639201234567", email: "ana@test.com", status: "Active", dateJoined: "2024-01-05", civilStatus: "Single", occupation: "Nurse", permanentAddress: "Leon, Iloilo" }
];

/* --- State Management --- */
let filteredMembers = [...members];
let currentPage = 1;
const itemsPerPage = 5;

/* --- Initialization --- */
document.addEventListener('DOMContentLoaded', () => {
    // Init Date Pickers
    flatpickr(".date-picker", {
        dateFormat: "Y-m-d",
        maxDate: "today"
    });

    // Event Listeners
    setupEventListeners();
    
    // Initial Render
    renderTable();
    
    // Auto-set Date Joined to today
    document.getElementById('dateJoined').value = new Date().toISOString().split('T')[0];
});

/* --- Event Handlers --- */
function setupEventListeners() {
    // Add Member
    document.getElementById('addMemberForm').addEventListener('submit', handleAddMember);
    
    // Edit Member
    document.getElementById('editMemberForm').addEventListener('submit', handleSaveEdit);
    
    // Search & Filter
    document.getElementById('searchInput').addEventListener('input', handleFilter);
    document.getElementById('genderFilter').addEventListener('change', handleFilter);
    document.getElementById('statusFilter').addEventListener('change', handleFilter);

    // Reset Button
    document.getElementById('resetAddFormBtn').addEventListener('click', () => {
        document.getElementById('addMemberForm').reset();
        document.getElementById('age').value = '';
    });

    // Calculate Age on input change
    document.getElementById('dateOfBirth').addEventListener('change', function() {
        const age = calculateAge(this.value);
        document.getElementById('age').value = age;
    });
}

/* --- Core Logic --- */

// 1. Add Member
function handleAddMember(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const newId = members.length > 0 ? Math.max(...members.map(m => m.id)) + 1 : 1;
    
    const newMember = {
        id: newId,
        memberCode: `MEM2025${String(newId).padStart(3, '0')}`,
        firstName: formData.get('firstName'),
        middleName: formData.get('middleName'),
        lastName: formData.get('lastName'),
        gender: formData.get('gender'),
        dateOfBirth: formData.get('dateOfBirth'),
        contactNumber: formData.get('contactNumber'),
        email: formData.get('emailAddress'),
        civilStatus: formData.get('civilStatus'),
        occupation: formData.get('occupation'),
        permanentAddress: formData.get('permanentAddress'),
        dateJoined: formData.get('dateJoined'),
        status: 'Active' // Default
    };

    members.unshift(newMember); // Add to top
    filteredMembers = [...members]; // Reset filters
    
    showAlert('Member added successfully!', 'success');
    e.target.reset();
    renderTable();
}

// 2. Delete Member
function deleteMember(id) {
    if(confirm('Are you sure you want to delete this member?')) {
        members = members.filter(m => m.id !== id);
        handleFilter(); // Re-apply current filters
        showAlert('Member deleted.', 'success');
    }
}

// 3. Edit Member (Open Modal)
function openEditModal(id) {
    const member = members.find(m => m.id === id);
    if (!member) return;

    // Populate Form
    document.getElementById('editMemberId').value = member.id;
    document.getElementById('editFirstName').value = member.firstName;
    document.getElementById('editLastName').value = member.lastName;
    document.getElementById('editContactNumber').value = member.contactNumber;
    document.getElementById('editEmailAddress').value = member.email;
    document.getElementById('editStatus').value = member.status;

    document.getElementById('editMemberModal').classList.add('show');
}

// 4. Save Edit
function handleSaveEdit(e) {
    e.preventDefault();
    const id = parseInt(document.getElementById('editMemberId').value);
    const memberIndex = members.findIndex(m => m.id === id);

    if (memberIndex !== -1) {
        members[memberIndex].firstName = document.getElementById('editFirstName').value;
        members[memberIndex].lastName = document.getElementById('editLastName').value;
        members[memberIndex].contactNumber = document.getElementById('editContactNumber').value;
        members[memberIndex].email = document.getElementById('editEmailAddress').value;
        members[memberIndex].status = document.getElementById('editStatus').value;

        handleFilter(); // Refresh view
        closeEditModal();
        showAlert('Member updated successfully.', 'success');
    }
}

function closeEditModal() {
    document.getElementById('editMemberModal').classList.remove('show');
}

/* --- Display & Utilities --- */

function handleFilter() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const gender = document.getElementById('genderFilter').value;
    const status = document.getElementById('statusFilter').value;

    filteredMembers = members.filter(m => {
        const matchesSearch = (m.firstName + ' ' + m.lastName).toLowerCase().includes(search) || 
                              m.memberCode.toLowerCase().includes(search);
        const matchesGender = gender === '' || m.gender === gender;
        const matchesStatus = status === '' || m.status === status;
        
        return matchesSearch && matchesGender && matchesStatus;
    });

    currentPage = 1;
    renderTable();
}

function renderTable() {
    const tbody = document.getElementById('memberTableBody');
    const start = (currentPage - 1) * itemsPerPage;
    const paginatedItems = filteredMembers.slice(start, start + itemsPerPage);

    tbody.innerHTML = '';

    if (paginatedItems.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2rem;">No members found.</td></tr>`;
        return;
    }

    paginatedItems.forEach(m => {
        const row = `
            <tr>
                <td><strong>${m.memberCode}</strong></td>
                <td>
                    <div style="font-weight:600">${m.lastName}, ${m.firstName}</div>
                    <div style="font-size:0.8rem; color:#64748b">${m.email || ''}</div>
                </td>
                <td>${m.gender}</td>
                <td>${m.contactNumber}</td>
                <td>${m.dateJoined}</td>
                <td>
                    <span class="status-badge ${m.status.toLowerCase()}">${m.status}</span>
                </td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="openEditModal(${m.id})">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteMember(${m.id})">
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
    const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
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
    }, 3000);
}