/* motion.js — scroll progress, custom cursor, kinetic type, parallax, reveals, magnetic buttons */
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Grain overlay
  var grain = document.createElement('div');
  grain.className = 'grain'; grain.setAttribute('aria-hidden', 'true');
  document.body.appendChild(grain);

  // Scroll progress
  var prog = document.createElement('div');
  prog.className = 'scroll-progress'; prog.setAttribute('aria-hidden', 'true');
  document.body.appendChild(prog);
  window.addEventListener('scroll', function () {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    prog.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
  }, { passive: true });

  // Custom cursor (desktop only)
  if (window.matchMedia('(pointer: fine)').matches && !reduced) {
    var dot = document.createElement('div'); dot.className = 'cursor-dot';
    var ring = document.createElement('div'); ring.className = 'cursor-ring';
    document.body.appendChild(dot); document.body.appendChild(ring);
    var mx = -100, my = -100, rx = -100, ry = -100;
    document.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; }, { passive: true });
    (function loop() {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    })();
    document.addEventListener('mouseover', function (e) {
      document.body.classList.toggle('cursor-hover', !!e.target.closest('a, button, .magnetic'));
    }, { passive: true });
  }

  // Kinetic word reveal — callable again after config JSON swaps text in
  var kinObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('kin-in'); kinObs.unobserve(en.target); }
    });
  }, { threshold: 0.3 });
  window.__kinetic = function () {
    document.querySelectorAll('[data-kinetic]').forEach(function (el) {
      if (reduced) return;
      var words = el.textContent.trim().split(/\s+/);
      el.innerHTML = words.map(function (w, i) {
        return '<span class="kin-wrap"><span class="kin-word" style="transition-delay:' + (i * 55) + 'ms">' + w + '</span></span>';
      }).join(' ');
      el.classList.remove('kin-in');
      kinObs.observe(el);
    });
  };
  window.__kinetic();

  // Parallax media ([data-parallax] = speed)
  var pEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  if (pEls.length && !reduced) {
    var ticking = false;
    var update = function () {
      ticking = false;
      var vh = window.innerHeight;
      pEls.forEach(function (el) {
        var r = el.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var p = (r.top + r.height / 2 - vh / 2) / vh; // -1..1
        el.style.transform = 'translate3d(0,' + (p * parseFloat(el.dataset.parallax) * 100).toFixed(2) + 'px,0)';
      });
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  // Clip-path image reveals
  var revObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('revealed'); revObs.unobserve(en.target); }
    });
  }, { threshold: 0.25 });
  document.querySelectorAll('.img-reveal').forEach(function (el) { revObs.observe(el); });

  // Magnetic buttons
  if (window.matchMedia('(pointer: fine)').matches && !reduced) {
    document.querySelectorAll('.magnetic').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.transform = 'translate(' + (e.clientX - r.left - r.width / 2) * 0.22 + 'px,' + (e.clientY - r.top - r.height / 2) * 0.22 + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }
})();
