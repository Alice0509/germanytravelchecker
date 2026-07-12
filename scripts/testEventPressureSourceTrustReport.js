import assert from 'node:assert/strict'
import {
  buildSourceTrustMarkdown,
  changedItems,
  sourceRowsForItem,
} from './lib/eventPressureSourceTrustReport.js'

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

test('sourceRowsForItem marks trusted and untrusted URLs', () => {
  const rows = sourceRowsForItem(
    {
      sourceUrl: 'https://official.example/event',
      verifyLinks: [{ url: 'https://random.example/copy' }],
    },
    new Set(['official.example']),
  )

  assert.deepEqual(
    rows.map((row) => ({ host: row.host, trusted: row.trusted })),
    [
      { host: 'official.example', trusted: true },
      { host: 'random.example', trusted: false },
    ],
  )
})

test('buildSourceTrustMarkdown handles no changed items', () => {
  const markdown = buildSourceTrustMarkdown({
    label: 'changed candidate notes',
    items: [],
    trustedHosts: new Set(['official.example']),
  })

  assert.ok(markdown.includes('Review items: 0'))
  assert.ok(markdown.includes('No changed source-trust items to review.'))
})

test('buildSourceTrustMarkdown shows trusted and untrusted URL sections', () => {
  const markdown = buildSourceTrustMarkdown({
    label: 'changed generated notes',
    items: [
      {
        id: 'note-1',
        city: 'Berlin',
        title: 'Major event signal',
        sourceUrl: 'https://official.example/event',
        verifyLinks: [{ url: 'https://random.example/copy' }],
      },
    ],
    trustedHosts: new Set(['official.example']),
  })

  assert.ok(markdown.includes('Berlin · Major event signal'))
  assert.ok(markdown.includes('trusted source URLs: 1'))
  assert.ok(markdown.includes('untrusted source URLs: 1'))
  assert.ok(markdown.includes('Trusted URLs:'))
  assert.ok(markdown.includes('Untrusted URLs:'))
})

test('buildSourceTrustMarkdown includes source trust errors', () => {
  const markdown = buildSourceTrustMarkdown({
    label: 'changed generated notes',
    items: [
      {
        id: 'bad-note',
        sourceUrl: 'https://random.example/event',
      },
    ],
    trustedHosts: new Set(['official.example']),
  })

  assert.ok(markdown.includes('Source trust errors: 1'))
  assert.ok(markdown.includes('bad-note'))
  assert.ok(markdown.includes('no trusted source URL'))
})

console.log('')
console.log('Source trust report tests passed.')
