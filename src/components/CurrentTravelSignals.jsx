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

function formatSignal(note) {
  return [note.city, note.title, formatShortDateRange(note)].filter(Boolean).join(' · ')
}

export default function CurrentTravelSignals() {
  const notes = Array.isArray(eventPressureNotes) ? sortNotes(eventPressureNotes) : []

  if (notes.length === 0) {
    return null
  }

  const tickerItems = notes.map((note) => ({
    id: note.id,
    label: formatSignal(note),
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
            <span className="current-signal-item" key={`${item.id}-${index}`}>
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <span className="current-signals-note">Planning signal · not live crowd data</span>
    </aside>
  )
}
