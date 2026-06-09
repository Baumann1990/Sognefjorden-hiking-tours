/* ── Cookie consent ──────────────────────────────────────────── */
(function initCookieConsent() {
  const KEY    = 'cookieConsent';
  const stored = localStorage.getItem(KEY);

  if (typeof gtag === 'function') {
    gtag('consent', 'update', {
      analytics_storage: stored === 'accepted' ? 'granted' : 'denied'
    });
  }

  if (stored) return;

  const banner = document.createElement('div');
  banner.id = 'cookieBanner';
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Cookie consent');
  banner.innerHTML =
    '<p class="cookie__text">We use cookies to understand how visitors find and use our tours (Google Analytics). No data is shared for advertising.</p>' +
    '<div class="cookie__actions">' +
      '<button class="cookie__btn cookie__btn--decline" id="cookieDecline">Decline</button>' +
      '<button class="cookie__btn cookie__btn--accept"  id="cookieAccept">Accept</button>' +
    '</div>';
  document.body.appendChild(banner);

  const dismiss = choice => {
    localStorage.setItem(KEY, choice);
    if (choice === 'accepted' && typeof gtag === 'function') {
      gtag('consent', 'update', { analytics_storage: 'granted' });
    }
    banner.classList.add('cookie--hidden');
    setTimeout(() => banner.remove(), 300);
  };

  document.getElementById('cookieAccept').addEventListener('click', () => dismiss('accepted'));
  document.getElementById('cookieDecline').addEventListener('click', () => dismiss('declined'));
})();

/* ── Gallery rotation ────────────────────────────────────────── */
const GALLERY_POOL = [
  { src: 'images/fossestien-2.jpg',
    srcset: 'images/fossestien-2-480w.jpg 480w, images/fossestien-2-768w.jpg 768w, images/fossestien-2.jpg 1200w',
    alt: 'Waterfall trail through Norwegian forest' },
  { src: 'images/fossestien-3.jpg',
    srcset: 'images/fossestien-3-480w.jpg 480w, images/fossestien-3-768w.jpg 768w, images/fossestien-3.jpg 1064w',
    alt: 'Hikers on Fossestien waterfall path' },
  { src: 'images/bergefjellet-2.jpg',
    srcset: 'images/bergefjellet-2-480w.jpg 480w, images/bergefjellet-2-768w.jpg 768w, images/bergefjellet-2.jpg 1600w',
    alt: 'Mountain ridge above Høyanger fjord' },
  { src: 'images/bergefjellet-3.jpg',
    srcset: 'images/bergefjellet-3-480w.jpg 480w, images/bergefjellet-3-768w.jpg 768w, images/bergefjellet-3.jpg 1600w',
    alt: 'Panoramic Sognefjord views from Bergefjellet' },
  { src: 'images/kraftruta-2.jpg',
    srcset: 'images/kraftruta-2-480w.jpg 480w, images/kraftruta-2-768w.jpg 768w, images/kraftruta-2.jpg 1066w',
    alt: 'The Power Route across Berge mountains' },
  { src: 'images/kraftruta-3.jpg',
    srcset: 'images/kraftruta-3-480w.jpg 480w, images/kraftruta-3-768w.jpg 768w, images/kraftruta-3.jpg 1600w',
    alt: 'Høyangerfjord from Kraftruta summit' },
  { src: 'images/solrenningen-2.jpg',
    srcset: 'images/solrenningen-2-480w.jpg 480w, images/solrenningen-2-768w.jpg 768w, images/solrenningen-2.jpg 1200w',
    alt: 'Alpine terrain in Stølsheimen' },
  { src: 'images/gallery-1.jpg',   alt: 'Fjord views from Norwegian trail' },
  { src: 'images/gallery-2.jpg',
    srcset: 'images/gallery-2-480w.jpg 480w, images/gallery-2-768w.jpg 768w, images/gallery-2.jpg 1536w',
    alt: 'Rocky trail with fjord in the distance' },
  { src: 'images/gallery-3.jpg',
    srcset: 'images/gallery-3-480w.jpg 480w, images/gallery-3-768w.jpg 768w, images/gallery-3.jpg 1536w',
    alt: 'Mountain lake in Vestland county' },
];

