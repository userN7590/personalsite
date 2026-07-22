const ENTRIES = [
  {
    date: 'July 18, 2026',
    proj: 'Portfolio',
    title: 'Case-study overhaul',
    items: [
      'Rewrote the Simple Rents and WTM case studies to match the real products and stacks',
      'Split the Minecraft page into servers and expandable plugin write-ups (Jackpot, BlitzEnchants, SmartSpawnerNoEXP)',
      'Added server histories with logos — Blitz Raids, Avalon, Apollo Realms, and more',
      'Reframed the AIRE page around the NSF-funded OH-SCIPE program, with press coverage',
      'Added an in-site resume viewer with open-in-tab and download',
      'Full mobile pass across every page; retired the contact and collections pages',
    ],
  },
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
    proj: 'Simple Rents',
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
      <h1 className="page-title"><span className="t">Changelog</span></h1>
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
