import fs from 'node:fs/promises'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'
import {
  buildTrustedHosts,
  collectNoteSourceUrls,
  findSourceTrustErrors,
  isTrustedUrl,
  normalizeHost,
} from './lib/eventPressureSourceTrust.js'

const execFileAsync = promisify(execFile)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

const modeArg = process.argv.find((arg) => arg.startsWith('--mode='))
const mode = modeArg ? modeArg.replace('--mode=', '') : 'all'

const appendToArg = process.argv.find((arg) => arg.startsWith('--append-to='))
const appendTo = appendToArg ? appendToArg.replace('--append-to=', '') : ''

const sourceFiles = [
  'src/data/eventPressureSources.json',
  'src/data/eventPressureKnownEvents.json',
]

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

function byId(items) {
  return new Map(items.map((item) => [item.id, item]))
}

function isDifferent(a, b) {
  return JSON.stringify(a) !== JSON.stringify(b)
}

function changedItems(baseItems, currentItems) {
  const baseMap = byId(baseItems)

  return currentItems.filter((item) => {
    const baseItem = baseMap.get(item.id)
    return !baseItem || isDifferent(baseItem, item)
  })
}

function sourceRowsForItem(item, trustedHosts) {
  const urls = collectNoteSourceUrls(item)

  return urls.map((url) => ({
    url,
    host: normalizeHost(url),
    trusted: isTrustedUrl(url, trustedHosts),
  }))
}

function buildItemBlock(item, trustedHosts, index) {
  const rows = sourceRowsForItem(item, trustedHosts)
  const trustedRows = rows.filter((row) => row.trusted)
  const untrustedRows = rows.filter((row) => !row.trusted)

  const lines = [
    `### ${index + 1}. ${item.city || '-'} · ${item.title || item.id || '(missing title)'}`,
    '',
    `- id: \`${item.id || '(missing id)'}\``,
    `- trusted source URLs: ${trustedRows.length}`,
    `- untrusted source URLs: ${untrustedRows.length}`,
    '',
  ]

  if (trustedRows.length > 0) {
    lines.push('Trusted URLs:', '')
    trustedRows.forEach((row) => lines.push(`- ${row.host}: ${row.url}`))
    lines.push('')
  }

  if (untrustedRows.length > 0) {
    lines.push('Untrusted URLs:', '')
    untrustedRows.forEach((row) => lines.push(`- ${row.host || 'invalid URL'}: ${row.url}`))
    lines.push('')
  }

  if (rows.length === 0) {
    lines.push('No source URLs found.', '')
  }

  return lines.join('\n')
}

function buildMarkdown({ label, items, trustedHosts }) {
  const errors = findSourceTrustErrors(items, trustedHosts, label)

  const lines = [
    '## Source trust review',
    '',
    `- Scope: ${label}`,
    `- Trusted host count: ${trustedHosts.size}`,
    `- Review items: ${items.length}`,
    `- Source trust errors: ${errors.length}`,
    '',
  ]

  if (items.length === 0) {
    lines.push('No changed source-trust items to review.', '')
    return lines.join('\n')
  }

  items.forEach((item, index) => {
    lines.push(buildItemBlock(item, trustedHosts, index))
  })

  if (errors.length > 0) {
    lines.push('### Source trust errors', '')
    errors.forEach((error) => lines.push(`- ${error}`))
    lines.push('')
  }

  return lines.join('\n')
}

async function getTrustedHosts() {
  const sourceCollections = await Promise.all(
    sourceFiles.map((file) => readJson(file, [])),
  )

  return buildTrustedHosts(sourceCollections)
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

  throw new Error('Usage: node scripts/reportEventPressureSourceTrust.js --mode=all|candidate|promotion')
}

async function main() {
  const trustedHosts = await getTrustedHosts()
  const { label, items } = await getReportItems()

  const markdown = buildMarkdown({
    label,
    items,
    trustedHosts,
  })

  console.log(markdown)

  if (appendTo) {
    const outputPath = path.join(repoRoot, appendTo)
    await fs.appendFile(outputPath, `\n${markdown}`)
    console.log(`Appended source trust review to ${appendTo}`)
  }
}

main().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
