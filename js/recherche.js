/* =====================================================================
   RECHERCHE — accueil (collège et lycée réunis) et pages collège, lycée
   Cherche dans la FAQ, les étapes, les documents, les vidéos et la lettre
   du médecin, dans la langue affichée. Insensible aux accents et aux
   majuscules. Un clic amène à l'élément, ouvre la question ou l'étape et
   la met en évidence.
   ===================================================================== */
(function () {
  'use strict';
  var KEY = 'vaccinationSud77Lang';
  var SCRIPT = document.currentScript;
  var ACCENT = (SCRIPT && SCRIPT.getAttribute('data-accent')) || 'college';
  var HUB = ACCENT === 'hub';
  var RTL = ['ar', 'ps', 'ku', 'prs'];

  var TXT = {
    ph: {
      fr: "Rechercher une question, une étape, un document…",
      en: "Search a question, a step, a document…",
      ar: "ابحث عن سؤال أو خطوة أو وثيقة…",
      tr: "Bir soru, adım veya belge arayın…",
      ps: "پوښتنه، ګام یا سند ولټوئ…",
      ku: "بە دوای پرسیار، هەنگاو یان بەڵگەنامەدا بگەڕێ…",
      ro: "Căutați o întrebare, o etapă, un document…",
      ka: "მოძებნეთ კითხვა, ეტაპი, დოკუმენტი…",
      sq: "Kërkoni një pyetje, një hap, një dokument…",
      am: "ጥያቄ፣ ደረጃ ወይም ሰነድ ይፈልጉ…",
      zh: "搜索问题、步骤或文件…",
      prs: "یک سوال، مرحله یا سند را جستجو کنید…",
      es: "Buscar una pregunta, un paso, un documento…",
      pt: "Pesquisar uma pergunta, uma etapa, um documento…",
      ru: "Найдите вопрос, этап, документ…",
      uk: "Знайдіть питання, етап, документ…",
      mo: "Căutați o întrebare, o etapă, un document…"
    },
    none: {
      fr: "Aucun résultat", en: "No results", ar: "لا توجد نتائج", tr: "Sonuç yok",
      ps: "هیڅ پایله نشته", ku: "هیچ ئەنجامێک نییە", ro: "Niciun rezultat", ka: "შედეგი არ მოიძებნა",
      sq: "Asnjë rezultat", am: "ምንም ውጤት የለም", zh: "没有结果", prs: "نتیجه‌ای یافت نشد",
      es: "Ningún resultado", pt: "Nenhum resultado", ru: "Ничего не найдено", uk: "Нічого не знайдено",
      mo: "Niciun rezultat"
    },
    clear: {
      fr: "Effacer", en: "Clear", ar: "مسح", tr: "Temizle", ps: "پاکول", ku: "سڕینەوە", ro: "Ștergeți",
      ka: "გასუფთავება", sq: "Fshij", am: "አጽዳ", zh: "清除", prs: "پاک کردن", es: "Borrar",
      pt: "Limpar", ru: "Очистить", uk: "Очистити", mo: "Ștergeți"
    },
    faq: {
      fr: "Question", en: "Question", ar: "سؤال", tr: "Soru", ps: "پوښتنه", ku: "پرسیار", ro: "Întrebare",
      ka: "კითხვა", sq: "Pyetje", am: "ጥያቄ", zh: "问题", prs: "سوال", es: "Pregunta", pt: "Pergunta",
      ru: "Вопрос", uk: "Питання", mo: "Întrebare"
    },
    step: {
      fr: "Étape", en: "Step", ar: "خطوة", tr: "Adım", ps: "ګام", ku: "هەنگاو", ro: "Etapă", ka: "ეტაპი",
      sq: "Hap", am: "ደረጃ", zh: "步骤", prs: "مرحله", es: "Paso", pt: "Etapa", ru: "Этап", uk: "Етап",
      mo: "Etapă"
    },
    doc: {
      fr: "Document", en: "Document", ar: "وثيقة", tr: "Belge", ps: "سند", ku: "بەڵگەنامە", ro: "Document",
      ka: "დოკუმენტი", sq: "Dokument", am: "ሰነድ", zh: "文件", prs: "سند", es: "Documento",
      pt: "Documento", ru: "Документ", uk: "Документ", mo: "Document"
    },
    video: {
      fr: "Vidéo", en: "Video", ar: "فيديو", tr: "Video", ps: "ویډیو", ku: "ڤیدیۆ", ro: "Video", ka: "ვიდეო",
      sq: "Video", am: "ቪዲዮ", zh: "视频", prs: "ویدیو", es: "Vídeo", pt: "Vídeo", ru: "Видео", uk: "Відео",
      mo: "Video"
    },
    letter: {
      fr: "Lettre du médecin", en: "Doctor's letter", ar: "رسالة الطبيب", tr: "Doktorun mektubu",
      ps: "د ډاکټر لیک", ku: "نامەی پزیشک", ro: "Scrisoarea medicului", ka: "ექიმის წერილი",
      sq: "Letra e mjekut", am: "የሐኪሙ ደብዳቤ", zh: "医生的信", prs: "نامه داکتر", es: "Carta del médico",
      pt: "Carta do médico", ru: "Письмо врача", uk: "Лист лікаря", mo: "Scrisoarea medicului"
    }
  };

  var SITE = {
    college: { fr: "Collège", en: "Middle school", ar: "الإعدادية" },
    lycee: { fr: "Lycée", en: "High school", ar: "الثانوية" }
  };
  function siteLabel(k) {
    if (typeof window.ptLabel === 'function') return window.ptLabel(k, lang());
    return SITE[k][lang()] || SITE[k].fr;
  }

  function lang() {
    var l = null;
    try { l = localStorage.getItem(KEY); } catch (e) {}
    return (l && TXT.ph[l]) ? l : 'fr';
  }
  function tx(k) { var o = TXT[k]; return o[lang()] || o.fr; }

  /* ---------- Normalisation (accents, majuscules) avec table de positions ---------- */
  function fold(ch) {
    return ch.normalize('NFD').replace(/[̀-ًͯ-ٰٟ]/g, '').toLowerCase()
      .replace(/[’‘`]/g, "'").replace(/œ/g, 'oe').replace(/æ/g, 'ae').replace(/ß/g, 'ss')
      .replace(/[إأآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/ك/g, 'ک').replace(/ي/g, 'ی');
  }
  function norm(str) {
    var out = '', map = [];
    for (var i = 0; i < str.length; i++) {
      var f = fold(str[i]);
      for (var j = 0; j < f.length; j++) { out += f[j]; map.push(i); }
    }
    return { s: out, map: map };
  }
  function tokens(q) {
    return norm(q.trim()).s.split(/\s+/).filter(function (w) { return w.length > 0; });
  }
  /* Un mot d'une seule lettre (ex. « B ») ne compte que s'il est isolé */
  function has(hay, t) {
    if (t.length > 1 || /[\u3400-\u9fff]/.test(t)) return hay.indexOf(t) !== -1;
    var e = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp('(^|[^\\p{L}\\p{N}])' + e + '($|[^\\p{L}\\p{N}])', 'u').test(hay);
  }
  function clean(s) { return (s || '').replace(/\s+/g, ' ').trim(); }

  /* ---------- Index construit à partir de la page affichée ---------- */
  function collect() {
    var list = [];
    document.querySelectorAll('#faqList .acc').forEach(function (acc) {
      var q = acc.querySelector('h3 button > span:not(.fxIco):not(.signe)');
      var a = acc.querySelector('.faqAns');
      list.push({ type: 'faq', el: acc, title: clean(q && q.textContent), body: clean(a && a.textContent) });
    });
    document.querySelectorAll('#stepsContainer .stepItem').forEach(function (st) {
      var n = st.querySelector('.stepNumber'), ti = st.querySelector('.stepTitle'), te = st.querySelector('.stepText');
      list.push({ type: 'step', el: st, title: clean((n ? n.textContent + '. ' : '') + (ti ? ti.textContent : '')), body: clean(te && te.textContent) });
    });
    var seen = {};
    var hasCards = document.querySelectorAll('#videoGrid .videoCard').length > 0;
    document.querySelectorAll('#introBody .btn').forEach(function (b) {
      var key = b.getAttribute('data-key') || '';
      if (key === 'contact_email' || key === 'faq_link') return;
      if (key === 'video_info' && hasCards) return;
      var k = clean(b.textContent) + '|' + (b.getAttribute('href') || '');
      if (seen[k]) return; seen[k] = 1;
      var w = b.closest('.formBtnWrap');
      var hint = w && w.querySelector('.formBtnHint');
      list.push({ type: key === 'video_info' ? 'video' : 'doc', el: w || b, title: clean(b.textContent), body: clean(hint && hint.textContent) });
    });
    document.querySelectorAll('#videoGrid .videoCard').forEach(function (v) {
      var ti = v.querySelector('.videoTitle');
      list.push({ type: 'video', el: v, title: clean(ti && ti.textContent), body: '' });
    });
    document.querySelectorAll('#introBody .letterP').forEach(function (p, i) {
      list.push({ type: 'letter', el: p, n: i, title: tx('letter'), body: clean(p.textContent), titleFixed: true });
    });
    document.querySelectorAll('#introBody .letterSign').forEach(function (p) {
      list.push({ type: 'letter', el: p, n: 'sign', title: tx('letter'), body: clean(p.innerText || p.textContent), titleFixed: true });
    });
    return list;
  }

  /* ---------- Accueil : index construit à partir des données des deux sites ---------- */
  var DATA = { college: null, lycee: null };
  function loadData() {
    ['college', 'lycee'].forEach(function (site) {
      Promise.all([
        fetch(site + '/faq.json').then(function (r) { return r.json(); }),
        fetch(site + '/intro_resources.json').then(function (r) { return r.json(); })
      ]).then(function (d) {
        DATA[site] = { faq: d[0], intro: d[1] };
        if (input && input.value.trim()) run();
      }).catch(function () {});
    });
  }
  function tv(v) {
    if (v == null) return '';
    if (typeof v === 'string') return v;
    return v[lang()] || v.fr || '';
  }
  function plain(s) { return clean(String(s || '').replace(/\[\[([^\]|]+)\|[a-z]+\]\]/g, '$1').replace(/\*\*/g, '')); }
  /* Adresse d'un document du site collège ou lycée, vue depuis l'accueil */
  function abs(site, u) {
    if (/^(https?:|mailto:)/i.test(u)) return u;
    if (u.charAt(0) === '/') u = u.slice(1);
    try { return new URL(u, new URL(site + '/index.html', location.href)).href; } catch (e) { return site + '/' + u; }
  }
  function collectHub() {
    var list = [];
    ['college', 'lycee'].forEach(function (site) {
      var D = DATA[site]; if (!D) return;
      var add = function (type, title, body, ref, fixed, url) {
        list.push({ site: site, type: type, title: plain(title), body: plain(body), ref: ref, titleFixed: !!fixed, url: url ? abs(site, url) : '' });
      };
      (D.faq.items || []).forEach(function (it) { var q = tv(it.q); add('faq', q, tv(it.a), q); });
      var I = D.intro || {}, intro = I.intro || {};
      ((intro.vaccination_steps || {}).steps || []).forEach(function (st) {
        var ti = st.number + '. ' + tv(st.title); add('step', ti, tv(st.text), ti);
      });
      ((I.resources || {}).forms || []).forEach(function (f) {
        var u = f.url || '';
        if (u && !/\.pdf(\?|#|$)/i.test(u) && !/^https?:/i.test(u)) u += (u.indexOf('?') === -1 ? '?' : '&') + 'lang=' + encodeURIComponent(lang());
        add('doc', tv(f.label), tv(f.hint), plain(tv(f.label)), false, u);
      });
      ((I.resources || {}).videos || []).forEach(function (v) { var ti = tv(v.title) || tv(v.label); add('video', ti, '', plain(ti), false, v.url); });
      if (I.hpv_flyer_multilang) { var a = tv(I.hpv_flyer_multilang.label); if (a) add('doc', a, '', plain(a), false, I.hpv_flyer_multilang.url); }
      if (I.official_idf && I.official_idf.flyer_pdf && I.official_idf.flyer_pdf.file) { var b = tv(I.official_idf.flyer_pdf.label); if (b) add('doc', b, '', plain(b), false, I.official_idf.flyer_pdf.file); }
      if (I.meningite_documents) (I.meningite_documents.items || []).forEach(function (it) { var c = tv(it.label); if (c) add('doc', c, '', plain(c), false, it.file); });
      String(tv(intro.body) || tv(intro.text) || '').split(/\n\s*\n/).forEach(function (para, i) {
        if (para.trim()) add('letter', tx('letter'), para, i, true);
      });
      var sig = tv(intro.signature_name);
      if (sig) add('letter', tx('letter'), sig + ' ' + tv(intro.signature_role), 'sign', true);
    });
    return list;
  }

  /* ---------- Mise en évidence ---------- */
  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function mark(text, toks) {
    if (!text) return '';
    var n = norm(text), hit = new Array(text.length);
    toks.forEach(function (t) {
      if (t.length < 2 && !/[\u3400-\u9fff]/.test(t)) return;
      var from = 0, k;
      while ((k = n.s.indexOf(t, from)) !== -1) {
        for (var x = n.map[k]; x <= n.map[k + t.length - 1]; x++) hit[x] = true;
        from = k + t.length;
      }
    });
    var out = '', open = false;
    for (var i = 0; i < text.length; i++) {
      if (hit[i] && !open) { out += '<mark>'; open = true; }
      if (!hit[i] && open) { out += '</mark>'; open = false; }
      out += esc(text[i]);
    }
    return out + (open ? '</mark>' : '');
  }
  function snippet(text, toks) {
    if (!text) return '';
    var n = norm(text), first = -1;
    toks.forEach(function (t) { var k = n.s.indexOf(t); if (k !== -1 && (first === -1 || k < first)) first = k; });
    var pos = first === -1 ? 0 : n.map[first];
    var start = Math.max(0, pos - 50), end = Math.min(text.length, start + 160);
    if (start > 0) { var sp = text.indexOf(' ', start); if (sp !== -1 && sp < pos) start = sp + 1; }
    return (start > 0 ? '… ' : '') + text.slice(start, end) + (end < text.length ? ' …' : '');
  }

  /* ---------- Interface ---------- */
  var box, input, clearBtn, panel, results = [], active = -1;

  function build() {
    var hero = HUB ? document.querySelector('.paths') : document.querySelector('.hero');
    if (!hero) return false;
    box = document.createElement('div');
    box.className = HUB ? 'rechBox rechHub' : 'rechBox container';
    box.setAttribute('data-accent', ACCENT);
    box.innerHTML =
      '<div class="rechField" role="search">' +
        '<svg class="rechIco" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>' +
        '<input type="search" class="rechInput" autocomplete="off" spellcheck="false" aria-autocomplete="list" aria-controls="rechPanel" aria-expanded="false">' +
        '<button type="button" class="rechClear" hidden><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '</div>' +
      '<div class="rechPanel" id="rechPanel" role="listbox" hidden></div>';
    hero.parentNode.insertBefore(box, hero.nextSibling);
    input = box.querySelector('.rechInput');
    clearBtn = box.querySelector('.rechClear');
    panel = box.querySelector('.rechPanel');

    input.addEventListener('input', run);
    input.addEventListener('focus', function () { if (input.value.trim()) run(); });
    input.addEventListener('keydown', function (e) {
      if (panel.hidden) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(Math.min(active + 1, results.length - 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(Math.max(active - 1, 0)); }
      else if (e.key === 'Enter') { e.preventDefault(); if (results[active >= 0 ? active : 0]) go(results[active >= 0 ? active : 0], null); }
      else if (e.key === 'Escape') { close(); }
    });
    clearBtn.addEventListener('click', function () { input.value = ''; close(); clearBtn.hidden = true; input.focus(); });
    document.addEventListener('click', function (e) { if (!box.contains(e.target)) close(); });
    texts();
    return true;
  }

  function texts() {
    if (!input) return;
    var l = lang();
    input.placeholder = tx('ph');
    input.setAttribute('aria-label', tx('ph'));
    clearBtn.setAttribute('aria-label', tx('clear'));
    box.setAttribute('dir', RTL.indexOf(l) !== -1 ? 'rtl' : 'ltr');
  }

  function close() { panel.hidden = true; input.setAttribute('aria-expanded', 'false'); active = -1; }

  /* Choix au clavier : seule la liste défile, jamais la page */
  function setActive(i) {
    active = i;
    panel.querySelectorAll('.rechItem').forEach(function (it, k) {
      it.classList.toggle('on', k === i);
      if (k === i) {
        if (it.offsetTop < panel.scrollTop) panel.scrollTop = it.offsetTop - 6;
        else if (it.offsetTop + it.offsetHeight > panel.scrollTop + panel.clientHeight) panel.scrollTop = it.offsetTop + it.offsetHeight - panel.clientHeight + 6;
      }
    });
  }

  function run() {
    var q = input.value;
    clearBtn.hidden = !q;
    var toks = tokens(q);
    if (!toks.length || (toks.join('').length < 2 && !/[㐀-鿿]/.test(q))) { close(); return; }
    var order = { faq: 0, step: 1, doc: 2, video: 3, letter: 4 };
    results = (HUB ? collectHub() : collect()).filter(function (r) {
      var hay = norm(r.title + ' ' + r.body).s;
      return toks.every(function (t) { return has(hay, t); });
    }).map(function (r) {
      var nt = norm(r.title).s;
      r.score = order[r.type] * 10 - (r.titleFixed ? 0 : toks.filter(function (t) { return nt.indexOf(t) !== -1; }).length * 3) + (r.site === 'lycee' ? 1 : 0);
      return r;
    }).sort(function (a, b) { return a.score - b.score; }).slice(0, 40);

    panel.innerHTML = '';
    if (!results.length) {
      panel.innerHTML = '<div class="rechNone">' + esc(tx('none')) + '</div>';
    } else {
      results.forEach(function (r, k) {
        var it = document.createElement('button');
        it.type = 'button';
        it.className = 'rechItem';
        it.setAttribute('role', 'option');
        it.setAttribute('data-type', r.type);
        it.setAttribute('dir', 'auto');
        var title = r.titleFixed ? esc(r.title) : mark(r.title, toks);
        var body = r.body ? mark(snippet(r.body, toks), toks) : '';
        it.innerHTML = '<span class="rechTags">' + (r.site ? '<span class="rechSite" data-site="' + r.site + '">' + esc(siteLabel(r.site)) + '</span>' : '') +
          '<span class="rechTag">' + esc(tx(r.type)) + '</span></span>' +
          '<span class="rechTxt"><span class="rechTitle" dir="auto">' + title + '</span>' +
          (body ? '<span class="rechBody" dir="auto">' + body + '</span>' : '') + '</span>';
        it.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); go(r, e); });
        panel.appendChild(it);
      });
    }
    var wasHidden = panel.hidden;
    panel.hidden = false;
    input.setAttribute('aria-expanded', 'true');
    active = -1;
    /* À l'ouverture de la liste, si elle dépasse le bas de l'écran, on remonte le champ vers le haut */
    var pr = panel.getBoundingClientRect(), br = box.getBoundingClientRect();
    if (wasHidden && pr.bottom > innerHeight - 8 && br.top > 90) {
      window.scrollBy({ top: Math.min(br.top - 80, pr.bottom - innerHeight + 24), behavior: 'smooth' });
    }
  }

  function flash(el) {
    el.classList.remove('rechFlash');
    void el.offsetWidth;
    el.classList.add('rechFlash');
    setTimeout(function () { el.classList.remove('rechFlash'); }, 2600);
  }

  /* Ouverture dans un nouvel onglet uniquement (le site reste ouvert dans l'onglet actuel) */
  function openTab(url) {
    var l = document.createElement('a');
    l.href = url; l.target = '_blank'; l.rel = 'noopener';
    l.style.display = 'none';
    document.body.appendChild(l);
    l.click();
    l.remove();
  }

  function go(r, evt) {
    close();
    input.blur();
    if (HUB) {
      /* Document, formulaire ou vidéo : ouverture directe */
      if ((r.type === 'doc' || r.type === 'video') && r.url) {
        openTab(r.url);
        return;
      }
      /* Question, étape, lettre : page du collège ou du lycée, à l'endroit exact */
      var hash = '#rech=' + r.type + ':' + encodeURIComponent(String(r.ref));
      if (typeof window.ptGo === 'function') window.ptGo(r.site, evt || null, hash);
      else location.href = r.site + '/index.html?lang=' + lang() + hash;
      return;
    }
    var el = r.el;
    if (!document.body.contains(el)) return;
    /* Document, formulaire : on ouvre directement le lien du bouton (PDF, formulaire, site) */
    if (r.type === 'doc' || (r.type === 'video' && !el.classList.contains('videoCard'))) {
      var a = el.matches('a') ? el : el.querySelector('a');
      var href = a && a.getAttribute('href');
      if (href) {
        if (href.charAt(0) === '#') { var t = document.querySelector(href); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
        if (/^mailto:/i.test(href) || a.target === '_self') { location.href = a.href; return; }
        openTab(a.href);
        return;
      }
    }
    /* Vidéo de la page : on y va et on la lance */
    if (r.type === 'video' && el.classList.contains('videoCard')) {
      var th = el.querySelector('.videoThumb'); if (th) th.click();
    }
    if (r.type === 'faq' && !el.classList.contains('ouverte')) {
      var b = el.querySelector('h3 button'); if (b) b.click();
    }
    if (r.type === 'step') {
      var zone = el.querySelector('.stepActions');
      if (zone && !zone.classList.contains('active')) el.click();
    }
    var card = el.closest('.reveal'); if (card) card.classList.add('visible');
    setTimeout(function () {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      flash(el);
      /* Après l'ouverture complète de la question ou de l'étape, on recale précisément */
      setTimeout(function () {
        var rc = el.getBoundingClientRect();
        if (rc.top < 70 || rc.bottom > innerHeight - 20) el.scrollIntoView({ behavior: 'smooth', block: rc.height > innerHeight - 120 ? 'start' : 'center' });
      }, 650);
    }, r.type === 'faq' || r.type === 'step' ? 120 : 0);
  }

  /* ---------- Démarrage et changement de langue ---------- */
  /* ---------- Arrivée depuis l'accueil (#rech=type:référence) ---------- */
  function arrive() {
    var m = /^#rech=([a-z]+):(.*)$/.exec(location.hash);
    if (!m) return;
    var type = m[1], ref = decodeURIComponent(m[2]);
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
    var html = document.documentElement, waited = 0;
    (function wait() {
      var ready = !html.classList.contains('langPending') && document.querySelectorAll('#faqList .acc').length > 0 &&
        !document.querySelector('.ptOverlay') && !document.querySelector('.main.langFade');
      if (!ready && waited < 8000) { waited += 100; setTimeout(wait, 100); return; }
      setTimeout(function () {
        var list = collect().filter(function (r) { return r.type === type; }), hit = null;
        if (type === 'letter') hit = list.filter(function (r) { return String(r.n) === ref; })[0];
        if (!hit) { var nr = norm(ref).s; hit = list.filter(function (r) { return norm(r.title).s === nr; })[0] ||
          list.filter(function (r) { var nt = norm(r.title).s; return nt && (nt.indexOf(nr) !== -1 || nr.indexOf(nt) !== -1); })[0]; }
        if (hit) go(hit);
      }, 350);
    })();
  }

  function hook() {
    var name = HUB ? 'hubSetLanguage' : 'setLanguage';
    var prev = window[name];
    if (typeof prev !== 'function' || prev.__rech) return;
    var wrapped = function () {
      var res = prev.apply(this, arguments);
      setTimeout(function () { texts(); if (input && input.value.trim()) run(); }, 320);
      return res;
    };
    wrapped.__rech = true;
    window[name] = wrapped;
  }

  function start() {
    if (!build()) return;
    if (HUB) loadData(); else arrive();
    hook();
    setTimeout(hook, 1500);
    window.addEventListener('storage', function (e) { if (e.key === KEY) texts(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
