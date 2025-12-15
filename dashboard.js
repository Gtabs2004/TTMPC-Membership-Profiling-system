// Grab elements
const userProfile = document.getElementById('userProfile');
const dropdownMenu = document.getElementById('dropdownMenu');

// Toggle dropdown when clicking the profile
userProfile.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent document click from firing
    dropdownMenu.classList.toggle('show');
});

// Close dropdown when clicking anywhere else
document.addEventListener('click', (e) => {
    if (dropdownMenu.classList.contains('show')) {
        dropdownMenu.classList.remove('show');
    }
});
