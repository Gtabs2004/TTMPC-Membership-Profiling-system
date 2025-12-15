/* ==============================
   STATIC DASHBOARD JAVASCRIPT
   (UI ONLY – NO DATA / NO BACKEND)
================================ */

/* Optional: Static Clock Display */
(function () {
    const timeEl = document.getElementById('currentTime');
    if (!timeEl) return;

    function updateTime() {
        const now = new Date();
        timeEl.textContent = now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    updateTime();
})();

/* User Profile Dropdown (UI only) */
(function () {
    const profile = document.querySelector('.user-profile');
    const dropdown = document.querySelector('.dropdown-menu');

    if (!profile || !dropdown) return;

    profile.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('show');
    });

    document.addEventListener('click', () => {
        dropdown.classList.remove('show');
    });
})();

/* Optional: Animation trigger (STATIC FEEL) */
(function () {
    const sidebar = document.querySelector('.sidebar');
    const main = document.querySelector('.main-content');
    const stats = document.querySelectorAll('.stat-card');
    const tables = document.querySelectorAll('.table-container');

    sidebar?.classList.add('animate');
    main?.classList.add('animate');

    stats.forEach((card, i) => {
        setTimeout(() => card.classList.add('animate'), i * 120);
    });

    tables.forEach((table, i) => {
        setTimeout(() => table.classList.add('animate'), i * 180);
    });
})();
