export const troubleTopics = [
  {
    id: "sunday-supermarket-closures",
    title: "Sunday supermarket closures",
    category: "Shops and closures",
    urgency: "medium",
    problem: "You are standing outside a closed supermarket, drugstore or shopping street in Germany, even though it is daytime.",
    meaning: "It may be Sunday or a public holiday. In many parts of Germany, normal retail shopping is restricted on Sundays and public holidays, but stations, airports, gas stations, kiosks and restaurants may still have options.",
    firstMove: "First, do not walk to another normal supermarket yet. Check stations, airports, gas stations or kiosks, then verify the exact place before you move.",
    whatToDo: [
      "Do not walk to another normal supermarket first without checking.",
      "Look for larger train stations, airports, gas stations, kiosks or restaurants.",
      "If you need water, snacks or baby supplies, search station and airport shops first.",
      "If today may be a public holiday, use Check Today or Planner for holiday context."
    ],
    verify: [
      "Google Maps opening hours",
      "Official business website",
      "Station or airport shop directory",
      "Germany Travel Checker Check Today",
      "Germany Travel Checker Planner"
    ],
    risk: "Google Maps may show outdated or generic hours. Verify before walking across town with luggage or kids.",
    relatedGuideUrl: "/sunday-holiday-closures.html",
    actionLabel: "See what may still be open",
    keywords: ["sunday", "shops closed", "supermarket closed", "holiday", "public holiday", "grocery", "rewe", "edeka", "dm"]
  },
  {
    id: "public-holidays-by-federal-state",
    title: "Public holidays by federal state",
    category: "Holidays and timing",
    urgency: "medium",
    problem: "A shop, office, museum or service is closed and you are not sure whether today is a public holiday in this part of Germany.",
    meaning: "Some German public holidays apply nationwide, but others depend on the federal state. A holiday in Bavaria may not be a holiday in Berlin.",
    firstMove: "First, check the city or federal state you are actually in today. A holiday can apply in one state but not another.",
    whatToDo: [
      "Check the city or state you are in, not only the country.",
      "Use Check Today for the current location/date context.",
      "For multi-city trips, use Planner to check whether different cities are affected differently.",
      "Do not assume opening hours from another German city apply where you are."
    ],
    verify: [
      "Germany Travel Checker Check Today",
      "Germany Travel Checker Planner",
      "Official business website",
      "Google Maps opening hours"
    ],
    risk: "Travelers often search only for Germany-wide holidays and miss state-specific closures.",
    relatedGuideUrl: "/planner.html",
    actionLabel: "Check your trip dates",
    keywords: ["public holiday", "federal state", "bavaria", "berlin", "holiday today", "shops closed", "feiertag"]
  },
  {
    id: "still-vs-sparkling-water",
    title: "Still vs sparkling water",
    category: "Food and daily life",
    urgency: "low",
    problem: "You bought water in Germany and it tastes fizzy, or you are not sure which bottle is still water.",
    meaning: "Many German bottled waters are sparkling. Look for words like still, ohne Kohlensäure or naturell if you want non-sparkling water.",
    firstMove: "First, check the bottle label before you pay. If you need non-sparkling water, look for still, naturell or ohne Kohlensäure.",
    whatToDo: [
      "For still water, look for still, ohne Kohlensäure or naturell.",
      "For sparkling water, words like classic, spritzig or mit Kohlensäure often mean carbonated.",
      "If buying for a child or for medicine, check the label before paying.",
      "In restaurants, ask for stilles Wasser if you want still water."
    ],
    verify: [
      "Bottle label",
      "Shelf label",
      "Ask staff: stilles Wasser?"
    ],
    risk: "A direct translation may not help if the bottle branding is confusing or uses regional wording.",
    relatedGuideUrl: "/water-pfand-guide.html",
    actionLabel: "Check water label words",
    keywords: ["water", "still water", "sparkling", "kohlensäure", "stilles wasser", "naturell", "classic"]
  },
  {
    id: "pfand-bottle-deposit",
    title: "Pfand bottle deposit",
    category: "Food and daily life",
    urgency: "low",
    problem: "You paid more than expected for a drink bottle or see Pfand on a receipt.",
    meaning: "Pfand is a bottle or can deposit. You pay it when buying certain drinks and may get it back by returning the container to a deposit machine or participating shop.",
    firstMove: "First, do not throw the bottle away if you want the deposit back. Keep it and look for a Pfand return machine later.",
    whatToDo: [
      "Keep bottles and cans with a Pfand symbol if you want the deposit back.",
      "Look for a Rückgabe or Pfandautomat machine in supermarkets.",
      "Put bottles in one by one and take the printed receipt.",
      "Use the receipt at the checkout."
    ],
    verify: [
      "Bottle or can Pfand symbol",
      "Receipt line showing Pfand",
      "Supermarket Pfandautomat signs"
    ],
    risk: "Travelers may throw away deposit bottles or misunderstand the extra charge as a pricing error.",
    relatedGuideUrl: "/water-pfand-guide.html",
    actionLabel: "Understand the Pfand machine",
    keywords: ["pfand", "deposit", "bottle", "can", "receipt", "pfandautomat", "rückgabe"]
  },
  {
    id: "paid-toilets-and-coins",
    title: "Paid toilets and coins",
    category: "Daily logistics",
    urgency: "medium",
    problem: "You need a toilet at a station, mall or rest stop and see a gate, payment machine or coin sign.",
    meaning: "Many public toilets in Germany, especially in stations and travel hubs, may require payment. Card may work in some places, but small coins can still be useful.",
    firstMove: "First, check the payment machine before you leave the station or mall. Card may work, but a few coins can still save stress.",
    whatToDo: [
      "Check whether the machine accepts card, coins or both.",
      "Keep small coins available during travel days.",
      "In train stations, follow WC or Toilette signs rather than leaving the station first.",
      "If traveling with kids, check toilets before boarding or before leaving a station area."
    ],
    verify: [
      "WC signs",
      "Payment machine instructions",
      "Station map",
      "Staff or information desk"
    ],
    risk: "The problem is not translation; it is timing. You may need coins or a nearby alternative quickly.",
    relatedGuideUrl: "/water-pfand-guide.html",
    actionLabel: "Check toilet payment options",
    keywords: ["toilet", "wc", "coins", "paid toilet", "station toilet", "sanifair", "bathroom"]
  },
  {
    id: "pharmacy-closed-notdienst",
    title: "Pharmacy closed / Notdienst",
    category: "Health and urgent supplies",
    urgency: "high",
    problem: "You need medicine but the pharmacy is closed, or it is Sunday, late evening or a public holiday.",
    meaning: "Regular pharmacies may be closed outside business hours, but emergency pharmacy duty services exist. In German, this is often called Notdienst or Notdienst-Apotheke.",
    firstMove: "First, do not rely on a normal pharmacy listing. Search for the official Notdienst-Apotheke for your city or postcode.",
    whatToDo: [
      "Search for Notdienst-Apotheke plus your city or postcode.",
      "Check the official emergency pharmacy listing before traveling there.",
      "For urgent medical danger, use emergency services instead of searching for a normal pharmacy.",
      "If you only need basic supplies, also check station or airport shops, but do not expect full pharmacy service."
    ],
    verify: [
      "Official Notdienst-Apotheke search",
      "Pharmacy window notice",
      "Google Maps plus official pharmacy website",
      "Emergency number if medically urgent"
    ],
    risk: "Google Maps may show a pharmacy listing but not the current duty pharmacy. Verify with an official Notdienst source.",
    relatedGuideUrl: "/sunday-holiday-closures.html",
    actionLabel: "Find closure and pharmacy guidance",
    keywords: ["pharmacy", "apotheke", "notdienst", "medicine", "closed pharmacy", "emergency pharmacy", "holiday"]
  },
  {
    id: "train-platform-change",
    title: "Train platform change",
    category: "Transit trouble",
    urgency: "high",
    problem: "Your train platform changed, or the app and station board do not seem to match.",
    meaning: "German trains can change platforms shortly before departure. The train number matters more than the destination name because multiple trains may go toward similar cities.",
    firstMove: "First, check the train number and the latest platform board. Do not move based only on the destination name.",
    whatToDo: [
      "Check the train number first, not only the destination.",
      "Look at the latest station departure board.",
      "Follow platform change signs quickly but calmly.",
      "If traveling with luggage or kids, move only after confirming the train number and platform."
    ],
    verify: [
      "Station departure board",
      "DB Navigator",
      "Platform display",
      "Station staff"
    ],
    risk: "Following only the destination name can put you on the wrong train or wrong platform.",
    relatedGuideUrl: "/train-trouble.html",
    actionLabel: "Understand train disruption words",
    keywords: ["platform", "gleis", "platform change", "train number", "db navigator", "departure board"]
  },
  {
    id: "train-cancellation",
    title: "Train cancellation",
    category: "Transit trouble",
    urgency: "high",
    problem: "Your train is cancelled or marked as cancelled in German, and you are not sure whether you can take another train.",
    meaning: "A cancelled train may change your routing options, but ticket rules depend on the ticket type and disruption context. Do not assume every train is automatically allowed.",
    firstMove: "First, check DB Navigator and the station display before boarding another train. The key question is whether your ticket options changed.",
    whatToDo: [
      "Check DB Navigator for replacement options.",
      "Look for official messages about cancellation or aufgehoben Zugbindung if applicable.",
      "Ask staff before boarding a much more expensive or different category train if unsure.",
      "Keep screenshots of cancellation messages if your onward trip is affected."
    ],
    verify: [
      "DB Navigator",
      "Station displays",
      "DB Reisezentrum or staff",
      "Ticket conditions"
    ],
    risk: "The key question is not just translation. It is whether your ticket flexibility changed.",
    relatedGuideUrl: "/train-trouble.html",
    actionLabel: "Understand cancellation next steps",
    keywords: ["cancelled", "canceled", "zug fällt aus", "train cancellation", "db", "ticket", "zugbindung"]
  },
  {
    id: "replacement-bus-sev",
    title: "Replacement bus / SEV",
    category: "Transit trouble",
    urgency: "high",
    problem: "You see SEV, Ersatzverkehr or Schienenersatzverkehr and your train route is disrupted.",
    meaning: "Part of the train route may be replaced by a bus. The bus often leaves from outside the station, not from the normal train platform.",
    firstMove: "First, do not wait only on the platform. Look for yellow SEV or Ersatzverkehr signs and check whether the bus leaves outside the station.",
    whatToDo: [
      "Do not wait only on the platform if SEV is shown.",
      "Look for yellow SEV, Ersatzverkehr or bus replacement signs.",
      "Check whether the replacement bus stop is outside the station building.",
      "Leave extra time because replacement buses can be slower and harder to find."
    ],
    verify: [
      "DB Navigator",
      "Station SEV signs",
      "Station staff",
      "Posted construction or replacement bus notices"
    ],
    risk: "Travelers often miss the replacement bus because they stay near the normal platform too long.",
    relatedGuideUrl: "/train-trouble.html",
    actionLabel: "Find the replacement bus guide",
    keywords: ["sev", "ersatzverkehr", "schienenersatzverkehr", "replacement bus", "bus stop", "train disruption"]
  },
  {
    id: "construction-works-bauarbeiten",
    title: "Construction works / Bauarbeiten",
    category: "Transit trouble",
    urgency: "medium",
    problem: "Your route shows Bauarbeiten, construction works or changed service, and travel time suddenly looks longer.",
    meaning: "Rail construction can cause changed platforms, replacement buses, skipped stops, delays or different routes. The important part is how it affects your next connection.",
    firstMove: "First, check whether your exact train number, stop or connection is affected. Construction notices can change the route, not just the timing.",
    whatToDo: [
      "Check whether your exact train number is affected.",
      "Look for changed departure times, replacement buses or skipped stops.",
      "If you have a tight connection, check alternatives before boarding.",
      "For airport travel, allow extra buffer and verify again on the travel day."
    ],
    verify: [
      "DB Navigator",
      "Station displays",
      "Official construction notice",
      "Staff at the station"
    ],
    risk: "A construction notice can look like general information, but it may change your actual route.",
    relatedGuideUrl: "/train-trouble.html",
    actionLabel: "Understand construction disruption words",
    keywords: ["bauarbeiten", "construction", "works", "delay", "route change", "replacement bus", "db"]
  }
];

export default troubleTopics;
