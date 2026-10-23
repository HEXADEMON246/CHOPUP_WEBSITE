
document.getElementById("header").innerHTML = header();
document.getElementById("footer").innerHTML = footer();

const cartContent = document.getElementById("cart-content");

const DELIVERY_FEE = 1000;
const PACKAGING_FEE = 300;

// Find a product by its ID
function findProduct(productId) {
    return products.find((product) => product.id === productId);
}

// Calculate the cart subtotal
function calculateSubtotal(cart) {
    return cart.reduce((subtotal, item) => {
        const product = findProduct(item.id);

        if (!product) return subtotal;

        return subtotal + product.price * item.qty;
    }, 0);
}

// Display the empty cart
function renderEmptyCart() {
    cartContent.innerHTML = `
        <div class="empty-cart">
            <span><i class="fa-solid fa-cart-shopping"></i></span>
            <h2>Your cart is looking a little hungry.</h2>
            <p>Add something delicious and it'll show up here.</p>

            <a class="btn btn-primary" href="menu.html">
                Browse the menu →
            </a>
        </div>
    `;
}

// Render one cart item
function renderCartItem(item) {
    const product = findProduct(item.id);

    if (!product) return "";

    return `
        <article class="cart-item">
            <img src="${product.image}" alt="${product.name}">

            <div class="cart-item-name">
                <h3>${product.name}</h3>
                <small>${money(product.price)} each</small>

                <button
                    class="remove-btn"
                    data-remove="${product.id}"
                >
                    Remove
                </button>
            </div>

            <div class="quantity">
                <button
                    data-change="${product.id}"
                    data-delta="-1"
                    aria-label="Decrease quantity"
                >−</button>

                <span>${item.qty}</span>

                <button
                    data-change="${product.id}"
                    data-delta="1"
                    aria-label="Increase quantity"
                >+</button>
            </div>

            <strong>${money(product.price * item.qty)}</strong>
        </article>
    `;
}

// Render the order summary
function renderOrderSummary(subtotal) {
    const total = subtotal + DELIVERY_FEE + PACKAGING_FEE;

    return `
        <aside class="summary-card">
            <h2>Order summary</h2>

            <div class="summary-line">
                <span>Subtotal</span>
                <b>${money(subtotal)}</b>
            </div>

            <div class="summary-line">
                <span>Delivery fee</span>
                <b>${money(DELIVERY_FEE)}</b>
            </div>

            <div class="summary-line">
                <span>Packaging</span>
                <b>${money(PACKAGING_FEE)}</b>
            </div>

            <div class="summary-line summary-total">
                <span>Total</span>
                <b>${money(total)}</b>
            </div>

            <p class="summary-note">
                Delivery fee may vary by location.
            </p>

            <a class="btn btn-primary full-btn" href="checkout.html">
                Continue to checkout →
            </a>

            <div class="secure-note">
                <i class="fa-solid fa-unlock"></i> Safe and secure checkout
            </div>
        </aside>
    `;
}

// Render the entire cart
function renderCart() {
    initShared();

    const cart = getCart();

    if (cart.length === 0) {
        renderEmptyCart();
        return;
    }

    const subtotal = calculateSubtotal(cart);
    const cartItems = cart.map(renderCartItem).join("");

    cartContent.innerHTML = `
        <div class="cart-layout">
            <div class="cart-items">
                <div class="cart-table-head">
                    <span>ITEM</span>
                    <span>QUANTITY</span>
                    <span>TOTAL</span>
                </div>

                ${cartItems}

                <a class="back-menu" href="menu.html">
                    ← Keep exploring the menu
                </a>
            </div>

            ${renderOrderSummary(subtotal)}
        </div>
    `;
}

// Remove an item from the cart
function removeCartItem(productId) {
    const updatedCart = getCart().filter(
        (item) => item.id !== productId
    );

    saveCart(updatedCart);
    renderCart();
}

// Update an item's quantity
function changeCartQuantity(productId, quantityChange) {
    const cart = getCart();

    const item = cart.find(
        (cartItem) => cartItem.id === productId
    );

    if (!item) return;

    item.qty += quantityChange;

    // Remove the item when its quantity reaches zero
    saveCart(cart.filter((cartItem) => cartItem.qty > 0));

    renderCart();
}

// Handle clicks on cart buttons
cartContent.addEventListener("click", (event) => {
    const removeButton = event.target.closest("[data-remove]");

    if (removeButton) {
        removeCartItem(Number(removeButton.dataset.remove));
        return;
    }

    const quantityButton = event.target.closest("[data-change]");

    if (quantityButton) {
        changeCartQuantity(
            Number(quantityButton.dataset.change),
            Number(quantityButton.dataset.delta)
        );
    }
});

// Initialize the cart
renderCart();
