import { CITY_GUIDES } from '../data/cityGuides.js'
import { findTravelCityById } from '../data/travelCities.js'

export default function CityGuidePreview() {
  return (
    <section className="section city-guide-section" id="city-guides">
      <div className="section-heading">
        <p className="eyebrow">City guides</p>
        <h2>Start with practical city checks.</h2>
        <p>
          Berlin and Munich are the first city guide previews. Each guide focuses
          on federal state rules, Sunday closures, public holidays, school
          holiday travel effects, essentials and pharmacy guidance.
        </p>
      </div>

      <div className="city-guide-grid">
        {CITY_GUIDES.map((guide) => {
          const city = findTravelCityById(guide.cityId)

          return (
            <article className="city-guide-card" key={guide.cityId}>
              <span className="mode-kicker">
                {city?.englishStateName || city?.bundeslandName || 'Germany'}
              </span>
              <h3>{guide.title}</h3>
              <p>{guide.overview}</p>

              <div className="city-guide-notes">
                <div>
                  <strong>Public holidays</strong>
                  <span>{guide.publicHolidayNote}</span>
                </div>
                <div>
                  <strong>Sundays</strong>
                  <span>{guide.sundayClosureNote}</span>
                </div>
                <div>
                  <strong>Pharmacies</strong>
                  <span>{guide.pharmacyNote}</span>
                </div>
              </div>

              <div className="city-guide-actions">
                <a href="#check-today">Check today</a>
                <a href="#trip-dates">Check dates</a>
                <a href="#multi-city-trip">Multi-city</a>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
