import { parseDateKey } from '../utils/checkToday.js'

export const SEASONAL_EVENT_NOTES = [
  {
    id: 'berlin-new-year-2026-2027',
    cityId: 'berlin',
    title: 'Seasonal event note',
    eventName: 'New Year period',
    label: 'Seasonal event note',
    sourceBasis: 'Berlin.de and VisitBerlin New Year event pages',
    sourceChecked: '2026-06-12',
    dateLabel: 'Official check period: 2026-12-31 – 2027-01-01',
    startDate: '2026-12-31',
    endDate: '2027-01-01',
    summary:
      'Berlin can have special events, crowds, fireworks, road closures and transport changes around New Year. Check official city event pages and live transport updates before relying on tight plans.',
    sourceNote:
      'New Year events, ticket rules, security rules and transport changes can vary by year. Verify details with official city, tourism and transport sources before relying on them.',
    links: [
      {
        label: 'Berlin.de New Year events',
        href: 'https://www.berlin.de/en/events/new-years-eve/',
      },
      {
        label: 'VisitBerlin New Year events',
        href: 'https://www.visitberlin.de/en/events-new-years-eve-berlin',
      },
    ],
  },
  {
    id: 'berlin-new-year-2027-2028',
    cityId: 'berlin',
    title: 'Seasonal event note',
    eventName: 'New Year period',
    label: 'Seasonal event note',
    sourceBasis: 'Berlin.de and VisitBerlin New Year event pages',
    sourceChecked: '2026-06-12',
    dateLabel: 'Official check period: 2027-12-31 – 2028-01-01',
    startDate: '2027-12-31',
    endDate: '2028-01-01',
    summary:
      'Berlin can have special events, crowds, fireworks, road closures and transport changes around New Year. Check official city event pages and live transport updates before relying on tight plans.',
    sourceNote:
      'New Year events, ticket rules, security rules and transport changes can vary by year. Verify details with official city, tourism and transport sources before relying on them.',
    links: [
      {
        label: 'Berlin.de New Year events',
        href: 'https://www.berlin.de/en/events/new-years-eve/',
      },
      {
        label: 'VisitBerlin New Year events',
        href: 'https://www.visitberlin.de/en/events-new-years-eve-berlin',
      },
    ],
  },

  {
    id: 'munich-oktoberfest-2027',
    cityId: 'munich',
    title: 'Seasonal event note',
    eventName: 'Oktoberfest season',
    label: 'Seasonal event note',
    sourceBasis: 'Official Oktoberfest and Munich tourism pages',
    sourceChecked: '2026-06-12',
    dateLabel: 'Official season: 2027-09-18 – 2027-10-03',
    startDate: '2027-09-18',
    endDate: '2027-10-03',
    summary:
      'Munich can be much busier during Oktoberfest. Check accommodation, local transport, restaurant plans and arrival timing early, and avoid tight transfers around the festival period.',
    sourceNote:
      'Official event dates, opening hours and access rules can change. Verify details with the official Oktoberfest or Munich tourism website before relying on them.',
    links: [
      {
        label: 'Official Oktoberfest site',
        href: 'https://www.oktoberfest.de/en',
      },
      {
        label: 'Official Munich tourism page',
        href: 'https://www.munich.travel/en/pois/markets-festivals/oktoberfest',
      },
    ],
  },

  {
    id: 'munich-oktoberfest-2026',
    cityId: 'munich',
    title: 'Seasonal event note',
    eventName: 'Oktoberfest season',
    label: 'Seasonal event note',
    sourceBasis: 'Official Oktoberfest and Munich tourism pages',
    sourceChecked: '2026-06-12',
    dateLabel: 'Official season: 2026-09-19 – 2026-10-04',
    startDate: '2026-09-19',
    endDate: '2026-10-04',
    summary:
      'Munich can be much busier during Oktoberfest. Check accommodation, local transport, restaurant plans and arrival timing early, and avoid tight transfers around the festival period.',
    sourceNote:
      'Official event dates, opening hours and access rules can change. Verify details with the official Oktoberfest or Munich tourism website before relying on them.',
    links: [
      {
        label: 'Official Oktoberfest site',
        href: 'https://www.oktoberfest.de/en',
      },
      {
        label: 'Official Munich tourism page',
        href: 'https://www.munich.travel/en/pois/markets-festivals/oktoberfest',
      },
    ],
  },

  {
    id: 'nuremberg-christkindlesmarkt-2026',
    cityId: 'nuremberg',
    title: 'Seasonal event note',
    eventName: 'Christkindlesmarkt season',
    label: 'Seasonal event note',
    sourceBasis: 'Official Christkindlesmarkt and Nuremberg tourism pages',
    sourceChecked: '2026-06-12',
    dateLabel: 'Official season: 2026-11-27 – 2026-12-24',
    startDate: '2026-11-27',
    endDate: '2026-12-24',
    summary:
      'Nuremberg can be especially busy around the Christkindlesmarkt season. Check official event dates, opening hours, hotel availability, restaurant plans and transport changes before booking tight transfers.',
    sourceNote:
      'Official event dates and opening hours can change. Verify details with the official event or tourism website before relying on them.',
    links: [
      {
        label: 'Official Christkindlesmarkt site',
        href: 'https://www.christkindlesmarkt.de/en/',
      },
      {
        label: 'Official Nuremberg tourism page',
        href: 'https://tourismus.nuernberg.de/en/traveltrade/nuremberg-christkindlesmarkt/at-a-glance/',
      },
    ],
  },
]

function rangesOverlap(startA, endA, startB, endB) {
  const parsedStartA = parseDateKey(startA)
  const parsedEndA = parseDateKey(endA)
  const parsedStartB = parseDateKey(startB)
  const parsedEndB = parseDateKey(endB)

  if (!parsedStartA || !parsedEndA || !parsedStartB || !parsedEndB) {
    return false
  }

  return parsedStartA <= parsedEndB && parsedEndA >= parsedStartB
}

export function findSeasonalEventNotes({ cityId, startDateKey, endDateKey } = {}) {
  if (!cityId || !startDateKey || !endDateKey) {
    return []
  }

  return SEASONAL_EVENT_NOTES.filter(
    (note) =>
      note.cityId === cityId &&
      rangesOverlap(startDateKey, endDateKey, note.startDate, note.endDate),
  )
}
