import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

const generatedPath = path.join(repoRoot, 'src/data/eventPressureNotes.generated.json')
const utilsPath = path.join(repoRoot, 'src/utils/eventPressureNotes.js')
const schemaPath = path.join(repoRoot, 'src/data/eventPressureNotesSchema.js')

function getArgValue(args, name) {
  const index = args.indexOf(`--${name}`)
  if (index === -1) return ''
  return args[index + 1] || ''
}

function hasFlag(args, name) {
  return args.includes(`--${name}`)
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function splitList(value) {
  if (!value) return []
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function printHelp() {
  console.log(`
Usage:
  npm run event-pressure:add -- \\
    --city Munich \\
    --start 2026-07-11 \\
    --end 2026-07-12 \\
    --category stadium_event \\
    --level high \\
    --title "Major stadium event" \\
    --impact "Large event dates may affect U-Bahn connections, hotels, stations and late-night travel." \\
    --action "Add buffer time and verify official venue and transport sources before travelling." \\
    --source-type official_venue \\
    --source-label "Official venue information" \\
    --source-url "https://example.com/official-venue"

Optional:
  --id custom-id
  --state Bavaria
  --venue "Allianz Arena"
  --areas "Fröttmaning,U-Bahn,hotels"
  --confidence medium
  --display-mode banner
  --checked-at 2026-07-11
  --replace
`)
}

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

function sortNotes(notes) {
  return [...notes].sort((a, b) => {
    const dateCompare = String(a.startDate).localeCompare(String(b.startDate))
    if (dateCompare !== 0) return dateCompare

    const cityCompare = String(a.city).localeCompare(String(b.city))
    if (cityCompare !== 0) return cityCompare

    return String(a.id).localeCompare(String(b.id))
  })
}

function requireValue(args, name) {
  const value = getArgValue(args, name)
  if (!value) {
    throw new Error(`Missing required argument: --${name}`)
  }

  return value
}

async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0 || hasFlag(args, 'help')) {
    printHelp()
    return
  }

  const { validateEventPressureNote } = await import(pathToFileURL(schemaPath).href)
  const { validateEventPressureNotes } = await import(pathToFileURL(utilsPath).href)

  const city = requireValue(args, 'city')
  const startDate = requireValue(args, 'start')
  const endDate = requireValue(args, 'end')
  const category = requireValue(args, 'category')
  const pressureLevel = requireValue(args, 'level')
  const title = requireValue(args, 'title')
  const travelerImpact = requireValue(args, 'impact')
  const recommendedAction = requireValue(args, 'action')
  const sourceType = requireValue(args, 'source-type')
  const sourceLabel = requireValue(args, 'source-label')
  const sourceUrl = requireValue(args, 'source-url')

  const id =
    getArgValue(args, 'id') ||
    `${slugify(city)}-${startDate}-${slugify(title || category)}`

  const note = {
    id,
    city,
    startDate,
    endDate,
    category,
    pressureLevel,
    title,
    travelerImpact,
    recommendedAction,
    verifyLinks: [
      {
        label: sourceLabel,
        url: sourceUrl,
      },
    ],
    sourceType,
    sourceCheckedAt: getArgValue(args, 'checked-at') || new Date().toISOString().slice(0, 10),
    confidence: getArgValue(args, 'confidence') || 'medium',
    displayMode: getArgValue(args, 'display-mode') || 'banner',
  }

  const state = getArgValue(args, 'state')
  const venue = getArgValue(args, 'venue')
  const affectedAreas = splitList(getArgValue(args, 'areas'))

  if (state) note.state = state
  if (venue) note.venue = venue
  if (affectedAreas.length > 0) note.affectedAreas = affectedAreas

  const noteErrors = validateEventPressureNote(note)

  if (noteErrors.length > 0) {
    console.error('New event pressure note is invalid:')
    for (const error of noteErrors) {
      console.error(`- ${error}`)
    }
    process.exit(1)
  }

  const existingNotes = await readJson(generatedPath, [])

  if (!Array.isArray(existingNotes)) {
    throw new Error('eventPressureNotes.generated.json must contain an array.')
  }

  const existingIndex = existingNotes.findIndex((existingNote) => existingNote.id === note.id)
  const shouldReplace = hasFlag(args, 'replace')

  if (existingIndex >= 0 && !shouldReplace) {
    throw new Error(`A note with id "${note.id}" already exists. Use --replace to update it.`)
  }

  const nextNotes =
    existingIndex >= 0
      ? existingNotes.map((existingNote, index) => (index === existingIndex ? note : existingNote))
      : [...existingNotes, note]

  const allErrors = validateEventPressureNotes(nextNotes)

  if (allErrors.length > 0) {
    console.error('Generated event pressure notes would be invalid:')
    for (const error of allErrors) {
      console.error(`- ${error}`)
    }
    process.exit(1)
  }

  const sortedNotes = sortNotes(nextNotes)
  await fs.writeFile(generatedPath, `${JSON.stringify(sortedNotes, null, 2)}\n`)

  console.log(existingIndex >= 0 ? `Replaced note: ${note.id}` : `Added note: ${note.id}`)
  console.log(`Generated event pressure note count: ${sortedNotes.length}`)
}

main().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
