# PREIZ Co. — Official Website

Static, bilingual (Albanian / English) website for **PREIZ Co.**, built with plain HTML5, CSS3 and vanilla JavaScript. No frameworks, no build step, no backend. It runs directly on GitHub Pages.

Live domain: **https://preizcompany.com**

---

## 1. Project structure

```
/
├── index.html            Home
├── about.html            About Us
├── services.html         Products & Services (catalog, pricing, maintenance)
├── portfolio.html        Our Work
├── contact.html          Contact (WhatsApp message composer)
├── 404.html              "Page not found" page (served automatically by GitHub Pages)
│
├── assets/
│   ├── logo/             Logo files (made from the original JPEG)
│   │   ├── preiz-logo-source.jpeg    the full-size logo file you provided
│   │   ├── preiz-logo-original.jpg   web-sized copy of it (navy background)
│   │   ├── preiz-logo-white.png      full logo, white, transparent
│   │   ├── preiz-logo-navy.png       full logo, navy, transparent
│   │   ├── preiz-mark-*.png          the "P" symbol only
│   │   └── preiz-wordmark-*.png      the "PREIZ CO." lettering only
│   ├── icons/            Favicons and app icons
│   └── images/           og-image.jpg (preview image for social sharing)
│
├── css/
│   ├── style.css         Design system: colours, typography, all components
│   └── responsive.css    Tablet and mobile layouts
│
├── js/
│   ├── config.js         ★ Contact details, social links, languages
│   ├── catalog.js        ★ Products & services, prices, maintenance prices
│   ├── projects.js       ★ Portfolio projects
│   ├── translations.js   ★ All interface texts in Albanian and English
│   ├── render.js         Builds catalog / pricing / portfolio from the files above
│   ├── contact.js        WhatsApp message composer
│   └── main.js           Language system, navigation, animations
│
├── sitemap.xml · robots.txt · site.webmanifest · .nojekyll
└── README.md
```

Files marked ★ are the ones you edit for day-to-day changes. You should not need to touch HTML for prices, packages, projects or contact details.

---

## 2. How the content works

- **Static texts** (headings, paragraphs, buttons) are in `js/translations.js`, under `sq` (Albanian) and `en` (English). HTML elements point to them with `data-i18n="key"`.
- The Albanian text is also written directly inside the HTML so search engines and visitors without JavaScript see real content. When JavaScript runs, the text from `translations.js` is applied, so **`translations.js` is always the source of truth**.
- **Dynamic content** (packages, prices, portfolio cards, the homepage catalog list) is generated from `catalog.js` and `projects.js`.

---

## 3. Change prices

Open `js/catalog.js` and find the package:

```js
{
  id: "premium-website",
  name: { sq: "Website Premium", en: "Premium Website" },
  price: 270,          // ← development price (€)
  maintenance: 70,     // ← annual maintenance (€/year)
  ...
}
```

Change the numbers and save. Every page updates: the package cards, the homepage preview, the maintenance table, the "from €…" labels and the WhatsApp message prefilled when someone clicks "Request this package".

Additional pricing rules are in the same category, under `extras`:

```js
extras: {
  additionalLanguagePercent: 20,   // extra language = +20% of the package price
  domainFrom: 20,                  // custom domain from ~€20
  seoIncludedWithDomain: true
}
```

---

## 4. Add a new service (to an existing category)

In `js/catalog.js`, copy one package block inside `items: [...]` and edit it:

```js
{
  id: "online-store",                                 // unique, lowercase, no spaces
  name: { sq: "Dyqan Online", en: "Online Store" },
  price: 450,
  maintenance: 90,                                    // remove the line if not applicable
  description: { sq: "…", en: "…" },
  pages: ["home", "products", "contact"]              // optional; labels are in PREIZ.pageLabels
  // featured: true                                   // optional subtle emphasis
}
```

Need a new page label (e.g. `"blog"`)? Add it to `PREIZ.pageLabels` at the bottom of `catalog.js`.

## 5. Add a new category (e.g. "Website Maintenance" or "QR Products")

Add a new object to `categories: [...]` in `js/catalog.js`:

```js
{
  id: "qr-solutions",
  group: "digital",                 // which family it belongs to
  status: "active",                 // "hidden" while you prepare it
  index: "02",                      // display number
  name:    { sq: "Zgjidhje QR", en: "QR Solutions" },
  summary: { sq: "…", en: "…" },
  showFromPrice: true,
  items: [ /* packages or products, same format as above */ ]
}
```

The category automatically appears:
- in the homepage hero list and the homepage Products & Services preview,
- in the category links on the Products & Services page,
- as its own section with cards on the Products & Services page.

`extras` and `maintenanceExclusions` are optional — include them only if they apply to that category.

## 6. Add physical products

Physical products use the same system. A group called **Physical Products** already exists in `catalog.js` with `status: "hidden"`.

1. Set the group to active:
   ```js
   { id: "physical", status: "active", name: { sq: "Produkte Fizike", en: "Physical Products" } }
   ```
