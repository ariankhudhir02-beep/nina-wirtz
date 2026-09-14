document.querySelectorAll('#year').forEach((el) => { el.textContent = new Date().getFullYear(); });

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const primaryNav = document.getElementById('primary-nav');

if (navToggle && primaryNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  primaryNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      primaryNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Stat counters — the target number is the real, hardcoded text content of
// each .stat-number element. If JS fails, the correct final number is what's
// already on the page; this only animates the count-up when it enters view.
const statNumbers = document.querySelectorAll('.stat-number[data-count]');
if (statNumbers.length && 'IntersectionObserver' in window) {
  const formatters = new Map();
  const animate = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    if (Number.isNaN(target)) return;
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = value.toLocaleString('de-DE') + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString('de-DE') + suffix;
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  statNumbers.forEach((el) => observer.observe(el));
}
