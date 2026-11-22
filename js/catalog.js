/* =========================================================================
   PREIZ Co. — PRODUCTS & SERVICES CATALOG
   -------------------------------------------------------------------------
   Everything shown under "Products & Services" (and its preview on the
   homepage) is generated from this file.

   STRUCTURE
     groups      → top-level families (e.g. Digital Solutions, Physical Products)
     categories  → a sellable line inside a group (e.g. Web Development)
     items       → the packages / products inside a category

   STATUS
     "active"   → shown to visitors and can be ordered
     "soon"     → shown as "Coming Soon": no items, prices or order buttons
     "hidden"   → prepared but not shown anywhere (use while building a category)

   Every visible text is bilingual: { sq: "...", en: "..." }.
   Prices are numbers in Albanian lek. Change a number and every page updates.
   ========================================================================= */

window.PREIZ = window.PREIZ || {};

PREIZ.catalog = {

  groups: [
    {
      id: "digital",
      status: "active",
      name: { sq: "Zgjidhje Dixhitale", en: "Digital Solutions" }
    },
    {
      id: "physical",
      status: "active",
      name: { sq: "Produkte Fizike", en: "Physical Products" }
    }
  ],

  categories: [
    {
      id: "web-development",
      group: "digital",
      status: "active",
      icon: "web",
      name: { sq: "Zhvillim Website-sh", en: "Website Development" },
      summary: {
        sq: "Prezenca online e ndërtuar me kujdes: nga një portofol i thjeshtë dixhital deri te një website i plotë për biznesin tuaj.",
        en: "A carefully built online presence: from a simple digital portfolio to a complete website for your business."
      },

      // Content areas compared side by side on the Basic / Premium cards
      // (labels in PREIZ.pageLabels below). These are content areas, not a
      // promise of separate HTML pages.
      compareAreas: ["home", "about", "products", "contact", "gallery", "reviews", "faq", "custom"],

      items: [
        {
          id: "digital-portfolio",
          name: { sq: "Portofol Dixhital", en: "Digital Portfolio" },
          price: 8000,
          maintenance: 3500,
          description: {
            sq: "Një prezantim dixhital i thjeshtë dhe i strukturuar në një faqe të vetme, për individë ose biznese që kanë nevojë për një profil të përmbledhur online.",
            en: "A simple, structured single-page digital presentation for individuals or businesses that need a concise online profile."
          },
          featuresLabel: { sq: "Mund të përfshijë", en: "May include" },
          features: [
            { sq: "Prezantim personal ose i biznesit", en: "Personal or business introduction" },
            { sq: "Informacione kryesore", en: "Relevant information" },
            { sq: "Fotografi", en: "Photographs" },
            { sq: "Të dhëna kontakti", en: "Contact details" }
          ]
        },
        {
          id: "digital-menu",
          name: { sq: "Menu Dixhitale", en: "Digital Menu" },
          price: 10000,
          maintenance: 4000,
          description: {
            sq: "Një menu online me kategori të organizuara produktesh, pa kufi në numrin e produkteve apo të kategorive.",
            en: "An online menu with organized product categories, with no limit on the number of products or categories."
          },
          featuresLabel: { sq: "Mund të përfshijë", en: "May include" },
          features: [
            { sq: "Kategori produktesh", en: "Product categories" },
            { sq: "Emrat e produkteve", en: "Product names" },
            { sq: "Përshkrime dhe përbërës", en: "Descriptions and ingredients" },
            { sq: "Fotografi", en: "Photographs" },
            { sq: "Çmime", en: "Prices" }
          ]
        },
        {
          id: "basic-website",
          name: { sq: "Basic Website", en: "Basic Website" },
          price: 18000,
          maintenance: 5000,
          description: {
            sq: "Një website për të prezantuar biznesin, produktet dhe të dhënat tuaja të kontaktit.",
            en: "A website that presents your business, your products and your contact details."
          },
          areas: ["home", "about", "products", "contact"]
        },
        {
          id: "premium-website",
          name: { sq: "Premium Website", en: "Premium Website" },
          price: 25000,
          maintenance: 6000,
          featured: true, // receives subtle visual emphasis
          description: {
            sq: "Gjithçka që përfshin Basic, plus seksione shtesë për një prezantim më të plotë të biznesit.",
            en: "Everything in Basic, plus additional sections for a more complete business presentation."
          },
          areas: ["home", "about", "products", "contact", "gallery", "reviews", "faq", "custom"]
        }
      ],

      // Additional information shown under the packages (render.js → extrasBlock)
      extras: {
        additionalLanguagePercent: 20,   // +20% of the development price per language
        domainFrom: 2000,                // domain registration from 2.000 lekë
        hostingIncluded: true,
        seoIncluded: true
      },

      // Annual maintenance: what is / isn't covered (keys in translations.js)
      maintenanceIncludes: ["maint.inc.texts", "maint.inc.prices", "maint.inc.items", "maint.inc.small"],
      maintenanceExclusions: ["maint.exc.redesign", "maint.exc.pages", "maint.exc.features", "maint.exc.domain"]
    },

    {
      id: "google-nfc-cards",
      group: "physical",
      status: "active",
      icon: "nfc",
      name: { sq: "Karta Google NFC", en: "Google NFC Cards" },
      summary: {
        sq: "Më shumë vlerësime në Google, pa asnjë mundim: klientët e prekin stendën ose kartën me telefon dhe hapin menjëherë faqen e vlerësimeve të biznesit tuaj.",
        en: "More Google reviews, with no effort: customers tap the stand or card with their phone and instantly open your business's review page."
      },

      // "products" → buttons say "product" instead of "package"
      unit: "products",

      // Bulk price applies to orders of MORE than 10 pieces (11 or more) of the same product
      bulkAbove: 10,

      items: [
        {
          id: "google-nfc-table-stand",
          name: { sq: "Stendë Tavoline NFC", en: "NFC Table Stand" },
          badge: { sq: "Stendë tavoline", en: "Table stand" },
          price: 1500,
          bulkPrice: 1200,
          priceSuffix: { sq: "/copë", en: "/piece" },
          visual: "stand",                       // product mockup drawn in render.js
          dims: { sq: "76 × 127.5 mm · bazë 50 mm", en: "76 × 127.5 mm · 50 mm base" },
          description: {
            sq: "Një stendë në formë L-je që qëndron vetë mbi tavolinë, banak ose recepsion. Klientët e shohin menjëherë dhe e prekin me telefon për t'ju vlerësuar në Google.",
            en: "An L-shaped stand that sits on its own on a table, counter or reception desk. Customers see it straight away and tap it with their phone to review you on Google."
          },
          features: [
            { sq: "Qëndron vetë — pa mbajtëse, pa ngjitës", en: "Stands on its own — no holder, no adhesive" },
            { sq: "Përmasa: 76 × 127.5 mm, bazë 50 mm", en: "Size: 76 × 127.5 mm, 50 mm base" },
            { sq: "E lidhur me faqen tuaj të vlerësimeve në Google", en: "Linked to your Google review page" },
            { sq: "Në të bardhë ose në të zezë", en: "In white or black" }
          ]
        },
        {
          id: "google-nfc-card",
          name: { sq: "Kartë Google NFC", en: "Google NFC Card" },
          badge: { sq: "Kartë portabël", en: "Portable card" },
          price: 1000,
          bulkPrice: 800,
          priceSuffix: { sq: "/copë", en: "/piece" },
          visual: "card",
          dims: { sq: "54 × 86 mm", en: "54 × 86 mm" },
          description: {
            sq: "Një kartë në madhësinë e një karte bankare, e lehtë për t'u mbajtur, për t'ua dhënë klientëve ose për ta vendosur kudo. Një prekje me telefon hap faqen tuaj të vlerësimeve në Google.",
            en: "A card the size of a bank card, easy to carry, hand to customers or place anywhere. One tap with a phone opens your Google review page."
          },
          features: [
            { sq: "Madhësia e një karte bankare: 54 × 86 mm", en: "Bank-card size: 54 × 86 mm" },
            { sq: "E lehtë dhe e lëvizshme", en: "Light and easy to carry" },
            { sq: "E lidhur me faqen tuaj të vlerësimeve në Google", en: "Linked to your Google review page" },
            { sq: "Në të bardhë ose në të zezë", en: "In white or black" }
          ]
        }
      ],

      // Two-product layout + "How it works" steps (render.js → showcase)
      showcase: {
        title: { sq: "Një prekje deri te vlerësimet tuaja në Google", en: "One tap to your Google reviews" },
        steps: [
          { title: { sq: "Prek", en: "Tap" }, body: { sq: "Afro telefonin te produkti NFC.", en: "Hold your phone near the NFC product." } },
          { title: { sq: "Hap", en: "Open" }, body: { sq: "Hapet faqja e vlerësimeve në Google.", en: "The Google review page opens." } },
          { title: { sq: "Vlerëso", en: "Review" }, body: { sq: "Klienti lë vlerësimin e tij.", en: "The customer leaves their review." } }
        ]
      }
    },

    {
      // Planned category — products, prices and specifications are not final yet.
      // When real products are ready: set status to "active" and add items.
      id: "qr-code-products",
      group: "physical",
      status: "soon",
      icon: "qr",
      name: { sq: "Produkte QR Code", en: "QR Code Products" },
      summary: {
        sq: "Po përgatisim produkte të reja me QR Code. Së shpejti do të zbuloni më shumë.",
        en: "We're preparing new QR Code products. You'll be able to discover more soon."
      },
      items: []
    }
  ],

  // Order of the categories in the homepage hero card
  heroOrder: ["web-development", "google-nfc-cards", "qr-code-products"]
};

/* Page names used in the "pages" lists above (bilingual labels). */
PREIZ.pageLabels = {
  home:     { sq: "Kryefaqja",            en: "Home Page" },
  about:    { sq: "Rreth Nesh",           en: "About Us" },
  products: { sq: "Produkte",             en: "Products" },
  gallery:  { sq: "Galeri",               en: "Gallery" },
  reviews:  { sq: "Vlerësime",            en: "Reviews" },
  faq:      { sq: "Pyetje të Shpeshta",   en: "FAQ" },
  contact:  { sq: "Kontakt",              en: "Contact" },
  custom:   { sq: "Deri në një faqe shtesë të personalizuar", en: "Up to one additional custom page" }
};
