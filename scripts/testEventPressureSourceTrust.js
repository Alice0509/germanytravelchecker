import assert from 'node:assert/strict'
import {
  buildTrustedHosts,
  collectNoteSourceUrls,
  collectUrlsFromValue,
  findSourceTrustErrors,
  isTrustedUrl,
  normalizeHost,
} from './lib/eventPressureSourceTrust.js'

function test(name, fn) {
  try {
    fn()
    console.log(`✓ ${name}`)
  } catch (error) {
    console.error(`✗ ${name}`)
    throw error
  }
}

test('normalizeHost removes www prefix', () => {
  assert.equal(normalizeHost('https://www.berlin.de/en/events/'), 'berlin.de')
})

test('collectUrlsFromValue finds nested URL fields', () => {
  const urls = collectUrlsFromValue({
    sourceUrl: 'https://example.com/source',
    verifyLinks: [{ url: 'https://official.example.org/event' }],
  })

  assert.deepEqual(urls, [
    'https://example.com/source',
    'https://official.example.org/event',
  ])
})

test('buildTrustedHosts builds host allow list from source collections', () => {
  const hosts = buildTrustedHosts([
    [{ url: 'https://www.berlin.de/en/events/' }],
    [{ sourceUrl: 'https://www.buchmesse.de/en' }],
  ])

  assert.equal(hosts.has('berlin.de'), true)
  assert.equal(hosts.has('buchmesse.de'), true)
})

test('isTrustedUrl accepts exact and subdomain matches', () => {
  const trustedHosts = new Set(['berlin.de'])

  assert.equal(isTrustedUrl('https://berlin.de/en/events/', trustedHosts), true)
  assert.equal(isTrustedUrl('https://events.berlin.de/example', trustedHosts), true)
  assert.equal(isTrustedUrl('https://example.com/event', trustedHosts), false)
})

test('collectNoteSourceUrls reads sourceUrl and verifyLinks', () => {
  const urls = collectNoteSourceUrls({
    sourceUrl: 'https://berlin.de/source',
    verifyLinks: [{ label: 'Official', url: 'https://berlin.de/verify' }],
  })

  assert.deepEqual(urls, [
    'https://berlin.de/source',
    'https://berlin.de/verify',
  ])
})

test('findSourceTrustErrors allows at least one trusted source URL', () => {
  const errors = findSourceTrustErrors(
    [
      {
        id: 'safe-note',
        verifyLinks: [
          { label: 'Mirror', url: 'https://example.com/copy' },
          { label: 'Official', url: 'https://berlin.de/en/events/' },
        ],
      },
    ],
    new Set(['berlin.de']),
    'notes',
  )

  assert.equal(errors.length, 0)
})

test('findSourceTrustErrors rejects notes without source URLs', () => {
  const errors = findSourceTrustErrors([{ id: 'missing-source' }], new Set(['berlin.de']), 'notes')

  assert.equal(errors.length, 1)
  assert.ok(errors[0].includes('missing-source'))
})

test('findSourceTrustErrors rejects untrusted source URLs', () => {
  const errors = findSourceTrustErrors(
    [{ id: 'bad-source', sourceUrl: 'https://random-blog.example/event' }],
    new Set(['berlin.de']),
    'notes',
  )

  assert.equal(errors.length, 1)
  assert.ok(errors[0].includes('bad-source'))
  assert.ok(errors[0].includes('no trusted source URL'))
})

console.log('')
console.log('Source trust tests passed.')
