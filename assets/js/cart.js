// Cart functionality
document.addEventListener('DOMContentLoaded', function() {
    loadCartItems();
    updateCartSummary();
});

function loadCartItems() {
    const cartContainer = document.getElementById('cart-container');
    const emptyCart = document.getElementById('empty-cart');
    const cartSummary = document.getElementById('cart-summary');
    
    if (!cart.items || cart.items.length === 0) {
        cartContainer.style.display = 'none';
        emptyCart.style.display = 'block';
        cartSummary.style.display = 'none';
        return;
    }
    
    cartContainer.style.display = 'block';
    emptyCart.style.display = 'none';
    cartSummary.style.display = 'block';
    
    cartContainer.innerHTML = '';
    
    cart.items.forEach(item => {
        const cartCard = createCartCard(item);
        cartContainer.appendChild(cartCard);
    });
}

function createCartCard(item) {
    const div = document.createElement('div');
    div.className = 'cart-card';
    div.innerHTML = `
        <img src="${item.image || 'https://via.placeholder.com/120x120'}" alt="${item.name}">
        <div class="details">
            <h3>${item.name}</h3>
            <p>Size: 50ml</p>
            <p class="rating">★★★★☆ 4.2 (2,100)</p>
            <p class="price">
                <span class="old">₹${(item.price * 2).toLocaleString()}</span> 
                ₹${item.price.toLocaleString()}
            </p>
            <p class="offer">1 Offer Applied · 2 Offers Available</p>
            <p class="delivery">Delivery by ${getDeliveryDate()}</p>
            <div class="actions">
                <select onchange="updateItemQuantity('${item.id}', this.value)">
                    ${generateQuantityOptions(item.quantity)}
                </select>
                <button onclick="removeFromCart('${item.id}')" class="remove">Remove</button>
                <button onclick="saveForLater('${item.id}')">Save for later</button>
                <button onclick="buyNow('${item.id}')" class="buy-now">Buy this now</button>
            </div>
        </div>
    `;
    return div;
}

function generateQuantityOptions(currentQty) {
    let options = '';
    for (let i = 1; i <= 10; i++) {
        const selected = i === currentQty ? 'selected' : '';
        options += `<option value="${i}" ${selected}>Qty: ${i}</option>`;
    }
    return options;
}

function getDeliveryDate() {
    const today = new Date();
    const deliveryDate = new Date(today.getTime() + (3 * 24 * 60 * 60 * 1000)); // 3 days from now
    return deliveryDate.toLocaleDateString('en-IN', { 
        month: 'short', 
        day: 'numeric', 
        weekday: 'short' 
    });
}

function updateItemQuantity(id, quantity) {
    cart.updateQuantity(id, parseInt(quantity));
    loadCartItems();
    updateCartSummary();
}

function removeFromCart(id) {
    if (confirm('Are you sure you want to remove this item from your cart?')) {
        cart.removeItem(id);
        loadCartItems();
        updateCartSummary();
        cart.showNotification('Item removed from cart');
    }
}

function saveForLater(id) {
    // In a real application, you would save this to a wishlist
    cart.showNotification('Item saved for later');
}

function buyNow(id) {
    // In a real application, you would redirect to checkout for this single item
    const item = cart.items.find(item => item.id === id);
    if (item) {
        cart.showNotification(`Proceeding to buy ${item.name}`);
        // window.location.href = 'checkout.html?item=' + id;
    }
}

function updateCartSummary() {
    const subtotalElement = document.getElementById('subtotal');
    const discountElement = document.getElementById('discount');
    const shippingElement = document.getElementById('shipping');
    const totalElement = document.getElementById('total');
    
    if (!subtotalElement) return;
    
    const subtotal = cart.getTotal();
    const discount = subtotal > 1000 ? subtotal * 0.05 : 0; // 5% discount for orders over ₹1000
    const shipping = subtotal > 500 ? 0 : 50; // Free shipping over ₹500
    const total = subtotal - discount + shipping;
    
    subtotalElement.textContent = `₹${subtotal.toLocaleString()}`;
    discountElement.textContent = `-₹${discount.toLocaleString()}`;
    shippingElement.textContent = shipping === 0 ? 'Free' : `₹${shipping}`;
    totalElement.textContent = `₹${total.toLocaleString()}`;
}

function changeAddress() {
    const newName = prompt('Enter your name and pin code:');
    const newAddress = prompt('Enter your address:');
    
    if (newName && newAddress) {
        document.getElementById('delivery-name').textContent = newName;
        document.getElementById('delivery-address').textContent = newAddress;
        cart.showNotification('Delivery address updated');
    }
}

function placeOrder() {
    if (!cart.items || cart.items.length === 0) {
        alert('Your cart is empty. Add some items to place an order.');
        return;
    }
    
    // In a real application, you would process the order
    const total = document.getElementById('total').textContent;
    
    if (confirm(`Place order for ${total}?`)) {
        // Simulate order processing
        cart.showNotification('Order placed successfully! 🎉');
        
        // Clear cart after successful order
        setTimeout(() => {
            cart.items = [];
            cart.saveCart();
            cart.updateCartCount();
            loadCartItems();
            updateCartSummary();
        }, 2000);
    }
}
