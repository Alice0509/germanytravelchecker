import fs from 'node:fs'

const generatedPath = 'src/data/eventPressureNotes.generated.json'
const knownEventsPath = 'src/data/eventPressureKnownEvents.json'
const reportPath = 'event-pressure-expired-cleanup-report.md'

const writeMode = process.argv.includes('--write')

function germanyTodayIso() {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  return formatter.format(new Date())
}

function isExpired(entry, todayIso) {
  return typeof entry?.endDate === 'string' && entry.endDate < todayIso
}

const todayIso = germanyTodayIso()

const notes = JSON.parse(fs.readFileSync(generatedPath, 'utf8'))
const knownEvents = JSON.parse(fs.readFileSync(knownEventsPath, 'utf8'))

const expiredNotes = notes.filter((note) => isExpired(note, todayIso))
const remainingNotes = notes.filter((note) => !isExpired(note, todayIso))

const expiredKnownDates = []

const cleanedKnownEvents = knownEvents.map((event) => {
  const knownDates = Array.isArray(event.knownDates) ? event.knownDates : []

  const expiredDates = knownDates.filter((dateEntry) =>
    isExpired(dateEntry, todayIso),
  )

  for (const dateEntry of expiredDates) {
    expiredKnownDates.push({
      eventId: event.id,
      city: event.city,
      title: dateEntry.title || event.title,
      startDate: dateEntry.startDate,
      endDate: dateEntry.endDate,
    })
  }

  return {
    ...event,
    knownDates: knownDates.filter(
      (dateEntry) => !isExpired(dateEntry, todayIso),
    ),
  }
})

const lines = [
  '# Event pressure expired data cleanup',
  '',
  `Germany date: ${todayIso}`,
  `Write mode: ${writeMode ? 'yes' : 'no'}`,
  '',
  '## Summary',
  '',
  `- Generated notes before cleanup: ${notes.length}`,
  `- Expired generated notes found: ${expiredNotes.length}`,
  `- Generated notes after cleanup: ${remainingNotes.length}`,
  `- Expired known event dates found: ${expiredKnownDates.length}`,
  '',
]

if (expiredNotes.length > 0) {
  lines.push('## Removed expired generated notes', '')

  expiredNotes.forEach((note, index) => {
    lines.push(
      `### ${index + 1}. ${note.title}`,
      '',
      `- id: \`${note.id}\``,
      `- city: ${note.city}`,
      `- dates: ${note.startDate} to ${note.endDate}`,
      '',
    )
  })
}

if (expiredKnownDates.length > 0) {
  lines.push('## Removed expired known event dates', '')

  expiredKnownDates.forEach((entry, index) => {
    lines.push(
      `### ${index + 1}. ${entry.title}`,
      '',
      `- event: \`${entry.eventId}\``,
      `- city: ${entry.city}`,
      `- dates: ${entry.startDate} to ${entry.endDate}`,
      '',
    )
  })
}

if (expiredNotes.length === 0 && expiredKnownDates.length === 0) {
  lines.push('No expired event pressure data found.', '')
}

fs.writeFileSync(reportPath, `${lines.join('\n')}\n`)

if (writeMode) {
  if (expiredNotes.length > 0) {
    fs.writeFileSync(
      generatedPath,
      `${JSON.stringify(remainingNotes, null, 2)}\n`,
    )
  }

  if (expiredKnownDates.length > 0) {
    fs.writeFileSync(
      knownEventsPath,
      `${JSON.stringify(cleanedKnownEvents, null, 2)}\n`,
    )
  }
}

console.log(lines.join('\n'))
