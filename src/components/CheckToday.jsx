import { useEffect, useMemo, useState } from 'react'
import { TRAVEL_CITIES } from '../data/travelCities.js'
import { formatDateKey, parseDateKey } from '../utils/checkToday.js'
import { buildCheckTodayResult } from '../utils/checkTodayResult.js'
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
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return formatDateKey(today)
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
          <span>Date</span>
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

          <div className="status-grid">
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

          <p className="disclaimer">{result.disclaimer}</p>
        </>
      )}

      {errorMessage && <p className="error-note">{errorMessage}</p>}
    </section>
  )
}
