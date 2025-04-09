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
    tryOnFrame.src = `https://sirpi-57.github.io/infinite-ai-jewelry-tryon/tryon.html?jewelryId=${jewelrySku}`;
    
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

const chatToggle = document.getElementById('chat-toggle');
    const closeChat = document.getElementById('close-chat');
    const minimizeChat = document.getElementById('minimize-chat');
    const chatContainer = document.getElementById('chat-container');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-message');
    const sendButton = document.getElementById('send-button');
    const typingIndicator = document.getElementById('typing-indicator');
    
    // Replace with your actual Rasa endpoint
    const RASA_ENDPOINT = 'https://981d-13-71-3-97.ngrok-free.app'; // Still using Ngrok - remember to change for production!
    
    let sessionId = generateSessionId();
    let isMinimized = false;
    
    // Toggle chat window
    if (chatToggle) {
        chatToggle.addEventListener('click', () => {
            if (chatContainer) chatContainer.classList.toggle('hidden');
            if (chatMessages && chatMessages.children.length === 0) {
                addBotMessage("Hey there! 👋 Welcome to Infinite AI! Type 'Hello' to start your jewelry shopping experience!");
            }
        });
    }
    
    if (closeChat) {
        closeChat.addEventListener('click', () => {
            if (chatContainer) chatContainer.classList.add('hidden');
        });
    }
    
    if (minimizeChat) {
        minimizeChat.addEventListener('click', () => {
            if (!chatContainer) return;
            if (isMinimized) {
                chatContainer.style.height = '600px'; // Adjusted height
                isMinimized = false;
            } else {
                chatContainer.style.height = '60px'; // Adjust based on header height
                isMinimized = true;
            }
        });
    }
    
    // Send message listeners
    if (sendButton) sendButton.addEventListener('click', sendMessage);
    if (userInput) {
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    function sendMessage() {
        if (!userInput) return;
        const message = userInput.value.trim();
        if (!message) return;
        
        addUserMessage(message);
        userInput.value = '';
        showTypingIndicator();
        sendToRasa(message);
    }
    
    function showTypingIndicator() {
        if (typingIndicator) typingIndicator.classList.remove('hidden');
        if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function hideTypingIndicator() {
        if (typingIndicator) typingIndicator.classList.add('hidden');
    }
    
    function sendToRasa(message, isPayload = false) {
        let requestBody = {
            sender: sessionId,
            message: message
        };
        // No need to differentiate payload structure for Rasa REST channel

        fetch(`${RASA_ENDPOINT}/webhooks/rest/webhook`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        })
        .then(response => response.json())
        .then(data => {
            hideTypingIndicator();
            if (data && data.length > 0) {
                let messageDelay = 0;
                data.forEach(response => {
                    setTimeout(() => {
                        if (response.text) {
                            addBotMessage(response.text);
                        }
                        if (response.buttons && response.buttons.length > 0) {
                            addButtons(response.buttons);
                        }
                    }, messageDelay);
                    messageDelay += 300; 
                });
            } else {
                addBotMessage("I'm sorry, I didn't get a response. Please try again.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            hideTypingIndicator();
            addBotMessage("Sorry, I'm having trouble connecting. Please try again later.");
        });
    }
    
    function addUserMessage(text) {
         if (!chatMessages) return;
        const messageDiv = document.createElement('div');
        messageDiv.className = 'flex justify-end mb-4';
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center ml-2 mt-1';
        avatarDiv.innerHTML = '<span class="text-purple-600 font-medium text-sm">You</span>';
        
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'user-bubble';
        bubbleDiv.innerText = text;
        
        messageDiv.appendChild(bubbleDiv);
        messageDiv.appendChild(avatarDiv);
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function addBotMessage(text) {
        if (!chatMessages) return;
        const messageDiv = document.createElement('div');
        messageDiv.className = 'flex mb-4';
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center mr-2 mt-1';
        avatarDiv.innerHTML = '<i class="fas fa-gem text-white text-xs"></i>';
        
        // Check if message contains HTML for product cards
        if (text.includes('<div style=')) {
            const textBeforeHtml = text.split('<div style=')[0].trim();
            const contentContainer = document.createElement('div');
            contentContainer.className = 'bot-bubble';
            contentContainer.style.width = '300px'; 
            
            if (textBeforeHtml) {
                const headingElement = document.createElement('div');
                headingElement.className = 'mb-3 font-medium';
                headingElement.textContent = textBeforeHtml;
                contentContainer.appendChild(headingElement);
            }
            
            const htmlPart = text.substring(text.indexOf('<div style='));
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlPart;
            
            const productGrid = document.createElement('div');
            productGrid.className = 'product-grid';
            
            const originalCards = tempDiv.querySelectorAll('div[style*="border"]');
            originalCards.forEach(card => {
                const imgSrc = card.querySelector('img')?.src || "https://via.placeholder.com/150x150?text=No+Image";
                const productName = card.querySelector('h3')?.textContent || "Product";
                const productDesc = card.querySelector('p')?.textContent || "Description";
                const priceElements = card.querySelectorAll('span');
                
                let basePrice = "";
                let discountedPrice = "";
                
                if (priceElements.length > 1) {
                    basePrice = priceElements[0].textContent;
                    discountedPrice = priceElements[1].textContent;
                } else if (priceElements.length === 1) {
                    basePrice = priceElements[0].textContent;
                }
                
                const newCard = document.createElement('div');
                newCard.className = 'product-card';
                newCard.innerHTML = `
                    <div class="product-image">
                        <img src="${imgSrc}" alt="${productName}" onerror="this.src='https://via.placeholder.com/150x150?text=No+Image';">
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${productName}</h3>
                        <p class="product-description">${productDesc}</p>
                        <div class="mt-3 text-center">
                            <div class="product-price">
                                ${discountedPrice ? `<span class="original">${basePrice}</span><span>${discountedPrice}</span>` : `<span>${basePrice}</span>`}
                            </div>
                        </div>
                    </div>
                `;
                productGrid.appendChild(newCard);
            });
            
            contentContainer.appendChild(productGrid);
            messageDiv.appendChild(avatarDiv);
            messageDiv.appendChild(contentContainer);
        } else {
            // Regular text message
            const bubbleDiv = document.createElement('div');
            bubbleDiv.className = 'bot-bubble';
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            const textWithLinks = text.replace(urlRegex, url => `<a href="${url}" target="_blank" class="text-purple-600 underline">${url}</a>`);
            bubbleDiv.innerHTML = textWithLinks;
            
            messageDiv.appendChild(avatarDiv);
            messageDiv.appendChild(bubbleDiv);
        }
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function addButtons(buttons) {
         if (!chatMessages) return;
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'flex flex-wrap gap-2 mb-4 ml-10';
        
        buttons.forEach(button => {
            const buttonEl = document.createElement('button');
            buttonEl.className = 'chat-button';
            buttonEl.textContent = button.title;
            buttonEl.dataset.payload = button.payload; 
            
            buttonEl.addEventListener('click', (event) => {
                const payload = event.currentTarget.dataset.payload;
                addUserMessage(button.title);
                showTypingIndicator();
                sendToRasa(payload, true);
            });
            
            buttonsDiv.appendChild(buttonEl);
        });
        chatMessages.appendChild(buttonsDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function generateSessionId() {
        return 'user_' + Math.random().toString(36).substring(2, 15);
    }

    // Initial check if chat widget elements exist
    if (!chatToggle || !chatContainer || !chatMessages || !userInput || !sendButton || !typingIndicator) {
        console.warn("One or more chat widget elements were not found. Chat functionality might be limited.");
    }
        
