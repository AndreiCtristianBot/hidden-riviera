import {
  getRecommendationReason,
  getRecommendationSignals,
  parseDurationMinutes,
  scorePlace,
} from "./scoring.js";

export const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap";

const I = {
  h1: "https://images.unsplash.com/photo-1578240749366-a1d3b6c39cb4?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=1200&h=900&fit=crop&q=80",
  h2: "https://plus.unsplash.com/premium_photo-1688544142274-0d479c4535eb?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=1200&h=900&fit=crop&q=80",
  mtn: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop&q=80",
  nice: "https://images.unsplash.com/photo-1491166617655-0723a0999cfc?w=600&h=350&fit=crop&q=80",

  gorges: "/assets/gorges-du-loup.png",
  gourdon: "/assets/Gourdon.png",
  aubergeDeCourmes: "/assets/auberge-de-courmes.png",
  baouDeSaintJeannet: "/assets/baou-de-saint-jeannet.png",
  plateauDeCaussols: "/assets/plateau-de-caussols.png",
  saintPaulDeVence: "/assets/Saint-Paul-de-Vence.png",
  sunsetColDeVance: "/assets/sunset-col-de-vence.png",
  giteInCoursegoules: "/assets/gite-in-coursegoules.png",
  laColombeDOr: "/assets/la-colombe-d-or.png",
  fondationMaeght: "/assets/fondation-maeght.png",
  tourrettesSurLoup: "/assets/Tourrettes-sur-Loup.png",
  grandeCorniche: "/assets/grande-corniche.png",
  ezeVillage: "/assets/eze-village.png",
  peillon: "/assets/Peillon.png",
  luceram: "/assets/Luceram.png",
  aubergeQuintrand: "/assets/auberge-quintrand.png",
  coarazeVillageDuSoleil: "/assets/coaraze-village-du-soleil.png",
  colDeTuriniSunsetDrive: "/assets/col-de-turini-sunset-drive.png",
  plageDeLaMala: "/assets/plage-de-la-mala.png",
  palomaBeach: "/assets/paloma-beach.png",
  sentierDuLittoral: "/assets/sentier-du-littoral.png",
  villefrancheSurMer: "/assets/Villefranche-sur-Mer.png",
  pointeDeLAiguilleSunset: "/assets/pointe-de-l-aiguille-sunset.png",
  coursSaleyaMarket: "/assets/cours-saleya-market.png",
  moulinAHuileDOpio: "/assets/moulin-a-huile-d-opio.png",
  laBastideSaintAntoine: "/assets/la-bastide-saint-antoine.png",
  antibesRampartsGoldenHour: "/assets/antibes-ramparts-golden-hour.png",
  galimardWorkshopGrasse: "/assets/galimard-workshop-grasse.png",
  domaineDeToasc: "/assets/domaine-de-toasc.png",
  viaFerrata: "/assets/via-ferrata-la-colmiane.png",
  clueDuRiolan: "/assets/canyoning-clue-du-riolan.png",
  refugeDeMadoneDeFenestre: "/assets/refuge-de-madone-de-fenestre.png",
  para: "/assets/paragliding-col-de-la-colle.png",
  lacDeSaintCassien: "/assets/lac-de-saint-cassien.png",
  museeMatisse: "/assets/musee-matisse.png",
  monastereDeCimiez: "/assets/monastere-de-cimiez.png",
  chezPipo: "/assets/chez-pipo.png",
  matisseChapelVence: "/assets/matisse-chapel-vence.png",
};

export const HERO_IMAGES = [I.h1, I.h2, I.mtn, I.colDeTuriniSunsetDrive];

export const VIBES = [
  { id: "mountain", emoji: "⛰️", label: "Mountain trails", img: I.mtn },
  { id: "village", emoji: "🏘️", label: "Hidden villages", img: I.ezeVillage },
  { id: "beach", emoji: "🏖️", label: "Secret beaches", img: I.plageDeLaMala },
  { id: "food", emoji: "🍷", label: "Gastronomy", img: I.moulinAHuileDOpio },
  { id: "adventure", emoji: "🚴", label: "Adventure", img: I.gorges },
  { id: "culture", emoji: "🎨", label: "Art & culture", img: I.antibesRampartsGoldenHour },
];

export const DURS = [
  { id: "half", label: "A few hours", sub: "Quick escape", icon: "⚡" },
  { id: "full", label: "Full day", sub: "Sunrise to sunset", icon: "☀️" },
  { id: "weekend", label: "Weekend", sub: "2 days of discovery", icon: "🌙" },
];

export const COMPS = [
  { id: "solo", label: "Solo explorer", icon: "🧭" },
  { id: "couple", label: "Romantic escape", icon: "💕" },
  { id: "friends", label: "Friends trip", icon: "🎉" },
  { id: "family", label: "Family adventure", icon: "👨‍👩‍👧" },
];