2. Add a category with `group: "physical"` (a commented example — *Personalized Products* — is ready to copy at the end of the categories list).
3. For products, use `features` instead of `pages`, and optionally `priceSuffix`:
   ```js
   {
     id: "engraved-keychain",
     name: { sq: "Varëse e gdhendur", en: "Engraved keychain" },
     price: 15,
     priceSuffix: { sq: "/copë", en: "/piece" },
     description: { sq: "…", en: "…" },
     features: [ { sq: "Gdhendje me emër", en: "Name engraving" } ]
   }
   ```

Nothing appears on the website while a group or category is `"hidden"`, so you can prepare products before launching them.

---

## 7. Add a portfolio project

Open `js/projects.js` and copy a block:

```js
{
  id: "new-project",
  name: "Project Name",
  url: "https://example.com/",
  embed: true,                  // live preview inside the card
  image: null,                  // or "assets/images/projects/example.jpg"
  accent: "#2A2A2A",            // colour of the fallback preview
  featured: true,               // show on the homepage (first 4 featured are shown)
  type:        { sq: "Website biznesi", en: "Business website" },
  description: { sq: "…", en: "…" }
}
```

**About live previews:** each card loads the real website in a scaled-down frame. Some websites forbid being shown inside other sites (X-Frame-Options / Content-Security-Policy). If a preview stays empty, set `embed: false` — the card then shows a designed fallback with the project name and address. You can also add a screenshot (1280×800 recommended, JPG under 200 KB) and set `image` to its path; a screenshot is used instead of the live preview. The "Visit website" link always works and opens the real site in a new tab.

All four current projects (Mik Mak, NOOR Menu, Illyria Hotel & Restaurant, Chaplin Bar) were checked and allow live previews.

---

## 8. Update translations

Open `js/translations.js`. Each text exists twice — once under `sq:` and once under `en:` — with the same key:

```js
"home.hero.lead": "PREIZ Co. krijon dhe ofron…",   // in sq
"home.hero.lead": "PREIZ Co. creates and delivers…", // in en
```

Edit both. Keep `{placeholders}` such as `{price}` or `{n}` unchanged — they are filled in automatically. Texts for packages and projects are in `catalog.js` and `projects.js` (each has `sq` and `en`).

Albanian is the default language. The visitor's choice is remembered in the browser (localStorage) across pages and visits. A link can also force a language: `https://preizcompany.com/?lang=en`.

> If you change Albanian text in `translations.js`, it is good practice to update the same sentence in the HTML file too, so search engines read the newest version. The website itself always shows the `translations.js` version.

---

## 9. Update contact information

Open `js/config.js`:

```js
contact: {
  email: "preizcompany@gmail.com",
  phoneDisplay: "+355 69 882 2544",   // how it is shown
  phoneLink: "+355698822544",         // used for tel: links
  whatsapp: "355698822544",           // used for WhatsApp links (digits only)
  location: { sq: "Shqipëri · Operojmë online", en: "Albania · Operating online" }
}
```

All phone, email and WhatsApp links on every page are updated from here.

**Social media:** add profiles to `social: []` in the same file, e.g.

```js
social: [ { name: "Instagram", url: "https://instagram.com/preizco" } ]
```

They appear in the footer automatically. Leave the list empty until a real profile exists.

### How the WhatsApp form works

The contact page form does not send anything by itself (there is no server). When the visitor presses **Send message**, the site checks the message is not empty, encodes it, and opens `https://wa.me/355698822544?text=…` — WhatsApp opens with the message already written, and the visitor only presses Send. Buttons on the Products & Services page link to `contact.html?package=<id>`, which pre-fills a sentence about the chosen package.

---

## 10. Deploy on GitHub Pages

1. Commit and push all files to the `main` branch of the repository (`WEBSITE-Albania/PREIZ`).
2. On GitHub: **Settings → Pages → Build and deployment** → Source: *Deploy from a branch* → Branch: `main`, folder `/ (root)` → **Save**.
3. Custom domain: in the same page, enter `preizcompany.com` under **Custom domain** and save (GitHub creates a `CNAME` file). At your domain registrar, add the DNS records GitHub lists in its documentation (A records for the apex domain and a `CNAME` for `www` pointing to `<user>.github.io`).
4. After DNS is verified, tick **Enforce HTTPS**.

All paths are relative, so the site also works at `https://<user>.github.io/PREIZ/` before the domain is connected. `.nojekyll` tells GitHub Pages to serve the files exactly as they are.

### Testing locally

Open `index.html` directly in a browser, or run a simple local server for a production-like test:

```bash
python3 -m http.server 8000     # then visit http://localhost:8000
```

---

## 11. Design notes

- **Colours** come from the logo: navy `#0F164D` with a warm off-white paper `#F5F4EF`. A single accent blue `#4352F0` is used sparingly. All colours are variables at the top of `css/style.css`.
- **Typography:** *Bricolage Grotesque* (headings), *Geist* (text), *Geist Mono* (labels, prices). Loaded from Google Fonts — the only external resource. If it is unavailable, system fonts are used.
- **Visual motifs** echo the logo's geometry: square markers, interlocking rectangles and quarter-circle arcs.
- Animations are subtle and are disabled for visitors who prefer reduced motion.
- **SEO:** each page has its own title, description, canonical URL and Open Graph tags; `sitemap.xml`, `robots.txt` and Organization structured data are included. SEO foundations help search engines understand the site but cannot guarantee rankings.
