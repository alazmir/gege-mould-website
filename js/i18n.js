/**
 * Gege Mould i18n Engine
 * 5-language support: English (en), Portuguese (pt), Spanish (es), Arabic (ar), Indonesian (id)
 * Handles: text replacement, RTL toggling, language persistence, hreflang switching
 * FOUC prevention: hides body for non-English languages until translations apply
 */
(function () {
  'use strict';

  const SUPPORTED = ['en', 'pt', 'es', 'ar', 'id'];
  const DEFAULT = 'en';
  const STORAGE_KEY = 'gege_lang';
  const TRANSLATIONS_PATH = 'assets/i18n/';

  let currentLang = DEFAULT;
  let translations = {};

  // ── FOUC Prevention: hide body immediately if non-English language is stored ──
  // This runs synchronously before DOM renders, preventing flash of English content
  (function antiFOUC() {
    var stored;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch(_) { stored = null; }
    if (stored && stored !== DEFAULT && SUPPORTED.indexOf(stored) !== -1) {
      var style = document.createElement('style');
      style.id = 'i18n-anti-fouc';
      style.textContent = 'body{visibility:hidden!important}';
      // Insert as early as possible — before body renders
      if (document.head) document.head.appendChild(style);
    }
  })();

  // ── Language Detection ──
  function detectLang() {
    // 1. URL param ?lang=pt
    const urlParam = new URLSearchParams(window.location.search).get('lang');
    if (urlParam && SUPPORTED.includes(urlParam)) {
      return urlParam;
    }
    // 2. localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && SUPPORTED.includes(stored)) return stored;
    } catch (_) { /* localStorage unavailable */ }
    // 3. Browser preference
    const browserLang = (navigator.language || navigator.userLanguage || '').split('-')[0];
    if (SUPPORTED.includes(browserLang)) return browserLang;
    // 4. Default
    return DEFAULT;
  }

  // ── Load Translations ──
  async function loadTranslations(lang) {
    try {
      const resp = await fetch(`${TRANSLATIONS_PATH}${lang}.json`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      translations = await resp.json();
      return true;
    } catch (err) {
      console.warn(`[i18n] Failed to load ${lang}:`, err.message);
      if (lang !== DEFAULT) {
        return loadTranslations(DEFAULT);
      }
      return false;
    }
  }

  // ── Apply Translations to DOM ──
  function applyTranslations() {
    // Text nodes with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[key]) {
        // Use innerHTML when value contains HTML tags, textContent otherwise
        if (/<\/?[a-zA-Z][^>]*>/i.test(translations[key])) {
          el.innerHTML = translations[key];
        } else {
          el.textContent = translations[key];
        }
      }
    });

    // Placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (translations[key]) {
        el.setAttribute('placeholder', translations[key]);
      }
    });

    // Title attributes
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (translations[key]) {
        el.setAttribute('title', translations[key]);
      }
    });

    // aria-label attributes
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      if (translations[key]) {
        el.setAttribute('aria-label', translations[key]);
      }
    });

    // alt attributes (for images)
    document.querySelectorAll('[data-i18n-alt]').forEach(el => {
      const key = el.getAttribute('data-i18n-alt');
      if (translations[key]) {
        el.setAttribute('alt', translations[key]);
      }
    });

    // Document title
    if (translations['meta.title']) {
      document.title = translations['meta.title'];
    }

    // Meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && translations['meta.description']) {
      metaDesc.setAttribute('content', translations['meta.description']);
    }

    // Meta keywords
    const metaKeys = document.querySelector('meta[name="keywords"]');
    if (metaKeys && translations['meta.keywords']) {
      metaKeys.setAttribute('content', translations['meta.keywords']);
    }

    // OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && translations['meta.og_title']) {
      ogTitle.setAttribute('content', translations['meta.og_title']);
    }
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && translations['meta.og_description']) {
      ogDesc.setAttribute('content', translations['meta.og_description']);
    }

    // HTML lang attribute
    document.documentElement.setAttribute('lang', currentLang);

    // hreflang: update canonical/hreflang links
    if (translations['meta.canonical']) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', translations['meta.canonical']);
    }
  }

  // ── RTL Toggle for Arabic ──
  function handleRTL() {
    const html = document.documentElement;
    // Load/unload rtl.css conditionally (only when Arabic is active)
    var rtlLink = document.querySelector('link[data-rtl]');
    if (currentLang === 'ar') {
      html.setAttribute('dir', 'rtl');
      html.classList.add('rtl');
      // Load Arabic font
      if (!document.querySelector('link[href*="noto-sans-arabic"]')) {
        const fontLink = document.createElement('link');
        fontLink.rel = 'stylesheet';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap';
        document.head.appendChild(fontLink);
      }
      // Load rtl.css dynamically (not render-blocking on non-Arabic page loads)
      if (!rtlLink) {
        rtlLink = document.createElement('link');
        rtlLink.rel = 'stylesheet';
        rtlLink.href = 'css/rtl.css?v=1782378421';
        rtlLink.setAttribute('data-rtl', '');
        document.head.appendChild(rtlLink);
      }
    } else {
      html.removeAttribute('dir');
      html.classList.remove('rtl');
      // Remove rtl.css when switching away from Arabic
      if (rtlLink) rtlLink.remove();
    }
  }

  // ── Build Language Switcher UI ──
  function buildSwitcher() {
    var containers = document.querySelectorAll('.lang-switcher');
    if (!containers.length) return;

    var flagMap = { en: 'gb', pt: 'br', es: 'es', ar: 'globe', id: 'id' };
    var langs = [
      { code: 'en', label: 'EN' },
      { code: 'pt', label: 'PT' },
      { code: 'es', label: 'ES' },
      { code: 'ar', label: 'AR' },
      { code: 'id', label: 'ID' },
    ];

    // For RTL languages, reverse the button order so the active language
    // appears at the visual start (right side in RTL, matching LTR UX)
    var orderedLangs = (currentLang === 'ar') ? langs.slice().reverse() : langs;

    containers.forEach(function(container) {
      container.innerHTML = '';
      orderedLangs.forEach(function(l) {
        var btn = document.createElement('button');
        btn.className = 'lang-switcher__btn';
        if (l.code === currentLang) btn.classList.add('lang-switcher__btn--active');

        // Flag icon
        var flag = document.createElement('img');
        flag.src = 'assets/flags/' + flagMap[l.code] + '.svg';
        flag.className = 'lang-switcher__flag';
        flag.alt = '';
        flag.setAttribute('aria-hidden', 'true');
        flag.width = 20;
        flag.height = 15;
        btn.appendChild(flag);

        // Label text
        var label = document.createElement('span');
        label.className = 'lang-switcher__label';
        label.textContent = l.label;
        btn.appendChild(label);

        btn.title = l.label;
        btn.setAttribute('aria-label', l.label);
        btn.addEventListener('click', function() { switchLanguage(l.code); });
        container.appendChild(btn);
      });
    });
  }

  // ── Update All Switchers on Page ──
  function updateAllSwitchers() {
    document.querySelectorAll('.lang-switcher').forEach(sw => {
      const btns = sw.querySelectorAll('.lang-switcher__btn');
      btns.forEach((btn, i) => {
        btn.classList.remove('lang-switcher__btn--active');
        if (SUPPORTED[i] === currentLang) {
          btn.classList.add('lang-switcher__btn--active');
        }
      });
    });
  }

  // ── Switch Language ──
  async function switchLanguage(lang) {
    if (lang === currentLang) return;
    if (!SUPPORTED.includes(lang)) return;

    const loaded = await loadTranslations(lang);
    if (!loaded) return;

    currentLang = lang;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) { /* */ }

    applyTranslations();
    handleRTL();
    updateAllSwitchers();

    // Update URL without reload
    try {
      const url = new URL(window.location);
      url.searchParams.set('lang', lang);
      window.history.replaceState({}, '', url);
    } catch (_) { /* */ }

    // Update hreflang canonical
    const canonMap = { en: '/', pt: '/pt/', es: '/es/', ar: '/ar/', id: '/id/' };
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(link => {
      const hl = link.getAttribute('hreflang');
      if (hl === lang) {
        let canon = document.querySelector('link[rel="canonical"]');
        if (!canon) {
          canon = document.createElement('link');
          canon.setAttribute('rel', 'canonical');
          document.head.appendChild(canon);
        }
        canon.setAttribute('href', `https://gegemould.com${canonMap[lang] || '/'}`);
      }
    });
  }

  // ── Init ──
  async function init() {
    currentLang = detectLang();
    await loadTranslations(currentLang);
    applyTranslations();
    handleRTL();
    buildSwitcher();

    // Remove FOUC prevention — translations are now applied
    var antiFouc = document.getElementById('i18n-anti-fouc');
    if (antiFouc) antiFouc.remove();

    // Expose for external use (e.g., forms can read current language)
    window.GEGE_I18N = {
      getLang: () => currentLang,
      switchLanguage,
      t: (key) => translations[key] || key,
    };
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
