// ── Navbar scroll effect ──────────────────────────────────────────────
const navbar = document.getElementById('navbar');
let lastScrollY = 0;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  lastScrollY = scrollY;
}, { passive: true });

// ── Mobile menu ───────────────────────────────────────────────────────
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.add('open');
  document.body.style.overflow = 'hidden';
});

const closeMobile = () => {
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
};

mobileClose.addEventListener('click', closeMobile);
document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', closeMobile);
});
mobileMenu.querySelector('.btn').addEventListener('click', closeMobile);

// ── Scroll-reveal (Intersection Observer) ────────────────────────────
const fadeEls = document.querySelectorAll('.fade-up');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

fadeEls.forEach(el => revealObserver.observe(el));

// ── Stagger children in grids ─────────────────────────────────────────
const staggerParents = document.querySelectorAll(
  '.services-grid, .srv-pills, .cases-grid, .testi-grid, .metrics-grid, .about-stats-grid'
);

staggerParents.forEach(parent => {
  const children = parent.querySelectorAll('.fade-up, .pill-row');
  children.forEach((child, i) => {
    if (child.classList.contains('fade-up')) {
      child.style.transitionDelay = `${i * 0.08}s`;
    }
  });
});

// ── FAQ Accordion ─────────────────────────────────────────────────────
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.faq-item');
    const answer = item.querySelector('.faq-answer');
    const isOpen = item.classList.contains('open');

    // Close all others
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      if (openItem !== item) {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-answer').style.maxHeight = '0';
      }
    });

    if (isOpen) {
      item.classList.remove('open');
      answer.style.maxHeight = '0';
    } else {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

// ── Newsletter form ───────────────────────────────────────────────────
const newsletterBtn   = document.querySelector('.newsletter-btn');
const newsletterInput = document.querySelector('.newsletter-input');

newsletterBtn.addEventListener('click', () => {
  const email = newsletterInput.value.trim();
  if (!email || !email.includes('@')) {
    newsletterInput.style.borderColor = '#ff4f4f';
    setTimeout(() => { newsletterInput.style.borderColor = ''; }, 2000);
    return;
  }
  newsletterBtn.textContent = '✓ Subscribed!';
  newsletterBtn.style.background = 'var(--accent-green)';
  newsletterBtn.style.color = '#0A0A0F';
  newsletterInput.value = '';
  setTimeout(() => {
    newsletterBtn.textContent = 'Subscribe';
    newsletterBtn.style.background = '';
    newsletterBtn.style.color = '';
  }, 4000);
});

// ── Smooth anchor scrolling (offset for sticky navbar) ───────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── Animate counter numbers on scroll ────────────────────────────────
const animateCounter = (el, target, prefix = '', suffix = '') => {
  const duration = 1800;
  const startTime = performance.now();
  const isFloat = target % 1 !== 0;

  const step = (currentTime) => {
    const elapsed  = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 4);
    const current  = eased * target;

    el.textContent = prefix + (isFloat ? current.toFixed(1) : Math.floor(current)) + suffix;

    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
};

const metricsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el   = entry.target;
      const text = el.textContent;

      if (text.includes('₦7B'))   animateCounter(el, 7,   '₦', 'B+');
      else if (text.includes('500K')) animateCounter(el, 500, '',  'K+');
      else if (text.includes('10K'))  animateCounter(el, 10,  '',  'K+');
      else if (text.includes('3.8'))  animateCounter(el, 3.8, '',  '×');

      metricsObserver.unobserve(el);
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll('.metric-number').forEach(el => {
  metricsObserver.observe(el);
});

// ── Respect reduced-motion ────────────────────────────────────────────
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.marquee-track, .scroll-track').forEach(el => {
    el.style.animationPlayState = 'paused';
  });
}
