import CheckToday from './components/CheckToday.jsx'
import CurrentTravelSignals from './components/CurrentTravelSignals.jsx'
import CityGuidePreview from './components/CityGuidePreview.jsx'
import TroubleFinder from './components/TroubleFinder.jsx'
import SiteMenu from './components/SiteMenu.jsx'
import './App.css'

const QUICK_GUIDES = [
  {
    label: 'Train trouble',
    title: 'Platform changed, train cancelled or SEV?',
    text: 'Understand the German message and decide what to check next.',
    href: '/train-trouble.html',
    link: 'Open train help',
  },
  {
    label: 'Closed shops',
    title: 'Why is everything closed today?',
    text: 'Check Sunday and public-holiday rules and realistic alternatives.',
    href: '/sunday-holiday-closures.html',
    link: 'Open closure help',
  },
  {
    label: 'Everyday Germany',
    title: 'Still water, Pfand or paid toilets?',
    text: 'Solve small problems before they waste your time.',
    href: '/water-pfand-guide.html',
    link: 'Open practical help',
  },
  {
    label: 'Money & payment',
    title: 'Cash only, card declined or ATM fee?',
    text: 'Check the next practical move before trying the same payment again.',
    href: '/money-payment-trouble.html',
    link: 'Open payment help',
  },
]

function App() {
  return (
    <main className="page-shell home-portal">
      <header className="portal-header">
        <nav className="topbar" aria-label="Main navigation">
          <a className="brand" href="/" aria-label="Germany Travel Checker home">
            <span className="brand-mark" aria-hidden="true">
              <img src="/icon-192.png" alt="" />
            </span>
            <span>Germany Travel Checker</span>
          </a>
          <SiteMenu ctaHref="/planner.html#trip-dates" ctaLabel="Planner" />
        </nav>

        <CurrentTravelSignals />

        <div className="portal-intro">
          <div>
            <div className="germany-chip">
              <span className="germany-flag" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span>Independent Germany travel tool</span>
            </div>
            <h1>Your Germany trip, checked.</h1>
            <p>
              Dates, closures and practical travel trouble — before you book
              or while you are already here.
            </p>
          </div>

          <nav className="portal-primary-links" aria-label="Start here">
            <a className="button primary" href="/planner.html#trip-dates">
              Plan trip dates
            </a>
            <a className="button secondary" href="#trouble-finder">
              Solve a problem now
            </a>
          </nav>
        </div>
      </header>

      <div id="trouble-finder" className="portal-trouble-anchor">
        <TroubleFinder />
      </div>

      <section
        className="portal-dashboard portal-check-dashboard"
        aria-label="Germany city and date check"
      >
        <CheckToday />
      </section>

      <section className="portal-directory" aria-labelledby="quick-guides-title">
        <div className="portal-directory-heading">
          <p className="eyebrow">Reference library</p>
          <h2 id="quick-guides-title">Need the full explanation?</h2>
          <p>
            Read the stable rules, examples and verification sources behind
            each travel problem.
          </p>
        </div>

        <div className="portal-guide-grid">
          {QUICK_GUIDES.map((guide) => (
            <a className="portal-guide-link" href={guide.href} key={guide.href}>
              <span>{guide.label}</span>
              <strong>{guide.title}</strong>
              <p>{guide.text}</p>
              <b>{guide.link} →</b>
            </a>
          ))}
        </div>
      </section>

      <CityGuidePreview />

      <aside className="portal-safety">
        <strong>Helpful, but careful.</strong>
        <p>
          Germany Travel Checker explains stable rules and practical next
          steps. It does not provide live train status, guaranteed opening
          hours or medical diagnosis.
        </p>
      </aside>

      <footer className="footer portal-footer">
        <div>
          <strong>Germany Travel Checker</strong>
          <p>
            Practical Germany travel guidance. Data by Schulferienklar.
          </p>
        </div>

        <div className="footer-link-groups">
          <nav aria-label="Travel help links">
            <span>Travel help</span>
            <a href="/planner.html">Planner</a>
            <a href="/train-trouble.html">Train trouble</a>
            <a href="/sunday-holiday-closures.html">Sunday closures</a>
            <a href="/water-pfand-guide.html">Water / Pfand</a>
            <a href="/money-payment-trouble.html">Money / payments</a>
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
