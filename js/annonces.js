/* =====================================================================
   ACTUALITÉS, BANDEAUX D'ANNONCE ET TEXTES MODIFIÉS
   Publiés depuis l'espace admin caché du site (fichier js/actualites.js).
   Accès admin : taper « pierre » au clavier, ou 5 tapes rapides sur le logo EMV.
   Partagé par l'accueil, la page collège et la page lycée.
   ===================================================================== */
(function () {
  'use strict';
  var SCRIPT = document.currentScript;
  var PAGE = (SCRIPT && SCRIPT.getAttribute('data-page')) || 'accueil';
  var BASE = SCRIPT ? SCRIPT.src.replace(/js\/annonces\.js.*$/, '') : '';
  var KEY = 'vaccinationSud77Lang';
  var reduit = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.VS_PAGE = PAGE; window.VS_BASE = BASE;

  /* Langue réellement affichée par la page (variable « lang » de la page), sinon langue mémorisée */
  function lng() { try { if (typeof lang === 'string' && lang) return lang; } catch (e) {} var l = null; try { l = localStorage.getItem(KEY); } catch (e) {} return l || 'fr'; }
  var UI = {
    actus: { fr: "Actualités", en: "News", ar: "الأخبار", tr: "Haberler", ps: "خبرونه", ku: "هەواڵەکان", ro: "Noutăți", mo: "Noutăți", ka: "სიახლეები", sq: "Të rejat", am: "ዜናዎች", zh: "最新消息", prs: "اخبار", es: "Noticias", pt: "Notícias", ru: "Новости", uk: "Новини" },
    plus: { fr: "En savoir plus", en: "Learn more", ar: "لمعرفة المزيد", tr: "Daha fazla bilgi", ps: "نور معلومات", ku: "زیاتر بزانە", ro: "Aflați mai multe", mo: "Aflați mai multe", ka: "გაიგეთ მეტი", sq: "Mësoni më shumë", am: "ተጨማሪ ይወቁ", zh: "了解更多", prs: "معلومات بیشتر", es: "Más información", pt: "Saiba mais", ru: "Подробнее", uk: "Детальніше" }
  };
  function txt(k) { var o = UI[k]; return o[lng()] || o.fr; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* ---------- Valeurs autorisées pour la mise en forme (rien d'autre n'est accepté) ---------- */
  var POLICES = { site: "inherit", classique: "Georgia,'Times New Roman',serif", large: "Verdana,Geneva,sans-serif", moderne: "'Trebuchet MS','Segoe UI',sans-serif" };
  var TT = { petite: '1.05rem', normale: '1.2rem', grande: '1.5rem', tresgrande: '1.9rem' };
  var TX = { normale: '1rem', grande: '1.15rem', tresgrande: '1.3rem' };
  var COUL = { navy: '#12365e', bleu: '#006997', canard: '#0e7376', vert: '#2e7d32', orange: '#a85406', rouge: '#be163a', rose: '#c2306a', noir: '#1a1a1a' };
  var FONDS = { blanc: '#ffffff', ciel: '#eef6fb', jaune: '#fff4d6', rose: '#fdeef4', vert: '#e8f5ec', orange: '#fdf0e3', gris: '#f3f4f6' };
  var FX = { aucune: 1, apparition: 1, fondu: 1, gauche: 1, droite: 1, zoom: 1, rebond: 1, mots: 1, pulsation: 1, battement: 1, respiration: 1, secousse: 1, clignote: 1, reflet: 1, lumiere: 1 };
  var DUREES = { '0.5': 1, '1': 1, '1.5': 1, '2': 1, '3': 1, '5': 1, '8': 1 };
  var REPET = { '1': '1', '2': '2', '3': '3', 'boucle': 'infinite' };
  var DELAIS = { '0': 1, '0.3': 1, '0.6': 1, '1': 1, '2': 1 };
  var THEMES = { jaune: 1, orange: 1, rouge: 1, rose: 1, bleu: 1, vert: 1, marine: 1 };

  /* ---------- Liens : pages et rubriques du site, documents, sites internet, itinéraires, téléphone, e-mail ---------- */
  function lienSur(h) { return typeof h === 'string' && /^(https:\/\/|http:\/\/|(college\/|lycee\/)?[\w-]+\.html(\?[\w=&%.\-]*)?(#[\w=:%.\-]+)?$|#[\w-]+$|docs\/[\w.\-]+$|pdf\/[\w.\/-]+$|tel:\+?[\d ]+$|mailto:[^\s"<>]+$)/.test(h); }
  function lienExterne(h) { return /^https?:|^docs\/|^pdf\/|\.pdf$/i.test(h); }
  /* Les liens internes sont écrits depuis la racine du site, on les rend valables depuis n'importe quelle page */
  function adresse(h) {
    if (/^(https?:|tel:|mailto:|#)/i.test(h)) return h;
    try { return new URL(h, BASE || location.href).href; } catch (e) { return h; }
  }
  var PALETTE = Object.keys(COUL).map(function (k) { return [k, COUL[k]]; });
  function rgb(h) { var m = /^#?([0-9a-f]{6})$/i.exec(h); if (m) { var n = parseInt(m[1], 16); return [n >> 16, (n >> 8) & 255, n & 255]; } m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(h); return m ? [+m[1], +m[2], +m[3]] : null; }
  function couleurPalette(c) { var v = rgb(String(c || '').trim()); if (!v) return null; var best = null, d = 1e9; PALETTE.forEach(function (p) { var w = rgb(p[1]), x = (w[0] - v[0]) * (w[0] - v[0]) + (w[1] - v[1]) * (w[1] - v[1]) + (w[2] - v[2]) * (w[2] - v[2]); if (x < d) { d = x; best = p[1]; } }); return best; }

  /* Nettoyage du texte mis en forme : seules quelques balises sûres sont gardées */
  function nettoyer(html, garderNavy) {
    var tpl = document.createElement('template'); tpl.innerHTML = String(html || '');
    function rendre(n) {
      if (n.nodeType === 3) return esc(n.nodeValue);
      if (n.nodeType !== 1) return '';
      var t = n.tagName, inner = ''; for (var c = n.firstChild; c; c = c.nextSibling) inner += rendre(c);
      var coul = null;
      if (t === 'FONT') coul = n.getAttribute('color');
      if (n.style && n.style.color) coul = n.style.color;
      var poids = n.style && (n.style.fontWeight === 'bold' || +n.style.fontWeight >= 600), ital = n.style && n.style.fontStyle === 'italic';
      var out;
      switch (t) {
        case 'B': case 'STRONG': out = '<strong>' + inner + '</strong>'; break;
        case 'I': case 'EM': out = '<em>' + inner + '</em>'; break;
        case 'U': out = '<u>' + inner + '</u>'; break;
        case 'BR': return '<br>';
        case 'UL': case 'OL': out = '<' + t.toLowerCase() + '>' + inner + '</' + t.toLowerCase() + '>'; break;
        case 'LI': out = '<li>' + inner + '</li>'; break;
        case 'P': case 'DIV': out = inner ? '<p>' + inner + '</p>' : ''; break;
        case 'SPAN': out = n.classList.contains('accent') ? '<span class="accent">' + inner + '</span>' : inner; break;
        case 'A':
          var h = n.getAttribute('data-href') || n.getAttribute('href') || '';
          out = lienSur(h) ? '<a href="' + esc(h) + '"' + (lienExterne(h) ? ' target="_blank" rel="noopener"' : '') + '>' + inner + '</a>' : inner; break;
        default: out = inner;
      }
      if (poids && t !== 'B' && t !== 'STRONG') out = '<strong>' + out + '</strong>';
      if (ital && t !== 'I' && t !== 'EM') out = '<em>' + out + '</em>';
      if (coul) { var p = couleurPalette(coul); if (p && (garderNavy || p !== COUL.navy)) out = '<span style="color:' + p + '">' + out + '</span>'; }
      return out;
    }
    var r = ''; for (var c = tpl.content.firstChild; c; c = c.nextSibling) r += rendre(c);
    return r;
  }
  /* À l'affichage, les liens internes sont rendus valables depuis la page où l'on est */
  function liensAbsolus(html) {
    return String(html).replace(/<a href="([^"]+)"/g, function (m, h) { return '<a href="' + esc(adresse(h.replace(/&amp;/g, '&'))) + '"'; });
  }

  var ICO_DOC = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/></svg>';
  var ICO_MAP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>';
  var ICO_FL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  function boutons(o) {
    var l = (o.boutons || []).filter(function (b) { return b && b.href && lienSur(b.href); });
    if (!l.length) return '';
    return '<div class="vs-boutons">' + l.map(function (b) {
      var ico = /^docs\/|^pdf\/|\.pdf$/i.test(b.href) ? ICO_DOC : (/google\.[a-z.]+\/maps/.test(b.href) ? ICO_MAP : ICO_FL);
      return '<a class="vs-btn" href="' + esc(adresse(b.href)) + '"' + (lienExterne(b.href) ? ' target="_blank" rel="noopener"' : '') + '>' + ico + '<span>' + esc(b.lib || txt('plus')) + '</span></a>';
    }).join('') + '</div>';
  }
  function fxAttrs(st) {
    var fx = FX[st.anim] ? st.anim : 'aucune';
    var d = DUREES[st.duree] ? st.duree : '', r = REPET[st.repet] || '', dl = DELAIS[st.delai] ? st.delai : '';
    return { cls: ' fx-' + fx, css: (d ? '--fxd:' + d + 's;' : '') + (r ? '--fxr:' + r + ';' : '') + (dl ? '--fxl:' + dl + 's;' : '') };
  }
  function motsAnimes(t) { return esc(t).split(/\s+/).map(function (w, k) { return '<span class="w" style="--k:' + k + '">' + w + '</span>'; }).join(' '); }
  function renduActu(a, fmt) {
    var st = a.style || {}, fx = fxAttrs(st);
    var css = 'font-family:' + (POLICES[st.police] || POLICES.site) + ';--actu-titre:' + (COUL[st.cTitre] || COUL.navy) + ';--actu-fond:' + (FONDS[st.fond] || FONDS.blanc) + ';--actu-tt:' + (TT[st.tTitre] || TT.normale) + ';--actu-tx:' + (TX[st.tTexte] || TX.normale) + ';' + fx.css;
    var d = ''; if (a.date) { var x = new Date(a.date + 'T12:00:00'); if (!isNaN(x)) d = '<time datetime="' + esc(a.date) + '">' + esc((fmt || new Intl.DateTimeFormat('fr', { day: 'numeric', month: 'long', year: 'numeric' })).format(x)) + '</time>'; }
    var c = liensAbsolus(nettoyer(a.html || ''));
    return '<article class="vs-actu' + fx.cls + (a.epingle ? ' epinglee' : '') + '" style="' + css + '">' + d + '<h3 lang="fr" dir="auto">' + (st.anim === 'mots' ? motsAnimes(a.titre) : esc(a.titre)) + '</h3>' + (c ? '<div class="vs-actu-texte" lang="fr" dir="auto">' + c + '</div>' : '') + boutons(a) + '</article>';
  }
  function renduBandeau(A) {
    var st = A.style || {}, fx = fxAttrs(st);
    return '<div class="vs-annonce theme-' + (THEMES[st.theme] ? st.theme : 'jaune') + fx.cls + '" role="status" style="' + fx.css + '"><div class="vs-annonce-in"><span class="vs-annonce-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.5v.01"/></svg></span><div class="vs-annonce-texte" lang="fr" dir="auto">' + liensAbsolus(nettoyer(A.html || '')) + boutons(A) + '</div></div></div>';
  }
  window.VS_RENDU = { actu: renduActu, bandeau: renduBandeau, nettoyer: nettoyer, lienSur: lienSur };

  /* ---------- Affichage des actualités (accueil) et des bandeaux (accueil, collège, lycée) ---------- */
  var principal = document.querySelector('main');
  function afficher() {
    var D = window.VS_ACTU || {};
    document.querySelectorAll('.vs-annonces').forEach(function (x) { x.remove(); });
    var actifs = (D.annonces || []).filter(function (A) { return A && A.actif && A.html; });
    if (actifs.length && principal) {
      var t = document.createElement('div'); t.className = 'vs-annonces'; t.innerHTML = actifs.map(renduBandeau).join('');
      principal.insertBefore(t, principal.firstChild);
    }
    var bloc = document.getElementById('actualites');
    if (bloc) {
      var liste = (D.actualites || []).slice().sort(function (a, b) { return (b.epingle ? 1 : 0) - (a.epingle ? 1 : 0) || String(b.date).localeCompare(String(a.date)); }).slice(0, 6);
      bloc.hidden = !liste.length;
      var h2 = bloc.querySelector('h2'); if (h2) h2.textContent = txt('actus');
      var l = lng(), fmt;
      try { fmt = new Intl.DateTimeFormat(l === 'ar' || l === 'ps' || l === 'ku' || l === 'prs' ? l + '-u-ca-gregory-nu-latn' : l, { day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) { fmt = new Intl.DateTimeFormat('fr', { day: 'numeric', month: 'long', year: 'numeric' }); }
      bloc.querySelector('.vs-actus-liste').innerHTML = liste.map(function (a) { return renduActu(a, fmt); }).join('');
    }
    appliquerTextes(true);
  }
  window.VS_AFFICHER = afficher;

  /* Lumière qui suit la souris sur les actualités qui l'utilisent */
  document.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    var c = e.target.closest && e.target.closest('.vs-actu.fx-lumiere'); if (!c) return;
    var r = c.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    c.style.setProperty('--mx', (px * 100) + '%'); c.style.setProperty('--my', (py * 100) + '%');
    if (!reduit) { c.style.setProperty('--ry', ((px - .5) * 6) + 'deg'); c.style.setProperty('--rx', ((.5 - py) * 5) + 'deg'); }
  }, { passive: true });
  document.addEventListener('pointerout', function (e) { var c = e.target.closest && e.target.closest('.vs-actu.fx-lumiere'); if (c && !c.contains(e.relatedTarget)) { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); } });

  /* =====================================================================
     TEXTES DU SITE MODIFIÉS DEPUIS L'ADMIN
     Chaque texte modifiable reçoit une clé stable. Les modifications sont
     enregistrées par page et par langue, et appliquées par-dessus le texte
     d'origine à chaque affichage (y compris après un changement de langue).
     ===================================================================== */
  function cles() {
    var L = [];
    function add(el, k, lib) { if (el) L.push({ el: el, k: k, lib: lib }); }
    if (PAGE === 'accueil') {
      add(document.getElementById('hubTitle'), 'titre', 'Titre principal');
      var vus = {};
      document.querySelectorAll('main [data-i18n], main [data-i18n-html]').forEach(function (n) {
        var a = n.getAttribute('data-i18n') || n.getAttribute('data-i18n-html');
        vus[a] = (vus[a] || 0) + 1;
        add(n, 'i18n-' + a + (vus[a] > 1 ? '-' + vus[a] : ''), 'Texte « ' + a + ' »');
      });
      return L;
    }
    ['heroTitle', 'heroSubtitle', 'stepsTitle', 'stepsSubtitle', 'videosTitle', 'videosDesc', 'introTitle', 'introDesc', 'faqTitle', 'contactTitle'].forEach(function (id) { add(document.getElementById(id), id, 'Titre « ' + id + ' »'); });
    document.querySelectorAll('#stepsContainer .stepItem').forEach(function (st) {
      var n = (st.querySelector('.stepNumber') || {}).textContent || '';
      add(st.querySelector('.stepTitle'), 'etape' + n + '-titre', 'Étape ' + n + ', titre');
      add(st.querySelector('.stepText'), 'etape' + n + '-texte', 'Étape ' + n + ', texte');
    });
    document.querySelectorAll('#introBody .letterP').forEach(function (p, i) { add(p, 'lettre-' + i, 'Lettre du médecin, paragraphe ' + (i + 1)); });
    add(document.querySelector('#introBody .letterName'), 'lettre-nom', 'Lettre du médecin, nom');
    add(document.querySelector('#introBody .letterRole'), 'lettre-fonction', 'Lettre du médecin, fonction');
    document.querySelectorAll('#faqList .faqSectionHead').forEach(function (h, i) { add(h, 'faq-rubrique-' + i, 'FAQ, titre de rubrique ' + (i + 1)); });
    document.querySelectorAll('#faqList .acc').forEach(function (acc) {
      var id = acc.getAttribute('data-fid'); if (!id) return;
      add(acc.querySelector('h3 button > span:not(.fxIco):not(.signe)'), 'faq-' + id + '-question', 'FAQ ' + id + ', question');
      add(acc.querySelector('.faqAns'), 'faq-' + id + '-reponse', 'FAQ ' + id + ', réponse');
    });
    return L;
  }
  var ORIG = {}, POSE = new WeakMap(), enCours = false;
  function textesPage() { var T = (window.VS_ACTU || {}).textes || {}; return T[PAGE] || {}; }
  function appliquerTextes(force) {
    if (enCours) return; enCours = true;
    try {
      var l = lng(), T = (textesPage()[l]) || {};
      ORIG[l] = ORIG[l] || {};
      cles().forEach(function (c) {
        var el = c.el; el.setAttribute('data-vs-cle', c.k); el.setAttribute('data-vs-lib', c.lib);
        if (el.getAttribute('data-vs-edition') === '1') return;
        var actuel = el.innerHTML, mod = T[c.k], notre = POSE.get(el) === actuel;
        el.classList.toggle('vs-modifie', mod != null);
        if (notre && !force) return;            // déjà affiché par ce script
        if (!notre) ORIG[l][c.k] = actuel;      // nouvel affichage par la page : c'est le texte d'origine
        var voulu = mod != null ? liensAbsolus(mod) : ORIG[l][c.k];
        if (voulu != null && el.innerHTML !== voulu) el.innerHTML = voulu;
        POSE.set(el, el.innerHTML);
      });
    } finally { enCours = false; }
  }
  window.VS_TEXTES = { cles: cles, appliquer: function () { appliquerTextes(true); }, orig: function (k) { return (ORIG[lng()] || {})[k]; }, lang: lng, liens: liensAbsolus };
  var prevu = false;
  function demander() { if (prevu) return; prevu = true; requestAnimationFrame(function () { prevu = false; appliquerTextes(); }); }
  new MutationObserver(function (muts) {
    if (enCours) return;
    for (var i = 0; i < muts.length; i++) { var t = muts[i].target; if (!(t.closest && t.closest('.rechBox, .adm-fond, .vse-barre, .vse-panneau'))) { demander(); return; } }
  }).observe(document.body, { childList: true, subtree: true, characterData: true });

  /* Le fichier des publications est rechargé à neuf à chaque visite */
  if (window.VS_ACTU) afficher();
  var s = document.createElement('script'); s.src = BASE + 'js/actualites.js?t=' + Date.now();
  s.onload = afficher; document.head.appendChild(s);
  ['setLanguage', 'hubSetLanguage'].forEach(function (n) {
    function enrober() {
      var f = window[n]; if (typeof f !== 'function' || f.__vs) return;
      var g = function () { var r = f.apply(this, arguments); setTimeout(afficher, 320); return r; }; g.__vs = true; window[n] = g;
    }
    enrober(); setTimeout(enrober, 1600);
  });

  /* ---------- Accès admin caché : « pierre » au clavier, ou 5 tapes rapides sur le logo EMV ---------- */
  function ouvrirAdmin() {
    if (window.VS_ADMIN_OUVRIR) { window.VS_ADMIN_OUVRIR(); return; }
    var sc = document.createElement('script'); sc.src = BASE + 'js/admin.js?t=' + Date.now(); sc.onload = function () { window.VS_ADMIN_OUVRIR && window.VS_ADMIN_OUVRIR(); }; document.body.appendChild(sc);
  }
  var frappe = '';
  document.addEventListener('keydown', function (e) {
    var t = e.target; if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    if (!e.key || e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;
    frappe = (frappe + e.key.toLowerCase()).slice(-6);
    if (frappe === 'pierre') { frappe = ''; ouvrirAdmin(); }
  });
  function brancherLogo() {
    var img = document.querySelector('a > img[src$="EMV.png"]'), lien = img && img.closest('a');
    if (!lien || lien.__vs) return; lien.__vs = true;
    var tapes = 0, minut = null;
    lien.addEventListener('click', function (e) {
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.button) return;
      e.preventDefault(); e.stopPropagation(); tapes++; clearTimeout(minut);
      if (tapes >= 5) { tapes = 0; ouvrirAdmin(); return; }
      minut = setTimeout(function () {
        var n = tapes; tapes = 0;
        if (n === 1) { var h = lien.getAttribute('href') || ''; var cible = h.charAt(0) === '#' && document.querySelector(h); if (cible) cible.scrollIntoView({ behavior: 'smooth', block: 'start' }); else if (h) location.href = h; }
      }, 450);
    }, true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', brancherLogo); else brancherLogo();
  setTimeout(brancherLogo, 1500);
})();
