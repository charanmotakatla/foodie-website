// ================= USER AUTHENTICATION =================

// Get current logged-in user
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

// Get all registered users
let users = JSON.parse(localStorage.getItem("users")) || [];

// Check if user is logged in
function isLoggedIn() {
    return currentUser !== null;
}

// Get current user info
function getCurrentUser() {
    return currentUser;
}
// ===== LOGIN MODAL CONTROLS =====

const loginBtn = document.getElementById("loginBtn");
const loginModal = document.getElementById("loginModal");
const closeLogin = document.getElementById("closeLogin");
const logoutBtn = document.getElementById("logoutBtn");

// Open modal
if (loginBtn) {
    loginBtn.addEventListener("click", function (e) {
        e.preventDefault();
        loginModal.style.display = "flex";
    });
}

// Close modal
if (closeLogin) {
    closeLogin.addEventListener("click", function () {
        loginModal.style.display = "none";
    });
}

// Close when clicking outside
window.addEventListener("click", function (e) {
    if (e.target === loginModal) {
        loginModal.style.display = "none";
    }
});

// Logout button click
if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
}
// Handle Registration
function handleRegister() {
    const name = document.getElementById("regName")?.value.trim();
    const email = document.getElementById("regEmail")?.value.trim();
    const password = document.getElementById("regPassword")?.value.trim();
    const phone = document.getElementById("regPhone")?.value.trim();

    // Validation
    if (!name || !email || !password || !phone) {
        showToast("Error: Please fill all fields!");
        return;
    }

    // Validate email format
    if (!validateEmail(email)) {
        showToast("Error: Invalid email format!");
        return;
    }

    // Validate password length
    if (password.length < 6) {
        showToast("Error: Password must be at least 6 characters!");
        return;
    }

    // Check if email already exists
    if (users.some(u => u.email === email)) {
        showToast("Error: Email already registered! Try logging in.");
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password, // In real app, this would be hashed
        phone: phone,
        createdAt: new Date().toLocaleDateString()
    };

    // Save user
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // Auto login after registration
    currentUser = { id: newUser.id, name: newUser.name, email: newUser.email };
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    showToast("Success: Registration successful! Welcome " + name);
    
    // Clear form and redirect
    document.getElementById("regName").value = "";
    document.getElementById("regEmail").value = "";
    document.getElementById("regPassword").value = "";
    document.getElementById("regPhone").value = "";

    updateAuthUI();
    setTimeout(() => location.href = "#home", 1000);
}

// Handle Login
function handleLogin() {
    const email = document.getElementById("loginEmail")?.value.trim();
    const password = document.getElementById("loginPassword")?.value.trim();

    // Validation
    if (!email || !password) {
        showToast("Error: Please enter email and password!");
        return;
    }

    // Find user
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        showToast("Error: Invalid email or password!");
        return;
    }

    // Login successful
    currentUser = { id: user.id, name: user.name, email: user.email };
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    showToast("Success: Login successful! Welcome " + user.name);
    
    // Clear form
    document.getElementById("loginEmail").value = "";
    document.getElementById("loginPassword").value = "";

    updateAuthUI();
    // Close modal if open
    try { closeLoginModal(); } catch(e) {}
    setTimeout(() => location.href = "#home", 800);
}

// Handle Logout
function handleLogout() {
    currentUser = null;
    localStorage.removeItem("currentUser");
    
    showToast("Logged out successfully!");
    updateAuthUI();
    setTimeout(() => location.href = "#home", 1000);
}

// Toggle between login and register forms
function toggleForms() {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    if (loginForm && registerForm) {
        loginForm.style.display = loginForm.style.display === "none" ? "block" : "none";
        registerForm.style.display = registerForm.style.display === "none" ? "block" : "none";
    }
}

// Validate email format
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Update UI based on login status
function updateAuthUI() {
    const username = document.getElementById("username");
    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const cartGreeting = document.getElementById("cartGreeting");

    if (isLoggedIn()) {
        if (username) username.innerText = currentUser.name;
        if (cartGreeting) cartGreeting.innerText = `Hi, ${currentUser.name}`;
        if (loginBtn) loginBtn.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "inline-block";
    } else {
        if (username) username.innerText = "Guest";
        if (cartGreeting) cartGreeting.innerText = `Hi, Guest`;
        if (loginBtn) loginBtn.style.display = "inline-block";
        if (logoutBtn) logoutBtn.style.display = "none";
    }
}

