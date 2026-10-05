/* =====================================================================
   EFFETS VISUELS — étapes, FAQ en couleurs, message du médecin
   Partagé par college/index.html et lycee/index.html.
   ===================================================================== */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ACCENT = (document.currentScript && document.currentScript.getAttribute('data-accent')) || 'college';
  var TRAIL = ACCENT === 'lycee' ? ['#534AB7', '#7F77DD'] : ['#3B6D11', '#639922'];

  /* Icônes des rubriques de la FAQ */
  var S = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
  var ICO = {
    general: S + '<circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/></svg>',
    hpv: S + '<circle cx="12" cy="12" r="5"/><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></svg>',
    meningococcal: S + '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/></svg>',
    safety: S + '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/></svg>',
    school_process: S + '<path d="M3 9l9-5 9 5-9 5z"/><path d="M7 11v5c3 2 7 2 10 0v-5"/></svg>',
    consent: S + '<path d="M9 11l3 3 8-8"/><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9"/></svg>',
    other: S + '<path d="M18 2l4 4M17 7l3-3M19 9L8.5 19.5 4 21l1.5-4.5L16 6z"/><path d="M14 8l2 2M11 11l2 2"/></svg>',
    key_messages: S + '<path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z"/></svg>'
  };

  /* ---------- FAQ ---------- */
  function decorateFaq() {
    document.querySelectorAll('#faqList .acc').forEach(function (acc) {
      if (acc.dataset.fx) return;
      acc.dataset.fx = '1';
      var sec = acc.getAttribute('data-section') || 'general';
      var btn = acc.querySelector('h3 button');
      if (btn && !btn.querySelector('.fxIco')) {
        var ic = document.createElement('span');
        ic.className = 'fxIco';
        ic.innerHTML = ICO[sec] || ICO.general;
        btn.insertBefore(ic, btn.firstChild);
      }
      if (btn) btn.addEventListener('click', function (e) {
        if (reduce) return;
        var r = acc.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2.2;
        var c = document.createElement('span');
        c.className = 'fxRip';
        c.style.width = c.style.height = d + 'px';
        c.style.left = ((e.clientX || r.left + 30) - r.left - d / 2) + 'px';
        c.style.top = ((e.clientY || r.top + 20) - r.top - d / 2) + 'px';
        acc.appendChild(c);
        setTimeout(function () { c.remove(); }, 750);
      });
    });
    // Pastille de couleur sur les titres de rubrique
    var list = document.getElementById('faqList');
    if (!list) return;
    var cur = null;
    Array.prototype.forEach.call(list.children, function (n) {
      if (n.classList.contains('faqSectionHead')) cur = n;
      else if (cur && n.classList.contains('acc') && !cur.dataset.section) {
        cur.setAttribute('data-section', n.getAttribute('data-section') || 'general');
        cur.style.setProperty('--qc', getComputedStyle(n).getPropertyValue('--qc'));
      }
    });
  }

  /* ---------- Étapes : lumière qui suit le pointeur ---------- */
  function decorateSteps() {
    document.querySelectorAll('#stepsContainer .stepItem').forEach(function (s) {
      if (s.dataset.fx) return;
      s.dataset.fx = '1';
      s.addEventListener('pointermove', function (e) {
        var r = s.getBoundingClientRect();
        s.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        s.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
      });
    });
  }

  /* ---------- Vidéos : lumière qui suit le pointeur, effet au toucher ---------- */
  function decorateVideos() {
    document.querySelectorAll('#videoGrid .videoCard').forEach(function (c) {
      if (c.dataset.fx) return;
      c.dataset.fx = '1';
      c.addEventListener('pointermove', function (e) {
        var r = c.getBoundingClientRect();
        c.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        c.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
      });
      c.addEventListener('touchstart', function () {
        document.querySelectorAll('#videoGrid .videoCard.fxTouch').forEach(function (o) { if (o !== c) o.classList.remove('fxTouch'); });
        c.classList.add('fxTouch');
        clearTimeout(c._t); c._t = setTimeout(function () { c.classList.remove('fxTouch'); }, 1600);
      }, { passive: true });
    });
  }

  /* ---------- Vidéos : grande fenêtre et badge « Déjà vue » ---------- */
  var SEEN_KEY = 'vaccinationSud77Seen';
  var SEEN_TXT = {fr:'Déjà vue',en:'Watched',ar:'تمت المشاهدة',tr:'İzlendi',ps:'لیدل شوې',ku:'بینراوە',ro:'Vizionat',ka:'ნანახია',sq:'E parë',am:'ታይቷል',zh:'已观看',prs:'دیده شده',es:'Vista',pt:'Vista',ru:'Просмотрено',uk:'Переглянуто',mo:'Vizionat'};
  var CLOSE_TXT = {fr:'Fermer',en:'Close',ar:'إغلاق',tr:'Kapat',ps:'بندول',ku:'داخستن',ro:'Închide',ka:'დახურვა',sq:'Mbyll',am:'ዝጋ',zh:'关闭',prs:'بستن',es:'Cerrar',pt:'Fechar',ru:'Закрыть',uk:'Закрити',mo:'Închide'};
  function curLang() { try { if (typeof lang === 'string' && lang) return lang; } catch (e) {} return 'fr'; }
  function seenList() { try { return JSON.parse(localStorage.getItem(SEEN_KEY) || '[]'); } catch (e) { return []; } }
  function markSeen(id) { var l = seenList(); if (l.indexOf(id) < 0) { l.push(id); try { localStorage.setItem(SEEN_KEY, JSON.stringify(l)); } catch (e) {} } }
  function videoList() { try { return (introData && introData.resources && introData.resources.videos) || []; } catch (e) { return []; } }
  function ytId(url) {
    var m = (url || '').match(/youtube\.com\/shorts\/([\w-]+)/) || (url || '').match(/[?&]v=([\w-]+)/) || (url || '').match(/youtu\.be\/([\w-]+)/);
    return m ? m[1] : null;
  }
  var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>';
  var badgeBusy = false;
  function badges() {
    if (badgeBusy) return; badgeBusy = true;
    var vids = videoList().filter(function (v) { return ytId(v.url); });
    var seen = seenList(), l = curLang();
    document.querySelectorAll('#videoGrid .videoCard').forEach(function (c, i) {
      var v = vids[i]; if (!v) return;
      var id = ytId(v.url), frame = c.querySelector('.videoFrame');
      if (!frame) return;
      c.dataset.vid = id; c.dataset.short = /\/shorts\//.test(v.url) ? '1' : '';
      var b = frame.querySelector('.fxBadge'), txt = CHECK + (SEEN_TXT[l] || SEEN_TXT.fr);
      if (seen.indexOf(id) > -1) {
        if (!b) { b = document.createElement('span'); b.className = 'fxBadge'; frame.appendChild(b); }
        if (b.innerHTML !== txt) b.innerHTML = txt;
      } else if (b) b.remove();
    });
    setTimeout(function () { badgeBusy = false; }, 0);
  }
  function openLightbox(card, title) {
    var id = card.dataset.vid; if (!id) return;
    var lb = document.createElement('div');
    lb.className = 'fxLb';
    lb.style.setProperty('--vc', getComputedStyle(card).getPropertyValue('--vc'));
    lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', title);
    lb.innerHTML = '<div class="fxLbBox' + (card.dataset.short ? ' short' : '') + '"><button type="button" class="fxLbClose" aria-label="' + (CLOSE_TXT[curLang()] || CLOSE_TXT.fr) + '">&times;</button>' +
      '<div class="fxLbFrame"><iframe src="https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>' +
      '<div class="fxLbTitle"></div></div>';
    lb.querySelector('iframe').title = title;
    lb.querySelector('.fxLbTitle').textContent = title;
    document.body.appendChild(lb);
    document.documentElement.classList.add('fxNoScroll');
    requestAnimationFrame(function () { lb.classList.add('on'); });
    var closeBtn = lb.querySelector('.fxLbClose');
    closeBtn.focus();
    function close() {
      lb.classList.remove('on');
      document.documentElement.classList.remove('fxNoScroll');
      document.removeEventListener('keydown', onKey);
      setTimeout(function () { lb.remove(); }, 320);
      var t = card.querySelector('.videoThumb'); if (t) t.focus({ preventScroll: true });
    }
    function onKey(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', onKey);
    closeBtn.addEventListener('click', close);
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    markSeen(id);
    setTimeout(badges, 400);
  }
  // Le clic sur une vignette ouvre la grande fenêtre au lieu de lire dans la vignette
  document.addEventListener('click', function (e) {
    var thumb = e.target.closest && e.target.closest('#videoGrid .videoThumb');
    if (!thumb) return;
    var card = thumb.closest('.videoCard');
    if (!card) return;
    if (!card.dataset.vid) badges();
    if (!card.dataset.vid) return;
    e.preventDefault(); e.stopImmediatePropagation();
    var tl = card.querySelector('.videoTitle > div');
    openLightbox(card, (tl && tl.textContent) || thumb.getAttribute('aria-label') || '');
  }, true);

  /* ---------- Message du médecin : les mots apparaissent en avance sur la lecture ----------
     Tout le texte visible à l'écran est lisible, sauf les ~2,6 dernières lignes en bas.
     Effets combinés : vague (montée, flou, rotation), lumière (dernières lignes en couleur),
     mots magnétiques (survol). Réversible quand on remonte. */
  var words = [], lh = 28, ticking = false;
  function collectWords() {
    var body = document.querySelector('#introBody .scrollReadText');
    if (!body) { words = []; return; }
    words = Array.prototype.slice.call(body.querySelectorAll('.fadeWord'));
    lh = parseFloat(getComputedStyle(body).lineHeight) || 28;
    words.forEach(function (w) { if (!w.dataset.fx) { w.dataset.fx = '1'; w.classList.add('fxH'); } });
    update();
  }
  function update() {
    ticking = false;
    if (!words.length) return;
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var lim = vh - 2.6 * lh;
    var body = words[0].closest('.scrollReadText');
    // Mots en blocs : le sens du paragraphe doit suivre la langue (arabe, pashto, kurde, dari)
    var wantDir = document.documentElement.classList.contains('rtlText') ? 'rtl' : 'ltr';
    if (body.getAttribute('dir') !== wantDir) body.setAttribute('dir', wantDir);
    var br = body.getBoundingClientRect();
    var allPast = br.bottom < vh - 4;
    var bw = br.width || 1;
    for (var i = 0; i < words.length; i++) {
      var w = words[i], r = w.getBoundingClientRect();
      var shown = reduce || allPast || r.top < lim;
      if (shown) {
        if (w.classList.contains('fxH')) {
          var px = wantDir === 'rtl' ? (br.right - r.right) : (r.left - br.left);
          w.style.transitionDelay = ((px / bw) * 0.28).toFixed(2) + 's';
          w.classList.remove('fxH');
        }
        if (!w._hov && !w.classList.contains('counterNum')) {
          var d = lim - r.top;
          var col = allPast ? '' : (d < lh ? TRAIL[1] : (d < 2 * lh ? TRAIL[0] : ''));
          if (col) w.style.setProperty('color', col, 'important'); else w.style.removeProperty('color');
        }
      } else if (!w.classList.contains('fxH')) {
        w.style.transitionDelay = '0s';
        w.classList.add('fxH');
        w.style.removeProperty('color');
      }
    }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  document.addEventListener('pointermove', function (e) {
    if (reduce || !words.length || e.pointerType === 'touch') return;
    var body = words[0].closest('.scrollReadText'), br = body.getBoundingClientRect();
    if (e.clientY < br.top - 60 || e.clientY > br.bottom + 60) return;
    for (var i = 0; i < words.length; i++) {
      var w = words[i];
      if (w.classList.contains('fxH')) continue;
      var r = w.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 60) {
        var k = (60 - dist) / 60;
        w._hov = 1;
        w.style.transitionDelay = '0s';
        w.style.transform = 'translateY(' + (-k * 7).toFixed(1) + 'px) scale(' + (1 + k * 0.1).toFixed(2) + ')';
        w.style.setProperty('color', TRAIL[1], 'important');
      } else if (w._hov) {
        w._hov = 0;
        w.style.transform = '';
        w.style.removeProperty('color');
      }
    }
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  });

  /* Les pages reconstruisent la FAQ, les étapes et le message à chaque changement de langue */
  var mo = new MutationObserver(function () {
    decorateFaq(); decorateSteps(); decorateVideos(); badges();
    var body = document.querySelector('#introBody .scrollReadText');
    if (body && (!words.length || !document.body.contains(words[0]) || body.querySelector('.fadeWord:not([data-fx])'))) collectWords();
  });
  function start() {
    mo.observe(document.body, { childList: true, subtree: true });
    decorateFaq(); decorateSteps(); decorateVideos(); badges(); collectWords();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