export const CRW = {
  none: { bg: "rgba(46,125,50,.08)", c: "#2e7d32", l: "No crowds" },
  "very low": { bg: "rgba(46,125,50,.08)", c: "#2e7d32", l: "Hidden gem 💎" },
  low: { bg: "rgba(56,142,60,.08)", c: "#388e3c", l: "Quiet spot" },
  medium: { bg: "rgba(245,127,23,.08)", c: "#f57f17", l: "Some visitors" },
};

export const TI = {
  transit: "🚗",
  nature: "🌿",
  village: "🏘️",
  food: "🍽️",
  beach: "🏖️",
  culture: "🎨",
  adventure: "⚡",
};

const PLACES = [
  {
    id: "depart-nice",
    name: "Départ from Nice",
    desc: "Head out from Nice and leave the crowded hotspots behind.",
    dur: "45min drive",
    crowd: "none",
    type: "transit",
    img: I.nice,
    tags: ["mountain", "village", "beach", "food", "adventure", "culture"],
    companions: ["solo", "couple", "friends", "family"],
    durationFit: ["half", "full", "weekend"],
    score: 10,
    active: true,
    imageStorage: "remote",
    imageOrigin: "photograph",
  },

  {
    id: "gorges-du-loup",
    name: "Gorges du Loup",
    desc: "Dramatic canyon with waterfalls between limestone cliffs.",
    dur: "1h visit",
    crowd: "low",
    type: "nature",
    img: I.gorges,
    tags: ["mountain", "adventure"],
    companions: ["solo", "couple", "friends", "family"],
    durationFit: ["half", "full", "weekend"],
    score: 88,
    active: true,
    imageStorage: "local",
    imageOrigin: "ai_generated",
  },
  {
    id: "gourdon",
    name: "Gourdon",
    desc: "Eagle-nest village at 760m with sweeping Riviera views.",
    dur: "1h visit",
    crowd: "low",
    type: "village",
    img: I.gourdon,
    tags: ["mountain", "village", "culture"],
    companions: ["solo", "couple", "friends", "family"],
    durationFit: ["half", "full", "weekend"],
    score: 84,
    active: true,
    imageStorage: "local",
    imageOrigin: "ai_generated",
  },
  {
    id: "auberge-de-courmes",
    name: "Auberge de Courmes",
    desc: "Stone farmhouse dining with local produce and a hidden-backcountry feel.",
    dur: "1.5h",
    crowd: "very low",
    type: "food",
    img: I.aubergeDeCourmes,
    tags: ["food", "mountain", "village"],
    companions: ["solo", "couple", "friends"],
    durationFit: ["full", "weekend"],
    score: 90,
    active: true,
    imageStorage: "local",
    imageOrigin: "ai_generated",
  },
  {
    id: "plateau-de-caussols",
    name: "Plateau de Caussols",
    desc: "Lunar highland landscapes, shepherd huts and wide-open silence.",
    dur: "1.5h hike",
    crowd: "very low",
    type: "nature",
    img: I.plateauDeCaussols,
    tags: ["mountain", "nature"],
    companions: ["solo", "couple", "friends"],
    durationFit: ["full", "weekend"],
    score: 92,
    active: true,
    imageStorage: "local",
    imageOrigin: "ai_generated",
  },
  {
    id: "baou-de-saint-jeannet",
    name: "Baou de Saint-Jeannet",
    desc: "A dramatic cliff with one of the best free views on the Riviera.",
    dur: "2h hike",
    crowd: "low",
    type: "nature",
    img: I.baouDeSaintJeannet,
    tags: ["mountain", "adventure"],
    companions: ["solo", "couple", "friends"],
    durationFit: ["full", "weekend"],
    score: 89,
    active: true,
    imageStorage: "local",
    imageOrigin: "ai_generated",
  },
  {
    id: "sunset-col-de-vence",
    name: "Sunset — Col de Vence",
    desc: "The coast turns amber from above. One of the best quiet sunset spots.",
    dur: "30min",
    crowd: "very low",
    type: "nature",
    img: I.sunsetColDeVance,
    tags: ["mountain", "village", "culture"],
    companions: ["solo", "couple", "friends", "family"],
    durationFit: ["full", "weekend"],
    score: 95,
    active: true,
    imageStorage: "local",
    imageOrigin: "ai_generated",
  },
  {
    id: "gite-coursegoules",
    name: "Gîte in Coursegoules",
    desc: "Mountain guesthouse for a deeply quiet overnight escape.",
    dur: "Evening",
    crowd: "very low",
    type: "village",
    img: I.giteInCoursegoules,
    tags: ["mountain", "village"],
    companions: ["solo", "couple", "friends"],
    durationFit: ["weekend"],
    score: 80,
    active: true,
    imageStorage: "local",
    imageOrigin: "ai_generated",
  },

  {
    id: "grande-corniche",
    name: "Grande Corniche",
    desc: "Napoleon’s road east with panoramic drama before the villages begin.",
    dur: "30min",
    crowd: "none",
    type: "transit",
    img: I.grandeCorniche,
    tags: ["village", "culture"],
    companions: ["solo", "couple", "friends", "family"],
    durationFit: ["half", "full", "weekend"],
    score: 50,
    active: true,
    imageStorage: "local",
    imageOrigin: "ai_generated",
  },
  {
    id: "eze-village",
    name: "Èze Village",
    desc: "A dramatic hilltop village above the sea with timeless stone lanes.",
    dur: "1.5h",
    crowd: "medium",
    type: "village",
    img: I.ezeVillage,
    tags: ["village", "culture"],
    companions: ["solo", "couple", "friends", "family"],
    durationFit: ["half", "full", "weekend"],
    score: 78,
    active: true,
    imageStorage: "local",
    imageOrigin: "ai_generated",
  },
  {
    id: "peillon",
    name: "Peillon",
    desc: "One of the Riviera’s quietest villages — no noise, no rush, just stone and silence.",
    dur: "1h",
    crowd: "very low",
    type: "village",
    img: I.peillon,
    tags: ["village", "culture"],
    companions: ["solo", "couple", "friends"],
    durationFit: ["half", "full", "weekend"],
    score: 91,
    active: true,
    imageStorage: "local",
    imageOrigin: "ai_generated",
  },
  {
    id: "luceram",
    name: "Lucéram",
    desc: "A medieval labyrinth village that feels like a secret outside the holiday season.",
    dur: "1h",
    crowd: "very low",
    type: "village",
    img: I.luceram,
    tags: ["village", "culture"],
    companions: ["solo", "couple", "friends", "family"],
    durationFit: ["full", "weekend"],
    score: 87,
    active: true,
    imageStorage: "local",
    imageOrigin: "ai_generated",
  },
  {
    id: "auberge-quintrand",
    name: "Auberge Quintrand",
    desc: "Mountain cooking, wild boar stew and the feeling of a place locals still keep to themselves.",
    dur: "1.5h",
    crowd: "low",
    type: "food",
    img: I.aubergeQuintrand,
    tags: ["food", "village", "mountain"],
    companions: ["solo", "couple", "friends", "family"],
    durationFit: ["full", "weekend"],
    score: 86,
    active: true,
    imageStorage: "local",
    imageOrigin: "ai_generated",
  },
  {
    id: "coaraze",
    name: "Coaraze — Village du Soleil",
    desc: "A peaceful village filled with artistic sundials and warm southern light.",
    dur: "1h",
    crowd: "very low",
    type: "culture",
    img: I.coarazeVillageDuSoleil,
    tags: ["village", "culture"],
    companions: ["solo", "couple", "friends", "family"],
    durationFit: ["full", "weekend"],
    score: 88,
    active: true,
    imageStorage: "local",
    imageOrigin: "ai_generated",
  },
  {
    id: "col-de-turini",
    name: "Col de Turini sunset drive",
    desc: "Legendary mountain road with rally energy and cinematic golden-hour views.",
    dur: "1h drive",
    crowd: "none",
    type: "nature",
    img: I.colDeTuriniSunsetDrive,
    tags: ["mountain", "village", "adventure"],
    companions: ["solo", "couple", "friends"],
    durationFit: ["full", "weekend"],
    score: 90,
    active: true,
    imageStorage: "local",
    imageOrigin: "ai_generated",
  },

  {
    id: "plage-de-la-mala",
    name: "Plage de la Mala",
    desc: "A hidden beach below cliffs with striking turquoise water.",
    dur: "2h",
    crowd: "low",
    type: "beach",
    img: I.plageDeLaMala,
    tags: ["beach"],
    companions: ["solo", "couple", "friends"],
    durationFit: ["half", "full", "weekend"],
    score: 89,
    active: true,
    imageStorage: "local",
    imageOrigin: "ai_generated",
  },
  {
    id: "paloma-beach",
    name: "Paloma Beach",
    desc: "Sea, food and elegant scenery in Saint-Jean-Cap-Ferrat.",
    dur: "1.5h",
    crowd: "medium",
    type: "food",
    img: I.palomaBeach,
    tags: ["beach", "food"],
    companions: ["couple", "friends", "family"],
    durationFit: ["half", "full", "weekend"],
    score: 80,
    active: true,
    imageStorage: "local",
    imageOrigin: "ai_generated",
  },
  {
    id: "sentier-du-littoral",
    name: "Sentier du Littoral",
    desc: "Coastal path with swimming coves and blue-water viewpoints.",
    dur: "1.5h walk",
    crowd: "low",
    type: "nature",
    img: I.sentierDuLittoral,
    tags: ["beach", "adventure"],
    companions: ["solo", "couple", "friends"],
    durationFit: ["full", "weekend"],
    score: 87,
    active: true,
    imageStorage: "local",
    imageOrigin: "ai_generated",
  },
  {
    id: "villefranche",
    name: "Villefranche-sur-Mer",
    desc: "A postcard harbor with color, depth and Riviera light.",
    dur: "1.5h",
    crowd: "medium",
    type: "village",
    img: I.villefrancheSurMer,
    tags: ["beach", "village", "culture"],
    companions: ["solo", "couple", "friends", "family"],
    durationFit: ["half", "full", "weekend"],
    score: 79,
    active: true,
    imageStorage: "local",
    imageOrigin: "ai_generated",
  },
  {
    id: "pointe-de-laiguille",
    name: "Pointe de l'Aiguille sunset",
    desc: "Red volcanic rocks, open sea and a memorable last swim at sunset.",
    dur: "1h",
    crowd: "very low",
    type: "beach",
    img: I.pointeDeLAiguilleSunset,
    tags: ["beach", "nature"],
    companions: ["solo", "couple", "friends"],
    durationFit: ["full", "weekend"],
    score: 93,
    active: true,
    imageStorage: "local",
    imageOrigin: "ai_generated",
  },

  {
    id: "cours-saleya",
    name: "Cours Saleya Market",
    desc: "The edible soul of Nice — socca, olives and pure atmosphere.",
    dur: "1.5h",
    crowd: "medium",
    type: "food",
    img: I.coursSaleyaMarket,
    tags: ["food", "culture"],
    companions: ["solo", "couple", "friends", "family"],
    durationFit: ["half", "full", "weekend"],
    score: 82,
    active: true,
    imageStorage: "local",
    imageOrigin: "ai_generated",
  },
  {
    id: "moulin-opio",
    name: "Moulin à Huile d'Opio",
    desc: "A historic olive mill where the product and the story both feel local.",
    dur: "1h",
    crowd: "very low",
    type: "food",
    img: I.moulinAHuileDOpio,
    tags: ["food", "culture", "village"],
    companions: ["solo", "couple", "friends", "family"],
    durationFit: ["half", "full", "weekend"],
    score: 90,
    active: true,
    imageStorage: "local",
    imageOrigin: "ai_generated",
  },
  {
    id: "la-bastide-saint-antoine",
    name: "La Bastide Saint-Antoine",
    desc: "A refined Grasse dining stop where garden-driven cuisine leads.",
    dur: "2h",
    crowd: "low",
    type: "food",
    img: I.laBastideSaintAntoine,
    tags: ["food"],
    companions: ["couple", "friends"],
    durationFit: ["full", "weekend"],
    score: 88,
    active: true,
    imageStorage: "local",
    imageOrigin: "ai_generated",
  },
  {
    id: "galimard-grasse",
    name: "Galimard Workshop, Grasse",
    desc: "A hands-on perfume workshop for a more personal cultural stop.",
    dur: "1.5h",
    crowd: "low",
    type: "culture",
    img: I.galimardWorkshopGrasse,
    tags: ["food", "culture"],
    companions: ["solo", "couple", "friends", "family"],
    durationFit: ["full", "weekend"],
    score: 85,
    active: true,
    imageStorage: "local",
    imageOrigin: "ai_generated",
  },
  {
    id: "domaine-de-toasc",
    name: "Domaine de Toasc",
    desc: "A vineyard above Nice with rare Bellet wine and a slow golden-hour pace.",
    dur: "1.5h",
    crowd: "very low",
    type: "food",
    img: I.domaineDeToasc,
    tags: ["food", "culture"],
    companions: ["solo", "couple", "friends"],
    durationFit: ["full", "weekend"],
    score: 91,
    active: true,
    imageStorage: "local",
    imageOrigin: "ai_generated",
  },

  {
    id: "via-ferrata",
    name: "Via Ferrata — La Colmiane",
    desc: "Cliffside ladders, bridges and alpine adrenaline.",
    dur: "2.5h",
    crowd: "very low",
    type: "adventure",
    img: I.viaFerrata,
    tags: ["adventure", "mountain"],
    companions: ["solo", "friends", "couple"],
    durationFit: ["full", "weekend"],
    score: 94,
    active: true,
    imageStorage: "local",
    imageOrigin: "ai_generated",
  },
  {
    id: "clue-du-riolan",
    name: "Canyoning — Clue du Riolan",
    desc: "Natural pools, rappels and cold-water thrills.",
    dur: "2.5h",
    crowd: "very low",
    type: "adventure",
    img: I.clueDuRiolan,
    tags: ["adventure", "mountain"],
    companions: ["friends", "solo"],
    durationFit: ["full", "weekend"],
    score: 95,
    active: true,
    imageStorage: "local",
    imageOrigin: "ai_generated",
  },
  {
    id: "refuge-fenestre",
    name: "Refuge de Madone de Fenestre",
    desc: "A mountain refuge meal that feels earned after effort.",
    dur: "1.5h",
    crowd: "very low",
    type: "food",
    img: I.refugeDeMadoneDeFenestre,
    tags: ["food", "mountain", "adventure"],
    companions: ["solo", "friends", "couple"],
    durationFit: ["full", "weekend"],
    score: 87,
    active: true,
    imageStorage: "local",
    imageOrigin: "ai_generated",
  },
  {
    id: "paragliding-colle",
    name: "Paragliding — Col de la Colle",
    desc: "Tandem flight over the Mercantour with coast-to-Alps perspective.",
    dur: "1h",
    crowd: "very low",
    type: "adventure",
    img: I.para,
    tags: ["adventure", "mountain"],
    companions: ["solo", "friends", "couple"],
    durationFit: ["full", "weekend"],
    score: 93,
    active: true,
    imageStorage: "local",
    imageOrigin: "ai_generated",
  },
  {
    id: "lac-saint-cassien",
    name: "Lac de Saint-Cassien",
    desc: "A freshwater cooldown after an intense day in the mountains.",
    dur: "1h",
    crowd: "low",
    type: "nature",
    img: I.lacDeSaintCassien,
    tags: ["adventure", "nature", "beach"],
    companions: ["solo", "friends", "family", "couple"],
    durationFit: ["full", "weekend"],
    score: 82,
    active: true,
    imageStorage: "local",
    imageOrigin: "ai_generated",
  },

  {
    id: "musee-matisse",
    name: "Musée Matisse",
    desc: "The full arc of Matisse in the city where he found his light.",
    dur: "1.5h",
    crowd: "low",
    type: "culture",
    img: I.museeMatisse,
    tags: ["culture"],
    companions: ["solo", "couple", "friends", "family"],
    durationFit: ["half", "full", "weekend"],
    score: 91,
    active: true,
    imageStorage: "local",
    imageOrigin: "ai_generated",
  },
  {
    id: "monastere-cimiez",
    name: "Monastère de Cimiez",
    desc: "Silence, olive groves and a contemplative Riviera pause.",
    dur: "45min",
    crowd: "very low",
    type: "culture",
    img: I.monastereDeCimiez,
    tags: ["culture", "village"],
    companions: ["solo", "couple", "family"],
    durationFit: ["half", "full", "weekend"],
    score: 88,
    active: true,
    imageStorage: "local",
    imageOrigin: "ai_generated",
  },
  {
    id: "chez-pipo",
    name: "Chez Pipo",
    desc: "Classic socca, no pretension, strong local identity.",
    dur: "1h",
    crowd: "medium",
    type: "food",
    img: I.chezPipo,
    tags: ["food", "culture"],
    companions: ["solo", "couple", "friends", "family"],
    durationFit: ["half", "full", "weekend"],
    score: 79,
    active: true,
    imageStorage: "local",
    imageOrigin: "ai_generated",
  },
  {
    id: "fondation-maeght",
    name: "Fondation Maeght",
    desc: "Miró, Giacometti and sculpture gardens in one of the Riviera’s top art stops.",
    dur: "2h",
    crowd: "medium",
    type: "culture",
    img: I.fondationMaeght,
    tags: ["culture", "village"],
    companions: ["solo", "couple", "friends", "family"],
    durationFit: ["full", "weekend"],
    score: 92,
    active: true,
    imageStorage: "local",
    imageOrigin: "ai_generated",
  },
  {
    id: "matisse-chapel",
    name: "Matisse Chapel, Vence",
    desc: "A small but deeply personal masterpiece designed in full by Matisse.",
    dur: "45min",
    crowd: "low",
    type: "culture",
    img: I.matisseChapelVence,
    tags: ["culture", "village"],
    companions: ["solo", "couple", "family"],
    durationFit: ["full", "weekend"],
    score: 87,
    active: true,
    imageStorage: "local",
    imageOrigin: "ai_generated",
  },
  {
    id: "antibes-ramparts",
    name: "Antibes ramparts, golden hour",
    desc: "A coastal art-history walk with warm evening light on the walls and sea.",
    dur: "1.5h",
    crowd: "medium",
    type: "culture",
    img: I.antibesRampartsGoldenHour,
    tags: ["culture", "beach", "village"],
    companions: ["solo", "couple", "friends", "family"],
    durationFit: ["full", "weekend"],
    score: 86,
    active: true,
    imageStorage: "local",
    imageOrigin: "ai_generated",
  },

  {
    id: "saint-paul-de-vence",
    name: "Saint-Paul-de-Vence",
    desc: "Medieval art village with a stronger atmosphere than most Riviera hotspots.",
    dur: "1.5h",
    crowd: "medium",
    type: "culture",
    img: I.saintPaulDeVence,
    tags: ["culture", "village"],
    companions: ["solo", "couple", "friends", "family"],
    durationFit: ["full", "weekend"],
    score: 84,
    active: true,
    imageStorage: "local",
    imageOrigin: "ai_generated",
  },
  {
    id: "la-colombe-dor",
    name: "La Colombe d'Or",
    desc: "Legendary art-world restaurant where the walls carry the story.",
    dur: "1.5h",
    crowd: "medium",
    type: "food",
    img: I.laColombeDOr,
    tags: ["food", "culture", "village"],
    companions: ["couple", "friends"],
    durationFit: ["weekend"],
    score: 83,
    active: true,
    imageStorage: "local",
    imageOrigin: "ai_generated",
  },
  {
    id: "tourrettes-sur-loup",
    name: "Tourrettes-sur-Loup",
    desc: "Village of violets, soft lanes and a slower romantic rhythm.",
    dur: "1h",
    crowd: "very low",
    type: "village",
    img: I.tourrettesSurLoup,
    tags: ["village", "food", "culture"],
    companions: ["solo", "couple", "friends", "family"],
    durationFit: ["full", "weekend"],
    score: 89,
    active: true,
    imageStorage: "local",
    imageOrigin: "ai_generated",
  },
];

