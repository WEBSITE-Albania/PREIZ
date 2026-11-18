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
     "hidden"   → prepared but not shown anywhere (use while building a category)

   Every visible text is bilingual: { sq: "...", en: "..." }.
   Prices are numbers in euro. Change a number and every page updates.
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
      index: "01",
      name: { sq: "Zhvillim Website-sh", en: "Web Development" },
      summary: {
        sq: "Prezenca online e ndërtuar me kujdes: nga një profil i thjeshtë dixhital deri te një website i plotë për biznesin tuaj.",
        en: "A carefully built online presence: from a simple digital profile to a complete website for your business."
      },

      // Shown on cards as the starting price for the category
      showFromPrice: true,

      items: [
        {
          id: "digital-profile",
          name: { sq: "Profil Dixhital", en: "Digital Profile" },
          price: 80,
          maintenance: 35,
          description: {
            sq: "Një prezencë dixhitale e thjeshtë dhe elegante për të prezantuar online një biznes, një profesionist ose një shërbim.",
            en: "A simple and elegant digital presence designed to introduce a business, professional, or service online."
          },
          pages: null
        },
        {
          id: "digital-menu",
          name: { sq: "Menu Dixhitale", en: "Digital Menu" },
          price: 100,
          maintenance: 40,
          description: {
            sq: "Një menu online me kategori të organizuara, që u lejon klientëve të shfletojnë lehtësisht ushqimet dhe pijet në dispozicion.",
            en: "An online menu with organized categories, allowing customers to conveniently explore available food and beverage options."
          },
          pages: null
        },
        {
          id: "mini-website",
          name: { sq: "Mini Website", en: "Mini Website" },
          price: 150,
          maintenance: 45,
          description: {
            sq: "Një website kompakt me informacionin thelbësor të biznesit dhe të dhënat e kontaktit.",
            en: "A compact website providing essential business information and contact details."
          },
          pages: ["home", "about", "contact"]
        },
        {
          id: "basic-website",
          name: { sq: "Website Bazë", en: "Basic Website" },
          price: 220,
          maintenance: 55,
          description: {
            sq: "Një website i plotë për të prezantuar biznesin, ofertën dhe identitetin e tij vizual.",
            en: "A complete website designed to present a business, its offerings, and its visual identity."
          },
          pages: ["home", "about", "products", "gallery", "contact"]
        },
        {
          id: "premium-website",
          name: { sq: "Website Premium", en: "Premium Website" },
          price: 270,
          maintenance: 70,
          featured: true, // receives subtle visual emphasis
          description: {
            sq: "Një website më gjithëpërfshirës, për një përvojë dixhitale më të pasur dhe një prezantim më të detajuar të biznesit.",
            en: "A more comprehensive website designed to provide a richer digital experience and a more detailed business presentation."
          },
          pages: ["home", "about", "products", "gallery", "reviews", "faq", "contact"]
        }
      ],

      // Extra pricing rules shown under this category's packages
      extras: {
        additionalLanguagePercent: 20,   // +20% of the package price
        domainFrom: 20,                  // custom domain from ~€20
        seoIncludedWithDomain: true
      },

      // Annual maintenance exclusions (keys are translated in translations.js)
      maintenanceExclusions: [
        "excl.domainRenewal",
        "excl.redesign",
        "excl.features",
        "excl.pages",
        "excl.newDomain"
      ]
    },

    {
      id: "google-nfc-cards",
      group: "physical",
      status: "active",
      index: "02",
      name: { sq: "Karta Google NFC", en: "Google NFC Cards" },
      summary: {
        sq: "Më shumë vlerësime në Google, pa asnjë mundim: klientët e prekin stendën ose kartën me telefon dhe hapin menjëherë faqen e vlerësimeve të biznesit tuaj.",
        en: "More Google reviews, with no effort: customers tap the stand or card with their phone and instantly open your business's review page."
      },

      // "products" → counts and buttons say "product" instead of "package"
      unit: "products",
      showFromPrice: true,

      items: [
        {
          id: "google-nfc-table-stand",
          name: { sq: "Stendë Tavoline NFC Google", en: "Google NFC Table Stand" },
          badge: { sq: "Stendë tavoline", en: "Table stand" },
          price: 2000,
          currency: "ALL",                       // shown as "2,000 ALL"
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
          name: { sq: "Kartë NFC Google", en: "Google NFC Card" },
          badge: { sq: "Kartë portabël", en: "Portable card" },
          price: 1500,
          currency: "ALL",
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
        label: { sq: "Si funksionon", en: "How it works" },
        title: { sq: "Një prekje deri te vlerësimet tuaja në Google.", en: "One tap to your Google reviews." },
        steps: [
          {
            title: { sq: "Klienti prek stendën ose kartën", en: "The customer taps the stand or card" },
            body: {
              sq: "Mjafton ta afrojë telefonin te produkti — në banak, në tavolinë ose në recepsion. Funksionon me telefonat që kanë NFC, pa aplikacion.",
              en: "They simply hold their phone near it — at the counter, on the table or at reception. Works with NFC-enabled phones, no app needed."
            }
          },
          {
            title: { sq: "Hapet faqja e vlerësimeve", en: "Your review page opens" },
            body: {
              sq: "Faqja e vlerësimeve në Google e biznesit tuaj shfaqet menjëherë në telefon, pa e kërkuar.",
              en: "Your business's Google review page appears instantly on their phone, with no searching."
            }
          },
          {
            title: { sq: "Vlerësimi lihet në sekonda", en: "The review takes seconds" },
            body: {
              sq: "Klienti zgjedh yjet dhe shkruan komentin. Më pak hapa do të thotë më shumë vlerësime.",
              en: "The customer picks the stars and writes a comment. Fewer steps means more reviews."
            }
          }
        ]
      }
    }

    /* ---------------------------------------------------------------
       EXAMPLE — a future physical-products category.
       Copy, set status to "active" and fill in real items when ready.
       ---------------------------------------------------------------
    ,{
      id: "personalized-products",
      group: "physical",
      status: "hidden",
      index: "03",
      name: { sq: "Produkte të Personalizuara", en: "Personalized Products" },
      summary: { sq: "...", en: "..." },
      showFromPrice: true,
      items: [
        {
          id: "engraved-keychain",
          name: { sq: "...", en: "..." },
          price: 15,
          priceSuffix: { sq: "/copë", en: "/piece" }, // optional
          description: { sq: "...", en: "..." },
          features: [ { sq: "...", en: "..." } ]       // optional bullet list
        }
      ]
    }
    --------------------------------------------------------------- */
  ]
};

/* Page names used in the "pages" lists above (bilingual labels). */
PREIZ.pageLabels = {
  home:     { sq: "Kryefaqja",            en: "Home Page" },
  about:    { sq: "Rreth Nesh",           en: "About Us" },
  products: { sq: "Produkte",             en: "Products" },
  gallery:  { sq: "Galeri",               en: "Gallery" },
  reviews:  { sq: "Vlerësime",            en: "Reviews" },
  faq:      { sq: "Pyetje të Shpeshta",   en: "FAQ" },
  contact:  { sq: "Kontakt",              en: "Contact" }
};
