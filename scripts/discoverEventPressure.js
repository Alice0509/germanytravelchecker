import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

const generatedPath = path.join(repoRoot, 'src/data/eventPressureNotes.generated.json')
const sourcesPath = path.join(repoRoot, 'src/data/eventPressureSources.json')
const utilsPath = path.join(repoRoot, 'src/utils/eventPressureNotes.js')
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


function validateSources(sources) {
  const errors = []

  if (!Array.isArray(sources)) {
    return ['eventPressureSources.json must contain an array.']
  }

  sources.forEach((source, index) => {
    const prefix = `sources[${index}]`

    for (const field of ['city', 'sourceRole', 'sourceType', 'priority', 'label', 'url']) {
      if (!(field in source)) {
        errors.push(`${prefix}: Missing required field: ${field}`)
      }
    }

    if (typeof source.priority !== 'number') {
      errors.push(`${prefix}: priority must be a number.`)
    }

    if (typeof source.url !== 'string' || !source.url.startsWith('https://')) {
      errors.push(`${prefix}: url must be an https URL.`)
    }
  })

  return errors
}


function validateSourceCoverage(sources, supportedCities) {
  const errors = []

  for (const city of supportedCities) {
    const citySources = sources.filter((source) => source.city === city)

    if (citySources.length === 0) {
      errors.push(`Missing event pressure sources for city: ${city}`)
      continue
    }

    if (!citySources.some((source) => source.sourceType === 'official_city')) {
      errors.push(`Missing official_city source for city: ${city}`)
    }

    if (!citySources.some((source) => ['official_tourism', 'official_city'].includes(source.sourceType))) {
      errors.push(`Missing event/tourism source for city: ${city}`)
    }
  }

  const unsupportedCities = [...new Set(sources.map((source) => source.city))]
    .filter((city) => !supportedCities.includes(city))

  for (const city of unsupportedCities) {
    errors.push(`Unsupported city in event pressure sources: ${city}`)
  }

  return errors
}

function sortNotes(notes) {
  return [...notes].sort((a, b) => {
    const dateCompare = String(a.startDate).localeCompare(String(b.startDate))
    if (dateCompare !== 0) return dateCompare

    const cityCompare = String(a.city).localeCompare(String(b.city))
    if (cityCompare !== 0) return cityCompare

    return String(a.id).localeCompare(String(b.id))
  })
}

async function main() {
  const { validateEventPressureNotes } = await import(pathToFileURL(utilsPath).href)
  const { SUPPORTED_EVENT_PRESSURE_CITIES } = await import(pathToFileURL(schemaPath).href)

  const sources = await readJson(sourcesPath, [])
  const notes = await readJson(generatedPath, [])

  const sourceErrors = [
    ...validateSources(sources),
    ...validateSourceCoverage(sources, SUPPORTED_EVENT_PRESSURE_CITIES),
  ]

  if (sourceErrors.length > 0) {
    console.error('Event pressure source validation failed:')
    for (const error of sourceErrors) {
      console.error(`- ${error}`)
    }
    process.exit(1)
  }

  if (!Array.isArray(notes)) {
    throw new Error('eventPressureNotes.generated.json must contain an array.')
  }

  const errors = validateEventPressureNotes(notes)

  if (errors.length > 0) {
    console.error('Event pressure note validation failed:')
    for (const error of errors) {
      console.error(`- ${error}`)
    }
    process.exit(1)
  }

  const sortedNotes = sortNotes(notes)
  await fs.writeFile(generatedPath, `${JSON.stringify(sortedNotes, null, 2)}\n`)

  console.log(`Checked ${sources.length} event pressure source entries across ${SUPPORTED_EVENT_PRESSURE_CITIES.length} supported cities.`)
  console.log(`Validated ${sortedNotes.length} generated event pressure notes.`)
  console.log('Wrote sorted generated event pressure JSON.')
  console.log('External discovery is intentionally not enabled yet.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
