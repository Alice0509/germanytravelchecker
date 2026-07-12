import assert from 'node:assert/strict'
import { extractDateHints, extractDateRangeHints, extractDateSignals } from './lib/eventPressureDateExtraction.js'

const years = [2026, 2027, 2028]

const dateText = [
  'September 27, 2026',
  '24.12.2026',
  '2027-07-23',
  '27. November 2026',
  '27. Dezember 2026',
].join(' ')

assert.deepEqual(extractDateHints(dateText, years), [
  '2026-09-27',
  '2026-11-27',
  '2026-12-24',
  '2026-12-27',
  '2027-07-23',
])

const rangeText = [
  'March 20, 2026 - April 19, 2026',
  'July 24 to August 30, 2026',
  '27. November - 24. Dezember 2026',
  '2027-10-07 to 2027-10-11',
  '20.03.2028 - 19.04.2028',
].join(' ')

assert.deepEqual(extractDateRangeHints(rangeText, years), [
  {
    startDate: '2026-03-20',
    endDate: '2026-04-19',
    sourceText: 'March 20, 2026 - April 19, 2026',
  },
  {
    startDate: '2026-07-24',
    endDate: '2026-08-30',
    sourceText: 'July 24 to August 30, 2026',
  },
  {
    startDate: '2026-11-27',
    endDate: '2026-12-24',
    sourceText: '27. November - 24. Dezember 2026',
  },
  {
    startDate: '2027-10-07',
    endDate: '2027-10-11',
    sourceText: '2027-10-07 to 2027-10-11',
  },
  {
    startDate: '2028-03-20',
    endDate: '2028-04-19',
    sourceText: '20.03.2028 - 19.04.2028',
  },
])

const signals = extractDateSignals('Frankfurt Book Fair: October 7 to October 11, 2026', years)

assert.deepEqual(signals.dateRangeHints, [
  {
    startDate: '2026-10-07',
    endDate: '2026-10-11',
    sourceText: 'October 7 to October 11, 2026',
  },
])

console.log('Event pressure date extraction tests passed.')
