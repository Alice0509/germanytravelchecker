import fs from 'node:fs/promises'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'
import {
  buildCopySafetyMarkdown,
  changedItems,
} from './lib/eventPressureCopySafetyReport.js'

const execFileAsync = promisify(execFile)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

const modeArg = process.argv.find((arg) => arg.startsWith('--mode='))
const mode = modeArg ? modeArg.replace('--mode=', '') : 'all'

const appendToArg = process.argv.find((arg) => arg.startsWith('--append-to='))
const appendTo = appendToArg ? appendToArg.replace('--append-to=', '') : ''

const candidatesPath = 'src/data/eventPressureCandidates.generated.json'
const generatedPath = 'src/data/eventPressureNotes.generated.json'

async function readJson(relativePath, fallback) {
  try {
    return JSON.parse(await fs.readFile(path.join(repoRoot, relativePath), 'utf8'))
  } catch (error) {
    if (error.code === 'ENOENT') return fallback
    throw error
  }
}

async function readHeadJson(relativePath, fallback) {
  try {
    const { stdout } = await execFileAsync('git', ['show', `HEAD:${relativePath}`], {
      cwd: repoRoot,
      maxBuffer: 1024 * 1024 * 10,
    })
    return JSON.parse(stdout)
  } catch {
    return fallback
  }
}

async function getReportItems() {
  if (mode === 'candidate') {
    const [baseCandidates, currentCandidates] = await Promise.all([
      readHeadJson(candidatesPath, []),
      readJson(candidatesPath, []),
    ])

    return {
      label: 'changed candidate notes',
      items: changedItems(baseCandidates, currentCandidates),
    }
  }

  if (mode === 'promotion') {
    const [baseGenerated, currentGenerated] = await Promise.all([
      readHeadJson(generatedPath, []),
      readJson(generatedPath, []),
    ])

    return {
      label: 'changed generated notes',
      items: changedItems(baseGenerated, currentGenerated),
    }
  }

  if (mode === 'all') {
    const [candidates, generated] = await Promise.all([
      readJson(candidatesPath, []),
      readJson(generatedPath, []),
    ])

    return {
      label: 'all event pressure notes',
      items: [...generated, ...candidates],
    }
  }

  throw new Error('Usage: node scripts/reportEventPressureCopySafety.js --mode=all|candidate|promotion')
}

async function main() {
  const { label, items } = await getReportItems()
  const markdown = buildCopySafetyMarkdown({ label, items })

  console.log(markdown)

  if (appendTo) {
    const outputPath = path.join(repoRoot, appendTo)
    await fs.appendFile(outputPath, `\n${markdown}`)
    console.log(`Appended copy safety review to ${appendTo}`)
  }
}

main().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
