// AB CARE AFH — shared page behavior
(function () {
  // ---------- Mobile menu ----------
  const mmToggle = document.getElementById('mm-toggle');
  const mm = document.getElementById('mm');
  if (mmToggle && mm) {
    const closeMenu = () => {
      mm.classList.remove('open');
      mm.classList.add('hidden');
      mmToggle.setAttribute('aria-expanded', 'false');
    };
    mmToggle.addEventListener('click', () => {
      const isOpen = mm.classList.toggle('open');
      mm.classList.toggle('hidden', !isOpen);
      mmToggle.setAttribute('aria-expanded', String(isOpen));
    });
    mm.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', closeMenu);
    });
  }

  // ---------- Scroll reveal + stat counters ----------
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('in-view');
        e.target.querySelectorAll('[data-count]').forEach((el) => {
          const target = parseInt(el.dataset.count, 10);
          if (!Number.isFinite(target)) return;
          const start = performance.now();
          const duration = 1200;
          const step = (now) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            el.textContent = Math.round(target * eased);
            if (t < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
        io.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('in-view'));
    document.querySelectorAll('[data-count]').forEach((el) => {
      el.textContent = el.dataset.count;
    });
  }

  // ---------- Gallery lightbox (gallery.html only) ----------
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const img = document.getElementById('lb-img');
    const closeBtn = document.getElementById('lb-close');
    const prevBtn = document.getElementById('lb-prev');
    const nextBtn = document.getElementById('lb-next');
    const caption = document.getElementById('lb-caption');
    const counter = document.getElementById('lb-counter');
    const items = Array.from(document.querySelectorAll('.gallery-item img'));
    let index = 0;

    const show = (i) => {
      if (!items.length) return;
      index = (i + items.length) % items.length;
      const item = items[index];
      if (img) {
        img.src = item.currentSrc || item.getAttribute('src');
        img.alt = item.getAttribute('alt') || '';
      }
      if (caption) caption.textContent = item.getAttribute('alt') || '';
      if (counter) counter.textContent = `${index + 1} / ${items.length}`;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };
    const hide = () => {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (img) img.src = '';
    };

    items.forEach((el, i) => {
      const tile = el.closest('.gallery-item');
      if (tile) tile.addEventListener('click', () => show(i));
    });

    if (closeBtn) closeBtn.addEventListener('click', (e) => { e.stopPropagation(); hide(); });
    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); show(index - 1); });
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); show(index + 1); });

    // Click outside image closes
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) hide();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') hide();
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });

    // Swipe nav
    let sx = null;
    lightbox.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
      if (sx == null) return;
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
      sx = null;
    });
  }
})();
