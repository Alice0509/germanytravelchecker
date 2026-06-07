import { useMemo, useState } from 'react'

const TROUBLE_TIPS = [
  {
    id: 'sunday',
    keywords: ['sunday', 'closed', 'supermarket', 'shop', 'shopping', 'grocery', 'groceries'],
    title: 'Sunday shopping can surprise visitors',
    text: 'Many regular supermarkets and shops are closed on Sundays in Germany. If you need water, snacks or basics, plan earlier or check stations, airports, gas stations, cafés, bakeries, kiosks or hotel reception.',
  },
  {
    id: 'water',
    keywords: ['water', 'still', 'sparkling', 'sprudel', 'classic', 'kohlensäure', 'pfand', 'bottle'],
    title: 'Water is easy to mix up',
    text: 'If you want still water, look for stilles Wasser, ohne Kohlensäure or naturell. Sprudel, Classic or mit Kohlensäure usually means sparkling. Pfand means bottle deposit.',
  },
  {
    id: 'pharmacy',
    keywords: ['pharmacy', 'medicine', 'medication', 'apoteke', 'apotheke', 'drugstore', 'sick'],
    title: 'Pharmacies may be closed',
    text: 'Regular pharmacies may close on Sundays and public holidays. For emergencies call 112. For non-emergency medical help outside office hours, travelers in Germany can check 116117. Verify emergency pharmacy information through official Notdienst sources.',
  },
  {
    id: 'cash',
    keywords: ['cash', 'coin', 'coins', 'card', 'toilet', 'bathroom', 'wc', 'restroom', 'locker'],
    title: 'Cash or coins can still help',
    text: 'Some toilets, lockers, kiosks or small places may need coins, cash or a payment backup. It is not everywhere, but having a few coins can save stress when you are tired or carrying luggage.',
  },
  {
    id: 'arrival',
    keywords: ['airport', 'arrival', 'arrive', 'late', 'early', 'morning', 'night', 'hotel', 'check-in', 'luggage'],
    title: 'Late or early arrival needs extra planning',
    text: 'If you land late or arrive very early, do not assume a normal supermarket will be open. Bring water and a snack, save your hotel route, and check airport or station options before you are tired.',
  },
  {
    id: 'holiday',
    keywords: ['holiday', 'public holiday', 'state', 'bavaria', 'berlin', 'federal'],
    title: 'Public holidays can differ by state',
    text: 'Some German public holidays depend on the federal state. A normal day in Berlin can be a public holiday in Bavaria, so check the city and date before relying on shops or pharmacies.',
  },
]

function findTip(query) {
  const normalized = query.trim().toLowerCase()

  if (!normalized) {
    return TROUBLE_TIPS[0]
  }

  return (
    TROUBLE_TIPS.find((tip) =>
      tip.keywords.some((keyword) => normalized.includes(keyword.toLowerCase())),
    ) || TROUBLE_TIPS[0]
  )
}

export default function TroubleFinder() {
  const [query, setQuery] = useState('water')

  const result = useMemo(() => findTip(query), [query])

  return (
    <section className="section trouble-finder-section">
      <div className="section-heading">
        <p className="eyebrow">Find a quick trouble tip</p>
        <h2>What are you worried about?</h2>
        <p>
          Type a small Germany travel worry, such as water, Sunday, pharmacy,
          cash, toilet, Pfand or airport arrival.
        </p>
      </div>

      <div className="trouble-finder-card">
        <label>
          <span>Your worry</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try: water, Sunday, pharmacy, cash, airport"
          />
        </label>

        <article>
          <strong>{result.title}</strong>
          <p>{result.text}</p>
        </article>

        <div className="trouble-chip-row" aria-label="Example worries">
          {['water', 'Sunday', 'pharmacy', 'cash', 'toilet', 'Pfand', 'airport'].map((item) => (
            <button key={item} type="button" onClick={() => setQuery(item)}>
              {item}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
