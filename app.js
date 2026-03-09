/* ==============================
   NAVKAR FURNITURE – APP LOGIC
   ============================== */

// ---- Cart State ----
let cart = [];

// ---- DOM Ready ----
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initCart();
  initScrollAnimations();
  updateCartUI();
});

// ==============================
// NAVBAR – scroll behavior + active links
// ==============================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Add scrolled class
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Update active nav link based on scroll position
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Smooth scroll for nav links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Close mobile menu if open
          document.getElementById('navLinks').classList.remove('mobile-open');
        }
      }
    });
  });
}

// ==============================
// MOBILE MENU
// ==============================
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('mobile-open');
    }
  });
}

// ==============================
// CART FUNCTIONALITY
// ==============================
function initCart() {
  const cartBtn = document.getElementById('cartBtn');
  const closeCart = document.getElementById('closeCart');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartSidebar = document.getElementById('cartSidebar');

  cartBtn.addEventListener('click', () => {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  const closeCartFn = () => {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  closeCart.addEventListener('click', closeCartFn);
  cartOverlay.addEventListener('click', closeCartFn);
}

function addToCart(name, price, img) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, img, qty: 1 });
  }
  updateCartUI();
  showToast(`🛒 "${name}" added to cart!`);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function updateCartUI() {
  const cartCount = document.getElementById('cartCount');
  const cartItems = document.getElementById('cartItems');
  const totalPrice = document.getElementById('totalPrice');

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = totalItems;
  cartCount.style.display = totalItems > 0 ? 'flex' : 'none';

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="cart-empty">
        <svg width="60" height="60" fill="none" stroke="#c9a96e" stroke-width="1.5" viewBox="0 0 24 24">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        <p>Your cart is empty</p>
        <span>Add some beautiful furniture!</span>
      </div>`;
    totalPrice.textContent = '₹0';
    return;
  }

  cartItems.innerHTML = cart.map((item, i) => `
    <div class="cart-item">
      <img src="${item.img}" alt="${item.name}" class="cart-item-img" />
      <div class="cart-item-details">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')} × ${item.qty}</div>
      </div>
      <button class="remove-item" onclick="removeFromCart(${i})" aria-label="Remove item">✕</button>
    </div>
  `).join('');

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  totalPrice.textContent = `₹${total.toLocaleString('en-IN')}`;
}

// ==============================
// PRODUCT FILTER
// ==============================
function filterProducts(category) {
  // Update active tab
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.classList.remove('active');
    if (tab.dataset.filter === category) {
      tab.classList.add('active');
    }
  });

  // Show/hide product cards
  const cards = document.querySelectorAll('.product-card');
  cards.forEach(card => {
    if (category === 'all' || card.dataset.category === category) {
      card.classList.remove('hidden');
      card.style.animation = 'fadeInUp 0.4s ease-out';
    } else {
      card.classList.add('hidden');
    }
  });

  // Scroll to products section smoothly
  document.getElementById('products').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ==============================
// TOAST NOTIFICATION
// ==============================
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMessage');
  toastMsg.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ==============================
// SCROLL ANIMATIONS (Intersection Observer)
// ==============================
function initScrollAnimations() {
  const animElements = document.querySelectorAll(
    '.category-card, .product-card, .benefit-card, .testimonial-card, .gallery-item'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

// ==============================
// OPEN PRODUCT MODAL (placeholder)
// ==============================
function openModal(productId) {
  // Quick view opens WhatsApp for enquiry
  const product = productId;
  const msg = encodeURIComponent(`Hello Navkar Furniture, I want to know more about product: ${product}. Please share details.`);
  window.open(`https://wa.me/919401928636?text=${msg}`, '_blank');
}
