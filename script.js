// Navegación móvil
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navMenu.addEventListener('click', (e) => {
        const target = e.target;
        if (target.tagName === 'A' && target.getAttribute('href').startsWith('#')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}
// Modal de emergencia
const emergencyBtn = document.getElementById('emergencyBtn');
const emergencyModal = document.getElementById('emergencyModal');

function blockScroll() {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
}
function allowScroll() {
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
}
function showEmergencyModal() {
    if (emergencyModal) {
        emergencyModal.style.display = 'block';
        blockScroll();
    }
}
function closeEmergencyModal() {
    if (emergencyModal) {
        emergencyModal.style.display = 'none';
        allowScroll();
    }
}

if (emergencyBtn && emergencyModal) {
    emergencyBtn.addEventListener('click', showEmergencyModal);
    emergencyModal.addEventListener('click', (e) => {
        if (e.target === emergencyModal) closeEmergencyModal();
    });
}

// Carrito de compras
let cart = [];
const cartIcon = document.getElementById('cartIcon');
const cartCount = document.getElementById('cartCount');
const cartModal = document.getElementById('cartModal');
const cartItems = document.getElementById('cartItems');
const cartEmpty = document.getElementById('cartEmpty');
const cartSummary = document.getElementById('cartSummary');
const cartTotal = document.getElementById('cartTotal');

function addToCart(name, price, image) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) existingItem.quantity += 1;
    else cart.push({ name, price: parseFloat(price), image, quantity: 1 });
    updateCartUI();
    showCartNotification(name);
}

function updateCartUI() {
    if (cartCount) cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    if (cart.length === 0) {
        if (cartEmpty) cartEmpty.style.display = 'block';
        if (cartSummary) cartSummary.style.display = 'none';
        if (cartItems) cartItems.innerHTML = '';
    } else {
        if (cartEmpty) cartEmpty.style.display = 'none';
        if (cartSummary) cartSummary.style.display = 'block';
        renderCartItems();
        updateCartTotal();
    }
}

function renderCartItems() {
    if (!cartItems) return;
    cartItems.innerHTML = '';
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateQuantity(${index}, -1)" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                <span class="quantity-number">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
            </div>
            <button class="remove-item" onclick="removeFromCart(${index})">×</button>
        `;
        cartItems.appendChild(cartItem);
    });
}

window.updateQuantity = function(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    updateCartUI();
};

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    updateCartUI();
};

function updateCartTotal() {
    if (!cartTotal) return;
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

function showCartModal() {
    if (cartModal) {
        cartModal.style.display = 'block';
        blockScroll();
    }
}
function closeCartModal() {
    if (cartModal) {
        cartModal.style.display = 'none';
        allowScroll();
    }
}

if (cartIcon && cartModal) {
    cartIcon.addEventListener('click', showCartModal);
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) closeCartModal();
    });
}

function proceedToCheckout() {
    if (cartTotal) {
        alert('Redirigiendo al proceso de pago...\n\nTotal: $' + cartTotal.textContent);
    }
}

// Notificación de carrito
function showCartNotification(productName) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--primary-blue);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        z-index: 1001;
        font-weight: 600;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
    `;
    notification.textContent = `"${productName}" agregado al carrito`;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (document.body.contains(notification)) document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Botones "Agregar al carrito"
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-name');
            const price = button.getAttribute('data-price');
            const image = button.getAttribute('data-image');
            addToCart(name, price, image);
        });
    });
    updateCartUI();
});

// Login modal
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');

function showLoginModal() {
    if (loginModal) {
        loginModal.style.display = 'block';
        blockScroll();
    }
}
function closeLoginModal() {
    if (loginModal) {
        loginModal.style.display = 'none';
        allowScroll();
    }
}
if (loginBtn && loginModal) {
    loginBtn.addEventListener('click', showLoginModal);
    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) closeLoginModal();
    });
}

// Scroll suave para enlaces
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Formulario de contacto
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        if (!name || !email || !message) {
            alert('Por favor, completa todos los campos.');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor, ingresa un correo electrónico válido.');
            return;
        }
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;
        setTimeout(() => {
            alert('¡Gracias por tu mensaje! Te contactaremos pronto.');
            contactForm.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 2000);
    });
}

