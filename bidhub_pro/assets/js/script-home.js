document.addEventListener('DOMContentLoaded', () => {

    // --- SCROLL SUAVE PARA ÂNCORAS ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- ANIMAÇÃO DINÂMICA AO ROLAR A PÁGINA ---
    const animatedSections = document.querySelectorAll('.fade-in-section');

    if (animatedSections.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        animatedSections.forEach(section => {
            observer.observe(section);
        });
    }
});