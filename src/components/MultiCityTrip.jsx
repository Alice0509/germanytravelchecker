import { useEffect, useMemo, useState } from 'react'
import { TRAVEL_CITIES } from '../data/travelCities.js'
import { addDays, formatDateKey, parseDateKey } from '../utils/checkToday.js'
import { buildMultiCityTripResult } from '../utils/multiCityTripResult.js'
import {
  findPublicHolidayDataset,
  findSchoolHolidayDataset,
  loadPublicHolidayDataset,
  loadPublicHolidayIndex,
  loadSchoolHolidayDataset,
  loadSchoolHolidayIndex,
} from '../services/schulferienklarData.js'

const MAX_SEGMENTS = 5

function getTodayDateKey() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return formatDateKey(today)
}

function getDateKeyFromToday(offset) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return formatDateKey(addDays(today, offset))
}

function getInitialCityIdFromUrl() {
  if (typeof window === 'undefined') {
    return null
  }

  const cityId = new URLSearchParams(window.location.search).get('from')

  if (!cityId || !TRAVEL_CITIES.some((city) => city.id === cityId)) {
    return null
  }

  return cityId
}

function getFallbackSecondCityId(firstCityId) {
  if (firstCityId === 'berlin') {
    return 'munich'
  }

  return 'berlin'
}

function createDefaultSegments() {
  const firstCityId = getInitialCityIdFromUrl() || 'munich'
  const secondCityId = getFallbackSecondCityId(firstCityId)

  return [
    {
      id: 'segment-1',
      cityId: firstCityId,
      startDate: getTodayDateKey(),
      endDate: getDateKeyFromToday(3),
    },
    {
      id: 'segment-2',
      cityId: secondCityId,
      startDate: getDateKeyFromToday(3),
      endDate: getDateKeyFromToday(7),
    },
  ]
}

function formatWarningItem(item) {
  if (item.date) {
    return `${item.date} · ${item.name}`
  }

  if (item.startDate && item.endDate) {
    return `${item.startDate} – ${item.endDate} · ${item.name}`
  }

  return item.name
}

function getSegmentYear(segment) {
  const date = parseDateKey(segment.startDate)
  return date ? date.getFullYear() : new Date().getFullYear()
}

function getSegmentCity(segment) {
  return TRAVEL_CITIES.find((city) => city.id === segment.cityId) || TRAVEL_CITIES[0]
}

