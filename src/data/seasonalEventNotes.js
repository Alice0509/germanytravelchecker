import { parseDateKey } from '../utils/checkToday.js'

export const SEASONAL_EVENT_NOTES = [
  {
    id: 'nuremberg-christkindlesmarkt-2026',
    cityId: 'nuremberg',
    title: 'Seasonal event note: Christkindlesmarkt',
    label: 'Seasonal event note',
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