const durationMultiplier = {
  solo: 0.9,
  couple: 1.1,
  friends: 1.0,
  family: 1.25,
};

function getAdjustedDurationMinutes(place, companion) {
  const base = parseDurationMinutes(place.dur);
  const factor = durationMultiplier[companion] || 1;
  return Math.round(base * factor);
}

function getPreferredMoment(place) {
  const name = place.name.toLowerCase();
  const type = place.type;

  if (name.includes("sunset") || name.includes("golden hour")) return "sunset";
  if (type === "transit") return "early";
  if (type === "adventure") return "morning";
  if (type === "nature") return "morning";
  if (type === "village") return "midday";
  if (type === "food") return "lunch";
  if (type === "beach") return "afternoon";
  if (type === "culture") return "afternoon";

  return "afternoon";
}

function getMomentWeight(moment) {
  const order = {
    early: 1,
    morning: 2,
    midday: 3,
    lunch: 4,
    afternoon: 5,
    sunset: 6,
  };

  return order[moment] || 99;
}

function getStartMinutesByCompanion(companion) {
  const starts = {
    solo: 8 * 60 + 30,
    couple: 9 * 60 + 30,
    friends: 10 * 60,
    family: 9 * 60,
  };

  return starts[companion] || 9 * 60;
}

function getGapMinutesByCompanion(companion) {
  const gaps = {
    solo: 20,
    couple: 30,
    friends: 25,
    family: 35,
  };

  return gaps[companion] || 25;
}