export default function MultiCityTrip() {
  const [segments, setSegments] = useState(createDefaultSegments)
  const [holidayDataBySegment, setHolidayDataBySegment] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isActive = true

    async function loadData() {
      try {
        setIsLoading(true)
        setErrorMessage('')

        const [schoolIndex, publicIndex] = await Promise.all([
          loadSchoolHolidayIndex(),
          loadPublicHolidayIndex(),
        ])

        const entries = await Promise.all(
          segments.map(async (segment) => {
            const city = getSegmentCity(segment)
            const year = getSegmentYear(segment)

            const schoolDataset = findSchoolHolidayDataset(schoolIndex, city.bundeslandCode)
            const publicDataset = findPublicHolidayDataset(publicIndex, city.bundeslandCode, year)

            const [schoolData, publicData] = await Promise.all([
              schoolDataset ? loadSchoolHolidayDataset(schoolDataset.jsonFile) : Promise.resolve({ holidays: [] }),
              publicDataset ? loadPublicHolidayDataset(publicDataset.jsonFile) : Promise.resolve({ holidays: [] }),
            ])

            return [
              segment.id,
              {
                schoolHolidays: schoolData.holidays || [],
                publicHolidays: publicData.holidays || [],
              },
            ]
          }),
        )

        if (!isActive) {
          return
        }

        setHolidayDataBySegment(Object.fromEntries(entries))
      } catch (error) {
        if (!isActive) {
          return
        }

        setHolidayDataBySegment({})
        setErrorMessage(error.message || 'Could not load multi-city trip data.')
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadData()

    return () => {
      isActive = false
    }
  }, [segments])

  const result = useMemo(() => {
    const enrichedSegments = segments.map((segment) => {
      const holidayData = holidayDataBySegment[segment.id] || {}

      return {
        ...segment,
        publicHolidays: holidayData.publicHolidays || [],
        schoolHolidays: holidayData.schoolHolidays || [],
      }
    })

    return buildMultiCityTripResult({ segments: enrichedSegments })
  }, [holidayDataBySegment, segments])

  const showTransferEssentials =
    result?.transferDays.length > 0 && result.riskLevel !== 'low'

  function updateSegment(segmentId, updates) {
    setSegments((current) =>
      current.map((segment) => (segment.id === segmentId ? { ...segment, ...updates } : segment)),
    )
  }

  function addSegment() {
    setSegments((current) => {
      if (current.length >= MAX_SEGMENTS) {
        return current
      }

      const previousSegment = current[current.length - 1]
      const startDate = previousSegment?.endDate || getTodayDateKey()
      const endDate = formatDateKey(addDays(parseDateKey(startDate) || new Date(), 3))

      return [
        ...current,
        {
          id: `segment-${Date.now()}`,
          cityId: 'hamburg',
          startDate,
          endDate,
        },
      ]
    })
  }

  function removeSegment(segmentId) {
    setSegments((current) => {
      if (current.length <= 2) {
        return current
      }

      return current.filter((segment) => segment.id !== segmentId)
    })
  }

  return (
    <section className="section multi-city-section" id="multi-city-trip">
      <div className="section-heading">
        <p className="eyebrow">For multi-city itineraries</p>
        <h2>Check a Germany trip across more than one city.</h2>
        <p>
          Add city segments such as Munich to Berlin to see the overall trip
          risk, transfer day notes and per-city holiday warnings.
        </p>
      </div>

      <div className="multi-city-card">
        <div className="segment-list">
          {segments.map((segment, index) => (
            <article className="segment-editor" key={segment.id}>
              <div className="segment-editor-header">
                <strong>Segment {index + 1}</strong>
                {segments.length > 2 && (
                  <button type="button" onClick={() => removeSegment(segment.id)}>
                    Remove
                  </button>
                )}
              </div>

              <div className="segment-controls">
                <label>
                  <span>City</span>
                  <select
                    value={segment.cityId}
                    onChange={(event) => updateSegment(segment.id, { cityId: event.target.value })}
                  >
                    {TRAVEL_CITIES.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>Start date</span>
                  <input
                    type="date"
                    value={segment.startDate}
                    onChange={(event) => updateSegment(segment.id, { startDate: event.target.value })}
                  />
                </label>

                <label>
                  <span>End date</span>
                  <input
                    type="date"
                    value={segment.endDate}
                    onChange={(event) => updateSegment(segment.id, { endDate: event.target.value })}
                  />
                </label>
              </div>
            </article>
          ))}
        </div>

        <button
          className="add-segment-button"
          type="button"
          onClick={addSegment}
          disabled={segments.length >= MAX_SEGMENTS}
        >
          {segments.length >= MAX_SEGMENTS ? 'Maximum 5 segments' : 'Add another city'}
        </button>

        {isLoading ? (
          <p className="trip-loading">Checking your multi-city itinerary…</p>
        ) : result ? (
          <div className="multi-city-result">
            <div className="trip-result-header">
              <div>
                <p className="card-label">Itinerary risk</p>
                <h3>{result.title}</h3>
              </div>
              <span className={`risk-pill risk-${result.riskLevel}`}>{result.riskLevel} risk</span>
            </div>

            <p className="trip-summary">{result.summary}</p>

            <div className="trip-meta-grid">
              <div>
                <strong>Segments</strong>
                <span>{result.segmentCount}</span>
              </div>
              <div>
                <strong>Date span</strong>
                <span>
                  {result.dateSpan?.startDateKey} – {result.dateSpan?.endDateKey}
                </span>
              </div>
              <div>
                <strong>Transfer days</strong>
                <span>{result.transferDays.length}</span>
              </div>
              <div>
                <strong>Cities</strong>
                <span>{result.segmentResults.map((segment) => segment.city.name).join(' → ')}</span>
              </div>
            </div>

            {result.transferDays.length > 0 && (
              <div className="transfer-list">
                {result.transferDays.map((transfer) => (
                  <article key={`${transfer.fromCity}-${transfer.toCity}-${transfer.date}`}>
                    <strong>
                      {transfer.date}: {transfer.fromCity} → {transfer.toCity}
                    </strong>
                    <p>{transfer.note}</p>
                  </article>
                ))}
              </div>
            )}

            <div className="multi-segment-results">
              {result.segmentResults.map((segment) => (
                <article className="multi-segment-result" key={segment.segmentId}>
                  <div className="segment-result-heading">
                    <div>
                      <strong>{segment.city.name}</strong>
                      <span>
                        {segment.startDateKey} – {segment.endDateKey}
                      </span>
                    </div>
                    <span className={`risk-pill risk-${segment.riskLevel}`}>{segment.riskLevel}</span>
                  </div>

                  <p>{segment.summary}</p>

                  {segment.warnings.length > 0 && (
                    <div className="segment-warning-list">
                      {segment.warnings.map((warning) => (
                        <div key={`${segment.segmentId}-${warning.type}`}>
                          <strong>{warning.title}</strong>
                          <ul>
                            {warning.items.map((item) => (
                              <li key={`${warning.type}-${formatWarningItem(item)}`}>
                                {formatWarningItem(item)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {segment.seasonalEventNotes?.length > 0 && (
                    <div className="seasonal-event-note-list seasonal-event-note-list-compact">
                      {segment.seasonalEventNotes.map((note) => (
                        <div key={`${segment.segmentId}-${note.id}`}>
                          <strong>{note.title}</strong>
                          {note.eventName && <h4>{note.eventName}</h4>}
                          {note.dateLabel && <p className="seasonal-event-date">{note.dateLabel}</p>}
                          <p>{note.summary}</p>
                          <p>{note.sourceNote}</p>
                          <ul>
                            {note.links.map((link) => (
                              <li key={link.href}>
                                <a href={link.href} target="_blank" rel="noreferrer">
                                  {link.label}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {segment.riskLevel !== 'low' && (
                    <div className="segment-live-links">
                      <strong>Live checks in {segment.city.name}</strong>
                      <div>
                        <a
                          href={`https://www.google.com/maps/search/supermarket+${encodeURIComponent(segment.city.name)}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Supermarkets
                        </a>
                        <a
                          href={`https://www.google.com/maps/search/pharmacy+${encodeURIComponent(segment.city.name)}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Pharmacies
                        </a>
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>

            {showTransferEssentials && (
              <div className="transfer-essentials-card">
                <strong>Transfer day essentials</strong>
                <p>
                  Transfer days can feel harder when shops are closed, trains are
                  busy or you arrive late. Carry water, simple food, charger power
                  and any regular medication you already use.
                </p>
                <p>
                  Do not rely on shopping after arrival. Some toilets, kiosks or
                  small places may also need cash or coins.
                </p>
              </div>
            )}

            <p className="trip-disclaimer">{result.disclaimer}</p>
          </div>
        ) : (
          <p className="trip-loading">Add at least two valid city segments.</p>
        )}

        {errorMessage && <p className="error-note">{errorMessage}</p>}
      </div>
    </section>
  )
}
