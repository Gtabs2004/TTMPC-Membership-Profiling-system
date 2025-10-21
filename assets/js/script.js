function toggleInfo(card) {
    const extraInfo = card.querySelector('.extra-info');
    const toggleBtn = card.querySelector('.info-toggle');
    const toggleText = toggleBtn.querySelector('.toggle-text');
    
    extraInfo.classList.toggle('active');
    
    toggleText.textContent = extraInfo.classList.contains('active')
        ? 'Show Less'
        : 'Learn More';
}

// Parallax effect
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.team-card');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    cards.forEach((card, index) => {
        const depth = (index + 1) * 5;
        const moveX = (mouseX - 0.5) * depth;
        const moveY = (mouseY - 0.5) * depth;
        card.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
});
function toggleInfo(card) {
    const extraInfo = card.querySelector('.extra-info');
    const toggleBtn = card.querySelector('.info-toggle');
    const toggleText = toggleBtn.querySelector('.toggle-text');
    
    extraInfo.classList.toggle('active');
    
    toggleText.textContent = extraInfo.classList.contains('active')
        ? 'Show Less'
        : 'Learn More';
}

// Parallax effect
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.team-card');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    cards.forEach((card, index) => {
        const depth = (index + 1) * 5;
        const moveX = (mouseX - 0.5) * depth;
        const moveY = (mouseY - 0.5) * depth;
        card.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
});

// Scroll animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 1s ease forwards';
        }
    });
}, observerOptions);

document.querySelectorAll('.team-card').forEach(card => {
    observer.observe(card);
});


 const developers = {
  dev1: {
    name: "Lorraine Angel Castor",
    role: "Front-End Developer",
    email: "lorraine.castor@ttmpc.com",
    expertise: "HTML, CSS, JavaScript, firebase,Sql, UI Design",
    bio: "Lorraine is a front-end developer who specializes in building responsive, visually appealing, and user-friendly interfaces. She focuses on delivering seamless user experiences through clean and efficient code.",
    photo:"assets/img/LORRAINE.png"
  },
  dev2: {
    name: "Gero Antoni Tabiolo",
    role: "Backend Developer",
    email: "gero.tabiolo@ttmpc.com",
    expertise: "Python, firebase,Php, Javascript, HTML,CSS",
    bio: "Gero specializes in building robust server-side applications and APIs with a strong focus on performance, scalability, and security.",
    photo: "assets/img/gero.png"
  },
  dev3: {
    name: "Leanne Joy Libardad",
    role: "Front-End Developer",
    email: "leanne.libertad@ttmpc.com",
    expertise:  "Figma,HTML,CSS,Javascript, firebase, Prototyping",
    bio: "Leanne is a creative UI/UX designer who turns ideas into intuitive and visually appealing digital experiences.",
    photo:"assets/img/LEANNE.png"
  }
};

    function openModal(devId) {
      const dev = developers[devId];
      document.getElementById('modalName').textContent = dev.name;
      document.getElementById('modalRole').textContent = dev.role;
      document.getElementById('modalEmail').textContent = dev.email;
      document.getElementById('modalExpertise').textContent = dev.expertise;
      document.getElementById('modalBio').textContent = dev.bio;
      document.getElementById('modalPhoto').src = dev.photo;
      document.getElementById('modal').classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      document.getElementById('modal').classList.remove('active');
      document.body.style.overflow = 'auto';
    }

    function closeModalOnBackdrop(event) {
      if (event.target.id === 'modal') closeModal();
    }

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeModal();
    });