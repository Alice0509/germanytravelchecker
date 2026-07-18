const CITY_GUIDES = [
  {
    city: 'Berlin',
    href: '/berlin.html',
    state: 'Berlin',
    note: 'Closures, holidays and practical fallbacks',
  },
  {
    city: 'Munich',
    href: '/munich.html',
    state: 'Bavaria',
    note: 'Bavarian holidays and local travel checks',
  },
]

export default function CityGuidePreview() {
  return (
    <section className="portal-cities" id="city-guides">
      <div className="portal-cities-heading">
        <p className="eyebrow">City checks</p>
        <h2>Start with a city</h2>
        <p>Local holiday rules and practical travel context.</p>
      </div>

      <div className="compact-city-grid">
        {CITY_GUIDES.map((guide) => (
          <a className="compact-city-card" href={guide.href} key={guide.city}>
            <span>{guide.state}</span>
            <h3>{guide.city}</h3>
            <p>{guide.note}</p>
            <b>Check {guide.city} →</b>
          </a>
        ))}
      </div>
    </section>
  )
}
