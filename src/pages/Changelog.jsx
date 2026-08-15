// Placeholder history — believable weekly-ish entries. Swap in the real details later.
const ENTRIES = [
  {
    date: 'July 21, 2026',
    proj: 'WTM',
    title: 'Community reports v1',
    items: [
      'Shipped venue condition reports — busy, line, cover',
      'Added freshness decay so stale reports fade out',
      'Tuned marker clustering at city-wide zoom',
    ],
  },
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
    date: 'July 14, 2026',
    proj: 'Simple Rents',
    title: 'Operational calendar',
    items: [
      'Derived rent-due, lease, and maintenance events straight from the records',
      'Color-coded the calendar by property',
      'Added filters by event type',
    ],
  },
  {
    date: 'July 11, 2026',
    proj: 'WTM',
    title: '“Bumps”',
    items: [
      'Added “bump” — a signal that you plan to visit a venue tonight',
      'Kept bumps separate from observed reports',
      'Nightly reset of the night’s bumps',
    ],
  },
  {
    date: 'July 7, 2026',
    proj: 'Simple Rents',
    title: 'Portfolio dashboard',
    items: [
      'Occupancy, income, and expense summary tiles',
      'Upcoming-events and maintenance widgets',
      'First-run onboarding empty states',
    ],
  },
  {
    date: 'July 3, 2026',
    proj: 'WordLoot',
    title: 'Creator analytics & referrals',
    items: [
      'Referral tracking for the first 8 creators',
      'Per-creator payout and activity breakdowns',
      'Real-time pot updates over the wire',
    ],
  },
  {
    date: 'June 27, 2026',
    proj: 'WTM',
    title: 'Map MVP',
    items: [
      'Interactive Mapbox map of nearby venues',
      'Anonymous browsing — no account required',
      'Venue detail sheet with recent activity',
    ],
  },
  {
    date: 'June 23, 2026',
    proj: 'Simple Rents',
    title: 'Documents & notifications',
    items: [
      'S3-backed document uploads per unit',
      'Lease and receipt attachments',
      'Reminder emails via Amazon SES',
    ],
  },
  {
    date: 'June 18, 2026',
    proj: 'WordLoot',
    title: 'Commit-reveal fairness',
    items: [
      'Added commit-reveal verification for each round',
      'Public round-audit view',
      'Documented the fairness scheme',
    ],
  },
  {
    date: 'June 14, 2026',
    proj: 'WTM',
    title: 'Backend foundation',
    items: [
      'Supabase auth + PostGIS schema',
      'Venues-in-view geospatial queries',
      'Throttled map-bound refresh to cut backend load',
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
    date: 'June 2, 2026',
    proj: 'Simple Rents',
    title: 'First beta portfolio',
    items: [
      'Parents’ 31-unit portfolio running in beta',
      'Rough spreadsheet import for existing data',
      'Daily-use bug triage',
    ],
  },
  {
    date: 'May 26, 2026',
    proj: 'WordLoot',
    title: 'Withdrawal reconciliation',
    items: [
      'Reconcile on-chain events to balances exactly once',
      'Idempotent transaction processing — no double credits',
      'Solvency checks so payouts never exceed the pot',
    ],
  },
  {
    date: 'May 19, 2026',
    proj: 'WordLoot',
    title: 'Settlement engine',
    items: [
      'Automated payout engine across resolved rounds',
      'Append-only ledger as the source of truth',
      'Balances reconstructed from ledger entries',
    ],
  },
  {
    date: 'May 12, 2026',
    proj: 'WTM',
    title: 'Concept & prototype',
    items: [
      'Landed on a map-first nightlife concept',
      'Static prototype of the live venue map',
      'Named it “What’s The Move”',
    ],
  },
  {
    date: 'May 5, 2026',
    proj: 'WordLoot',
    title: 'Deterministic resolution',
    items: [
      'Made round resolution fully deterministic',
      'Replayable round inputs for auditing',
      'Test suite around the payout math',
    ],
  },
  {
    date: 'April 28, 2026',
    proj: 'WordLoot',
    title: 'Append-only ledger',
    items: [
      'Rebuilt balances as an append-only ledger',
      'Every coin traceable to the event that created it',
      'Reason-tagged deposits, bets, winnings, and withdrawals',
    ],
  },
  {
    date: 'April 20, 2026',
    proj: 'WordLoot',
    title: 'Daily round generation',
    items: [
      'Automated daily round generation',
      'Countdown timer and a live pot',
      'Scheduled auto-resolution job',
    ],
  },
  {
    date: 'April 13, 2026',
    proj: 'WordLoot',
    title: 'Crypto deposits',
    items: [
      'Wired up the crypto deposit flow',
      'Credit balance on confirmation',
      'Deposit history view',
    ],
  },
  {
    date: 'April 6, 2026',
    proj: 'WordLoot',
    title: 'Scoring engine',
    items: [
      'Built the scoring and weighting logic',
      'Expected-value analysis of round outcomes',
      'Simulated rounds to balance the economy',
    ],
  },
  {
    date: 'March 30, 2026',
    proj: 'WordLoot',
    title: 'Accounts & balances',
    items: [
      'Supabase auth and user accounts',
      'Coin balance model',
      'First wallet UI',
    ],
  },
  {
    date: 'March 16, 2026',
    proj: 'WordLoot',
    title: 'Betting UI',
    items: [
      'Word entry with a bet slider',
      'Live payout preview against the pot',
      'Round timer',
    ],
  },
  {
    date: 'February 23, 2026',
    proj: 'WordLoot',
    title: 'First playable round',
    items: [
      'End-to-end round loop working',
      'Manual resolution for testing',
      'Internal playtest',
    ],
  },
  {
    date: 'January 26, 2026',
    proj: 'WordLoot',
    title: 'Data model',
    items: [
      'Users, rounds, bets, and ledger tables',
      'Postgres schema and migrations',
      'Seed data for local dev',
    ],
  },
  {
    date: 'December 15, 2025',
    proj: 'WordLoot',
    title: 'Prototype',
    items: [
      'Word-prediction game prototype',
      'Sketched the coin economy',
      'Validated the daily-round concept',
    ],
  },
  {
    date: 'November 24, 2025',
    proj: 'WordLoot',
    title: 'Project kickoff',
    items: [
      'Started WordLoot',
      'Chose the Supabase + Postgres stack',
      'Mapped the economy on paper first',
    ],
  },
  {
    date: 'September 29, 2025',
    proj: 'Stack Stats',
    title: 'Charts & saved views',
    items: [
      'Added time-range filters',
      'More chart types',
      'Saved dashboard views',
    ],
  },
  {
    date: 'August 25, 2025',
    proj: 'Stack Stats',
    title: 'First live metrics',
    items: [
      'Wired the first live data source',
      'Basic dashboard tiles',
      'Light/dark theme',
    ],
  },
  {
    date: 'August 11, 2025',
    proj: 'Stack Stats',
    title: 'Created',
    items: [
      'Started Stack Stats — a small stats dashboard tool',
      'Set up the project and deploy pipeline',
      'Sketched the dashboard concept',
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
