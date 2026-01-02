// ========================================
// SILVER SAINTS - Main JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    Loader.init();
    CursorTrail.init();
    Countdown.init();
    QueueSystem.init();
    LoreNavigation.init();
    ScrollAnimations.init();
    Navigation.init();
});

// ========================================
// LOADER
// ========================================
const Loader = {
    init() {
        const loader = document.getElementById('loader');

        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }, 2500);
        });
    }
};

// ========================================
// CUSTOM CURSOR TRAIL
// ========================================
const CursorTrail = {
    init() {
        const cursor = document.querySelector('.cursor-trail');

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
        });
    }
};

// ========================================
// COUNTDOWN TIMER
// ========================================
const Countdown = {
    targetDate: null,

    init() {
        // Set drop date to 2 days from now at midnight
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
            // Drop is live
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

        // Update item timers
        const timeString = `${this.pad(hours + days * 24)}:${this.pad(minutes)}:${this.pad(seconds)}`;
        document.querySelectorAll('.lock-time').forEach(el => {
            el.textContent = timeString;
        });
    },

    pad(num) {
        return num.toString().padStart(2, '0');
    },

    showLive() {
        const countdown = document.getElementById('countdown');
        countdown.innerHTML = `
            <div class="live-indicator">
                <span class="live-dot"></span>
                <span class="live-text">DROP IS LIVE</span>
            </div>
        `;
        // Unlock products
        document.querySelectorAll('.collection-item').forEach(item => {
            item.classList.remove('locked');
        });
    }
};

// ========================================
// QUEUE SYSTEM
// ========================================
const QueueSystem = {
    queuePosition: null,
    totalInQueue: 1247,

    init() {
        const form = document.getElementById('queueForm');
        const emailInput = document.getElementById('emailInput');

        // Check if user is already in queue
        const savedPosition = localStorage.getItem('silverSaintsQueue');
        if (savedPosition) {
            this.queuePosition = parseInt(savedPosition);
            this.showQueueStatus();
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = emailInput.value.trim();

            if (this.validateEmail(email)) {
                this.joinQueue(email);
            }
        });

        // Activity buttons
        document.getElementById('exploreBtn')?.addEventListener('click', () => {
            document.getElementById('hero').scrollIntoView({ behavior: 'smooth' });
        });

        document.getElementById('loreBtn')?.addEventListener('click', () => {
            document.getElementById('lore').scrollIntoView({ behavior: 'smooth' });
        });

        document.getElementById('peekBtn')?.addEventListener('click', () => {
            document.getElementById('collection').scrollIntoView({ behavior: 'smooth' });
        });
    },

    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    joinQueue(email) {
        // Simulate joining queue
        this.queuePosition = Math.floor(Math.random() * 300) + 100;
        this.totalInQueue += 1;

        // Save to localStorage
        localStorage.setItem('silverSaintsQueue', this.queuePosition.toString());
        localStorage.setItem('silverSaintsEmail', email);

        this.showQueueStatus();
    },

    showQueueStatus() {
        const form = document.getElementById('queueForm');
        const status = document.getElementById('queueStatus');
        const whileWaiting = document.getElementById('whileWaiting');
        const queueIndicator = document.getElementById('queueIndicator');

        // Hide form, show status
        form.style.display = 'none';
        status.style.display = 'block';
        whileWaiting.style.display = 'block';
        queueIndicator.classList.add('visible');

        // Update position displays
        document.getElementById('queuePosition').textContent = `#${this.queuePosition}`;
        document.getElementById('queuePositionNav').textContent = this.queuePosition;
        document.getElementById('totalInQueue').textContent = this.totalInQueue.toLocaleString();

        // Calculate odds
        const odds = this.queuePosition <= 50 ? 'VERY HIGH' :
                    this.queuePosition <= 150 ? 'HIGH' :
                    this.queuePosition <= 300 ? 'MEDIUM' : 'LOW';
        document.getElementById('estimatedChance').textContent = odds;

        // Simulate queue movement
        this.startQueueSimulation();
    },

    startQueueSimulation() {
        setInterval(() => {
            if (this.queuePosition > 1) {
                // Randomly move up 1-3 positions
                const movement = Math.floor(Math.random() * 3) + 1;
                this.queuePosition = Math.max(1, this.queuePosition - movement);

                document.getElementById('queuePosition').textContent = `#${this.queuePosition}`;
                document.getElementById('queuePositionNav').textContent = this.queuePosition;

                localStorage.setItem('silverSaintsQueue', this.queuePosition.toString());

                // Flash effect on position change
                const positionEl = document.querySelector('.position-number');
                positionEl.style.animation = 'none';
                positionEl.offsetHeight; // Trigger reflow
                positionEl.style.animation = 'pulse 0.5s ease';
            }
        }, 5000 + Math.random() * 10000); // Every 5-15 seconds
    }
};

// ========================================
// LORE NAVIGATION
// ========================================
const LoreNavigation = {
    init() {
        const navBtns = document.querySelectorAll('.lore-nav-btn');
        const chapters = document.querySelectorAll('.lore-chapter');

        navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.dataset.target;

                // Update active states
                navBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                chapters.forEach(chapter => {
                    chapter.classList.remove('active');
                    if (chapter.dataset.chapter === target) {
                        chapter.classList.add('active');
                    }
                });
            });
        });
    }
};

// ========================================
// SCROLL ANIMATIONS
// ========================================
const ScrollAnimations = {
    init() {
        // Add fade-in class to sections
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.classList.add('fade-in');
        });

        // Intersection Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });
    }
};

// ========================================
// NAVIGATION
// ========================================
const Navigation = {
    init() {
        // Smooth scroll for nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Nav background on scroll
        const nav = document.querySelector('.nav');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                nav.style.background = 'rgba(10, 10, 10, 0.95)';
            } else {
                nav.style.background = 'linear-gradient(to bottom, var(--bg-primary), transparent)';
            }
        });
    }
};

// ========================================
// UTILITIES
// ========================================
const Utils = {
    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};