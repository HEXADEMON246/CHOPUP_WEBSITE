
document.getElementById("header").innerHTML = header();
document.getElementById("footer").innerHTML = footer();

// Get the main page elements
const filters = document.getElementById("filters");
const searchInput = document.getElementById("search");
const menuProducts = document.getElementById("menu-products");
const emptyMessage = document.getElementById("empty");

// Set up categories and active filter
const categories = [
    "All",
    ...new Set(products.map((product) => product.category))
];

let activeCategory = "All";

// Render the category filter buttons
function renderFilters() {
    filters.innerHTML = categories
        .map((category) => `
            <button
                class="filter-btn ${
                    category === activeCategory ? "active" : ""
                }"
                data-category="${category}"
            >
                ${category}
            </button>
        `)
        .join("");
}

// Filter products by category and search query
function getFilteredProducts() {
    const query = searchInput.value.toLowerCase().trim();

    return products.filter((product) => {
        const matchesCategory =
            activeCategory === "All" ||
            product.category === activeCategory;

        const matchesSearch =
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query);

        return matchesCategory && matchesSearch;
    });
}

// Render the filtered products
function renderMenu() {
    const filteredProducts = getFilteredProducts();

    menuProducts.innerHTML = filteredProducts
        .map(productCard)
        .join("");

    emptyMessage.hidden = filteredProducts.length > 0;

    initShared();
}

// Handle category filter clicks
function handleFilterClick(event) {
    const button = event.target.closest("button[data-category]");

    if (!button) return;

    activeCategory = button.dataset.category;

    renderFilters();
    renderMenu();
}

// Handle search input
function handleSearch() {
    renderMenu();
}

// Initialize the menu page
function initMenu() {
    renderFilters();

    filters.addEventListener("click", handleFilterClick);
    searchInput.addEventListener("input", handleSearch);

    renderMenu();
}

initMenu();

