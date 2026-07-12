import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

const knownEventsPath = path.join(repoRoot, 'src/data/eventPressureKnownEvents.json')
const schemaPath = path.join(repoRoot, 'src/data/eventPressureNotesSchema.js')

const isStrict = process.argv.includes('--strict')

async function readJson(filePath, fallback) {
  try {
    const content = await fs.readFile(filePath, 'utf8')
    return JSON.parse(content)
  } catch (error) {
    if (error.code === 'ENOENT') return fallback
    throw error
  }
}

function getGermanyDateKey() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

function getTodayOverride() {
  const todayArg = process.argv.find((arg) => arg.startsWith('--today='))
  if (!todayArg) return null

  const value = todayArg.slice('--today='.length)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error('--today must use YYYY-MM-DD format.')
  }

  return value
}

function isIsoDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function validateKnownEventSeed(seed, supportedCities, index) {
  const errors = []

  for (const field of [
    'id',
    'city',
    'title',
    'category',
    'defaultPressureLevel',
    'sourceType',
    'sourceLabel',
    'sourceUrl',
    'candidateReason',
    'suggestedImpact',
    'suggestedAction',
    'knownDates',
  ]) {
    if (!(field in seed)) {
      errors.push(`seeds[${index}]: Missing required field: ${field}`)
    }
  }

  if (seed.city && !supportedCities.includes(seed.city)) {
    errors.push(`seeds[${index}]: Unsupported city: ${seed.city}`)
  }

  if (seed.sourceUrl && !String(seed.sourceUrl).startsWith('https://')) {
    errors.push(`seeds[${index}]: sourceUrl must be an https URL.`)
  }

  if (!Array.isArray(seed.knownDates)) {
    errors.push(`seeds[${index}]: knownDates must be an array.`)
    return errors
  }

  seed.knownDates.forEach((dateEntry, dateIndex) => {
    if (!dateEntry.startDate || !isIsoDate(dateEntry.startDate)) {
      errors.push(`seeds[${index}].knownDates[${dateIndex}]: startDate must use YYYY-MM-DD format.`)
    }

    if (!dateEntry.endDate || !isIsoDate(dateEntry.endDate)) {
      errors.push(`seeds[${index}].knownDates[${dateIndex}]: endDate must use YYYY-MM-DD format.`)
    }

    if (dateEntry.startDate && dateEntry.endDate && dateEntry.startDate > dateEntry.endDate) {
      errors.push(`seeds[${index}].knownDates[${dateIndex}]: startDate must be before or equal to endDate.`)
    }

    if (dateEntry.sourceUrl && !String(dateEntry.sourceUrl).startsWith('https://')) {
      errors.push(`seeds[${index}].knownDates[${dateIndex}]: sourceUrl must be an https URL.`)
    }
  })

  return errors
}

function collectExpiredKnownDates(seeds, todayDateKey) {
  return seeds.flatMap((seed) =>
    (seed.knownDates || [])
      .filter((dateEntry) => dateEntry.endDate < todayDateKey)
      .map((dateEntry) => ({
        seedId: seed.id,
        city: seed.city,
        seedTitle: seed.title,
        title: dateEntry.title || seed.title,
        startDate: dateEntry.startDate,
        endDate: dateEntry.endDate,
        sourceUrl: dateEntry.sourceUrl || seed.sourceUrl,
      })),
  )
}

function formatKnownDate(entry) {
  return `${entry.city} · ${entry.title} · ${entry.startDate} to ${entry.endDate} · ${entry.seedId}`
}

async function main() {
  const { SUPPORTED_EVENT_PRESSURE_CITIES } = await import(pathToFileURL(schemaPath).href)

  const seeds = await readJson(knownEventsPath, [])

  if (!Array.isArray(seeds)) {
    throw new Error('eventPressureKnownEvents.json must contain an array.')
  }

  const validationErrors = seeds.flatMap((seed, index) =>
    validateKnownEventSeed(seed, SUPPORTED_EVENT_PRESSURE_CITIES, index),
  )

  if (validationErrors.length > 0) {
    console.error('Known event date validation failed:')
    for (const error of validationErrors) {
      console.error(`- ${error}`)
    }
    process.exit(1)
  }

  const todayDateKey = getTodayOverride() || getGermanyDateKey()
  const knownDateCount = seeds.reduce((sum, seed) => sum + seed.knownDates.length, 0)
  const expiredKnownDates = collectExpiredKnownDates(seeds, todayDateKey)

  console.log('Known event dates')
  console.log('=================')
  console.log(`Germany date: ${todayDateKey}`)
  console.log(`Known event seeds: ${seeds.length}`)
  console.log(`Known dates: ${knownDateCount}`)
  console.log(`Expired known dates: ${expiredKnownDates.length}`)

  if (expiredKnownDates.length > 0) {
    console.log('')
    console.log('Needs removal or archival')
    console.log('------------------------')
    for (const entry of expiredKnownDates) {
      console.log(`- ${formatKnownDate(entry)}`)
      console.log(`  ${entry.sourceUrl}`)
    }
  }

  if (isStrict && expiredKnownDates.length > 0) {
    console.error('')
    console.error('Expired known event dates found.')
    console.error('Remove them from eventPressureKnownEvents.json or move them to an archive before merging.')
    process.exit(1)
  }
}

main().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