function formatClock(totalMinutes) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function formatDurationLabel(totalMinutes) {
  if (totalMinutes < 60) return `${totalMinutes}min`;

  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  if (!mins) return `${hours}h`;
  return `${hours}h ${mins}min`;
}

function sortPlacesForTimeline(places, companion) {
  return [...places].sort((a, b) => {
    const aMoment = getMomentWeight(getPreferredMoment(a));
    const bMoment = getMomentWeight(getPreferredMoment(b));

    if (aMoment !== bMoment) return aMoment - bMoment;

    const aDur = getAdjustedDurationMinutes(a, companion);
    const bDur = getAdjustedDurationMinutes(b, companion);

    if (companion === "family") return aDur - bDur;
    if (companion === "friends") return bDur - aDur;

    return a.name.localeCompare(b.name);
  });
}

function applyDynamicSchedule(places, companion) {
  const logistics = places.filter(isLogisticsPlace);
  const ordered = [
    ...logistics,
    ...sortPlacesForTimeline(places.filter((place) => !isLogisticsPlace(place)), companion),
  ];
  const gap = getGapMinutesByCompanion(companion);
  let current = getStartMinutesByCompanion(companion);

  return ordered.map((place) => {
    const withTime = {
      ...place,
      time: formatClock(current),
    };

    current += getAdjustedDurationMinutes(place, companion) + gap;
    return withTime;
  });
}

