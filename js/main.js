/**
 * ==========================================================================
 * PORTAFOLIO ALEX QUINTANILLA GARCÍA (AAQG)
 * Lógica: Insignia 3D Tilt, Dock Activo, Filtros y Notificaciones
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initCursorSpotlight();
  init3DBadgeTilt();
  initProjectFilters();
  initCopyActions();
  initContactForm();
  initDockScrollSpy();
});

/**
 * 1. Spotlight de fondo que sigue el cursor
 */
function initCursorSpotlight() {
  const spotlight = document.getElementById('cursorSpotlight');
  if (!spotlight) return;

  window.addEventListener('mousemove', (e) => {
    document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
  }, { passive: true });
}

/**
 * 2. Efecto 3D Tilt y Reflejo Holográfico en la Insignia Personal (Badge)
 */
function init3DBadgeTilt() {
  const badge = document.getElementById('devBadge');
  const glare = document.getElementById('badgeGlare');
  if (!badge) return;

  const handleMouseMove = (e) => {
    const rect = badge.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    badge.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

    if (glare) {
      glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.25) 0%, transparent 70%)`;
      glare.style.opacity = '1';
    }
  };

  const handleMouseLeave = () => {
    badge.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    badge.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';

    if (glare) {
      glare.style.opacity = '0.7';
      glare.style.background = 'linear-gradient(125deg, rgba(255, 255, 255, 0.15) 0%, transparent 60%)';
    }
  };

  const handleMouseEnter = () => {
    badge.style.transition = 'none';
  };

  badge.addEventListener('mousemove', handleMouseMove);
  badge.addEventListener('mouseleave', handleMouseLeave);
  badge.addEventListener('mouseenter', handleMouseEnter);

  // Soporte táctil
  badge.addEventListener('touchmove', (e) => {
    if (!e.touches.length) return;
    const touch = e.touches[0];
    const rect = badge.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -8;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 8;

    badge.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
  }, { passive: true });

  badge.addEventListener('touchend', handleMouseLeave);
}

/**
 * 3. Filtros de Proyectos
 */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-pill');
  const projectCards = document.querySelectorAll('.project-item');
  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 150);
        }
      });
    });
  });
}

/**
 * 4. Copiado de Correo con Toast
 */
function initCopyActions() {
  const emailVal = 'alex.quintanilla.dev@gmail.com';
  const btnHero = document.getElementById('btnCopyEmail');
  const btnChannel = document.getElementById('btnCopyEmailChannel');

  const copy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(emailVal);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = emailVal;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      showToast(`Correo copiado: ${emailVal}`);
    } catch (err) {
      showToast(`Contacto: ${emailVal}`);
    }
  };

  if (btnHero) btnHero.addEventListener('click', copy);
  if (btnChannel) btnChannel.addEventListener('click', copy);
}

/**
 * 5. Envío y Validación del Formulario
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const msg = document.getElementById('userMessage').value.trim();

    if (!name || !email || !msg) {
      showToast('Por favor completa todos los campos.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Ingresa un correo electrónico válido.');
      return;
    }

    showToast(`¡Mensaje enviado con éxito, gracias ${name}!`);
    form.reset();
  });
}

/**
 * Utilitario Toast
 */
let toastTimer;
function showToast(message) {
  const toast = document.getElementById('toastNotice');
  const toastMsg = document.getElementById('toastNoticeMsg');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/**
 * 6. Actualizar enlaces activos en el Dock al hacer scroll
 */
function initDockScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const dockLinks = document.querySelectorAll('.dock-link');
  if (!sections.length || !dockLinks.length) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 150;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        dockLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { passive: true });
}
