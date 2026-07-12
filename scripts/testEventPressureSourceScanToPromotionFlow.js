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

function hasGeneratedNote(notes, city, startDate, endDate) {
  return notes.some(
    (note) =>
      note.city === city &&
      note.startDate === startDate &&
      note.endDate === endDate &&
      note.sourceType === 'official' &&
      note.confidence === 'medium',
  )
}

try {
  const beforeGenerated = JSON.parse(originalGenerated)
  const alreadyHasDresden = hasGeneratedNote(beforeGenerated, 'Dresden', '2026-11-25', '2026-12-24')
  const alreadyHasStuttgart = hasGeneratedNote(beforeGenerated, 'Stuttgart', '2026-09-25', '2026-10-11')

  const scanOutput = run('node', ['scripts/scanKnownEventSources.js', '--write'])

  assert.match(scanOutput, /Known event source scan/)
  assert.match(scanOutput, /Write mode: yes/)
  assert.match(scanOutput, /Wrote \d+ total event pressure candidates/)

  const candidates = JSON.parse(fs.readFileSync(candidatesPath, 'utf8'))

  if (!alreadyHasDresden) {
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
  }

  if (!alreadyHasStuttgart) {
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
  }

  const promoteOutput = run('node', ['scripts/promoteEventPressureCandidates.js', '--write'])

  assert.match(promoteOutput, /Event pressure candidate promotion/)
  assert.match(promoteOutput, /Write mode: yes/)
  assert.match(promoteOutput, /Promotable candidates: \d+/)
  assert.match(promoteOutput, /Skipped candidates: \d+/)
  assert.match(promoteOutput, /Wrote generated notes: \d+/)
  assert.match(promoteOutput, /Remaining candidates: \d+/)

  const afterGenerated = JSON.parse(fs.readFileSync(generatedPath, 'utf8'))

  assert.ok(
    hasGeneratedNote(afterGenerated, 'Dresden', '2026-11-25', '2026-12-24'),
    'Expected Dresden generated note to exist after flow.',
  )

  assert.ok(
    hasGeneratedNote(afterGenerated, 'Stuttgart', '2026-09-25', '2026-10-11'),
    'Expected Stuttgart generated note to exist after flow.',
  )

  console.log('Event pressure source scan to promotion flow test passed.')
} finally {
  fs.writeFileSync(candidatesPath, originalCandidates)
  fs.writeFileSync(generatedPath, originalGenerated)
}
