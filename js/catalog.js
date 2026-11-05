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
      // Prepared for the future. Switch to "active" once products are ready.
      id: "physical",
      status: "hidden",
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
    }

    /* ---------------------------------------------------------------
       EXAMPLE — a future physical-products category.
       Copy, set status to "active" and fill in real items when ready.
       ---------------------------------------------------------------
    ,{
      id: "personalized-products",
      group: "physical",
      status: "hidden",
      index: "02",
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