function formatStop(place, companion) {
  const adjustedMinutes = getAdjustedDurationMinutes(place, companion);
  const isLogistics = isLogisticsPlace(place);
  const why = isLogistics ? "Starting point for the route." : getRecommendationReason(place);

  return {
    id: place.id,
    time: place.time || "10:00",
    name: place.name,
    desc: place.desc,
    dur: formatDurationLabel(adjustedMinutes),
    crowd: place.crowd,
    type: place.type,
    img: place.img,
    finalScore: isLogistics ? null : (place.finalScore ?? null),
    favorabilityScore: isLogistics ? null : (place.finalScore ?? null),
    why,
    liveScores: place.liveScores || null,
    antiOvertourism: place.antiOvertourism || null,
    recommendationReason: why,
    recommendationSignals: isLogistics ? [] : getRecommendationSignals(place),
  };
}

function isLogisticsPlace(place) {
  return place?.type === "transit" || place?.id === "depart-nice";
}

function getStartPlace(places) {
  return places.find((place) => place.id === "depart-nice" && place.active !== false) || null;
}

function withStartPlace(places, startPlace) {
  if (!startPlace) return places;
  return [startPlace, ...places.filter((place) => place.id !== startPlace.id)];
}

function pickTopPlaces(vibes, duration, companion) {
  const scored = PLACES
    .filter((place) => place.active !== false)
    .filter((place) => !isLogisticsPlace(place))
    .filter((place) => vibes.some((vibe) => place.tags.includes(vibe)))
    .map((place) => ({
      ...place,
      finalScore: scorePlace(place, vibes, duration, companion),
    }))
    .sort((a, b) => b.finalScore - a.finalScore);

  if (!scored.length) {
    return PLACES
      .filter((place) => place.active !== false)
      .filter((place) => !isLogisticsPlace(place))
      .map((place) => ({
        ...place,
        finalScore: scorePlace(place, ["mountain"], duration, companion),
      }))
      .sort((a, b) => b.finalScore - a.finalScore);
  }

  return scored;
}