// ================= FOOD MENU ITEMS =================
let products = [
    { id: 1, name: "Margherita Pizza", price: 299, oldPrice: 399, image: "food img/margherita pizza.jpg", rating: 4.6, type: "veg" },
    { id: 2, name: "Chicken Biryani", price: 249, oldPrice: 320, image: "food img/chicken-biriyani.jpg", rating: 4.7, type: "non-veg" },
    { id: 3, name: "Chocolate Shake", price: 129, oldPrice: 179, image: "food img/choclate shake.jpg", rating: 4.4, type: "veg" },
    { id: 4, name: "Ice Cream Sundae", price: 119, oldPrice: 169, image: "food img/ice cream sundae.jpg", rating: 4.6, type: "veg" },
    { id: 5, name: "Veg Sandwich", price: 89, oldPrice: 129, image: "food img/veg sandvich.jpg", rating: 4.2, type: "veg" },
    { id: 6, name: "Grilled Chicken", price: 299, oldPrice: 349, image: "food img/grilled chickemn.jpg", rating: 4.5, type: "non-veg" },
    { id: 7, name: "Veg Noodles", price: 139, oldPrice: 189, image: "food img/vegnoodles.jpg", rating: 4.3, type: "veg" },
    { id: 8, name: "White Sauce Pasta", price: 179, oldPrice: 229, image: "food img/white sauce pasta.jpg", rating: 4.4, type: "veg" },
    { id: 9, name: "Tandoori Chicken", price: 349, oldPrice: 399, image: "food img/tandoori chicken.jpg", rating: 4.7, type: "non-veg" },
    { id: 10, name: "Idli Sambar", price: 79, oldPrice: 109, image: "food img/idli sambar.jpg", rating: 4.4, type: "veg" },
    { id: 11, name: "Veg Fried Rice", price: 149, oldPrice: 199, image: "food img/veg-fried-rice-recipe.jpg", rating: 4.3, type: "veg" },
    { id: 12, name: "Brownie with Ice Cream", price: 159, oldPrice: 199, image: "food img/browni with ice creamns.jpeg", rating: 4.7, type: "veg" },
    { id: 13, name: "Chicken Momos", price: 129, oldPrice: 169, image: "food img/chicken momos.jpg", rating: 4.6, type: "non-veg" },
    { id: 14, name: "Veg Momos", price: 109, oldPrice: 149, image: "food img/veg mooves.jpg", rating: 4.3, type: "veg" },
    { id: 15, name: "Club Sandwich", price: 149, oldPrice: 199, image: "food img/club sandwich.jpg", rating: 4.4, type: "non-veg" },
    { id: 16, name: "Pav Bhaji", price: 129, oldPrice: 169, image: "food img/paav baji.jpg", rating: 4.6, type: "veg" },
    { id: 17, name: "Falooda", price: 149, oldPrice: 199, image: "food img/falooda.jpg", rating: 4.5, type: "veg" },
    { id: 18, name: "Chocolate Donut", price: 79, oldPrice: 109, image: "food img/chocalte donuts.jpg", rating: 4.3, type: "veg" },
    { id: 19, name: "Garlic Bread", price: 99, oldPrice: 139, image: "food img/garlic bread.jpg", rating: 4.4, type: "veg" },
    { id: 20, name: "Chicken Wrap", price: 179, oldPrice: 229, image: "food img/chicken wrap.jpg", rating: 4.5, type: "non-veg" },
    { id: 21, name: "Veg Supreme Pizza", price: 349, oldPrice: 449, image: "food img/veg supreme pizza.jpg", rating: 4.7, type: "veg" }
];


// ================= WISHLIST =================

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

