export const checkedCopySafetyFields = [
  'title',
  'travelerImpact',
  'recommendedAction',
  'note',
  'reviewNote',
  'sourceNote',
]

export const forbiddenCopySafetyPatterns = [
  {
    pattern: /\blive\b/i,
    reason: 'Do not imply live status.',
  },
  {
    pattern: /\breal[-\s]?time\b/i,
    reason: 'Do not imply real-time status.',
  },
  {
    pattern: /\bcurrently\b/i,
    reason: 'Avoid current-state claims.',
  },
  {
    pattern: /\bright now\b/i,
    reason: 'Avoid current-state claims.',
  },
  {
    pattern: /\bcrowded\b/i,
    reason: 'Avoid claiming crowd conditions.',
  },
  {
    pattern: /\bpacked\b/i,
    reason: 'Avoid claiming crowd conditions.',
  },
  {
    pattern: /\bfully booked\b/i,
    reason: 'Avoid hotel/availability claims.',
  },
  {
    pattern: /\bsold out\b/i,
    reason: 'Avoid availability claims.',
  },
  {
    pattern: /\btrains? (are|is|will be) (delayed|cancelled|disrupted)\b/i,
    reason: 'Avoid train status claims.',
  },
  {
    pattern: /\bshops? (are|is|will be) closed\b/i,
    reason: 'Avoid blanket shop closure claims.',
  },
  {
    pattern: /\ball shops\b/i,
    reason: 'Avoid blanket shop closure claims.',
  },
  {
    pattern: /\ball trains\b/i,
    reason: 'Avoid blanket train claims.',
  },
]

export function collectCopySafetyTextValues(item) {
  const values = []

  for (const field of checkedCopySafetyFields) {
    const value = item[field]
    if (typeof value === 'string') {
      values.push({ field, value })
    }
  }

  if (Array.isArray(item.reasons)) {
    item.reasons.forEach((value, index) => {
      if (typeof value === 'string') {
        values.push({ field: `reasons[${index}]`, value })
      }
    })
  }

  return values
}

export function findCopySafetyErrors(items, label = 'items') {
  const errors = []

  if (!Array.isArray(items)) {
    return [`${label}: expected array`]
  }

  for (const item of items) {
    const id = item?.id || '(missing id)'

    for (const { field, value } of collectCopySafetyTextValues(item || {}) ) {
      for (const forbidden of forbiddenCopySafetyPatterns) {
        if (forbidden.pattern.test(value)) {
          errors.push(`${label} · ${id} · ${field}: ${forbidden.reason} Matched "${forbidden.pattern}".`)
        }
      }
    }
  }

  return errors
}
