import assert from 'node:assert/strict'
import {
  findReviewReportErrors,
  getReviewReportConfig,
} from './lib/eventPressureReviewReport.js'

function test(name, fn) {
  try {
    fn()
    console.log(`✓ ${name}`)
  } catch (error) {
    console.error(`✗ ${name}`)
    throw error
  }
}

test('getReviewReportConfig returns candidate config', () => {
  const config = getReviewReportConfig('candidate')

  assert.equal(config.file, 'event-pressure-candidate-report.md')
  assert.ok(config.requiredSections.includes('# Event pressure candidate review'))
  assert.ok(config.requiredSections.includes('## Copy safety review'))
  assert.ok(config.requiredSections.includes('## Source trust review'))
})

test('getReviewReportConfig returns promotion config', () => {
  const config = getReviewReportConfig('promotion')

  assert.equal(config.file, 'event-pressure-promotion-report.md')
  assert.ok(config.requiredSections.includes('# Event pressure promotion review'))
  assert.ok(config.requiredSections.includes('## Copy safety review'))
  assert.ok(config.requiredSections.includes('## Source trust review'))
})

test('findReviewReportErrors allows complete candidate report', () => {
  const config = getReviewReportConfig('candidate')
  const body = [
    '# Event pressure candidate review',
    '',
    '## Copy safety review',
    '',
    '## Source trust review',
    '',
  ].join('\n')

  assert.deepEqual(findReviewReportErrors(body, config), [])
})

test('findReviewReportErrors allows complete promotion report', () => {
  const config = getReviewReportConfig('promotion')
  const body = [
    '# Event pressure promotion review',
    '',
    '## Copy safety review',
    '',
    '## Source trust review',
    '',
  ].join('\n')

  assert.deepEqual(findReviewReportErrors(body, config), [])
})

test('findReviewReportErrors rejects missing copy safety section', () => {
  const config = getReviewReportConfig('candidate')
  const body = [
    '# Event pressure candidate review',
    '',
    '## Source trust review',
    '',
  ].join('\n')

  const errors = findReviewReportErrors(body, config)

  assert.equal(errors.length, 1)
  assert.ok(errors[0].includes('## Copy safety review'))
})

test('findReviewReportErrors rejects missing source trust section', () => {
  const config = getReviewReportConfig('promotion')
  const body = [
    '# Event pressure promotion review',
    '',
    '## Copy safety review',
    '',
  ].join('\n')

  const errors = findReviewReportErrors(body, config)

  assert.equal(errors.length, 1)
  assert.ok(errors[0].includes('## Source trust review'))
})

test('findReviewReportErrors rejects empty body', () => {
  const config = getReviewReportConfig('candidate')
  const errors = findReviewReportErrors('', config)

  assert.ok(errors.some((error) => error.includes('is empty')))
})

console.log('')
console.log('Review report guard tests passed.')