function saveWishlist() {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

function addToWishlist(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    // Check if already in wishlist
    if (wishlist.some(item => item.id === id)) {
        removeFromWishlist(id);
        return;
    }

    wishlist.push(product);
    saveWishlist();
    showToast("Added to wishlist!");
    loadWishlist();
    loadProducts(products);
}

function removeFromWishlist(id) {
    wishlist = wishlist.filter(item => item.id !== id);
    saveWishlist();
    showToast("Removed from wishlist!");
    loadWishlist();
}

function loadWishlist() {
    const wishlistItems = document.getElementById("wishlistItems");
    const emptyWishlist = document.getElementById("emptyWishlist");
    const recommendedProducts = document.getElementById("recommendedProducts");
    const recommendedTitle = document.getElementById("recommendedTitle");

    if (!wishlistItems || !emptyWishlist) return;

    if (wishlist.length === 0) {
        // Show empty message and recommended products
        emptyWishlist.style.display = "block";
        wishlistItems.innerHTML = "";
        
        // Show recommended products (top rated)
        const recommended = [...products].sort((a, b) => b.rating - a.rating).slice(0, 9);
        
        if (recommendedProducts && recommendedTitle) {
            recommendedProducts.style.display = "grid";
            recommendedTitle.style.display = "block";
            recommendedProducts.innerHTML = "";
            
            recommended.forEach(p => {
                const discount = Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);
                const isInWishlist = wishlist.some(item => item.id === p.id);
                const heartColor = isInWishlist ? '#ff4d4d' : '#c0c0c0';
                        recommendedProducts.innerHTML += `
                        <div class="product-card">
                            <img src="${p.image}" alt="${p.name}">
                            <h3>${p.name}</h3>
                            <div class="rating">Rating: ${p.rating}</div>
                            <div class="price-section">
                                <span class="new-price">₹${p.price}</span>
                                <button class="small-heart" onclick="addToWishlist(${p.id})" title="Add to wishlist" style="background: ${isInWishlist ? '#ff4d4d' : '#ffffff'}; color: ${isInWishlist ? '#ffffff' : '#c0c0c0'}; border: ${isInWishlist ? 'none' : '1px solid #e6e6e6'};">♥</button>
                                <span class="old-price">₹${p.oldPrice}</span>
                                <span class="discount">${discount}% off</span>
                            </div>
                            <button onclick="addToCart(${p.id})">Order Now</button>
                        </div>`;
            });
        }
        return;
    }

    // Show wishlist items
    emptyWishlist.style.display = "none";
    if (recommendedProducts && recommendedTitle) {
        recommendedProducts.style.display = "none";
        recommendedTitle.style.display = "none";
    }
    wishlistItems.innerHTML = "";

    wishlist.forEach(p => {
        const discount = Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);

        wishlistItems.innerHTML += `
        <div class="product-card">
            <button class="wishlist-btn active" onclick="removeFromWishlist(${p.id})" title="Remove from wishlist">♥</button>
            <img src="${p.image}" alt="${p.name}">
            <h3>${p.name}</h3>
            <div class="rating">Rating: ${p.rating}</div>
            <div class="price-section">
                <span class="new-price">₹${p.price}</span>
                <span class="old-price">₹${p.oldPrice}</span>
                <span class="discount">${discount}% off</span>
            </div>
            <button onclick="addToCart(${p.id})">Add to Cart</button>
        </div>`;
    });
}

// ================= CART =================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Ensure quantity exists
cart = cart.map(item => ({
    ...item,
    quantity: item.quantity || 1
}));

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Delivery & promo state
const DELIVERY_FEE = 40;
let appliedPromo = JSON.parse(localStorage.getItem('appliedPromo')) || null;

// ================= FILTER STATE =================
let currentTypeFilter = "all";

function filterByType(type, button) {
    currentTypeFilter = type;
    
    // Update active button styling
    const typeButtons = document.querySelectorAll('.type-btn');
    typeButtons.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked button
    if (button) {
        button.classList.add('active');
    }
    
    // Filter and display products
    const filtered = type === "all" ? 
        products : 
        products.filter(p => p.type === type);
    
    loadProducts(filtered);
}


