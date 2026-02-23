document.addEventListener('DOMContentLoaded', () => {
    
    // 1. MOBILE MENU TOGGLE (With click-outside fixes applied)
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevents instant closing
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Prevent scrolling when menu is open
            if (navLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });

        // Close menu when clicking anywhere outside of it
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        // Close menu when a link is clicked
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }

    // 2. SMOOTH SCROLLING
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href').startsWith("#")) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 3. IMAGE SLIDER
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

// 4. GLOBAL PDF & IMAGE VIEWER FUNCTIONS
function openPDF(file) {
    const viewer = document.getElementById("viewer");
    if(viewer) {
        viewer.style.display = "block";
        document.getElementById("pdfFrame").src = file;
        document.body.style.overflow = "hidden";
    }
}

function closePDF() {
    const viewer = document.getElementById("viewer");
    if(viewer) {
        viewer.style.display = "none";
        document.getElementById("pdfFrame").src = "";
        document.body.style.overflow = "auto";
    }
}

function openImage(src) {
    const viewer = document.getElementById('imageViewer');
    const fullImg = document.getElementById('fullImage');
    if(viewer && fullImg) {
        fullImg.src = src;
        viewer.style.display = 'flex';
        setTimeout(() => { viewer.style.opacity = '1'; }, 10);
        document.body.style.overflow = 'hidden';
    }
}

function closeImage() {
    const viewer = document.getElementById('imageViewer');
    if(viewer) {
        viewer.style.opacity = '0';
        setTimeout(() => {
            viewer.style.display = 'none';
            document.getElementById('fullImage').src = "";
            document.body.style.overflow = 'auto';
        }, 300);
    }
}