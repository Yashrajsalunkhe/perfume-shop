// Main JavaScript functionality

// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }
});

// Cart functionality
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateCartCount();
    }
    
    addItem(id, name, price, image) {
        const existingItem = this.items.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: id,
                name: name,
                price: parseFloat(price),
                image: image,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.updateCartCount();
        this.showNotification(`${name} added to cart!`);
    }
    
    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.saveCart();
        this.updateCartCount();
    }
    
    updateQuantity(id, quantity) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(id);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartCount();
            }
        }
    }
    
    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }
    
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }
    
    updateCartCount() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const count = this.getItemCount();
        
        cartCountElements.forEach(element => {
            element.textContent = count;
            element.style.display = count > 0 ? 'inline' : 'none';
        });
    }
    
    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 9999;
            transform: translateX(300px);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Hide notification
        setTimeout(() => {
            notification.style.transform = 'translateX(300px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize cart
const cart = new ShoppingCart();

// Add to cart functionality
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart')) {
        e.preventDefault();
        
        const button = e.target;
        const id = button.getAttribute('data-id');
        const name = button.getAttribute('data-name');
        const price = button.getAttribute('data-price');
        const productCard = button.closest('.product-card');
        const image = productCard ? productCard.querySelector('img').src : '';
        
        cart.addItem(id, name, price, image);
    }
});

// Utility functions
function formatPrice(price) {
    return `₹${price.toLocaleString()}`;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
