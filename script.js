// Initialize cart from local storage or empty array
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// 1. Add item to cart with Toast Alert
function addToCart(name, price, image) {
    // Check if item already exists
    let existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ name, price, image, qty: 1 });
    }
    
    saveAndRefreshCart();
    showToast(`${name} added to cart! 🎉`);
}

// 2. Save Cart & Refresh Display
function saveAndRefreshCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
}

// 3. Update Cart Badge Count
function updateCartCount() {
    const countSpan = document.getElementById("cart-count");
    let totalItems = cart.reduce((total, item) => total + item.qty, 0);
    if (countSpan) countSpan.innerText = totalItems;
}

// 4. Toggle Sliding Sidebar Cart
function toggleCart() {
    const sidebar = document.getElementById("cart-sidebar");
    sidebar.classList.toggle("open");
}

// 5. Render Cart Items inside Sidebar
function renderCartItems() {
    const container = document.getElementById("cart-items");
    const totalSpan = document.getElementById("cart-total");
    
    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-msg">Your cart is empty.</p>';
        totalSpan.innerText = "Rs. 0";
        return;
    }
    
    container.innerHTML = "";
    let grandTotal = 0;
    
    cart.forEach((item, index) => {
        grandTotal += item.price * item.qty;
        container.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>Rs. ${item.price} x ${item.qty}</p>
                </div>
                <i class="fas fa-trash-alt remove-item" onclick="removeItem(${index})"></i>
            </div>
        `;
    });
    
    totalSpan.innerText = "Rs. " + grandTotal.toLocaleString();
}

// 6. Remove individual item from cart
function removeItem(index) {
    cart.splice(index, 1);
    saveAndRefreshCart();
}

// 7. Live Product Search
function searchProducts() {
    let input = document.getElementById('search-bar').value.toLowerCase();
    let cards = document.getElementsByClassName('card');
    
    for (let i = 0; i < cards.length; i++) {
        let title = cards[i].getAttribute('data-name').toLowerCase();
        if (title.includes(input)) {
            cards[i].style.display = "";
        } else {
            cards[i].style.display = "none";
        }
    }
}

// 8. Custom Toast Notification System
function showToast(message) {
    const toast = document.getElementById("toast-notification");
    toast.innerText = message;
    toast.classList.add("show");
    
    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

// 9. Send Order Info Directly to WhatsApp
function sendOrderViaWhatsApp() {
    const name = document.getElementById("user-name").value.trim();
    const address = document.getElementById("user-address").value.trim();
    
    if (cart.length === 0) {
        alert("Your cart is empty! Add products first.");
        return;
    }
    if (!name || !address) {
        alert("Please enter your name and complete delivery address.");
        return;
    }
    
    let whatsappNumber = "923366290599"; // Your number structured internationally
    let orderText = `*New Order From Warnoze-Shop*%0A%0A`;
    orderText += `👤 *Customer:* ${name}%0A`;
    orderText += `📍 *Address:* ${address}%0A%0A`;
    orderText += `📦 *Items Ordered:*%0A`;
    
    let total = 0;
    cart.forEach(item => {
        orderText += `- ${item.name} (Qty: ${item.qty}) - Rs. ${item.price * item.qty}%0A`;
        total += item.price * item.qty;
    });
    
    orderText += `%0A💰 *Total Amount:* Rs. ${total}%0A`;
    orderText += `💳 *Payment Mode:* Cash on Delivery / JazzCash`;
    
    // Open in WhatsApp API
    window.open(`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${orderText}`, '_blank');
    
    // Optional: Clear cart after sending order
    cart = [];
    saveAndRefreshCart();
    toggleCart();
}

// 10. Run Automatically when Page Loads
window.onload = function() {
    updateCartCount();
    renderCartItems();
    
    // Fake interactive countdown timer logic
    let time = 20720; // total seconds (5h 45m 20s)
    setInterval(() => {
        time--;
        let h = Math.floor(time / 3600);
        let m = Math.floor((time % 3600) / 60);
        let s = time % 60;
        document.getElementById("countdown-timer").innerText = 
            `${h < 10 ? '0'+h : h}h : ${m < 10 ? '0'+m : m}m : ${s < 10 ? '0'+s : s}s`;
    }, 1000);
};
