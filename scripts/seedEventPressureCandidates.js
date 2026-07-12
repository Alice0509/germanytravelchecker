import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

const seedsPath = path.join(repoRoot, 'src/data/eventPressureKnownEvents.json')
const candidatesPath = path.join(repoRoot, 'src/data/eventPressureCandidates.generated.json')
const generatedPath = path.join(repoRoot, 'src/data/eventPressureNotes.generated.json')
const schemaPath = path.join(repoRoot, 'src/data/eventPressureNotesSchema.js')

async function readJson(filePath, fallback) {
  try {
    const content = await fs.readFile(filePath, 'utf8')
    return JSON.parse(content)
  } catch (error) {
    if (error.code === 'ENOENT') return fallback
    throw error
  }
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function isIsoDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function validateSeed(seed, supportedCities) {
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
      errors.push(`Missing required field: ${field}`)
    }
  }

  if (seed.city && !supportedCities.includes(seed.city)) {
    errors.push(`Unsupported city: ${seed.city}`)
  }

  if (seed.sourceUrl && !String(seed.sourceUrl).startsWith('https://')) {
    errors.push('sourceUrl must be an https URL.')
  }

  if (!Array.isArray(seed.knownDates)) {
    errors.push('knownDates must be an array.')
  } else {
    seed.knownDates.forEach((dateEntry, index) => {
      if (!dateEntry.startDate || !isIsoDate(dateEntry.startDate)) {
        errors.push(`knownDates[${index}].startDate must use YYYY-MM-DD format.`)
      }

      if (!dateEntry.endDate || !isIsoDate(dateEntry.endDate)) {
        errors.push(`knownDates[${index}].endDate must use YYYY-MM-DD format.`)
      }

      if (dateEntry.startDate && dateEntry.endDate && dateEntry.startDate > dateEntry.endDate) {
        errors.push(`knownDates[${index}] startDate must be before or equal to endDate.`)
      }
    })
  }

  return errors
}

function sortCandidates(candidates) {
  return [...candidates].sort((a, b) => {
    const cityCompare = String(a.city).localeCompare(String(b.city))
    if (cityCompare !== 0) return cityCompare

    const dateCompare = String(a.startDate || '').localeCompare(String(b.startDate || ''))
    if (dateCompare !== 0) return dateCompare

    return String(a.id).localeCompare(String(b.id))
  })
}

function buildCandidate(seed, dateEntry) {
  const id = `${seed.city.toLowerCase()}-${dateEntry.startDate}-${slugify(seed.title)}`

  return {
    id,
    city: seed.city,
    title: dateEntry.title || seed.title,
    startDate: dateEntry.startDate,
    endDate: dateEntry.endDate,
    sourceUrl: dateEntry.sourceUrl || seed.sourceUrl,
    sourceLabel: dateEntry.sourceLabel || seed.sourceLabel,
    detectedFrom: `known-event-seed:${seed.id}`,
    confidence: dateEntry.confidence || 'medium',
    candidateReason: seed.candidateReason,
    suggestedCategory: seed.category,
    suggestedPressureLevel: seed.defaultPressureLevel,
    suggestedImpact: seed.suggestedImpact,
    suggestedAction: seed.suggestedAction,
    suggestedAreas: seed.suggestedAreas || [],
    sourceType: seed.sourceType,
  }
}

async function main() {
  const { SUPPORTED_EVENT_PRESSURE_CITIES } = await import(pathToFileURL(schemaPath).href)

  const seeds = await readJson(seedsPath, [])
  const existingCandidates = await readJson(candidatesPath, [])
  const generatedNotes = await readJson(generatedPath, [])

  if (!Array.isArray(seeds)) {
    throw new Error('eventPressureKnownEvents.json must contain an array.')
  }

  if (!Array.isArray(existingCandidates)) {
    throw new Error('eventPressureCandidates.generated.json must contain an array.')
  }

  if (!Array.isArray(generatedNotes)) {
    throw new Error('eventPressureNotes.generated.json must contain an array.')
  }

  const generatedNoteIds = new Set(generatedNotes.map((note) => note.id))

  const seedErrors = seeds.flatMap((seed, index) =>
    validateSeed(seed, SUPPORTED_EVENT_PRESSURE_CITIES).map((error) => `seeds[${index}]: ${error}`),
  )

  if (seedErrors.length > 0) {
    console.error('Known event seed validation failed:')
    for (const error of seedErrors) {
      console.error(`- ${error}`)
    }
    process.exit(1)
  }

  const seededCandidates = seeds
    .flatMap((seed) => seed.knownDates.map((dateEntry) => buildCandidate(seed, dateEntry)))
    .filter((candidate) => !generatedNoteIds.has(candidate.id))

  const existingManualCandidates = existingCandidates.filter(
    (candidate) => !String(candidate.detectedFrom || '').startsWith('known-event-seed:'),
  )

  const mergedCandidates = sortCandidates([
    ...existingManualCandidates,
    ...seededCandidates,
  ])

  await fs.writeFile(candidatesPath, `${JSON.stringify(mergedCandidates, null, 2)}\n`)

  console.log(`Validated ${seeds.length} known event seeds.`)
  console.log(`Generated ${seededCandidates.length} candidates from known event seeds.`)
  console.log(`Wrote ${mergedCandidates.length} total event pressure candidates.`)
}

main().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
