import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

const knownEventsPath = path.join(repoRoot, 'src/data/eventPressureKnownEvents.json')
const candidatesPath = path.join(repoRoot, 'src/data/eventPressureCandidates.generated.json')
const generatedPath = path.join(repoRoot, 'src/data/eventPressureNotes.generated.json')
const schemaPath = path.join(repoRoot, 'src/data/eventPressureNotesSchema.js')

const shouldWrite = process.argv.includes('--write')
const limitArg = process.argv.find((arg) => arg.startsWith('--limit='))
const scanLimit = limitArg ? Number(limitArg.slice('--limit='.length)) : Infinity

async function readJson(filePath, fallback) {
  try {
    const content = await fs.readFile(filePath, 'utf8')
    return JSON.parse(content)
  } catch (error) {
    if (error.code === 'ENOENT') return fallback
    throw error
  }
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#8211;|&ndash;/g, '–')
    .replace(/&#8212;|&mdash;/g, '—')
    .replace(/&#x2F;|&sol;/g, '/')
    .replace(/\s+/g, ' ')
    .trim()
}

function getFutureYears() {
  const year = Number(
    new Intl.DateTimeFormat('en', {
      timeZone: 'Europe/Berlin',
      year: 'numeric',
    }).format(new Date()),
  )

  return [year, year + 1, year + 2]
}

function getGermanyDateKey() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

function normalizeKeyword(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9äöüß]+/gi, ' ').trim()
}

function keywordHits(text, seed) {
  const normalizedText = normalizeKeyword(text)
  const parts = [
    seed.city,
    seed.title,
    ...(seed.keywords || []),
  ]
    .filter(Boolean)
    .map(normalizeKeyword)
    .filter(Boolean)

  return parts.filter((part) => normalizedText.includes(part))
}

function findYearHits(text, years) {
  return years.filter((year) => text.includes(String(year)))
}

function findDateLikeSnippets(text, years) {
  const snippets = []
  const normalized = text.replace(/\s+/g, ' ')

  const patterns = [
    /\b\d{1,2}\.\s*[A-Za-zÄÖÜäöüß]+\.?\s*20\d{2}\b/g,
    /\b[A-Za-zÄÖÜäöüß]+\.?\s*\d{1,2},?\s*20\d{2}\b/g,
    /\b20\d{2}-\d{2}-\d{2}\b/g,
    /\b\d{1,2}\.\d{1,2}\.20\d{2}\b/g,
    /\b\d{1,2}\s*[–-]\s*\d{1,2}\.\s*[A-Za-zÄÖÜäöüß]+\.?\s*20\d{2}\b/g,
    /\b\d{1,2}\.\s*[A-Za-zÄÖÜäöüß]+\.?\s*[–-]\s*\d{1,2}\.\s*[A-Za-zÄÖÜäöüß]+\.?\s*20\d{2}\b/g,
  ]

  for (const pattern of patterns) {
    const matches = normalized.matchAll(pattern)
    for (const match of matches) {
      const value = match[0]
      if (years.some((year) => value.includes(String(year)))) {
        snippets.push(value)
      }
    }
  }

  return [...new Set(snippets)].slice(0, 8)
}

async function fetchText(url) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 12000)

  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'GermanyTravelChecker/1.0 known-event-source-scanner',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    })

    const html = await response.text()

    return {
      ok: response.status >= 200 && response.status < 400,
      status: response.status,
      finalUrl: response.url,
      text: stripHtml(html),
    }
  } finally {
    clearTimeout(timeout)
  }
}

