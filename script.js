/* ==========================================================================
   KARUNA KETAN — PORTFOLIO INTERACTIONS
   Light/Dark Mode, Scroll-to-Top Arrow, Right Scrollspy, Lightbox & GIF Reels
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Light / Dark Mode Toggle (Light Mode Default)
    const themeBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('kk-theme');

    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeBtn) themeBtn.textContent = '☀️';
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            themeBtn.textContent = isDark ? '☀️' : '🌙';
            localStorage.setItem('kk-theme', isDark ? 'dark' : 'light');
        });
    }

    // 2. Mobile Navigation Toggle
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // 3. Global Floating Back-to-Top Arrow Button (Every Page)
    const topBtn = document.createElement('button');
    topBtn.className = 'back-to-top-btn';
    topBtn.setAttribute('aria-label', 'Scroll to top');
    topBtn.setAttribute('title', 'Back to Top');
    topBtn.textContent = '↑';
    document.body.appendChild(topBtn);

    const toggleTopBtn = () => {
        topBtn.classList.toggle('visible', window.scrollY > 360);
    };
    window.addEventListener('scroll', toggleTopBtn, { passive: true });
    toggleTopBtn();

    topBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 4. Right-Side Contents Header Click -> Scroll to Top
    document.querySelectorAll('.toc-heading').forEach(heading => {
        heading.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // 5. Right-Side Contents Scrollspy (Main & Sub-Sections)
    const spyTargets = document.querySelectorAll('.content-section[id], .sub-block-title[id]');
    const tocLinks = document.querySelectorAll('.toc-link');

    if (spyTargets.length > 0 && tocLinks.length > 0) {
        const updateScrollspy = () => {
            let current = '';
            spyTargets.forEach(target => {
                if (window.scrollY >= target.offsetTop - 165) {
                    current = target.getAttribute('id');
                }
            });

            tocLinks.forEach(link => {
                link.classList.toggle('active', Boolean(current && link.getAttribute('href') === '#' + current));
            });
        };

        window.addEventListener('scroll', updateScrollspy, { passive: true });
        updateScrollspy();
    }

    // 6. Collapsible Terracotta Detail Drawers
    document.querySelectorAll('.drawer-header').forEach(header => {
        header.addEventListener('click', () => {
            const drawer = header.closest('.detail-drawer');
            if (drawer) drawer.classList.toggle('open');
        });
    });

    // 7. Mobile-Safe Lightbox Image & GIF Inspector
    const mediaFrames = document.querySelectorAll('.media-frame');
    if (mediaFrames.length > 0) {
        const modal = document.createElement('div');
        modal.className = 'lightbox-modal';
        modal.innerHTML = `
            <button class="lightbox-close" aria-label="Close">CLOSE ✕</button>
            <img src="" alt="">
            <div class="lightbox-caption"></div>
        `;
        document.body.appendChild(modal);

        const modalImg = modal.querySelector('img');
        const modalCaption = modal.querySelector('.lightbox-caption');
        const closeBtn = modal.querySelector('.lightbox-close');

        const closeModal = () => {
            modal.classList.remove('open');
            document.body.style.overflow = '';
            modalImg.src = ''; // Resets GIFs cleanly on close
        };

        mediaFrames.forEach(frame => {
            const img = frame.querySelector('img');
            if (!img) return;

            frame.addEventListener('click', () => {
                const cap = frame.querySelector('.media-caption');
                modalImg.src = img.src;
                modalImg.alt = img.alt || '';
                modalCaption.textContent = cap ? cap.textContent : (img.alt || '');
                modal.classList.add('open');
                document.body.style.overflow = 'hidden';
            });
        });

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
        });
    }

    // 8. Homepage Discipline Filter Tabs
    const filterButtons = document.querySelectorAll('.filter-btn[data-filter]');
    const filterItems = document.querySelectorAll('.project-card[data-category]');
    const categoryDividers = document.querySelectorAll('.category-divider[data-section]');

    if (filterButtons.length > 0 && filterItems.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const target = btn.getAttribute('data-filter');

                filterButtons.forEach(b => b.classList.remove('active-filter'));
                btn.classList.add('active-filter');

                filterItems.forEach(item => {
                    const cats = (item.getAttribute('data-category') || '').split(/\s+/);
                    const isVisible = target === 'all' || cats.includes(target);
                    item.classList.toggle('is-filtered-out', !isVisible);
                    item.style.display = isVisible ? '' : 'none';
                });

                // Hide any category heading whose cards are all filtered out
                categoryDividers.forEach(divider => {
                    const sec = divider.getAttribute('data-section');
                    const visibleInSection = document.querySelectorAll(
                        `.project-card[data-section="${sec}"]:not(.is-filtered-out)`
                    );
                    divider.classList.toggle('is-filtered-out', visibleInSection.length === 0);
                });
            });
        });
    }

    // 9. Continuous Auto-Sliding GIF Reels (No Arrows, No Dots)
    const reels = document.querySelectorAll('.thumb-reel, .hero-slider');
    reels.forEach((reel, reelIndex) => {
        const intervalMs = parseInt(reel.getAttribute('data-interval'), 10) || 3400;
        let currentSlide = 0;

        setTimeout(() => {
            setInterval(() => {
                const slides = reel.querySelectorAll('.thumb-slide, .hero-slide');
                if (slides.length <= 1) return;

                slides.forEach(s => s.classList.remove('active-slide'));
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].classList.add('active-slide');
            }, intervalMs);
        }, reelIndex * 400);
    });
});