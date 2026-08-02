/**
 * Muhammad Sohaib — Portfolio
 * Vanilla ES6+ interactions: theme toggle, mobile nav, FAQ accordion,
 * scroll reveal, back-to-top, page loader, contact form validation.
 * No build step required — loaded with `defer`.
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initPageLoader();
  initThemeToggle();
  initMobileNav();
  initFaqAccordion();
  initBackToTop();
  initScrollReveal();
  initContactForm();
  initYear();
});

/* -------------------------------------------------------------------------
 * Page loader
 * ---------------------------------------------------------------------- */
function initPageLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('is-hidden');
      setTimeout(() => loader.setAttribute('hidden', ''), 400);
    }, 200);
  });
}

/* -------------------------------------------------------------------------
 * Theme toggle (persisted in localStorage)
 * ---------------------------------------------------------------------- */
function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  const root = document.documentElement;
  const STORAGE_KEY = 'ms-theme';

  const savedTheme = localStorage.getItem(STORAGE_KEY);
  if (savedTheme) root.setAttribute('data-theme', savedTheme);

  toggle.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_KEY, next);
    toggle.setAttribute('aria-pressed', String(!isDark));
  });
}

/* -------------------------------------------------------------------------
 * Mobile navigation
 * ---------------------------------------------------------------------- */
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  if (!hamburger || !mobileNav) return;

  const closeMenu = () => {
    mobileNav.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
  };

  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('is-open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

/* -------------------------------------------------------------------------
 * FAQ accordion (single-open, accessible)
 * ---------------------------------------------------------------------- */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  const closeItem = (item) => {
    const question = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    item.classList.remove('is-open');
    question.setAttribute('aria-expanded', 'false');
    answer.style.maxHeight = null;
  };

  const openItem = (item) => {
    const question = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    item.classList.add('is-open');
    question.setAttribute('aria-expanded', 'true');
    answer.style.maxHeight = `${answer.scrollHeight}px`;
  };

  items.forEach((item) => {
    const question = item.querySelector('.faq-q');
    if (item.classList.contains('is-open')) openItem(item);

    question.addEventListener('click', () => {
      const wasOpen = item.classList.contains('is-open');
      items.forEach(closeItem);
      if (!wasOpen) openItem(item);
    });
  });
}

/* -------------------------------------------------------------------------
 * Back-to-top button
 * ---------------------------------------------------------------------- */
function initBackToTop() {
  const button = document.getElementById('back-to-top');
  if (!button) return;

  const SHOW_AFTER_PX = 500;
  let ticking = false;

  const updateVisibility = () => {
    button.classList.toggle('is-visible', window.scrollY > SHOW_AFTER_PX);
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateVisibility);
      ticking = true;
    }
  });

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* -------------------------------------------------------------------------
 * Scroll reveal (IntersectionObserver)
 * ---------------------------------------------------------------------- */
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-in'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach((el) => observer.observe(el));
}

/* -------------------------------------------------------------------------
 * Contact form validation
 * Ready to wire up to Formspree / Netlify Forms / EmailJS — see README.
 * ---------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const status = document.getElementById('form-status');
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const requiredFields = ['fname', 'femail', 'fmessage'];

  const setFieldState = (field, isValid) => {
    const wrapper = field.closest('.form-field');
    wrapper.classList.toggle('is-invalid', !isValid);
  };

  const validate = () => {
    let isValid = true;

    requiredFields.forEach((id) => {
      const field = document.getElementById(id);
      const filled = field.value.trim().length > 0;
      setFieldState(field, filled);
      if (!filled) isValid = false;
    });

    const emailField = document.getElementById('femail');
    const emailOk = EMAIL_PATTERN.test(emailField.value.trim());
    setFieldState(emailField, emailOk);
    if (!emailOk) isValid = false;

    return isValid;
  };

  const showStatus = (message, type) => {
    status.textContent = message;
    status.classList.remove('is-success', 'is-error');
    status.classList.add('is-visible', type === 'success' ? 'is-success' : 'is-error');
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!validate()) {
      showStatus('Please fix the highlighted fields above.', 'error');
      return;
    }

    // NOTE: This demo only validates client-side. To actually receive
    // submissions, connect this form to a service such as Formspree,
    // Netlify Forms, or EmailJS. See README.md → "Contact Form Integration".
    showStatus("Thanks! Your request has been received — I'll be in touch shortly.", 'success');
    form.reset();
  });
}

/* -------------------------------------------------------------------------
 * Footer year
 * ---------------------------------------------------------------------- */
function initYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}