const GALLERY_COUNT = 8;

(function buildGallery() {
  const track = document.getElementById('galleryTrack');
  if (!track) return;

  const pool = [...GALLERY_POOL];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  // On touch devices show fewer images so the carousel scrolls nicely
  const isTouch = !window.matchMedia('(hover: hover)').matches;
  const count   = isTouch ? 6 : GALLERY_COUNT;

  pool.slice(0, count).forEach(({ src, srcset, alt }) => {
    const img = document.createElement('img');
    img.src     = src;
    if (srcset) img.srcset = srcset;
    img.sizes   = '(max-width: 768px) 80vw, 20vw';
    img.alt     = alt;
    img.loading = 'lazy';
    track.appendChild(img);
  });
})();

/* ── Nav: scroll state ───────────────────────────────────────── */
const nav = document.getElementById('nav');

const updateNav = () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
};

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ── Nav: mobile toggle ──────────────────────────────────────── */
const toggle = document.getElementById('navToggle');
const menu   = document.getElementById('navMenu');

toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});

menu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', false);
  });
});

/* ── Tour cards — whole card clickable ──────────────────────── */
document.querySelectorAll('.tour-card').forEach(card => {
  const detailsLink = card.querySelector('.btn--outline');
  if (!detailsLink) return;
  card.addEventListener('click', e => {
    if (!e.target.closest('a') && !e.target.closest('button')) {
      window.location.href = detailsLink.href;
    }
  });
});

/* ── Tour filters ────────────────────────────────────────────── */
const filters   = document.querySelectorAll('.filter');
const tourCards = document.querySelectorAll('.tour-card');

filters.forEach(btn => {
  btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const f = btn.dataset.filter;

    tourCards.forEach(card => {
      if (f === 'all') {
        card.classList.remove('hidden');
        return;
      }
      const match = card.dataset.surface === f || card.dataset.level === f;
      card.classList.toggle('hidden', !match);
    });
  });
});

/* ── Scroll fade-in ──────────────────────────────────────────── */
const fadeEls = document.querySelectorAll(
  '.tour-card, .about__grid, .book__grid, .section-header'
);

fadeEls.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
);

fadeEls.forEach(el => observer.observe(el));

/* ── Modals ──────────────────────────────────────────────────── */
const openModal = id => {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  modal.querySelector('.modal__close').focus();
};

const closeModal = modal => {
  modal.hidden = true;
  document.body.style.overflow = '';
};

document.querySelectorAll('[data-modal]').forEach(btn => {
  btn.addEventListener('click', () => openModal(btn.dataset.modal));
});

document.querySelectorAll('.modal').forEach(modal => {
  modal.querySelector('.modal__close').addEventListener('click', () => closeModal(modal));
  modal.querySelector('.modal__backdrop').addEventListener('click', () => closeModal(modal));
  modal.querySelectorAll('.modal__book').forEach(a => {
    a.addEventListener('click', () => closeModal(modal));
  });
});

document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  document.querySelectorAll('.modal:not([hidden])').forEach(closeModal);
});

/* ── Booking form ────────────────────────────────────────────── */
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

const dateInput = document.getElementById('date');
if (dateInput) {
  dateInput.min = new Date().toISOString().split('T')[0];
}

const form         = document.getElementById('bookForm');
const confirmPanel = document.getElementById('formConfirm');

