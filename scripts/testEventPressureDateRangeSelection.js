import assert from 'node:assert/strict'
import {
  getMonthNumber,
  pickDateRangeForYear,
  rangeMatchesPreferredMonths,
  scoreDateRange,
} from './lib/eventPressureDateRangeSelection.js'

function test(name, fn) {
  try {
    fn()
    console.log(`✓ ${name}`)
  } catch (error) {
    console.error(`✗ ${name}`)
    throw error
  }
}

test('getMonthNumber reads ISO month', () => {
  assert.equal(getMonthNumber('2027-11-26'), 11)
  assert.equal(getMonthNumber(''), 0)
})

test('rangeMatchesPreferredMonths accepts matching start or end month', () => {
  const range = { startDate: '2027-11-26', endDate: '2027-12-24' }
  assert.equal(rangeMatchesPreferredMonths(range, [11]), true)
  assert.equal(rangeMatchesPreferredMonths(range, [12]), true)
  assert.equal(rangeMatchesPreferredMonths(range, [8]), false)
})

test('scoreDateRange prefers matching months and keywords', () => {
  const seed = {
    dateExtraction: {
      preferredMonths: [11, 12],
      titleKeywords: ['christmas', 'christkindlesmarkt'],
    },
  }

  const christmasRange = {
    startDate: '2027-11-26',
    endDate: '2027-12-24',
    sourceText: 'Nuremberg Christmas Market 2027 dates',
  }

  const summerRange = {
    startDate: '2027-07-01',
    endDate: '2027-07-10',
    sourceText: 'Summer event dates',
  }

  assert.ok(scoreDateRange(christmasRange, seed, 2027) > scoreDateRange(summerRange, seed, 2027))
})

test('pickDateRangeForYear picks the strongest profile match', () => {
  const seed = {
    dateExtraction: {
      preferredMonths: [10],
      titleKeywords: ['book fair', 'buchmesse'],
    },
  }

  const scanResult = {
    dateRangeHints: [
      {
        startDate: '2027-03-01',
        endDate: '2027-03-03',
        sourceText: 'Unrelated spring dates',
      },
      {
        startDate: '2027-10-06',
        endDate: '2027-10-10',
        sourceText: 'Frankfurt Book Fair 2027',
      },
    ],
  }

  assert.deepEqual(pickDateRangeForYear(scanResult, seed, 2027), scanResult.dateRangeHints[1])
})

test('pickDateRangeForYear returns null on equal ambiguity', () => {
  const seed = {
    dateExtraction: {
      preferredMonths: [7],
      titleKeywords: ['dom'],
    },
  }

  const scanResult = {
    dateRangeHints: [
      {
        startDate: '2027-07-01',
        endDate: '2027-07-10',
        sourceText: 'DOM dates',
      },
      {
        startDate: '2027-07-20',
        endDate: '2027-07-30',
        sourceText: 'DOM dates',
      },
    ],
  }

  assert.equal(pickDateRangeForYear(scanResult, seed, 2027), null)
})

test('pickDateRangeForYear ignores other years', () => {
  const seed = {
    dateExtraction: {
      preferredMonths: [9],
      titleKeywords: ['marathon'],
    },
  }

  const scanResult = {
    dateRangeHints: [
      {
        startDate: '2028-09-24',
        endDate: '2028-09-24',
        sourceText: 'Berlin Marathon 2028',
      },
    ],
  }

  assert.equal(pickDateRangeForYear(scanResult, seed, 2027), null)
})

console.log('')
console.log('Date range selection tests passed.')
