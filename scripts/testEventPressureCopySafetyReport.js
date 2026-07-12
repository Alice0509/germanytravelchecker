import assert from 'node:assert/strict'
import {
  buildCopySafetyMarkdown,
  changedItems,
} from './lib/eventPressureCopySafetyReport.js'

function test(name, fn) {
  try {
    fn()
    console.log(`✓ ${name}`)
  } catch (error) {
    console.error(`✗ ${name}`)
    throw error
  }
}

test('changedItems returns added and updated items only', () => {
  const base = [
    { id: 'same', title: 'Same' },
    { id: 'updated', title: 'Old' },
  ]

  const current = [
    { id: 'same', title: 'Same' },
    { id: 'updated', title: 'New' },
    { id: 'added', title: 'Added' },
  ]

  assert.deepEqual(
    changedItems(base, current).map((item) => item.id),
    ['updated', 'added'],
  )
})

test('buildCopySafetyMarkdown handles no changed items', () => {
  const markdown = buildCopySafetyMarkdown({
    label: 'changed candidate notes',
    items: [],
  })

  assert.ok(markdown.includes('Review items: 0'))
  assert.ok(markdown.includes('No changed copy-safety items to review.'))
})

test('buildCopySafetyMarkdown shows checked fields for safe notes', () => {
  const markdown = buildCopySafetyMarkdown({
    label: 'changed generated notes',
    items: [
      {
        id: 'safe-note',
        city: 'Berlin',
        title: 'Major event signal',
        travelerImpact: 'Expect higher demand around the venue and allow extra time.',
        recommendedAction: 'Check official transport and venue pages before travelling.',
      },
    ],
  })

  assert.ok(markdown.includes('Berlin · Major event signal'))
  assert.ok(markdown.includes('Copy safety errors: 0'))
  assert.ok(markdown.includes('checked text fields: 3'))
  assert.ok(markdown.includes('Checked fields:'))
})

test('buildCopySafetyMarkdown includes copy safety errors', () => {
  const markdown = buildCopySafetyMarkdown({
    label: 'changed generated notes',
    items: [
      {
        id: 'bad-note',
        travelerImpact: 'Live crowd status says the area is crowded right now.',
      },
    ],
  })

  assert.ok(markdown.includes('Copy safety errors:'))
  assert.ok(markdown.includes('bad-note'))
  assert.ok(markdown.includes('Do not imply live status'))
})

console.log('')
console.log('Copy safety report tests passed.')
