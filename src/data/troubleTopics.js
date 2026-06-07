export const TROUBLE_TOPICS = [
  {
    id: 'sunday-supermarket-closures',
    category: 'Closures',
    title: 'Sunday supermarket closures',
    situation: 'You need groceries, water or basics on a Sunday.',
    meaning:
      'Many regular supermarkets and shops are closed on Sundays in Germany.',
    whatToDo: [
      'Buy water, snacks and daily basics earlier if you can.',
      'Check major train stations, airports, gas stations, kiosks, cafés, bakeries, restaurants or hotel reception.',
      'Verify opening hours before walking far, especially with luggage or children.',
    ],
    wordsToRecognize: ['Sonntag', 'geschlossen', 'Öffnungszeiten'],
    verifyWith: ['Google Maps', 'official business website', 'hotel reception'],
    safetyNote: '',
  },
  {
    id: 'public-holiday-state-differences',
    category: 'Closures',
    title: 'Public holidays by federal state',
    situation: 'A date seems normal in one German city but closed in another.',
    meaning:
      'Some German public holidays depend on the federal state. A normal day in Berlin can be a public holiday in Bavaria.',
    whatToDo: [
      'Check the exact city and federal state for your date.',
      'Do not assume shop or pharmacy hours are the same across Germany.',
      'Plan water, groceries and regular medication before public holidays when possible.',
    ],
    wordsToRecognize: ['Feiertag', 'Bundesland'],
    verifyWith: ['Germany Travel Checker', 'official state holiday sources'],
    safetyNote: '',
  },
  {
    id: 'still-vs-sparkling-water',
    category: 'Essentials',
    title: 'Still vs sparkling water',
    situation: 'You want still water but the bottle labels are confusing.',
    meaning:
      'German water labels often distinguish still, lightly sparkling and sparkling water.',
    whatToDo: [
      'Choose stilles Wasser, ohne Kohlensäure or naturell for still water.',
      'Classic, Sprudel or mit Kohlensäure usually means sparkling.',
      'Medium usually means lightly sparkling.',
    ],
    wordsToRecognize: ['stilles Wasser', 'ohne Kohlensäure', 'naturell', 'Medium', 'Classic', 'Sprudel'],
    verifyWith: ['bottle label'],
    safetyNote: '',
  },
  {
    id: 'pfand-bottle-deposit',
    category: 'Essentials',
    title: 'Pfand bottle deposit',
    situation: 'A bottle price looks higher than expected or you see Pfand on a label.',
    meaning:
      'Pfand is a bottle deposit. You may pay extra and usually get the deposit back when returning the bottle.',
    whatToDo: [
      'Keep the bottle if you want the deposit back.',
      'Return bottles at supermarket deposit machines where accepted.',
      'Look for Pfand, Mehrweg or Einweg markings.',
    ],
    wordsToRecognize: ['Pfand', 'Mehrweg', 'Einweg', 'Pfandflasche'],
    verifyWith: ['bottle label', 'supermarket deposit machine'],
    safetyNote: '',
  },
  {
    id: 'paid-toilets-and-coins',
    category: 'Essentials',
    title: 'Paid toilets and coins',
    situation: 'You need a toilet at a station, mall or busy area.',
    meaning:
      'Some public toilets in Germany may cost money. Card payment is not always guaranteed.',
    whatToDo: [
      'Keep a few coins or small cash as backup.',
      'Check whether card payment is accepted before entering.',
      'If traveling with children or luggage, do not wait until it is urgent.',
    ],
    wordsToRecognize: ['WC', 'Toilette', 'Sanifair', 'nur Münzen'],
    verifyWith: ['toilet entrance signs'],
    safetyNote: '',
  },
  {
    id: 'pharmacy-closed-notdienst',
    category: 'Health',
    title: 'Pharmacy closed / Notdienst',
    situation: 'You need a pharmacy on a Sunday, public holiday or outside regular hours.',
    meaning:
      'Regular pharmacies may be closed, but emergency pharmacy duty services rotate by date and location.',
    whatToDo: [
      'For life-threatening emergencies, call 112 immediately.',
      'For non-emergency medical help outside regular office hours, travelers in Germany can check 116117.',
      'For emergency pharmacies, verify current Notdienst information before going.',
    ],
    wordsToRecognize: ['Apotheke', 'Notdienst', 'Notapotheke'],
    verifyWith: ['official Notdienst-Apotheke service', 'Google Maps', 'official pharmacy website'],
    safetyNote:
      'This is not medical advice. Do not delay emergency care if the situation may be serious.',
  },
  {
    id: 'train-platform-change',
    category: 'Transit',
    title: 'Train platform change',
    situation: 'Your train platform changes shortly before departure.',
    meaning:
      'Gleisänderung means your train may leave from a different platform than originally shown.',
    whatToDo: [
      'Check the train number, not only the destination.',
      'Look at the latest station display before boarding.',
      'Leave extra time if you have luggage, children or a tight connection.',
    ],
    wordsToRecognize: ['Gleisänderung', 'geändertes Gleis', 'heute von Gleis'],
    verifyWith: ['station display', 'DB Navigator', 'local transport app'],
    safetyNote: '',
  },
  {
    id: 'train-cancellation',
    category: 'Transit',
    title: 'Train cancellation',
    situation: 'Your train is cancelled or no longer shown as expected.',
    meaning:
      'Fällt aus means the train is cancelled. You may need another train, route or connection.',
    whatToDo: [
      'Look for the next train with the same direction or destination.',
      'Check whether your ticket is valid on an alternative connection.',
      'Ask station staff if you are unsure and have a tight connection.',
    ],
    wordsToRecognize: ['fällt aus', 'Zug fällt aus', 'Ausfall'],
    verifyWith: ['DB Navigator', 'station display', 'station staff'],
    safetyNote: '',
  },
  {
    id: 'replacement-bus-sev',
    category: 'Transit',
    title: 'Replacement bus / SEV',
    situation: 'You see SEV or Schienenersatzverkehr during a train or local transit trip.',
    meaning:
      'Part of the rail route may be replaced by a bus, often because of construction or disruption.',
    whatToDo: [
      'Look for signs saying SEV, Ersatzverkehr or Bus.',
      'Allow extra time because replacement buses can be slower and harder with luggage.',
      'Check the final destination before boarding the bus.',
    ],
    wordsToRecognize: ['SEV', 'Schienenersatzverkehr', 'Ersatzverkehr'],
    verifyWith: ['DB Navigator', 'local transport app', 'station signs'],
    safetyNote: '',
  },
  {
    id: 'construction-works-bauarbeiten',
    category: 'Transit',
    title: 'Construction works / Bauarbeiten',
    situation: 'Your route changes because of construction works.',
    meaning:
      'Bauarbeiten means construction works. Routes, platforms, travel times or replacement transport may change.',
    whatToDo: [
      'Check your route again on the day of travel.',
      'Leave extra time for transfers.',
      'Watch for platform changes, replacement buses or changed stopping patterns.',
    ],
    wordsToRecognize: ['Bauarbeiten', 'Baustelle', 'Umleitung'],
    verifyWith: ['DB Navigator', 'local transport app', 'station signs'],
    safetyNote: '',
  },
]

export function getTroubleTopicById(topicId) {
  return TROUBLE_TOPICS.find((topic) => topic.id === topicId) || null
}

export function getTroubleTopicsByCategory(category) {
  return TROUBLE_TOPICS.filter((topic) => topic.category === category)
}
