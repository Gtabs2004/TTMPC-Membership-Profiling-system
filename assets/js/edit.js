/* --- Mock Data (Simulates Database Record) --- */
// In a real app, you would fetch this based on the URL ID parameter
const memberData = {
    memberCode: "MEM2025001",
    firstName: "Juan",
    lastName: "Dela Cruz",
    middleName: "Santos",
    maidenName: "",
    gender: "Male",
    civilStatus: "Married",
    dateOfBirth: "1985-05-15",
    placeOfBirth: "Tubungan, Iloilo",
    religion: "Roman Catholic",
    citizenship: "Filipino",
    bloodType: "O+",
    height: 170,
    weight: 70,
    migsStatus: "Regular",
    membershipNumber: "123-456",
    dateOfMembership: "2020-01-10",
    bodResolution: "RES-2020-005",
    shares: 50,
    amount: 5000.00,
    initialCapital: 2000.00,
    isTerminated: "no",
    terminationRes: "",
    terminationDate: ""
};

/* --- Initialization --- */
document.addEventListener('DOMContentLoaded', () => {
    populateForm();
    setupEventListeners();
});

/* --- Functions --- */

function populateForm() {
    // Header Info
    document.getElementById('displayName').textContent = `${memberData.firstName} ${memberData.lastName}`;
    document.getElementById('displayMemberCode').textContent = memberData.memberCode;
    
    // Personal Info Inputs
    document.getElementById('last_name').value = memberData.lastName;
    document.getElementById('first_name').value = memberData.firstName;
    document.getElementById('middle_name').value = memberData.middleName;
    document.getElementById('maiden_name').value = memberData.maidenName;
    document.getElementById('gender').value = memberData.gender;
    document.getElementById('civil_status').value = memberData.civilStatus;
    document.getElementById('date_of_birth').value = memberData.dateOfBirth;
    document.getElementById('place_of_birth').value = memberData.placeOfBirth;
    document.getElementById('religion').value = memberData.religion;
    document.getElementById('citizenship').value = memberData.citizenship;
    document.getElementById('blood_type').value = memberData.bloodType;
    document.getElementById('height').value = memberData.height;
    document.getElementById('weight').value = memberData.weight;
    document.getElementById('MIGS_Status').value = memberData.migsStatus;

    // Membership Info Inputs
    document.getElementById('membership_number').value = memberData.membershipNumber;
    document.getElementById('date_of_membership').value = memberData.dateOfMembership;
    document.getElementById('bod_resolution_number').value = memberData.bodResolution;
    document.getElementById('number_of_shares').value = memberData.shares;
    document.getElementById('amount').value = memberData.amount;
    document.getElementById('initial_paid_up_capital').value = memberData.initialCapital;
    document.getElementById('is_terminated').value = memberData.isTerminated;

    // Termination Fields Logic
    toggleTerminationFields();
}

function setupEventListeners() {
    const editBtn = document.getElementById('editInfoBtn');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelEditBtn');
    const formInputs = document.querySelectorAll('.member-form input, .member-form select');
    const terminationSelect = document.getElementById('is_terminated');
    const photoContainer = document.querySelector('.profile-avatar');
    const photoInput = document.getElementById('profile-photo-input');

    // 1. Enable Edit Mode
    editBtn.addEventListener('click', () => {
        formInputs.forEach(input => input.disabled = false);
        
        editBtn.style.display = 'none';
        saveBtn.style.display = 'inline-flex';
        cancelBtn.style.display = 'inline-flex';
        
        // Keep ID fields disabled usually
        document.getElementById('membership_number').disabled = true;
    });

    // 2. Cancel Edit
    cancelBtn.addEventListener('click', () => {
        if(confirm("Discard changes?")) {
            location.reload(); // Simplest way to reset
        }
    });

    // 3. Save Changes
    document.getElementById('memberForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simulate API call delay
        saveBtn.textContent = 'Saving...';
        
        setTimeout(() => {
            // Success State
            showAlert("Changes saved successfully!", "success");
            
            // Re-lock form
            formInputs.forEach(input => input.disabled = true);
            editBtn.style.display = 'inline-flex';
            saveBtn.style.display = 'none';
            cancelBtn.style.display = 'none';
            saveBtn.textContent = 'Save Changes'; // Reset text
            saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes'; // Reset icon
            
            // Update Header Name immediately to reflect changes
            const newFirst = document.getElementById('first_name').value;
            const newLast = document.getElementById('last_name').value;
            document.getElementById('displayName').textContent = `${newFirst} ${newLast}`;
            
        }, 800);
    });

    // 4. Toggle Termination Fields
    terminationSelect.addEventListener('change', toggleTerminationFields);

    // 5. Image Upload Simulation
    photoContainer.addEventListener('click', () => photoInput.click());
    
    photoInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('profileImage').src = e.target.result;
            }
            reader.readAsDataURL(this.files[0]);
        }
    });
}

function toggleTerminationFields() {
    const isTerminated = document.getElementById('is_terminated').value;
    const termFields = document.getElementById('terminationFields');
    const termInputs = termFields.querySelectorAll('input');

    if (isTerminated === 'yes') {
        termFields.style.display = 'block';
        // If we are in edit mode (save button is visible), enable these fields
        if(document.getElementById('saveBtn').style.display !== 'none') {
            termInputs.forEach(input => input.disabled = false);
        }
    } else {
        termFields.style.display = 'none';
    }
}

function showAlert(msg, type) {
    const alertBox = document.getElementById('alertMessage');
    alertBox.className = `alert ${type === 'success' ? 'alert-success' : 'alert-error'}`;
    alertBox.textContent = msg;
    alertBox.style.display = 'block';

    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 3000);
}