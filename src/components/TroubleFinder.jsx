import { useMemo, useState } from 'react'
import { troubleTopics } from '../data/troubleTopics.js'

const EXAMPLE_WORRIES = [
  'water',
  'Sunday',
  'pharmacy',
  'Pfand',
  'toilet',
  'SEV',
  'platform',
  'cancelled train',
]

function findTopic(query) {
  const normalized = query.trim().toLowerCase()

  if (!normalized) {
    return troubleTopics[0]
  }

  return (
    troubleTopics.find((topic) =>
      topic.keywords.some((keyword) => normalized.includes(keyword.toLowerCase())),
    ) || troubleTopics[0]
  )
}

function guideLabel(url) {
  if (url === '/train-trouble.html') return 'Open Train Trouble Guide'
  if (url === '/sunday-holiday-closures.html') return 'Open Sunday Closure Guide'
  if (url === '/planner.html') return 'Open Trip Planner'
  return 'Open related guide'
}

export default function TroubleFinder() {
  const [query, setQuery] = useState('water')

  const result = useMemo(() => findTopic(query), [query])

  return (
    <section className="section trouble-finder-section">
      <div className="section-heading">
        <p className="eyebrow">Find a quick trouble tip</p>
        <h2>What are you worried about?</h2>
        <p>
          Type a small Germany travel worry, such as water, Sunday, pharmacy,
          Pfand, toilet, SEV, platform change or a cancelled train.
        </p>
      </div>

      <div className="trouble-finder-card">
        <label>
          <span>Your worry</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try: Sunday, pharmacy, SEV, Pfand, toilet"
          />
        </label>

        <article className="trouble-result">
          <div className="trouble-result-header">
            <div>
              <span className="trouble-category">{result.category}</span>
              <strong>{result.title}</strong>
            </div>
            <span className={`urgency-pill urgency-${result.urgency}`}>
              {result.urgency} urgency
            </span>
          </div>

          <div className="trouble-result-grid">
            <section>
              <h3>Problem</h3>
              <p>{result.problem}</p>
            </section>

            <section>
              <h3>Meaning</h3>
              <p>{result.meaning}</p>
            </section>

            <section>
              <h3>What to do</h3>
              <ul>
                {result.whatToDo.slice(0, 3).map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </section>

            <section>
              <h3>Verify</h3>
              <ul>
                {result.verify.slice(0, 3).map((source) => (
                  <li key={source}>{source}</li>
                ))}
              </ul>
            </section>
          </div>

          <p className="trouble-risk">{result.risk}</p>

          {result.relatedGuideUrl ? (
            <a className="trouble-guide-link" href={result.relatedGuideUrl}>
              {guideLabel(result.relatedGuideUrl)}
            </a>
          ) : null}
        </article>

        <div className="trouble-chip-row" aria-label="Example worries">
          {EXAMPLE_WORRIES.map((item) => (
            <button key={item} type="button" onClick={() => setQuery(item)}>
              {item}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
