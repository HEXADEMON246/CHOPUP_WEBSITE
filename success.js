
/*
   PAGE SETUP
*/

document.getElementById("header").innerHTML = header();
document.getElementById("footer").innerHTML = footer();

const successRoot = document.getElementById("success-root");
const ORDER_STORAGE_KEY = "chophub-last-order";


/*
   SECURITY HELPERS
*/

// Escape text before inserting user-provided values into HTML
function escapeText(value = "") {
    return String(value).replace(/[&<>"']/g, (character) => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}


/*
   ORDER RETRIEVAL
*/

// Retrieve the most recent order from localStorage
function getLastOrder() {
    try {
        return JSON.parse(
            localStorage.getItem(ORDER_STORAGE_KEY)
        );
    } catch {
        return null;
    }
}


/*
   EMPTY STATE
*/

// Display when no previous order exists
function renderEmptyState() {
    successRoot.innerHTML = `
        <div class="success-card">
            <div class="success-check">✓</div>

            <span class="eyebrow">CHOPHUB</span>

            <h1>
                Good food is <em>calling.</em>
            </h1>

            <p>
                Place an order and we'll keep the details right here.
            </p>

            <a class="btn btn-primary" href="menu.html">
                Explore the menu →
            </a>
        </div>
    `;
}


/*
   ORDER DETAILS
*/

// Render the order number, delivery address and payment details
function renderOrderDetails(order) {
    return `
        <div class="order-number">
            <small>YOUR ORDER NUMBER</small>
            <b>${escapeText(order.number)}</b>
        </div>

        <div class="success-details">
            <div>
                <span>Delivering to</span>
                <b>
                    ${escapeText(order.address)},
                    ${escapeText(order.area)},
                    ${escapeText(order.city)}
                </b>
            </div>

            <div>
                <span>Payment method</span>
                <b>${escapeText(order.payment)}</b>
            </div>

            <div>
                <span>Order total</span>
                <b>${money(order.total)}</b>
            </div>
        </div>
    `;
}


/*
   ORDERED PRODUCTS
*/

// Render an individual product in the confirmed order
function renderOrderItem(item) {
    const product = products.find(
        (product) => product.id === item.id
    );

    // Skip products that are no longer available in the catalogue
    if (!product) {
        return "";
    }

    return `
        <div class="success-item">
            <span>
                ${item.qty} × ${escapeText(product.name)}
            </span>

            <b>${money(product.price * item.qty)}</b>
        </div>
    `;
}

// Render all products in the order
function renderOrderItems(items) {
    return items.map(renderOrderItem).join("");
}


/*
   SUCCESS PAGE
*/

// Display the completed order
function renderSuccessPage(order) {
    successRoot.innerHTML = `
        <div class="success-card">
            <div class="success-check">✓</div>

            <span class="eyebrow">ORDER CONFIRMED</span>

            <h1>
                You're in for a <em>treat!</em>
            </h1>

            <p>
                Thanks, ${escapeText(order.name)}.
                We've got your order and we're getting
                the kitchen ready.
            </p>

            ${renderOrderDetails(order)}

            <h3 class="success-items-title">
                In your order
            </h3>

            ${renderOrderItems(order.items)}

            <a
                class="btn btn-primary full-btn"
                href="menu.html"
            >
                Order more deliciousness →
            </a>

            <a class="back-menu" href="index.html">
                Back to home
            </a>
        </div>
    `;
}


/*
   INITIALIZATION
*/

function initSuccessPage() {
    initShared();

    const order = getLastOrder();

    if (!order) {
        renderEmptyState();
        return;
    }

    renderSuccessPage(order);
}

initSuccessPage();
