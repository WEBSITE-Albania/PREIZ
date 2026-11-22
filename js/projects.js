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
   featured   → true = can be shown in the homepage preview (the first two are shown)
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
      sq: "Website prezantues për Mik Mak, ku tradita e gatimeve korçare ndërthuret me një përvojë moderne online.",
      en: "A presentation website for Mik Mak, where the tradition of Korçë cooking meets a modern online experience."
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
      sq: "Menu dixhitale me kategori të organizuara, që e bën të thjeshtë eksplorimin e produkteve dhe çmimeve.",
      en: "A digital menu with organized categories that makes exploring products and prices simple."
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
      sq: "Website prezantues që pasqyron ambientet, shërbimet dhe ofertën e hotelit dhe restorantit.",
      en: "A presentation website showcasing the hotel and restaurant's spaces, services and offer."
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
      sq: "Menu dixhitale që prezanton pijet dhe çmimet në mënyrë të qartë, të organizuar dhe lehtësisht të aksesueshme.",
      en: "A digital menu that presents drinks and prices in a clear, organized and easily accessible way."
    }
  }
];