if (form) {
  const setFieldError = (id, message) => {
    const field = document.getElementById(id);
    const span  = document.getElementById('error-' + id);
    if (field) field.classList.add('input--error');
    if (span)  span.textContent = message;
  };

  const clearFieldError = (id) => {
    const field = document.getElementById(id);
    const span  = document.getElementById('error-' + id);
    if (field) field.classList.remove('input--error');
    if (span)  span.textContent = '';
  };

  const validateForm = () => {
    let valid = true;
    ['name', 'email', 'tour', 'date', 'hikers'].forEach(id => clearFieldError(id));

    const name = form.querySelector('#name');
    if (!name.value.trim()) {
      setFieldError('name', 'Please enter your name.');
      valid = false;
    }

    const email = form.querySelector('#email');
    if (!email.value.trim()) {
      setFieldError('email', 'Please enter your email address.');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
      setFieldError('email', 'Please enter a valid email address (e.g. you@example.com).');
      valid = false;
    }

    const tour = form.querySelector('#tour');
    if (!tour.value) {
      setFieldError('tour', 'Please select a tour.');
      valid = false;
    }

    const date = form.querySelector('#date');
    if (!date.value) {
      setFieldError('date', 'Please pick a preferred date.');
      valid = false;
    }

    const hikers = form.querySelector('#hikers');
    if (!hikers.value) {
      setFieldError('hikers', 'Please enter the number of hikers.');
      valid = false;
    }

    return valid;
  };

  ['name', 'email', 'tour', 'date', 'hikers'].forEach(id => {
    const field = document.getElementById(id);
    if (field) field.addEventListener('input', () => clearFieldError(id));
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();

    if (!validateForm()) return;

    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled    = true;

    try {
      const res  = await fetch(WEB3FORMS_ENDPOINT, {
        method:  'POST',
        headers: { 'Accept': 'application/json' },
        body:    new FormData(form),
      });
      const data = await res.json();

      if (data.success) {
        form.style.display = 'none';
        confirmPanel.style.display = 'flex';
      } else {
        btn.textContent = 'Something went wrong — try again';
        btn.disabled    = false;
      }
    } catch {
      btn.textContent = 'Network error — try again';
      btn.disabled    = false;
    }
  });
}

/* ── Mobile sticky "Book a Tour" bar ────────────────────────────
   Slides up from the bottom once the hero scrolls out of view.
   Hides again when the booking form is visible (homepage only).
   On sub-pages (no #book section) it stays visible until the user
   navigates to the booking form on the homepage.
   ──────────────────────────────────────────────────────────────── */
(function initMobileBookBar() {
  /* Only run on touch/mobile — matchMedia keeps desktop untouched */
  if (!window.matchMedia('(max-width: 768px)').matches) return;
  if (typeof IntersectionObserver === 'undefined') return;

  /* Resolve the booking link: same-page anchor or root homepage */
  var bookTarget = document.getElementById('book') ? '#book' : '/#book';

  /* Inject the bar */
  var bar = document.createElement('div');
  bar.className = 'mobile-book-bar';
  bar.innerHTML = '<a href="' + bookTarget + '" class="btn btn--primary">Book a Tour</a>';
  document.body.appendChild(bar);
  document.body.classList.add('has-book-bar');

  var heroPassed  = false;
  var bookVisible = false;

  function refresh() {
    bar.classList.toggle('is-visible', heroPassed && !bookVisible);
  }

  /* Watch the hero: show bar once it scrolls out of view */
  var heroEl = document.querySelector('.hero') || document.querySelector('.article__hero');
  if (heroEl) {
    new IntersectionObserver(function(entries) {
      heroPassed = !entries[0].isIntersecting;
      refresh();
    }, { threshold: 0 }).observe(heroEl);
  } else {
    /* Fallback: no hero found → show bar immediately */
    heroPassed = true;
    refresh();
  }

  /* Watch the booking form (homepage only): hide bar when in view */
  var bookEl = document.getElementById('book');
  if (bookEl) {
    new IntersectionObserver(function(entries) {
      bookVisible = entries[0].isIntersecting;
      refresh();
    }, { threshold: 0.15 }).observe(bookEl);
  }
}());
