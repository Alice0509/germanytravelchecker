import { validateEventPressureNote } from '../data/eventPressureNotesSchema.js'

export function dateRangesOverlap(startA, endA, startB, endB) {
  return startA <= endB && startB <= endA
}

export function validateEventPressureNotes(notes) {
  if (!Array.isArray(notes)) {
    return ['Event pressure notes must be an array.']
  }

  return notes.flatMap((note, index) =>
    validateEventPressureNote(note).map((error) => `notes[${index}]: ${error}`),
  )
}

export function findEventPressureNotes(notes, { city, startDate, endDate }) {
  if (!Array.isArray(notes)) return []
  if (!city || !startDate || !endDate) return []

  return notes
    .filter((note) => validateEventPressureNote(note).length === 0)
    .filter((note) => note.city === city)
    .filter((note) => dateRangesOverlap(note.startDate, note.endDate, startDate, endDate))
    .filter((note) => ['medium', 'high'].includes(note.pressureLevel))
    .filter((note) => ['medium', 'high'].includes(note.confidence))
    .sort((a, b) => {
      const pressureOrder = { high: 0, medium: 1 }
      return pressureOrder[a.pressureLevel] - pressureOrder[b.pressureLevel]
    })
}

export function hasEventPressure(notes, params) {
  return findEventPressureNotes(notes, params).length > 0
}
