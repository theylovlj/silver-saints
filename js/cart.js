// ========================================
// SILVER SAINTS - Cart JavaScript
// Shopping Cart Functionality
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    Cart.init();
});

const Cart = {
    items: [],

    init() {
        // Load cart from localStorage
        this.items = JSON.parse(localStorage.getItem('silverSaintsCart')) || [];

        // Initialize UI
        this.bindEvents();
        this.updateUI();
    },

    bindEvents() {
        // Size selection
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.product-card');
                card.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
                e.target.classList.add('selected');
            });
        });

        // Add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.product-card');
                const selectedSize = card.querySelector('.size-btn.selected');

                if (!selectedSize) {
                    // Flash size buttons to indicate selection needed
                    card.querySelectorAll('.size-btn').forEach(b => {
                        b.classList.add('flash');
                        setTimeout(() => b.classList.remove('flash'), 500);
                    });
                    return;
                }

                const item = {
                    id: card.dataset.id,
                    name: card.dataset.name,
                    price: parseInt(card.dataset.price),
                    size: selectedSize.dataset.size,
                    quantity: 1
                };

                this.addItem(item);

                // Reset size selection
                selectedSize.classList.remove('selected');

                // Show confirmation
                btn.textContent = 'ADDED';
                btn.classList.add('added');
                setTimeout(() => {
                    btn.textContent = 'ADD TO CART';
                    btn.classList.remove('added');
                }, 1500);
            });
        });

        // Cart button (open sidebar)
        const cartBtn = document.getElementById('cartBtn');
        if (cartBtn) {
            cartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openSidebar();
            });
        }

        // Close cart sidebar
        const cartClose = document.getElementById('cartClose');
        if (cartClose) {
            cartClose.addEventListener('click', () => this.closeSidebar());
        }

        // Overlay click to close
        const overlay = document.getElementById('cartOverlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.closeSidebar());
        }

        // Checkout button
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                alert('Checkout coming soon!');
            });
        }
    },

    addItem(newItem) {
        // Check if item with same id and size exists
        const existingIndex = this.items.findIndex(
            item => item.id === newItem.id && item.size === newItem.size
        );

        if (existingIndex > -1) {
            this.items[existingIndex].quantity += 1;
        } else {
            this.items.push(newItem);
        }

        this.save();
        this.updateUI();
    },

    removeItem(id, size) {
        this.items = this.items.filter(
            item => !(item.id === id && item.size === size)
        );
        this.save();
        this.updateUI();
    },

    updateQuantity(id, size, delta) {
        const item = this.items.find(
            item => item.id === id && item.size === size
        );

        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                this.removeItem(id, size);
            } else {
                this.save();
                this.updateUI();
            }
        }
    },

    save() {
        localStorage.setItem('silverSaintsCart', JSON.stringify(this.items));
    },

    getTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },

    getCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    },

    updateUI() {
        const count = this.getCount();
        const total = this.getTotal();

        // Update cart count
        const countEl = document.getElementById('cartCount');
        if (countEl) {
            countEl.textContent = count;
        }

        // Show/hide cart button
        const cartBtn = document.getElementById('cartBtn');
        if (cartBtn) {
            if (count > 0) {
                cartBtn.classList.remove('hidden');
            } else {
                cartBtn.classList.add('hidden');
            }
        }

        // Update cart items display
        const cartItemsEl = document.getElementById('cartItems');
        if (cartItemsEl) {
            if (this.items.length === 0) {
                cartItemsEl.innerHTML = '<p class="cart-empty">YOUR CART IS EMPTY</p>';
            } else {
                cartItemsEl.innerHTML = this.items.map(item => `
                    <div class="cart-item" data-id="${item.id}" data-size="${item.size}">
                        <div class="cart-item-image">
                            <div class="cart-item-placeholder">+</div>
                        </div>
                        <div class="cart-item-details">
                            <span class="cart-item-name">${item.name}</span>
                            <span class="cart-item-size">SIZE: ${item.size}</span>
                            <div class="cart-item-quantity">
                                <button class="qty-btn minus">-</button>
                                <span class="qty-value">${item.quantity}</span>
                                <button class="qty-btn plus">+</button>
                            </div>
                        </div>
                        <div class="cart-item-price">$${item.price * item.quantity}</div>
                        <button class="cart-item-remove">+</button>
                    </div>
                `).join('');

                // Bind quantity and remove buttons
                cartItemsEl.querySelectorAll('.cart-item').forEach(el => {
                    const id = el.dataset.id;
                    const size = el.dataset.size;

                    el.querySelector('.minus').addEventListener('click', () => {
                        this.updateQuantity(id, size, -1);
                    });

                    el.querySelector('.plus').addEventListener('click', () => {
                        this.updateQuantity(id, size, 1);
                    });

                    el.querySelector('.cart-item-remove').addEventListener('click', () => {
                        this.removeItem(id, size);
                    });
                });
            }
        }

        // Update total
        const totalEl = document.getElementById('cartTotal');
        if (totalEl) {
            totalEl.textContent = `$${total}`;
        }

        // Show/hide footer
        const footer = document.getElementById('cartFooter');
        if (footer) {
            if (this.items.length > 0) {
                footer.classList.add('visible');
            } else {
                footer.classList.remove('visible');
            }
        }
    },

    openSidebar() {
        const sidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('cartOverlay');
        if (sidebar) sidebar.classList.add('open');
        if (overlay) overlay.classList.add('visible');
        document.body.style.overflow = 'hidden';
    },

    closeSidebar() {
        const sidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('cartOverlay');
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('visible');
        document.body.style.overflow = '';
    }
};