// ================= DISPLAY PRODUCTS =================
function loadProducts(productArray = products) {

    const productContainer = document.getElementById("productList");
    if (!productContainer) return;

    productContainer.innerHTML = "";

    if (productArray.length === 0) {
        productContainer.innerHTML = "<h3>No food found</h3>";
        return;
    }

    productArray.forEach(p => {

        const discount = Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);
        const isInWishlist = wishlist.some(item => item.id === p.id);
        const heartColor = isInWishlist ? '#ffffff' : '#c0c0c0';
        const heartBg = isInWishlist ? '#ff4d4d' : '#ffffff';
        const heartBorder = isInWishlist ? 'none' : '1px solid #e6e6e6';
        productContainer.innerHTML += `
        <div class="product-card">
            <img src="${p.image}" alt="${p.name}">
            <h3>${p.name}</h3>
            <div class="rating">Rating: ${p.rating}</div>
            <div class="price-section">
                <span class="new-price">₹${p.price}</span>
                <button class="small-heart" onclick="addToWishlist(${p.id})" title="Add to wishlist" style="background: ${heartBg}; color: ${heartColor}; border: ${heartBorder};">♥</button>
                <span class="old-price">₹${p.oldPrice}</span>
                <span class="discount">${discount}% off</span>
            </div>
            <button onclick="addToCart(${p.id})">Order Now</button>
        </div>`;
    });

    // add promo video as last grid item
    productContainer.innerHTML += `
        <div class="product-card promo-card video-card">
            <div class="video-wrap">
                <video src="food img/mango.mp4" autoplay muted loop playsinline></video>
            </div>
        </div>`;
}


// ================= SEARCH =================
function searchProducts() {
    const input = document.getElementById("searchInput");
    if (!input) return;

    const searchValue = input.value.toLowerCase();

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(searchValue)
    );

    loadProducts(filtered);
}


// ================= ADD TO CART =================
function addToCart(id) {

    const product = products.find(p => p.id === id);
    if (!product) return;

    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCart();
    showToast(product.name + " added to cart!");
}


// ================= UPDATE CART =================
function updateCart() {

    const cartItems = document.getElementById("cartItems");
    const subtotalEl = document.getElementById("subtotal");
    const cartTotalEl = document.getElementById("cartTotal");
    const emptyCartMsg = document.getElementById("emptyCartMsg");
    const cartContent = document.getElementById("cartContent");
    const cartCount = document.getElementById("cartCount");

    if (!cartItems || !subtotalEl || !cartTotalEl) return;

    // Toggle empty states
    if (!cart || cart.length === 0) {
        if (emptyCartMsg) emptyCartMsg.style.display = "block";
        if (cartContent) cartContent.style.display = "none";
        if (cartCount) cartCount.innerText = 0;
        saveCart();
        return;
    } else {
        if (emptyCartMsg) emptyCartMsg.style.display = "none";
        if (cartContent) cartContent.style.display = "flex";
    }

    cartItems.innerHTML = "";
    let subtotal = 0;
    let totalQty = 0;

    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        totalQty += item.quantity;

        const lineTotal = item.price * item.quantity;

        cartItems.innerHTML += `
        <div class="cart-card">
            <img src="${item.image}" width="70" alt="${item.name}">

            <div class="cart-info">
                <h4>${item.name}</h4>
                <p>Unit: ₹${item.price}</p>

                <div class="qty-controls">
                    <button onclick="decreaseQty(${item.id})">−</button>
                    <span class="qty-value">${item.quantity}</span>
                    <button onclick="increaseQty(${item.id})">+</button>
                </div>
                <div class="line-sub">Subtotal: ₹${lineTotal}</div>
            </div>

            <div style="display:flex; flex-direction:column; gap:8px; align-items:flex-end;">
                <button class="delete-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>`;
    });

    // Apply promo if set
    let discount = 0;
    if (appliedPromo && appliedPromo.type === 'percent') {
        discount = Math.round((appliedPromo.value / 100) * subtotal);
    }

    const delivery = (appliedPromo && appliedPromo.type === 'freeDelivery') ? 0 : DELIVERY_FEE;
    const total = subtotal + delivery - discount;

    subtotalEl.innerText = "₹" + subtotal;
    document.getElementById('deliveryFee').innerText = "₹" + delivery;
    cartTotalEl.innerText = "₹" + total;

    if (cartCount) cartCount.innerText = totalQty;

    saveCart();
}

