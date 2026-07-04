const CITY_GUIDES = [
  {
    city: 'Berlin',
    href: '/berlin.html',
    state: 'Berlin',
    note: 'Public holidays, Sunday closures and practical fallback ideas for Germany’s capital.',
  },
  {
    city: 'Munich',
    href: '/munich.html',
    state: 'Bavaria',
    note: 'Bavarian public holidays, regional notes, Sunday closures and pharmacy guidance.',
  },
]

export default function CityGuidePreview() {
  return (
    <section className="section city-guide-section" id="city-guides">
      <div className="section-heading">
        <p className="eyebrow">City guides</p>
        <h2>Practical city checks for Germany travelers.</h2>
        <p>
          City guides will stay focused on Germany-specific travel risks:
          federal states, public holidays, Sunday closures, essentials,
          pharmacies and trip timing.
        </p>
      </div>

      <div className="compact-city-grid">
        {CITY_GUIDES.map((guide) => (
          <article className="compact-city-card" key={guide.city}>
            <span>{guide.state}</span>
            <h3>{guide.city}</h3>
            <p>{guide.note}</p>
            {guide.href && <a href={guide.href}>Open {guide.city} guide</a>}
          </article>
        ))}
      </div>
    </section>
  )
}