function buildTitle(vibes, companion, duration) {
  const firstVibe = vibes[0] || "mountain";

  const vibeTitles = {
    mountain: "Alpine Escape",
    village: "Lost Villages",
    beach: "Secret Coast",
    food: "Backcountry Flavors",
    adventure: "Adrenaline Riviera",
    culture: "Artists' Trail",
  };

  const companionSub = {
    solo: "crafted for a solo explorer",
    couple: "crafted for a romantic escape",
    friends: "crafted for a friends trip",
    family: "crafted for a family adventure",
  };

  const durationSub = {
    half: "A quick taste of the hidden Riviera",
    full: "A full day beyond the tourist trail",
    weekend: "Two days of deeper discovery",
  };

  return {
    title: vibeTitles[firstVibe] || "Hidden Riviera Escape",
    sub: `${durationSub[duration] || "A Riviera escape"} — ${
      companionSub[companion] || "crafted around your style"
    }`,
  };
}

function pickHero(topPlaces, vibes) {
  if (topPlaces[0]?.img) return topPlaces[0].img;

  const vibeHero = {
    mountain: I.mtn,
    village: I.ezeVillage,
    beach: I.plageDeLaMala,
    food: I.moulinAHuileDOpio,
    adventure: I.gorges,
    culture: I.antibesRampartsGoldenHour,
  };

  return vibeHero[vibes[0]] || I.mtn;
}

