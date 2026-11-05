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
  function minPrice(cat) {
    return Math.min.apply(null, cat.items.map(function (i) { return i.price; }));
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
            '<span class="row-price">' + esc(P.price(item.price)) + '</span>' +
            '<span class="row-arrow">' + ICON.arrow + '</span>' +
          '</a></li>';
      }).join("");

      return '<div class="cp">' +
        '<div class="cp-head reveal">' +
          '<span class="cp-idx">' + esc(c.index) + '</span>' +
          '<div><p class="cp-group">' + esc(P.L(groupOf(c).name)) + '</p>' +
          '<h3 class="cp-name">' + esc(P.L(c.name)) + '</h3></div>' +
          '<p class="cp-summary">' + esc(P.L(c.summary)) + '</p>' +
          '<p class="cp-from">' + esc(P.t("common.packages", { n: c.items.length })) +
            (c.showFromPrice ? ' · ' + esc(P.t("common.from")) + ' <strong>' + esc(P.price(minPrice(c))) + '</strong>' : "") + '</p>' +
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
        '<span class="ci-count">' + esc(P.t("common.packages", { n: c.items.length })) + '</span></a></li>';
    }).join("");
    el.innerHTML = links + '<li class="ci-more">' + ICON.minus + '<span>' + esc(P.t("services.index.more")) + '</span></li>';
  }

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

    return '<article class="pkg reveal' + (item.featured ? " is-featured" : "") + '" id="' + esc(item.id) + '" style="--d:' + (i * 60) + 'ms">' +
      '<div class="pkg-top"><span class="pkg-idx">' + esc(cat.index) + "." + pad(i + 1) + '</span>' +
        (item.featured ? '<span class="flag">' + esc(P.t("common.featured")) + '</span>' : "") + '</div>' +
      '<h3 class="pkg-name">' + esc(P.L(item.name)) + '</h3>' +
      '<p class="pkg-desc">' + esc(P.L(item.description)) + '</p>' +
      includes +
      '<div class="pkg-foot">' +
        '<div class="pkg-price"><span class="amount">' + esc(P.price(item.price)) + '</span><span class="note">' + esc(suffix) + '</span></div>' +
        maint +
        '<a class="btn ' + (item.featured ? "btn-primary" : "btn-outline") + ' btn-block" href="contact.html?package=' + encodeURIComponent(item.id) + '">' +
          '<span>' + esc(P.t("common.request")) + '</span>' + ICON.arrow + '</a>' +
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
            '<div class="pkg-grid count-' + c.items.length + '">' +
              c.items.map(function (item, i) { return packageCard(item, i, c); }).join("") +
            '</div>' +
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
