// ========================================
// SILVER SAINTS - Main JavaScript
// Password Entry & Core Functionality
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize loader
    Loader.init();

    // Initialize based on page
    if (document.getElementById('passwordInput')) {
        PasswordGate.init();
    }
    if (document.getElementById('emailPopup')) {
        EmailPopup.init();
    }
    SmoothScroll.init();
    ViewingCounter.init();
});

// ========================================
// LOADER
// ========================================
const Loader = {
    init() {
        const loader = document.getElementById('loader');
        if (!loader) return;

        // Hide loader after page loads
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('hidden');
            }, 1000);
        });

        // Fallback: hide loader after 3 seconds max
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 3000);
    }
};

// ========================================
// VIEWING COUNTER (Fake live viewers)
// ========================================
const ViewingCounter = {
    init() {
        this.counters = document.querySelectorAll('.view-num');
        if (this.counters.length === 0) return;

        // Update counts periodically
        setInterval(() => this.updateCounts(), 5000);
    },

    updateCounts() {
        this.counters.forEach(counter => {
            const current = parseInt(counter.textContent);
            // Random change between -2 and +3
            const change = Math.floor(Math.random() * 6) - 2;
            const newVal = Math.max(1, Math.min(25, current + change));
            counter.textContent = newVal;
        });
    }
};

// ========================================
// PASSWORD GATE (index.html)
// ========================================
const PasswordGate = {
    // Change this password as needed
    PASSWORD: 'saints',

    init() {
        const input = document.getElementById('passwordInput');
        const btn = document.getElementById('enterBtn');
        const error = document.getElementById('passwordError');

        if (!input || !btn) return;

        // Check if already authenticated this session
        if (sessionStorage.getItem('silverSaintsAuth')) {
            window.location.href = 'collection.html';
            return;
        }

        // Enter button click
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            this.validate();
        });

        // Enter key press
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.validate();
            }
        });

        // Clear error on input
        input.addEventListener('input', () => {
            error.textContent = '';
            error.classList.remove('visible');
        });
    },

    validate() {
        const input = document.getElementById('passwordInput');
        const error = document.getElementById('passwordError');
        const password = input.value.trim().toLowerCase();

        if (password === this.PASSWORD) {
            sessionStorage.setItem('silverSaintsAuth', 'true');
            document.getElementById('intro').classList.add('fade-out');
            setTimeout(() => {
                window.location.href = 'collection.html';
            }, 500);
        } else {
            error.textContent = 'INVALID PASSWORD';
            error.classList.add('visible');
            input.value = '';
            input.focus();
        }
    }
};

// ========================================
// EMAIL POPUP (collection.html)
// ========================================
const EmailPopup = {
    init() {
        const popup = document.getElementById('emailPopup');
        const closeBtn = document.getElementById('popupClose');
        const form = document.getElementById('popupForm');
        const success = document.getElementById('popupSuccess');

        if (!popup) return;

        // Check if already subscribed
        if (localStorage.getItem('silverSaintsSubscribed')) {
            return;
        }

        // Show popup after 5 seconds
        setTimeout(() => {
            popup.classList.add('visible');
        }, 5000);

        // Close button
        closeBtn.addEventListener('click', () => {
            popup.classList.remove('visible');
        });

        // Click outside to close
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.classList.remove('visible');
            }
        });

        // Form submit
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('popupEmail').value.trim();

            if (this.validateEmail(email)) {
                localStorage.setItem('silverSaintsSubscribed', 'true');
                localStorage.setItem('silverSaintsEmail', email);
                form.style.display = 'none';
                success.textContent = 'WELCOME TO THE CONGREGATION';
                success.classList.add('visible');

                setTimeout(() => {
                    popup.classList.remove('visible');
                }, 2000);
            }
        });
    },

    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
};

// ========================================
// SMOOTH SCROLL
// ========================================
const SmoothScroll = {
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
};
