// ========================================
// SILVER SAINTS - Main JavaScript
// Minimal / Kill-Tec Style
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    Intro.init();
    Countdown.init();
    NotifyForm.init();
    SmoothScroll.init();
});

// ========================================
// INTRO SCREEN
// ========================================
const Intro = {
    init() {
        const intro = document.getElementById('intro');
        const site = document.getElementById('site');

        // Check if user has already entered
        if (sessionStorage.getItem('silverSaintsEntered')) {
            intro.classList.add('hidden');
            site.classList.add('visible');
            return;
        }

        // Listen for Enter key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.enter();
            }
        });

        // Also allow click to enter
        intro.addEventListener('click', () => {
            this.enter();
        });
    },

    enter() {
        const intro = document.getElementById('intro');
        const site = document.getElementById('site');

        intro.classList.add('hidden');
        site.classList.add('visible');
        sessionStorage.setItem('silverSaintsEntered', 'true');
    }
};

// ========================================
// COUNTDOWN
// ========================================
const Countdown = {
    targetDate: null,

    init() {
        // Set drop date to 2 days from now
        this.targetDate = new Date();
        this.targetDate.setDate(this.targetDate.getDate() + 2);
        this.targetDate.setHours(0, 0, 0, 0);

        this.update();
        setInterval(() => this.update(), 1000);
    },

    update() {
        const now = new Date().getTime();
        const distance = this.targetDate.getTime() - now;

        if (distance <= 0) {
            this.showLive();
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = this.pad(days);
        document.getElementById('hours').textContent = this.pad(hours);
        document.getElementById('minutes').textContent = this.pad(minutes);
        document.getElementById('seconds').textContent = this.pad(seconds);

        // Update product timers
        const timeStr = `${this.pad(hours + days * 24)}:${this.pad(minutes)}:${this.pad(seconds)}`;
        document.querySelectorAll('.lock-time').forEach(el => {
            el.textContent = timeStr;
        });
    },

    pad(num) {
        return num.toString().padStart(2, '0');
    },

    showLive() {
        const countdown = document.getElementById('countdown');
        countdown.innerHTML = '<div class="live">DROP IS LIVE</div>';

        // Unlock products
        document.querySelectorAll('.product-card').forEach(card => {
            card.classList.remove('locked');
        });
    }
};

// ========================================
// NOTIFY FORM
// ========================================
const NotifyForm = {
    init() {
        const input = document.getElementById('emailInput');
        const btn = document.getElementById('notifyBtn');

        if (!btn) return;

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const email = input.value.trim();

            if (this.validate(email)) {
                this.submit(email);
            } else {
                input.style.borderColor = '#ff0000';
                setTimeout(() => {
                    input.style.borderColor = '';
                }, 2000);
            }
        });
    },

    validate(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    submit(email) {
        const input = document.getElementById('emailInput');
        const btn = document.getElementById('notifyBtn');

        // Save email
        localStorage.setItem('silverSaintsEmail', email);

        // Update UI
        input.value = '';
        input.placeholder = 'YOU\'RE ON THE LIST';
        input.disabled = true;
        btn.textContent = 'CONFIRMED';
        btn.disabled = true;
    }
};

// ========================================
// SMOOTH SCROLL
// ========================================
const SmoothScroll = {
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
};