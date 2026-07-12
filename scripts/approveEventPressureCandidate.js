import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

const candidatesPath = path.join(repoRoot, 'src/data/eventPressureCandidates.generated.json')
const generatedPath = path.join(repoRoot, 'src/data/eventPressureNotes.generated.json')
const schemaPath = path.join(repoRoot, 'src/data/eventPressureNotesSchema.js')
const utilsPath = path.join(repoRoot, 'src/utils/eventPressureNotes.js')

function getArgValue(args, name) {
  const index = args.indexOf(`--${name}`)
  if (index === -1) return ''
  return args[index + 1] || ''
}

function hasFlag(args, name) {
  return args.includes(`--${name}`)
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
  npm run event-pressure:approve -- \\
    --id candidate-id \\
    --checked-at 2026-07-12

Required:
  --id candidate-id

Recommended:
  --checked-at 2026-07-12
  --state Bavaria
  --venue "Allianz Arena"
  --areas "stations,hotels,late-night transport"

Optional overrides:
  --generated-id custom-generated-note-id
  --title "Reviewed title"
  --category stadium_event
  --level high
  --impact "Major event dates may affect public transport, hotels and late-night travel."
  --action "Add buffer time and verify official sources before travelling."
  --source-type official_venue
  --confidence high
  --display-mode banner
  --replace

Candidate defaults:
  category, level, impact, action, source-type, confidence and areas are read from the candidate when available.
`)
}

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

function sortNotes(notes) {
  return [...notes].sort((a, b) => {
    const dateCompare = String(a.startDate).localeCompare(String(b.startDate))
    if (dateCompare !== 0) return dateCompare

    const cityCompare = String(a.city).localeCompare(String(b.city))
    if (cityCompare !== 0) return cityCompare

    return String(a.id).localeCompare(String(b.id))
  })
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

  const candidateId = requireValue(args, 'id')

  const candidates = await readJson(candidatesPath, [])
  const generatedNotes = await readJson(generatedPath, [])

  if (!Array.isArray(candidates)) {
    throw new Error('eventPressureCandidates.generated.json must contain an array.')
  }

  if (!Array.isArray(generatedNotes)) {
    throw new Error('eventPressureNotes.generated.json must contain an array.')
  }

  const candidate = candidates.find((item) => item.id === candidateId)

  if (!candidate) {
    throw new Error(`Candidate not found: ${candidateId}`)
  }

  const category = getArgValue(args, 'category') || candidate.suggestedCategory
  const pressureLevel = getArgValue(args, 'level') || candidate.suggestedPressureLevel
  const travelerImpact = getArgValue(args, 'impact') || candidate.suggestedImpact
  const recommendedAction = getArgValue(args, 'action') || candidate.suggestedAction
  const sourceType = getArgValue(args, 'source-type') || candidate.sourceType || candidate.suggestedSourceType
  const confidence = getArgValue(args, 'confidence') || candidate.confidence || 'medium'

  for (const [name, value] of [
    ['category', category],
    ['level', pressureLevel],
    ['impact', travelerImpact],
    ['action', recommendedAction],
    ['source-type', sourceType],
  ]) {
    if (!value) {
      throw new Error(`Missing required value: --${name} or candidate default`)
    }
  }

  const generatedId =
    getArgValue(args, 'generated-id') ||
    `${slugify(candidate.city)}-${candidate.startDate || 'undated'}-${slugify(candidate.title)}`

  const note = {
    id: generatedId,
    city: candidate.city,
    startDate: candidate.startDate,
    endDate: candidate.endDate || candidate.startDate,
    category,
    pressureLevel,
    title: getArgValue(args, 'title') || candidate.title,
    travelerImpact,
    recommendedAction,
    verifyLinks: [
      {
        label: candidate.sourceLabel,
        url: candidate.sourceUrl,
      },
    ],
    sourceType,
    sourceCheckedAt: getArgValue(args, 'checked-at') || new Date().toISOString().slice(0, 10),
    confidence,
    displayMode: getArgValue(args, 'display-mode') || 'banner',
  }

  const state = getArgValue(args, 'state') || candidate.state || ''
  const venue = getArgValue(args, 'venue') || candidate.venue || ''
  const affectedAreas = splitList(getArgValue(args, 'areas'))
  const candidateAreas = Array.isArray(candidate.suggestedAreas) ? candidate.suggestedAreas : []
  const finalAffectedAreas = affectedAreas.length > 0 ? affectedAreas : candidateAreas

  if (state) note.state = state
  if (venue) note.venue = venue
  if (finalAffectedAreas.length > 0) note.affectedAreas = finalAffectedAreas

  const noteErrors = validateEventPressureNote(note)

  if (noteErrors.length > 0) {
    console.error('Approved event pressure note is invalid:')
    for (const error of noteErrors) {
      console.error(`- ${error}`)
    }
    process.exit(1)
  }

  const existingIndex = generatedNotes.findIndex((existingNote) => existingNote.id === note.id)
  const shouldReplace = hasFlag(args, 'replace')

  if (existingIndex >= 0 && !shouldReplace) {
    throw new Error(`A generated note with id "${note.id}" already exists. Use --replace to update it.`)
  }

  const nextGeneratedNotes =
    existingIndex >= 0
      ? generatedNotes.map((existingNote, index) => (index === existingIndex ? note : existingNote))
      : [...generatedNotes, note]

  const generatedErrors = validateEventPressureNotes(nextGeneratedNotes)

  if (generatedErrors.length > 0) {
    console.error('Generated event pressure notes would be invalid:')
    for (const error of generatedErrors) {
      console.error(`- ${error}`)
    }
    process.exit(1)
  }

  const nextCandidates = candidates.filter((item) => item.id !== candidateId)

  await fs.writeFile(generatedPath, `${JSON.stringify(sortNotes(nextGeneratedNotes), null, 2)}\n`)
  await fs.writeFile(candidatesPath, `${JSON.stringify(sortCandidates(nextCandidates), null, 2)}\n`)

  console.log(`Approved candidate: ${candidateId}`)
  console.log(`Generated note: ${note.id}`)
  console.log(`Remaining candidates: ${nextCandidates.length}`)
  console.log(`Generated event pressure note count: ${nextGeneratedNotes.length}`)
}

main().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