// ================= QUANTITY =================
function increaseQty(id) {
    const item = cart.find(p => p.id === id);
    if (!item) return;

    item.quantity++;
    updateCart();
}

function decreaseQty(id) {
    const item = cart.find(p => p.id === id);
    if (!item) return;

    if (item.quantity > 1) {
        item.quantity--;
    } else {
        removeFromCart(id);
        return;
    }

    updateCart();
}


// ================= REMOVE =================
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}


// ================= TOAST =================
function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.className = "toast show";
    toast.innerHTML = message;

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}


// Update login prompt visibility
function updateLoginPrompt() {
    const loginPrompt = document.getElementById("loginPrompt");
    if (loginPrompt) {
        if (isLoggedIn()) {
            loginPrompt.classList.add("hidden");
        } else {
            loginPrompt.classList.remove("hidden");
        }
    }
}

// ================= FILTER MODAL =================
function openFilterModal() {
    const filterModal = document.getElementById("filterModal");
    if (filterModal) {
        filterModal.classList.add("active");
    }
}

function closeFilterModal() {
    const filterModal = document.getElementById("filterModal");
    if (filterModal) {
        filterModal.classList.remove("active");
    }
}

// ================= LOGIN MODAL =================
function openLoginModal() {
    const loginModal = document.getElementById("loginModal");
    if (loginModal) {
        loginModal.style.display = "flex";
    }
}

function closeLoginModal() {
    const loginModal = document.getElementById("loginModal");
    if (loginModal) {
        loginModal.style.display = "none";
    }
}

// Close login modal when clicking outside
document.addEventListener("click", (e) => {
    const loginModal = document.getElementById("loginModal");
    if (loginModal && e.target === loginModal) {
        closeLoginModal();
    }
});

// Close login modal with Escape key
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeLoginModal();
    }
});

// Close modal when clicking outside the modal content
document.addEventListener("click", (e) => {
    const filterModal = document.getElementById("filterModal");
    if (filterModal && e.target === filterModal) {
        closeFilterModal();
    }
});

// Close modal with Escape key
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeFilterModal();
    }
});

// ================= SEARCH FUNCTIONALITY =================

// Handle search when user types or clicks search button
function handleSearch() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase().trim();
    
    if (searchTerm === "") {
        loadProducts(products);
        return;
    }

    // Search by product name
    const searchResults = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm)
    );

    loadProducts(searchResults);
}

// Live search as user types
document.addEventListener("DOMContentLoaded", () => {
    // Initialize Auth UI
    updateAuthUI();
    updateLoginPrompt();

    // Load products, cart and wishlist
    loadProducts();
    updateCart();
    loadWishlist();

    // Search input events
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", handleSearch);
        searchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") handleSearch();
        });
    }

    // Price slider display update
    const priceSlider = document.getElementById("priceSlider");
    if (priceSlider) {
        priceSlider.addEventListener("input", (e) => {
            document.getElementById("priceDisplay").innerText = "₹" + e.target.value;
        });
    }

    // Logout button event
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", handleLogout);
    }
});

// ================= FILTER & SORT FUNCTIONALITY =================

let currentSort = "popular"; // Default sorting

function sortProducts(sortType) {
    currentSort = sortType;
    const searchTerm = document.getElementById("searchInput")?.value.toLowerCase().trim() || "";
    
    let filtered = searchTerm === "" 
        ? [...products] 
        : products.filter(p => p.name.toLowerCase().includes(searchTerm));

    if (sortType === "price-low") {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortType === "price-high") {
        filtered.sort((a, b) => b.price - a.price);
    } else if (sortType === "rating") {
        filtered.sort((a, b) => b.rating - a.rating);
    } else {
        filtered.sort((a, b) => b.rating - a.rating); // popular = high rating
    }

    loadProducts(filtered);
}

