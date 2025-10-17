document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.querySelector('.nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }

    // Закрывать меню при клике на ссылку
    const navLinks = document.querySelectorAll('.nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
        });
    });

    // Добавляем эффект рукописного текста для заголовков
    const handwrittenElements = document.querySelectorAll('h1, h2, h3');
    handwrittenElements.forEach(el => {
        el.style.opacity = '0';
        setTimeout(() => {
            el.style.transition = 'opacity 0.5s ease';
            el.style.opacity = '1';
        }, 100);
    });
});