function buildItineraryFromPlaces(vibes, duration, companion) {
  const ranked = pickTopPlaces(vibes, duration, companion);
  const startPlace = getStartPlace(PLACES);

  if (duration === "half") {
    const selected = withStartPlace(ranked.slice(0, 3), startPlace);
    const scheduled = applyDynamicSchedule(selected, companion);
    const stops = scheduled.map((place) => formatStop(place, companion));

    const { title, sub } = buildTitle(vibes, companion, duration);

    return {
      title,
      sub,
      hero: pickHero(ranked, vibes),
      days: [{ label: "Half Day", stops }],
    };
  }

  if (duration === "full") {
    const selected = withStartPlace(ranked.slice(0, 6), startPlace);
    const scheduled = applyDynamicSchedule(selected, companion);
    const stops = scheduled.map((place) => formatStop(place, companion));

    const { title, sub } = buildTitle(vibes, companion, duration);

    return {
      title,
      sub,
      hero: pickHero(ranked, vibes),
      days: [{ label: "Full Day", stops }],
    };
  }

  const weekendSelected = ranked.slice(0, 8);
  const dayOneRaw = weekendSelected.slice(0, 4);
  const dayTwoRaw = weekendSelected.slice(4, 8);

  const dayOne = applyDynamicSchedule(withStartPlace(dayOneRaw, startPlace), companion).map((place) =>
    formatStop(place, companion)
  );
  const dayTwo = applyDynamicSchedule(dayTwoRaw, companion).map((place) =>
    formatStop(place, companion)
  );

  const { title, sub } = buildTitle(vibes, companion, duration);

  return {
    title,
    sub,
    hero: pickHero(ranked, vibes),
    days: [
      { label: "Day 1 — Explore", stops: dayOne },
      { label: "Day 2 — Go Deeper", stops: dayTwo },
    ],
  };
}

function mapDbPlaceToLocalShape(place) {
  const live = Array.isArray(place.place_live_context)
    ? place.place_live_context[0]
    : place.place_live_context || null;

  return {
    id: place.id,
    name: place.name,
    desc: place.description,
    dur: `${place.base_duration_minutes}min`,
    crowd: place.crowd_level,
    type: place.type,
    img: place.image_url,
    tags: place.tags || [],
    companions: place.companions || [],
    durationFit: place.duration_fit || [],
    score: place.base_score || 0,
    active: place.active !== false,
    preferredMoment: place.preferred_moment,
    antiOvertourism: {
      fragility: place.fragility_score ?? 50,
      capacity: place.capacity_score ?? 50,
      localBenefit: place.local_benefit_score ?? 50,
      substituteFor: place.substitute_for || [],
      bestSeason: place.best_season || [],
    },
    liveScores: {
      traffic: live?.traffic_score ?? 50,
      pollution: live?.pollution_score ?? 50,
      seasonal: live?.seasonal_score ?? 50,
      weather: live?.weather_score ?? 50,
      overtourism: live?.overtourism_score ?? 50,
    },
  };
}

