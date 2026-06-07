import CheckToday from './components/CheckToday.jsx'
import CityGuidePreview from './components/CityGuidePreview.jsx'
import TroubleFinder from './components/TroubleFinder.jsx'
import './App.css'

const CHECK_ITEMS = [
  {
    title: 'Sunday surprises',
    text: 'In many places, Sunday shopping feels normal. In Germany, regular supermarkets are often closed.',
  },
  {
    title: 'Small essentials',
    text: 'Water, snacks, cash, toilets, pharmacies and Pfand can matter more when you are tired or arriving late.',
  },
  {
    title: 'Trip timing',
    text: 'School holidays, public holidays and transfer days can make a normal plan feel harder.',
  },
]

function App() {
  return (
    <main className="page-shell">
      <section className="hero-section">
        <nav className="topbar" aria-label="Main navigation">
          <a className="brand" href="/" aria-label="Germany Travel Checker home">
            <span className="brand-mark" aria-hidden="true">
              <img src="/icon-192.png" alt="" />
            </span>
            <span>Germany Travel Checker</span>
          </a>
          <a className="topbar-link" href="#check-today">
            Check today
          </a>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Germany travel trouble checker for English-speaking visitors</p>
            <h1>Avoid small Germany travel troubles before they become expensive.</h1>
            <p className="hero-text">
              Germany Travel Checker helps visitors plan around Sundays,
              public holidays, pharmacy closures, grocery surprises, water
              problems, transfer days and busy travel periods.
            </p>

            <div className="hero-actions">
              <a className="button primary" href="#check-today">
                I am in Germany today
              </a>
              <a className="button secondary" href="/planner.html#trip-dates">
                I am planning one city
              </a>
              <a className="button secondary" href="/planner.html#multi-city-trip">
                I am visiting multiple cities
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
          <p className="eyebrow">Three ways to use it</p>
          <h2>Choose the check that matches your trip.</h2>
          <p>
            Use a quick same-day check, plan one city, or check a multi-city
            Germany itinerary with separate city segments.
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
            <span className="mode-kicker">One city</span>
            <h3>Check Trip Dates</h3>
            <p>
              For one-city planning: date ranges, public holiday overlaps,
              school holiday travel periods, Sundays and possible crowd warnings.
            </p>
            <a href="/planner.html#trip-dates">Open Trip Planner</a>
          </article>

          <article className="mode-card">
            <span className="mode-kicker">Multiple cities</span>
            <h3>Multi-city Trip</h3>
            <p>
              For itineraries like Munich to Berlin: check each city segment,
              transfer days and the overall trip risk.
            </p>
            <a href="/planner.html#multi-city-trip">Open Trip Planner</a>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Built for real travel surprises</p>
          <h2>Not a travel blog. A small-trouble checker for Germany.</h2>
          <p>
            A quick way for English-speaking visitors to spot the small Germany
            travel problems that are easy to miss before the trip.
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


      <TroubleFinder />


      <section className="section trouble-guide-section">
        <div className="section-heading">
          <p className="eyebrow">When something suddenly changes</p>
          <h2>Train trouble words, explained fast.</h2>
          <p>
            German station signs and apps can change quickly. Learn the words
            that matter when a platform changes, a train is cancelled or a
            replacement bus appears.
          </p>
        </div>

        <article className="trouble-guide-card">
          <div>
            <span>Transit trouble</span>
            <h3>German train disruption words</h3>
            <p>
              Understand common words such as <strong>Gleisänderung</strong>,
              <strong> fällt aus</strong>, <strong>SEV</strong>,
              <strong> Schienenersatzverkehr</strong> and <strong>Bauarbeiten</strong>
              before you miss a platform, bus or connection.
            </p>
          </div>
          <a href="/train-trouble.html">Open Train Trouble Guide</a>
        </article>
      </section>

      <CityGuidePreview />

      <section className="section safety-section">
        <p className="eyebrow">Safety-first guidance</p>
        <h2>Helpful, but careful.</h2>
        <p>
          Germany Travel Checker does not diagnose medical issues, promise shop
          opening hours or maintain live emergency listings. It points travelers
          to stable rules, official sources and practical fallback categories.
        </p>
      </section>

      <footer className="footer">
        <div>
          <strong>Germany Travel Checker</strong>
          <p>
            Rule-based Germany travel guidance for public holidays, Sunday
            closures, trip dates and multi-city itineraries. Data by
            Schulferienklar.
          </p>
        </div>

        <nav aria-label="Footer links">
          <a href="/impressum.html">Impressum</a>
          <a href="/datenschutz.html">Datenschutz</a>
          <a href="https://www.schulferienklar.de/">Schulferienklar</a>
        </nav>

        <span className="footer-copy">© 2026 Joan</span>
      </footer>
    </main>
  )
}

export default App