function buildCandidate(seed, scanResult, todayDateKey) {
  const yearLabel = scanResult.yearHits.join(', ')
  const title = `${seed.title} source scan`
  const id = `${slugify(seed.city)}-${todayDateKey}-${slugify(seed.id)}-source-scan`

  return {
    id,
    city: seed.city,
    title,
    sourceUrl: seed.sourceUrl,
    sourceLabel: seed.sourceLabel,
    detectedFrom: `known-event-source-scan:${seed.id}`,
    confidence: scanResult.confidence,
    candidateReason: `Source scan found matching event keywords and future year signals: ${yearLabel || 'future year unknown'}. Manual date review required.`,
    suggestedCategory: seed.category,
    suggestedPressureLevel: seed.defaultPressureLevel,
    suggestedImpact: seed.suggestedImpact,
    suggestedAction: seed.suggestedAction,
    suggestedAreas: seed.suggestedAreas || [],
    sourceType: seed.sourceType,
    scanSignals: {
      keywordHits: scanResult.keywordHits,
      yearHits: scanResult.yearHits,
      dateLikeSnippets: scanResult.dateLikeSnippets,
      scannedAt: todayDateKey,
    },
  }
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

function mergeCandidates(existingCandidates, scanCandidates) {
  const byId = new Map()

  for (const candidate of existingCandidates) {
    byId.set(candidate.id, candidate)
  }

  for (const candidate of scanCandidates) {
    byId.set(candidate.id, {
      ...byId.get(candidate.id),
      ...candidate,
    })
  }

  return sortCandidates([...byId.values()])
}

async function main() {
  const { SUPPORTED_EVENT_PRESSURE_CITIES } = await import(pathToFileURL(schemaPath).href)

  const seeds = await readJson(knownEventsPath, [])
  const candidates = await readJson(candidatesPath, [])
  const generatedNotes = await readJson(generatedPath, [])

  if (!Array.isArray(seeds)) {
    throw new Error('eventPressureKnownEvents.json must contain an array.')
  }

  if (!Array.isArray(candidates)) {
    throw new Error('eventPressureCandidates.generated.json must contain an array.')
  }

  if (!Array.isArray(generatedNotes)) {
    throw new Error('eventPressureNotes.generated.json must contain an array.')
  }

  const years = getFutureYears()
  const todayDateKey = getGermanyDateKey()
  const generatedSourceUrls = new Set(
    generatedNotes.flatMap((note) => (note.verifyLinks || []).map((link) => link.url)),
  )

  const seedsToScan = seeds
    .filter((seed) => SUPPORTED_EVENT_PRESSURE_CITIES.includes(seed.city))
    .filter((seed) => seed.sourceUrl && seed.sourceUrl.startsWith('https://'))
    .slice(0, Number.isFinite(scanLimit) ? scanLimit : seeds.length)

  const scanResults = []

  for (const seed of seedsToScan) {
    try {
      const fetched = await fetchText(seed.sourceUrl)
      const hits = keywordHits(fetched.text, seed)
      const yearHits = findYearHits(fetched.text, years)
      const dateLikeSnippets = findDateLikeSnippets(fetched.text, years)

      const hasUsefulSignal = fetched.ok && hits.length > 0 && yearHits.length > 0
      const confidence = hasUsefulSignal && dateLikeSnippets.length > 0 ? 'medium' : 'low'

      scanResults.push({
        seed,
        ok: fetched.ok,
        status: fetched.status,
        finalUrl: fetched.finalUrl,
        keywordHits: hits,
        yearHits,
        dateLikeSnippets,
        hasUsefulSignal,
        confidence,
      })
    } catch (error) {
      scanResults.push({
        seed,
        ok: false,
        status: 'ERROR',
        finalUrl: seed.sourceUrl,
        keywordHits: [],
        yearHits: [],
        dateLikeSnippets: [],
        hasUsefulSignal: false,
        confidence: 'low',
        error: error.name === 'AbortError' ? 'Timeout' : error.message,
      })
    }
  }

  const scanCandidates = scanResults
    .filter((result) => result.hasUsefulSignal)
    .filter((result) => !generatedSourceUrls.has(result.seed.sourceUrl))
    .map((result) => buildCandidate(result.seed, result, todayDateKey))

  console.log('Known event source scan')
  console.log('=======================')
  console.log(`Germany date: ${todayDateKey}`)
  console.log(`Future years searched: ${years.join(', ')}`)
  console.log(`Known event seeds scanned: ${scanResults.length}`)
  console.log(`Useful source signals: ${scanResults.filter((result) => result.hasUsefulSignal).length}`)
  console.log(`Review candidates from scan: ${scanCandidates.length}`)
  console.log(`Write mode: ${shouldWrite ? 'yes' : 'no'}`)

  console.log('')
  console.log('Scan results')
  console.log('------------')
  for (const result of scanResults) {
    console.log(`${result.ok ? 'OK' : 'REVIEW'} ${result.seed.city} · ${result.seed.title}`)
    console.log(`  status: ${result.status}`)
    console.log(`  url: ${result.finalUrl}`)
    console.log(`  keyword hits: ${result.keywordHits.join(', ') || '-'}`)
    console.log(`  year hits: ${result.yearHits.join(', ') || '-'}`)
    console.log(`  date-like snippets: ${result.dateLikeSnippets.join(' | ') || '-'}`)
    if (result.error) {
      console.log(`  error: ${result.error}`)
    }
  }

  if (!shouldWrite) {
    console.log('')
    console.log('Report only. Re-run with --write to update eventPressureCandidates.generated.json.')
    return
  }

  const nextCandidates = mergeCandidates(candidates, scanCandidates)
  await fs.writeFile(candidatesPath, `${JSON.stringify(nextCandidates, null, 2)}\n`)

  console.log('')
  console.log(`Wrote ${nextCandidates.length} total event pressure candidates.`)
}

main().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
