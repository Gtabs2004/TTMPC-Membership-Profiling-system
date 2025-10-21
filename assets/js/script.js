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
