/* ============================================================
   LightSense – main.js
   Shared scripts for index.html, login.html, register.html.
   (dashboard.html is self-contained and does NOT load this file.)

   NOTE: No auth gate, no auto-redirects. Pages just render.
   ============================================================ */

// ---------- 0. Static Authentication ----------
const STATIC_EMAIL = 'admin@lightsense.com';
const STATIC_PW    = 'admin123';
const AUTH_KEY     = 'lightsense_logged_in';
const USER_KEY     = 'lightsense_user';

const path       = window.location.pathname;
const isAuthPage = path.includes('login.html') || path.includes('register.html');

// ---------- 1. Password show/hide toggle ----------
document.querySelectorAll('.toggle-pw').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = document.querySelector(btn.dataset.target);
    if (!input) return;

    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';

    const icon = btn.querySelector('i');
    if (icon) icon.className = show ? 'bi bi-eye-slash' : 'bi bi-eye';

    btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    btn.setAttribute('aria-pressed', String(show));
  });
});

// ---------- 2. Form validation & auth ----------
document.querySelectorAll('form.needs-check').forEach(form => {
  const pw    = form.querySelector('#password');
  const cf    = form.querySelector('#confirm');
  const terms = form.querySelector('#terms');

  form.addEventListener('submit', e => {
    e.preventDefault();

    if (cf && pw) {
      cf.setCustomValidity(cf.value === pw.value ? '' : 'Passwords do not match');
    }
    if (terms) {
      terms.setCustomValidity(terms.checked ? '' : 'You must accept the terms.');
    }

    form.classList.add('was-validated');

    if (!form.checkValidity()) {
      const firstInvalid = form.querySelector(':invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // ---- Login ----
    if (path.includes('login.html')) {
      const emailVal = form.querySelector('#email').value;
      const passVal  = pw.value;

      if (emailVal === STATIC_EMAIL && passVal === STATIC_PW) {
        localStorage.setItem(AUTH_KEY, 'true');
        localStorage.setItem(USER_KEY, 'Admin');
        window.location.href = 'dashboard.html';
      } else {
        alert('Invalid email or password.');
      }
    }
    // ---- Register (disabled in demo) ----
    else if (path.includes('register.html')) {
      alert('Registration is disabled for this demo. Please log in using the static account.');
      window.location.href = 'login.html';
    }
  });

  if (cf && pw) {
    const revalidate = () => {
      cf.setCustomValidity(cf.value === pw.value ? '' : 'Passwords do not match');
    };
    cf.addEventListener('input', revalidate);
    pw.addEventListener('input', revalidate);
  }
  if (terms) {
    terms.addEventListener('change', () => {
      terms.setCustomValidity(terms.checked ? '' : 'You must accept the terms.');
    });
  }
});

// ---------- 3. Logout (clear both keys consistently) ----------
document.querySelectorAll('a[href="login.html"]').forEach(link => {
  link.addEventListener('click', () => {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(USER_KEY);
  });
});