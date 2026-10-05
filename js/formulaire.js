/* Formulaires : onde de couleur au toucher des boutons et des choix */
(function () {
  'use strict';
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.addEventListener('pointerdown', function (e) {
    var b = e.target.closest && e.target.closest('.nav-btn,.mailto-btn,.choice-btn');
    if (!b || b.disabled) return;
    var r = b.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2.4;
    var c = document.createElement('span');
    c.className = 'fxRip';
    c.style.width = c.style.height = d + 'px';
    c.style.left = (e.clientX - r.left - d / 2) + 'px';
    c.style.top = (e.clientY - r.top - d / 2) + 'px';
    b.appendChild(c);
    setTimeout(function () { c.remove(); }, 700);
  });
})();
