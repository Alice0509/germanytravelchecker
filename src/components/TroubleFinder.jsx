import { useMemo, useRef, useState } from 'react'
import { troubleTopics } from '../data/troubleTopics.js'

const ACTION_GROUPS = [
  {
    id: 'payment',
    label: 'Money & payment',
    title: 'Card, cash, ATM or hotel hold',
    text: 'Choose the exact payment problem.',
    options: [
      {
        label: 'My card was declined',
        href: '/money-payment-trouble.html?issue=card-declined',
      },
      {
        label: 'Cash only or Girocard',
        href: '/money-payment-trouble.html?issue=cash-only',
      },
      {
        label: 'ATM fee or conversion',
        href: '/money-payment-trouble.html?issue=atm-conversion',
      },
      {
        label: 'Hotel card hold',
        href: '/money-payment-trouble.html?issue=hotel-hold',
      },
      {
        label: 'Ticket machine payment',
        href: '/money-payment-trouble.html?issue=ticket-machine',
      },
      {
        label: 'Tipping or unclear bill',
        href: '/money-payment-trouble.html?issue=tipping',
      },
    ],
  },
  {
    id: 'train',
    label: 'Train trouble',
    title: 'Cancelled, delayed or platform changed',
    text: 'Cancelled, delayed, platform changed or SEV.',
    href: '/train-trouble.html',
  },
  {
    id: 'closures',
    label: 'Everything is closed',
    title: 'Sunday, holiday or no normal shops',
    text: 'Sunday and holiday closures with practical fallbacks.',
    href: '/sunday-holiday-closures.html',
  },
  {
    id: 'daily-systems',
    label: 'Everyday Germany',
    title: 'Water, Pfand or paid toilet',
    text: 'Water labels, bottle deposits and paid toilets.',
    href: '/water-pfand-guide.html',
  },
  {
    id: 'medicine',
    label: 'Need medicine',
    title: 'Pharmacy or urgent supplies',
    text: 'Find a pharmacy or urgent-supply fallback.',
    query: 'need medicine',
  },
  {
    id: 'planning',
    label: 'Before your trip',
    title: 'Check dates and cities',
    text: 'Holidays, school breaks, events and transfers.',
    href: '/planner.html#trip-dates',
  },
]

const EXAMPLE_WORRIES = [
  'platform changed',
  'SEV replacement bus',
  'paid toilet',
  'still water',
  'shops closed',
  'need medicine',
]

function keywordMatches(normalized, keyword) {
  const normalizedKeyword = keyword.toLowerCase()

  if (normalizedKeyword.includes(' ')) {
    return normalized.includes(normalizedKeyword)
  }

  const escapedKeyword = normalizedKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const wordPattern = new RegExp(
    `(^|[^a-z0-9])${escapedKeyword}([^a-z0-9]|$)`,
    'i',
  )

  return wordPattern.test(normalized)
}

