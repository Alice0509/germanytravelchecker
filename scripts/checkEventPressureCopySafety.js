import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

const files = [
  {
    label: 'generated notes',
    path: path.join(repoRoot, 'src/data/eventPressureNotes.generated.json'),
  },
  {
    label: 'candidate notes',
    path: path.join(repoRoot, 'src/data/eventPressureCandidates.generated.json'),
  },
]

const checkedFields = [
  'title',
  'travelerImpact',
  'recommendedAction',
  'note',
  'reviewNote',
  'sourceNote',
]

const forbiddenPatterns = [
  {
    pattern: /\blive\b/i,
    reason: 'Do not imply live status.',
  },
  {
    pattern: /\breal[-\s]?time\b/i,
    reason: 'Do not imply real-time status.',
  },
  {
    pattern: /\bcurrently\b/i,
    reason: 'Avoid current-state claims.',
  },
  {
    pattern: /\bright now\b/i,
    reason: 'Avoid current-state claims.',
  },
  {
    pattern: /\bcrowded\b/i,
    reason: 'Avoid claiming crowd conditions.',
  },
  {
    pattern: /\bpacked\b/i,
    reason: 'Avoid claiming crowd conditions.',
  },
  {
    pattern: /\bfully booked\b/i,
    reason: 'Avoid hotel/availability claims.',
  },
  {
    pattern: /\bsold out\b/i,
    reason: 'Avoid availability claims.',
  },
  {
    pattern: /\btrains? (are|is|will be) (delayed|cancelled|disrupted)\b/i,
    reason: 'Avoid train status claims.',
  },
  {
    pattern: /\bshops? (are|is|will be) closed\b/i,
    reason: 'Avoid blanket shop closure claims.',
  },
  {
    pattern: /\ball shops\b/i,
    reason: 'Avoid blanket shop closure claims.',
  },
  {
    pattern: /\ball trains\b/i,
    reason: 'Avoid blanket train claims.',
  },
]

function collectTextValues(item) {
  const values = []

  for (const field of checkedFields) {
    const value = item[field]
    if (typeof value === 'string') {
      values.push({ field, value })
    }
  }

  if (Array.isArray(item.reasons)) {
    item.reasons.forEach((value, index) => {
      if (typeof value === 'string') {
        values.push({ field: `reasons[${index}]`, value })
      }
    })
  }

  return values
}

async function readJson(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'))
  } catch (error) {
    if (error.code === 'ENOENT') return []
    throw error
  }
}

async function main() {
  const errors = []

  for (const file of files) {
    const items = await readJson(file.path)

    if (!Array.isArray(items)) {
      errors.push(`${file.label}: expected array`)
      continue
    }

    for (const item of items) {
      const id = item.id || '(missing id)'

      for (const { field, value } of collectTextValues(item)) {
        for (const forbidden of forbiddenPatterns) {
          if (forbidden.pattern.test(value)) {
            errors.push(`${file.label} · ${id} · ${field}: ${forbidden.reason} Matched "${forbidden.pattern}".`)
          }
        }
      }
    }
  }

  console.log('Event pressure copy safety')
  console.log('==========================')
  console.log(`Errors: ${errors.length}`)

  if (errors.length > 0) {
    console.log('')
    console.log('Copy safety errors')
    console.log('------------------')
    errors.forEach((error) => console.log(`- ${error}`))
    process.exit(1)
  }
}

main().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
