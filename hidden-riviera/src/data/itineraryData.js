export const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap";

const I = {
  h1: "https://images.unsplash.com/photo-1578240749366-a1d3b6c39cb4?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=1200&h=900&fit=crop&q=80",
  h2: "https://plus.unsplash.com/premium_photo-1688544142274-0d479c4535eb?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=1200&h=900&fit=crop&q=80",
  mtn: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop&q=80",
  nice: "https://images.unsplash.com/photo-1491166617655-0723a0999cfc?w=600&h=350&fit=crop&q=80",
  gorges: "src/assets/Gorges du Loup.png",
  gourdon: "src/assets/Gourdon.png",
  aubergeDeCourmes: "src/assets/Auberge de Courmes.png",
  baouDeSaintJeannet: "src/assets/Baou de Saint-Jeannet.png",
  plateauDeCaussols: "src/assets/Plateau de Caussols.png",
  saintPaulDeVence: "src/assets/Saint-Paul-de-Vence.png",
  sunsetColDeVance: "src/assets/Sunset — Col de Vence.png",
  gîteInCoursegoules: "src/assets/Gîte in Coursegoules.png",
  laColombeDOr: "src/assets/La Colombe d'Or.png",
  fondationMaeght: "src/assets/Fondation Maeght.png",
  tourrettesSurLoup: "src/assets/Tourrettes-sur-Loup.png",
  grandeCorniche: "src/assets/Grande Corniche.png",
  ezeVillage: "src/assets/Èze Village.png",
  peillon: "src/assets/Peillon.png",
  lucéram: "src/assets/Luceram.png",
  aubergeQuintrand: "src/assets/Auberge Quintrand.png",
  coaraze_village_DuSoleil: "src/assets/Coaraze — Village du Soleil.png",
  colDeTuriniSunsetDrive: "src/assets/Col de Turini sunset drive.png",
  plageDeLaMala: "src/assets/Plage de la Mala.png",
  palomaBeach: "src/assets/Paloma Beach.png",
  sentierDuLittoral: "src/assets/Sentier du Littoral.png",
  villefrancheSurMer: "src/assets/Villefranche-sur-Mer.png",
  pointeDeLAiguilleSunset: "src/assets/Pointe de l'Aiguille sunset.png",
  coursSaleyaMarket: "src/assets/Cours Saleya Market.png",
  MoulinAHuilDOpio: "src/assets/Moulin à Huile d'Opio.png",
  laBastideSaintAntoine: "src/assets/La Bastide Saint-Antoine.png",
  antibesRampartsGoldenHour: "src/assets/Antibes ramparts, golden hour.png",
  galimardWorkshopGrasse: "src/assets/Galimard Workshop, Grasse.png",
  domaineDeToasc: "src/assets/Domaine de Toasc.png",
  viaFerrata: "src/assets/Via Ferrata — La Colmiane.png",
  clueDuRiolan: "src/assets/Canyoning — Clue du Riolan.png",
  refugeDeMadoneDeFenestre: "src/assets/Refuge de Madone de Fenestre.png",
  para: "src/assets/Paragliding — Col de la Colle.png",
  lacDeSaintCassien: "src/assets/Lac de Saint-Cassien.png",
  muséeMatisse: "src/assets/Musée Matisse.png",
  monastéreDeCimiez: "src/assets/Monastère de Cimiez.png",
  chezPipo: "src/assets/Chez Pipo.png",
  matisseChapelVance: "src/assets/Matisse Chapel, Vence.png"
};

export const HERO_IMAGES = [I.h1, I.h2, I.mtn, I.colDeTuriniSunsetDrive];

