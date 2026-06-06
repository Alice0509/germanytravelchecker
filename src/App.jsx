import CheckToday from './components/CheckToday.jsx'
import TripDates from './components/TripDates.jsx'
import MultiCityTrip from './components/MultiCityTrip.jsx'
import './App.css'

const CHECK_ITEMS = [
  {
    title: 'Public holidays',
    text: 'Know when a German public holiday may affect shops, pharmacies, trains, museums or city plans.',
  },
  {
    title: 'Sunday closures',
    text: 'Understand why regular supermarkets and many shops may be closed on Sundays in Germany.',
  },
  {
    title: 'Essentials on the go',
    text: 'Get practical fallback ideas for water, groceries, cigarettes, cafés, bakeries and pharmacies.',
  },
  {
    title: 'Trip timing',
    text: 'Plan around school holiday crowds, long weekends and busy travel periods before you book.',
  },
]

const CITY_CARDS = [
  'Berlin',
  'Munich',
  'Hamburg',
  'Cologne',
  'Frankfurt',
  'Stuttgart',
]

function App() {
  return (
    <main className="page-shell">
      <section className="hero-section">
        <nav className="topbar" aria-label="Main navigation">
          <a className="brand" href="/">
            <span className="brand-mark">GTC</span>
            <span>Germany Travel Checker</span>
          </a>
          <a className="topbar-link" href="#check-today">
            Check today
          </a>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Germany travel help for English-speaking visitors</p>
            <h1>Know what may be closed, busy or harder before your Germany trip gets complicated.</h1>
            <p className="hero-text">
              Germany Travel Checker helps visitors understand public holidays,
              Sunday closures, pharmacy rules, grocery options and busy travel
              periods before or during a Germany trip.
            </p>

            <div className="hero-actions">
              <a className="button primary" href="#check-today">
                I am in Germany today
              </a>
              <a className="button secondary" href="#trip-dates">
                I am planning a trip
              </a>
              <a className="button tertiary" href="https://www.schulferienklar.de/">
                Data by Schulferienklar
              </a>
            </div>

            <p className="trust-note">
              Built as a practical English travel layer using Schulferienklar
              holiday data. Rule-based guidance, no AI guesses and no fixed
              shop opening-hour database.
            </p>
          </div>

          <CheckToday />
        </div>
      </section>

      <section className="section mode-section">
        <div className="section-heading">
          <p className="eyebrow">Two ways to use it</p>
          <h2>Check today or check your trip dates.</h2>
          <p>
            Germany Travel Checker is split into two simple modes, depending on
            whether you are already in Germany or still planning your trip.
          </p>
        </div>

        <div className="mode-grid">
          <article className="mode-card">
            <span className="mode-kicker">Right now</span>
            <h3>Check Today</h3>
            <p>
              For same-day questions: Sunday closures, public holidays,
              pharmacies, groceries, water, cafés, bakeries and quick fallback
              ideas.
            </p>
            <a href="#check-today">Use Check Today</a>
          </article>

          <article className="mode-card">
            <span className="mode-kicker">Before booking</span>
            <h3>Check Trip Dates</h3>
            <p>
              For planning questions: date ranges, public holiday overlaps,
              school holiday travel periods, Sundays and possible crowd warnings.
            </p>
            <a href="#trip-dates">Use Trip Dates</a>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Built for practical travel questions</p>
          <h2>Not a travel blog. A Germany trip checker.</h2>
          <p>
            The goal is simple: help visitors from the US, Canada, Australia,
            the UK and other English-speaking countries avoid common Germany
            travel surprises.
          </p>
        </div>

        <div className="feature-grid">
          {CHECK_ITEMS.map((item) => (
            <article className="feature-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <TripDates />

      <MultiCityTrip />

      <section className="section split-section">
        <div>
          <p className="eyebrow">City-first planning</p>
          <h2>Start with where you are going.</h2>
          <p>
            Travelers usually know they are visiting Berlin or Munich, not which
            German federal state controls the holiday calendar. Germany Travel
            Checker will translate city plans into practical date warnings.
          </p>
        </div>

        <div className="city-grid" aria-label="Initial city examples">
          {CITY_CARDS.map((city) => (
            <span key={city}>{city}</span>
          ))}
        </div>
      </section>

      <section className="section safety-section">
        <p className="eyebrow">Safety-first guidance</p>
        <h2>Helpful, but careful.</h2>
        <p>
          Germany Travel Checker will not diagnose medical issues, recommend
          specific emergency rooms, maintain tobacco vending machine locations,
          or promise that a shop is open. It will point travelers to stable
          rules, official sources and practical fallback categories.
        </p>
      </section>

      <footer className="footer">
        <span>© 2026 Joan</span>
        <a href="https://www.schulferienklar.de/">Schulferienklar</a>
        <a href="https://github.com/Alice0509/germanytravelchecker">GitHub</a>
      </footer>
    </main>
  )
}

export default App
