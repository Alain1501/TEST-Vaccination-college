/* =====================================================================
   BANDEAU DES LOGOS — présentation fixe, sans défilement
   Partagé par l'accueil, le collège, le lycée et les deux formulaires.
   Ordinateur : une seule ligne, les logos se réduisent un peu si besoin.
   Téléphone : une ligne si les logos restent lisibles, sinon deux lignes
   horizontales équilibrées (3 + 3 ou 3 + 2), centrées.
   Chargé avec : <script src="js/entete.js" defer></script>
   ===================================================================== */
(function () {
  'use strict';

  var css = '' +
    '.headerLogos{display:flex!important;flex-wrap:nowrap!important;align-items:center;justify-content:center;min-width:0;max-width:100%}' +
    '.logoTrack{display:flex;flex-wrap:nowrap;align-items:center;justify-content:center;gap:var(--logoGap,26px)}' +
    '.logoTrack a{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center}' +
    '.headerLogos .logoTrack img{height:var(--logoH,46px)!important;width:auto!important;max-width:none!important;object-fit:contain;display:block}' +
    /* Deux lignes équilibrées */
    '.headerLogos.isGrid .logoTrack{flex-wrap:wrap;justify-content:center;column-gap:14px;row-gap:12px;width:100%;max-width:520px}' +
    '.headerLogos.isGrid .logoTrack a{flex:0 0 calc((100% - (var(--logoCols,3) - 1) * 14px) / var(--logoCols,3));min-width:0}' +
    '.headerLogos.isGrid .logoTrack img{height:auto!important;max-height:var(--logoH,30px);max-width:100%!important}' +
    '@media (max-width:768px){' +
      '.siteHeaderInner{gap:10px!important;padding:12px 14px!important}' +
      '.headerLogos{width:100%}' +
      '.logoTrack{--logoGap:16px}' +
    '}';
  var st = document.createElement('style');
  st.id = 'logoBandStyle';
  st.textContent = css;
  document.head.appendChild(st);

  function setup(box) {
    if (box.dataset.logoBand) return;
    box.dataset.logoBand = '1';
    var track = document.createElement('div');
    track.className = 'logoTrack';
    while (box.firstChild) track.appendChild(box.firstChild);
    box.appendChild(track);
    var count = track.querySelectorAll('a').length;

    function fit() {
      box.classList.remove('isGrid');
      var mobile = window.innerWidth <= 768;
      var h = mobile ? 34 : 46;
      var min = mobile ? 26 : 30;
      track.style.setProperty('--logoH', h + 'px');
      while (track.scrollWidth > box.clientWidth + 1 && h > min) {
        h -= 2;
        track.style.setProperty('--logoH', h + 'px');
      }
      if (track.scrollWidth <= box.clientWidth + 1) return;
      // Pas assez de place sur une ligne : deux lignes horizontales
      track.style.setProperty('--logoCols', Math.ceil(count / 2));
      track.style.setProperty('--logoH', (mobile ? 34 : 40) + 'px');
      box.classList.add('isGrid');
    }

    var imgs = track.querySelectorAll('img');
    imgs.forEach(function (im) {
      if (!im.complete) { im.addEventListener('load', fit); im.addEventListener('error', fit); }
    });
    fit();
    var t;
    window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(fit, 150); });
  }

  function init() { document.querySelectorAll('.headerLogos').forEach(setup); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
