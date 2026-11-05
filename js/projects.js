/* =========================================================================
   PREIZ Co. — PORTFOLIO PROJECTS
   -------------------------------------------------------------------------
   Add a new project by copying one block below.

   url        → the live website (opens in a new tab)
   embed      → true  = show a live preview of the site inside the card
                false = show the designed fallback preview (use this if a
                        website blocks embedding)
   image      → optional screenshot path, e.g. "assets/images/projects/x.jpg".
                Used instead of the live preview when provided.
   accent     → colour used by the fallback preview
   featured   → true = shown in the homepage preview
   ========================================================================= */

window.PREIZ = window.PREIZ || {};

PREIZ.projects = [
  {
    id: "mik-mak",
    name: "Mik Mak",
    url: "https://mikmakkorce.site/",
    embed: true,
    image: null,
    accent: "#B5542D",
    featured: true,
    type: { sq: "Website biznesi", en: "Business website" },
    description: {
      sq: "Website për një lokal me ushqime tradicionale shqiptare në Korçë: byrek, lakror, petanik dhe pispili.",
      en: "Website for a traditional Albanian food spot in Korçë: byrek, lakror, petanik and pispili."
    }
  },
  {
    id: "noor-menu",
    name: "NOOR Menu",
    url: "https://noor-menu.online/",
    embed: true,
    image: null,
    accent: "#1F3B35",
    featured: true,
    type: { sq: "Menu dixhitale", en: "Digital menu" },
    description: {
      sq: "Menu dixhitale e organizuar në kategori, e lehtë për t'u shfletuar nga telefoni.",
      en: "A digital menu organized into categories, easy to browse from a phone."
    }
  },
  {
    id: "illyria",
    name: "Illyria Hotel & Restaurant",
    url: "https://illyria-hotel-restaurant.site/",
    embed: true,
    image: null,
    accent: "#6B5532",
    featured: true,
    type: { sq: "Website hoteli & restoranti", en: "Hotel & restaurant website" },
    description: {
      sq: "Website për një hotel dhe restorant, që prezanton ambientet dhe ofertën e tij.",
      en: "Website for a hotel and restaurant, presenting its spaces and what it offers."
    }
  },
  {
    id: "chaplin",
    name: "Chaplin Bar",
    url: "https://www.bar-chaplin.site/",
    embed: true,
    image: null,
    accent: "#2A2A2A",
    featured: true,
    type: { sq: "Menu dixhitale", en: "Digital menu" },
    description: {
      sq: "Menu online për një bar, me pijet dhe ofertën të paraqitura qartë.",
      en: "An online menu for a bar, with drinks and offerings clearly presented."
    }
  }
];
