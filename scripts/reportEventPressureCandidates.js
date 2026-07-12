import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

const candidatesPath = path.join(repoRoot, 'src/data/eventPressureCandidates.generated.json')
const markdownPath = path.join(repoRoot, 'event-pressure-candidate-report.md')

const shouldWriteMarkdown = process.argv.includes('--markdown')

async function readJson(filePath, fallback) {
  try {
    const content = await fs.readFile(filePath, 'utf8')
    return JSON.parse(content)
  } catch (error) {
    if (error.code === 'ENOENT') return fallback
    throw error
  }
}

function shellQuote(value) {
  const text = String(value || '')
  return `"${text.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
}

function formatList(values) {
  if (!Array.isArray(values) || values.length === 0) return '-'
  return values.join(', ')
}

function needsDateReview(candidate) {
  return !candidate.startDate || !candidate.endDate
}

function buildApproveCommand(candidate) {
  const lines = [
    'npm run event-pressure:approve -- \\',
    `  --id ${candidate.id} \\`,
    '  --checked-at YYYY-MM-DD \\',
  ]

  if (needsDateReview(candidate)) {
    lines.push('  --start-date YYYY-MM-DD \\')
    lines.push('  --end-date YYYY-MM-DD \\')
  }

  if (candidate.state) {
    lines.push(`  --state ${shellQuote(candidate.state)} \\`)
  } else {
    lines.push('  --state "STATE_NAME" \\')
  }

  if (candidate.venue) {
    lines.push(`  --venue ${shellQuote(candidate.venue)} \\`)
  } else {
    lines.push('  --venue "VENUE_OR_AREA" \\')
  }

  const areas = Array.isArray(candidate.suggestedAreas) ? candidate.suggestedAreas.join(',') : ''
  if (areas) {
    lines.push(`  --areas ${shellQuote(areas)}`)
  } else {
    lines.push('  --areas "AREA_1,AREA_2"')
  }

  return lines.join('\n')
}

function candidateBlock(candidate, index) {
  const scanSignals = candidate.scanSignals || {}

  return [
    `## ${index + 1}. ${candidate.city} · ${candidate.title}`,
    '',
    `- id: \`${candidate.id}\``,
    `- detectedFrom: \`${candidate.detectedFrom || '-'}\``,
    `- source: ${candidate.sourceLabel || '-'} · ${candidate.sourceUrl || '-'}`,
    `- dates: ${candidate.startDate || 'manual review needed'} to ${candidate.endDate || 'manual review needed'}`,
    `- date review: ${needsDateReview(candidate) ? 'required before approve' : 'ready'}`,
    `- confidence: ${candidate.confidence || '-'}`,
    `- suggested category: ${candidate.suggestedCategory || '-'}`,
    `- suggested pressure: ${candidate.suggestedPressureLevel || '-'}`,
    `- suggested areas: ${formatList(candidate.suggestedAreas)}`,
    '',
    'Suggested impact:',
    '',
    `> ${candidate.suggestedImpact || '-'}`,
    '',
    'Suggested action:',
    '',
    `> ${candidate.suggestedAction || '-'}`,
    '',
    'Scan signals:',
    '',
    `- keyword hits: ${formatList(scanSignals.keywordHits)}`,
    `- year hits: ${formatList(scanSignals.yearHits)}`,
    `- date-like snippets: ${formatList(scanSignals.dateLikeSnippets)}`,
    `- possible date hints: ${formatList(scanSignals.possibleDateHints)}`,
    '',
    'Approve command draft:',
    '',
    '```bash',
    buildApproveCommand(candidate),
    '```',
    '',
  ].join('\n')
}

function buildMarkdown(candidates) {
  const lines = [
    '# Event pressure candidate review',
    '',
    `Candidate count: ${candidates.length}`,
    '',
  ]

  if (candidates.length === 0) {
    lines.push('No event pressure candidates to review.', '')
    return lines.join('\n')
  }

  candidates.forEach((candidate, index) => {
    lines.push(candidateBlock(candidate, index))
  })

  return lines.join('\n')
}

async function main() {
  const candidates = await readJson(candidatesPath, [])

  if (!Array.isArray(candidates)) {
    throw new Error('eventPressureCandidates.generated.json must contain an array.')
  }

  const markdown = buildMarkdown(candidates)

  console.log(markdown)

  if (shouldWriteMarkdown) {
    await fs.writeFile(markdownPath, markdown)
    console.log(`Wrote ${path.relative(repoRoot, markdownPath)}`)
  }
}

main().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
