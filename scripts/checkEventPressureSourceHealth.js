import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

const sourcesPath = path.join(repoRoot, 'src/data/eventPressureSources.json')
const knownEventsPath = path.join(repoRoot, 'src/data/eventPressureKnownEvents.json')
const generatedNotesPath = path.join(repoRoot, 'src/data/eventPressureNotes.generated.json')
const candidatesPath = path.join(repoRoot, 'src/data/eventPressureCandidates.generated.json')

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

function addUrl(map, { url, city = 'Unknown', label = 'Source', kind = 'source' }) {
  if (!url || typeof url !== 'string') return
  if (!url.startsWith('https://')) return

  const key = url.trim()

  if (!map.has(key)) {
    map.set(key, {
      url: key,
      references: [],
    })
  }

  map.get(key).references.push({ city, label, kind })
}

function collectUrls({ sources, knownEvents, generatedNotes, candidates }) {
  const urls = new Map()

  for (const source of sources) {
    addUrl(urls, {
      url: source.url,
      city: source.city,
      label: source.label,
      kind: `source:${source.sourceRole || source.sourceType || 'unknown'}`,
    })
  }

  for (const event of knownEvents) {
    addUrl(urls, {
      url: event.sourceUrl,
      city: event.city,
      label: event.sourceLabel || event.title,
      kind: 'known-event',
    })

    for (const dateEntry of event.knownDates || []) {
      addUrl(urls, {
        url: dateEntry.sourceUrl,
        city: event.city,
        label: dateEntry.sourceLabel || event.sourceLabel || event.title,
        kind: 'known-event-date',
      })
    }
  }

  for (const note of generatedNotes) {
    for (const link of note.verifyLinks || []) {
      addUrl(urls, {
        url: link.url,
        city: note.city,
        label: link.label || note.title,
        kind: 'generated-note',
      })
    }
  }

  for (const candidate of candidates) {
    addUrl(urls, {
      url: candidate.sourceUrl,
      city: candidate.city,
      label: candidate.sourceLabel || candidate.title,
      kind: 'candidate',
    })
  }

  return [...urls.values()]
}

async function checkUrl(entry) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 9000)

  try {
    const response = await fetch(entry.url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'GermanyTravelChecker/1.0 source-health-check',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    })

    return {
      ...entry,
      ok: response.status >= 200 && response.status < 400,
      status: response.status,
      statusText: response.statusText,
      finalUrl: response.url,
    }
  } catch (error) {
    return {
      ...entry,
      ok: false,
      status: 'ERROR',
      statusText: error.name === 'AbortError' ? 'Timeout' : error.message,
      finalUrl: entry.url,
    }
  } finally {
    clearTimeout(timeout)
  }
}

async function checkWithLimit(entries, limit = 5) {
  const results = []
  const queue = [...entries]

  async function worker() {
    while (queue.length > 0) {
      const entry = queue.shift()
      results.push(await checkUrl(entry))
    }
  }

  await Promise.all(Array.from({ length: limit }, worker))
  return results
}

function summarizeReference(entry) {
  const first = entry.references[0]
  const extraCount = entry.references.length - 1
  const extra = extraCount > 0 ? ` +${extraCount} more` : ''
  return `${first.city} · ${first.kind} · ${first.label}${extra}`
}

async function main() {
  const [sources, knownEvents, generatedNotes, candidates] = await Promise.all([
    readJson(sourcesPath, []),
    readJson(knownEventsPath, []),
    readJson(generatedNotesPath, []),
    readJson(candidatesPath, []),
  ])

  for (const [name, value] of [
    ['eventPressureSources.json', sources],
    ['eventPressureKnownEvents.json', knownEvents],
    ['eventPressureNotes.generated.json', generatedNotes],
    ['eventPressureCandidates.generated.json', candidates],
  ]) {
    if (!Array.isArray(value)) {
      throw new Error(`${name} must contain an array.`)
    }
  }

  const entries = collectUrls({ sources, knownEvents, generatedNotes, candidates })
  const results = await checkWithLimit(entries)
  const failed = results.filter((result) => !result.ok)
  const ok = results.filter((result) => result.ok)

  console.log('Event pressure source health')
  console.log('============================')
  console.log(`Checked URLs: ${results.length}`)
  console.log(`Reachable: ${ok.length}`)
  console.log(`Needs review: ${failed.length}`)

  if (failed.length > 0) {
    console.log('')
    console.log('Needs review')
    console.log('------------')
    for (const result of failed) {
      console.log(`[${result.status}] ${summarizeReference(result)}`)
      console.log(`  ${result.url}`)
      console.log(`  ${result.statusText}`)
    }
  }

  if (isStrict && failed.length > 0) {
    process.exit(1)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
