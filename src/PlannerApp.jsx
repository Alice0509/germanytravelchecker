import TripDates from './components/TripDates.jsx'
import MultiCityTrip from './components/MultiCityTrip.jsx'
import './App.css'

const PLANNER_NOTES = [
  {
    title: 'Sundays',
    text: 'Many regular shops and supermarkets are closed on Sundays in Germany, so essentials may need extra planning.',
  },
  {
    title: 'Public holidays',
    text: 'Public holidays can vary by federal state. A normal day in Berlin may be a holiday in Bavaria.',
  },
  {
    title: 'School holidays',
    text: 'School holiday periods can increase pressure on trains, roads, hotels and popular attractions.',
  },
]

function PlannerApp() {
  return (
    <main className="planner-page">
      <section className="planner-hero">
        <div className="eyebrow">Germany trip planner</div>
        <h1>Check your Germany travel dates before they get complicated.</h1>
        <p>
          Plan around German Sundays, public holidays, school holiday travel
          periods and multi-city transfer days. This planner uses rule-based
          guidance for practical travel friction, not AI guesses or live shop
          opening-hour claims.
        </p>

        <div className="planner-actions">
          <a href="#trip-dates">Check one city</a>
          <a href="#multi-city-trip">Check multiple cities</a>
          <a href="/">Check today instead</a>
        </div>
      </section>

      <section className="planner-intro" aria-label="Planner notes">
        {PLANNER_NOTES.map((item) => (
          <article className="planner-note" key={item.title}>
            <h2>{item.title}</h2>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <div id="trip-dates">
        <TripDates />
      </div>

      <div id="multi-city-trip">
        <MultiCityTrip />
      </div>


      <section className="planner-city-guides">
        <div>
          <p className="eyebrow">City checks</p>
          <h2>Planning Berlin or Munich?</h2>
          <p>
            Open a practical city guide for local closure notes, fallback ideas
            and Germany-specific travel friction before you finalize your plans.
          </p>
        </div>
        <div className="planner-city-links">
          <a href="/berlin.html">Open Berlin guide</a>
          <a href="/munich.html">Open Munich guide</a>
        </div>
      </section>

      <section className="planner-trust">
        <div className="eyebrow">Trust and safety</div>
        <h2>Helpful, but careful.</h2>
        <p>
          Germany Travel Checker does not provide exact shop opening hours,
          live pharmacy duty schedules, medical diagnosis or emergency triage.
          Verify time-sensitive details through Google Maps, official business
          websites, official Notdienst-Apotheke services and official emergency
          sources when needed.
        </p>
      </section>

      <footer className="planner-footer">
        <a href="/">Germany Travel Checker</a>
        <a href="/impressum.html">Impressum</a>
        <a href="/datenschutz.html">Datenschutz</a>
        <a href="https://www.schulferienklar.de/">Schulferienklar</a>
      </footer>
    </main>
  )
}

export default PlannerApp