function findTopic(query) {
  const normalized = query.trim().toLowerCase()

  if (!normalized) {
    return null
  }

  const scoredTopics = troubleTopics
    .map((topic) => {
      const score = topic.keywords.reduce((total, keyword) => {
        if (!keywordMatches(normalized, keyword)) return total
        return total + keyword.length
      }, 0)

      return { topic, score }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)

  return scoredTopics[0]?.topic || null
}

function guideLabel(topic) {
  if (topic.actionLabel) return topic.actionLabel

  const guideUrl = topic.relatedGuideUrl || ''

  if (guideUrl.startsWith('/money-payment-trouble.html')) {
    return 'Open Interactive Payment Help'
  }

  if (guideUrl === '/train-trouble.html') {
    return 'Open Train Trouble Guide'
  }

  if (guideUrl === '/sunday-holiday-closures.html') {
    return 'Open Sunday Closure Guide'
  }

  if (guideUrl === '/water-pfand-guide.html') {
    return 'Open Everyday Germany Guide'
  }

  if (guideUrl === '/planner.html') {
    return 'Open Trip Planner'
  }

  return 'Open related guide'
}

function firstMoveText(topic) {
  if (topic.firstMove) {
    return topic.firstMove
  }

  if (topic.urgency === 'high') {
    return 'First, pause before you move too far. Check the official source or station display, then decide your next step.'
  }

  if (
    topic.category === 'Shops and closures' ||
    topic.category === 'Health and urgent supplies'
  ) {
    return 'First, do not walk across town yet. Check nearby fallback places and verify the exact location before you move.'
  }

  if (topic.category === 'Transit trouble') {
    return 'First, check the train number and the latest official display. Do not rely only on the destination name.'
  }

  return 'First, use this to understand the situation. Then verify the exact place, label or rule before you spend time or money.'
}

export default function TroubleFinder() {
  const [query, setQuery] = useState('')
  const [activeGroupId, setActiveGroupId] = useState(null)
  const resultRef = useRef(null)

  const hasQuery = query.trim().length > 0
  const result = useMemo(() => findTopic(query), [query])
  const activeGroup =
    ACTION_GROUPS.find((group) => group.id === activeGroupId) || null

  function chooseQuery(nextQuery) {
    setActiveGroupId(null)
    setQuery(nextQuery)

    window.setTimeout(() => {
      resultRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 80)
  }

  function chooseAction(group) {
    if (group.options) {
      setQuery('')
      setActiveGroupId((current) =>
        current === group.id ? null : group.id,
      )
      return
    }

    if (group.query) {
      chooseQuery(group.query)
    }
  }

  return (
    <section className="section trouble-finder-section portal-trouble-finder">
      <div className="trouble-finder-heading portal-action-heading">
        <div>
          <p className="eyebrow">Solve it now</p>
          <h2>What happened?</h2>
          <p>
            Choose the closest situation. Type only when none of these match.
          </p>
        </div>
      </div>

      <div className="portal-action-grid" aria-label="Common travel situations">
        {ACTION_GROUPS.map((group) =>
          group.href ? (
            <a
              className="portal-action-card"
              href={group.href}
              key={group.id}
            >
              <span>{group.label}</span>
              <strong>{group.title}</strong>
              <p>{group.text}</p>
              <b>Open help →</b>
            </a>
          ) : (
            <button
              className={`portal-action-card ${
                activeGroupId === group.id ? 'is-open' : ''
              }`}
              type="button"
              key={group.id}
              onClick={() => chooseAction(group)}
              aria-expanded={
                group.options ? activeGroupId === group.id : undefined
              }
              aria-controls={
                group.options ? `${group.id}-action-options` : undefined
              }
            >
              <span>{group.label}</span>
              <strong>{group.title}</strong>
              <p>{group.text}</p>
              <b>{group.options ? 'Choose the problem →' : 'Find help →'}</b>
            </button>
          ),
        )}
      </div>

      {activeGroup?.options ? (
        <section
          className="portal-action-panel"
          id={`${activeGroup.id}-action-options`}
          aria-labelledby={`${activeGroup.id}-action-title`}
        >
          <div className="portal-action-panel-heading">
            <div>
              <span>Choose one detail</span>
              <h3 id={`${activeGroup.id}-action-title`}>
                What happened with the payment?
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setActiveGroupId(null)}
              aria-label="Close payment choices"
            >
              Close
            </button>
          </div>

          <div className="portal-action-options">
            {activeGroup.options.map((option) => (
              <a href={option.href} key={option.href}>
                <strong>{option.label}</strong>
                <span>Get the next move →</span>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <details className="portal-search-details">
        <summary>
          <span>
            <strong>Something else happened?</strong>
            <small>Search by the words you saw</small>
          </span>
          <b>Search</b>
        </summary>

        <div className="portal-search-details-body">
          <label className="portal-trouble-search">
            <span>Travel problem</span>
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setActiveGroupId(null)
                setQuery(event.target.value)
              }}
              placeholder="SEV, pharmacy, paid toilet…"
            />
          </label>

          <div className="trouble-chip-row" aria-label="More problem examples">
            {EXAMPLE_WORRIES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => chooseQuery(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </details>

      <div ref={resultRef}>
        {hasQuery && result ? (
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

            <p className="first-move-note">{firstMoveText(result)}</p>

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
              <a
                className="button secondary trouble-guide-link"
                href={result.relatedGuideUrl}
              >
                {guideLabel(result)}
              </a>
            ) : null}
          </article>
        ) : null}

        {hasQuery && !result ? (
          <p className="portal-no-result">
            No exact match yet. Try a shorter phrase such as pharmacy, SEV,
            paid toilet, still water or shops closed.
          </p>
        ) : null}
      </div>
    </section>
  )
}
