export function getMonthNumber(dateKey) {
  const value = String(dateKey || '').slice(5, 7)
  const month = Number(value)
  return Number.isFinite(month) ? month : 0
}

export function rangeMatchesPreferredMonths(range, preferredMonths = []) {
  if (!Array.isArray(preferredMonths) || preferredMonths.length === 0) {
    return true
  }

  const startMonth = getMonthNumber(range.startDate)
  const endMonth = getMonthNumber(range.endDate)

  return preferredMonths.includes(startMonth) || preferredMonths.includes(endMonth)
}

export function scoreDateRange(range, seed, targetYear) {
  let score = 0
  const profile = seed.dateExtraction || {}

  if (String(range.startDate || '').startsWith(String(targetYear))) {
    score += 3
  }

  if (String(range.endDate || '').startsWith(String(targetYear))) {
    score += 3
  }

  if (rangeMatchesPreferredMonths(range, profile.preferredMonths)) {
    score += 4
  }

  const sourceText = String(range.sourceText || '').toLowerCase()
  for (const keyword of profile.titleKeywords || []) {
    if (sourceText.includes(String(keyword).toLowerCase())) {
      score += 2
    }
  }

  return score
}

export function pickDateRangeForYear(scanResult, seed, targetYear) {
  const ranges = (scanResult.dateRangeHints || []).filter((range) =>
    String(range.startDate || '').startsWith(String(targetYear)) ||
    String(range.endDate || '').startsWith(String(targetYear)),
  )

  if (ranges.length === 0) {
    return null
  }

  const scored = ranges
    .map((range) => ({
      range,
      score: scoreDateRange(range, seed, targetYear),
    }))
    .sort((a, b) => b.score - a.score)

  if (scored.length === 1) {
    return scored[0].range
  }

  if (scored[0].score > scored[1].score) {
    return scored[0].range
  }

  return null
}
