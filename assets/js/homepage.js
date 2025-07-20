// Homepage functionality
document.addEventListener('DOMContentLoaded', function() {
    loadFeaturedProducts();
    setupScrollAnimations();
});

function loadFeaturedProducts() {
    const featuredProductsContainer = document.getElementById('featured-products');
    
    if (!featuredProductsContainer) return;
    
    // Sample featured products
    const featuredProducts = [
        {
            id: 1,
            name: "Creed Aventus",
            description: "Bold and masculine fragrance",
            price: 750,
            originalPrice: 1500,
            image: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcReTTpc2D1I9eGOxQSrLqn3WfcwVfaqlNnCQHmXwnxp3Gmh6vPt7yJfTx2snf3bPUUSAOwwQJ5Rr-W5bsRNpOSGDRHKZ4_-ZiLMQgHUpTcnF6O5RBSVoCJb",
            category: "men"
        },
        {
            id: 2,
            name: "Tom Ford Oud Wood",
            description: "Exotic oud with vanilla",
            price: 750,
            originalPrice: 1500,
            image: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRSIRTlsci9Ib_kmDNRMaWOlJ1AjHx4kUUuUDL75ew-hBtIoA9yuzzE3tW271gAofUET-WJ_TzcwLr92yUckoVFSsVcyWdy4z66RaK62_E-UUAPH9Kxh-ydtYk",
            category: "men"
        },
        {
            id: 3,
            name: "Versace Eros",
            description: "Fresh and vibrant scent",
            price: 750,
            originalPrice: 1500,
            image: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTWmdCHkt2cKKnrLItHhdeaJBDMpZABrlnR5AetzbII5j96hsiPFYs35aGGtgGhAKAgtiWxc-y6uxwNTaRUhM1XNlG3X9Lt6Jsb36Y3YOqEjCJ99aF7ukzS",
            category: "men"
        }
    ];
    
    featuredProductsContainer.innerHTML = featuredProducts.map(product => `
        <div class="product-card" data-category="${product.category}">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h4>${product.name}</h4>
                <p>${product.description}</p>
                <p class="price">
                    <span class="old">₹${product.originalPrice.toLocaleString()}</span> 
                    ₹${product.price.toLocaleString()}
                </p>
                <button class="add-to-cart" 
                        data-id="${product.id}" 
                        data-name="${product.name}" 
                        data-price="${product.price}">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

function setupScrollAnimations() {
    // Simple scroll reveal animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe product cards and category cards
    document.querySelectorAll('.product-card, .category-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Handle CTA button click
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('cta-button')) {
        window.location.href = 'pages/shop.html';
    }
});
