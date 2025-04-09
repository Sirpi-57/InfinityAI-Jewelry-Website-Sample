// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons if available
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // DOM Elements
    const homeContent = document.getElementById('home-content');
    const categoryContent = document.getElementById('category-content');
    const categoryGrid = document.getElementById('category-grid');
    const featuredItems = document.getElementById('featured-items');
    const categoryItems = document.getElementById('category-items');
    const categoryTitle = document.getElementById('category-title');
    const backButton = document.getElementById('back-button');

    // Check if elements exist before initializing
    if (categoryGrid && featuredItems) {
        // Render category grid
        function renderCategories() {
            if (!categories || !categories.length) {
                console.warn('Categories data is missing or empty');
                return;
            }
            
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
            if (!jewelry || !jewelry.length) {
                console.warn('Jewelry data is missing or empty');
                return;
            }
            
            const featured = jewelry.slice(0, 6);
            featuredItems.innerHTML = featured.map(item => createJewelryCard(item)).join('');
            addJewelryCardListeners(featuredItems);
        }

        // Show category items
        function showCategory(categoryId) {
            if (!categories || !jewelry) {
                console.warn('Data is missing');
                return;
            }
            
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
        if (backButton) {
            backButton.addEventListener('click', () => {
                homeContent.classList.remove('hidden');
                categoryContent.classList.add('hidden');
            });
        }

        // Try to initialize if data is available
        try {
            renderCategories();
            renderFeaturedItems();
        } catch (e) {
            console.error('Error initializing catalog:', e);
        }
    }

    // TRY-ON MODAL FUNCTIONALITY

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

    // CHAT WIDGET FUNCTIONALITY - SIMPLIFIED VERSION
    document.addEventListener('DOMContentLoaded', function() {
        // Directly get elements without storing them
        const chatToggle = document.getElementById('chat-toggle');
        const closeChat = document.getElementById('close-chat');
        const minimizeChat = document.getElementById('minimize-chat');
        const chatContainer = document.getElementById('chat-container');
        const chatMessages = document.getElementById('chat-messages');
        const userInput = document.getElementById('user-message');
        const sendButton = document.getElementById('send-button');
        const typingIndicator = document.getElementById('typing-indicator');
        
        // Replace with your actual Rasa endpoint
        const RASA_ENDPOINT = 'https://981d-13-71-3-97.ngrok-free.app';
        
        let sessionId = 'user_' + Math.random().toString(36).substring(2, 15);
        let isMinimized = false;
        
        // Only setup handlers if elements exist
        if (chatToggle) {
            chatToggle.onclick = function() {
                console.log('Toggle button clicked');
                if (chatContainer) {
                    chatContainer.classList.toggle('hidden');
                    
                    // Add welcome message if first time opening
                    if (chatMessages && chatMessages.children.length === 0) {
                        const messageDiv = document.createElement('div');
                        messageDiv.className = 'bot-message';
                        
                        const avatarDiv = document.createElement('div');
                        avatarDiv.className = 'bot-avatar';
                        avatarDiv.innerHTML = '<i class="fas fa-gem"></i>';
                        
                        const bubbleDiv = document.createElement('div');
                        bubbleDiv.className = 'bot-bubble';
                        bubbleDiv.textContent = "Hey there! 👋 Welcome to Infinite AI! Type 'Hello' to start your jewelry shopping experience!";
                        
                        messageDiv.appendChild(avatarDiv);
                        messageDiv.appendChild(bubbleDiv);
                        chatMessages.appendChild(messageDiv);
                    }
                }
            };
        }
        
        if (closeChat) {
            closeChat.onclick = function() {
                console.log('Close button clicked');
                if (chatContainer) {
                    chatContainer.classList.add('hidden');
                }
            };
        }
        
        if (minimizeChat) {
            minimizeChat.onclick = function() {
                console.log('Minimize button clicked');
                if (chatContainer) {
                    if (isMinimized) {
                        chatContainer.style.height = '600px';
                        isMinimized = false;
                    } else {
                        chatContainer.style.height = '60px';
                        isMinimized = true;
                    }
                }
            };
        }
        
        if (sendButton && userInput) {
            // Send message function
            function sendMessage() {
                const message = userInput.value.trim();
                if (!message) return;
                
                // Add user message to chat
                if (chatMessages) {
                    const messageDiv = document.createElement('div');
                    messageDiv.className = 'user-message';
                    
                    const avatarDiv = document.createElement('div');
                    avatarDiv.className = 'user-avatar';
                    avatarDiv.innerHTML = '<span>You</span>';
                    
                    const bubbleDiv = document.createElement('div');
                    bubbleDiv.className = 'user-bubble';
                    bubbleDiv.textContent = message;
                    
                    messageDiv.appendChild(bubbleDiv);
                    messageDiv.appendChild(avatarDiv);
                    
                    chatMessages.appendChild(messageDiv);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }
                
                userInput.value = '';
                
                // Show typing indicator
                if (typingIndicator) {
                    typingIndicator.classList.remove('hidden');
                    if (chatMessages) {
                        chatMessages.scrollTop = chatMessages.scrollHeight;
                    }
                }
                
                // Simulate a response (replace with actual API call)
                setTimeout(function() {
                    if (typingIndicator) {
                        typingIndicator.classList.add('hidden');
                    }
                    
                    if (chatMessages) {
                        const messageDiv = document.createElement('div');
                        messageDiv.className = 'bot-message';
                        
                        const avatarDiv = document.createElement('div');
                        avatarDiv.className = 'bot-avatar';
                        avatarDiv.innerHTML = '<i class="fas fa-gem"></i>';
                        
                        const bubbleDiv = document.createElement('div');
                        bubbleDiv.className = 'bot-bubble';
                        bubbleDiv.textContent = "Thanks for your message! This is a demo response. In production, this would connect to your Rasa backend.";
                        
                        messageDiv.appendChild(avatarDiv);
                        messageDiv.appendChild(bubbleDiv);
                        chatMessages.appendChild(messageDiv);
                        chatMessages.scrollTop = chatMessages.scrollHeight;
                    }
                }, 1000);
            }
            
            // Click event
            sendButton.onclick = sendMessage;
            
            // Enter key event
            userInput.onkeypress = function(e) {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            };
        }
    });
});
