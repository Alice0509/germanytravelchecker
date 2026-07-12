import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { findCopySafetyErrors } from './lib/eventPressureCopySafety.js'

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
    errors.push(...findCopySafetyErrors(items, file.label))
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
