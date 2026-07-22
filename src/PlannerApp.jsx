import { useEffect, useState } from 'react'
import TripDates from './components/TripDates.jsx'
import MultiCityTrip from './components/MultiCityTrip.jsx'
import SiteMenu from './components/SiteMenu.jsx'
import './App.css'

const PLANNER_LINKS = [
  {
    kicker: 'City check',
    title: 'Berlin',
    text: 'Closures, holidays and practical fallbacks.',
    href: '/berlin.html',
  },
  {
    kicker: 'City check',
    title: 'Munich',
    text: 'Bavarian holidays and local travel checks.',
    href: '/munich.html',
  },
  {
    kicker: 'Travel trouble',
    title: 'Train help',
    text: 'Platform changes, cancelled trains and SEV.',
    href: '/train-trouble.html',
  },
  {
    kicker: 'Closed shops',
    title: 'Sunday closures',
    text: 'Understand closure rules and alternatives.',
    href: '/sunday-holiday-closures.html',
  },
  {
    kicker: 'Everyday Germany',
    title: 'Water & Pfand',
    text: 'Still water, bottle deposits and paid toilets.',
    href: '/water-pfand-guide.html',
  },
  {
    kicker: 'Interactive help',
    title: 'Money & payments',
    text: 'Cash-only signs, card declines, ATM fees and hotel holds.',
    href: '/money-payment-trouble.html',
  },
]

function getInitialPlannerMode() {
  return window.location.hash === '#multi-city-trip' ? 'multi' : 'single'
}

function PlannerApp() {
  const [plannerMode, setPlannerMode] = useState(getInitialPlannerMode)

  useEffect(() => {
    document.body.classList.add('planner-dashboard-body')

    const timer = window.setTimeout(() => {
      const target = document.querySelector(window.location.hash)

      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 120)

    return () => {
      document.body.classList.remove('planner-dashboard-body')
      window.clearTimeout(timer)
    }
  }, [])

  function selectPlannerMode(mode) {
    const targetId = mode === 'multi' ? 'multi-city-trip' : 'trip-dates'

    setPlannerMode(mode)
    window.history.replaceState(null, '', `#${targetId}`)

    window.setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 0)
  }

  return (
    <main className="planner-page planner-dashboard-page">
      <nav className="topbar planner-topbar" aria-label="Main navigation">
        <a className="brand" href="/" aria-label="Germany Travel Checker home">
          <span className="brand-mark" aria-hidden="true">
            <img src="/icon-192.png" alt="" />
          </span>
          <span>Germany Travel Checker</span>
        </a>
        <SiteMenu ctaHref="/#check-today" ctaLabel="Check today" />
      </nav>

      <section className="planner-dashboard-hero">
        <div>
          <div className="planner-flag-chip">
            <span className="planner-flag" aria-hidden="true" />
            <span>Independent Germany travel tool</span>
          </div>

          <p className="eyebrow">Germany trip planner</p>
          <h1>Plan your Germany trip dates.</h1>
          <p className="planner-dashboard-lede">
            Check Sundays, public holidays and school-break travel pressure
            before you book hotels, trains or transfers.
          </p>
        </div>

        <a className="planner-single-day-link" href="/#check-today">
          Only checking one day? <strong>Check today →</strong>
        </a>
      </section>

      <section className="planner-mode-switcher" aria-label="Choose planner mode">
        <button
          className={plannerMode === 'single' ? 'active' : ''}
          type="button"
          onClick={() => selectPlannerMode('single')}
        >
          <span>One city</span>
          <strong>Check a date range</strong>
          <small>Best for one destination or a short stay.</small>
        </button>

        <button
          className={plannerMode === 'multi' ? 'active' : ''}
          type="button"
          onClick={() => selectPlannerMode('multi')}
        >
          <span>Multiple cities</span>
          <strong>Check an itinerary</strong>
          <small>Compare cities, dates and transfer days.</small>
        </button>
      </section>

      <div className="planner-active-tool">
        {plannerMode === 'single' ? <TripDates /> : <MultiCityTrip />}
      </div>

      <section className="planner-resource-directory">
        <div className="planner-directory-heading">
          <p className="eyebrow">Continue your check</p>
          <h2>City and problem guides</h2>
          <p>Open the guide that matches the next decision you need to make.</p>
        </div>

        <div className="planner-resource-grid">
          {PLANNER_LINKS.map((link) => (
            <a href={link.href} key={link.href}>
              <span>{link.kicker}</span>
              <strong>{link.title}</strong>
              <small>{link.text}</small>
            </a>
          ))}
        </div>
      </section>

      <section className="planner-trust-strip">
        <strong>Helpful, but careful.</strong>
        <p>
          Travel impact is rule-based planning guidance. Verify live transport,
          opening hours and urgent information with official sources.
        </p>
      </section>

      <footer className="planner-dashboard-footer">
        <div>
          <strong>Germany Travel Checker</strong>
          <p>Practical Germany trip planning. Data by Schulferienklar.</p>
        </div>

        <nav aria-label="Planner footer links">
          <a href="/">Home</a>
          <a href="/impressum.html">Impressum</a>
          <a href="/datenschutz.html">Datenschutz</a>
          <a href="https://www.schulferienklar.de/">Schulferienklar</a>
        </nav>
      </footer>
    </main>
  )
}
export default PlannerApp
