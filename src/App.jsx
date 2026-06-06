import CheckToday from './components/CheckToday.jsx'
import CityGuidePreview from './components/CityGuidePreview.jsx'
import './App.css'

const CHECK_ITEMS = [
  {
    title: 'Closures',
    text: 'Public holidays and Sundays can affect shops, groceries, pharmacies and plans.',
  },
  {
    title: 'Essentials',
    text: 'Find practical fallback ideas for water, cafés, bakeries, groceries and pharmacy needs.',
  },
  {
    title: 'Trip timing',
    text: 'Spot school holiday periods, transfer days and dates that may need extra planning.',
  },
]

function App() {
  return (
    <main className="app-shell">
      <section className="hero">
        <nav className="top-nav" aria-label="Main navigation">
          <a className="brand" href="/">
            Germany Travel Checker
          </a>
          <div className="nav-links">
            <a href="#check-today">Check today</a>
            <a href="/planner.html">Trip planner</a>
            <a href="#city-guides">City guides</a>
          </div>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Germany travel help for English-speaking visitors</p>
            <h1>Know what may be closed, busy or harder before your Germany trip gets complicated.</h1>
            <p className="hero-lede">
              Germany Travel Checker helps visitors understand public holidays,
              Sunday closures, pharmacy rules, grocery options and busy travel
              periods before or during a Germany trip.
            </p>
            <div className="hero-actions">
              <a href="#check-today">I am in Germany today</a>
              <a href="/planner.html">I am planning trip dates</a>
              <a href="#city-guides">I want city checks</a>
            </div>
          </div>

          <div className="hero-card">
            <p className="eyebrow">Data by Schulferienklar</p>
            <p>
              Built as a practical English travel layer using Schulferienklar
              holiday data. Rule-based guidance, no AI guesses and no fixed shop
              opening-hour database.
            </p>
          </div>
        </div>
      </section>

      <section className="mode-section" aria-labelledby="mode-heading">
        <div className="section-heading">
          <p className="eyebrow">Three ways to use it</p>
          <h2 id="mode-heading">Choose the check that matches your situation.</h2>
          <p>
            Start with a same-day check, plan several travel dates, or open a
            city guide for practical local context.
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

          <article className="mode-card featured-mode">
            <span className="mode-kicker">Planning ahead</span>
            <h3>Trip Planner</h3>
            <p>
              For one-city date ranges or multi-city itineraries. Check Sundays,
              public holidays, school holiday travel pressure and transfer days.
            </p>
            <a href="/planner.html">Open Trip Planner</a>
          </article>

          <article className="mode-card">
            <span className="mode-kicker">City context</span>
            <h3>City Guides</h3>
            <p>
              Start with practical Berlin and Munich checks for local travel
              friction, fallback planning and city-specific notes.
            </p>
            <a href="#city-guides">Open City Guides</a>
          </article>
        </div>
      </section>

      <section id="check-today">
        <CheckToday />
      </section>

      <section className="info-section">
        <div className="section-heading">
          <p className="eyebrow">Built for practical travel questions</p>
          <h2>Not a travel blog. A Germany trip checker.</h2>
          <p>
            A quick way for English-speaking visitors to check Germany-specific
            closure, holiday and trip-timing surprises.
          </p>
        </div>

        <div className="info-grid">
          {CHECK_ITEMS.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="city-guides">
        <CityGuidePreview />
      </section>

      <section className="safety-section">
        <p className="eyebrow">Safety-first guidance</p>
        <h2>Helpful, but careful.</h2>
        <p>
          Germany Travel Checker does not diagnose medical issues, promise shop
          opening hours or maintain live emergency listings. It points travelers
          to stable rules, official sources and practical fallback categories.
        </p>
      </section>

      <footer>
        <div>
          <strong>Germany Travel Checker</strong>
          <p>
            Rule-based Germany travel guidance for public holidays, Sunday
            closures, trip dates and multi-city itineraries. Data by
            Schulferienklar.
          </p>
        </div>
        <div className="footer-links">
          <a href="/impressum.html">Impressum</a>
          <a href="/datenschutz.html">Datenschutz</a>
          <a href="https://www.schulferienklar.de/">Schulferienklar</a>
        </div>
        <span>© 2026 Joan</span>
      </footer>
    </main>
  )
}

export default App
