import { useEffect, useRef, useState } from 'react'

const MENU_GROUPS = [
  {
    title: 'Plan',
    links: [
      { label: 'Check today', href: '/#check-today' },
      { label: 'Trip date planner', href: '/planner.html' },
    ],
  },
  {
    title: 'City guides',
    links: [
      { label: 'Berlin guide', href: '/berlin.html' },
      { label: 'Munich guide', href: '/munich.html' },
    ],
  },
  {
    title: 'Trouble guides',
    links: [
      { label: 'Train trouble', href: '/train-trouble.html' },
      { label: 'Sunday & holiday closures', href: '/sunday-holiday-closures.html' },
      { label: 'Water, Pfand & toilets', href: '/water-pfand-guide.html' },
      { label: 'Money & payment trouble', href: '/money-payment-trouble.html' },
    ],
  },
  {
    title: 'Site',
    links: [
      { label: 'Impressum', href: '/impressum.html' },
      { label: 'Datenschutz', href: '/datenschutz.html' },
      { label: 'Data by Schulferienklar', href: 'https://www.schulferienklar.de/' },
    ],
  },
]

export default function SiteMenu({ ctaHref, ctaLabel }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    function handlePointerDown(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('mousedown', handlePointerDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('mousedown', handlePointerDown)
    }
  }, [isOpen])

  return (
    <div className="site-menu" ref={menuRef}>
      {ctaHref && ctaLabel && (
        <a className="topbar-link site-menu-cta" href={ctaHref}>
          {ctaLabel}
        </a>
      )}

      <button
        className="site-menu-button"
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className="site-menu-icon" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span>Menu</span>
      </button>

      {isOpen && (
        <div className="site-menu-panel">
          <div className="site-menu-panel-header">
            <strong>Germany Travel Checker</strong>
            <p>Plan dates, check city risks and solve small Germany travel trouble.</p>
          </div>

          <div className="site-menu-groups">
            {MENU_GROUPS.map((group) => (
              <section className="site-menu-group" key={group.title}>
                <h2>{group.title}</h2>
                <div>
                  {group.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
