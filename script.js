/* ============================================================
   PRIYANKA'S PHOTOGRAPHY — SCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Contact constants ---------- */
  const PHONE_INTL = '916295772787'; // WhatsApp / call number with country code, no plus
  const EMAIL = 'priyankamaji2004@gmail.com';

  /* ---------- Loader ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader && loader.classList.add('done'), 350);
  });
  // Safety fallback in case 'load' already fired
  setTimeout(() => loader && loader.classList.add('done'), 2200);

  /* ---------- Nav scroll state ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');

    const backTop = document.getElementById('backToTop');
    if (backTop) {
      if (window.scrollY > 700) backTop.classList.add('visible');
      else backTop.classList.remove('visible');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav burger ---------- */
  const burger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      burger.classList.toggle('active', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
    });
    navLinks.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Back to top ---------- */
  const backTop = document.getElementById('backToTop');
  if (backTop) {
    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 6) * 60}ms`;
      io.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add('in-view'));
  }

  /* ---------- Gallery filters ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach((item) => {
        const match = filter === 'all' || item.getAttribute('data-cat') === filter;
        item.classList.toggle('hidden-item', !match);
      });
    });
  });

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lbImage = document.getElementById('lbImage');
  const lbCaption = document.getElementById('lbCaption');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');

  let visibleItems = [];
  let currentIndex = 0;

  const refreshVisibleItems = () => {
    visibleItems = Array.from(galleryItems).filter((item) => !item.classList.contains('hidden-item'));
  };

  const openLightbox = (item) => {
    refreshVisibleItems();
    currentIndex = visibleItems.indexOf(item);
    showSlide(currentIndex);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const showSlide = (index) => {
    if (!visibleItems.length) return;
    currentIndex = (index + visibleItems.length) % visibleItems.length;
    const item = visibleItems[currentIndex];
    const img = item.querySelector('img');
    const caption = item.querySelector('figcaption');
    lbImage.src = img.src;
    lbImage.alt = img.alt;
    lbCaption.textContent = caption ? caption.textContent : '';
  };

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => openLightbox(item));
  });

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbPrev) lbPrev.addEventListener('click', () => showSlide(currentIndex - 1));
  if (lbNext) lbNext.addEventListener('click', () => showSlide(currentIndex + 1));

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showSlide(currentIndex + 1);
    if (e.key === 'ArrowLeft') showSlide(currentIndex - 1);
  });

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Booking form ---------- */
  const form = document.getElementById('bookingForm');
  const formNote = document.getElementById('formNote');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitter = e.submitter || form.querySelector('[data-send]');
      const sendVia = submitter ? submitter.getAttribute('data-send') : 'whatsapp';

      const name = form.name.value.trim();
      const phone = form.phone.value.trim();
      const email = form.email.value.trim();
      const shootType = form.shootType.value.trim();
      const date = form.date.value;
      const location = form.location.value.trim();
      const message = form.message.value.trim();

      // Basic validation
      const missing = [];
      if (!name) missing.push('your name');
      if (!phone) missing.push('a phone number');
      if (!shootType) missing.push('the type of photoshoot');

      if (missing.length) {
        formNote.textContent = `Please fill in ${missing.join(', ')} before sending.`;
        formNote.style.color = '#b35b45';
        const firstMissingField = !name ? form.name : (!phone ? form.phone : form.shootType);
        firstMissingField.focus();
        return;
      }

      formNote.style.color = '';
      formNote.textContent = '';

      const dateText = date ? new Date(date + 'T00:00:00').toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric'
      }) : 'Not decided yet';

      const lines = [
        `Hi Priyanka! I'd like to book a photoshoot.`,
        ``,
        `Name: ${name}`,
        `Phone: ${phone}`,
        email ? `Email: ${email}` : null,
        `Shoot type: ${shootType}`,
        `Preferred date: ${dateText}`,
        location ? `Location: ${location}` : null,
        message ? `Details: ${message}` : null
      ].filter(Boolean);

      const plainMessage = lines.join('\n');

      if (sendVia === 'email') {
        const subject = `Photoshoot enquiry — ${shootType}`;
        const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(plainMessage)}`;
        window.location.href = mailto;
        formNote.style.color = '';
        formNote.textContent = 'Opening your email app with the details filled in…';
      } else {
        const waURL = `https://wa.me/${PHONE_INTL}?text=${encodeURIComponent(plainMessage)}`;
        window.open(waURL, '_blank', 'noopener');
        formNote.style.color = '';
        formNote.textContent = 'Opening WhatsApp with your details filled in…';
      }
    });
  }

});
