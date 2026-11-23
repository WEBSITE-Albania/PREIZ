/* =========================================================================
   PREIZ Co. — RENDERERS
   Builds the catalog, pricing and portfolio sections from catalog.js and
   projects.js. Any element with data-render="..." is filled automatically:

     hero-index        → homepage hero category list (blue card)
     category-index    → category links on the Products & Services page
     catalog           → full Products & Services page content
     projects          → portfolio cards (add data-featured to show only featured)
   ========================================================================= */

(function () {
  "use strict";

  var P = window.PREIZ;
  P.renderers = P.renderers || [];

  var ICON = {
    arrow: '<svg class="i" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11m-4.5-4.5L15 10l-4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    external: '<svg class="i" viewBox="0 0 20 20" aria-hidden="true"><path d="M7 4h9v9M16 4 5 15" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    check: '<svg class="i" viewBox="0 0 20 20" aria-hidden="true"><path d="m4.5 10.5 3.5 3.5 7.5-8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    minus: '<svg class="i" viewBox="0 0 20 20" aria-hidden="true"><path d="M5 10h10" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    tag: '<svg class="i" viewBox="0 0 20 20" aria-hidden="true"><path d="M3.5 10.2V4.5a1 1 0 0 1 1-1h5.7l6.3 6.3a1 1 0 0 1 0 1.4l-5.3 5.3a1 1 0 0 1-1.4 0z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><circle cx="7" cy="7" r="1.2" fill="currentColor"/></svg>',
    /* category icons (outline, 20px grid) */
    web: '<svg class="i" viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2.5" y="3.5" width="15" height="13" rx="1.5"/><path d="M2.5 7h15M5 5.25h.01M7 5.25h.01" stroke-linecap="round"/><path d="m8 10-1.8 1.8L8 13.6m4-3.6 1.8 1.8-1.8 1.8" stroke-linecap="round"/></svg>',
    qr: '<svg class="i" viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="3" y="3" width="5" height="5" rx=".8"/><rect x="12" y="3" width="5" height="5" rx=".8"/><rect x="3" y="12" width="5" height="5" rx=".8"/><path d="M12 12h2v2h-2zM15.5 15.5H17V17h-1.5zM12 16.5h1.5M16.5 12v1.5" stroke-linecap="round"/></svg>',
    nfc: '<svg class="i" viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5" width="11" height="12" rx="1.5"/><path d="M14.8 6.2a4.5 4.5 0 0 1 0 6.4M16.9 4.1a7.5 7.5 0 0 1 0 10.6"/><path d="M5.5 13.5h5"/></svg>',
    lock: '<svg class="i" viewBox="0 0 20 20" aria-hidden="true"><rect x="5" y="9" width="10" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M7.5 9V7a2.5 2.5 0 0 1 5 0v2" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>'
  };
  P.icon = ICON;

  /* ---------------- Data helpers ---------------- */
  function groupActive(cat) {
    var g = P.catalog.groups.find(function (x) { return x.id === cat.group; });
    return !!g && g.status === "active";
  }
  /* Categories shown to visitors: available ("active") and upcoming ("soon") */
  function visibleCategories() {
    return P.catalog.categories.filter(function (c) {
      return (c.status === "active" || c.status === "soon") && groupActive(c);
    });
  }
  function isSoon(cat) { return cat.status === "soon"; }
  function hasPrice(item) { return typeof item.price === "number"; }

  /* Item price as text, e.g. "1.500 lekë" (used in the prefilled WhatsApp message) */
  P.itemPrice = function (item, n) {
    return P.price(n == null ? item.price : n);
  };
  /* Price as HTML with the currency set smaller: 8.000 <small>lekë</small> */
  function priceMarkup(n) {
    return esc(P.num(n)) + ' <small class="cur">' + esc(P.t("common.currency")) + '</small>';
  }
  P.findItem = function (id) {
    var found = null;
    P.catalog.categories.forEach(function (c) {
      if (c.status !== "active") return;
      c.items.forEach(function (i) { if (i.id === id) found = { item: i, category: c }; });
    });
    return found;
  };

  var esc = function (s) { return P.esc(s); };
  function soonBadge() {
    return '<span class="soon">' + esc(P.t("common.soon")) + '</span>';
  }

  /* ---------------- Hero category card (home) ---------------- */
  function heroIndex(el) {
    var cats = visibleCategories();
    var order = P.catalog.heroOrder || [];
    cats.sort(function (a, b) {
      var ia = order.indexOf(a.id), ib = order.indexOf(b.id);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    });
    el.innerHTML = cats.map(function (c) {
      return '<li' + (isSoon(c) ? ' class="is-soon"' : "") + '><a href="services.html#' + esc(c.id) + '">' +
        '<span class="hx-name">' + esc(P.L(c.name)) + '</span>' +
        (isSoon(c) ? soonBadge() : "") +
        '<span class="hx-icon">' + (ICON[c.icon] || "") + '</span>' +
      '</a></li>';
    }).join("");
  }

  /* ---------------- Category index (services page) ---------------- */
  function categoryIndex(el) {
    el.innerHTML = visibleCategories().map(function (c) {
      return '<li><a href="#' + esc(c.id) + '"' + (isSoon(c) ? ' class="is-soon"' : "") + '>' +
        '<span class="ci-icon">' + (ICON[c.icon] || "") + '</span>' +
        '<span class="ci-name">' + esc(P.L(c.name)) + '</span>' +
        (isSoon(c) ? soonBadge() : "") +
      '</a></li>';
    }).join("");
  }

  /* ---------------- Product visuals (physical products) ----------------
     Graphic recreations of the real products, built with CSS 3D and SVG.
     All sizes are in millimetres (1mm = var(--mm)), so products keep their
     true proportions and their real size relative to each other.          */
  var uid = 0;
  function starPath(cx, cy, R) {
    var pts = [];
    for (var k = 0; k < 10; k++) {
      var r = k % 2 ? R * 0.45 : R;
      var a = -Math.PI / 2 + k * Math.PI / 5;
      pts.push((cx + r * Math.cos(a)).toFixed(2) + "," + (cy + r * Math.sin(a)).toFixed(2));
    }
    return "M" + pts.join("L") + "Z";
  }

  /* Printed face of the stand / card (w × h in mm). dark = black version. */
  function faceSVG(w, h, dark, roundBottom) {
    var id = "pvg" + (++uid);
    var bg = dark ? "#141415" : "#FBFBFA";
    var ink = dark ? "#F4F4F4" : "#1B1B1D";
    var text = dark ? "#E4E4E6" : "#44464E";
    var cx = w / 2, r = w * 0.058;
    var shape = roundBottom
      ? '<rect width="' + w + '" height="' + h + '" rx="' + r + '"/>'
      : '<path d="M0 ' + h + 'V' + r + 'Q0 0 ' + r + ' 0H' + (w - r) + 'Q' + w + ' 0 ' + w + ' ' + r + 'V' + h + 'Z"/>';

    // NFC symbol: two arcs + dot
    var dy = h * 0.2, sw = w * 0.052;
    function arc(R) {
      var x1 = cx - R * Math.SQRT1_2, y = dy - R * Math.SQRT1_2, x2 = cx + R * Math.SQRT1_2;
      return '<path d="M' + x1.toFixed(2) + ' ' + y.toFixed(2) + 'A' + R + ' ' + R + ' 0 0 1 ' + x2.toFixed(2) + ' ' + y.toFixed(2) + '"/>';
    }
    var nfc = '<g fill="none" stroke="' + ink + '" stroke-width="' + sw.toFixed(2) + '" stroke-linecap="round">' +
      arc(w * 0.205) + arc(w * 0.118) + '</g>' +
      '<circle cx="' + cx + '" cy="' + (dy - w * 0.01).toFixed(2) + '" r="' + (w * 0.036).toFixed(2) + '" fill="' + ink + '"/>';

    // Central review mark (neutral symbol in the logo position)
    var mw = w * 0.5, mh = w * 0.4, mx = cx - mw / 2, my = h * 0.43 - mh / 2;
    var mark = '<path fill="' + text + '" d="M' + (mx + mw * 0.16).toFixed(2) + ' ' + my.toFixed(2) +
      'H' + (mx + mw * 0.84).toFixed(2) + 'Q' + (mx + mw) + ' ' + my.toFixed(2) + ' ' + (mx + mw) + ' ' + (my + mh * 0.2).toFixed(2) +
      'V' + (my + mh * 0.8).toFixed(2) + 'Q' + (mx + mw) + ' ' + (my + mh).toFixed(2) + ' ' + (mx + mw * 0.84).toFixed(2) + ' ' + (my + mh).toFixed(2) +
      'H' + (mx + mw * 0.36).toFixed(2) + 'L' + (mx + mw * 0.16).toFixed(2) + ' ' + (my + mh * 1.22).toFixed(2) +
      'V' + (my + mh).toFixed(2) + 'Q' + mx.toFixed(2) + ' ' + (my + mh).toFixed(2) + ' ' + mx.toFixed(2) + ' ' + (my + mh * 0.8).toFixed(2) +
      'V' + (my + mh * 0.2).toFixed(2) + 'Q' + mx.toFixed(2) + ' ' + my.toFixed(2) + ' ' + (mx + mw * 0.16).toFixed(2) + ' ' + my.toFixed(2) + 'Z"/>' +
      '<path fill="' + bg + '" d="' + starPath(cx, my + mh * 0.53, mh * 0.34) + '"/>';

    // Five gold stars
    var st = "", sy = h * 0.665, sr = w * 0.05, gap = w * 0.108;
    for (var k = -2; k <= 2; k++) st += '<path d="' + starPath(cx + k * gap, sy, sr) + '"/>';
    var starsG = '<g fill="url(#' + id + 's)">' + st + '</g>';

    var fs = (w * 0.135).toFixed(2);
    var words = '<g fill="' + text + '" font-size="' + fs + '" font-weight="500" text-anchor="middle" letter-spacing="-0.2">' +
      '<text x="' + cx + '" y="' + (h * 0.815).toFixed(2) + '">Review us</text>' +
      '<text x="' + cx + '" y="' + (h * 0.915).toFixed(2) + '">on Google</text></g>';

    return '<svg class="pv-art" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" aria-hidden="true">' +
      '<defs>' +
        '<linearGradient id="' + id + 's" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD54A"/><stop offset="1" stop-color="#F0A81C"/></linearGradient>' +
        '<linearGradient id="' + id + 'g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="' + (dark ? 0.16 : 0.5) + '"/>' +
          '<stop offset="0.42" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="' + (dark ? 0.25 : 0.07) + '"/></linearGradient>' +
        '<clipPath id="' + id + 'c">' + shape + '</clipPath>' +
      '</defs>' +
      '<g clip-path="url(#' + id + 'c)">' +
        '<rect width="' + w + '" height="' + h + '" fill="' + bg + '"/>' +
        nfc + mark + starsG + words +
        '<rect width="' + w + '" height="' + h + '" fill="url(#' + id + 'g)"/>' +
      '</g></svg>';
  }

  function edgeLayers(n) {
    var s = "";
    for (var k = 1; k <= n; k++) s += '<span class="pv-ly" style="--k:' + k + '"></span>';
    return s;
  }

  function standObj(dark, x, z, ry) {
    return '<div class="pv-obj st' + (dark ? " is-dark" : "") + '" style="--x:' + x + ';--z:' + z + ';--ry:' + ry + '">' +
      '<div class="st-floor"></div>' +
      '<div class="st-base">' + edgeLayers(4) + '<div class="pv-face st-base-top"></div></div>' +
      '<div class="st-face">' + edgeLayers(4) + '<div class="pv-face">' + faceSVG(76, 127.5, dark, false) + '</div></div>' +
    '</div>';
  }
  function cardObj(dark, x, y, z, ry, rz) {
    return '<div class="pv-obj cd' + (dark ? " is-dark" : "") + '" style="--x:' + x + ';--y:' + y + ';--z:' + z + ';--ry:' + ry + ';--rz:' + rz + '">' +
      edgeLayers(2) + '<div class="pv-face">' + faceSVG(54, 86, dark, true) + '</div>' +
    '</div>';
  }

  function productVisual(item, kind, objects) {
    return '<div class="pv pv-' + kind + '" role="img" aria-label="' + esc(P.t("nfc.pv.alt." + kind)) + '">' +
      '<div class="pv-top" aria-hidden="true"><span>' + esc(P.L(item.badge)) + '</span><span>' + esc(P.L(item.dims)) + '</span></div>' +
      '<div class="pv-scene" aria-hidden="true"><div class="pv-world">' + objects + '</div></div>' +
      '<div class="pv-swatches" aria-hidden="true"><i></i><i class="is-dark"></i><span>' + esc(P.t("nfc.pv.colors")) + '</span></div>' +
    '</div>';
  }

  /* Real product photograph (shown whole, never cropped) */
  function productPhoto(item, kind) {
    return '<figure class="pv pv-photo pv-' + kind + '">' +
      '<img src="' + esc(encodeURI(item.photo)) + '" alt="' + esc(P.t("nfc.pv.alt." + kind)) + '" width="500" height="500" loading="lazy" decoding="async">' +
    '</figure>';
  }

  var PRODUCT_VISUALS = {
    stand: function (item) {
      if (item.photo) return productPhoto(item, "stand");
      return productVisual(item, "stand", standObj(true, 34, -30, 0) + standObj(false, -28, 12, 0));
    },
    card: function (item) {
      if (item.photo) return productPhoto(item, "card");
      return productVisual(item, "card",
        '<div class="cd-floor"></div>' +
        cardObj(true, 22, -30, -26, -6, 7) + cardObj(false, -18, -22, 14, 10, -6));
    }
  };

  /* ---------------- Package / product card ---------------- */
  function listItem(icon, text, off) {
    return '<li' + (off ? ' class="is-off"' : "") + '>' + icon + '<span>' + esc(text) + '</span>' +
      (off ? '<span class="sr-only"> ' + esc(P.t("common.notIncluded")) + '</span>' : "") + '</li>';
  }

  function packageCard(item, i, cat) {
    var includes = "";
    if (item.areas && cat.compareAreas) {
      // Basic / Premium: same rows on both cards → differences are visible at a glance
      includes = '<div class="pkg-inc"><p class="pkg-inc-label">' + esc(P.t("common.contentAreas")) + '</p><ul>' +
        cat.compareAreas.map(function (a) {
          var on = item.areas.indexOf(a) > -1;
          return listItem(on ? ICON.check : ICON.minus, P.L(P.pageLabels[a]), !on);
        }).join("") + "</ul></div>";
    } else if (item.features && item.features.length) {
      includes = '<div class="pkg-inc"><p class="pkg-inc-label">' +
        esc(item.featuresLabel ? P.L(item.featuresLabel) : P.t("common.includes")) + '</p><ul>' +
        item.features.map(function (f) { return listItem(ICON.check, P.L(f)); }).join("") + "</ul></div>";
    }

    var maint = item.maintenance != null
      ? '<div class="pkg-maint"><span>' + esc(P.t("common.maintenance")) + '</span><strong>' +
        esc(P.price(item.maintenance)) + '<small>' + esc(P.t("common.perYear")) + '</small></strong></div>'
      : "";

    // Unit suffix only where it adds meaning (e.g. "/copë"); website packages show the price alone
    var suffix = item.priceSuffix ? '<span class="note">' + esc(P.L(item.priceSuffix)) + '</span>' : "";
    // December offer: original price with a diagonal strike-through, offer price in festive red
    var offer = hasPrice(item) && P.festive && P.festive.priceOf(item) !== item.price;
    var priceHtml = offer
      ? '<span class="was"><del><span class="sr-only">' + esc(P.t("fx.price.regular")) + ' </span>' + priceMarkup(item.price) + '</del></span>' +
        '<span class="amount is-offer"><span class="sr-only">' + esc(P.t("fx.price.offer")) + ' </span>' + priceMarkup(P.festive.priceOf(item)) + '</span>' + suffix
      : hasPrice(item)
      ? '<span class="amount">' + priceMarkup(item.price) + '</span>' + suffix
      : '<span class="amount is-quote">' + esc(P.t("common.onRequest")) + '</span><span class="note">' + esc(P.t("common.onRequestNote")) + '</span>';
    var primary = item.featured || !!cat.showcase;
    var requestKey = cat.unit === "products" ? "common.requestProduct" : "common.request";

    var visual = item.visual && PRODUCT_VISUALS[item.visual] ? PRODUCT_VISUALS[item.visual](item) : "";

    return '<article class="pkg reveal' + (item.featured ? " is-featured" : "") + (visual ? " has-visual" : "") + '" id="' + esc(item.id) + '" style="--d:' + (i * 60) + 'ms">' +
      visual +
      '<h3 class="pkg-name">' + esc(P.L(item.name)) + '</h3>' +
      '<p class="pkg-desc">' + esc(P.L(item.description)) + '</p>' +
      includes +
      '<div class="pkg-foot">' +
        '<div class="pkg-price' + (offer ? " has-offer" : "") + '">' + priceHtml + '</div>' +
        maint +
        '<a class="btn ' + (primary ? "btn-primary" : "btn-outline") + ' btn-block" href="contact.html?package=' + encodeURIComponent(item.id) + '">' +
          '<span>' + esc(P.t(requestKey)) + '</span>' + ICON.arrow + '</a>' +
      '</div>' +
    '</article>';
  }

  /* ---------------- Additional information (language, domain, hosting, SEO) ---------------- */
  function extrasBlock(cat) {
    var x = cat.extras;
    if (!x) return "";
    var rows = [];
    function row(title, value, body, included) {
      rows.push('<li class="info' + (included ? " is-inc" : "") + '">' +
        '<p class="info-k"><span>' + esc(title) + '</span><strong>' + (included ? ICON.check : "") + esc(value) + '</strong></p>' +
        '<p class="info-d">' + esc(body) + '</p></li>');
    }
    if (x.additionalLanguagePercent) {
      row(P.t("pricing.lang.title"), P.t("pricing.lang.value", { p: x.additionalLanguagePercent }),
        P.t("pricing.lang.body", { p: x.additionalLanguagePercent }));
    }
    if (x.domainFrom) {
      row(P.t("pricing.domain.title"), P.t("pricing.domain.value", { price: P.price(x.domainFrom) }), P.t("pricing.domain.body"));
    }
    if (x.hostingIncluded) row(P.t("pricing.hosting.title"), P.t("common.included"), P.t("pricing.hosting.body"), true);
    if (x.seoIncluded) row(P.t("pricing.seo.title"), P.t("common.included"), P.t("pricing.seo.body"), true);

    return '<div class="extras" id="pricing">' +
      '<div class="sub-head reveal"><h3 class="h3">' + esc(P.t("pricing.title")) + '</h3></div>' +
      '<ul class="info-grid reveal">' + rows.join("") + '</ul></div>';
  }

  /* ---------------- Annual maintenance (included / not included) ---------------- */
  function maintenanceBlock(cat) {
    if (!cat.maintenanceIncludes) return "";
    function list(keys, icon, off) {
      return '<ul>' + keys.map(function (k) { return listItem(icon, P.t(k), off); }).join("") + '</ul>';
    }
    return '<div class="maint" id="maintenance">' +
      '<div class="sub-head reveal"><h3 class="h3">' + esc(P.t("maint.title")) + '</h3>' +
      '<p class="sub-lead">' + esc(P.t("maint.intro")) + '</p></div>' +
      '<div class="scope reveal">' +
        '<div class="scope-col"><h4>' + esc(P.t("maint.inc.title")) + '</h4>' + list(cat.maintenanceIncludes, ICON.check) + '</div>' +
        '<div class="scope-col is-out"><h4>' + esc(P.t("maint.exc.title")) + '</h4>' + list(cat.maintenanceExclusions || [], ICON.minus) + '</div>' +
      '</div>' +
      '<p class="scope-note reveal">' + esc(P.t("maint.note")) + '</p>' +
    '</div>';
  }

  /* ---------------- Showcase (products + bulk notice + how it works) ---------------- */
  var STEP_ICON = [
    // tap
    '<svg viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="4" width="14" height="24" rx="2.5"/><path d="M14 24.5h4"/><path d="M4.5 12a6 6 0 0 1 0 8M1.8 9.5a10 10 0 0 1 0 13"/></svg>',
    // open page
    '<svg viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="6" width="24" height="20" rx="2"/><path d="M4 11h24"/><path d="M13 19h9m-3.5-3.5L22 19l-3.5 3.5"/></svg>',
    // star
    '<svg viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="m16 4.5 3.4 7.2 7.8 1-5.7 5.4 1.4 7.8L16 22.1l-6.9 3.8 1.4-7.8-5.7-5.4 7.8-1z"/></svg>'
  ];
  function bulkBlock(cat) {
    var stand = cat.items.find(function (i) { return i.visual === "stand"; });
    var card = cat.items.find(function (i) { return i.visual === "card"; });
    if (!cat.bulkAbove || !stand || !card || !stand.bulkPrice || !card.bulkPrice) return "";
    return '<div class="bulk reveal">' +
      '<span class="bulk-icon">' + ICON.tag + '</span>' +
      '<div><h3 class="bulk-t">' + esc(P.t("nfc.bulk.title", { n: cat.bulkAbove })) + '</h3>' +
      '<p>' + esc(P.t("nfc.bulk.body", { n: cat.bulkAbove, stand: "\u0001", card: "\u0002" }))
        .replace("\u0001", '<span class="price-hl">' + esc(P.price(stand.bulkPrice)) + '</span>')
        .replace("\u0002", '<span class="price-hl">' + esc(P.price(card.bulkPrice)) + '</span>') + '</p></div>' +
    '</div>';
  }

  function showcaseBlock(cat) {
    var sc = cat.showcase;
    var top = '<div class="product-grid count-' + cat.items.length + '">' +
      cat.items.map(function (item, i) { return packageCard(item, i, cat); }).join("") +
    '</div>' + bulkBlock(cat);

    var steps = "";
    if (sc.steps && sc.steps.length) {
      steps = '<div class="steps-block" id="' + esc(cat.id) + '-how">' +
        '<div class="sub-head reveal"><h3 class="h3">' + esc(P.L(sc.title)) + '</h3></div>' +
        '<ol class="flow reveal">' + sc.steps.map(function (st, i) {
          return '<li class="flow-step">' +
            '<span class="flow-icon">' + (STEP_ICON[i] || "") + '</span>' +
            '<h4 class="flow-t">' + esc(P.L(st.title)) + '</h4>' +
            '<p class="flow-d">' + esc(P.L(st.body)) + '</p>' +
          '</li>';
        }).join("") + '</ol></div>';
    }
    return top + steps;
  }

  /* ---------------- Coming Soon category (no items, prices or order buttons) ---------------- */

  /* A QR code "being assembled": three finder squares, data modules that thin
     out towards the lower right, and one accent module. Static and decorative;
     the same pattern every time (seeded). */
  function qrMotif() {
    var n = 21, c = 6, seed = 11, out = "";
    function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    function inFinder(x, y) { return (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12); }
    function finder(x, y) {
      return '<rect class="qm-ring" x="' + (x * c + 0.75) + '" y="' + (y * c + 0.75) + '" width="' + (7 * c - 1.5) + '" height="' + (7 * c - 1.5) + '" rx="1.5"/>' +
        '<rect class="qm-on" x="' + ((x + 2) * c) + '" y="' + ((y + 2) * c) + '" width="' + (3 * c) + '" height="' + (3 * c) + '" rx="1"/>';
    }
    for (var y = 0; y < n; y++) {
      for (var x = 0; x < n; x++) {
        if (inFinder(x, y)) continue;
        var r = rnd(), fill = 0.62 - (x + y) / 52;   // denser top-left → sparse bottom-right
        var px = x * c + 0.8, py = y * c + 0.8, s = c - 1.6;
        if (r < fill) out += '<rect class="qm-on" x="' + px + '" y="' + py + '" width="' + s + '" height="' + s + '" rx=".6"/>';
        else if (r < fill + 0.16) out += '<rect class="qm-off" x="' + px + '" y="' + py + '" width="' + s + '" height="' + s + '" rx=".6"/>';
      }
    }
    out += '<rect class="qm-accent" x="' + (18 * c + 0.8) + '" y="' + (18 * c + 0.8) + '" width="' + (c - 1.6) + '" height="' + (c - 1.6) + '" rx=".6"/>';
    return '<svg class="qm" viewBox="0 0 ' + n * c + ' ' + n * c + '" aria-hidden="true">' +
      finder(0, 0) + finder(14, 0) + finder(0, 14) + out + '</svg>';
  }

  function soonCategory(c) {
    // "Coming Soon" → "Coming <em>Soon</em>" (last word in the accent colour)
    var words = P.t("common.soon").split(" ");
    var last = words.pop();
    var word = (words.length ? esc(words.join(" ")) + " " : "") + "<em>" + esc(last) + "</em>";

    return '<section class="category category-soon" id="' + esc(c.id) + '" aria-labelledby="cat-' + esc(c.id) + '">' +
      '<div class="container">' +
        '<header class="category-head reveal">' +
          '<h2 class="h2" id="cat-' + esc(c.id) + '">' + esc(P.L(c.name)) + '</h2>' +
        '</header>' +
        '<div class="soon-band reveal">' +
          '<div class="soon-motif">' + qrMotif() + '</div>' +
          '<div class="soon-copy">' +
            '<p class="soon-word">' + word + '</p>' +
            '<p class="soon-text">' + esc(P.L(c.summary)) + '</p>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</section>';
  }

  /* ---------------- December offer note (under the website packages) ---------------- */
  function offerNote(cat) {
    var any = P.festive && cat.items.some(function (i) { return hasPrice(i) && P.festive.priceOf(i) !== i.price; });
    return any ? '<p class="fx-offer-note reveal">' + esc(P.t("fx.offer.note")) + '</p>' : "";
  }

  /* ---------------- Full catalog (services page) ---------------- */
  function catalog(el) {
    el.innerHTML = visibleCategories().map(function (c) {
      if (isSoon(c)) return soonCategory(c);
      return '<section class="category" id="' + esc(c.id) + '" aria-labelledby="cat-' + esc(c.id) + '">' +
        '<div class="container">' +
          '<header class="category-head reveal">' +
            '<h2 class="h2" id="cat-' + esc(c.id) + '">' + esc(P.L(c.name)) + '</h2>' +
            '<p class="lead">' + esc(P.L(c.summary)) + '</p>' +
          '</header>' +
          (c.showcase ? showcaseBlock(c) :
          '<div class="pkg-grid count-' + c.items.length + '">' +
            c.items.map(function (item, i) { return packageCard(item, i, c); }).join("") +
          '</div>' + offerNote(c)) +
          extrasBlock(c) +
          maintenanceBlock(c) +
        '</div>' +
      '</section>';
    }).join("");
    P.observeReveal(el);
  }

  /* ---------------- Projects ---------------- */
  function hostOf(url) {
    try { return new URL(url).hostname.replace(/^www\./, ""); } catch (e) { return url; }
  }

  function projectCard(p, i) {
    var host = hostOf(p.url);
    var initials = p.name.split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0); }).join("");
    var media = p.image
      ? '<img class="bv-img" src="' + esc(p.image) + '" alt="' + esc(p.name) + '" loading="lazy" decoding="async" width="1280" height="800">'
      : "";

    return '<article class="project reveal" style="--d:' + (i * 70) + 'ms; --accent:' + esc(p.accent || "#0F164D") + '">' +
      '<div class="browser">' +
        '<div class="browser-bar" aria-hidden="true">' +
          '<span class="dots"><i></i><i></i><i></i></span>' +
          '<span class="url">' + ICON.lock + '<span>' + esc(host) + '</span></span>' +
          '<span class="bb-ext">' + ICON.external + '</span>' +
        '</div>' +
        '<div class="bv" data-embed="' + (p.embed && !p.image ? p.url : "") + '" data-title="' + esc(p.name) + '">' +
          '<div class="bv-fallback">' +
            '<span class="bv-mono">' + esc(initials) + '</span>' +
            '<span class="bv-name">' + esc(p.name) + '</span>' +
            '<span class="bv-host">' + esc(host) + '</span>' +
            '<span class="bv-status" data-status>' + esc(p.embed && !p.image ? P.t("work.loading") : P.t("work.unavailable")) + '</span>' +
          '</div>' + media +
        '</div>' +
      '</div>' +
      '<div class="project-meta">' +
        '<p class="project-type">' + esc(P.L(p.type)) + '</p>' +
        '<h3 class="project-name"><a class="stretched" href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(p.name) +
          '<span class="sr-only"> ' + esc(P.t("common.newTab")) + '</span></a></h3>' +
        '<p class="project-desc">' + esc(P.L(p.description)) + '</p>' +
        '<span class="project-link" aria-hidden="true">' + esc(P.t("common.visit")) + ICON.external + '</span>' +
      '</div>' +
    '</article>';
  }

  var FRAME_W = 1280, FRAME_H = 800;

  function mountPreviews(root) {
    var views = root.querySelectorAll(".bv[data-embed]:not([data-embed=''])");
    if (!views.length) return;

    var ro = "ResizeObserver" in window ? new ResizeObserver(function (entries) {
      entries.forEach(function (e) {
        e.target.style.setProperty("--s", (e.contentRect.width / FRAME_W).toFixed(4));
      });
    }) : null;

    function load(view) {
      if (view.dataset.loaded) return;
      view.dataset.loaded = "1";
      var iframe = document.createElement("iframe");
      iframe.src = view.dataset.embed;
      iframe.title = view.dataset.title;
      iframe.width = FRAME_W;
      iframe.height = FRAME_H;
      iframe.loading = "lazy";
      iframe.tabIndex = -1;
      iframe.setAttribute("aria-hidden", "true");
      iframe.setAttribute("scrolling", "no");
      iframe.setAttribute("sandbox", "allow-scripts allow-same-origin");
      iframe.setAttribute("referrerpolicy", "no-referrer-when-downgrade");

      var done = false;
      var timer = setTimeout(function () {
        if (done) return;
        done = true;
        view.classList.add("is-failed");
        iframe.remove();
        var s = view.querySelector("[data-status]");
        if (s) s.textContent = P.t("work.unavailable");
      }, 15000);

      iframe.addEventListener("load", function () {
        if (done) return;
        done = true;
        clearTimeout(timer);
        // give the embedded page a moment to paint
        setTimeout(function () { view.classList.add("is-live"); }, 350);
      });

      view.appendChild(iframe);
      if (ro) ro.observe(view);
      else view.style.setProperty("--s", (view.clientWidth / FRAME_W).toFixed(4));
    }

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { load(e.target); io.unobserve(e.target); }
        });
      }, { rootMargin: "300px 0px" });
      views.forEach(function (v) { io.observe(v); });
    } else {
      views.forEach(load);
    }
  }

  function projects(el) {
    var featuredOnly = el.hasAttribute("data-featured");
    var list = P.projects.filter(function (p) { return !featuredOnly || p.featured; });
    var limit = parseInt(el.getAttribute("data-limit"), 10);
    if (limit) list = list.slice(0, limit);

    // Re-rendering on language change keeps loaded iframes: update texts only.
    if (el.dataset.built) {
      el.querySelectorAll(".project").forEach(function (card, i) {
        var p = list[i];
        card.querySelector(".project-type").textContent = P.L(p.type);
        card.querySelector(".project-desc").textContent = P.L(p.description);
        card.querySelector(".project-link").innerHTML = esc(P.t("common.visit")) + ICON.external;
        card.querySelector(".stretched .sr-only").textContent = " " + P.t("common.newTab");
        var s = card.querySelector("[data-status]");
        if (s) {
          var v = card.querySelector(".bv");
          s.textContent = v.classList.contains("is-failed") || !v.dataset.embed ? P.t("work.unavailable") : P.t("work.loading");
        }
      });
      return;
    }
    el.innerHTML = list.map(projectCard).join("");
    el.dataset.built = "1";
    mountPreviews(el);
    P.observeReveal(el);
  }

  /* ---------------- Registration ---------------- */
  var MAP = {
    "hero-index": heroIndex,
    "category-index": categoryIndex,
    "catalog": catalog,
    "projects": projects
  };

  P.renderers.push(function () {
    document.querySelectorAll("[data-render]").forEach(function (el) {
      var fn = MAP[el.getAttribute("data-render")];
      if (!fn) return;
      P.onLang(function () {
        var again = el.dataset.rendered === "1";
        fn(el);
        el.dataset.rendered = "1";
        // On language switches, show content immediately (no re-animation)
        if (again) el.querySelectorAll(".reveal").forEach(function (r) { r.classList.add("is-in", "is-static"); });
      });
    });

    // Jump to a package/category anchor after dynamic content exists
    if (location.hash) {
      var target = document.getElementById(location.hash.slice(1));
      if (target) {
        requestAnimationFrame(function () { target.scrollIntoView(); });
      }
    }
  });
})();
