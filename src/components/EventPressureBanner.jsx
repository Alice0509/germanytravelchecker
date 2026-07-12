export default function EventPressureBanner({ notes }) {
  if (!Array.isArray(notes) || notes.length === 0) {
    return null
  }

  const primaryNote = notes[0]

  return (
    <aside className={`event-pressure-banner event-pressure-${primaryNote.pressureLevel}`}>
      <div>
        <span>'Major event signal'</span>
        <strong>{primaryNote.title}</strong>
      </div>

      <p>{primaryNote.travelerImpact}</p>
      <p>{primaryNote.recommendedAction}</p>

      <small>
        Not live crowd data.{' '}
        {primaryNote.verifyLinks?.[0]?.url ? (
          <a href={primaryNote.verifyLinks[0].url} target="_blank" rel="noreferrer">
            Verify official source
          </a>
        ) : (
          'Verify official sources.'
        )}
      </small>
    </aside>
  )
}
