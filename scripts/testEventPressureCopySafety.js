import assert from 'node:assert/strict'
import {
  collectCopySafetyTextValues,
  findCopySafetyErrors,
} from './lib/eventPressureCopySafety.js'

function test(name, fn) {
  try {
    fn()
    console.log(`✓ ${name}`)
  } catch (error) {
    console.error(`✗ ${name}`)
    throw error
  }
}

test('collectCopySafetyTextValues reads checked text fields and reasons', () => {
  const values = collectCopySafetyTextValues({
    id: 'example',
    title: 'Major event signal',
    travelerImpact: 'Plan extra time.',
    reasons: ['Large event', 'Official source'],
    ignoredField: 'not checked',
  })

  assert.deepEqual(
    values.map((value) => value.field),
    ['title', 'travelerImpact', 'reasons[0]', 'reasons[1]'],
  )
})

test('findCopySafetyErrors allows pressure-signal wording', () => {
  const errors = findCopySafetyErrors([
    {
      id: 'safe-note',
      title: 'Major event signal',
      travelerImpact: 'Expect higher demand around the venue and allow extra time.',
      recommendedAction: 'Check official transport and venue pages before travelling.',
      reasons: ['Official source lists a major event.'],
    },
  ])

  assert.equal(errors.length, 0)
})

test('findCopySafetyErrors blocks live status wording', () => {
  const errors = findCopySafetyErrors([
    {
      id: 'bad-live-note',
      travelerImpact: 'Live crowd status says the area is crowded right now.',
    },
  ])

  assert.ok(errors.some((error) => error.includes('bad-live-note')))
  assert.ok(errors.some((error) => error.includes('Do not imply live status')))
})

test('findCopySafetyErrors blocks blanket train status wording', () => {
  const errors = findCopySafetyErrors([
    {
      id: 'bad-train-note',
      recommendedAction: 'Trains will be delayed, so avoid the city.',
    },
  ])

  assert.ok(errors.some((error) => error.includes('bad-train-note')))
  assert.ok(errors.some((error) => error.includes('Avoid train status claims')))
})

test('findCopySafetyErrors blocks blanket shop closure wording', () => {
  const errors = findCopySafetyErrors([
    {
      id: 'bad-shop-note',
      travelerImpact: 'All shops will be closed.',
    },
  ])

  assert.ok(errors.some((error) => error.includes('bad-shop-note')))
  assert.ok(errors.some((error) => error.includes('Avoid blanket shop closure claims')))
})

test('findCopySafetyErrors rejects non-array input', () => {
  const errors = findCopySafetyErrors({}, 'bad file')
  assert.deepEqual(errors, ['bad file: expected array'])
})

console.log('')
console.log('Copy safety tests passed.')
