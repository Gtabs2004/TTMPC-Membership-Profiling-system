const userProfile = document.getElementById("userProfile");
  const dropdownMenu = document.getElementById("dropdownMenu");

  userProfile.addEventListener("click", () => {
    dropdownMenu.classList.toggle("show");
    userProfile.classList.toggle("open");
  });