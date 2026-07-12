import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

const candidatesPath = path.join(repoRoot, 'src/data/eventPressureCandidates.generated.json')
const discoverScriptPath = path.join(repoRoot, 'scripts/discoverEventPressureCandidates.js')

async function readJson(filePath, fallback) {
  try {
    const content = await fs.readFile(filePath, 'utf8')
    return JSON.parse(content)
  } catch (error) {
    if (error.code === 'ENOENT') return fallback
    throw error
  }
}

function printUsage() {
  console.log(`Usage:
  npm run event-pressure:import-candidates -- <path-to-candidate-json>

Example:
  npm run event-pressure:import-candidates -- ~/Downloads/eventPressureCandidates.generated.json

Notes:
  - Existing candidates are merged by id
  - Imported candidates replace existing candidates with the same id
  - The helper writes src/data/eventPressureCandidates.generated.json
`)
}

function resolveImportPath(value) {
  if (!value) return ''

  if (value.startsWith('~/')) {
    return path.join(process.env.HOME || '', value.slice(2))
  }

  return path.resolve(process.cwd(), value)
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

function mergeCandidates(existingCandidates, importedCandidates) {
  const byId = new Map()

  for (const candidate of existingCandidates) {
    byId.set(candidate.id, candidate)
  }

  for (const candidate of importedCandidates) {
    byId.set(candidate.id, candidate)
  }

  return sortCandidates([...byId.values()])
}

async function validateCandidates() {
  await import(pathToFileURL(discoverScriptPath).href)
}

async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0 || args.includes('--help')) {
    printUsage()
    return
  }

  const importPath = resolveImportPath(args[0])

  if (!importPath) {
    throw new Error('Missing import file path.')
  }

  const [existingCandidates, importedCandidates] = await Promise.all([
    readJson(candidatesPath, []),
    readJson(importPath, null),
  ])

  if (!Array.isArray(existingCandidates)) {
    throw new Error('eventPressureCandidates.generated.json must contain an array.')
  }

  if (!Array.isArray(importedCandidates)) {
    throw new Error('Import file must contain a candidate array.')
  }

  const mergedCandidates = mergeCandidates(existingCandidates, importedCandidates)

  await fs.writeFile(candidatesPath, `${JSON.stringify(mergedCandidates, null, 2)}\n`)

  console.log('Imported event pressure candidates')
  console.log('==================================')
  console.log(`Import file: ${importPath}`)
  console.log(`Existing candidates: ${existingCandidates.length}`)
  console.log(`Imported candidates: ${importedCandidates.length}`)
  console.log(`Merged candidates: ${mergedCandidates.length}`)

  await validateCandidates()
}

main().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
