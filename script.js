document.addEventListener('DOMContentLoaded', () => {
    // 1. SMOOTH SCROLLING
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href').startsWith("#")) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 2. IMAGE SLIDER (AUTO PLAY)
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.getElementById('dotsContainer');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const wrapper = document.querySelector('.slider-wrapper');
    
    let currentSlide = 0;
    let slideInterval;

    if (slides.length > 0 && wrapper) {
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => { goToSlide(index); resetTimer(); });
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.dot');

        function updateSlider() {
            wrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
            dots.forEach(dot => dot.classList.remove('active'));
            if(dots[currentSlide]) dots[currentSlide].classList.add('active');
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            updateSlider();
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateSlider();
        }

        function goToSlide(index) {
            currentSlide = index;
            updateSlider();
        }

        function startTimer() {
            slideInterval = setInterval(nextSlide, 3500); 
        }

        function resetTimer() {
            clearInterval(slideInterval);
            startTimer();
        }

        if (nextBtn) { nextBtn.addEventListener('click', () => { nextSlide(); resetTimer(); }); }
        if (prevBtn) { prevBtn.addEventListener('click', () => { prevSlide(); resetTimer(); }); }

        startTimer();
    }
});

// 3. PDF VIEWER LOGIC
function openPDF(file) {
    document.getElementById("viewer").style.display = "block";
    document.getElementById("pdfFrame").src = file;
    document.body.style.overflow = "hidden"; // Stop background scroll
}

function closePDF() {
    document.getElementById("viewer").style.display = "none";
    document.getElementById("pdfFrame").src = "";
    document.body.style.overflow = "auto"; // Restore background scroll
}