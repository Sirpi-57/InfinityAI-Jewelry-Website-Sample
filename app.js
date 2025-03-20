// Initialize Lucide icons
lucide.createIcons();

// DOM Elements
const homeContent = document.getElementById('home-content');
const categoryContent = document.getElementById('category-content');
const categoryGrid = document.getElementById('category-grid');
const featuredItems = document.getElementById('featured-items');
const categoryItems = document.getElementById('category-items');
const categoryTitle = document.getElementById('category-title');
const backButton = document.getElementById('back-button');

// Render category grid
function renderCategories() {
    categoryGrid.innerHTML = categories.map(category => `
        <div class="category-card" data-category="${category.id}">
            <img src="${category.image}" alt="${category.name}">
            <div class="category-overlay">
                <h3>${category.name}</h3>
                <p>${category.description}</p>
            </div>
        </div>
    `).join('');

    // Add click event listeners to category cards
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const categoryId = card.dataset.category;
            showCategory(categoryId);
        });
    });
}

// Render featured items
function renderFeaturedItems() {
    const featured = jewelry.slice(0, 6);
    featuredItems.innerHTML = featured.map(item => createJewelryCard(item)).join('');
    addJewelryCardListeners(featuredItems);
}

// Show category items
function showCategory(categoryId) {
    const category = categories.find(c => c.id === categoryId);
    const items = jewelry.filter(item => item.category === categoryId);
    
    categoryTitle.textContent = category.name;
    categoryItems.innerHTML = items.map(item => createJewelryCard(item)).join('');
    
    homeContent.classList.add('hidden');
    categoryContent.classList.remove('hidden');
    
    addJewelryCardListeners(categoryItems);
}

// Create jewelry card HTML
function createJewelryCard(item) {
    return `
        <div class="jewelry-card">
            <img src="${item.image}" alt="${item.name}">
            <div class="jewelry-details">
                <div class="jewelry-header">
                    <h3 class="jewelry-name">${item.name}</h3>
                    <span class="jewelry-sku">SKU: ${item.sku}</span>
                </div>
                <p class="jewelry-description">${item.description}</p>
                <p class="jewelry-price">₹${item.price.toLocaleString()}</p>
                <div class="jewelry-buttons">
                    <button class="btn btn-primary add-to-cart" data-id="${item.id}">Add to Cart</button>
                    <button class="btn btn-secondary try-on" data-id="${item.id}">Try On</button>
                </div>
            </div>
        </div>
    `;
}

// Add event listeners to jewelry card buttons
function addJewelryCardListeners(container) {
    container.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            // Add to cart functionality will be implemented here
            alert('Add to cart clicked for item: ' + button.dataset.id);
        });
    });

    container.querySelectorAll('.try-on').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            // Try on functionality will be implemented here
            alert('Try on clicked for item: ' + button.dataset.id);
        });
    });
}

// Back button functionality
backButton.addEventListener('click', () => {
    homeContent.classList.remove('hidden');
    categoryContent.classList.add('hidden');
});

// Initialize the page
renderCategories();
renderFeaturedItems();