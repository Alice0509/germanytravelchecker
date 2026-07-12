import eventPressureNotes from '../data/eventPressureNotes.generated.json'

function formatShortDateRange(note) {
  if (!note?.startDate || !note?.endDate) {
    return ''
  }

  const start = note.startDate.slice(5).replace('-', '/')
  const end = note.endDate.slice(5).replace('-', '/')

  if (note.startDate === note.endDate) {
    return start
  }

  return `${start}–${end}`
}

function sortNotes(notes) {
  return [...notes].sort((a, b) => {
    const pressureOrder = { high: 0, medium: 1 }
    const pressureCompare =
      (pressureOrder[a.pressureLevel] ?? 2) - (pressureOrder[b.pressureLevel] ?? 2)

    if (pressureCompare !== 0) {
      return pressureCompare
    }

    return String(a.startDate).localeCompare(String(b.startDate))
  })
}

function cityToPlannerId(cityName) {
  return String(cityName || '').toLowerCase().replace(/\s+/g, '-')
}

function formatSignal(note) {
  return [note.city, note.title, formatShortDateRange(note)].filter(Boolean).join(' · ')
}

function getPlannerHref(note) {
  const cityId = cityToPlannerId(note.city)
  const params = new URLSearchParams({
    from: cityId,
    start: note.startDate,
    end: note.endDate,
  })

  return `/planner.html?${params.toString()}#trip-dates`
}

export default function CurrentTravelSignals() {
  const notes = Array.isArray(eventPressureNotes) ? sortNotes(eventPressureNotes) : []

  if (notes.length === 0) {
    return null
  }

  const tickerItems = notes.map((note) => ({
    id: note.id,
    label: formatSignal(note),
    href: getPlannerHref(note),
  }))

  const repeatedItems = [...tickerItems, ...tickerItems, ...tickerItems]

  return (
    <aside className="current-travel-signals" aria-label="Current travel signals">
      <div className="current-signals-kicker">
        <span className="signal-dot" aria-hidden="true" />
        <span>On air</span>
      </div>

      <div className="current-signals-track">
        <div className="current-signals-marquee">
          {repeatedItems.map((item, index) => (
            <a className="current-signal-item" href={item.href} key={`${item.id}-${index}`}>
              {item.label}
            </a>
          ))}
        </div>
      </div>

      <a className="current-signals-note" href={tickerItems[0].href}>
        Open planner
      </a>
    </aside>
  )
}
