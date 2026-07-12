import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

const candidatesPath = path.join(repoRoot, 'src/data/eventPressureCandidates.generated.json')
const sourcesPath = path.join(repoRoot, 'src/data/eventPressureSources.json')
const schemaPath = path.join(repoRoot, 'src/data/eventPressureNotesSchema.js')

async function readJson(filePath, fallback) {
  try {
    const content = await fs.readFile(filePath, 'utf8')
    return JSON.parse(content)
  } catch (error) {
    if (error.code === 'ENOENT') {
      return fallback
    }

    throw error
  }
}

function isIsoDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function validateCandidate(candidate, supportedCities) {
  const errors = []

  for (const field of ['id', 'city', 'title', 'sourceUrl', 'sourceLabel', 'detectedFrom']) {
    if (!(field in candidate)) {
      errors.push(`Missing required field: ${field}`)
    }
  }

  if ('city' in candidate && !supportedCities.includes(candidate.city)) {
    errors.push(`Unsupported city: ${candidate.city}`)
  }

  if ('startDate' in candidate && candidate.startDate && !isIsoDate(candidate.startDate)) {
    errors.push('startDate must use YYYY-MM-DD format when provided.')
  }

  if ('endDate' in candidate && candidate.endDate && !isIsoDate(candidate.endDate)) {
    errors.push('endDate must use YYYY-MM-DD format when provided.')
  }

  if (candidate.startDate && candidate.endDate && candidate.startDate > candidate.endDate) {
    errors.push('startDate must be before or equal to endDate.')
  }

  if ('sourceUrl' in candidate && !String(candidate.sourceUrl).startsWith('https://')) {
    errors.push('sourceUrl must be an https URL.')
  }

  return errors
}

function validateCandidates(candidates, supportedCities) {
  if (!Array.isArray(candidates)) {
    return ['eventPressureCandidates.generated.json must contain an array.']
  }

  return candidates.flatMap((candidate, index) =>
    validateCandidate(candidate, supportedCities).map((error) => `candidates[${index}]: ${error}`),
  )
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

async function main() {
  const { SUPPORTED_EVENT_PRESSURE_CITIES } = await import(pathToFileURL(schemaPath).href)

  const sources = await readJson(sourcesPath, [])
  const candidates = await readJson(candidatesPath, [])

  const errors = validateCandidates(candidates, SUPPORTED_EVENT_PRESSURE_CITIES)

  if (errors.length > 0) {
    console.error('Event pressure candidate validation failed:')
    for (const error of errors) {
      console.error(`- ${error}`)
    }
    process.exit(1)
  }

  const sortedCandidates = sortCandidates(candidates)
  await fs.writeFile(candidatesPath, `${JSON.stringify(sortedCandidates, null, 2)}\n`)

  console.log(`Checked ${sources.length} event pressure source entries.`)
  console.log(`Validated ${sortedCandidates.length} event pressure candidates.`)
  console.log('Wrote sorted event pressure candidates JSON.')
  console.log('External candidate discovery is intentionally not enabled yet.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
