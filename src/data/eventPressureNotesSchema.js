export const SUPPORTED_EVENT_PRESSURE_CITIES = [
  'Berlin',
  'Munich',
  'Hamburg',
  'Cologne',
  'Frankfurt',
  'Stuttgart',
  'Dresden',
  'Nuremberg',
]

export const EVENT_PRESSURE_CATEGORIES = [
  'stadium_event',
  'football_match',
  'trade_fair',
  'city_festival',
  'christmas_market',
  'oktoberfest',
  'new_year',
  'transport_event',
  'other_major_event',
]

export const EVENT_PRESSURE_LEVELS = ['medium', 'high']

export const EVENT_PRESSURE_SOURCE_TYPES = [
  'official_city',
  'official_tourism',
  'official_venue',
  'official_messe',
  'official_transport',
  'ticket_platform_secondary',
  'manual_reviewed',
]

export const EVENT_PRESSURE_CONFIDENCE_LEVELS = ['medium', 'high']

export const EVENT_PRESSURE_DISPLAY_MODES = ['banner', 'planner_note']

export const REQUIRED_EVENT_PRESSURE_FIELDS = [
  'id',
  'city',
  'startDate',
  'endDate',
  'category',
  'pressureLevel',
  'title',
  'travelerImpact',
  'recommendedAction',
  'verifyLinks',
  'sourceType',
  'sourceCheckedAt',
  'confidence',
]

export function isSupportedEventPressureCity(city) {
  return SUPPORTED_EVENT_PRESSURE_CITIES.includes(city)
}

export function isIsoDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
}

export function validateEventPressureNote(note) {
  const errors = []

  if (!note || typeof note !== 'object' || Array.isArray(note)) {
    return ['Note must be an object.']
  }

  for (const field of REQUIRED_EVENT_PRESSURE_FIELDS) {
    if (!(field in note)) {
      errors.push(`Missing required field: ${field}`)
    }
  }

  if ('city' in note && !SUPPORTED_EVENT_PRESSURE_CITIES.includes(note.city)) {
    errors.push(`Unsupported city: ${note.city}`)
  }

  if ('startDate' in note && !isIsoDate(note.startDate)) {
    errors.push('startDate must use YYYY-MM-DD format.')
  }

  if ('endDate' in note && !isIsoDate(note.endDate)) {
    errors.push('endDate must use YYYY-MM-DD format.')
  }

  if (isIsoDate(note.startDate) && isIsoDate(note.endDate) && note.startDate > note.endDate) {
    errors.push('startDate must be before or equal to endDate.')
  }

  if ('category' in note && !EVENT_PRESSURE_CATEGORIES.includes(note.category)) {
    errors.push(`Unsupported category: ${note.category}`)
  }

  if ('pressureLevel' in note && !EVENT_PRESSURE_LEVELS.includes(note.pressureLevel)) {
    errors.push(`Unsupported pressureLevel: ${note.pressureLevel}`)
  }

  if ('sourceType' in note && !EVENT_PRESSURE_SOURCE_TYPES.includes(note.sourceType)) {
    errors.push(`Unsupported sourceType: ${note.sourceType}`)
  }

  if ('confidence' in note && !EVENT_PRESSURE_CONFIDENCE_LEVELS.includes(note.confidence)) {
    errors.push(`Unsupported confidence: ${note.confidence}`)
  }

  if ('displayMode' in note && !EVENT_PRESSURE_DISPLAY_MODES.includes(note.displayMode)) {
    errors.push(`Unsupported displayMode: ${note.displayMode}`)
  }

  if ('verifyLinks' in note) {
    if (!Array.isArray(note.verifyLinks) || note.verifyLinks.length === 0) {
      errors.push('verifyLinks must contain at least one link.')
    } else {
      note.verifyLinks.forEach((link, index) => {
        if (!link || typeof link !== 'object') {
          errors.push(`verifyLinks[${index}] must be an object.`)
          return
        }

        if (!link.label) {
          errors.push(`verifyLinks[${index}].label is required.`)
        }

        if (!link.url) {
          errors.push(`verifyLinks[${index}].url is required.`)
        }
      })
    }
  }

  return errors
}
