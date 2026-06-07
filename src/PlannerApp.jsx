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
          <p className="eyebrow">Trouble to prevent next</p>
          <h2>Turn the date check into a practical trouble plan.</h2>
          <p>
            After checking your dates, use these next steps to avoid common
            Germany travel trouble before you book, transfer or rely on shops.
          </p>
        </div>

        <div className="planner-next-grid">
          <article>
            <h3>Prevent arrival-day trouble</h3>
            <p>
              If you arrive on a Sunday or public holiday, plan water,
              groceries, snacks, cafés, bakeries and pharmacy fallback options before you land.
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
          <h2>Common small troubles before a Germany trip.</h2>
          <p>
            These answers help visitors avoid common Germany travel trouble. They do
            not replace live opening-hour checks, official transport updates or
            emergency services.
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
