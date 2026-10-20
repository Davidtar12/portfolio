/* Interaction layer: theme, scroll progress, mobile nav, reveal, section spy. */
(function () {
  'use strict';

  var root = document.documentElement;
  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  var toggle = document.getElementById('themeToggle');

  function currentTheme() {
    return root.getAttribute('data-theme') || (mq.matches ? 'dark' : 'light');
  }

  function paintToggle() {
    if (!toggle) return;
    var isDark = currentTheme() === 'dark';
    toggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    toggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  }

  paintToggle();

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('dt-theme', next); } catch (err) { /* private mode */ }
      paintToggle();
    });
  }

  if (mq.addEventListener) {
    mq.addEventListener('change', paintToggle);
  } else if (mq.addListener) {
    mq.addListener(paintToggle);
  }

  /* ---------- scroll progress + masthead state ---------- */
  var bar = document.getElementById('progressBar');
  var masthead = document.getElementById('masthead');
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      var y = window.pageYOffset || window.scrollY || 0;
      var track = document.documentElement.scrollHeight - window.innerHeight;
      var ratio = track > 0 ? Math.min(1, Math.max(0, y / track)) : 0;
      if (bar) bar.style.transform = 'scaleX(' + ratio.toFixed(4) + ')';
      if (masthead) masthead.classList.toggle('is-scrolled', y > 10);
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile navigation ---------- */
  var menuBtn = document.getElementById('menuBtn');
  var nav = document.getElementById('nav');

  function closeMenu() {
    if (!nav || !menuBtn) return;
    nav.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open menu');
  }

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeMenu();
    });

    document.addEventListener('click', function (event) {
      if (!nav.classList.contains('is-open')) return;
      if (nav.contains(event.target) || menuBtn.contains(event.target)) return;
      closeMenu();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  /* ---------- reveal on scroll ---------- */
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if (prefersReduced || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });

    reveals.forEach(function (el, index) {
      el.style.transitionDelay = ((index % 3) * 70) + 'ms';
      revealObserver.observe(el);
    });
  }

  /* ---------- section spy ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__list a'));

  if ('IntersectionObserver' in window && navLinks.length) {
    var sections = navLinks.map(function (link) {
      return document.getElementById(link.getAttribute('href').slice(1));
    }).filter(Boolean);

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.setAttribute('aria-current', 'true');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    }, { rootMargin: '-42% 0px -52% 0px', threshold: 0 });

    sections.forEach(function (section) { spy.observe(section); });
  }
})();
