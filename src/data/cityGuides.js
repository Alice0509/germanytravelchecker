export const CITY_GUIDES = [
  {
    cityId: "berlin",
    slug: "berlin",
    title: "Berlin travel checks",
    metaDescription:
      "Check Berlin public holidays, Sunday closures, school holiday travel periods, groceries, pharmacies and practical trip timing.",
    overview:
      "Berlin is both a city and a German federal state. Germany Travel Checker uses the Berlin calendar when checking public holidays, school holiday periods and Sunday closure patterns for Berlin trips.",
    federalStateNote:
      "Berlin uses the Berlin state calendar. This matters because German public holidays and school holidays can differ by federal state.",
    publicHolidayNote:
      "Public holidays in Berlin may affect shops, supermarkets, offices, attractions and travel plans. Use Check Today or Trip Dates for date-specific checks.",
    sundayClosureNote:
      "Many regular shops and supermarkets in Germany are usually closed on Sundays. In Berlin, travelers often check major train stations, airports, gas stations, cafés, bakeries, restaurants, kiosks or hotel reception for essentials.",
    schoolHolidayNote:
      "Berlin school holidays do not usually close shops, but they may affect trains, hotels, attractions, family travel demand and long weekend planning.",
    essentialsNote:
      "For essentials, travelers often check transport hubs, airports, gas stations, kiosks, cafés, bakeries, restaurants, hotel reception, Google Maps and official business websites.",
    pharmacyNote:
      "Regular pharmacies may be closed on Sundays and public holidays. Emergency pharmacies change by date and location. Check official Notdienst-Apotheke services, Google Maps or pharmacy websites before going. For medical emergencies, call 112. For police emergencies, call 110. For non-emergency medical on-call help, use 116117.",
    searchIntents: [
      "are shops open in Berlin on Sunday",
      "Berlin public holiday shops closed",
      "Berlin Sunday closures",
      "Berlin school holidays travel",
      "pharmacies open Sunday Berlin",
    ],
  },
  {
    cityId: "munich",
    slug: "munich",
    title: "Munich travel checks",
    metaDescription:
      "Check Munich public holidays, Bavaria holiday rules, Sunday closures, school holiday travel periods, groceries, pharmacies and practical trip timing.",
    overview:
      "Munich is in Bavaria. Germany Travel Checker uses the Bavaria calendar when checking public holidays, school holiday periods and Sunday closure patterns for Munich trips.",
    federalStateNote:
      "Munich uses the Bavaria calendar. This is important because Bavaria has public holiday rules that may differ from Berlin, Hamburg or other German federal states.",
    publicHolidayNote:
      "Public holidays in Bavaria may affect shops, supermarkets, offices, attractions and travel plans in Munich. Some Bavarian holidays can also have regional or local rules, so travelers should verify the exact city and date.",
    sundayClosureNote:
      "Many regular shops and supermarkets in Germany are usually closed on Sundays. In Munich, travelers often check major train stations, airports, gas stations, cafés, bakeries, restaurants, kiosks or hotel reception for essentials.",
    schoolHolidayNote:
      "Bavaria school holidays do not usually close shops, but they may affect trains, hotels, attractions, family travel demand, roads and long weekend planning.",
    essentialsNote:
      "For essentials, travelers often check transport hubs, Munich Airport, major train stations, gas stations, kiosks, cafés, bakeries, restaurants, hotel reception, Google Maps and official business websites.",
    pharmacyNote:
      "Regular pharmacies may be closed on Sundays and public holidays. Emergency pharmacies change by date and location. Check official Notdienst-Apotheke services, Google Maps or pharmacy websites before going. For medical emergencies, call 112. For police emergencies, call 110. For non-emergency medical on-call help, use 116117.",
    searchIntents: [
      "are shops open in Munich on Sunday",
      "Munich public holiday shops closed",
      "Bavaria public holidays travel",
      "Munich Sunday closures",
      "pharmacies open Sunday Munich",
    ],
  },
];

export function findCityGuideByCityId(cityId) {
  return CITY_GUIDES.find((guide) => guide.cityId === cityId) || null;
}

export function findCityGuideBySlug(slug) {
  return CITY_GUIDES.find((guide) => guide.slug === slug) || null;
}
