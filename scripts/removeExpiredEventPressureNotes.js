import fs from 'node:fs'

const generatedPath = 'src/data/eventPressureNotes.generated.json'
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

function isExpired(note, todayIso) {
  return typeof note.endDate === 'string' && note.endDate < todayIso
}

const todayIso = germanyTodayIso()
const notes = JSON.parse(fs.readFileSync(generatedPath, 'utf8'))

const expired = notes.filter((note) => isExpired(note, todayIso))
const remaining = notes.filter((note) => !isExpired(note, todayIso))

const lines = [
  '# Event pressure expired note cleanup',
  '',
  `Germany date: ${todayIso}`,
  `Write mode: ${writeMode ? 'yes' : 'no'}`,
  '',
  '## Summary',
  '',
  `- Generated notes before cleanup: ${notes.length}`,
  `- Expired notes found: ${expired.length}`,
  `- Generated notes after cleanup: ${remaining.length}`,
  '',
]

if (expired.length > 0) {
  lines.push('## Removed expired notes', '')

  expired.forEach((note, index) => {
    lines.push(
      `### ${index + 1}. ${note.title}`,
      '',
      `- id: \`${note.id}\``,
      `- city: ${note.city}`,
      `- dates: ${note.startDate} to ${note.endDate}`,
      `- category: ${note.category}`,
      `- pressure: ${note.pressureLevel}`,
      '',
    )
  })
} else {
  lines.push('No expired generated notes found.', '')
}

fs.writeFileSync(reportPath, `${lines.join('\n')}\n`)

if (writeMode && expired.length > 0) {
  fs.writeFileSync(generatedPath, `${JSON.stringify(remaining, null, 2)}\n`)
}

console.log(lines.join('\n'))
