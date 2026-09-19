import {
  findHighPriorityCoverageGaps,
} from './checkHighPriorityEventCoverage.js'

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }

  console.log(`✓ ${message}`)
}

function highSeed(overrides = {}) {
  return {
    id: 'munich-oktoberfest',
    city: 'Munich',
    title: 'Oktoberfest',
    category: 'oktoberfest',
    defaultPressureLevel: 'high',
    sourceUrl: 'https://www.oktoberfest.de/en/',
    knownDates: [],
    dateExtraction: {
      preferredMonths: [9, 10],
      titleKeywords: ['oktoberfest'],
    },
    ...overrides,
  }
}

const missing = findHighPriorityCoverageGaps(
  [highSeed()],
  [],
  '2026-08-31',
)

assert(
  missing.length === 1,
  'flags a high-priority September event with no coverage in August',
)

const coveredByKnownDate = findHighPriorityCoverageGaps(
  [
    highSeed({
      knownDates: [
        {
          startDate: '2026-09-19',
          endDate: '2026-10-04',
        },
      ],
    }),
  ],
  [],
  '2026-08-31',
)

assert(
  coveredByKnownDate.length === 0,
  'accepts an upcoming official known date',
)

const coveredByGeneratedNote =
  findHighPriorityCoverageGaps(
    [highSeed()],
    [
      {
        city: 'Munich',
        title: 'Oktoberfest 2026',
        category: 'oktoberfest',
        startDate: '2026-09-19',
        endDate: '2026-10-04',
      },
    ],
    '2026-08-31',
  )

assert(
  coveredByGeneratedNote.length === 0,
  'accepts an upcoming generated note',
)

const mediumIgnored = findHighPriorityCoverageGaps(
  [
    highSeed({
      defaultPressureLevel: 'medium',
    }),
  ],
  [],
  '2026-08-31',
)

assert(
  mediumIgnored.length === 0,
  'does not block medium-priority events',
)

const laterMonthIgnored = findHighPriorityCoverageGaps(
  [
    highSeed({
      dateExtraction: {
        preferredMonths: [11],
        titleKeywords: ['oktoberfest'],
      },
    }),
  ],
  [],
  '2026-08-31',
)

assert(
  laterMonthIgnored.length === 0,
  'checks the next calendar month rather than all future seasons',
)

console.log('High-priority event coverage tests passed.')
