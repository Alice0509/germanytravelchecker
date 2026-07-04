import CheckToday from './components/CheckToday.jsx'
import CityGuidePreview from './components/CityGuidePreview.jsx'
import TroubleFinder from './components/TroubleFinder.jsx'
import SiteMenu from './components/SiteMenu.jsx'
import './App.css'

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
          <SiteMenu ctaHref="/planner.html#trip-dates" ctaLabel="Planner" />
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Germany travel trouble checker for English-speaking visitors</p>
            <h1>Plan around German holidays, school breaks and travel trouble.</h1>
            <p className="hero-text">
              Check whether today, your trip dates or a common Germany travel
              problem could change your next move. Germany Travel Checker helps
              you spot German calendar risks before travel and understand what
              to do when Germany feels closed, delayed or confusing.
            </p>

            <div className="hero-actions">
              <a className="button primary" href="#check-today">
                Check today
              </a>
              <a className="button secondary" href="/planner.html#trip-dates">
                Plan trip dates
              </a>
              <a className="button secondary" href="#trouble-finder">
                Solve a travel problem
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
          <p className="eyebrow">Start here</p>
          <h2>What do you need right now?</h2>
          <p>
            Choose the path closest to your situation. Germany Travel Checker is
            built to turn German calendar rules and small travel surprises into
            practical next steps.
          </p>
        </div>

        <div className="mode-grid">
          <article className="mode-card">
            <span className="mode-kicker">Right now</span>
            <h3>I am in Germany today</h3>
            <p>
              Check Sunday closures, public holidays, groceries, pharmacies,
              water, cafés, bakeries and practical fallback ideas for today.
            </p>
            <a href="#check-today">Check today</a>
          </article>

          <article className="mode-card">
            <span className="mode-kicker">Trip dates</span>
            <h3>I am choosing travel dates</h3>
            <p>
              Check public holidays, school break pressure, Sundays, transfer
              days and seasonal event periods before you lock in your plan.
            </p>
            <a href="/planner.html#trip-dates">Open the planner</a>
          </article>

          <article className="mode-card">
            <span className="mode-kicker">Problem solving</span>
            <h3>Something is confusing or going wrong</h3>
            <p>
              Understand German train trouble, Sunday closures, water, Pfand,
              toilets and other small problems before you waste time.
            </p>
            <a href="#trouble-finder">Find the next move</a>
          </article>
        </div>
      </section>

      <div id="trouble-finder">
        <TroubleFinder />
      </div>


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

        <div className="footer-link-groups">
          <nav aria-label="Travel help links">
            <span>Travel help</span>
            <a href="/planner.html">Planner</a>
            <a href="/train-trouble.html">Train trouble</a>
            <a href="/sunday-holiday-closures.html">Sunday closures</a>
            <a href="/water-pfand-guide.html">Water / Pfand</a>
          </nav>

          <nav aria-label="Site links">
            <span>Site</span>
            <a href="/impressum.html">Impressum</a>
            <a href="/datenschutz.html">Datenschutz</a>
            <a href="https://www.schulferienklar.de/">Schulferienklar</a>
          </nav>
        </div>

        <span className="footer-copy">© 2026 Joan</span>
      </footer>
    </main>
  )
}

export default App
