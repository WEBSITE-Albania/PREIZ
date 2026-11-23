/* =========================================================================
   PREIZ Co. — FESTIVE CAMPAIGN (Christmas / New Year 2026–2027)
   -------------------------------------------------------------------------
   Temporary seasonal layer. Everything festive is kept in:
     js/festive.js       → campaign settings + flip countdown (this file)
     css/festive.css     → festive styling and decorations
     assets/festive/     → decorative SVGs
     catalog.js          → `festivePrice` on the four website packages
     translations.js     → keys starting with "fx."

   COUNTDOWN DEADLINE
     1 January 2027, 00:00:00 in Europe/Tirane.
     In January Albania is on CET (UTC+1), so this is 31 Dec 2026, 23:00:00 UTC.
     The deadline is an absolute moment, so every visitor sees the same
     countdown whatever their own time zone is.

   PREVIEW (for review only)
     Add ?fxdemo=15 to any page URL to make the countdown end in 15 seconds
     and preview what happens after the deadline.
   ========================================================================= */

window.PREIZ = window.PREIZ || {};

(function () {
  "use strict";

  var P = window.PREIZ;
  var DEADLINE = Date.UTC(2026, 11, 31, 23, 0, 0); // = 2027-01-01 00:00:00 Europe/Tirane

  try {
    var demo = parseInt(new URLSearchParams(location.search).get("fxdemo"), 10);
    if (demo > 0 && demo < 86400) DEADLINE = Date.now() + demo * 1000;
  } catch (e) { /* ignore */ }

  P.festive = {
    deadline: DEADLINE,
    /** December offer prices are shown until the deadline. */
    pricesActive: function () { return Date.now() < DEADLINE; },
    /** Price a website package is currently offered at. */
    priceOf: function (item) {
      return item && typeof item.festivePrice === "number" && P.festive.pricesActive()
        ? item.festivePrice : item.price;
    }
  };

  if (!P.festive.pricesActive()) document.documentElement.classList.add("fx-ended");

  var reduce = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };

  /* ---------------- Sticky countdown: full size at the top, compact when scrolled ----------------
     The bar is fixed to the top of the screen and the header sits right below it.
     A tiny marker at the top of the page tells (via IntersectionObserver, no
     scroll listener) whether the visitor has scrolled; CSS does the transition. */
  function initSticky() {
    var root = document.documentElement;
    if (!("IntersectionObserver" in window)) return; // stays in full size
    var marker = document.createElement("div");
    marker.className = "fx-scroll-marker";
    marker.setAttribute("aria-hidden", "true");
    document.body.insertBefore(marker, document.body.firstChild);
    new IntersectionObserver(function (entries) {
      root.classList.toggle("fx-compact", !entries[0].isIntersecting);
    }).observe(marker);
  }

  /* ---------------- Flip card ---------------- */
  function FlipCard(el) {
    el.innerHTML =
      '<span class="fx-half fx-top"><span></span></span>' +
      '<span class="fx-half fx-bot"><span></span></span>' +
      '<span class="fx-leaf fx-top"><span></span></span>' +
      '<span class="fx-leaf fx-bot"><span></span></span>';
    var s = el.querySelectorAll(":scope > span > span");
    this.el = el;
    this.top = s[0]; this.bot = s[1]; this.leafTop = s[2]; this.leafBot = s[3];
    this.value = null;
    this.timer = null;
  }
  FlipCard.prototype.set = function (text, animate) {
    if (text === this.value) return;
    var self = this, old = this.value;
    this.value = text;
    if (this.timer) { clearTimeout(this.timer); this.timer = null; }
    this.el.classList.remove("is-flipping");

    if (!animate || old == null || reduce.matches) {
      this.top.textContent = this.bot.textContent = this.leafTop.textContent = this.leafBot.textContent = text;
      return;
    }
    // Static halves: new value on top, old value below until the leaf lands.
    this.top.textContent = text;
    this.bot.textContent = old;
    // Leaves: the old top half falls down, then the new bottom half lands.
    this.leafTop.textContent = old;
    this.leafBot.textContent = text;
    void this.el.offsetWidth; // restart the animation
    this.el.classList.add("is-flipping");
    this.timer = setTimeout(function () {
      self.bot.textContent = self.leafTop.textContent = text;
      self.el.classList.remove("is-flipping");
      self.timer = null;
    }, 640);
  };

  /* ---------------- Countdown ---------------- */
  function pad(n) { return n < 10 ? "0" + n : String(n); }

  function initCountdown(bar) {
    var cards = {};
    bar.querySelectorAll("[data-fx-card]").forEach(function (el) {
      cards[el.getAttribute("data-fx-card")] = new FlipCard(el);
    });
    var sr = bar.querySelector("[data-fx-sr]");
    var timer = null, lastSr = "", first = true;

    function srText(d, h, m) {
      return P.t ? P.t("fx.bar.sr", { d: d, h: h, m: m }) : "";
    }

    function render() {
      var diff = Math.max(0, DEADLINE - Date.now());
      var total = Math.floor(diff / 1000);
      var d = Math.floor(total / 86400);
      var h = Math.floor((total % 86400) / 3600);
      var m = Math.floor((total % 3600) / 60);
      var s = total % 60;
      var animate = !first;
      if (cards.days) cards.days.set(pad(d), animate);
      if (cards.hours) cards.hours.set(pad(h), animate);
      if (cards.minutes) cards.minutes.set(pad(m), animate);
      if (cards.seconds) cards.seconds.set(pad(s), animate);
      first = false;

      if (sr && P.t) {
        var t = diff > 0 ? srText(d, h, m) : P.t("fx.bar.ended");
        if (t !== lastSr) { sr.textContent = t; lastSr = t; }
      }
      return diff;
    }

    function finish() {
      bar.classList.add("is-ended");
      document.documentElement.classList.add("fx-ended");
    }

    function tick() {
      timer = null;
      var diff = render();
      if (diff <= 0) { finish(); return; }
      // Wake up just after the next whole second so the display never drifts.
      timer = setTimeout(tick, (diff % 1000 || 1000) + 20);
    }

    if (DEADLINE - Date.now() <= 0) finish();
    tick();

    // Background tabs throttle timers: resync as soon as the page is visible again.
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) return;
      if (timer) clearTimeout(timer);
      tick();
    });

    // Keep the screen-reader text in the active language.
    if (P.onLang) P.onLang(function () { lastSr = ""; render(); });
  }

  function boot() {
    var bar = document.querySelector("[data-fx-countdown]");
    if (!bar) return;
    initSticky();
    initCountdown(bar);
  }

  // Run after main.js has set up the language system (it also boots on DOMContentLoaded).
  P.renderers = P.renderers || [];
  P.renderers.push(boot);
})();
