const ENTRIES = [
  {
    date: 'June 11, 2026',
    proj: 'WTM',
    title: 'Landing page & early growth',
    items: [
      'Purchased wtmtonight.xyz',
      'Started public landing page development',
      'Refined nightlife venue scoring concepts',
      'Defined passport and location-stamp progression system',
    ],
  },
  {
    date: 'June 10, 2026',
    proj: 'Portfolio',
    title: 'Portfolio redesign',
    items: [
      'Added project logos',
      'Improved project descriptions',
      'Added collections section',
      'Reworked navigation structure',
    ],
  },
  {
    date: 'June 9, 2026',
    proj: 'WordLoot',
    title: 'Quality-of-life improvements',
    items: [
      'Added streamer mode',
      'Improved winnings history experience',
      'Refined coin ledger workflows',
      'Continued payout system improvements',
    ],
  },
  {
    date: 'June 7, 2026',
    proj: 'RentalCRM',
    title: 'Planning & architecture',
    items: [
      'Defined property and tenant data model',
      'Mapped maintenance request workflow',
      'Drafted onboarding experience',
      'Researched document management features',
    ],
  },
  {
    date: 'July 15, 2025',
    proj: 'AIRE Research',
    title: 'Research presentation',
    items: [
      'Presented final findings at Ohio AIRE symposium',
      'Completed evaluation pipeline',
      'Finalized experiment results',
      'Published project documentation',
    ],
  },
]

export default function Changelog() {
  return (
    <>
      <h1 className="page-title"><span className="num">03</span><span className="t">Changelog</span></h1>
      <p className="page-sub">Recent work, releases, experiments, and progress across projects.</p>

      <section className="changelog">
        {ENTRIES.map((entry) => (
          <article className="log-entry" key={entry.date + entry.title}>
            <div className="log-meta">
              <span className="log-date">{entry.date}</span>
              <span className="dot">·</span>
              <span className="log-proj">{entry.proj}</span>
            </div>
            <h3 className="log-title">{entry.title}</h3>
            <ul>
              {entry.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
        ))}
      </section>
    </>
  )
}
