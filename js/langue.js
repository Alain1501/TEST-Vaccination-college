/* =====================================================================
   LANGUE — partagé par l'accueil, le collège, le lycée et les deux formulaires
   1. Mémorise la langue choisie (localStorage) : elle reste la même après
      un rafraîchissement et d'une page à l'autre, jusqu'à ce que l'utilisateur
      en choisisse une autre. Une langue passée dans l'adresse (?lang=xx) prime.
   2. Langues écrites de droite à gauche (arabe, pashto, kurde, dari) : seul le
      texte s'écrit de droite à gauche. La mise en page et les logos ne sont
      jamais inversés.
   Chargé dans le <head> avec : <script src="js/langue.js"></script>
   ===================================================================== */
(function () {
  'use strict';
  var KEY = 'vaccinationSud77Lang';
  var LANGS = ['fr','en','ar','tr','ps','ku','ro','ka','sq','am','zh','prs','es','pt','ru','uk','mo'];
  var RTL = ['ar','ps','ku','prs'];
  var html = document.documentElement;

  /* ---------- Texte de droite à gauche sans inverser la page ---------- */
  var st = document.createElement('style');
  st.id = 'langueStyle';
  st.textContent =
    'html.rtlText :is(input,textarea){direction:rtl;text-align:right}';
  (document.head || html).appendChild(st);

  function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function store(l) { try { localStorage.setItem(KEY, l); } catch (e) {} }

  /* Langue affichée actuellement par la page (variables des différentes pages) */
  function current() {
    try { if (typeof lang === 'string' && lang) return lang; } catch (e) {}
    try { if (typeof currentLang === 'string' && currentLang) return currentLang; } catch (e) {}
    return null;
  }

  /* Chaque bloc de texte prend le sens de sa propre langue (dir="auto"),
     sans toucher aux conteneurs de mise en page (flex, grille) ni aux logos */
  var autoTimer = null;
  function markAutoDir() {
    if (!document.body) return;
    var rtl = html.classList.contains('rtlText');
    var els = document.body.querySelectorAll('*');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.closest('svg') || /^(SCRIPT|STYLE|IMG|INPUT|TEXTAREA|SELECT|OPTION|BR)$/.test(el.tagName)) continue;
      if (!rtl) { if (el.hasAttribute('data-autodir')) { el.removeAttribute('dir'); el.removeAttribute('data-autodir'); } continue; }
      if (el.hasAttribute('data-autodir')) continue;
      var hasText = false;
      for (var c = el.firstChild; c; c = c.nextSibling) { if (c.nodeType === 3 && c.nodeValue.trim()) { hasText = true; break; } }
      if (!hasText) continue;
      var d = getComputedStyle(el).display;
      if (d === 'inline' || d.indexOf('flex') > -1 || d.indexOf('grid') > -1) {
        // texte porté par un élément en ligne : c'est son bloc parent qui prend le sens
        var blk = el.parentElement;
        while (blk && blk !== document.body && getComputedStyle(blk).display === 'inline') blk = blk.parentElement;
        if (blk && blk !== document.body && !blk.hasAttribute('dir')) {
          var bd = getComputedStyle(blk).display;
          if (bd.indexOf('flex') < 0 && bd.indexOf('grid') < 0) { blk.setAttribute('dir', 'auto'); blk.setAttribute('data-autodir', '1'); }
        }
        if (d.indexOf('flex') > -1 || d.indexOf('grid') > -1) continue;
        continue;
      }
      if (!el.hasAttribute('dir')) { el.setAttribute('dir', 'auto'); el.setAttribute('data-autodir', '1'); }
    }
  }
  function scheduleAutoDir() { clearTimeout(autoTimer); autoTimer = setTimeout(markAutoDir, 120); }

  function keepLtr() {
    var l = current() || html.getAttribute('lang') || 'fr';
    var rtl = RTL.indexOf(l) > -1;
    html.classList.toggle('rtlText', rtl);
    if (html.getAttribute('dir') !== 'ltr') html.setAttribute('dir', 'ltr');
    if (document.body && document.body.classList.contains('rtl')) document.body.classList.remove('rtl');
    scheduleAutoDir();
  }
  keepLtr();
  new MutationObserver(keepLtr).observe(html, { attributes: true, attributeFilter: ['dir', 'lang'] });

  /* ---------- Langue souhaitée : adresse, sinon mémoire ---------- */
  var fromUrl = null;
  try { fromUrl = new URLSearchParams(location.search).get('lang'); } catch (e) {}
  var wanted = (fromUrl && LANGS.indexOf(fromUrl) > -1) ? fromUrl : stored();
  if (wanted && LANGS.indexOf(wanted) < 0) wanted = null;
  if (fromUrl && wanted === fromUrl) store(fromUrl);

  function pageReady() {
    if (typeof window.hubSetLanguage === 'function') return true;                       // accueil
    try { if (typeof faqData !== 'undefined' && faqData && typeof window.setLanguage === 'function') return true; } catch (e) {} // collège, lycée
    if (document.querySelector('#langPanel .langDropdownOption') && typeof applyLanguage === 'function') return true;           // formulaires
    return false;
  }

  function applyWanted(l) {
    if (typeof window.hubSetLanguage === 'function') { window.hubSetLanguage(l); return; }
    if (typeof window.setLanguage === 'function') { window.setLanguage(l); return; }
    // Formulaires : on passe par le menu de langue, qui met aussi à jour le bouton
    var name = null;
    try { name = I18N[l].langName; } catch (e) {}
    var opts = document.querySelectorAll('#langPanel .langDropdownOption');
    for (var i = 0; i < opts.length; i++) {
      if (name && opts[i].textContent.indexOf(name) > -1) { opts[i].click(); return; }
    }
  }

  /* Formulaires : le bouton de langue affiche toujours la langue réellement appliquée */
  function syncFormButton() {
    try {
      if (typeof currentLang !== 'string' || typeof I18N === 'undefined' || !I18N[currentLang]) return;
      var t = document.getElementById('langSwitcherText');
      if (t && t.textContent !== I18N[currentLang].langName) t.textContent = I18N[currentLang].langName;
      var f = document.getElementById('langSwitcherFlag');
      if (f && typeof FLAG_FILES !== 'undefined') {
        var want = (FLAG_FILES[currentLang] || 'fr') + '.png';
        if (f.getAttribute('src').split('/').pop() !== want) f.setAttribute('src', f.getAttribute('src').replace(/[^\/]+$/, want));
      }
    } catch (e) {}
  }

  var settled = false, tries = 0, applied = false;
  function loop() {
    tries++;
    if (!settled) {
      if (!pageReady()) { if (tries > 80) settled = true; return; }
      var c = current();
      if (wanted && c !== wanted) {
        if (!applied) { applied = true; applyWanted(wanted); }
        if (tries > 80) settled = true;
        return;
      }
      settled = true;
    }
    syncFormButton();
    var now = current();
    if (now && LANGS.indexOf(now) > -1 && now !== stored()) store(now);
    keepLtr();
  }
  function start() {
    if (document.body) {
      new MutationObserver(keepLtr).observe(document.body, { attributes: true, attributeFilter: ['class'] });
      new MutationObserver(function () { if (html.classList.contains('rtlText')) scheduleAutoDir(); }).observe(document.body, { childList: true, subtree: true });
    }
    setInterval(loop, 150);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
