/* main.js */

/* ── Dark mode toggle ───────────────────────────── */
const html = document.documentElement;
const themeToggle = document.getElementById("themeToggle");

if (localStorage.getItem("theme") === "dark") {
  html.dataset.theme = "dark";
}

themeToggle.addEventListener("click", () => {
  html.dataset.theme = html.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", html.dataset.theme);
});


/* ── Hamburger menu ─────────────────────────────── */
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

hamburger.addEventListener("click", () => {
  const isOpen = hamburger.getAttribute("aria-expanded") === "true";

  hamburger.setAttribute("aria-expanded", !isOpen);
  mobileMenu.setAttribute("aria-hidden", isOpen);
  mobileMenu.classList.toggle("is-open");
});

mobileMenu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    hamburger.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
    mobileMenu.classList.remove("is-open");
  });
});


/* ── Smooth scroll ──────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", (e) => {

    const target = document.querySelector(anchor.getAttribute("href"));

    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }

  });
});


/* ── Scroll fade animations ─────────────────────── */
const observer = new IntersectionObserver(entries => {

  entries.forEach(entry => {

    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
    }

  });

}, { threshold: 0.1 });

document
  .querySelectorAll(".feature-card, .testimonial-card, .plan")
  .forEach(el => observer.observe(el));



/* ── Animated Stat Counters ─────────────────────── */

function animateCounter(element, target, duration = 2000, suffix = "") {

  const startTime = performance.now();
  const startValue = 0;

  const prefersReduced =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    element.textContent = target + suffix;
    return;
  }

  function update(currentTime) {

    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const eased = 1 - Math.pow(1 - progress, 3);

    const current =
      Math.floor(startValue + (target - startValue) * eased);

    element.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target + suffix;
    }

  }

  requestAnimationFrame(update);

}


/* ── Trigger counter when hero enters screen ────── */

const statsSection = document.querySelector(".dashboard-mockup");

if (statsSection) {

  const statsObserver = new IntersectionObserver(entries => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {

        const statValues = document.querySelectorAll(".stat-val");

        if (statValues[0]) animateCounter(statValues[0], 98, 1500, "%");
        if (statValues[1]) animateCounter(statValues[1], 4, 1800, ".2x");
        if (statValues[2]) animateCounter(statValues[2], 12, 2000, "K");

        statsObserver.unobserve(entry.target);

      }

    });

  }, { threshold: 0.3 });

  statsObserver.observe(statsSection);

}