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
        <div className="eyebrow">Germany trip trouble planner</div>
        <h1>Plan around the small Germany troubles that can make a trip harder.</h1>
        <p>
          Check whether your dates or transfers overlap with Sundays,
          public holidays, school holiday travel pressure, closure risks and
          everyday essentials problems. This planner uses rule-based guidance,
          not AI guesses or live shop opening-hour claims.
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


      <section className="planner-next-steps">
        <div className="section-heading">
          <p className="eyebrow">What to check next</p>
          <h2>Turn the date check into a practical plan.</h2>
          <p>
            After checking your dates, use these next steps to reduce common
            Germany travel friction before you book, transfer or rely on shops.
          </p>
        </div>

        <div className="planner-next-grid">
          <article>
            <h3>Check your arrival day</h3>
            <p>
              If you arrive on a Sunday or public holiday, plan groceries,
              water, cafés, bakeries and pharmacy fallback options before you land.
            </p>
            <a href="/">Use Check Today</a>
          </article>

          <article>
            <h3>Open a city guide</h3>
            <p>
              Berlin and Munich guides give practical city-specific context for
              closures, fallback planning and local travel friction.
            </p>
            <a href="/berlin.html">Berlin guide</a>
            <a href="/munich.html">Munich guide</a>
          </article>

          <article>
            <h3>Double-check live details</h3>
            <p>
              Verify exact opening hours, transport changes and emergency pharmacy
              duty schedules through official or live sources before relying on them.
            </p>
          </article>
        </div>
      </section>


      <section className="planner-faq">
        <div className="section-heading">
          <p className="eyebrow">Germany travel FAQ</p>
          <h2>Common planning questions before a Germany trip.</h2>
          <p>
            These answers are practical planning guidance for visitors. They do
            not replace live opening-hour checks, official transport updates or
            emergency services.
          </p>
        </div>

        <div className="planner-faq-grid">
          <article>
            <h3>Are shops closed on Sundays in Germany?</h3>
            <p>
              Many regular shops and supermarkets are closed on Sundays. Some
              places such as train stations, airports, bakeries, cafés or kiosks
              may have different rules, but you should verify exact hours before
              relying on them.
            </p>
          </article>

          <article>
            <h3>Do German public holidays apply everywhere?</h3>
            <p>
              Not always. Some public holidays apply nationwide, while others
              depend on the federal state. A date can be normal in one city and
              a public holiday in another.
            </p>
          </article>

          <article>
            <h3>Why do school holidays matter for travelers?</h3>
            <p>
              School holiday periods can increase pressure on trains, roads,
              hotels and popular attractions. They do not always mean closures,
              but they can make travel days feel busier.
            </p>
          </article>

          <article>
            <h3>Can this planner tell me exact shop opening hours?</h3>
            <p>
              No. Germany Travel Checker gives rule-based guidance. Always check
              Google Maps and the official business website before relying on a
              specific shop, pharmacy, café or bakery being open.
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
