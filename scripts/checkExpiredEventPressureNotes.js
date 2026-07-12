import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

const generatedNotesPath = path.join(repoRoot, 'src/data/eventPressureNotes.generated.json')
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

function isExpired(note, todayDateKey) {
  return note.endDate < todayDateKey
}

function formatNote(note) {
  return `${note.city} · ${note.title} · ${note.startDate} to ${note.endDate} · ${note.id}`
}

async function main() {
  const { validateEventPressureNote } = await import(pathToFileURL(schemaPath).href)

  const notes = await readJson(generatedNotesPath, [])

  if (!Array.isArray(notes)) {
    throw new Error('eventPressureNotes.generated.json must contain an array.')
  }

  const validationErrors = notes.flatMap((note, index) =>
    validateEventPressureNote(note).map((error) => `notes[${index}]: ${error}`),
  )

  if (validationErrors.length > 0) {
    console.error('Generated event pressure note validation failed:')
    for (const error of validationErrors) {
      console.error(`- ${error}`)
    }
    process.exit(1)
  }

  const todayDateKey = getTodayOverride() || getGermanyDateKey()
  const expiredNotes = notes.filter((note) => isExpired(note, todayDateKey))

  console.log('Expired event pressure notes')
  console.log('============================')
  console.log(`Germany date: ${todayDateKey}`)
  console.log(`Generated notes: ${notes.length}`)
  console.log(`Expired notes: ${expiredNotes.length}`)

  if (expiredNotes.length > 0) {
    console.log('')
    console.log('Needs removal or archival')
    console.log('------------------------')
    for (const note of expiredNotes) {
      console.log(`- ${formatNote(note)}`)
    }
  }

  if (isStrict && expiredNotes.length > 0) {
    console.error('')
    console.error('Expired generated event pressure notes found.')
    console.error('Remove them from eventPressureNotes.generated.json or move them to an archive before merging.')
    process.exit(1)
  }
}

main().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
