// ========================================
// SILVER SAINTS - Cart JavaScript
// Shopping Cart Functionality
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    Cart.init();
});

const Cart = {
    items: [],
    FREE_SHIPPING_THRESHOLD: 200,

    init() {
        this.items = JSON.parse(localStorage.getItem('silverSaintsCart')) || [];
        this.bindEvents();
        this.updateUI();
        this.updateShippingBanner();
    },

    bindEvents() {
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.product-card');
                card.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
                e.target.classList.add('selected');
            });
        });

        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.product-card');
                const selectedSize = card.querySelector('.size-btn.selected');

                if (!selectedSize) {
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
                selectedSize.classList.remove('selected');

                btn.textContent = 'ADDED';
                btn.classList.add('added');
                setTimeout(() => {
                    btn.textContent = 'ADD TO CART';
                    btn.classList.remove('added');
                }, 1500);
            });
        });

        const cartBtn = document.getElementById('cartBtn');
        if (cartBtn) {
            cartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openSidebar();
            });
        }

        const cartClose = document.getElementById('cartClose');
        if (cartClose) {
            cartClose.addEventListener('click', () => this.closeSidebar());
        }

        const overlay = document.getElementById('cartOverlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.closeSidebar());
        }

        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                alert('Checkout coming soon!');
            });
        }
    },

    addItem(newItem) {
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

        const countEl = document.getElementById('cartCount');
        if (countEl) countEl.textContent = count;

        const cartBtn = document.getElementById('cartBtn');
        if (cartBtn) {
            cartBtn.classList.toggle('hidden', count === 0);
        }

        const cartItemsEl = document.getElementById('cartItems');
        if (cartItemsEl) {
            if (this.items.length === 0) {
                cartItemsEl.innerHTML = '<p class="cart-empty">YOUR CART IS EMPTY</p>';
            } else {
                cartItemsEl.innerHTML = this.items.map(item => `
                    <div class="cart-item" data-id="${item.id}" data-size="${item.size}">
                        <div class="cart-item-image"><div class="cart-item-placeholder">+</div></div>
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

                cartItemsEl.querySelectorAll('.cart-item').forEach(el => {
                    const id = el.dataset.id;
                    const size = el.dataset.size;
                    el.querySelector('.minus').addEventListener('click', () => this.updateQuantity(id, size, -1));
                    el.querySelector('.plus').addEventListener('click', () => this.updateQuantity(id, size, 1));
                    el.querySelector('.cart-item-remove').addEventListener('click', () => this.removeItem(id, size));
                });
            }
        }

        const totalEl = document.getElementById('cartTotal');
        if (totalEl) totalEl.textContent = `$${total}`;

        const footer = document.getElementById('cartFooter');
        if (footer) footer.classList.toggle('visible', this.items.length > 0);

        this.updateShippingBanner();
    },

    updateShippingBanner() {
        const total = this.getTotal();
        const shippingText = document.getElementById('shippingText');
        const shippingProgress = document.getElementById('shippingProgress');

        if (!shippingText || !shippingProgress) return;

        const remaining = this.FREE_SHIPPING_THRESHOLD - total;
        const progress = Math.min(100, (total / this.FREE_SHIPPING_THRESHOLD) * 100);

        if (remaining <= 0) {
            shippingText.textContent = 'YOU QUALIFY FOR FREE SHIPPING!';
            shippingText.classList.add('free-shipping');
            shippingProgress.style.width = '100%';
            shippingProgress.classList.add('complete');
        } else {
            shippingText.textContent = `$${remaining} AWAY FROM FREE SHIPPING`;
            shippingText.classList.remove('free-shipping');
            shippingProgress.style.width = `${progress}%`;
            shippingProgress.classList.remove('complete');
        }
    },

    openSidebar() {
        document.getElementById('cartSidebar')?.classList.add('open');
        document.getElementById('cartOverlay')?.classList.add('visible');
        document.body.style.overflow = 'hidden';
    },

    closeSidebar() {
        document.getElementById('cartSidebar')?.classList.remove('open');
        document.getElementById('cartOverlay')?.classList.remove('visible');
        document.body.style.overflow = '';
    }
};
