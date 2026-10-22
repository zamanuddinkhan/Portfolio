'use strict';

const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [
  ...context.querySelectorAll(selector),
];
const reducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)',
).matches;

// Navigation and scroll progress
const header = $('#siteHeader');
const progress = $('#scrollProgress');
const menuButton = $('#menuToggle');
const mobileNav = $('#mobileNav');

function updateScrollUI() {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 20);
  const maxScroll = Math.max(
    1,
    document.documentElement.scrollHeight - window.innerHeight,
  );
  progress.style.width = `${Math.min(100, (y / maxScroll) * 100)}%`;
}
window.addEventListener('scroll', updateScrollUI, { passive: true });
window.addEventListener('resize', updateScrollUI);
updateScrollUI();

function closeMenu() {
  mobileNav.classList.remove('open');
  mobileNav.inert = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation menu');
}
menuButton.addEventListener('click', () => {
  const opening = menuButton.getAttribute('aria-expanded') !== 'true';
  mobileNav.classList.toggle('open', opening);
  mobileNav.inert = !opening;
  menuButton.setAttribute('aria-expanded', String(opening));
  menuButton.setAttribute(
    'aria-label',
    opening ? 'Close navigation menu' : 'Open navigation menu',
  );
});
$$('.mobile-nav a').forEach((link) =>
  link.addEventListener('click', closeMenu),
);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});
document.addEventListener('click', (event) => {
  if (!mobileNav.contains(event.target) && !menuButton.contains(event.target))
    closeMenu();
});

// The currently visible section is highlighted in the desktop navigation.
const navLinks = $$('.desktop-nav .nav-link');
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const href = `#${entry.target.id}`;
        navLinks.forEach((link) =>
          link.classList.toggle(
            'is-active',
            link.getAttribute('href') === href,
          ),
        );
      });
    },
    { rootMargin: '-32% 0px -60% 0px' },
  );
  $$('#home, #about, #skills, #learning, #contact').forEach((section) =>
    sectionObserver.observe(section),
  );
}

// Scroll reveal. Reduced-motion users get all content immediately.
if (!reducedMotion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -24px 0px' },
  );
  $$('.reveal').forEach((el) => revealObserver.observe(el));
} else {
  $$('.reveal').forEach((el) => el.classList.add('in-view'));
}

// Animated job title (without dependencies).
const roles = [
  'Python Developer',
  'Aspiring Full-Stack Developer',
  'Exploring Artificial Intelligence',
];
const typingTarget = $('#typingText');
if (!reducedMotion) {
  let roleIndex = 0;
  let characterIndex = roles[0].length;
  let deleting = true;
  const animateRole = () => {
    const current = roles[roleIndex];
    typingTarget.textContent = current.slice(0, characterIndex);
    if (deleting) {
      characterIndex--;
      if (characterIndex < 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        characterIndex = 0;
        window.setTimeout(animateRole, 450);
        return;
      }
    } else {
      characterIndex++;
      if (characterIndex > current.length) {
        deleting = true;
        characterIndex = current.length;
        window.setTimeout(animateRole, 2100);
        return;
      }
    }
    window.setTimeout(animateRole, deleting ? 37 : 70);
  };
  window.setTimeout(animateRole, 1900);
}

// Theme button. Preference only affects this browser, not a server.
const themeToggle = $('#themeToggle');
const root = document.documentElement;
const savedTheme = (() => {
  try {
    return localStorage.getItem('zk-theme');
  } catch {
    return null;
  }
})();
if (savedTheme === 'light' || savedTheme === 'dark')
  root.dataset.theme = savedTheme;
function syncTheme() {
  const light = root.dataset.theme === 'light';
  themeToggle.setAttribute(
    'aria-label',
    light ? 'Switch to dark theme' : 'Switch to light theme',
  );
  document
    .querySelector('meta[name="theme-color"]')
    .setAttribute('content', light ? '#f4f7fb' : '#080e18');
  const snake = $('#contributionSnake');
  snake.src = light
    ? 'https://raw.githubusercontent.com/zamanuddinkhan/zamanuddinkhan/output/github-contribution-grid-snake.svg'
    : 'https://raw.githubusercontent.com/zamanuddinkhan/zamanuddinkhan/output/github-contribution-grid-snake-dark.svg';
}
themeToggle.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
  try {
    localStorage.setItem('zk-theme', root.dataset.theme);
  } catch {
    /* storage not available */
  }
  syncTheme();
});
syncTheme();

// Contribution image is hosted on GitHub, so show a useful fallback if unavailable.
$('#contributionSnake').addEventListener('error', () => {
  $('#contributionSnake').hidden = true;
  $('#snakeFallback').hidden = false;
});
$('#contributionSnake').addEventListener('load', () => {
  $('#contributionSnake').hidden = false;
  $('#snakeFallback').hidden = true;
});

