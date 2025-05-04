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

// Create jewelry card HTML with proper data attributes for try-on functionality
function createJewelryCard(item) {
    return `
        <div class="jewelry-card" data-id="${item.id}" data-sku="${item.sku}" data-category="${item.category}">
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
                    <button class="btn btn-secondary try-on" data-id="${item.id}" data-sku="${item.sku}">
                        <i class="fas fa-camera"></i> Try On
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Handle jewelry card button clicks
function addJewelryCardListeners(container) {
    // Add-to-cart handler
    container.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Add to cart clicked for item: ' + button.dataset.id);
        });
    });

    // Try-on button handler - NOW OPENS MODAL INSTEAD OF REDIRECTING
    container.querySelectorAll('.try-on').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get the jewelry ID and SKU from the button's data attributes
            const jewelryId = button.dataset.id;
            const jewelrySku = button.dataset.sku;
            
            if (!jewelryId || !jewelrySku) {
                console.error('Missing jewelry ID or SKU for try-on button');
                return;
            }
            
            // Open modal instead of redirecting
            openTryOnModal(jewelrySku);
            
            // Log action to console for debugging
            console.log(`Opening try-on modal with jewelry SKU: ${jewelrySku}`);
        });
    });
}

// Back button functionality
backButton.addEventListener('click', () => {
    homeContent.classList.remove('hidden');
    categoryContent.classList.add('hidden');
});

// TRY-ON MODAL FUNCTIONALITY - NEW CODE BELOW

// 1. Create the modal container in your website
function createTryOnModal() {
    const modalContainer = document.createElement('div');
    modalContainer.id = 'tryOnModalContainer';
    modalContainer.className = 'tryon-modal-container';
    
    modalContainer.innerHTML = `
        <div class="tryon-modal">
            <div class="tryon-modal-header">
                <h3>Virtual Try-On</h3>
                <button id="tryOnCloseBtn" class="tryon-close-btn">&times;</button>
            </div>
            <div class="tryon-modal-body">
                <iframe id="tryOnFrame" 
                    src="about:blank" 
                    frameborder="0"
                    allow="camera; microphone; accelerometer; gyroscope; autoplay" 
                    allowfullscreen></iframe>
            </div>
        </div>
    `;
    
    document.body.appendChild(modalContainer);
    
    // Add event listener to close button
    document.getElementById('tryOnCloseBtn').addEventListener('click', closeTryOnModal);
    
    // Close modal when clicking outside
    modalContainer.addEventListener('click', function(e) {
        if (e.target === modalContainer) {
            closeTryOnModal();
        }
    });
    
    // Add event listener for 'Escape' key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.getElementById('tryOnModalContainer').style.display === 'flex') {
            closeTryOnModal();
        }
    });
    
    return modalContainer;
}

// 2. Open the modal with the try-on experience
function openTryOnModal(jewelrySku) {
    let modalContainer = document.getElementById('tryOnModalContainer');
    
    // Create modal if it doesn't exist
    if (!modalContainer) {
        modalContainer = createTryOnModal();
    }
    
    // Show the modal
    modalContainer.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    
    // Set the iframe source
    const tryOnFrame = document.getElementById('tryOnFrame');
    tryOnFrame.src = `https://jewelry-tryon-app.web.app?jewelryId=${jewelrySku}`;
    
    // Optional: Add loading indicator while iframe loads
    tryOnFrame.style.opacity = '0';
    const loader = document.createElement('div');
    loader.className = 'tryon-loader';
    loader.innerHTML = '<div class="spinner"></div><p>Loading Try-On Experience...</p>';
    tryOnFrame.parentNode.appendChild(loader);
    
    tryOnFrame.onload = function() {
        tryOnFrame.style.opacity = '1';
        if (loader && loader.parentNode) {
            loader.parentNode.removeChild(loader);
        }
    };
}

// 3. Close the modal
function closeTryOnModal() {
    const modalContainer = document.getElementById('tryOnModalContainer');
    if (modalContainer) {
        modalContainer.style.display = 'none';
        document.body.style.overflow = ''; // Re-enable scrolling
        
        // Reset iframe src to stop any processes
        const tryOnFrame = document.getElementById('tryOnFrame');
        if (tryOnFrame) {
            tryOnFrame.src = 'about:blank';
        }
    }
}

// Initialize the page
renderCategories();
renderFeaturedItems();
