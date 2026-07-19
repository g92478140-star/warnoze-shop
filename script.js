// Official Brands Base Products Data
const baseProducts = [
    { name: "Google Pixel 8 Pro", price: 275000, oldPrice: 299000, badge: "Google Official", rating: "4.9", img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500" },
    { name: "Apple iPhone 15 Pro Max", price: 385000, oldPrice: 420000, badge: "Apple Premium", rating: "5.0", img: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500" },
    { name: "Samsung Galaxy S24 Ultra", price: 399000, oldPrice: 435000, badge: "Samsung Hub", rating: "4.8", img: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500" },
    { name: "Sony WH-1000XM5 ANC", price: 95000, oldPrice: 110000, badge: "Sony Audio", rating: "4.7", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500" },
    { name: "Nike Air Max Alpha Gaming", price: 32000, oldPrice: 45000, badge: "Nike Sports", rating: "4.6", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500" },
    { name: "Google Pixel Watch 2", price: 85000, oldPrice: 99000, badge: "Google Official", rating: "4.5", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500" },
    { name: "Dell XPS 13 Laptop", price: 450000, oldPrice: 490000, badge: "Dell Official", rating: "4.8", img: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500" },
    { name: "Logitech G Pro Wireless Mouse", price: 28000, oldPrice: 35000, badge: "Logitech G", rating: "4.9", img: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500" },
    { name: "Apple AirPods Pro 2", price: 65000, oldPrice: 75000, badge: "Apple Premium", rating: "4.7", img: "https://images.unsplash.com/photo-1588449668365-d15e397f6787?w=500" },
    { name: "Sony PlayStation 5 Slim", price: 165000, oldPrice: 185000, badge: "Sony Interactive", rating: "5.0", img: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500" }
];

// Smart Multiplier Logic to Automatically Generate 1,000+ Real Products!
const productsData = [];
const variations = ["Edition", "Pro Max", "Plus Ultra", "Elite Pack", "Special Bundle", "Global Version", "Carbon Edition", "Limited Stock", "Platinum Series", "Classic Gold"];

for (let i = 1; i <= 105; i++) {
    baseProducts.forEach((prod, index) => {
        let variantIndex = (i + index) % variations.length;
        let serialNumber = (i - 1) * baseProducts.length + (index + 1);
        
        // Price fluctuations so every product looks uniquely priced
        let dynamicPrice = prod.price + (i * 150) - (index * 200);
        let dynamicOldPrice = dynamicPrice + 5000 + (i * 100);

        productsData.push({
            name: `${prod.name} (${variations[variantIndex]} #${serialNumber})`,
            price: dynamicPrice,
            oldPrice: dynamicOldPrice,
            badge: prod.badge,
            rating: (4.0 + (serialNumber % 11) / 10).toFixed(1), // Auto-generates real looking reviews (4.0 to 5.0)
            img: prod.img
        });
    });
}

// Global Cart System
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// 1. Function to Automatically Display Products Dynamically on Screen
function displayProducts(productsToRender) {
    const grid = document.getElementById("product-list");
    if(!grid) return;
    grid.innerHTML = "";
    
    productsToRender.forEach(product => {
        grid.innerHTML += `
            <div class="card" data-name="${product.name}">
                <span class="badge ${product.badge.toLowerCase().replace(' ', '-')}">${product.badge}</span>
                <img src="${product.img}" alt="${product.name}">
                <div class="card-details">
                    <h3>${product.name}</h3>
                    <div class="rating"><i class="fas fa-star"></i> <span>(${product.rating})</span></div>
                    <p class="price">Rs. ${product.price.toLocaleString()} <span class="old-price">Rs. ${product.oldPrice.toLocaleString()}</span></p>
                    <button onclick="addToCart('${product.name}', ${product.price}, '${product.img}')"><i class="fas fa-cart-plus"></i> Add to Cart</button>
                </div>
            </div>
        `;
    });
}

// 2. Add Item to Cart
function addToCart(name, price, image) {
    let existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ name, price, image, qty: 1 });
    }
    saveAndRefreshCart();
    showToast(`${name.substring(0, 25)}... Added to Cart! 🎉`);
}

function saveAndRefreshCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
}

function updateCartCount() {
    const countSpan = document.getElementById("cart-count");
    let totalItems = cart.reduce((total, item) => total + item.qty, 0);
    if (countSpan) countSpan.innerText = totalItems;
}

function toggleCart() {
    document.getElementById("cart-sidebar").classList.toggle("open");
}

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
                    <h4>${item.name.substring(0, 25)}...</h4>
                    <p>Rs. ${item.price.toLocaleString()} x ${item.qty}</p>
                </div>
                <i class="fas fa-trash-alt remove-item" onclick="removeItem(${index})"></i>
            </div>
        `;
    });
    
    totalSpan.innerText = "Rs. " + grandTotal.toLocaleString();
}

function removeItem(index) {
    cart.splice(index, 1);
    saveAndRefreshCart();
}

// Advanced Instant Search for 1000+ Items
function searchProducts() {
    let input = document.getElementById('search-bar').value.toLowerCase();
    let filtered = productsData.filter(p => p.name.toLowerCase().includes(input));
    displayProducts(filtered);
}

function showToast(message) {
    const toast = document.getElementById("toast-notification");
    toast.innerText = message;
    toast.classList.add("show");
    setTimeout(() => { toast.classList.remove("show"); }, 2500);
}

function sendOrderViaWhatsApp() {
    const name = document.getElementById("user-name").value.trim();
    const address = document.getElementById("user-address").value.trim();
    
    if (cart.length === 0) { alert("Your cart is empty!"); return; }
    if (!name || !address) { alert("Please enter your name and address."); return; }
    
    let whatsappNumber = "923366290599"; 
    let orderText = `*New Order From Warnoze-Shop*%0A%0A👤 *Customer:* ${name}%0A📍 *Address:* ${address}%0A%0A📦 *Items Ordered:*%0A`;
    
    let total = 0;
    cart.forEach(item => {
        orderText += `- ${item.name} (Qty: ${item.qty}) - Rs. ${(item.price * item.qty).toLocaleString()}%0A`;
        total += item.price * item.qty;
    });
    
    orderText += `%0A💰 *Total Amount:* Rs. ${total.toLocaleString()}%0A💳 *Payment:* JazzCash/COD`;
    window.open(`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${orderText}`, '_blank');
    
    cart = [];
    saveAndRefreshCart();
    toggleCart();
}

// Initialize Website Operations on Load
window.onload = function() {
    displayProducts(productsData); // Auto renders all 1050 official specific products instantly!
    updateCartCount();
    renderCartItems();
    
    let time = 20720;
    setInterval(() => {
        time--;
        let h = Math.floor(time / 3600);
        let m = Math.floor((time % 3600) / 60);
        let s = time % 60;
        document.getElementById("countdown-timer").innerText = `${h<10?'0'+h:h}h : ${m<10?'0'+m:m}m : ${s<10?'0'+s:s}s`;
    }, 1000);
};
