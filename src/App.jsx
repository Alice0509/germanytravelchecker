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
            <h1>Stuck in Germany? Understand the problem before you move.</h1>
            <p className="hero-text">
              When you are tired, carrying luggage or holding a child’s hand, you do
              not have time to read five blog posts. Germany Travel Checker helps
              you understand what is probably happening and what to check next.
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
              Google Translate can tell you what a sign says. Germany Travel Checker
              helps you decide what to do next. Rule-based guidance, no AI guesses
              and no fixed shop opening-hour database.
            </p>
          </div>

          <CheckToday />
        </div>
      </section>

      <section className="section mode-section">
        <div className="section-heading">
          <p className="eyebrow">Three ways to use it</p>
          <h2>Start with the situation you are in.</h2>
          <p>
            Use Check Today when something is happening now, Planner when you are
            preparing dates, and Trouble Finder when a small problem is blocking
            your next move.
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
          <h2>Not a travel blog. A next-move checker for Germany.</h2>
          <p>
            A practical layer for English-speaking visitors who need to understand
            closures, train words, water labels, Pfand, pharmacies and other
            small problems before they waste time or money.
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
          <p className="eyebrow">When the sign or situation changes</p>
          <h2>Trouble guides for the moment you get stuck.</h2>
          <p>
            Translation is only the first step. These guides explain what the
            situation probably means, what to do next and where to verify before
            you walk away, board another train or cross town.
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
        <article className="trouble-guide-card">
          <div>
            <span>Sunday / holiday closures</span>
            <h3>Why are shops closed today?</h3>
            <p>
              Quickly understand Sunday and public holiday closures in Germany,
              what to do next and where to verify before you walk across town.
            </p>
          </div>
          <a href="/sunday-holiday-closures.html">Open Sunday Closure Guide</a>
        </article>
        <article className="trouble-guide-card">
          <div>
            <span>Daily logistics</span>
            <h3>Water, Pfand and paid toilets</h3>
            <p>
              Not every travel problem is dramatic. Sometimes you just need still
              water, a bathroom, or to understand why your bottle cost more than
              the shelf price.
            </p>
          </div>
          <a href="/water-pfand-guide.html">Open Water / Pfand Guide</a>
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
