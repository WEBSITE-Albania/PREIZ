/* =========================================================================
   PREIZ Co. — RENDERERS
   Builds the catalog, pricing and portfolio sections from catalog.js and
   projects.js. Any element with data-render="..." is filled automatically:

     hero-index        → homepage hero catalog list
     catalog-preview   → homepage Products & Services preview
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
    lock: '<svg class="i" viewBox="0 0 20 20" aria-hidden="true"><rect x="5" y="9" width="10" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M7.5 9V7a2.5 2.5 0 0 1 5 0v2" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>'
  };
  P.icon = ICON;

  /* ---------------- Data helpers ---------------- */
  function activeGroups() {
    return P.catalog.groups.filter(function (g) { return g.status === "active"; });
  }
  function activeCategories(groupId) {
    return P.catalog.categories.filter(function (c) {
      if (c.status !== "active") return false;
      var g = P.catalog.groups.find(function (x) { return x.id === c.group; });
      if (!g || g.status !== "active") return false;
      return groupId ? c.group === groupId : true;
    });
  }
  function groupOf(cat) {
    return P.catalog.groups.find(function (g) { return g.id === cat.group; });
  }
  function hasPrice(item) { return typeof item.price === "number"; }
  /* Item price as text: "€80", or "2,000 ALL" when the item has its own currency */
  function groupThousands(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
  P.itemPrice = function (item, n) {
    n = n == null ? item.price : n;
    if (item.currency) return groupThousands(n) + " " + item.currency;
    return P.price(n);
  };
  /* Same, as HTML with the currency code set smaller */
  function priceMarkup(item) {
    if (!item.currency) return esc(P.price(item.price));
    return esc(groupThousands(item.price)) + ' <small class="cur">' + esc(item.currency) + '</small>';
  }
  function cheapest(cat) {
    var priced = cat.items.filter(hasPrice);
    if (!priced.length) return null;
    return priced.reduce(function (a, b) { return b.price < a.price ? b : a; });
  }
  /* "5 packages", "1 package", "1 product"… (category.unit: "products") */
  function countLabel(cat) {
    var n = cat.items.length;
    var key = cat.unit === "products" ? (n === 1 ? "common.product.one" : "common.products")
                                      : (n === 1 ? "common.package.one" : "common.packages");
    return P.t(key, { n: n });
  }
  P.findItem = function (id) {
    var found = null;
    P.catalog.categories.forEach(function (c) {
      if (c.status !== "active") return;
      c.items.forEach(function (i) { if (i.id === id) found = { item: i, category: c }; });
    });
    return found;
  };

  function pad(n) { return n < 10 ? "0" + n : String(n); }
  var esc = function (s) { return P.esc(s); };

  /* ---------------- Hero index ---------------- */
  function heroIndex(el) {
    var cats = activeCategories();
    var html = cats.map(function (c) {
      return '<li><span class="hx-idx">' + esc(c.index) + '</span>' +
        '<span class="hx-name"><small>' + esc(P.L(groupOf(c).name)) + '</small>' + esc(P.L(c.name)) + '</span>' +
        '<span class="hx-status"><i class="dot" aria-hidden="true"></i>' + esc(P.t("common.available")) + '</span></li>';
    }).join("");
    html += '<li class="is-next"><span class="hx-idx">' + pad(cats.length + 1) + '</span>' +
      '<span class="hx-name">' + esc(P.t("home.panel.next")) + '</span>' +
      '<span class="hx-status">' + esc(P.t("home.panel.nextStatus")) + '</span></li>';
    el.innerHTML = html;
  }

  /* ---------------- Homepage catalog preview ---------------- */
  function catalogPreview(el) {
    el.innerHTML = activeCategories().map(function (c) {
      var rows = c.items.map(function (item, i) {
        var pages = item.pages ? P.t("common.pages", { n: item.pages.length }) : "";
        return '<li class="row reveal" style="--d:' + (i * 50) + 'ms">' +
          '<a href="services.html#' + esc(item.id) + '">' +
            '<span class="row-idx">' + pad(i + 1) + '</span>' +
            '<span class="row-main"><span class="row-name">' + esc(P.L(item.name)) +
              (item.featured ? ' <span class="flag">' + esc(P.t("common.featured")) + '</span>' : "") +
            '</span><span class="row-desc">' + esc(P.L(item.description)) + '</span></span>' +
            '<span class="row-meta">' + esc(pages) + '</span>' +
            (hasPrice(item)
              ? '<span class="row-price' + (item.currency ? " has-cur" : "") + '">' + priceMarkup(item) + '</span>'
              : '<span class="row-price is-quote">' + esc(P.t("common.onRequest")) + '</span>') +
            '<span class="row-arrow">' + ICON.arrow + '</span>' +
          '</a></li>';
      }).join("");

      return '<div class="cp">' +
        '<div class="cp-head reveal">' +
          '<span class="cp-idx">' + esc(c.index) + '</span>' +
          '<div><p class="cp-group">' + esc(P.L(groupOf(c).name)) + '</p>' +
          '<h3 class="cp-name">' + esc(P.L(c.name)) + '</h3></div>' +
          '<p class="cp-summary">' + esc(P.L(c.summary)) + '</p>' +
          '<p class="cp-from">' + esc(countLabel(c)) +
            (c.showFromPrice && cheapest(c) ? ' · ' + esc(P.t("common.from")) + ' <strong>' + esc(P.itemPrice(cheapest(c))) + '</strong>' : "") + '</p>' +
        '</div>' +
        '<ol class="rows">' + rows + '</ol>' +
      '</div>';
    }).join("");
    P.observeReveal(el);
  }

  /* ---------------- Category index (services page) ---------------- */
  function categoryIndex(el) {
    var links = activeCategories().map(function (c) {
      return '<li><a href="#' + esc(c.id) + '"><span class="ci-idx">' + esc(c.index) + '</span>' +
        '<span><small>' + esc(P.L(groupOf(c).name)) + '</small>' + esc(P.L(c.name)) + '</span>' +
        '<span class="ci-count">' + esc(countLabel(c)) + '</span></a></li>';
    }).join("");
    el.innerHTML = links + '<li class="ci-more">' + ICON.minus + '<span>' + esc(P.t("services.index.more")) + '</span></li>';
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

  var PRODUCT_VISUALS = {
    stand: function (item) {
      return productVisual(item, "stand", standObj(true, 34, -30, 0) + standObj(false, -28, 12, 0));
    },
    card: function (item) {
      return productVisual(item, "card",
        '<div class="cd-floor"></div>' +
        cardObj(true, 22, -30, -26, -6, 7) + cardObj(false, -18, -22, 14, 10, -6));
    }
  };

  /* ---------------- Package card ---------------- */
  function packageCard(item, i, cat) {
    var includes = "";
    if (item.pages && item.pages.length) {
      includes = '<div class="pkg-inc"><p class="pkg-inc-label">' + esc(P.t("common.includes")) +
        ' · ' + esc(P.t("common.pages", { n: item.pages.length })) + '</p><ul>' +
        item.pages.map(function (p) {
          return "<li>" + ICON.check + "<span>" + esc(P.L(P.pageLabels[p])) + "</span></li>";
        }).join("") + "</ul></div>";
    } else if (item.features && item.features.length) {
      includes = '<div class="pkg-inc"><p class="pkg-inc-label">' + esc(P.t("common.includes")) + '</p><ul>' +
        item.features.map(function (f) {
          return "<li>" + ICON.check + "<span>" + esc(P.L(f)) + "</span></li>";
        }).join("") + "</ul></div>";
    }

    var maint = item.maintenance != null
      ? '<div class="pkg-maint"><span>' + esc(P.t("common.maintenance")) + '</span><strong>' +
        esc(P.price(item.maintenance)) + '<small>' + esc(P.t("common.perYear")) + '</small></strong></div>'
      : "";

    var suffix = item.priceSuffix ? P.L(item.priceSuffix) : P.t("common.oneTime");
    var priceHtml = hasPrice(item)
      ? '<span class="amount">' + priceMarkup(item) + '</span><span class="note">' + esc(suffix) + '</span>'
      : '<span class="amount is-quote">' + esc(P.t("common.onRequest")) + '</span><span class="note">' + esc(P.t("common.onRequestNote")) + '</span>';
    var primary = item.featured || !!cat.showcase;
    var requestKey = cat.unit === "products" ? "common.requestProduct" : "common.request";

    var visual = item.visual && PRODUCT_VISUALS[item.visual] ? PRODUCT_VISUALS[item.visual](item) : "";

    return '<article class="pkg reveal' + (item.featured ? " is-featured" : "") + (visual ? " has-visual" : "") + '" id="' + esc(item.id) + '" style="--d:' + (i * 60) + 'ms">' +
      visual +
      '<div class="pkg-top"><span class="pkg-idx">' + esc(cat.index) + "." + pad(i + 1) + '</span>' +
        (item.featured ? '<span class="flag">' + esc(P.t("common.featured")) + '</span>' : "") + '</div>' +
      '<h3 class="pkg-name">' + esc(P.L(item.name)) + '</h3>' +
      '<p class="pkg-desc">' + esc(P.L(item.description)) + '</p>' +
      includes +
      '<div class="pkg-foot">' +
        '<div class="pkg-price">' + priceHtml + '</div>' +
        maint +
        '<a class="btn ' + (primary ? "btn-primary" : "btn-outline") + ' btn-block" href="contact.html?package=' + encodeURIComponent(item.id) + '">' +
          '<span>' + esc(P.t(requestKey)) + '</span>' + ICON.arrow + '</a>' +
      '</div>' +
    '</article>';
  }

  /* ---------------- Extras (language, domain, SEO) ---------------- */
  function extrasBlock(cat) {
    var x = cat.extras;
    if (!x) return "";
    var blocks = [];

    if (x.additionalLanguagePercent) {
      var ref = cat.items.find(function (i) { return i.id === "basic-website"; }) || cat.items[0];
      var extra = ref.price * x.additionalLanguagePercent / 100;
      blocks.push('<div class="xb reveal">' +
        '<p class="xb-k">' + esc(P.t("pricing.lang.title")) + '</p>' +
        '<p class="xb-v">' + esc(P.t("pricing.lang.value", { p: x.additionalLanguagePercent })) + '</p>' +
        '<p class="xb-d">' + esc(P.t("pricing.lang.body", { p: x.additionalLanguagePercent })) + '</p>' +
        '<p class="xb-ex">' + esc(P.t("pricing.lang.example", { name: P.L(ref.name), price: P.price(ref.price), extra: P.price(extra) })) + '</p>' +
      '</div>');
    }
    if (x.domainFrom) {
      blocks.push('<div class="xb reveal" style="--d:60ms">' +
        '<p class="xb-k">' + esc(P.t("pricing.domain.title")) + '</p>' +
        '<p class="xb-v">' + esc(P.t("pricing.domain.value", { price: P.price(x.domainFrom) })) + '</p>' +
        '<p class="xb-d">' + esc(P.t("pricing.domain.body", { price: P.price(x.domainFrom) })) + '</p>' +
      '</div>');
    }
    if (x.seoIncludedWithDomain) {
      blocks.push('<div class="xb xb-inc reveal" style="--d:120ms">' +
        '<p class="xb-k">' + esc(P.t("pricing.seo.title")) + '</p>' +
        '<p class="xb-v">' + ICON.check + esc(P.t("pricing.seo.value")) + '</p>' +
        '<p class="xb-d">' + esc(P.t("pricing.seo.body")) + '</p>' +
      '</div>');
    }

    return '<div class="extras" id="pricing">' +
      '<div class="sub-head reveal"><p class="label">' + esc(P.t("pricing.label")) + '</p>' +
      '<h3 class="h3">' + esc(P.t("pricing.title")) + '</h3></div>' +
      '<div class="xb-grid">' + blocks.join("") + '</div></div>';
  }

  /* ---------------- Maintenance ---------------- */
  function maintenanceBlock(cat) {
    var items = cat.items.filter(function (i) { return i.maintenance != null; });
    if (!items.length) return "";

    var rows = items.map(function (i) {
      return '<tr><th scope="row">' + esc(P.L(i.name)) + '</th>' +
        '<td>' + esc(P.price(i.price)) + '</td>' +
        '<td><strong>' + esc(P.price(i.maintenance)) + '</strong><span>' + esc(P.t("common.perYear")) + '</span></td></tr>';
    }).join("");

    var excl = (cat.maintenanceExclusions || []).map(function (k) {
      return "<li>" + ICON.minus + "<span>" + esc(P.t(k)) + "</span></li>";
    }).join("");

    return '<div class="maint" id="maintenance">' +
      '<div class="sub-head reveal"><p class="label">' + esc(P.t("maint.label")) + '</p>' +
      '<h3 class="h3">' + esc(P.t("maint.title")) + '</h3></div>' +

      '<div class="mx">' +
        '<div class="mx-card reveal"><span class="tag">' + esc(P.t("maint.dev.tag")) + '</span>' +
          '<h4>' + esc(P.t("maint.dev.title")) + '</h4><p>' + esc(P.t("maint.dev.body")) + '</p></div>' +
        '<div class="mx-plus" aria-hidden="true">+</div>' +
        '<div class="mx-card mx-card-alt reveal" style="--d:80ms"><span class="tag">' + esc(P.t("maint.care.tag")) + '</span>' +
          '<h4>' + esc(P.t("maint.care.title")) + '</h4><p>' + esc(P.t("maint.care.body")) + '</p></div>' +
      '</div>' +

      '<div class="mt-wrap">' +
        '<div class="mt reveal"><table>' +
          '<caption class="sr-only">' + esc(P.t("maint.label")) + '</caption>' +
          '<thead><tr><th scope="col">' + esc(P.t("maint.table.package")) + '</th><th scope="col">' + esc(P.t("maint.table.dev")) +
          '</th><th scope="col">' + esc(P.t("maint.table.annual")) + '</th></tr></thead>' +
          '<tbody>' + rows + '</tbody></table>' +
          '<p class="mt-note">' + esc(P.t("maint.note")) + '</p></div>' +
        '<div class="excl reveal" style="--d:80ms"><h4>' + esc(P.t("maint.excl.title")) + '</h4><ul>' + excl + '</ul>' +
          '<p class="excl-note">' + esc(P.t("maint.excl.note")) + '</p></div>' +
      '</div>' +
    '</div>';
  }

  /* ---------------- Showcase (product visual + how it works) ---------------- */
  var STEP_ICON = [
    // tap
    '<svg viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="4" width="14" height="24" rx="2.5"/><path d="M14 24.5h4"/><path d="M4.5 12a6 6 0 0 1 0 8M1.8 9.5a10 10 0 0 1 0 13"/></svg>',
    // open page
    '<svg viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="6" width="24" height="20" rx="2"/><path d="M4 11h24"/><path d="M13 19h9m-3.5-3.5L22 19l-3.5 3.5"/></svg>',
    // star
    '<svg viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="m16 4.5 3.4 7.2 7.8 1-5.7 5.4 1.4 7.8L16 22.1l-6.9 3.8 1.4-7.8-5.7-5.4 7.8-1z"/></svg>'
  ];
  function showcaseBlock(cat) {
    var sc = cat.showcase;
    var top = '<div class="product-grid count-' + cat.items.length + '">' +
      cat.items.map(function (item, i) { return packageCard(item, i, cat); }).join("") +
    '</div>';

    var steps = "";
    if (sc.steps && sc.steps.length) {
      steps = '<div class="steps-block" id="' + esc(cat.id) + '-how">' +
        '<div class="sub-head reveal"><p class="label">' + esc(P.L(sc.label)) + '</p>' +
        '<h3 class="h3">' + esc(P.L(sc.title)) + '</h3></div>' +
        '<ol class="xb-grid">' + sc.steps.map(function (st, i) {
          return '<li class="xb step reveal" style="--d:' + (i * 60) + 'ms">' +
            '<p class="xb-k step-k"><span>' + pad(i + 1) + '</span>' + (STEP_ICON[i] || "") + '</p>' +
            '<h4 class="step-t">' + esc(P.L(st.title)) + '</h4>' +
            '<p class="xb-d">' + esc(P.L(st.body)) + '</p>' +
          '</li>';
        }).join("") + '</ol></div>';
    }
    return top + steps;
  }

  /* ---------------- Full catalog (services page) ---------------- */
  function catalog(el) {
    el.innerHTML = activeGroups().map(function (g) {
      var cats = activeCategories(g.id);
      if (!cats.length) return "";
      return cats.map(function (c) {
        return '<section class="category" id="' + esc(c.id) + '" aria-labelledby="cat-' + esc(c.id) + '">' +
          '<div class="container">' +
            '<header class="category-head reveal">' +
              '<span class="cat-idx">' + esc(c.index) + '</span>' +
              '<div><p class="label">' + esc(P.L(g.name)) + '</p>' +
              '<h2 class="h2" id="cat-' + esc(c.id) + '">' + esc(P.L(c.name)) + '</h2></div>' +
              '<p class="lead">' + esc(P.L(c.summary)) + '</p>' +
            '</header>' +
            (c.showcase ? showcaseBlock(c) :
            '<div class="pkg-grid count-' + c.items.length + '">' +
              c.items.map(function (item, i) { return packageCard(item, i, c); }).join("") +
            '</div>') +
            extrasBlock(c) +
            maintenanceBlock(c) +
          '</div>' +
        '</section>';
      }).join("");
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
    "catalog-preview": catalogPreview,
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
