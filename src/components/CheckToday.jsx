import { useEffect, useMemo, useState } from 'react'
import { TRAVEL_CITIES } from '../data/travelCities.js'
import eventPressureNotes from '../data/eventPressureNotes.generated.json'
import EventPressureBanner from './EventPressureBanner.jsx'
import { formatDateKey, parseDateKey } from '../utils/checkToday.js'
import { buildCheckTodayResult } from '../utils/checkTodayResult.js'
import { findEventPressureNotes } from '../utils/eventPressureNotes.js'
import {
  findPublicHolidayDataset,
  findSchoolHolidayDataset,
  loadPublicHolidayDataset,
  loadPublicHolidayIndex,
  loadSchoolHolidayDataset,
  loadSchoolHolidayIndex,
} from '../services/schulferienklarData.js'

const DEFAULT_NEEDS = ['water', 'groceries']

function getTodayDateKey() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

function getPublicHolidayName(publicHoliday) {
  if (!publicHoliday) {
    return 'No statewide public holiday found'
  }

  return publicHoliday.name?.en || publicHoliday.name?.de || publicHoliday.name || 'Public holiday'
}

function getSchoolHolidayName(schoolHoliday) {
  if (!schoolHoliday) {
    return 'No school holiday period found'
  }

  return schoolHoliday.name?.en || schoolHoliday.name?.de || schoolHoliday.name || 'School holiday period'
}

