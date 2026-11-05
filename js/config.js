/* =========================================================================
   PREIZ Co. — SITE CONFIGURATION
   -------------------------------------------------------------------------
   This is the single place for company-wide details. Change a value here and
   it updates everywhere on the website (header, footer, contact page, links).
   ========================================================================= */

window.PREIZ = window.PREIZ || {};

PREIZ.site = {
  name: "PREIZ Co.",
  domain: "https://preizcompany.com",
  foundedYear: 2026,

  contact: {
    email: "preizcompany@gmail.com",
    // Shown to visitors
    phoneDisplay: "+355 69 882 2544",
    // Used for tel: links (no spaces)
    phoneLink: "+355698822544",
    // Used for WhatsApp click-to-chat (country code + number, digits only)
    whatsapp: "355698822544",
    location: { sq: "Shqipëri · Operojmë online", en: "Albania · Operating online" }
  },

  /* Social profiles — leave the list empty until real profiles exist.
     Example entry:
     { name: "Instagram", url: "https://instagram.com/preizco" }
     Profiles added here appear automatically in the footer. */
  social: [],

  defaultLanguage: "sq",
  languages: ["sq", "en"],

  currency: "€"
};
