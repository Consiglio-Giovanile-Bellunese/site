// Consiglio Giovanile Bellunese ODV — interazioni.
// Il sito funziona anche senza JavaScript: qui ci sono solo miglioramenti.
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Header: ombra quando si scorre ---
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // --- Menu mobile ---
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  if (toggle && nav) {
    const setOpen = open => {
      nav.classList.toggle('is-open', open);
      document.documentElement.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Chiudi il menu' : 'Apri il menu');
    };
    toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
    nav.addEventListener('click', event => { if (event.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
    });
    window.matchMedia('(min-width: 1001px)').addEventListener('change', event => { if (event.matches) setOpen(false); });
  }

  // --- Carosello progetti (scorrimento nativo + frecce) ---
  document.querySelectorAll('.rail-wrap').forEach(wrap => {
    const rail = wrap.querySelector('.rail');
    const controls = wrap.querySelector('.rail-controls');
    const [prev, next] = wrap.querySelectorAll('.rail-btn');
    if (!rail || !controls) return;
    controls.hidden = false;
    const step = () => {
      const card = rail.firstElementChild;
      return card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(rail).columnGap || 0) : rail.clientWidth;
    };
    const update = () => {
      const max = rail.scrollWidth - rail.clientWidth - 2;
      prev.disabled = rail.scrollLeft <= 2;
      next.disabled = rail.scrollLeft >= max;
      controls.hidden = max <= 0;
    };
    [prev, next].forEach(button => button.addEventListener('click', () => {
      rail.scrollBy({ left: Number(button.dataset.dir) * step(), behavior: reducedMotion ? 'auto' : 'smooth' });
    }));
    rail.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  // --- Copia negli appunti (IBAN, codice fiscale) ---
  document.querySelectorAll('[data-copy]').forEach(button => {
    button.addEventListener('click', async () => {
      const feedback = button.parentElement.querySelector('[role="status"]');
      try {
        await navigator.clipboard.writeText(button.dataset.copy);
        if (feedback) feedback.textContent = button.dataset.success || 'Copiato';
      } catch {
        // Appunti non disponibili: selezioniamo il codice, così basta Ctrl+C / "Copia".
        const value = button.parentElement.querySelector('.support-value');
        if (value) window.getSelection().selectAllChildren(value);
        if (feedback) feedback.textContent = 'Seleziona il codice qui sopra per copiarlo.';
      }
    });
  });

  // --- Galleria a schermo intero (senza JS i link aprono la foto) ---
  const lightbox = document.querySelector('.lightbox');
  const photos = [...document.querySelectorAll('[data-lightbox]')];
  if (lightbox && photos.length && typeof lightbox.showModal === 'function') {
    const img = lightbox.querySelector('img');
    const caption = lightbox.querySelector('figcaption');
    let current = 0;
    const show = n => {
      current = (n + photos.length) % photos.length;
      const thumb = photos[current].querySelector('img');
      img.src = photos[current].href;
      img.alt = thumb.alt;
      caption.textContent = `${thumb.alt} · ${current + 1} / ${photos.length}`;
    };
    photos.forEach((link, n) => link.addEventListener('click', event => {
      event.preventDefault();
      show(n);
      lightbox.showModal();
    }));
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => show(current - 1));
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => show(current + 1));
    lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
    lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
    lightbox.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') show(current - 1);
      if (event.key === 'ArrowRight') show(current + 1);
    });
    let touchX = null;
    lightbox.addEventListener('touchstart', event => { touchX = event.touches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', event => {
      if (touchX === null) return;
      const dx = event.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
      touchX = null;
    });
    lightbox.addEventListener('close', () => photos[current].focus());
  }

  // --- Finestrella email: al posto di aprire il programma di posta mostra l'indirizzo da copiare ---
  const mailLinks = document.querySelectorAll('a[href^="mailto:"]');
  if (mailLinks.length && typeof HTMLDialogElement === 'function') {
    const sheet = document.createElement('dialog');
    sheet.className = 'mail-sheet';
    sheet.setAttribute('aria-labelledby', 'mail-sheet-title');
    sheet.innerHTML = `<div class="mail-sheet-body">
      <button class="mail-sheet-close" type="button" aria-label="Chiudi">✕</button>
      <span class="mail-sheet-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="m4 7.5 8 6 8-6"/></svg></span>
      <h2 id="mail-sheet-title">Scrivici</h2>
      <p class="mail-sheet-text">Scrivi a questo indirizzo con il tuo programma di posta preferito:</p>
      <div class="mail-sheet-field">
        <strong class="mail-sheet-address"></strong>
        <button class="btn btn-gold mail-sheet-copy" type="button" data-target="address">Copia indirizzo</button>
      </div>
      <div class="mail-sheet-subject" hidden>
        <span class="mail-sheet-label">Oggetto consigliato</span>
        <div class="mail-sheet-field">
          <span class="mail-sheet-subject-text"></span>
          <button class="btn btn-outline mail-sheet-copy" type="button" data-target="subject">Copia oggetto</button>
        </div>
      </div>
      <a class="mail-sheet-app" href="#">Oppure apri l’app di posta <span aria-hidden="true">↗</span></a>
      <p class="mail-sheet-status" role="status" aria-live="polite"></p>
    </div>`;
    document.body.append(sheet);

    const address = sheet.querySelector('.mail-sheet-address');
    const subjectBox = sheet.querySelector('.mail-sheet-subject');
    const subjectText = sheet.querySelector('.mail-sheet-subject-text');
    const status = sheet.querySelector('.mail-sheet-status');
    const appLink = sheet.querySelector('.mail-sheet-app');
    let opener = null;

    const close = () => {
      if (!sheet.open || sheet.classList.contains('is-closing')) return;
      if (reducedMotion) { sheet.close(); return; }
      sheet.classList.add('is-closing');
      const finish = () => { if (sheet.open) { sheet.classList.remove('is-closing'); sheet.close(); } };
      sheet.addEventListener('animationend', finish, { once: true });
      setTimeout(finish, 400); // nel caso l'animazione non parta
    };

    mailLinks.forEach(link => link.addEventListener('click', event => {
      event.preventDefault();
      const url = new URL(link.href);
      const subject = url.searchParams.get('subject') || '';
      address.textContent = decodeURIComponent(url.pathname);
      subjectText.textContent = subject;
      subjectBox.hidden = !subject;
      appLink.href = link.href;
      status.textContent = '';
      sheet.querySelectorAll('.mail-sheet-copy').forEach(b => { b.textContent = b.dataset.target === 'address' ? 'Copia indirizzo' : 'Copia oggetto'; });
      opener = link;
      sheet.showModal();
    }));

    sheet.querySelectorAll('.mail-sheet-copy').forEach(button => button.addEventListener('click', async () => {
      const source = button.dataset.target === 'address' ? address : subjectText;
      try {
        await navigator.clipboard.writeText(source.textContent);
        const label = button.textContent;
        button.textContent = 'Copiato ✓';
        status.textContent = button.dataset.target === 'address' ? 'Indirizzo copiato' : 'Oggetto copiato';
        setTimeout(() => { button.textContent = label; }, 2000);
      } catch {
        window.getSelection().selectAllChildren(source);
        status.textContent = 'Testo selezionato: usa Copia o Ctrl+C.';
      }
    }));

    sheet.querySelector('.mail-sheet-close').addEventListener('click', close);
    appLink.addEventListener('click', close);
    sheet.addEventListener('click', event => { if (event.target === sheet) close(); });
    sheet.addEventListener('cancel', event => { event.preventDefault(); close(); });
    sheet.addEventListener('close', () => { if (opener) opener.focus(); });
  }

  // --- Anno nel footer ---
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  // --- Comparsa degli elementi allo scorrimento ---
  const items = [...document.querySelectorAll('[data-reveal]')];
  if (reducedMotion || !('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const reveal = (el, i) => {
    el.style.transitionDelay = `${i * 80}ms`;
    el.classList.add('is-visible');
    el.addEventListener('transitionend', () => { el.style.transitionDelay = ''; }, { once: true });
  };
  // Ciò che è già sullo schermo compare subito; il resto quando ci si arriva scorrendo.
  const below = [];
  let onScreen = 0;
  items.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight) reveal(el, onScreen++);
    else below.push(el);
  });
  const observer = new IntersectionObserver(entries => {
    entries.filter(entry => entry.isIntersecting).forEach((entry, i) => {
      reveal(entry.target, i);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  below.forEach(el => observer.observe(el));
});
