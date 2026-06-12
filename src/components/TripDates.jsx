import { useEffect, useMemo, useState } from 'react'
import { TRAVEL_CITIES } from '../data/travelCities.js'
import { addDays, formatDateKey, parseDateKey } from '../utils/checkToday.js'
import { buildTripDatesResult } from '../utils/tripDatesResult.js'
import {
  findPublicHolidayDataset,
  findSchoolHolidayDataset,
  loadPublicHolidayDataset,
  loadPublicHolidayIndex,
  loadSchoolHolidayDataset,
  loadSchoolHolidayIndex,
} from '../services/schulferienklarData.js'

function getTodayDateKey() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return formatDateKey(today)
}

function getDefaultEndDateKey() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return formatDateKey(addDays(today, 3))
}

function formatRangeItem(item) {
  if (item.date) {
    return `${item.date} · ${item.name}`
  }

  if (item.startDate && item.endDate) {
    return `${item.startDate} – ${item.endDate} · ${item.name}`
  }

  return item.name
}

export default function TripDates() {
  const [cityId, setCityId] = useState('berlin')
  const [startDateKey, setStartDateKey] = useState(getTodayDateKey)
  const [endDateKey, setEndDateKey] = useState(getDefaultEndDateKey)
  const [schoolHolidays, setSchoolHolidays] = useState([])
  const [publicHolidays, setPublicHolidays] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const selectedCity = TRAVEL_CITIES.find((city) => city.id === cityId) || TRAVEL_CITIES[0]
  const startDate = parseDateKey(startDateKey)
  const endDate = parseDateKey(endDateKey)
  const selectedYear = startDate ? startDate.getFullYear() : new Date().getFullYear()

  useEffect(() => {
    let isActive = true

    async function loadData() {
      if (!selectedCity || !selectedYear) {
        return
      }

      try {
        setIsLoading(true)
        setErrorMessage('')

        const [schoolIndex, publicIndex] = await Promise.all([
          loadSchoolHolidayIndex(),
          loadPublicHolidayIndex(),
        ])

        const schoolDataset = findSchoolHolidayDataset(schoolIndex, selectedCity.bundeslandCode)
        const publicDataset = findPublicHolidayDataset(
          publicIndex,
          selectedCity.bundeslandCode,
          selectedYear,
        )

        const [schoolData, publicData] = await Promise.all([
          schoolDataset ? loadSchoolHolidayDataset(schoolDataset.jsonFile) : Promise.resolve({ holidays: [] }),
          publicDataset ? loadPublicHolidayDataset(publicDataset.jsonFile) : Promise.resolve({ holidays: [] }),
        ])

        if (!isActive) {
          return
        }

        setSchoolHolidays(schoolData.holidays || [])
        setPublicHolidays(publicData.holidays || [])
      } catch (error) {
        if (!isActive) {
          return
        }

        setSchoolHolidays([])
        setPublicHolidays([])
        setErrorMessage(error.message || 'Could not load trip date data.')
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
  }, [selectedCity, selectedYear])

  const result = useMemo(() => {
    if (!startDate || !endDate) {
      return null
    }

    return buildTripDatesResult({
      cityId,
      startDate,
      endDate,
      publicHolidays,
      schoolHolidays,
    })
  }, [cityId, endDate, publicHolidays, schoolHolidays, startDate])

  const showEssentialsWarning =
    result?.warnings.some((warning) => warning.type === 'sunday' || warning.type === 'public-holiday') || false
  const mapCityName = result ? encodeURIComponent(result.city.name) : ''
  const tripLiveLinks = result
    ? [
        {
          label: `Check supermarkets in ${result.city.name} on Google Maps`,
          href: `https://www.google.com/maps/search/supermarket+${mapCityName}`,
        },
        {
          label: `Check cafés & bakeries in ${result.city.name} on Google Maps`,
          href: `https://www.google.com/maps/search/cafe+bakery+${mapCityName}`,
        },
        {
          label: `Check pharmacies in ${result.city.name} on Google Maps`,
          href: `https://www.google.com/maps/search/pharmacy+${mapCityName}`,
        },
      ]
    : []

  return (
    <section className="section trip-dates-section" id="trip-dates">
      <div className="section-heading">
        <p className="eyebrow">For planning before you book</p>
        <h2>Check whether your travel dates need extra planning.</h2>
        <p>
          Use this before booking hotels, trains or activities. Choose one city
          and a date range to see whether your trip overlaps Sundays, public
          holidays or school holiday periods.
        </p>
      </div>

      <div className="trip-dates-card">
        <div className="trip-controls">
          <label>
            <span>City</span>
            <select value={cityId} onChange={(event) => setCityId(event.target.value)}>
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
              value={startDateKey}
              onChange={(event) => setStartDateKey(event.target.value)}
            />
          </label>

          <label>
            <span>End date</span>
            <input
              type="date"
              value={endDateKey}
              onChange={(event) => setEndDateKey(event.target.value)}
            />
          </label>
        </div>

        {isLoading ? (
          <p className="trip-loading">Checking your trip dates…</p>
        ) : result ? (
          <div className="trip-result">
            <div className="trip-result-header">
              <div>
                <p className="card-label">Trip risk</p>
                <h3>{result.title}</h3>
              </div>
              <span className={`risk-pill risk-${result.riskLevel}`}>{result.riskLevel} risk</span>
            </div>

            <p className="trip-summary">{result.summary}</p>

            <div className="trip-meta-grid">
              <div>
                <strong>City</strong>
                <span>{result.city.name}</span>
              </div>
              <div>
                <strong>Federal state</strong>
                <span>
                  {result.city.englishStateName || result.city.bundeslandName} ({result.city.bundeslandCode})
                </span>
              </div>
              <div>
                <strong>Trip length</strong>
                <span>{result.dayCount} days</span>
              </div>
              <div>
                <strong>Date range</strong>
                <span>
                  {result.startDateKey} – {result.endDateKey}
                </span>
              </div>
            </div>

            {result.warnings.length > 0 ? (
              <div className="trip-warning-list">
                {result.warnings.map((warning) => (
                  <article key={warning.type}>
                    <strong>{warning.title}</strong>
                    <p>{warning.note}</p>
                    {warning.items.length > 0 && (
                      <ul>
                        {warning.items.map((item) => (
                          <li key={`${warning.type}-${formatRangeItem(item)}`}>
                            {formatRangeItem(item)}
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <p className="trip-clear-note">
                No major calendar signal was found in this date range.
              </p>
            )}

            {result.seasonalEventNotes?.length > 0 && (
              <div className="trip-warning-list">
                {result.seasonalEventNotes.map((note) => (
                  <article key={note.id}>
                    <strong>{note.title}</strong>
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
                  </article>
                ))}
              </div>
            )}

            {showEssentialsWarning && (
              <div className="trip-essentials-card">
                <strong>Before shops close</strong>
                <p>
                  Your date range includes a Sunday or public holiday. Buy water,
                  simple breakfast items, snacks, toiletries and regular medication
                  you already use before regular supermarkets or pharmacies close.
                </p>
                <p>
                  If you arrive late or travel by train, carry water, small food
                  and some cash or coins for toilets, kiosks or small places.
                </p>
              </div>
            )}

            <div className="trip-live-links">
              <div>
                <strong>Live checks in {result.city.name}</strong>
                <p>
                  Use live sources before relying on exact opening hours during
                  your trip dates.
                </p>
              </div>
              <div className="trip-live-link-list">
                {tripLiveLinks.map((link) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <p className="trip-disclaimer">{result.disclaimer}</p>
          </div>
        ) : (
          <p className="trip-loading">Choose valid start and end dates.</p>
        )}

        {errorMessage && <p className="error-note">{errorMessage}</p>}
      </div>
    </section>
  )
}
