import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

const knownEventsPath = path.join(repoRoot, 'src/data/eventPressureKnownEvents.json')

function addError(errors, seed, message) {
  errors.push(`${seed.id || '(missing id)'}: ${message}`)
}

function validateStringArray(value, fieldName, seed, errors) {
  if (!Array.isArray(value)) {
    addError(errors, seed, `${fieldName} must be an array.`)
    return
  }

  value.forEach((item, index) => {
    if (typeof item !== 'string' || item.trim() === '') {
      addError(errors, seed, `${fieldName}[${index}] must be a non-empty string.`)
    }
  })
}

function validatePreferredMonths(value, seed, errors) {
  if (!Array.isArray(value)) {
    addError(errors, seed, 'dateExtraction.preferredMonths must be an array.')
    return
  }

  if (value.length === 0) {
    addError(errors, seed, 'dateExtraction.preferredMonths must not be empty.')
  }

  value.forEach((month, index) => {
    if (!Number.isInteger(month) || month < 1 || month > 12) {
      addError(errors, seed, `dateExtraction.preferredMonths[${index}] must be an integer from 1 to 12.`)
    }
  })
}

function validateDateExtraction(seed, errors) {
  const profile = seed.dateExtraction

  if (!profile || typeof profile !== 'object' || Array.isArray(profile)) {
    addError(errors, seed, 'dateExtraction must be an object.')
    return
  }

  validatePreferredMonths(profile.preferredMonths, seed, errors)
  validateStringArray(profile.titleKeywords, 'dateExtraction.titleKeywords', seed, errors)

  const allowedKeys = new Set(['preferredMonths', 'titleKeywords'])
  for (const key of Object.keys(profile)) {
    if (!allowedKeys.has(key)) {
      addError(errors, seed, `dateExtraction.${key} is not supported.`)
    }
  }
}

async function main() {
  const knownEvents = JSON.parse(await fs.readFile(knownEventsPath, 'utf8'))

  if (!Array.isArray(knownEvents)) {
    throw new Error('Known event seeds must be an array.')
  }

  const errors = []

  for (const seed of knownEvents) {
    if (!seed || typeof seed !== 'object' || Array.isArray(seed)) {
      errors.push('Known event seed must be an object.')
      continue
    }

    if (typeof seed.id !== 'string' || seed.id.trim() === '') {
      addError(errors, seed, 'id must be a non-empty string.')
    }

    validateDateExtraction(seed, errors)
  }

  console.log('Known event profile validation')
  console.log('==============================')
  console.log(`Known event seeds: ${knownEvents.length}`)
  console.log(`Profile errors: ${errors.length}`)

  if (errors.length > 0) {
    console.log('')
    console.log('Errors')
    console.log('------')
    errors.forEach((error) => console.log(`- ${error}`))
    process.exit(1)
  }
}

main().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
