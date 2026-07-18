export const NEED_OPTIONS = [
  {
    id: "water",
    label: "Water",
  },
  {
    id: "groceries",
    label: "Groceries & basics",
  },
  {
    id: "cafes-bakeries",
    label: "Cafés / bakeries",
  },
  {
    id: "pharmacy",
    label: "Medicine / pharmacy",
  },
];

export const NEED_GUIDANCE = {
  water: {
    title: "Water planning",
    summary: "Buy water earlier before a Sunday, public holiday or late arrival.",
    fallbackPlaces: [
      "major train stations",
      "airports",
      "gas stations",
      "kiosks",
      "cafés",
      "bakeries",
      "restaurants",
      "hotel reception",
      "vending machines where available",
    ],
    note:
      "If you land late, wake up on a Sunday or arrive on a public holiday, do not assume you can quickly stop by a regular supermarket for water. Buy water earlier if you can. Larger stations, airports, gas stations, kiosks, cafés, bakeries, hotel reception or vending machines may help as fallback options, but availability varies.",
  },
  groceries: {
    title: "Groceries and daily basics",
    summary: "Buy food and daily basics before regular supermarkets close.",
    fallbackPlaces: [
      "major train stations",
      "airports",
      "gas stations",
      "selected kiosks",
      "small convenience-style shops where available",
    ],
    note:
      "Regular supermarkets are usually closed on Sundays and public holidays. If you need breakfast items, snacks, toiletries or simple basics, it is better to plan before shops close. Train stations, airports, gas stations or kiosks may help, but exact availability varies.",
  },
  cigarettes: {
    title: "Tobacco availability",
    fallbackPlaces: [
      "kiosks",
      "gas stations",
      "tobacco shops if open",
      "vending machines where available and age verification works",
      "some train station shops",
    ],
    note:
      "Tobacco availability may depend on age verification, local rules and exact opening hours. The app should not provide exact vending machine locations.",
  },
  "cafes-bakeries": {
    title: "Cafés and bakeries fallback",
    summary: "Cafés, bakeries and restaurants may still help when regular shops are closed.",
    fallbackPlaces: [
      "city centers",
      "tourist areas",
      "major train stations",
      "airports",
      "restaurants",
      "hotel cafés",
    ],
    note:
      "Cafés, bakeries and restaurants can be useful when regular shops are closed, especially in tourist areas, city centers, train stations or airports. They may be more expensive than buying basics earlier, and exact hours vary.",
  },
  pharmacy: {
    title: "Pharmacies and emergency help",
    summary: "Plan regular medication early and verify the current emergency pharmacy when needed.",
    fallbackPlaces: [
      "112 for medical emergencies",
      "110 for police emergencies",
      "116117 for non-emergency medical on-call help",
      "official Notdienst-Apotheke search services",
      "Google Maps",
      "local pharmacy websites",
      "hotel reception for local guidance",
    ],
    note:
      "If this is a medical emergency or life-threatening situation, call 112 immediately. For non-emergency medical help outside regular office hours, travelers in Germany can check 116117. Regular pharmacies may be closed on Sundays and public holidays, so plan regular medication you already use before you run out. Emergency pharmacies change by date and location, so always verify current information with an official Notdienst-Apotheke service, Google Maps or the official pharmacy website before going.",
  },
};

export function getNeedGuidance(needId) {
  return NEED_GUIDANCE[needId] || null;
}

export function getFallbackPlaceText(needId) {
  const guidance = getNeedGuidance(needId);

  if (!guidance) {
    return "";
  }

  return guidance.fallbackPlaces.join(", ");
}

function formatTravelDate(dateKey) {
  if (!dateKey) {
    return "";
  }

  const [year, month, day] = dateKey.split("-").map(Number);

  if (!year || !month || !day) {
    return "";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function getCheckTodayTitle({
  cityName,
  dateKey,
  isSunday,
  publicHoliday,
  schoolHoliday,
} = {}) {
  const place = cityName || "Germany";
  const dateLabel = formatTravelDate(dateKey);
  const prefix = dateLabel ? `${place} · ${dateLabel}` : place;

  if (publicHoliday) {
    const holidayName =
      publicHoliday.name?.en || publicHoliday.name?.de || publicHoliday.name || "Public holiday";

    return `${prefix}: ${holidayName}`;
  }

  if (isSunday) {
    return `${prefix}: Sunday closures`;
  }

  if (schoolHoliday) {
    return `${prefix}: School holiday travel pressure`;
  }

  return `${prefix}: No Sunday or public holiday closure`;
}

export function getCheckTodaySummary({
  cityName,
  bundeslandName,
  isSunday,
  publicHoliday,
  schoolHoliday,
} = {}) {
  const place = cityName || "your city";
  const stateName = bundeslandName || "this federal state";

  if (publicHoliday) {
    return `Regular shops and supermarkets are usually closed on public holidays in Germany. In ${place}, check transport hubs, airports, gas stations, cafés, bakeries, restaurants or official business pages before relying on a specific place.`;
  }

  if (isSunday) {
    return `Most regular supermarkets and many shops are usually closed on Sundays in Germany. In ${place}, travelers often check major train stations, airports, gas stations, kiosks, cafés, bakeries, restaurants or hotel reception for essentials.`;
  }

  if (schoolHoliday) {
    return `This date falls during a school holiday period in ${stateName}. Shops are not usually closed because of school holidays, but trains, hotels, attractions and roads may be busier.`;
  }

  return `No Sunday or statewide public holiday closure was found for this date in ${place}. Many regular businesses may be open, but exact hours still vary.`;
}

export function getCheckTodayDisclaimer() {
  return "Exact opening hours change often. Always check Google Maps or the official business website before relying on a specific shop, café, pharmacy, station or attraction.";
}