export const VIBES = [
  { id: "mountain", emoji: "⛰️", label: "Mountain trails", img: I.mtn },
  { id: "village", emoji: "🏘️", label: "Hidden villages", img: I.ezeVillage },
  { id: "beach", emoji: "🏖️", label: "Secret beaches", img: I.plageDeLaMala },
  { id: "food", emoji: "🍷", label: "Gastronomy", img: I.MoulinAHuilDOpio },
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

const IT = {
  "mountain-full": { title:"Alpine Escape", sub:"Beyond the coastline, into the clouds", hero:I.mtn, days:[{label:"Full Day",stops:[
    {time:"8:30",name:"Départ from Nice",desc:"Head north through the Var valley — the sea vanishes behind you in minutes.",dur:"45min drive",crowd:"none",type:"transit",img:I.nice},
    {time:"9:15",name:"Gorges du Loup",desc:"Dramatic canyon with waterfalls between limestone cliffs. Cascade du Saut du Loup catches rainbows in morning mist.",dur:"1h visit",crowd:"low",type:"nature",img:I.gorges},
    {time:"10:45",name:"Gourdon",desc:"Eagle-nest village at 760m. Views stretch from the Riviera to Corsica. Population: 400 humans, countless hawks.",dur:"1h visit",crowd:"low",type:"village",img:I.gourdon},
    {time:"12:30",name:"Auberge de Courmes",desc:"Stone farmhouse, no menu — you eat what the garden grew. The stuffed courgette flowers are legendary.",dur:"1.5h",crowd:"very low",type:"food",img:I.aubergeDeCourmes},
    {time:"14:30",name:"Plateau de Caussols",desc:"Lunar landscape at 1,000m. Wild lavender, ancient shepherd huts, one of Europe's clearest night skies.",dur:"1.5h hike",crowd:"very low",type:"nature",img:I.plateauDeCaussols},
    {time:"16:30",name:"Saint-Paul-de-Vence",desc:"Medieval art village. Skip the main street — walk the ramparts at golden hour for views that inspired Chagall.",dur:"1.5h",crowd:"medium",type:"culture",img:I.saintPaulDeVence},
    {time:"18:30",name:"Sunset — Col de Vence",desc:"The sun melts into the Mediterranean from 970m. The entire coast turns amber. Bring a jacket.",dur:"30min",crowd:"very low",type:"nature",img:I.sunsetColDeVance},
  ]}]},
  "mountain-weekend": { title:"Alpine Escape", sub:"Two days between peaks and perched villages", hero:I.mtn, days:[
    {label:"Day 1 — Into the Mountains",stops:[
      {time:"8:30",name:"Départ from Nice",desc:"North through the Var valley. The Mediterranean disappears fast.",dur:"45min",crowd:"none",type:"transit",img:I.nice},
      {time:"9:15",name:"Gorges du Loup",desc:"Waterfall canyon. The mist catches rainbows before 10am.",dur:"1.5h",crowd:"low",type:"nature",img:I.gorges},
      {time:"11:15",name:"Gourdon",desc:"Eagle-nest at 760m. Real artisans, no tourist kitsch. Views to Corsica.",dur:"1h",crowd:"low",type:"village",img:I.gourdon},
      {time:"12:30",name:"Auberge de Courmes",desc:"You eat what the garden grew that morning. No menu needed.",dur:"1.5h",crowd:"very low",type:"food",img:I.aubergeDeCourmes},
      {time:"14:30",name:"Plateau de Caussols",desc:"Lunar landscape. Lavender, shepherd huts, clearest night sky in southern France.",dur:"2h hike",crowd:"very low",type:"nature",img:I.plateauDeCaussols},
      {time:"17:00",name:"Gîte in Coursegoules",desc:"Mountain guesthouse. Stone walls, wood fire, population 500. Sleep with the silence.",dur:"Evening",crowd:"very low",type:"village",img:I.gîteInCoursegoules},
    ]},
    {label:"Day 2 — Art & Golden Hour",stops:[
      {time:"9:00",name:"Baou de Saint-Jeannet",desc:"Dramatic cliff overlooking the coast. 1.5h round trip. Best free view on the Riviera.",dur:"2h hike",crowd:"low",type:"nature",img:I.baouDeSaintJeannet},
      {time:"11:30",name:"Saint-Paul-de-Vence",desc:"Medieval art village. Walk the ramparts, skip the main drag. Chagall is buried here.",dur:"1.5h",crowd:"medium",type:"culture",img:I.saintPaulDeVence},
      {time:"13:00",name:"La Colombe d'Or",desc:"The restaurant where Picasso paid in paintings. The walls ARE the collection.",dur:"1.5h",crowd:"medium",type:"food",img:I.laColombeDOr},
      {time:"15:00",name:"Fondation Maeght",desc:"Miró, Giacometti, Calder. The building is a total artwork. The garden alone takes an hour.",dur:"1.5h",crowd:"low",type:"culture",img:I.fondationMaeght},
      {time:"17:00",name:"Tourrettes-sur-Loup",desc:"Village of violets. Violet ice cream, violet jam. Lanes that smell like spring.",dur:"1h",crowd:"very low",type:"village",img:I.tourrettesSurLoup},
      {time:"18:30",name:"Sunset — Col de Vence",desc:"The coast turns amber. Best seat for the end of the day.",dur:"30min",crowd:"very low",type:"nature",img:I.sunsetColDeVance},
    ]},
  ]},
  "village-full": { title:"Lost Villages", sub:"Medieval stones, forgotten lanes, zero tourists", hero:I.ezeVillage, days:[{label:"Full Day",stops:[
    {time:"9:00",name:"Grande Corniche",desc:"Napoleon's road east. Better than any highway ever built.",dur:"30min",crowd:"none",type:"transit",img:I.grandeCorniche},
    {time:"9:30",name:"Èze Village",desc:"429m above the sea. Go early — by 11am it transforms. Exotic garden at summit has cacti older than the village.",dur:"1.5h",crowd:"medium",type:"village",img:I.ezeVillage},
    {time:"11:30",name:"Peillon",desc:"Most secret village on the Riviera. No shops, no restaurants, no tourists. 13th-century stone and silence.",dur:"1h",crowd:"very low",type:"village",img:I.peillon},
    {time:"13:00",name:"Lucéram",desc:"Famous for Christmas nativities. Other months: you own the entire medieval labyrinth.",dur:"1h",crowd:"very low",type:"village",img:I.lucéram},
    {time:"14:30",name:"Auberge Quintrand",desc:"Wild boar stew, local cheese, tarte aux blettes. Mountain cooking unchanged for generations.",dur:"1.5h",crowd:"low",type:"food",img:I.aubergeQuintrand},
    {time:"16:30",name:"Coaraze — Village du Soleil",desc:"Sundials on every wall, designed by Cocteau. Each tells time differently.",dur:"1h",crowd:"very low",type:"culture",img:I.coaraze_village_DuSoleil},
    {time:"18:00",name:"Col de Turini sunset drive",desc:"Legendary rally road. Hairpin turns, golden light, windows down.",dur:"1h drive",crowd:"none",type:"nature",img:I.colDeTuriniSunsetDrive},
  ]}]},
  "beach-full": { title:"Secret Coast", sub:"Beaches the tourists never find", hero:I.plageDeLaMala, days:[{label:"Full Day",stops:[
    {time:"9:00",name:"Départ from Nice",desc:"Leave the Promenade des Anglais behind. Head west.",dur:"20min",crowd:"none",type:"transit",img:I.nice},
    {time:"9:30",name:"Plage de la Mala",desc:"Hidden at Cap d'Ail's cliff base. Steep staircase descent. Crystal turquoise — almost Caribbean.",dur:"2h",crowd:"low",type:"beach",img:I.plageDeLaMala},
    {time:"12:00",name:"Paloma Beach",desc:"Saint-Jean-Cap-Ferrat's secret. Grilled fish, feet in sand. Billionaire views, backpacker prices.",dur:"1.5h",crowd:"medium",type:"food",img:I.palomaBeach},
    {time:"14:00",name:"Sentier du Littoral",desc:"Coastal path, Beaulieu to Villefranche. Wild swimming coves every 200m. Bring water shoes.",dur:"1.5h walk",crowd:"low",type:"nature",img:I.sentierDuLittoral},
    {time:"16:00",name:"Villefranche-sur-Mer",desc:"Most photogenic harbor. Cocteau chapel, colored houses, deep bay perfect for swimming.",dur:"1.5h",crowd:"medium",type:"village",img:I.villefrancheSurMer},
    {time:"18:00",name:"Pointe de l'Aiguille sunset",desc:"Red volcanic rocks meet the sea. Last swim as the sky turns pink. Bring towel and wine.",dur:"1h",crowd:"very low",type:"beach",img:I.pointeDeLAiguilleSunset},
  ]}]},
  "food-full": { title:"Backcountry Flavors", sub:"Michelin stars meet grandma's recipes", hero:I.MoulinAHuilDOpio, days:[{label:"Full Day",stops:[
    {time:"9:00",name:"Cours Saleya Market",desc:"Soul of Nice. Socca off the griddle, pissaladière, olives. Go hungry.",dur:"1.5h",crowd:"medium",type:"food",img:I.coursSaleyaMarket},
    {time:"11:00",name:"Moulin à Huile d'Opio",desc:"700-year-old olive mill, still pressing. Oils that never leave this village.",dur:"1h",crowd:"very low",type:"food",img:I.MoulinAHuilDOpio},
    {time:"12:30",name:"La Bastide Saint-Antoine",desc:"Chibois' Michelin star in Grasse. Menu changes with whatever the garden grows.",dur:"2h",crowd:"low",type:"food",img:I.laBastideSaintAntoine},
    {time:"15:00",name:"Galimard Workshop, Grasse",desc:"Skip Fragonard. Create your own scent from 127 essences.",dur:"1.5h",crowd:"low",type:"culture",img:I.galimardWorkshopGrasse},
    {time:"17:00",name:"Tourrettes-sur-Loup",desc:"Village of violets. Violet ice cream, jam, everything. Cobblestoned time warp.",dur:"1h",crowd:"low",type:"village",img:I.tourrettesSurLoup},
    {time:"18:30",name:"Domaine de Toasc",desc:"Nice's only vineyard. Rare Bellet white on a terrace over the Baie des Anges.",dur:"1.5h",crowd:"very low",type:"food",img:I.domaineDeToasc},
  ]}]},
  "adventure-full": { title:"Adrenaline Riviera", sub:"Mountains meet Mediterranean, vertically", hero:I.gorges, days:[{label:"Full Day",stops:[
    {time:"7:30",name:"Départ from Nice",desc:"Early start. The mountains don't wait for anyone.",dur:"1h drive",crowd:"none",type:"transit",img:I.nice},
    {time:"8:30",name:"Via Ferrata — La Colmiane",desc:"Iron pathway bolted into cliff faces at 1,500m. Tibetan bridge, monkey bridge, zip line.",dur:"2.5h",crowd:"very low",type:"adventure",img:I.viaFerrata},
    {time:"11:30",name:"Canyoning — Clue du Riolan",desc:"Natural pools, water chutes, waterfall rappels. Wetsuit provided, no experience needed.",dur:"2.5h",crowd:"very low",type:"adventure",img:I.clueDuRiolan},
    {time:"14:30",name:"Refuge de Madone de Fenestre",desc:"Mountain refuge at 1,900m. Tartiflette, tarte aux myrtilles. Food earned through effort.",dur:"1.5h",crowd:"very low",type:"food",img:I.refugeDeMadoneDeFenestre},
    {time:"16:30",name:"Paragliding — Col de la Colle",desc:"Tandem over the Mercantour. Alps, coast, Italy — all from the air.",dur:"1h",crowd:"very low",type:"adventure",img:I.para},
    {time:"18:30",name:"Lac de Saint-Cassien",desc:"Warm freshwater lake in forest. Post-adrenaline cooldown. Float and breathe.",dur:"1h",crowd:"low",type:"nature",img:I.lacDeSaintCassien},
  ]}]},
  "culture-full": { title:"Artists' Trail", sub:"Following Matisse, Chagall & Picasso into the light", hero:I.antibesRampartsGoldenHour, days:[{label:"Full Day",stops:[
    {time:"9:30",name:"Musée Matisse",desc:"17th-century Genoese villa on Cimiez hill. Matisse's entire arc in the city where he found light.",dur:"1.5h",crowd:"low",type:"culture",img:I.muséeMatisse},
    {time:"11:30",name:"Monastère de Cimiez",desc:"Matisse and Dufy buried in the garden. Oldest olive grove in Nice. Stunning silence.",dur:"45min",crowd:"very low",type:"culture",img:I.monastéreDeCimiez},
    {time:"12:45",name:"Chez Pipo",desc:"Since 1923. Best socca in Nice — chickpea flatbread, wood-fired. No pretension.",dur:"1h",crowd:"medium",type:"food",img:I.chezPipo},
    {time:"14:15",name:"Fondation Maeght",desc:"Miró, Giacometti, Calder. Building as total artwork. The sculpture garden is the masterpiece.",dur:"2h",crowd:"medium",type:"culture",img:I.fondationMaeght},
    {time:"16:45",name:"Matisse Chapel, Vence",desc:"He designed everything: glass, murals, vestments, cross. Called it his masterpiece.",dur:"45min",crowd:"low",type:"culture",img:I.matisseChapelVance},
    {time:"18:00",name:"Antibes ramparts, golden hour",desc:"Walk where Picasso painted. Château Grimaldi glows against the sea.",dur:"1.5h",crowd:"medium",type:"culture",img:I.antibesRampartsGoldenHour},
  ]}]},
};

Object.keys(IT).forEach((key) => {
  if (!key.endsWith("-full")) return;

  const base = IT[key];
  const stops = base.days[0].stops;
  const prefix = key.replace("-full", "");

  if (!IT[`${prefix}-weekend`]) {
    const middle = Math.ceil(stops.length / 2);
    IT[`${prefix}-weekend`] = {
      ...base,
      days: [
        { label: "Day 1 — Explore", stops: stops.slice(0, middle) },
        { label: "Day 2 — Go Deeper", stops: stops.slice(middle) },
      ],
    };
  }

  if (!IT[`${prefix}-half`]) {
    IT[`${prefix}-half`] = {
      ...base,
      sub: "A quick taste",
      days: [{ label: "Half Day", stops: stops.slice(0, 3) }],
    };
  }
});

export function getItinerary(vibes, duration) {
  for (const vibe of vibes) {
    if (IT[`${vibe}-${duration}`]) return IT[`${vibe}-${duration}`];
  }
  return IT["mountain-full"];
}
