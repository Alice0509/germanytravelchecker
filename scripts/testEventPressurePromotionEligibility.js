import assert from 'node:assert/strict'
import fs from 'node:fs'
import { spawnSync } from 'node:child_process'

const candidatesPath = 'src/data/eventPressureCandidates.generated.json'
const generatedPath = 'src/data/eventPressureNotes.generated.json'

const originalCandidates = fs.readFileSync(candidatesPath, 'utf8')
const originalGenerated = fs.readFileSync(generatedPath, 'utf8')

const testCandidates = [
  {
    id: 'test-dresden-eligible',
    city: 'Dresden',
    title: 'Dresden eligible source scan',
    startDate: '2026-11-25',
    endDate: '2026-12-24',
    sourceUrl: 'https://striezelmarkt.dresden.de/en/',
    sourceLabel: 'Official Dresden Striezelmarkt website',
    detectedFrom: 'test',
    confidence: 'medium',
    candidateReason: 'Test candidate with date range.',
    suggestedCategory: 'christmas_market',
    suggestedPressureLevel: 'medium',
    suggestedImpact: 'Expect higher demand around central Dresden and the market area.',
    suggestedAction: 'Check the official market and city pages before travelling.',
    suggestedAreas: [],
    sourceType: 'official_tourism',
  },
  {
    id: 'test-cologne-missing-dates',
    city: 'Cologne',
    title: 'Cologne missing dates source scan',
    sourceUrl: 'https://www.cologne-tourism.com/experiences-lifestyle/events/calendar-of-events',
    sourceLabel: 'Cologne tourism event information',
    detectedFrom: 'test',
    confidence: 'low',
    candidateReason: 'Test candidate without dates.',
    suggestedCategory: 'city_festival',
    suggestedPressureLevel: 'high',
    suggestedImpact: 'A major city festival period may affect central areas.',
    suggestedAction: 'Verify official city and transport information.',
    suggestedAreas: ['city centre'],
    sourceType: 'official_tourism',
  },
]

try {
  fs.writeFileSync(candidatesPath, `${JSON.stringify(testCandidates, null, 2)}\n`)

  const result = spawnSync('node', ['scripts/promoteEventPressureCandidates.js'], {
    encoding: 'utf8',
  })

  assert.equal(result.status, 0, result.stderr || result.stdout)

  const output = result.stdout

  assert.match(output, /Event pressure candidate promotion/)
  assert.match(output, /Candidates: 2/)
  assert.match(output, /Promotable candidates: 1/)
  assert.match(output, /Skipped candidates: 1/)
  assert.match(output, /test-dresden-eligible/)
  assert.match(output, /test-cologne-missing-dates: missing valid startDate/)
  assert.match(output, /Report only\. Re-run with --write/)

  const afterCandidates = fs.readFileSync(candidatesPath, 'utf8')
  const afterGenerated = fs.readFileSync(generatedPath, 'utf8')

  assert.equal(afterCandidates, `${JSON.stringify(testCandidates, null, 2)}\n`)
  assert.equal(afterGenerated, originalGenerated)

  console.log('Event pressure promotion eligibility test passed.')
} finally {
  fs.writeFileSync(candidatesPath, originalCandidates)
  fs.writeFileSync(generatedPath, originalGenerated)
}
