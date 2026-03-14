/* =============================================================================
   MAIN.JS — Chatriox Landing Page
   Sections:
     1. Dark Mode Toggle
     2. Hamburger Menu
     3. Smooth Scroll
     4. Scroll Fade Animations
     5. Animated Stat Counters
   ============================================================================= */

/* =============================================================================
   1. DARK MODE TOGGLE
   ============================================================================= */

const html        = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

// Restore saved theme preference on load
if (localStorage.getItem('theme') === 'dark') {
  html.dataset.theme = 'dark';
}

themeToggle.addEventListener('click', () => {
  const isDark = html.dataset.theme === 'dark';
  html.dataset.theme = isDark ? 'light' : 'dark';
  localStorage.setItem('theme', html.dataset.theme);
});

/* =============================================================================
   2. HAMBURGER MENU
   ============================================================================= */

const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.getAttribute('aria-expanded') === 'true';

  hamburger.setAttribute('aria-expanded', String(!isOpen));
  mobileMenu.setAttribute('aria-hidden', String(isOpen));
  mobileMenu.classList.toggle('is-open');
});

// Close menu when any mobile nav link is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    mobileMenu.classList.remove('is-open');
  });
});

/* =============================================================================
   3. SMOOTH SCROLL
   ============================================================================= */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));

    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* =============================================================================
   4. SCROLL FADE ANIMATIONS
   ============================================================================= */

const fadeObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  },
  { threshold: 0.1 }
);

document
  .querySelectorAll('.feature-card, .testimonial-card, .plan')
  .forEach(el => fadeObserver.observe(el));

/* =============================================================================
   5. ANIMATED STAT COUNTERS
   ============================================================================= */

/**
 * Animates a numeric counter from 0 to a target value.
 *
 * @param {HTMLElement} element  - The DOM element to update
 * @param {number}      target   - The final numeric value
 * @param {number}      duration - Animation duration in milliseconds
 * @param {string}      suffix   - String appended after the number (e.g. '%', 'K')
 */
function animateCounter(element, target, duration = 2000, suffix = '') {
  // Respect user's motion preferences
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    element.textContent = target + suffix;
    return;
  }

  const startTime = performance.now();

  function update(currentTime) {
    const elapsed  = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease-out cubic: decelerates toward the end
    const eased   = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(target * eased);

    element.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target + suffix; // Ensure exact final value
    }
  }

  requestAnimationFrame(update);
}

// Trigger counters once the dashboard mockup scrolls into view
const dashboardMockup = document.querySelector('.dashboard-mockup');

if (dashboardMockup) {
  const statsObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const statValues = document.querySelectorAll('.stat-val');

          if (statValues[0]) animateCounter(statValues[0], 98,  1500, '%');
          if (statValues[1]) animateCounter(statValues[1], 4,   1800, '.2x');
          if (statValues[2]) animateCounter(statValues[2], 12,  2000, 'K');

          // Only animate once
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  statsObserver.observe(dashboardMockup);
}