function getPreferredMomentFromAnyPlace(place) {
  if (place.preferredMoment) return place.preferredMoment;
  return getPreferredMoment(place);
}

function sortPlacesForTimelineData(places, companion) {
  return [...places].sort((a, b) => {
    const aMoment = getMomentWeight(getPreferredMomentFromAnyPlace(a));
    const bMoment = getMomentWeight(getPreferredMomentFromAnyPlace(b));

    if (aMoment !== bMoment) return aMoment - bMoment;

    const aDur = getAdjustedDurationMinutes(a, companion);
    const bDur = getAdjustedDurationMinutes(b, companion);

    if (companion === "family") return aDur - bDur;
    if (companion === "friends") return bDur - aDur;

    return a.name.localeCompare(b.name);
  });
}

function applyDynamicScheduleData(places, companion) {
  const logistics = places.filter(isLogisticsPlace);
  const ordered = [
    ...logistics,
    ...sortPlacesForTimelineData(places.filter((place) => !isLogisticsPlace(place)), companion),
  ];
  const gap = getGapMinutesByCompanion(companion);
  let current = getStartMinutesByCompanion(companion);

  return ordered.map((place) => {
    const withTime = {
      ...place,
      time: formatClock(current),
    };

    current += getAdjustedDurationMinutes(place, companion) + gap;
    return withTime;
  });
}

function pickTopPlacesFromData(rawPlaces, vibes, duration, companion) {
  const places = rawPlaces.map(mapDbPlaceToLocalShape);

  const scored = places
    .filter((place) => place.active !== false)
    .filter((place) => !isLogisticsPlace(place))
    .filter((place) => vibes.some((vibe) => place.tags.includes(vibe)))
    .map((place) => ({
      ...place,
      finalScore: scorePlace(place, vibes, duration, companion),
    }))
    .sort((a, b) => b.finalScore - a.finalScore);

  if (!scored.length) {
    return places
      .filter((place) => place.active !== false)
      .filter((place) => !isLogisticsPlace(place))
      .map((place) => ({
        ...place,
        finalScore: scorePlace(place, ["mountain"], duration, companion),
      }))
      .sort((a, b) => b.finalScore - a.finalScore);
  }

  return scored;
}

function buildItineraryFromPlacesData(rawPlaces, vibes, duration, companion) {
  const ranked = pickTopPlacesFromData(rawPlaces, vibes, duration, companion);
  const startPlace = getStartPlace(rawPlaces.map(mapDbPlaceToLocalShape));

  if (duration === "half") {
    const selected = withStartPlace(ranked.slice(0, 3), startPlace);
    const scheduled = applyDynamicScheduleData(selected, companion);
    const stops = scheduled.map((place) => formatStop(place, companion));
    const { title, sub } = buildTitle(vibes, companion, duration);

    return {
      title,
      sub,
      hero: pickHero(ranked, vibes),
      days: [{ label: "Half Day", stops }],
    };
  }

  if (duration === "full") {
    const selected = withStartPlace(ranked.slice(0, 6), startPlace);
    const scheduled = applyDynamicScheduleData(selected, companion);
    const stops = scheduled.map((place) => formatStop(place, companion));
    const { title, sub } = buildTitle(vibes, companion, duration);

    return {
      title,
      sub,
      hero: pickHero(ranked, vibes),
      days: [{ label: "Full Day", stops }],
    };
  }

  const weekendSelected = ranked.slice(0, 8);
  const dayOneRaw = weekendSelected.slice(0, 4);
  const dayTwoRaw = weekendSelected.slice(4, 8);

  const dayOne = applyDynamicScheduleData(withStartPlace(dayOneRaw, startPlace), companion).map((place) =>
    formatStop(place, companion)
  );
  const dayTwo = applyDynamicScheduleData(dayTwoRaw, companion).map((place) =>
    formatStop(place, companion)
  );

  const { title, sub } = buildTitle(vibes, companion, duration);

  return {
    title,
    sub,
    hero: pickHero(ranked, vibes),
    days: [
      { label: "Day 1 — Explore", stops: dayOne },
      { label: "Day 2 — Go Deeper", stops: dayTwo },
    ],
  };
}

export function getItinerary(
  vibes = [],
  duration = "full",
  companion = "solo",
  placesOverride = null
) {
  const safeVibes = vibes.length ? vibes : ["mountain"];

  if (Array.isArray(placesOverride) && placesOverride.length) {
    return buildItineraryFromPlacesData(placesOverride, safeVibes, duration, companion);
  }

  return buildItineraryFromPlaces(safeVibes, duration, companion);
}

export { PLACES, parseDurationMinutes, getPreferredMoment };
