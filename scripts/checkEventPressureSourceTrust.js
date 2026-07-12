import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  buildTrustedHosts,
  findSourceTrustErrors,
} from './lib/eventPressureSourceTrust.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

const sourceFiles = [
  'src/data/eventPressureSources.json',
  'src/data/eventPressureKnownEvents.json',
]

const noteFiles = [
  {
    label: 'generated notes',
    path: 'src/data/eventPressureNotes.generated.json',
  },
  {
    label: 'candidate notes',
    path: 'src/data/eventPressureCandidates.generated.json',
  },
]

async function readJson(relativePath, fallback) {
  try {
    return JSON.parse(await fs.readFile(path.join(repoRoot, relativePath), 'utf8'))
  } catch (error) {
    if (error.code === 'ENOENT') return fallback
    throw error
  }
}

async function main() {
  const sourceCollections = await Promise.all(
    sourceFiles.map((file) => readJson(file, [])),
  )

  const trustedHosts = buildTrustedHosts(sourceCollections)
  const errors = []

  for (const noteFile of noteFiles) {
    const notes = await readJson(noteFile.path, [])
    errors.push(...findSourceTrustErrors(notes, trustedHosts, noteFile.label))
  }

  console.log('Event pressure source trust')
  console.log('===========================')
  console.log(`Trusted hosts: ${trustedHosts.size}`)
  console.log(`Errors: ${errors.length}`)

  if (errors.length > 0) {
    console.log('')
    console.log('Source trust errors')
    console.log('-------------------')
    errors.forEach((error) => console.log(`- ${error}`))
    process.exit(1)
  }
}

main().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