function filterByPrice(minPrice, maxPrice) {
    const searchTerm = document.getElementById("searchInput")?.value.toLowerCase().trim() || "";
    
    let filtered = searchTerm === "" 
        ? [...products] 
        : products.filter(p => p.name.toLowerCase().includes(searchTerm));

    filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);
    loadProducts(filtered);
}

function filterByRating(minRating) {
    const searchTerm = document.getElementById("searchInput")?.value.toLowerCase().trim() || "";
    
    let filtered = searchTerm === "" 
        ? [...products] 
        : products.filter(p => p.name.toLowerCase().includes(searchTerm));

    filtered = filtered.filter(p => p.rating >= minRating);
    loadProducts(filtered);
}

// ================= INIT =================

// ================= CHECKOUT BUTTON =================
document.addEventListener("DOMContentLoaded", () => {
    const checkoutBtn = document.getElementById("checkoutBtn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", function () {
            if (cart.length === 0) {
                showToast("Your cart is empty!");
                return;
            }

            alert("Order placed successfully!");

            // Clear cart
            cart = [];
            saveCart();
            updateCart();
        });
    }
});

// ================= GO TO PRODUCTS PAGE =================
document.addEventListener("DOMContentLoaded", () => {
    const moreProductsBtn = document.getElementById("moreProductsBtn");
    if (moreProductsBtn) {
        moreProductsBtn.addEventListener("click", function () {
            window.location.href = "#products";
        });
    }
});

// ================= PROMO & CHECKOUT HELPERS =================
function applyPromoCode() {
    const codeInput = document.getElementById('promoCode');
    const promoMessage = document.getElementById('promoMessage');
    if (!codeInput) return;

    const code = (codeInput.value || '').trim().toUpperCase();
    if (!code) {
        if (promoMessage) promoMessage.innerText = 'Enter a promo code.';
        return;
    }

    // Example promo codes
    if (code === 'MYFOOD10') {
        appliedPromo = { code: code, type: 'percent', value: 10 };
        promoMessage.innerText = 'Applied: 10% off on subtotal';
    } else if (code === 'FREESHIP') {
        appliedPromo = { code: code, type: 'freeDelivery', value: 0 };
        promoMessage.innerText = 'Applied: Free delivery';
    } else {
        appliedPromo = null;
        promoMessage.innerText = 'Invalid promo code';
        showToast('Promo code not recognized');
    }

    localStorage.setItem('appliedPromo', JSON.stringify(appliedPromo));
    updateCart();
}

function goToPayment() {
    if (!cart || cart.length === 0) {
        showToast('Your cart is empty!');
        return;
    }

    // Populate payment summary
    const paymentItems = document.getElementById('paymentItems');
    const paymentTotal = document.getElementById('paymentTotal');
    if (!paymentItems || !paymentTotal) {
        location.href = '#payment';
        return;
    }

    paymentItems.innerHTML = '';
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        paymentItems.innerHTML += `<div class="payment-line">${item.name} x ${item.quantity} — ₹${item.price * item.quantity}</div>`;
    });

    let discount = 0;
    if (appliedPromo && appliedPromo.type === 'percent') discount = Math.round((appliedPromo.value / 100) * subtotal);
    const delivery = (appliedPromo && appliedPromo.type === 'freeDelivery') ? 0 : DELIVERY_FEE;
    const total = subtotal + delivery - discount;

    paymentTotal.innerText = '₹' + total;
    location.href = '#payment';
}

function processPayment() {
    // Minimal simulated payment flow
    if (!cart || cart.length === 0) {
        showToast('Cart is empty');
        return;
    }

    // Simulate success
    const orderId = 'ORD' + Date.now();
    const paymentSuccess = document.getElementById('paymentSuccess');
    const paymentForm = document.getElementById('paymentForm');
    const orderIdEl = document.getElementById('orderId');

    if (paymentForm) paymentForm.style.display = 'none';
    if (paymentSuccess) paymentSuccess.style.display = 'block';
    if (orderIdEl) orderIdEl.innerText = orderId;

    // Clear cart
    cart = [];
    saveCart();
    updateCart();

    showToast('Payment successful — order placed');
}