// An entirely static portfolio cannot send form messages itself. This opens the visitor's mail client.
const form = $('#contactForm');
const formFeedback = $('#formFeedback');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const nameInput = $('#senderName');
  const emailInput = $('#senderEmail');
  const messageInput = $('#senderMessage');
  [nameInput, emailInput, messageInput].forEach((input) =>
    input.removeAttribute('aria-invalid'),
  );
  formFeedback.classList.remove('success');
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const message = messageInput.value.trim();
  if (!name) return showError(nameInput, 'Please enter your name.');
  if (!emailInput.validity.valid || !email)
    return showError(emailInput, 'Please enter a valid email address.');
  if (!message) return showError(messageInput, 'Please write a short message.');
  const subject = `Portfolio message from ${name}`;
  const body = `Hi Zamanuddin,\n\n${message}\n\nFrom: ${name}\nReply to: ${email}`;
  const mailto = `mailto:zamanuddinkhan1@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  formFeedback.textContent =
    'Opening your email app with the message prefilled. Please send it from there.';
  formFeedback.classList.add('success');
  window.location.href = mailto;
});
function showError(input, message) {
  input.setAttribute('aria-invalid', 'true');
  formFeedback.textContent = message;
  input.focus();
}

$('#currentYear').textContent = new Date().getFullYear();

// Lightweight moving particle field in the hero. Automatically disabled for reduced-motion.
const canvas = $('#heroParticles');
const ctx = canvas.getContext('2d');
if (ctx && !reducedMotion) {
  let dots = [];
  let w = 0;
  let h = 0;
  let rafId;
  const hero = $('#home');
  function resizeCanvas() {
    const bounds = hero.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = bounds.width;
    h = bounds.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(54, Math.round(w / 26));
    dots = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.5 + Math.random() * 1.3,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    dots.forEach((dot) => {
      dot.x += dot.vx;
      dot.y += dot.vy;
      if (dot.x < 0 || dot.x > w) dot.vx *= -1;
      if (dot.y < 0 || dot.y > h) dot.vy *= -1;
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(122, 204, 230, .5)';
      ctx.fill();
    });
    rafId = requestAnimationFrame(draw);
  }
  const visibilityObserver =
    'IntersectionObserver' in window
      ? new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            if (!rafId) draw();
          } else {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
        })
      : null;
  resizeCanvas();
  if (visibilityObserver) visibilityObserver.observe(hero);
  else draw();
  window.addEventListener('resize', resizeCanvas);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
      rafId = null;
    } else if (!rafId && hero.getBoundingClientRect().bottom > 0) draw();
  });
}

// Follow a mouse or trackpad without intercepting links, clicks, or text selection.
const follower = $('.cursor-follower');
const cursorDot = $('.cursor-dot');
const cursorMedia = window.matchMedia(
  '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
);
let cursorFrame = null;
let pointerX = 0;
let pointerY = 0;
let followerX = 0;
let followerY = 0;

function hideFollower() {
  follower.classList.remove('is-visible', 'is-interactive');
  cursorDot.classList.remove('is-visible');
  document.documentElement.classList.remove('has-custom-cursor');
  cancelAnimationFrame(cursorFrame);
  cursorFrame = null;
}

function drawFollower() {
  followerX += (pointerX - followerX) * 0.24;
  followerY += (pointerY - followerY) * 0.24;
  follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
  if (Math.abs(pointerX - followerX) + Math.abs(pointerY - followerY) > 0.1) {
    cursorFrame = requestAnimationFrame(drawFollower);
  } else {
    cursorFrame = null;
  }
}

document.addEventListener(
  'pointermove',
  (event) => {
    if (!cursorMedia.matches || event.pointerType === 'touch') return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    cursorDot.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
    cursorDot.classList.add('is-visible');
    document.documentElement.classList.add('has-custom-cursor');
    if (!follower.classList.contains('is-visible')) {
      followerX = pointerX;
      followerY = pointerY;
    }
    follower.classList.add('is-visible');
    follower.classList.toggle(
      'is-interactive',
      Boolean(event.target.closest('a, button, input, textarea, label')),
    );
    if (cursorFrame === null) cursorFrame = requestAnimationFrame(drawFollower);
  },
  { passive: true },
);
document.documentElement.addEventListener('pointerleave', hideFollower);
window.addEventListener('blur', hideFollower);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Tab') hideFollower();
});
cursorMedia.addEventListener('change', hideFollower);

// Technology labels remain readable if the optional icon CDN is unavailable.
$$('.toolkit-tools img').forEach((icon) => {
  icon.addEventListener('error', () => {
    icon.hidden = true;
  });
});
