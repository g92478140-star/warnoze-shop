// Cart
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(name, price, image) {
    cart.push({
        name: name,
        price: price,
        image: image,
        qty: 1
    });

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    alert(name + " added to cart!");
}

function updateCartCount() {
    let count = document.getElementById("cart-count");
    if (count) {
        count.innerText = cart.length;
    }
}

updateCartCount();
