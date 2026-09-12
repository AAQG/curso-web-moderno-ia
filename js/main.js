/**
 * ==========================================================================
 * PORTAFOLIO WEB PROFESIONAL - AAQG
 * Lógica e Interacciones Dinámicas (Vanilla JavaScript ES6+)
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Control del Menú Móvil (Drawer)
  initMobileMenu();

  // 2. Efecto de Barra de Navegación al hacer Scroll
  initNavbarScroll();

  // 3. Filtro Dinámico de Proyectos (Todos / Móvil / Web)
  initProjectFilters();

  // 4. Copiar Correo Electrónico al Portapapeles
  initCopyEmail();

  // 5. Validación y Envío Interactivo del Formulario de Contacto
  initContactForm();

  // 6. Contadores Numéricos Animados (IntersectionObserver)
  initStatCounters();

  // 7. Botón Scroll to Top
  initScrollTop();

  // 8. Resaltado de Enlaces de Navegación Activos al Desplazarse
  initActiveNavOnScroll();
});

/**
 * 1. Control de apertura/cierre del menú móvil responsive
 */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('[data-mobile-link]');

  if (!menuBtn || !mobileMenu) return;

  const toggleMenu = () => {
    const isOpen = mobileMenu.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', isOpen.toString());
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  const closeMenu = () => {
    mobileMenu.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  menuBtn.addEventListener('click', toggleMenu);

  // Cerrar al pulsar cualquier enlace del menú móvil
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Cerrar si se redimensiona a pantalla de escritorio
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });
}

/**
 * 2. Transición visual del Header en scroll
 */
function initNavbarScroll() {
  const header = document.getElementById('headerNav');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * 3. Filtrado de proyectos por categoría (All, Mobile, Web)
 */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remover clase activa de todos y añadir al clickeado
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');

        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/**
 * 4. Copiar Correo Electrónico con feedback Toast
 */
function initCopyEmail() {
  const copyBtn = document.getElementById('btnCopyEmail');
  const emailLink = document.getElementById('emailContactLink');

  if (!copyBtn || !emailLink) return;

  copyBtn.addEventListener('click', async () => {
    const emailToCopy = emailLink.textContent.trim();

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(emailToCopy);
      } else {
        // Fallback clásico
        const textArea = document.createElement('textarea');
        textArea.value = emailToCopy;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      showToast(`¡Correo copiado: ${emailToCopy}!`);
    } catch (err) {
      showToast(`Correo: ${emailToCopy}`);
    }
  });
}

/**
 * 5. Envío y validación interactiva del formulario
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const subject = document.getElementById('userSubject').value.trim();
    const message = document.getElementById('userMessage').value.trim();

    // Validación básica de campos
    if (!name || !email || !subject || !message) {
      showToast('Por favor completa todos los campos requeridos.', true);
      return;
    }

    // Validación de formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Por favor ingresa un correo electrónico válido.', true);
      return;
    }

    // Simulación de envío exitoso
    showToast(`¡Gracias ${name}! Tu mensaje ha sido enviado exitosamente.`);
    form.reset();
  });
}

/**
 * Función utilitaria para mostrar Toast animado
 */
let toastTimeout;
function showToast(message, isError = false) {
  const toast = document.getElementById('toastMessage');
  const toastText = document.getElementById('toastText');

  if (!toast || !toastText) return;

  toastText.textContent = message;

  if (isError) {
    toast.style.borderColor = 'var(--angular-ruby)';
    toast.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.8), 0 0 15px rgba(244, 63, 94, 0.3)';
  } else {
    toast.style.borderColor = 'var(--flutter-cyan)';
    toast.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.8), 0 0 15px rgba(56, 189, 248, 0.3)';
  }

  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/**
 * 6. Animación de números en contadores estadísticos
 */
function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'), 10);
          if (isNaN(target)) return;

          let current = 0;
          const duration = 1500;
          const increment = Math.max(1, Math.ceil(target / (duration / 30)));

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
              stat.textContent = target === 100 ? '100%' : (target === 2 ? '2+' : target.toString());
            } else {
              stat.textContent = current.toString();
            }
          }, 30);
        });
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.stats-grid');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/**
 * 7. Control de Scroll to Top
 */
function initScrollTop() {
  const scrollBtn = document.getElementById('scrollTopBtn');
  if (!scrollBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  }, { passive: true });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * 8. Resaltado de enlaces en scroll
 */
function initActiveNavOnScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { passive: true });
}
