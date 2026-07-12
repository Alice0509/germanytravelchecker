import assert from 'node:assert/strict'
import {
  findUnexpectedAutomationOutputs,
  getAllowedAutomationOutputs,
  parseGitStatusPath,
  parseGitStatusPaths,
} from './lib/eventPressureAutomationOutputs.js'

function test(name, fn) {
  try {
    fn()
    console.log(`✓ ${name}`)
  } catch (error) {
    console.error(`✗ ${name}`)
    throw error
  }
}

test('getAllowedAutomationOutputs returns candidate outputs', () => {
  const allowed = getAllowedAutomationOutputs('candidate')

  assert.equal(allowed.has('src/data/eventPressureCandidates.generated.json'), true)
  assert.equal(allowed.has('event-pressure-candidate-report.md'), true)
  assert.equal(allowed.has('src/data/eventPressureNotes.generated.json'), false)
})

test('getAllowedAutomationOutputs returns promotion outputs', () => {
  const allowed = getAllowedAutomationOutputs('promotion')

  assert.equal(allowed.has('src/data/eventPressureCandidates.generated.json'), true)
  assert.equal(allowed.has('src/data/eventPressureNotes.generated.json'), true)
  assert.equal(allowed.has('event-pressure-promotion-report.md'), true)
})

test('parseGitStatusPath parses modified and untracked paths', () => {
  assert.equal(parseGitStatusPath(' M package.json'), 'package.json')
  assert.equal(parseGitStatusPath('?? event-pressure-candidate-report.md'), 'event-pressure-candidate-report.md')
})

test('parseGitStatusPath parses renamed path destination', () => {
  assert.equal(
    parseGitStatusPath('R  old-report.md -> event-pressure-candidate-report.md'),
    'event-pressure-candidate-report.md',
  )
})

test('parseGitStatusPaths parses status output', () => {
  const paths = parseGitStatusPaths([
    ' M src/data/eventPressureCandidates.generated.json',
    '?? event-pressure-candidate-report.md',
    '',
  ].join('\n'))

  assert.deepEqual(paths, [
    'src/data/eventPressureCandidates.generated.json',
    'event-pressure-candidate-report.md',
  ])
})

test('findUnexpectedAutomationOutputs allows candidate outputs', () => {
  const unexpected = findUnexpectedAutomationOutputs([
    'src/data/eventPressureCandidates.generated.json',
    'event-pressure-candidate-report.md',
  ], 'candidate')

  assert.deepEqual(unexpected, [])
})

test('findUnexpectedAutomationOutputs rejects unexpected candidate output', () => {
  const unexpected = findUnexpectedAutomationOutputs([
    'src/data/eventPressureCandidates.generated.json',
    'package.json',
  ], 'candidate')

  assert.deepEqual(unexpected, ['package.json'])
})

test('findUnexpectedAutomationOutputs allows promotion outputs', () => {
  const unexpected = findUnexpectedAutomationOutputs([
    'src/data/eventPressureNotes.generated.json',
    'src/data/eventPressureCandidates.generated.json',
    'event-pressure-promotion-report.md',
  ], 'promotion')

  assert.deepEqual(unexpected, [])
})

console.log('')
console.log('Automation output guard tests passed.')
