import { useEffect } from 'react'
import TripDates from './components/TripDates.jsx'
import MultiCityTrip from './components/MultiCityTrip.jsx'
import SiteMenu from './components/SiteMenu.jsx'
import './App.css'

const PLANNER_NOTES = [
  {
    title: 'Low risk',
    text: 'No major calendar signal was found. Still check exact opening hours, local events and transport details before relying on one place.',
  },
  {
    title: 'Medium risk',
    text: 'Plan around Sundays, school holiday pressure or transfer days. Add buffer time and arrange food, water or pharmacy checks earlier.',
  },
  {
    title: 'High risk',
    text: 'A public holiday or strong closure-risk date is involved. Plan essentials before the date and avoid tight errands or transfers.',
  },
]

function PlannerApp() {
  useEffect(() => {
    function scrollToHash() {
      if (!window.location.hash) {
        return
      }

      const target = document.querySelector(window.location.hash)

      if (!target) {
        return
      }

      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    window.setTimeout(scrollToHash, 100)
    window.setTimeout(scrollToHash, 350)
  }, [])

  return (
    <main className="planner-page">
      <nav className="topbar planner-topbar" aria-label="Main navigation">
        <a className="brand" href="/" aria-label="Germany Travel Checker home">
          <span className="brand-mark" aria-hidden="true">
            <img src="/icon-192.png" alt="" />
          </span>
          <span>Germany Travel Checker</span>
        </a>
        <SiteMenu ctaHref="/#check-today" ctaLabel="Check today" />
      </nav>

      <section className="planner-hero">
        <div className="eyebrow">Germany trip date risk planner</div>
        <h1>Find dates to avoid or plan around in Germany.</h1>
        <p>
          Check whether your trip dates or transfers run into Sundays,
          public holidays, school break pressure, closure risks or everyday
          essentials problems. Use the signals to avoid harder dates, add buffer
          time or plan food, water and pharmacy checks earlier.
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
          <h2>Planning Berlin or Munich first?</h2>
          <p>
            Open a city guide for the small local things visitors often miss:
            closure patterns, water and grocery fallback, pharmacies, Pfand,
            cash and live checks.
          </p>
        </div>
        <div className="planner-city-links">
          <a href="/berlin.html">Open Berlin guide</a>
          <a href="/munich.html">Open Munich guide</a>
        </div>
      </section>


      <section className="planner-next-steps">
        <div className="section-heading">
          <p className="eyebrow">Before the trip gets annoying</p>
          <h2>Turn the date check into a few simple next steps.</h2>
          <p>
            After checking your dates, plan the small things that usually become
            annoying only when you are tired, hungry or carrying luggage.
          </p>
        </div>

        <div className="planner-next-grid">
          <article>
            <h3>Prevent arrival-day trouble</h3>
            <p>
              If you land late, arrive early or reach Germany on a Sunday or
              public holiday, plan water, snacks, basic groceries and pharmacy
              fallback options before you are tired and searching with luggage.
            </p>
            <a href="/">Use Check Today</a>
          </article>

          <article>
            <h3>Check city-specific trouble</h3>
            <p>
              Berlin and Munich guides cover city-specific closure patterns,
              water and grocery fallback, pharmacies, Pfand, cash and live checks.
            </p>
            <a href="/berlin.html">Berlin guide</a>
            <a href="/munich.html">Munich guide</a>
          </article>

          <article>
            <h3>Verify live details before relying on them</h3>
            <p>
              Verify exact opening hours, transport changes and emergency pharmacy
              duty schedules through official or live sources before relying on shops, transfers or pharmacies.
            </p>
          </article>
        </div>
      </section>


      <section className="planner-faq">
        <div className="section-heading">
          <p className="eyebrow">Germany trouble FAQ</p>
          <h2>Small Germany surprises visitors often miss.</h2>
          <p>
            These answers are for practical trip planning. They do not replace
            live opening-hour checks, official transport updates or emergency services.
          </p>
        </div>

        <div className="planner-faq-grid">
          <article>
            <h3>Will I get stuck without groceries or water on Sunday?</h3>
            <p>
              Many regular shops and supermarkets are closed on Sundays. Buy water,
              simple food and daily basics earlier if you can. Larger stations,
              airports, cafés, bakeries, kiosks or hotel reception may help, but
              exact availability should be checked before relying on it.
            </p>
          </article>

          <article>
            <h3>Can a public holiday surprise me in one city but not another?</h3>
            <p>
              Yes. Some public holidays apply nationwide, while others depend on the
              federal state. A date can be normal in Berlin and a public holiday
              in Bavaria, which can affect shops, pharmacies and trip plans.
            </p>
          </article>

          <article>
            <h3>Why do school holidays create travel trouble?</h3>
            <p>
              School holidays do not usually close shops, but they can increase pressure
              on trains, roads, hotels and attractions. Transfer days can feel
              harder, so plan water, snacks, luggage and timing earlier.
            </p>
          </article>

          <article>
            <h3>Can this planner tell me whether a specific place is open?</h3>
            <p>
              No. Germany Travel Checker gives rule-based trouble guidance, not live
              business availability. Always check Google Maps and the official
              business website before relying on a specific shop, pharmacy, café
              or bakery being open.
            </p>
          </article>
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
        <div>
          <strong>Germany Travel Checker</strong>
          <p>
            Practical Germany trip checks for Sundays, public holidays,
            school holidays, transfers and everyday travel trouble.
          </p>
        </div>

        <nav aria-label="Planner footer links">
          <a href="/">Home</a>
          <a href="/berlin.html">Berlin guide</a>
          <a href="/munich.html">Munich guide</a>
          <a href="/impressum.html">Impressum</a>
          <a href="/datenschutz.html">Datenschutz</a>
          <a href="https://www.schulferienklar.de/">Data by Schulferienklar</a>
        </nav>
      </footer>
    </main>
  )
}

export default PlannerApp
