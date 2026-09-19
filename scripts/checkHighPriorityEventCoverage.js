import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

const knownEventsPath = path.join(
  repoRoot,
  'src/data/eventPressureKnownEvents.json',
)

const generatedNotesPath = path.join(
  repoRoot,
  'src/data/eventPressureNotes.generated.json',
)

function germanyToday() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

function readTodayOverride(args) {
  const arg = args.find((item) => item.startsWith('--today='))

  if (!arg) return null

  const value = arg.slice('--today='.length)

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error('--today must use YYYY-MM-DD format.')
  }

  return value
}

function normaliseTitle(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\b20\d{2}\b/g, '')
    .replace(/[^a-z0-9äöüß]+/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function getNextMonthWindow(today) {
  const [year, month] = today.split('-').map(Number)

  const nextMonth = month === 12 ? 1 : month + 1
  const nextYear = month === 12 ? year + 1 : year

  const startDate =
    `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`

  const afterNextMonthIndex = nextMonth
  const end = new Date(Date.UTC(nextYear, afterNextMonthIndex, 0))
  const endDate = end.toISOString().slice(0, 10)

  return {
    month: nextMonth,
    year: nextYear,
    startDate,
    endDate,
  }
}

function overlaps(startDate, endDate, windowStart, windowEnd) {
  return (
    typeof startDate === 'string' &&
    typeof endDate === 'string' &&
    endDate >= windowStart &&
    startDate <= windowEnd
  )
}

function generatedNoteMatchesSeed(note, seed) {
  if (note.city !== seed.city) return false
  if (note.category !== seed.category) return false

  const seedTitle = normaliseTitle(seed.title)
  const noteTitle = normaliseTitle(note.title)

  if (!seedTitle || !noteTitle) return false

  return (
    seedTitle.includes(noteTitle) ||
    noteTitle.includes(seedTitle)
  )
}

export function findHighPriorityCoverageGaps(
  seeds,
  generatedNotes,
  today,
) {
  const window = getNextMonthWindow(today)
  const gaps = []

  for (const seed of seeds) {
    if (seed.defaultPressureLevel !== 'high') continue

    const preferredMonths =
      seed.dateExtraction?.preferredMonths || []

    if (!preferredMonths.includes(window.month)) continue

    const knownCoverage = (seed.knownDates || []).some(
      (entry) =>
        overlaps(
          entry.startDate,
          entry.endDate,
          today,
          window.endDate,
        ),
    )

    const generatedCoverage = generatedNotes.some(
      (note) =>
        generatedNoteMatchesSeed(note, seed) &&
        overlaps(
          note.startDate,
          note.endDate,
          today,
          window.endDate,
        ),
    )

    if (!knownCoverage && !generatedCoverage) {
      gaps.push({
        id: seed.id,
        city: seed.city,
        title: seed.title,
        nextMonth: window.month,
        nextYear: window.year,
        sourceUrl: seed.sourceUrl,
      })
    }
  }

  return gaps
}

async function main() {
  const strict = process.argv.includes('--strict')
  const today = readTodayOverride(process.argv) || germanyToday()

  const seeds = JSON.parse(
    await fs.readFile(knownEventsPath, 'utf8'),
  )

  const generatedNotes = JSON.parse(
    await fs.readFile(generatedNotesPath, 'utf8'),
  )

  const window = getNextMonthWindow(today)

  const gaps = findHighPriorityCoverageGaps(
    seeds,
    generatedNotes,
    today,
  )

  console.log('High-priority event coverage')
  console.log('============================')
  console.log(`Germany date: ${today}`)
  console.log(
    `Next month checked: ${window.year}-${String(window.month).padStart(2, '0')}`,
  )
  console.log(`Coverage gaps: ${gaps.length}`)

  if (gaps.length > 0) {
    console.log('')
    console.log('Needs event-date review')
    console.log('-----------------------')

    for (const gap of gaps) {
      console.log(
        `- ${gap.city} · ${gap.title} · ${gap.id}`,
      )
      console.log(`  ${gap.sourceUrl}`)
    }
  }

  if (strict && gaps.length > 0) {
    console.error('')
    console.error(
      'High-priority event coverage is missing for next month.',
    )
    process.exit(1)
  }
}

const isMain =
  process.argv[1] &&
  pathToFileURL(path.resolve(process.argv[1])).href ===
    import.meta.url

if (isMain) {
  main().catch((error) => {
    console.error(error.message || error)
    process.exit(1)
  })
}