export default function CheckToday() {
  const [cityId, setCityId] = useState('berlin')
  const [dateKey, setDateKey] = useState(getTodayDateKey)
  const [selectedNeedIds, setSelectedNeedIds] = useState(DEFAULT_NEEDS)
  const [showDetails, setShowDetails] = useState(false)
  const [schoolHolidays, setSchoolHolidays] = useState([])
  const [publicHolidays, setPublicHolidays] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const selectedCity = TRAVEL_CITIES.find((city) => city.id === cityId) || TRAVEL_CITIES[0]
  const selectedDate = parseDateKey(dateKey)
  const selectedYear = selectedDate ? selectedDate.getFullYear() : new Date().getFullYear()

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
        setErrorMessage(error.message || 'Could not load travel date data.')
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
    if (!selectedDate) {
      return null
    }

    return buildCheckTodayResult({
      cityId,
      date: selectedDate,
      publicHolidays,
      schoolHolidays,
      selectedNeedIds,
    })
  }, [cityId, publicHolidays, schoolHolidays, selectedDate, selectedNeedIds])

  const eventPressureMatches = useMemo(() => {
    if (!selectedDate || !selectedCity) {
      return []
    }

    return findEventPressureNotes(eventPressureNotes, {
      city: selectedCity.name,
      startDate: dateKey,
      endDate: dateKey,
    })
  }, [dateKey, selectedCity, selectedDate])

  function toggleNeed(needId) {
    setSelectedNeedIds((current) => {
      if (current.includes(needId)) {
        return current.filter((id) => id !== needId)
      }

      return [...current, needId]
    })
  }

  if (!result) {
    return null
  }

  const mapCityName = encodeURIComponent(result.city.name)
  const liveCheckLinks = [
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
  const showWaterHelp = selectedNeedIds.includes('water')
  const showEssentialsChecklist = result.status.isSunday || result.status.publicHoliday

  return (
    <section className="check-today" id="check-today">
      <div className="check-today-header">
        <p className="card-label">For today or right now</p>
        <h2>{result.title}</h2>
        <span className={`risk-pill risk-${result.riskLevel}`}>{result.riskLevel} risk</span>
      </div>

      <p className="check-intro">
        Use this when you are already in Germany or need a quick same-day
        check. Choose a city, date and what you need to see closure patterns
        and practical fallback options.
      </p>

      <div className="checker-controls">
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
          <span>Germany date</span>
          <input type="date" value={dateKey} onChange={(event) => setDateKey(event.target.value)} />
        </label>
      </div>

      <div className="need-picker" aria-label="What do you need?">
        {result.availableNeeds.map((need) => (
          <button
            className={selectedNeedIds.includes(need.id) ? 'selected' : ''}
            key={need.id}
            type="button"
            onClick={() => toggleNeed(need.id)}
          >
            {need.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="loading-note">Checking Germany travel date data…</p>
      ) : (
        <>
          <p className="result-summary">{result.summary}</p>

          <EventPressureBanner notes={eventPressureMatches} />

          <div className="status-grid compact-status-grid">
            <div>
              <strong>Federal state</strong>
              <span>
                {result.city.englishStateName || result.city.bundeslandName} ({result.city.bundeslandCode})
              </span>
            </div>
            <div>
              <strong>Sunday</strong>
              <span>{result.status.isSunday ? 'Yes' : 'No'}</span>
            </div>
          </div>

          <button
            className="details-toggle"
            type="button"
            onClick={() => setShowDetails((current) => !current)}
          >
            {showDetails ? 'Hide practical details' : 'Show practical details'}
          </button>

          {showDetails && (
            <div className="check-details">
              <div className="status-grid">
                <div>
                  <strong>Public holiday</strong>
                  <span>{getPublicHolidayName(result.status.publicHoliday)}</span>
                </div>
                <div>
                  <strong>School holiday</strong>
                  <span>{getSchoolHolidayName(result.status.schoolHoliday)}</span>
                </div>
              </div>

              {result.guidance.length > 0 && (
                <div className="guidance-list">
                  {result.guidance.map((item) => (
                    <article key={item.title}>
                      <strong>{item.title}</strong>
                      <p>{item.note}</p>
                    </article>
                  ))}
                </div>
              )}

              {showEssentialsChecklist && (
                <div className="essentials-checklist">
                  <div>
                    <strong>Before shops close</strong>
                    <p>
                      If your date is a Sunday or public holiday, prepare small
                      essentials before regular supermarkets close.
                    </p>
                  </div>

                  <div className="essentials-grid">
                    <article>
                      <span>Water</span>
                      <p>Buy water earlier if you can, especially before a late arrival.</p>
                    </article>
                    <article>
                      <span>Simple food</span>
                      <p>Pack snacks, breakfast items or train food before relying on cafés.</p>
                    </article>
                    <article>
                      <span>Daily basics</span>
                      <p>Think about toiletries, baby supplies if needed and chargers.</p>
                    </article>
                    <article>
                      <span>Medication you already use</span>
                      <p>Plan regular medication before pharmacies close. Use official emergency options for urgent help.</p>
                    </article>
                    <article>
                      <span>Cash or coins</span>
                      <p>Some toilets, kiosks or small places may still need cash or coins.</p>
                    </article>
                  </div>
                </div>
              )}

              {showWaterHelp && (
                <div className="water-help-card">
                  <div>
                    <strong>Water quick help</strong>
                    <p>
                      If your date is a Sunday or public holiday, buy water before
                      regular supermarkets close if you can.
                    </p>
                  </div>

                  <div className="water-help-grid">
                    <article>
                      <span>Fallback places</span>
                      <p>
                        Larger stations, airports, gas stations, kiosks, cafés,
                        bakeries, hotel reception or vending machines may help.
                        Availability varies.
                      </p>
                    </article>

                    <article>
                      <span>Still water</span>
                      <p>
                        Look for <em>stilles Wasser</em>, <em>ohne Kohlensäure</em>
                        or <em>naturell</em>.
                      </p>
                    </article>

                    <article>
                      <span>Sparkling water</span>
                      <p>
                        <em>Sprudel</em>, <em>Classic</em> or <em>mit Kohlensäure</em>
                        usually means sparkling.
                      </p>
                    </article>

                    <article>
                      <span>Small Germany note</span>
                      <p>
                        <em>Medium</em> usually means lightly sparkling. <em>Pfand</em>
                        means a bottle deposit.
                      </p>
                    </article>
                  </div>
                </div>
              )}

              <div className="live-check-links">
                <div>
                  <strong>Live opening-hour checks</strong>
                  <p>
                    Opening hours can change quickly. Use Google Maps and official
                    business websites before relying on a place being open.
                  </p>
                </div>
                <div className="live-check-link-list">
                  {liveCheckLinks.map((link) => (
                    <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>

              <p className="disclaimer">{result.disclaimer}</p>
            </div>
          )}
        </>
      )}

      {errorMessage && <p className="error-note">{errorMessage}</p>}
    </section>
  )
}
