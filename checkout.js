
document.getElementById("header").innerHTML = header();
document.getElementById("footer").innerHTML = footer();

const checkoutRoot = document.getElementById("checkout-root");

const DELIVERY_FEE = 1000;
const PACKAGING_FEE = 300;
const CART_STORAGE_KEY = "chophub-cart";
const ORDER_STORAGE_KEY = "chophub-last-order";

// Find a product using its ID
function findProduct(productId) {
    return products.find((product) => product.id === productId);
}

// Calculate the subtotal
function calculateSubtotal(cart) {
    return cart.reduce((subtotal, item) => {
        const product = findProduct(item.id);

        if (!product) return subtotal;

        return subtotal + product.price * item.qty;
    }, 0);
}

// Calculate the final order total
function calculateTotal(subtotal) {
    return subtotal + DELIVERY_FEE + PACKAGING_FEE;
}

// Display a message when the cart is empty
function renderEmptyCart() {
    checkoutRoot.innerHTML = `
        <div class="empty-cart">
            <h2>Your cart is empty.</h2>
            <a class="btn btn-primary" href="menu.html">
                Browse the menu →
            </a>
        </div>
    `;
}

// Render the contact information section
function renderContactSection() {
    return `
        <section class="form-card">
            <h2><span>01</span> Contact information</h2>

            <div class="field-grid">
                <label>
                    Full name
                    <input
                        name="name"
                        required
                        placeholder="Your full name"
                        autocomplete="name"
                    >
                </label>

                <label>
                    Phone number
                    <input
                        name="phone"
                        required
                        type="tel"
                        placeholder="080 1234 5678"
                        autocomplete="tel"
                    >
                </label>

                <label class="wide-field">
                    Email address <small>(optional)</small>
                    <input
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        autocomplete="email"
                    >
                </label>
            </div>
        </section>
    `;
}

// Render the delivery address section
function renderDeliverySection() {
    return `
        <section class="form-card">
            <h2><span>02</span> Delivery address</h2>

            <div class="field-grid">
                <label class="wide-field">
                    Street address
                    <input
                        name="address"
                        required
                        placeholder="House number, street name"
                        autocomplete="street-address"
                    >
                </label>

                <label>
                    Area / Neighbourhood
                    <input
                        name="area"
                        required
                        placeholder="e.g. Yaba"
                    >
                </label>

                <label>
                    City
                    <input
                        name="city"
                        required
                        placeholder="e.g. Lagos"
                    >
                </label>

                <label class="wide-field">
                    Delivery instructions <small>(optional)</small>
                    <textarea
                        name="instructions"
                        rows="2"
                        placeholder="Gate code, landmarks, etc."
                    ></textarea>
                </label>
            </div>
        </section>
    `;
}

// Render the payment method section
function renderPaymentSection() {
    return `
        <section class="form-card">
            <h2><span>03</span> Payment method</h2>

            <label class="payment-option">
                <input
                    type="radio"
                    name="payment"
                    value="Cash on delivery"
                    checked
                >
                <span>
                    <b>Cash on delivery</b>
                    <small>Pay when your food arrives</small>
                </span>
                <span>💵</span>
            </label>

            <label class="payment-option">
                <input
                    type="radio"
                    name="payment"
                    value="Transfer on delivery"
                >
                <span>
                    <b>Bank transfer</b>
                    <small>Transfer when your order arrives</small>
                </span>
                <span>🏦</span>
            </label>

            <p class="demo-note">
                Demo checkout: no real payment will be collected.
            </p>
        </section>
    `;
}

// Render an individual product in the order summary
function renderCheckoutProduct(item) {
    const product = findProduct(item.id);

    if (!product) return "";

    return `
        <div class="checkout-product">
            <img src="${product.image}" alt="">

            <span>
                ${product.name}
                <small>Qty: ${item.qty}</small>
            </span>

            <b>${money(product.price * item.qty)}</b>
        </div>
    `;
}

// Render the order summary
function renderOrderSummary(cart, subtotal) {
    const total = calculateTotal(subtotal);

    return `
        <aside class="summary-card checkout-summary">
            <h2>Your order</h2>

            ${cart.map(renderCheckoutProduct).join("")}

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

            <button
                class="btn btn-primary full-btn"
                type="submit"
            >
                Place my order ↗
            </button>

            <div class="secure-note">
                🔒 Your details stay safe
            </div>
        </aside>
    `;
}

// Render the complete checkout form
function renderCheckout(cart) {
    const subtotal = calculateSubtotal(cart);

    checkoutRoot.innerHTML = `
        <form class="checkout-layout" id="checkout-form">
            <div class="checkout-fields">
                ${renderContactSection()}
                ${renderDeliverySection()}
                ${renderPaymentSection()}
            </div>

            ${renderOrderSummary(cart, subtotal)}
        </form>
    `;

    document
        .getElementById("checkout-form")
        .addEventListener("submit", handleCheckoutSubmit);
}

// Handle checkout form submission
function handleCheckoutSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;

    if (!form.reportValidity()) return;

    const formData = Object.fromEntries(
        new FormData(form).entries()
    );

    const cart = getCart();
    const subtotal = calculateSubtotal(cart);

    // Do not create an order if the cart is empty.
    if (cart.length === 0) {
        renderEmptyCart();
        return;
    }

    const order = {
        ...formData,
        items: cart,
        total: calculateTotal(subtotal),
        number: "CH" + Date.now().toString().slice(-8),
        date: new Date().toISOString()
    };

    localStorage.setItem(
        ORDER_STORAGE_KEY,
        JSON.stringify(order)
    );

    localStorage.removeItem(CART_STORAGE_KEY);

    window.location.href = "success.html";
}

// Initialize the checkout page
function initCheckout() {
    initShared();

    const cart = getCart();

    if (cart.length === 0) {
        renderEmptyCart();
        return;
    }

    renderCheckout(cart);
}

initCheckout();
