/* home-gsap.js — GSAP + ScrollTrigger scene work for the homepage */
window.addEventListener('load', function () {
  if (!(window.gsap && window.ScrollTrigger)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.registerPlugin(ScrollTrigger);

  // ── Hero intro: wordmark rises character by character ──
  var wm = document.querySelector('.para-wordmark');
  if (wm) {
    var text = wm.textContent;
    wm.textContent = '';
    text.split('').forEach(function (ch) {
      var wrap = document.createElement('span');
      wrap.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom;';
      var inner = document.createElement('span');
      inner.style.display = 'inline-block';
      inner.textContent = ch === ' ' ? ' ' : ch;
      wrap.appendChild(inner);
      wm.appendChild(wrap);
    });
    gsap.from(wm.querySelectorAll('span > span'), {
      yPercent: 115, duration: 1.15, ease: 'power4.out', stagger: 0.045, delay: 0.2
    });
  }
  gsap.from('.para-eyebrow', { opacity: 0, y: -12, duration: 1.1, delay: 0.55, ease: 'power2.out' });
  gsap.from('.para-tagline', { opacity: 0, y: 18, duration: 1.1, delay: 1.0, ease: 'power2.out' });

  // ── Property panels: scrubbed image parallax + staggered content + drifting numeral ──
  document.querySelectorAll('.prop-panel').forEach(function (panel) {
    var img = panel.querySelector('.prop-media img');
    if (img) {
      gsap.fromTo(img,
        { yPercent: -8, scale: 1.18 },
        { yPercent: 8, scale: 1.02, ease: 'none',
          scrollTrigger: { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: true } });
    }
    gsap.from(panel.querySelectorAll('.prop-tag, .prop-title, .prop-text, .btn'), {
      y: 44, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12,
      scrollTrigger: { trigger: panel, start: 'top 55%' }
    });
    var num = panel.querySelector('.prop-num');
    if (num) {
      gsap.fromTo(num, { yPercent: 35 }, { yPercent: -35, ease: 'none',
        scrollTrigger: { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: true } });
    }
  });

  // ── Stats rise in ──
  gsap.from('.stat-item', {
    y: 32, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power2.out',
    scrollTrigger: { trigger: '.stats-strip', start: 'top 82%' }
  });

  // ── Quote band drifts against its background ──
  gsap.fromTo('.band-inner', { yPercent: 14 }, { yPercent: -14, ease: 'none',
    scrollTrigger: { trigger: '.parallax-band', start: 'top bottom', end: 'bottom top', scrub: true } });

  // ── Contact form fields cascade ──
  gsap.from('#contactForm > *', {
    y: 24, opacity: 0, stagger: 0.07, duration: 0.7, ease: 'power2.out',
    scrollTrigger: { trigger: '#contactForm', start: 'top 80%' }
  });
});

/* Lucide icons */
window.addEventListener('DOMContentLoaded', function () {
  if (window.lucide) lucide.createIcons();
});
