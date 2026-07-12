import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

const generatedPath = path.join(repoRoot, 'src/data/eventPressureNotes.generated.json')
const candidatesPath = path.join(repoRoot, 'src/data/eventPressureCandidates.generated.json')
const sourcesPath = path.join(repoRoot, 'src/data/eventPressureSources.json')
const schemaPath = path.join(repoRoot, 'src/data/eventPressureNotesSchema.js')
const utilsPath = path.join(repoRoot, 'src/utils/eventPressureNotes.js')

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

function groupByCity(items) {
  return items.reduce((groups, item) => {
    const city = item.city || 'Unknown'
    groups[city] = groups[city] || []
    groups[city].push(item)
    return groups
  }, {})
}

function hasPlaceholderUrl(note) {
  return note.verifyLinks?.some((link) => String(link.url || '').includes('example.com'))
}

async function main() {
  const { SUPPORTED_EVENT_PRESSURE_CITIES } = await import(pathToFileURL(schemaPath).href)
  const { validateEventPressureNotes } = await import(pathToFileURL(utilsPath).href)

  const sources = await readJson(sourcesPath, [])
  const notes = await readJson(generatedPath, [])
  const candidates = await readJson(candidatesPath, [])

  const noteErrors = validateEventPressureNotes(notes)
  const sourcesByCity = groupByCity(sources)
  const notesByCity = groupByCity(notes)

  const citiesWithNotes = SUPPORTED_EVENT_PRESSURE_CITIES.filter(
    (city) => (notesByCity[city] || []).length > 0,
  )

  const citiesWithoutNotes = SUPPORTED_EVENT_PRESSURE_CITIES.filter(
    (city) => (notesByCity[city] || []).length === 0,
  )

  const placeholderNotes = notes.filter(hasPlaceholderUrl)

  console.log('Event pressure report')
  console.log('=====================')
  console.log(`Supported cities: ${SUPPORTED_EVENT_PRESSURE_CITIES.length}`)
  console.log(`Source entries: ${sources.length}`)
  console.log(`Generated notes: ${notes.length}`)
  console.log(`Candidate notes: ${Array.isArray(candidates) ? candidates.length : 'invalid'}`)
  console.log(`Validation errors: ${noteErrors.length}`)
  console.log('')

  console.log('City coverage')
  console.log('-------------')
  for (const city of SUPPORTED_EVENT_PRESSURE_CITIES) {
    const citySources = sourcesByCity[city] || []
    const cityNotes = notesByCity[city] || []
    const sourceRoles = [...new Set(citySources.map((source) => source.sourceRole))]
      .filter(Boolean)
      .join(', ')

    console.log(
      `${city}: ${cityNotes.length} note${cityNotes.length === 1 ? '' : 's'}, ${citySources.length} source${citySources.length === 1 ? '' : 's'}${sourceRoles ? ` (${sourceRoles})` : ''}`,
    )
  }

  console.log('')
  console.log(`Cities with generated notes: ${citiesWithNotes.length > 0 ? citiesWithNotes.join(', ') : 'None'}`)
  console.log(`Cities without generated notes: ${citiesWithoutNotes.length > 0 ? citiesWithoutNotes.join(', ') : 'None'}`)

  if (placeholderNotes.length > 0) {
    console.log('')
    console.log('Placeholder URLs found:')
    for (const note of placeholderNotes) {
      console.log(`- ${note.id}`)
    }
  }

  if (noteErrors.length > 0) {
    console.log('')
    console.log('Validation errors:')
    for (const error of noteErrors) {
      console.log(`- ${error}`)
    }

    process.exit(1)
  }

  if (placeholderNotes.length > 0) {
    process.exit(1)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
