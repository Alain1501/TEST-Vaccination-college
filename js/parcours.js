/* =====================================================================
   PARCOURS — transitions animées et sélecteur collège / lycée
   Fichier partagé par index.html (accueil), college/index.html et lycee/index.html.
   Chargé dans le <head> avec : <script src="../js/parcours.js" data-page="college"></script>
   ===================================================================== */
(function () {
  'use strict';

  /* =================================================================
     INTERRUPTEUR DE PUBLICATION
     false : seul le collège est visible. L'accueil et le lycée renvoient
             directement vers le collège, et le bouton Accueil / Collège /
             Lycée est masqué.
     true  : site complet (accueil commun, collège, lycée, bouton).
     ================================================================= */
  var LYCEE_VISIBLE = true;

  var script = document.currentScript;
  var PAGE = (script && script.getAttribute('data-page')) || 'hub';
  var html = document.documentElement;
  /* Racine du site, déduite de l'adresse de ce script (…/js/parcours.js) */
  var ROOT = (script && script.src) ? script.src.replace(/js\/parcours\.js(\?.*)?$/, '') : '';

  if (!LYCEE_VISIBLE && (PAGE === 'hub' || PAGE === 'lycee')) {
    html.style.visibility = 'hidden';
    location.replace(ROOT + 'college/index.html' + location.search + location.hash);
    return;
  }
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var DEST = {
    hub:     { url: ROOT + 'index.html',         color: '#2563eb', label: 'Accueil' },
    college: { url: ROOT + 'college/index.html', color: '#16a34a', label: 'Collège' },
    lycee:   { url: ROOT + 'lycee/index.html',   color: '#6d28d9', label: 'Lycée' }
  };
  var LABELS = {
    fr: { hub: 'Accueil', college: 'Collège', lycee: 'Lycée', aria: 'Changer de parcours' },
    en: { hub: 'Home', college: 'Middle school', lycee: 'High school', aria: 'Switch path' }
  };

  /* Pétales de l'éventail du site (mêmes tracés que le logo du hero) */
  var FAN =
    '<svg class="ptFan" viewBox="0 0 420 350" aria-hidden="true"><g transform="translate(210 300)">' +
    '<path class="ptP" style="--i:0" d="M0 0 C-150 -40 -170 -170 -95 -210 C-40 -170 -20 -80 0 0Z" fill="#2563eb"/>' +
    '<path class="ptP" style="--i:1" d="M0 0 C-80 -90 -70 -240 0 -270 C60 -220 40 -90 0 0Z" fill="__P2__"/>' +
    '<path class="ptP" style="--i:2" d="M0 0 C-10 -120 60 -250 140 -240 C160 -170 90 -70 0 0Z" fill="#ffd800"/>' +
    '<path class="ptP" style="--i:3" d="M0 0 C50 -90 170 -160 225 -110 C215 -40 110 -10 0 0Z" fill="#f1861b"/>' +
    '<path class="ptP" style="--i:4" d="M0 -20 C80 -60 190 -50 200 10 C160 50 70 30 0 -20Z" fill="#be163a"/>' +
    '</g></svg>';

  /* ---------- Styles injectés (aucune règle du site existant n'est touchée) ---------- */
  var css = '' +
    'html.ptEnter::after{content:"";position:fixed;inset:0;z-index:2147483646;background:var(--pt-color,#2563eb);}' +
    '.ptOverlay{position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;pointer-events:none;' +
      'background:radial-gradient(120% 90% at 50% 40%,color-mix(in srgb,var(--pt-color) 82%,#fff) 0%,var(--pt-color) 55%,color-mix(in srgb,var(--pt-color) 70%,#000) 100%);}' +
    '.ptInner{display:flex;flex-direction:column;align-items:center;gap:18px;color:#fff;text-align:center;}' +
    '.ptFan{width:min(34vw,190px);height:auto;filter:drop-shadow(0 10px 30px rgba(0,0,0,.25));overflow:visible}' +
    '.ptP{transform-origin:0 0;transform-box:view-box;}' +
    '.ptWord{font:800 clamp(28px,6vw,54px)/1 "Helvetica Neue",Arial,sans-serif;letter-spacing:-.02em;display:flex;gap:.02em}' +
    '.ptWord span{display:inline-block}' +
    '.ptSub{font:600 13px/1.4 "Helvetica Neue",Arial,sans-serif;opacity:.85;max-width:30ch}' +
    /* Sélecteur flottant */
    '.ptSwitch{position:fixed;left:16px;bottom:16px;z-index:998;display:flex;align-items:center;gap:2px;padding:4px;border-radius:999px;' +
      'background:rgba(255,255,255,.86);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(17,24,39,.08);' +
      'box-shadow:0 10px 30px rgba(17,24,39,.14);font:700 13px/1 "Helvetica Neue",Arial,sans-serif;transform:translateY(120%);opacity:0;' +
      'transition:transform .7s cubic-bezier(.2,.9,.25,1.2),opacity .5s ease;}' +
    '.ptSwitch.ptShow{transform:none;opacity:1}' +
    '.ptSwitch a{position:relative;z-index:1;display:inline-flex;align-items:center;gap:6px;padding:9px 13px;border-radius:999px;color:#111827;text-decoration:none;transition:color .35s ease}' +
    '.ptSwitch a:focus-visible{outline:3px solid #2563eb;outline-offset:2px}' +
    '.ptSwitch a.ptCurrent{color:#fff}' +
    '.ptSwitch a:not(.ptCurrent):hover{color:var(--h)}' +
    '.ptSwitch .ptHome svg{width:16px;height:16px}' +
    '.ptPill{position:absolute;z-index:0;top:4px;bottom:4px;border-radius:999px;background:var(--c);transition:left .5s cubic-bezier(.2,.9,.25,1.1),width .5s cubic-bezier(.2,.9,.25,1.1),background .4s ease;box-shadow:0 6px 16px color-mix(in srgb,var(--c) 45%,transparent)}' +
    '.ptDot{width:8px;height:8px;border-radius:50%;background:var(--h);display:inline-block}' +
    '.ptCurrent .ptDot{background:#fff}' +
    '@media (max-width:560px){.ptSwitch{left:10px;bottom:10px;font-size:12px}.ptSwitch a{padding:8px 10px}.ptSwitch .ptHomeTxt{display:none}}' +
    '@media print{.ptSwitch{display:none}}';

  function injectStyle() {
    var st = document.createElement('style');
    st.id = 'ptStyle';
    st.textContent = css;
    (document.head || html).appendChild(st);
  }
  injectStyle();

  /* ---------- Langue courante (variable globale lang du site, sinon ?lang=) ---------- */
  function currentLang() {
    try { if (typeof lang === 'string' && lang) return lang; } catch (e) { /* page sans variable lang */ }
    var p = new URLSearchParams(location.search).get('lang');
    return p || 'fr';
  }
  function L(key) {
    var l = currentLang();
    return (LABELS[l] || LABELS.fr)[key] || LABELS.fr[key];
  }
  function withLang(url) {
    var l = currentLang();
    if (!l || l === 'fr') return url;
    var parts = url.split('#');
    var base = parts[0] + (parts[0].indexOf('?') > -1 ? '&' : '?') + 'lang=' + encodeURIComponent(l);
    return parts[1] ? base + '#' + parts[1] : base;
  }

  /* ---------- Construction du voile animé ---------- */
  function buildOverlay(key, color) {
    var o = document.createElement('div');
    o.className = 'ptOverlay';
    o.style.setProperty('--pt-color', color);
    var word = (DEST[key] && key !== 'hub') ? L(key) : 'Vaccination';
    var letters = word.split('').map(function (ch, i) {
      return '<span style="--k:' + i + '">' + (ch === ' ' ? '&nbsp;' : ch) + '</span>';
    }).join('');
    o.innerHTML = '<div class="ptInner">' + FAN.replace('__P2__', key === 'lycee' ? DEST.lycee.color : DEST.college.color) + '<div class="ptWord" aria-hidden="true">' + letters + '</div>' +
      '<div class="ptSub">Unité de santé publique de l’hôpital de Melun – équipe mobile de vaccination</div></div>';
    return o;
  }

  function animatePetals(o, opening) {
    var petals = o.querySelectorAll('.ptP');
    petals.forEach(function (p, i) {
      var from = opening ? 'rotate(' + (-60 + i * 8) + 'deg) scale(.2)' : 'rotate(0) scale(1)';
      var to = opening ? 'rotate(0) scale(1)' : 'rotate(' + (40 + i * 10) + 'deg) scale(.1)';
      p.animate([{ transform: from, opacity: opening ? 0 : 1 }, { transform: to, opacity: opening ? 1 : 0 }],
        { duration: opening ? 520 : 420, delay: i * 45, easing: 'cubic-bezier(.2,.9,.25,1.15)', fill: 'both' });
    });
    o.querySelectorAll('.ptWord span').forEach(function (s, i) {
      s.animate(opening
        ? [{ transform: 'translateY(60%)', opacity: 0 }, { transform: 'none', opacity: 1 }]
        : [{ transform: 'none', opacity: 1 }, { transform: 'translateY(-40%)', opacity: 0 }],
        { duration: 380, delay: (opening ? 120 : 0) + i * 28, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'both' });
    });
    var sub = o.querySelector('.ptSub');
    if (sub) sub.animate([{ opacity: opening ? 0 : .85 }, { opacity: opening ? .85 : 0 }], { duration: 400, delay: opening ? 260 : 0, fill: 'both' });
  }

  /* ---------- Départ vers une autre page ---------- */
  var leaving = false;
  function go(key, evt, hash) {
    var dest = DEST[key];
    if (!dest || leaving) return;
    var url = withLang(dest.url + (hash || ''));
    if (reduce || !document.body || !Element.prototype.animate) { location.href = url; return; }
    leaving = true;
    var x = evt && evt.clientX ? evt.clientX : innerWidth / 2;
    var y = evt && evt.clientY ? evt.clientY : innerHeight / 2;
    var o = buildOverlay(key, dest.color);
    document.body.appendChild(o);
    var r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + 20;
    o.animate([{ clipPath: 'circle(0px at ' + x + 'px ' + y + 'px)' }, { clipPath: 'circle(' + r + 'px at ' + x + 'px ' + y + 'px)' }],
      { duration: 620, easing: 'cubic-bezier(.7,0,.25,1)', fill: 'both' });
    animatePetals(o, true);
    try { sessionStorage.setItem('ptEnter', JSON.stringify({ key: key, color: dest.color, t: Date.now() })); } catch (e) {}
    setTimeout(function () { location.href = url; }, 900);
  }
  window.ptGo = go;

  /* ---------- Arrivée sur la page ---------- */
  var enter = null;
  try {
    var raw = sessionStorage.getItem('ptEnter');
    if (raw) {
      sessionStorage.removeItem('ptEnter');
      var d = JSON.parse(raw);
      if (d && Date.now() - d.t < 8000 && d.key === PAGE) enter = d;
    }
  } catch (e) {}

  if (enter && !reduce) {
    html.style.setProperty('--pt-color', enter.color);
    html.classList.add('ptEnter');
  }

  function playEnter() {
    if (!enter || reduce) return;
    var o = buildOverlay(enter.key, enter.color);
    document.body.appendChild(o);
    html.classList.remove('ptEnter');
    var cx = innerWidth / 2, cy = innerHeight / 2;
    var r = Math.hypot(cx, cy) + 20;
    // Le logo et le mot restent un court instant, puis le voile se referme en cercle.
    o.querySelectorAll('.ptP,.ptWord span,.ptSub').forEach(function (n) { n.style.opacity = 1; });
    setTimeout(function () {
      animatePetals(o, false);
      var a = o.animate([{ clipPath: 'circle(' + r + 'px at ' + cx + 'px ' + cy + 'px)' }, { clipPath: 'circle(0px at ' + cx + 'px ' + cy + 'px)' }],
        { duration: 760, delay: 140, easing: 'cubic-bezier(.65,0,.2,1)', fill: 'both' });
      a.onfinish = function () { o.remove(); };
    }, 260);
  }

  /* Retour arrière (cache du navigateur) : on retire tout voile restant */
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      leaving = false;
      html.classList.remove('ptEnter');
      document.querySelectorAll('.ptOverlay').forEach(function (n) { n.remove(); });
    }
  });

  /* ---------- Sélecteur flottant Accueil / Collège / Lycée ---------- */
  function buildSwitch() {
    if (PAGE === 'hub' || !LYCEE_VISIBLE) return;
    var nav = document.createElement('nav');
    nav.className = 'ptSwitch';
    nav.setAttribute('aria-label', L('aria'));
    nav.innerHTML =
      '<span class="ptPill"></span>' +
      '<a href="' + DEST.hub.url + '" data-pt="hub" class="ptHome" style="--h:#2563eb" aria-label="' + L('hub') + '">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/></svg>' +
        '<span class="ptHomeTxt">' + L('hub') + '</span></a>' +
      '<a href="' + DEST.college.url + '" data-pt="college" style="--h:#16a34a"><span class="ptDot"></span>' + L('college') + '</a>' +
      '<a href="' + DEST.lycee.url + '" data-pt="lycee" style="--h:#6d28d9"><span class="ptDot"></span>' + L('lycee') + '</a>';
    document.body.appendChild(nav);
    var cur = nav.querySelector('[data-pt="' + PAGE + '"]');
    if (cur) { cur.classList.add('ptCurrent'); cur.setAttribute('aria-current', 'page'); }
    var pill = nav.querySelector('.ptPill');
    function placePill() {
      if (!cur) return;
      pill.style.left = cur.offsetLeft + 'px';
      pill.style.width = cur.offsetWidth + 'px';
      pill.style.setProperty('--c', DEST[PAGE].color);
    }
    placePill();
    window.addEventListener('resize', placePill);
    // Survol : la pastille glisse vers le parcours visé
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('mouseenter', function () {
        pill.style.left = a.offsetLeft + 'px';
        pill.style.width = a.offsetWidth + 'px';
        pill.style.setProperty('--c', DEST[a.getAttribute('data-pt')].color);
        nav.querySelectorAll('a').forEach(function (b) { b.classList.toggle('ptCurrent', b === a); });
      });
    });
    nav.addEventListener('mouseleave', function () {
      nav.querySelectorAll('a').forEach(function (b) { b.classList.toggle('ptCurrent', b === cur); });
      placePill();
    });
    setTimeout(function () { nav.classList.add('ptShow'); }, enter ? 1300 : 700);
    // Mise à jour des libellés si la langue change
    setInterval(function () {
      var l = currentLang();
      if (nav.dataset.l === l) return;
      nav.dataset.l = l;
      nav.setAttribute('aria-label', L('aria'));
      var t = nav.querySelector('.ptHomeTxt'); if (t) t.textContent = L('hub');
      nav.querySelector('[data-pt="hub"]').setAttribute('aria-label', L('hub'));
      nav.querySelector('[data-pt="college"]').lastChild.textContent = L('college');
      nav.querySelector('[data-pt="lycee"]').lastChild.textContent = L('lycee');
      placePill();
    }, 600);
  }

  /* Interception des liens de parcours (data-pt) */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-pt]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    var key = a.getAttribute('data-pt');
    if (key === PAGE) { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    e.preventDefault();
    go(key, e, a.getAttribute('data-pt-hash') || '');
  });

  /* Langue reçue dans l'adresse (?lang=xx) : appliquée une fois les données du site chargées */
  function applyUrlLang() {
    var want = new URLSearchParams(location.search).get('lang');
    if (!want || want === 'fr' || PAGE === 'hub') return;
    var tries = 0;
    var timer = setInterval(function () {
      tries++;
      var ready = false, langs = [];
      try { ready = !!faqData; langs = (faqData && faqData.meta && faqData.meta.languages) || []; } catch (e) { ready = false; }
      if (ready && typeof window.setLanguage === 'function') {
        clearInterval(timer);
        if (langs.indexOf(want) > -1 && currentLang() !== want) window.setLanguage(want);
      } else if (tries > 80) { clearInterval(timer); }
    }, 100);
  }

  function onReady() {
    playEnter();
    buildSwitch();
    applyUrlLang();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onReady);
  else onReady();
})();
