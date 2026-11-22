/* =========================================================================
   PREIZ Co. — CORE
   Language system, navigation, contact links and small UI behaviours.
   No editing needed here for day-to-day content changes.
   ========================================================================= */

(function () {
  "use strict";

  var P = window.PREIZ;
  var STORAGE_KEY = "preiz-lang";
  var listeners = [];

  /* ---------------- Storage (safe) ---------------- */
  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* private mode */ }
  }
  function read(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  /* ---------------- Language ---------------- */
  function initialLang() {
    var params = new URLSearchParams(location.search);
    var fromUrl = params.get("lang");
    if (fromUrl === "al") fromUrl = "sq";
    if (fromUrl && P.site.languages.indexOf(fromUrl) > -1) return fromUrl;
    var saved = read(STORAGE_KEY);
    if (saved && P.site.languages.indexOf(saved) > -1) return saved;
    return P.site.defaultLanguage;
  }

  P.lang = initialLang();

  /** Translate a UI key. vars: { name: "..." } replaces {name}. */
  P.t = function (key, vars) {
    var dict = P.i18n[P.lang] || {};
    var text = dict[key];
    if (text == null) text = (P.i18n[P.site.defaultLanguage] || {})[key];
    if (text == null) {
      if (window.console) console.warn("[i18n] Missing key:", key);
      return key;
    }
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        text = text.split("{" + k + "}").join(vars[k]);
      });
    }
    return text;
  };

  /** Pick the current language from a bilingual object { sq, en }. */
  P.L = function (obj) {
    if (obj == null) return "";
    if (typeof obj === "string") return obj;
    return obj[P.lang] != null ? obj[P.lang] : obj[P.site.defaultLanguage];
  };

  /** Format a number with the active language's thousands separator: 8.000 / 8,000 */
  P.num = function (n) {
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, P.lang === "sq" ? "." : ",");
  };

  /** Format a price in Albanian lek: "8.000 lekë" (sq) / "8,000 lek" (en). */
  P.price = function (n) {
    return P.num(n) + " " + P.t("common.currency");
  };

  /** Escape text for safe HTML insertion. */
  P.esc = function (s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  };

  /** Register a function that re-renders when the language changes. */
  P.onLang = function (fn) {
    listeners.push(fn);
    fn(P.lang);
  };

  function applyStatic(root) {
    root = root || document;

    root.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = P.t(el.getAttribute("data-i18n"));
    });
    root.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      el.innerHTML = P.t(el.getAttribute("data-i18n-html"));
    });
    root.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var parts = pair.split(":");
        if (parts.length < 2) return;
        el.setAttribute(parts[0].trim(), P.t(parts.slice(1).join(":").trim()));
      });
    });
  }

  function applyMeta() {
    var page = document.body.getAttribute("data-page");
    if (!page) return;
    var title = P.t("meta." + page + ".title");
    document.title = title;
    var descKey = "meta." + page + ".desc";
    if ((P.i18n[P.lang] || {})[descKey]) {
      var d = P.t(descKey);
      var m = document.querySelector('meta[name="description"]');
      if (m) m.setAttribute("content", d);
      var ogd = document.querySelector('meta[property="og:description"]');
      if (ogd) ogd.setAttribute("content", d);
    }
    var ogt = document.querySelector('meta[property="og:title"]');
    if (ogt) ogt.setAttribute("content", title);
    var ogl = document.querySelector('meta[property="og:locale"]');
    if (ogl) ogl.setAttribute("content", P.lang === "sq" ? "sq_AL" : "en_US");
  }

  function updateLangButtons() {
    document.querySelectorAll("[data-lang]").forEach(function (btn) {
      var active = btn.getAttribute("data-lang") === P.lang;
      btn.setAttribute("aria-pressed", active ? "true" : "false");
      btn.classList.toggle("is-active", active);
    });
  }

  P.setLang = function (lang) {
    if (P.site.languages.indexOf(lang) < 0) return;
    P.lang = lang;
    store(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    applyStatic();
    applyMeta();
    updateLangButtons();
    listeners.forEach(function (fn) { fn(lang); });
    // Keep internal links free of ?lang once a choice is stored
  };

  /* ---------------- Contact details from config ---------------- */
  P.waLink = function (text) {
    var url = "https://wa.me/" + P.site.contact.whatsapp;
    return text ? url + "?text=" + encodeURIComponent(text) : url;
  };

  function applyContact() {
    var c = P.site.contact;
    document.querySelectorAll("[data-contact]").forEach(function (el) {
      var type = el.getAttribute("data-contact");
      var showText = !el.hasAttribute("data-contact-keep");
      if (type === "email") {
        if (el.tagName === "A") el.href = "mailto:" + c.email;
        if (showText) el.textContent = c.email;
      } else if (type === "phone") {
        if (el.tagName === "A") el.href = "tel:" + c.phoneLink;
        if (showText) el.textContent = c.phoneDisplay;
      } else if (type === "whatsapp") {
        if (el.tagName === "A") {
          el.href = P.waLink();
          el.target = "_blank";
          el.rel = "noopener";
        }
        if (showText && el.hasAttribute("data-contact-text")) el.textContent = c.phoneDisplay;
      } else if (P.site.social && P.site.social[type]) {
        var s = P.site.social[type];
        if (el.tagName === "A") {
          el.href = s.url;
          el.target = "_blank";
          el.rel = "noopener";
        }
        if (showText) el.textContent = s.handle;
      }
    });
  }

  function applyLocation() {
    document.querySelectorAll("[data-location]").forEach(function (el) {
      el.textContent = P.L(P.site.contact.location);
    });
  }

  /* ---------------- Navigation ---------------- */
  function initNav() {
    var page = document.body.getAttribute("data-page");
    document.querySelectorAll("[data-nav]").forEach(function (a) {
      if (a.getAttribute("data-nav") === page) a.setAttribute("aria-current", "page");
    });

    var header = document.querySelector(".site-header");
    var toggle = document.querySelector(".nav-toggle");
    var menu = document.getElementById("site-menu");
    var root = document.documentElement;

    function setOpen(open) {
      root.classList.toggle("menu-open", open);
      if (!toggle) return;
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("data-i18n-attr", "aria-label:" + (open ? "nav.close" : "nav.open"));
      toggle.setAttribute("aria-label", P.t(open ? "nav.close" : "nav.open"));
      if (open) {
        var first = menu && menu.querySelector("a");
        if (first) setTimeout(function () { first.focus(); }, 60);
      }
    }

    if (toggle && menu) {
      toggle.addEventListener("click", function () {
        setOpen(!root.classList.contains("menu-open"));
      });
      menu.addEventListener("click", function (e) {
        if (e.target.closest("a")) setOpen(false);
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && root.classList.contains("menu-open")) {
          setOpen(false);
          toggle.focus();
        }
      });
      window.matchMedia("(min-width: 960px)").addEventListener("change", function (mq) {
        if (mq.matches) setOpen(false);
      });
    }

    if (header) {
      var onScroll = function () {
        header.classList.toggle("is-scrolled", window.scrollY > 8);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    document.querySelectorAll("[data-lang]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        P.setLang(btn.getAttribute("data-lang"));
      });
    });

    document.querySelectorAll("[data-to-top]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: reduceMotion() ? "auto" : "smooth" });
      });
    });
  }

  /* ---------------- Reveal on scroll ---------------- */
  function reduceMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  P.observeReveal = function (root) {
    var items = (root || document).querySelectorAll(".reveal:not(.is-in)");
    if (!("IntersectionObserver" in window) || reduceMotion()) {
      items.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    if (!P._revealIO) {
      P._revealIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            P._revealIO.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    }
    items.forEach(function (el) { P._revealIO.observe(el); });
  };

  /* ---------------- Boot ---------------- */
  function boot() {
    document.documentElement.lang = P.lang;
    applyStatic();
    applyMeta();
    applyContact();
    initNav();
    updateLangButtons();
    P.onLang(applyLocation);

    // Page renderers (render.js) register themselves via P.renderers
    (P.renderers || []).forEach(function (r) { r(); });

    P.observeReveal();
    document.documentElement.classList.remove("i18n-pending");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
