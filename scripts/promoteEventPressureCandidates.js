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

const shouldWrite = process.argv.includes('--write')
const includeLowConfidence = process.argv.includes('--include-low-confidence')
const checkedAtArg = process.argv.find((arg) => arg.startsWith('--checked-at='))

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

function getCheckedAt() {
  if (!checkedAtArg) return getGermanyDateKey()

  const value = checkedAtArg.slice('--checked-at='.length)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error('--checked-at must use YYYY-MM-DD format.')
  }

  return value
}

function isIsoDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function cleanPublicTitle(candidate) {
  return String(candidate.title || '')
    .replace(/\s+source scan$/i, '')
    .replace(/\s+/g, ' ')
    .trim()
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

function getPromotionSkipReason(candidate, existingNoteIds) {
  if (!isIsoDate(candidate.startDate)) {
    return 'missing valid startDate'
  }

  if (!isIsoDate(candidate.endDate)) {
    return 'missing valid endDate'
  }

  if (candidate.startDate > candidate.endDate) {
    return 'startDate is after endDate'
  }

  if (!includeLowConfidence && candidate.confidence === 'low') {
    return 'low confidence'
  }

  for (const [field, value] of [
    ['suggestedCategory', candidate.suggestedCategory],
    ['suggestedPressureLevel', candidate.suggestedPressureLevel],
    ['suggestedImpact', candidate.suggestedImpact],
    ['suggestedAction', candidate.suggestedAction],
    ['sourceType', candidate.sourceType],
    ['sourceUrl', candidate.sourceUrl],
    ['sourceLabel', candidate.sourceLabel],
  ]) {
    if (!value) {
      return `missing ${field}`
    }
  }

  const publicTitle = cleanPublicTitle(candidate)
  if (!publicTitle) {
    return 'missing public title'
  }

  const noteId = getGeneratedNoteId(candidate)
  if (existingNoteIds.has(noteId)) {
    return `generated note already exists: ${noteId}`
  }

  return ''
}

function getGeneratedNoteId(candidate) {
  const publicTitle = cleanPublicTitle(candidate)
  return `${slugify(candidate.city)}-${candidate.startDate}-${slugify(publicTitle)}`
}

function buildGeneratedNote(candidate, checkedAt) {
  const publicTitle = cleanPublicTitle(candidate)

  return {
    id: getGeneratedNoteId(candidate),
    city: candidate.city,
    startDate: candidate.startDate,
    endDate: candidate.endDate,
    category: candidate.suggestedCategory,
    pressureLevel: candidate.suggestedPressureLevel,
    title: publicTitle,
    travelerImpact: candidate.suggestedImpact,
    recommendedAction: candidate.suggestedAction,
    verifyLinks: [
      {
        label: candidate.sourceLabel,
        url: candidate.sourceUrl,
      },
    ],
    sourceType: candidate.sourceType,
    sourceCheckedAt: checkedAt,
    confidence: candidate.confidence || 'medium',
    displayMode: candidate.displayMode || 'banner',
    ...(candidate.state ? { state: candidate.state } : {}),
    ...(candidate.venue ? { venue: candidate.venue } : {}),
    ...(Array.isArray(candidate.suggestedAreas) && candidate.suggestedAreas.length > 0
      ? { affectedAreas: candidate.suggestedAreas }
      : {}),
  }
}

async function main() {
  const checkedAt = getCheckedAt()
  const { validateEventPressureNote } = await import(pathToFileURL(schemaPath).href)
  const { validateEventPressureNotes } = await import(pathToFileURL(utilsPath).href)

  const candidates = await readJson(candidatesPath, [])
  const generatedNotes = await readJson(generatedPath, [])

  if (!Array.isArray(candidates)) {
    throw new Error('eventPressureCandidates.generated.json must contain an array.')
  }

  if (!Array.isArray(generatedNotes)) {
    throw new Error('eventPressureNotes.generated.json must contain an array.')
  }

  const existingNoteIds = new Set(generatedNotes.map((note) => note.id))
  const promoted = []
  const skipped = []

  for (const candidate of candidates) {
    const skipReason = getPromotionSkipReason(candidate, existingNoteIds)

    if (skipReason) {
      skipped.push({ candidate, reason: skipReason })
      continue
    }

    const note = buildGeneratedNote(candidate, checkedAt)
    const noteErrors = validateEventPressureNote(note)

    if (noteErrors.length > 0) {
      skipped.push({ candidate, reason: `generated note invalid: ${noteErrors.join('; ')}` })
      continue
    }

    promoted.push({ candidate, note })
    existingNoteIds.add(note.id)
  }

  const promotedCandidateIds = new Set(promoted.map((item) => item.candidate.id))
  const nextGeneratedNotes = sortNotes([
    ...generatedNotes,
    ...promoted.map((item) => item.note),
  ])
  const nextCandidates = sortCandidates(
    candidates.filter((candidate) => !promotedCandidateIds.has(candidate.id)),
  )

  const generatedErrors = validateEventPressureNotes(nextGeneratedNotes)

  if (generatedErrors.length > 0) {
    console.error('Generated event pressure notes would be invalid:')
    for (const error of generatedErrors) {
      console.error(`- ${error}`)
    }
    process.exit(1)
  }

  console.log('Event pressure candidate promotion')
  console.log('==================================')
  console.log(`Write mode: ${shouldWrite ? 'yes' : 'no'}`)
  console.log(`Checked at: ${checkedAt}`)
  console.log(`Candidates: ${candidates.length}`)
  console.log(`Promotable candidates: ${promoted.length}`)
  console.log(`Skipped candidates: ${skipped.length}`)

  if (promoted.length > 0) {
    console.log('')
    console.log('Would promote')
    console.log('-------------')
    for (const item of promoted) {
      console.log(`- ${item.candidate.id} -> ${item.note.id}`)
    }
  }

  if (skipped.length > 0) {
    console.log('')
    console.log('Skipped')
    console.log('-------')
    for (const item of skipped) {
      console.log(`- ${item.candidate.id}: ${item.reason}`)
    }
  }

  if (!shouldWrite) {
    console.log('')
    console.log('Report only. Re-run with --write to update generated notes and remove promoted candidates.')
    return
  }

  await fs.writeFile(generatedPath, `${JSON.stringify(nextGeneratedNotes, null, 2)}\n`)
  await fs.writeFile(candidatesPath, `${JSON.stringify(nextCandidates, null, 2)}\n`)

  console.log('')
  console.log(`Wrote generated notes: ${nextGeneratedNotes.length}`)
  console.log(`Remaining candidates: ${nextCandidates.length}`)
}

main().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
