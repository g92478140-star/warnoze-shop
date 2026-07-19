<!-- Instant Execution Script -->
    <script>
        // Default base products
        const defaultProducts = [
            { name: "Casual Sneakers for Men", price: 1850, oldPrice: 2999, badge: "Best Seller", rating: "4.8", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500" },
            { name: "Premium Leather Wallet", price: 950, oldPrice: 1500, badge: "Pure Leather", rating: "4.7", img: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500" },
            { name: "Smart Watch Series 9 (Copy)", price: 2499, oldPrice: 4500, badge: "Hot Item", rating: "4.5", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500" },
            { name: "Wireless Bluetooth Earbuds Pro", price: 1250, oldPrice: 2500, badge: "Premium Sound", rating: "4.6", img: "https://images.unsplash.com/photo-1588449668365-d15e397f6787?w=500" },
            { name: "Oversized Summer Cotton T-Shirt", price: 799, oldPrice: 1200, badge: "100% Cotton", rating: "4.9", img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500" },
            { name: "Stylish Sunglasses for Men & Women", price: 499, oldPrice: 999, badge: "UV Protection", rating: "4.4", img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500" }
        ];

        let baseProducts = JSON.parse(localStorage.getItem("custom_products")) || defaultProducts;
        let productsData = [];
        
        // Smart variations to make every product unique!
        const colors = ["Jet Black", "Navy Blue", "Crimson Red", "Olive Green", "Pure White", "Charcoal Gray", "Classic Brown"];
        const sizes = ["Medium", "Large", "XL", "Standard Size", "Premium Pack"];

        function generateCatalog() {
            productsData = [];
            let loops = Math.max(1, Math.ceil(1020 / baseProducts.length)); 
            
            for (let i = 1; i <= loops; i++) {
                baseProducts.forEach((prod, index) => {
                    let serialNumber = (i - 1) * baseProducts.length + (index + 1);
                    
                    // Dynamic color and size selection based on loop index
                    let selectedColor = colors[(i + index) % colors.length];
                    let selectedSize = sizes[(i + index) % sizes.length];
                    
                    // Price variations so they don't look exactly identical
                    let dynamicPrice = prod.price + (i * 15) - (index * 8);
                    if (dynamicPrice < 100) dynamicPrice = prod.price;
                    let dynamicOldPrice = dynamicPrice + 650;

                    // Building a unique name (e.g., Casual Sneakers for Men - Jet Black (XL) #45)
                    let uniqueName = `${prod.name} - ${selectedColor} (${selectedSize}) #${serialNumber}`;

                    productsData.push({
                        name: uniqueName,
                        price: dynamicPrice,
                        oldPrice: dynamicOldPrice,
                        badge: prod.badge || "New",
                        rating: (4.1 + (serialNumber % 10) / 10).toFixed(1),
                        img: prod.img || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"
                    });
                });
            }
        }

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

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
                            <p class="price">Rs. ${Math.round(product.price).toLocaleString()} <span class="old-price">Rs. ${Math.round(product.oldPrice).toLocaleString()}</span></p>
                            <button onclick="addToCart('${product.name}', ${product.price}, '${product.img}')"><i class="fas fa-cart-plus"></i> Add to Cart</button>
                        </div>
                    </div>
                `;
            });
        }

        // --- ADMIN PANEL FUNCTIONS ---
        const ADMIN_PASSWORD = "admin786";

        function openAdminPanel() {
            let pass = prompt("Enter Admin Secure Password:");
            if (pass === ADMIN_PASSWORD) {
                document.getElementById("admin-modal").classList.add("open");
                document.getElementById("admin-overlay").classList.add("open");
                renderAdminProductsList();
            } else {
                alert("Incorrect Password! Access Denied.");
            }
        }

        function closeAdminPanel() {
            document.getElementById("admin-modal").classList.remove("open");
            document.getElementById("admin-overlay").classList.remove("open");
        }

        function addNewProductFromAdmin() {
            const name = document.getElementById("new-prod-name").value.trim();
            const price = parseInt(document.getElementById("new-prod-price").value);
            const oldPrice = parseInt(document.getElementById("new-prod-oldprice").value) || price + 500;
            const badge = document.getElementById("new-prod-badge").value.trim() || "Sale";
            const img = document.getElementById("new-prod-img").value.trim();

            if (!name || !price || !img) {
                alert("Please fill Name, Price, and Image Link fields!");
                return;
            }

            baseProducts.unshift({ name, price, oldPrice, badge, img });
            localStorage.setItem("custom_products", JSON.stringify(baseProducts));
            
            document.getElementById("new-prod-name").value = "";
            document.getElementById("new-prod-price").value = "";
            document.getElementById("new-prod-oldprice").value = "";
            document.getElementById("new-prod-badge").value = "";
            document.getElementById("new-prod-img").value = "";

            alert("Product Added Successfully!");
            renderAdminProductsList();
            refreshShopUI();
        }

        function deleteProductFromAdmin(index) {
            if(confirm("Are you sure you want to delete this base product?")) {
                baseProducts.splice(index, 1);
                localStorage.setItem("custom_products", JSON.stringify(baseProducts));
                renderAdminProductsList();
                refreshShopUI();
            }
        }

        function renderAdminProductsList() {
            const container = document.getElementById("admin-manage-list");
            container.innerHTML = "";
            baseProducts.forEach((prod, idx) => {
                container.innerHTML += `
                    <div class="admin-item">
                        <span>${prod.name.substring(0,30)}... (Rs. ${prod.price})</span>
                        <button onclick="deleteProductFromAdmin(${idx})"><i class="fas fa-trash"></i></button>
                    </div>
                `;
            });
        }

        function refreshShopUI() {
            generateCatalog();
            displayProducts(productsData);
        }

        function addToCart(name, price, image) {
            let existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.qty += 1;
            } else {
                cart.push({ name: name, price: price, image: image, qty: 1 });
            }
            saveAndRefreshCart();
            showToast("Added to Cart! 🎉");
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
                            <h4>${item.name.substring(0, 22)}...</h4>
                            <p>Rs. ${Math.round(item.price).toLocaleString()} x ${item.qty}</p>
                        </div>
                        <i class="fas fa-trash-alt remove-item" onclick="removeItem(${index})"></i>
                    </div>
                `;
            });
            
            totalSpan.innerText = "Rs. " + Math.round(grandTotal).toLocaleString();
        }

        function removeItem(index) {
            cart.splice(index, 1);
            saveAndRefreshCart();
        }

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
            if (!name || !address) { alert("Please enter name and address."); return; }
            
            let whatsappNumber = "923366290599"; 
            let orderText = `*New Order From Warnoze-Shop*%0A%0A👤 *Customer:* ${name}%0A📍 *Address:* ${address}%0A%0A📦 *Items Ordered:*%0A`;
            
            let total = 0;
            cart.forEach(item => {
                orderText += `- ${item.name} (Qty: ${item.qty}) - Rs. ${Math.round(item.price * item.qty).toLocaleString()}%0A`;
                total += item.price * item.qty;
            });
            
            orderText += `%0A💰 *Total Amount:* Rs. ${Math.round(total).toLocaleString()}%0A💳 *Payment:* JazzCash/COD`;
            window.open(`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${orderText}`, '_blank');
            
            cart = [];
            saveAndRefreshCart();
            toggleCart();
        }

        // Run instantly
        setTimeout(() => {
            refreshShopUI();
            updateCartCount();
            renderCartItems();
        }, 100);

        let time = 20720;
        setInterval(() => {
            time--;
            let h = Math.floor(time / 3600);
            let m = Math.floor((time % 3600) / 60);
            let s = time % 60;
            const timerDiv = document.getElementById("countdown-timer");
            if(timerDiv) timerDiv.innerText = `${h<10?'0'+h:h}h : ${m<10?'0'+m:m}m : ${s<10?'0'+s:s}s`;
        }, 1000);
    </script>
