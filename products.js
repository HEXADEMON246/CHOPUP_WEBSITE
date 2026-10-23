
/* 
   PRODUCT DATA
*/

const products = [
    {
        id: 1,
        name: "Jollof Rice & Chicken",
        category: "Rice",
        price: 4500,
        image: "img/photo-1603133872878-684f208fb84b.jpg",
        description: "Smoky party jollof served with juicy grilled chicken."
    },
    {
        id: 2,
        name: "Classic Beef Burger",
        category: "Fast Food",
        price: 5500,
        image: "img/photo-1568901346375-23c9450c58cd.jpg",
        description: "A juicy beef patty with fresh lettuce, tomato and our house sauce."
    },
    {
        id: 3,
        name: "Spicy Chicken Noodles",
        category: "Noodles",
        price: 3800,
        image: "img/photo-1512058564366-18510be2db19.jpg",
        description: "Wok-tossed noodles with vegetables and a delicious spicy kick."
    },
    {
        id: 4,
        name: "Chicken Shawarma",
        category: "Fast Food",
        price: 4000,
        image: "img/photo-1529006557810-274b9b2fc783.jpg",
        description: "Warm flatbread packed with chicken, crisp vegetables and creamy sauce."
    },
    {
        id: 5,
        name: "Fresh Garden Salad",
        category: "Healthy",
        price: 3200,
        image: "img/photo-1547592180-85f173990554.jpg",
        description: "A refreshing mix of crunchy greens and seasonal vegetables."
    },
    {
        id: 6,
        name: "Golden Samosas",
        category: "Snacks",
        price: 2500,
        image: "img/photo-1601050690597-df0568f70950.jpg",
        description: "Crispy golden bites with a savoury, well-seasoned filling."
    },
    {
        id: 7,
        name: "Chilled Cola",
        category: "Drinks",
        price: 1000,
        image: "img/photo-1554866585-cd94860890b7.jpg",
        description: "An ice-cold fizzy drink to complete your meal."
    },
    {
        id: 8,
        name: "Beans & Plantain",
        category: "Rice",
        price: 3500,
        image: "img/photo-1626074353765-517a681e40be.jpg",
        description: "Comforting beans served with sweet, golden fried plantain."
    },
    {
        id: 9,
        name: "Chicken Fried Rice",
        category: "Rice",
        price: 4200,
        image: "img/photo-1603133872878-684f208fb84b.jpg",
        description: "Fluffy fried rice with colourful vegetables and tender chicken."
    }
];


/*
   PRICE FORMATTING
*/

function money(amount) {
    return "₦" + Number(amount).toLocaleString("en-NG");
}


/*
   CART MANAGEMENT
*/

const CART_STORAGE_KEY = "chophub-cart";

// Retrieve the cart from localStorage
function getCart() {
    try {
        return JSON.parse(
            localStorage.getItem(CART_STORAGE_KEY)
        ) || [];
    } catch {
        return [];
    }
}

// Save the cart and refresh the cart counter
function saveCart(cart) {
    localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cart)
    );

    updateCartCount();
}

// Add a product to the cart
function addToCart(productId) {
    const cart = getCart();

    const item = cart.find(
        (cartItem) => cartItem.id === productId
    );

    if (item) {
        item.qty++;
    } else {
        cart.push({
            id: productId,
            qty: 1
        });
    }

    saveCart(cart);
    toast("Added to your cart!");
}

// Update the number displayed beside the cart icon
function updateCartCount() {
    const itemCount = getCart().reduce(
        (total, item) => total + item.qty,
        0
    );

    document.querySelectorAll("[data-cart-count]").forEach(
        (element) => {
            element.textContent = itemCount;
        }
    );
}


/*
   TOAST NOTIFICATION
*/

function toast(message) {
    let toastElement = document.querySelector(".toast");

    if (!toastElement) {
        toastElement = document.createElement("div");
        toastElement.className = "toast";
        document.body.append(toastElement);
    }

    toastElement.textContent = message;
    toastElement.classList.add("show");

    setTimeout(() => {
        toastElement.classList.remove("show");
    }, 1800);
}


/*
   HEADER AND NAVIGATION
*/

function header() {
    return `
        <header class="header">
            <a class="brand" href="index.html">
                <span class="brand-mark">C</span>
                chop<span>hub</span><i>.</i>
            </a>

            <nav class="nav">
                <a href="index.html">Home</a>
                <a href="menu.html">Menu</a>
                <a href="index.html#about">About</a>
            </nav>

            <a class="cart-link" href="cart.html">
                <span>Cart</span>
                <span class="cart-icon">🛒</span>
                <b data-cart-count>0</b>
            </a>

            <button
                class="mobile-menu"
                aria-label="Toggle menu"
                onclick="document.querySelector('.nav').classList.toggle('open')"
            >
                ☰
            </button>
        </header>
    `;
}


/*
   FOOTER
*/

function footer() {
    return `
        <footer class="footer">
            <div>
                <a class="brand footer-brand" href="index.html">
                    <span class="brand-mark">C</span>
                    chop<span>hub</span><i>.</i>
                </a>

                <p>
                    Good food. Great mood.
                    Delivered to your door.
                </p>
            </div>

            <div>
                <b>Explore</b>
                <a href="menu.html">Our Menu</a>
                <a href="cart.html">Your Cart</a>
            </div>

            <div>
                <b>Contact</b>
                <span>hello@chophub.example</span>
                <span>Mon–Sun · 9am–10pm</span>
            </div>

            <small>
                © 2026 ChopHub. Made with love and a little pepper 🌶
            </small>
        </footer>
    `;
}


/*
   PRODUCT CARD
*/

function productCard(product) {
    return `
        <article class="product-card">
            <a class="product-image" href="menu.html">
                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >

                <span class="product-tag">
                    ${product.category}
                </span>
            </a>

            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>

                <div class="product-bottom">
                    <strong>${money(product.price)}</strong>

                    <button
                        class="add-btn"
                        onclick="addToCart(${product.id})"
                        aria-label="Add ${product.name} to cart"
                    >
                        ＋
                    </button>
                </div>
            </div>
        </article>
    `;
}


/*
   SHARED INITIALIZATION
*/

function initShared() {
    updateCartCount();
}
