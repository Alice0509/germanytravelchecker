const MONTH_LOOKUP = new Map([
  ['january', '01'],
  ['jan', '01'],
  ['february', '02'],
  ['feb', '02'],
  ['march', '03'],
  ['mar', '03'],
  ['april', '04'],
  ['apr', '04'],
  ['may', '05'],
  ['june', '06'],
  ['jun', '06'],
  ['july', '07'],
  ['jul', '07'],
  ['august', '08'],
  ['aug', '08'],
  ['september', '09'],
  ['sep', '09'],
  ['october', '10'],
  ['oct', '10'],
  ['november', '11'],
  ['nov', '11'],
  ['december', '12'],
  ['dec', '12'],

  ['januar', '01'],
  ['februar', '02'],
  ['märz', '03'],
  ['maerz', '03'],
  ['marz', '03'],
  ['april', '04'],
  ['mai', '05'],
  ['juni', '06'],
  ['juli', '07'],
  ['august', '08'],
  ['september', '09'],
  ['oktober', '10'],
  ['november', '11'],
  ['dezember', '12'],
])

function pad2(value) {
  return String(value).padStart(2, '0')
}

function normalizeMonth(value) {
  return MONTH_LOOKUP.get(
    String(value || '')
      .toLowerCase()
      .replace('.', '')
      .normalize('NFC'),
  ) || ''
}

function isIsoDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function toIsoDate(year, month, day) {
  const isoDate = `${year}-${pad2(month)}-${pad2(day)}`

  if (!isIsoDate(isoDate)) {
    return ''
  }

  return isoDate
}

function cleanText(value) {
  return String(value || '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#8211;|&ndash;/g, '–')
    .replace(/&#8212;|&mdash;/g, '—')
    .replace(/\s+/g, ' ')
    .trim()
}

function uniqueSortedDates(values, years) {
  return [...new Set(values)]
    .filter(isIsoDate)
    .filter((value) => years.some((year) => value.startsWith(String(year))))
    .sort()
}

function uniqueSortedRanges(values, years) {
  const seen = new Set()
  const ranges = []

  for (const range of values) {
    if (!range?.startDate || !range?.endDate) continue
    if (!isIsoDate(range.startDate) || !isIsoDate(range.endDate)) continue
    if (range.startDate > range.endDate) continue

    const hasTargetYear = years.some((year) =>
      range.startDate.startsWith(String(year)) || range.endDate.startsWith(String(year)),
    )

    if (!hasTargetYear) continue

    const key = `${range.startDate}|${range.endDate}`
    if (seen.has(key)) continue

    seen.add(key)
    ranges.push(range)
  }

  return ranges.sort((a, b) => {
    const startCompare = a.startDate.localeCompare(b.startDate)
    if (startCompare !== 0) return startCompare
    return a.endDate.localeCompare(b.endDate)
  })
}

export function extractDateHints(text, years) {
  const source = cleanText(text)
  const hints = []

  for (const match of source.matchAll(/\b(20\d{2})-(\d{2})-(\d{2})\b/g)) {
    hints.push(`${match[1]}-${match[2]}-${match[3]}`)
  }

  for (const match of source.matchAll(/\b(\d{1,2})\.(\d{1,2})\.(20\d{2})\b/g)) {
    hints.push(toIsoDate(match[3], match[2], match[1]))
  }

  for (const match of source.matchAll(/\b([A-Za-zÄÖÜäöüß]+)\.?\s+(\d{1,2}),?\s+(20\d{2})\b/g)) {
    const month = normalizeMonth(match[1])
    if (month) {
      hints.push(toIsoDate(match[3], month, match[2]))
    }
  }

  for (const match of source.matchAll(/\b(\d{1,2})\.\s*([A-Za-zÄÖÜäöüß]+)\.?\s*(20\d{2})\b/g)) {
    const month = normalizeMonth(match[2])
    if (month) {
      hints.push(toIsoDate(match[3], month, match[1]))
    }
  }

  return uniqueSortedDates(hints, years)
}

export function extractDateRangeHints(text, years) {
  const source = cleanText(text)
  const ranges = []

  for (const match of source.matchAll(/\b(20\d{2}-\d{2}-\d{2})\s*(?:to|until|through|[-–—])\s*(20\d{2}-\d{2}-\d{2})\b/gi)) {
    ranges.push({ startDate: match[1], endDate: match[2], sourceText: match[0] })
  }

  for (const match of source.matchAll(/\b(\d{1,2})\.(\d{1,2})\.(20\d{2})\s*(?:to|until|through|[-–—])\s*(\d{1,2})\.(\d{1,2})\.(20\d{2})\b/gi)) {
    ranges.push({
      startDate: toIsoDate(match[3], match[2], match[1]),
      endDate: toIsoDate(match[6], match[5], match[4]),
      sourceText: match[0],
    })
  }

  for (const match of source.matchAll(/\b([A-Za-zÄÖÜäöüß]+)\.?\s+(\d{1,2}),?\s*(20\d{2})\s*(?:to|until|through|[-–—])\s*([A-Za-zÄÖÜäöüß]+)\.?\s+(\d{1,2}),?\s*(20\d{2})\b/gi)) {
    const startMonth = normalizeMonth(match[1])
    const endMonth = normalizeMonth(match[4])

    if (startMonth && endMonth) {
      ranges.push({
        startDate: toIsoDate(match[3], startMonth, match[2]),
        endDate: toIsoDate(match[6], endMonth, match[5]),
        sourceText: match[0],
      })
    }
  }

  for (const match of source.matchAll(/\b([A-Za-zÄÖÜäöüß]+)\.?\s+(\d{1,2})\s*(?:to|until|through|[-–—])\s*([A-Za-zÄÖÜäöüß]+)\.?\s+(\d{1,2}),?\s*(20\d{2})\b/gi)) {
    const startMonth = normalizeMonth(match[1])
    const endMonth = normalizeMonth(match[3])

    if (startMonth && endMonth) {
      ranges.push({
        startDate: toIsoDate(match[5], startMonth, match[2]),
        endDate: toIsoDate(match[5], endMonth, match[4]),
        sourceText: match[0],
      })
    }
  }

  for (const match of source.matchAll(/\b(\d{1,2})\.\s*([A-Za-zÄÖÜäöüß]+)\.?\s*(?:to|until|through|[-–—])\s*(\d{1,2})\.\s*([A-Za-zÄÖÜäöüß]+)\.?\s*(20\d{2})\b/gi)) {
    const startMonth = normalizeMonth(match[2])
    const endMonth = normalizeMonth(match[4])

    if (startMonth && endMonth) {
      ranges.push({
        startDate: toIsoDate(match[5], startMonth, match[1]),
        endDate: toIsoDate(match[5], endMonth, match[3]),
        sourceText: match[0],
      })
    }
  }

  return uniqueSortedRanges(ranges, years)
}

export function extractDateSignals(text, years) {
  const dateHints = extractDateHints(text, years)
  const dateRangeHints = extractDateRangeHints(text, years)

  return {
    dateHints,
    dateRangeHints,
  }
}
