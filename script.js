// Basic portfolio interactions
// (Comments reflect my thought process while wiring features.)

// --- Footer year ---
// Keep copyright current automatically
document.getElementById('year').textContent = new Date().getFullYear();

// --- Mobile navigation toggle ---
// Handles opening/closing the menu and accessibility states
const navToggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('primary-menu');
const links = Array.from(menu?.querySelectorAll('a') || []);

function closeMenu() {
  document.body.classList.remove('nav-open');
  navToggle?.setAttribute('aria-expanded', 'false');
}

navToggle?.addEventListener('click', () => {
  const open = !document.body.classList.contains('nav-open');
  document.body.classList.toggle('nav-open', open);
  navToggle.setAttribute('aria-expanded', String(open));
});

// Close on link click (mobile only intention)
links.forEach(a => a.addEventListener('click', closeMenu));

// Auto-close if resized beyond mobile breakpoint
window.addEventListener('resize', () => {
  if (window.innerWidth > 720) closeMenu();
});

// --- Typewriter effect for name ---
// Simple loop typing one character at a time
(function () {
  const nameTarget = document.getElementById('typed-name');
  if (!nameTarget) return;
  const nameText = nameTarget.getAttribute('aria-label') || '';
  let i = 0;
  function type() {
    if (i <= nameText.length) {
      nameTarget.textContent = nameText.slice(0, i);
      i++;
      setTimeout(type, 90); // speed tweakable
    }
  }
  type();
})();

// --- Expand / collapse extra projects ---
// Refactored: class-based collapsible with DOMContentLoaded init
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('more-projects-toggle');
  const panel = document.getElementById('more-projects');
  if (!btn || !panel) return;

  // Initial collapsed state
  panel.classList.add('collapsible', 'is-collapsed');
  panel.setAttribute('aria-hidden', 'true');
  if (panel.hasAttribute('hidden')) panel.removeAttribute('hidden');
  panel.style.maxHeight = '0px';
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = 'More Projects <span aria-hidden="true">▾</span>';

  function expand() {
    panel.setAttribute('aria-hidden', 'false');
    panel.classList.replace('is-collapsed', 'is-expanded');
    panel.style.maxHeight = panel.scrollHeight + 'px';
    btn.setAttribute('aria-expanded', 'true');
    btn.innerHTML = 'Less Projects <span aria-hidden="true">▴</span>';
  }

  function collapse() {
    panel.setAttribute('aria-hidden', 'true');
    // Capture current height then animate to zero
    panel.style.maxHeight = panel.scrollHeight + 'px';
    requestAnimationFrame(() => {
      panel.classList.replace('is-expanded', 'is-collapsed');
      panel.style.maxHeight = '0px';
    });
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = 'More Projects <span aria-hidden="true">▾</span>';
  }

  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    expanded ? collapse() : expand();
  });

  // Adjust height on resize if expanded
  window.addEventListener('resize', () => {
    if (btn.getAttribute('aria-expanded') === 'true') {
      panel.style.maxHeight = panel.scrollHeight + 'px';
    }
  });
});

// --- Active Navigation Highlight (Scroll Spy) ---
(function () {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.menu-link');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3 // Trigger when 30% of section is visible
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Remove active class from all links
        navLinks.forEach(link => link.classList.remove('active'));

        // Add active class to the corresponding link
        const id = entry.target.getAttribute('id');
        const activeLink = document.querySelector(`.menu-link[href="#${id}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
})();
