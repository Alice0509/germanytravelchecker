import assert from 'node:assert/strict'
import fs from 'node:fs'
import { spawnSync } from 'node:child_process'

const candidatesPath = 'src/data/eventPressureCandidates.generated.json'
const generatedPath = 'src/data/eventPressureNotes.generated.json'

const originalCandidates = fs.readFileSync(candidatesPath, 'utf8')
const originalGenerated = fs.readFileSync(generatedPath, 'utf8')

function run(command, args) {
  const result = spawnSync(command, args, {
    encoding: 'utf8',
  })

  assert.equal(result.status, 0, result.stderr || result.stdout)

  return result.stdout
}

try {
  const scanOutput = run('node', ['scripts/scanKnownEventSources.js', '--write'])

  assert.match(scanOutput, /Known event source scan/)
  assert.match(scanOutput, /Write mode: yes/)
  assert.match(scanOutput, /Wrote 4 total event pressure candidates/)

  const candidates = JSON.parse(fs.readFileSync(candidatesPath, 'utf8'))

  assert.ok(
    candidates.find(
      (candidate) =>
        candidate.city === 'Dresden' &&
        candidate.startDate === '2026-11-25' &&
        candidate.endDate === '2026-12-24' &&
        candidate.confidence === 'medium' &&
        candidate.sourceType === 'official',
    ),
    'Expected Dresden source-scan candidate with extracted dates.',
  )

  assert.ok(
    candidates.find(
      (candidate) =>
        candidate.city === 'Stuttgart' &&
        candidate.startDate === '2026-09-25' &&
        candidate.endDate === '2026-10-11' &&
        candidate.confidence === 'medium' &&
        candidate.sourceType === 'official',
    ),
    'Expected Stuttgart source-scan candidate with extracted dates.',
  )

  const promoteOutput = run('node', ['scripts/promoteEventPressureCandidates.js', '--write'])

  assert.match(promoteOutput, /Event pressure candidate promotion/)
  assert.match(promoteOutput, /Write mode: yes/)
  assert.match(promoteOutput, /Promotable candidates: 2/)
  assert.match(promoteOutput, /Skipped candidates: 2/)
  assert.match(promoteOutput, /dresden-2026-dresden-striezelmarkt-source-scan/)
  assert.match(promoteOutput, /stuttgart-2026-stuttgart-cannstatter-volksfest-source-scan/)
  assert.match(promoteOutput, /Wrote generated notes: 7/)
  assert.match(promoteOutput, /Remaining candidates: 2/)

  const generated = JSON.parse(fs.readFileSync(generatedPath, 'utf8'))

  assert.ok(
    generated.find(
      (note) =>
        note.city === 'Dresden' &&
        note.startDate === '2026-11-25' &&
        note.endDate === '2026-12-24' &&
        note.category === 'christmas_market' &&
        note.sourceType === 'official' &&
        note.confidence === 'medium',
    ),
    'Expected Dresden generated note after promotion.',
  )

  assert.ok(
    generated.find(
      (note) =>
        note.city === 'Stuttgart' &&
        note.startDate === '2026-09-25' &&
        note.endDate === '2026-10-11' &&
        note.category === 'festival' &&
        note.sourceType === 'official' &&
        note.confidence === 'medium',
    ),
    'Expected Stuttgart generated note after promotion.',
  )

  console.log('Event pressure source scan to promotion flow test passed.')
} finally {
  fs.writeFileSync(candidatesPath, originalCandidates)
  fs.writeFileSync(generatedPath, originalGenerated)
}