// Animaciones al hacer scroll
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('loading');
    });
}, observerOptions);

document.querySelectorAll('.about-card, .resource-card, .product-card').forEach(el => {
    observer.observe(el);
});

// Efecto de scroll en header
let lastScrollTop = 0;
const header = document.querySelector('.header');
if (header) {
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
}

// Animaciones al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.querySelectorAll('.hero-content, .floating-card').forEach(el => {
            el.classList.add('loading');
        });
    }, 100);
    updateCartUI();
});

// Botón de emergencia animación
if (emergencyBtn) {
    emergencyBtn.addEventListener('mouseenter', () => {
        emergencyBtn.style.animation = 'none';
    });
    emergencyBtn.addEventListener('mouseleave', () => {
        emergencyBtn.style.animation = 'pulse 2s infinite';
    });
}

// Accesibilidad con teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeEmergencyModal();
        closeCartModal();
        closeLoginModal();
    }
    if (e.key === 'Enter' && e.target === emergencyBtn) {
        showEmergencyModal();
    }
    if (e.key === 'ArrowLeft') changeSlide(-1);
    else if (e.key === 'ArrowRight') changeSlide(1);
});

// Lazy loading y observer solo para imágenes que NO sean el logo
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.style.transition = 'opacity 0.3s ease-in-out';
            if (img.complete) {
                img.style.opacity = '1';
            } else {
                img.onload = () => {
                    img.style.opacity = '1';
                };
            }
            observer.unobserve(img);
        }
    });
});

document.querySelectorAll('img:not(.logo)').forEach(img => {
    img.setAttribute('loading', 'lazy');
    img.style.opacity = '0';
    imageObserver.observe(img);
});

// Donaciones
const donacionesForm = document.getElementById('donacionesForm');
if (donacionesForm) {
    donacionesForm.addEventListener('submit', function(e) {
        e.preventDefault();
        document.getElementById('donacionGracias').style.display = 'block';
        donacionesForm.reset();
        setTimeout(() => {
            document.getElementById('donacionGracias').style.display = 'none';
        }, 4000);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const emergencyBtn = document.getElementById('emergencyBtn');
    const emergencyModal = document.getElementById('emergencyModal');

    if (emergencyBtn && emergencyModal) {
        emergencyBtn.addEventListener('click', showEmergencyModal);
        emergencyModal.addEventListener('click', (e) => {
            if (e.target === emergencyModal) closeEmergencyModal();
        });
    }
});

window.addEventListener('DOMContentLoaded', function() {
  const audio = document.getElementById('bg-music');
  function enableAudio() {
    if (audio) {
      audio.muted = false;
      audio.play();
      window.removeEventListener('click', enableAudio);
    }
  }
  window.addEventListener('click', enableAudio);
});

// Galería de imágenes con modal y flechas
            // Galería con flechas
            const thumbs = Array.from(document.querySelectorAll('.carousel-thumb img'));
            const modal = document.getElementById('galleryModal');
            const modalImg = document.getElementById('galleryModalImg');
            const closeBtn = document.getElementById('galleryClose');
            const prevBtn = document.getElementById('galleryPrev');
            const nextBtn = document.getElementById('galleryNext');
            let currentIndex = 0;

            function showModal(index) {
                currentIndex = index;
                modalImg.src = thumbs[currentIndex].getAttribute('data-full');
                modalImg.alt = thumbs[currentIndex].alt;
                modal.style.display = 'flex';
            }

            thumbs.forEach((img, idx) => {
                img.addEventListener('click', () => showModal(idx));
            });

            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
                modalImg.src = '';
            });

            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + thumbs.length) % thumbs.length;
                showModal(currentIndex);
            });

            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % thumbs.length;
                showModal(currentIndex);
            });

            // Cerrar modal al hacer clic fuera de la imagen
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                    modalImg.src = '';
                }
            });

            // Navegación con flechas del teclado
            document.addEventListener('keydown', (e) => {
                if (modal.style.display === 'flex') {
                    if (e.key === 'ArrowLeft') prevBtn.click();
                    if (e.key === 'ArrowRight') nextBtn.click();
                    if (e.key === 'Escape') closeBtn.click();
                }
            });
    