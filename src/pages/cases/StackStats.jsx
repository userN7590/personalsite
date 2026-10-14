import { Backlink, Section, Challenge, Tradeoff, Ent, CaseNav } from '../../components/case/CaseParts'
import Carousel from '../../components/Carousel'

// Monochrome VS Code mark (same glyph stackstats.dev uses for its extension note).
function VsCodeMark() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
      <path d="M23.15 2.587 18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" />
    </svg>
  )
}

function Update({ date, tag, items }) {
  return (
    <article className="log-entry">
      <div className="log-meta"><span className="log-date">{date}</span><span className="dot">·</span><span className="log-proj">{tag}</span></div>
      <ul>
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </article>
  )
}

export default function StackStats() {
  return (
    <>
      <Backlink />
      <article className="case">
        <div className="case-head">
          <span className="logo-float logo-lg">
            <img className="logo-dark" src="/assets/logos/stack-stats-wordmark.png" alt="Stack Stats" />
          </span>
          <span className="case-kicker">Products &amp; Apps</span>
          <div className="case-status">
            <span className="st-wrap"><span className="dot-live" aria-hidden="true"></span><span className="st live">live</span></span>
            <span className="sep">·</span>
            <span className="case-url">stackstats.dev</span>
          </div>
          <p className="case-summary">Stack Stats turns the coding you do in VS Code into a developer profile you can share. Think Strava for coding: a local-first VS Code extension tracks coding time, sessions, languages, projects and streaks on your own machine, and stackstats.dev turns the parts you choose to publish into a public profile, including the work that never shows up as a GitHub commit. I built both halves, the extension and the website, plus the sync protocol and the sign-in flow that connect them. The site is live; the extension is at its 0.6.0 Marketplace release candidate.</p>
          <p className="case-tags">TypeScript · VS Code Extension API · Next.js · React · Supabase (Postgres, RLS) · OAuth PKCE · SQLite · Vitest · Privacy design</p>
          <div className="case-btns">
            <a className="btn btn-primary" href="https://stackstats.dev">Visit site <span className="ar">&#8599;</span></a>
            <a className="btn btn-ghost" href="https://stackstats.dev/u/fil">My profile <span className="ar">&#8599;</span></a>
            {/* not a link until the Marketplace listing is live */}
            <span className="btn btn-soon"><VsCodeMark />VS Code <span className="soon">Coming soon</span></span>
            <a className="btn btn-ghost" href="https://github.com/userN7590/stack-stats">Extension on GitHub <span className="ar">&#8599;</span></a>
          </div>
        </div>

        <Carousel variant="wide" slides={[
          { node: <img src="/assets/projects/stack-stats-home.webp" alt="Stack Stats home page — “Your development. One profile.” beside a fan of developer profile cards" />,
            caption: 'The home page: example profiles fanned out beside a live card for my own /u/fil.' },
          { node: <img src="/assets/projects/stack-stats-fingerprint.webp" alt="Activity fingerprint: 30 days of coding drawn as stacked ridgelines, one per day, by hour" loading="lazy" />,
            caption: 'The activity fingerprint: 30 days of coding, one ridge per day, hour by hour (example data).' },
          { node: <img src="/assets/projects/stack-stats-example.webp" alt="Example Stack Stats profile with development totals, code changes and language activity" loading="lazy" />,
            caption: 'A manual profile: self-reported totals and a language breakdown, no extension needed.' },
          { node: <img src="/assets/projects/stack-stats-languages.webp" alt="Language activity on a Stack Stats profile, drawn as orbital rings" loading="lazy" />,
            caption: 'Language activity on my own profile, tracked by the extension and published by choice.' },
        ]} />

        <Section num="01" title="Problem">
          <p>GitHub&rsquo;s contribution graph only sees what you commit and push. The hours spent in an editor on a side project, a class assignment, a refactor that never merged or a private repo at work don&rsquo;t show up anywhere. Existing time trackers fill that gap by streaming editor heartbeats, often with file and project names, to a hosted service, which is a hard sell for code you aren&rsquo;t allowed to share.</p>
          <p>So the real problem wasn&rsquo;t &ldquo;count coding time.&rdquo; It was: how do you measure editor activity accurately enough to be worth showing, while keeping everything on the developer&rsquo;s machine until they decide, explicitly and one step at a time, what leaves it?</p>
        </Section>

        <Section num="02" title="Product overview">
          <p>Two products that work together. The VS Code extension tracks locally and works with no account, no network and no setup. The website is where a developer builds a public profile, either by entering their own totals or by publishing summaries synced from the extension.</p>
          <ul className="dot">
            <li><b>The extension</b> &mdash; an Activity sidebar and status bar showing today&rsquo;s coding time, the current session, this week, languages, projects and your coding streak, offline from the first edit.</li>
            <li><b>Tracking levels</b> &mdash; Minimal, Moderate (the default) or Extensive, with per-capability advanced settings. A level only changes what&rsquo;s collected locally, never what&rsquo;s synced or published.</li>
            <li><b>Agent-aware activity</b> &mdash; changes made by Claude Code, Codex, scripts or checkouts are recorded separately and never counted as your coding time. Agents can be connected in one click so they label their own work.</li>
            <li><b>Account linking and private sync</b> &mdash; optional browser sign-in from the editor, then a separate approval to upload daily summaries, which stay private.</li>
            <li><b>Public profiles</b> &mdash; <code>/u/username</code> with links, stats, charts and a language breakdown, arranged by the owner on a six-column grid.</li>
            <li><b>Publication controls</b> &mdash; synced data stays private until the owner picks which metrics appear. Schedule charts need their own opt-in, and project activity is never published.</li>
          </ul>
        </Section>

        <Section num="03" title="Technical architecture">
          <p>The extension is a TypeScript monorepo: a pure, editor-independent core (the session state machine, line counting, and daily and weekly reducers), a strict protocol package, and the VS Code app around them, plus an optional local daemon and CLI. The website is Next.js on Vercel, with Supabase for auth and Postgres. The two only meet at a small, versioned sync contract.</p>
          <div className="arch">
            <div className="arch-tier"><div className="arch-box hl"><b>VS Code extension</b><span>edit events · session tracker · sidebar &amp; status bar</span></div></div>
            <div className="arch-conn"></div>
            <div className="arch-tier">
              <div className="arch-box"><b>Local session store</b><span>atomic snapshots every 15 s · VS Code global storage</span></div>
              <div className="arch-box"><b>SecretStorage</b><span>editor credentials · never in settings, logs or URLs</span></div>
              <div className="arch-box"><b>Daemon + CLI</b><span>optional · 127.0.0.1 only · SQLite mirror</span></div>
            </div>
            <p className="arch-label">Only after sign-in and a separate upload approval</p>
            <div className="arch-tier"><div className="arch-box hl"><b>stackstats.dev</b><span>Next.js on Vercel · editor approval · sync API · public profiles</span></div></div>
            <div className="arch-conn"></div>
            <div className="arch-tier">
              <div className="arch-box"><b>Supabase Auth</b><span>email sign-in · cookie sessions on server and client</span></div>
              <div className="arch-box hl"><b>Postgres</b><span>row-level security · narrow functions · private sync tables</span></div>
            </div>
            <p className="arch-note">Without an account the extension makes no network requests of its own. Source code, file names and paths never leave the machine.</p>
          </div>
        </Section>

        <Section num="04" title="Data model">
          <p>The schema is split by who&rsquo;s allowed to see what. Public profile data, editor credentials and synced activity live in separate tables, and neither the browser nor the extension can touch the private ones directly: every write goes through a narrow Postgres function that works out the owner from the session or token, never from the request.</p>
          <div className="erd">
            <Ent name="profiles" fields={[['user_id', 'pk', true], ['username', 'unique'], ['profile_layout', 'jsonb'], ['coding_minutes', 'int']]} />
            <Ent name="profile_languages" fields={[['id', 'pk', true], ['user_id', 'fk'], ['name', 'text'], ['percentage', 'num']]} />
            <Ent name="extension_connections" fields={[['id', 'pk', true], ['user_id', 'fk'], ['refresh_hash', 'text'], ['scope', 'enum']]} />
            <Ent name="extension_access_tokens" fields={[['token_hash', 'pk', true], ['connection_id', 'fk'], ['expires_at', 'ts']]} />
            <Ent name="sync_days" fields={[['user_id', 'pk', true], ['installation_id', 'pk', true], ['date', 'pk', true], ['revision', 'int'], ['payload', 'jsonb']]} />
            <Ent name="sync_privacy" fields={[['user_id', 'pk', true], ['publish_profile', 'bool'], ['published_metrics', 'jsonb'], ['publish_schedule', 'bool']]} />
          </div>
          <p className="erd-rel"><b>Composite keys make sync idempotent.</b> Each day is keyed by account, installation and date, with a revision number: replaying an upload changes nothing, a higher revision replaces the day, and a stale or conflicting one is rejected with a 409 instead of being counted twice.</p>
          <p className="erd-rel">Credentials are stored only as SHA-256 hashes. Synced data never writes to <code>profiles</code>; the public profile reads an allowlist of published metrics and leaves out project IDs, installation IDs and individual dates.</p>
        </Section>

        <Section num="05" title="Technical challenges">
          <Challenge n="01" q="Measuring coding time honestly">
            <p>Most trackers credit time on a heartbeat, so a file left open counts as work. Stack Stats only credits the gap between two focused edits when it&rsquo;s 60 seconds or less: nothing after the last edit, and nothing for reading, scrolling or switching tabs. Sessions are grouped separately (five idle minutes start a new one), midnight and daylight-saving boundaries are split exactly in local time, and the rules live in a pure core with a test for each edge case.</p>
          </Challenge>
          <Challenge n="02" q="Signing an editor into a website without leaking tokens">
            <p>An editor can&rsquo;t receive a normal web redirect, so I built a PKCE flow: the extension generates a secret verifier, the user approves in the browser on stackstats.dev, and a single-use code valid for 90 seconds returns to a <code>vscode://</code> callback that must match a short, exact allowlist. Access tokens last 15 minutes, and sync credentials rotate their refresh token on every use, so replaying an old token revokes the whole connection. Testing in a real VS Code window caught a bug no unit test did: VS Code re-encoded the nested callback, so it arrived double-encoded and was rightly rejected.</p>
          </Challenge>
          <Challenge n="03" q="Telling your code apart from an agent&rsquo;s">
            <p>With Claude Code and Codex writing files, line counts stop meaning much. I ran 20 scenarios in an isolated VS Code window to see what the editor actually reports, then treated any change that doesn&rsquo;t come from a focused, visible editor as external: it&rsquo;s recorded and reconciled locally, but never counted as coding time. Connecting an agent adds hook entries to its settings after a confirmation, so it can label its own runs. Nothing about agents is synced or published.</p>
          </Challenge>
          <Challenge n="04" q="Sync that survives retries, crashes and multiple windows">
            <p>Uploads are daily summaries with a per-day revision, queued on disk and sent ten at a time with exponential backoff. A cross-window file lock stops two VS Code windows from racing each other, a lost response safely retries the same request, and if any local session file can&rsquo;t be read, that day is held back rather than overwriting a complete cloud day with partial history.</p>
          </Challenge>
        </Section>

        <Section num="06" title="Design decisions & tradeoffs">
          <Tradeoff q="Local-first instead of cloud-first">
            <p>The extension is fully useful with no account, and nothing leaves the machine until the developer signs in and then separately approves uploads. The tradeoff is that the website only sees what people choose to sync, so profiles start sparse, and the same work done on two machines can&rsquo;t be deduplicated yet.</p>
          </Tradeoff>
          <Tradeoff q="Daily summaries instead of raw events">
            <p>The server gets one summary per day per installation: time, edits, lines, sessions, files and language totals, with projects as keyed hashes rather than names. That rules out rich server-side analytics, but there&rsquo;s nothing sensitive to leak, and the contract is small enough to validate strictly in both TypeScript and SQL.</p>
          </Tradeoff>
          <Tradeoff q="Three separate consents instead of one switch">
            <p>Tracking, uploading and publishing are independent choices with their own controls, and none of them turns on the next. It&rsquo;s more to explain in the UI, but nobody publishes their coding schedule by accident.</p>
          </Tradeoff>
          <Tradeoff q="A copied contract instead of a shared package">
            <p>The extension and website deploy independently and use different major versions of their validation library, so the website keeps an exact copy of the protocol file and a parity script fails if the two drift. It&rsquo;s duplication on purpose, until the protocol is stable enough to publish as its own package.</p>
          </Tradeoff>
        </Section>

        <Section num="07" title="Launch & updates">
          <Update date="Aug 2026" tag="Prototype" items={[
            'Started the VS Code extension: local session tracking on a pure, editor-independent core, installed from VSIX builds.',
          ]} />
          <Update date="Aug 27, 2026" tag="Website" items={[
            'Built stackstats.dev as a time-boxed full-stack project: email sign-in, public profiles at /u/username, and manual stats and language breakdowns, all behind Postgres row-level security.',
          ]} />
          <Update date="Sep 9–18, 2026" tag="Accounts & sync" items={[
            'Extension 0.4–0.5: account linking from the editor over PKCE.',
            'Private daily-summary sync behind its own browser approval, with idempotent, revisioned uploads.',
          ]} />
          <Update date="Sep 24–29, 2026" tag="Profiles" items={[
            'Customizable profile layouts on a six-column grid, chart styles and per-metric publication controls.',
            'Richer sync summaries behind a second opt-in, a new visual identity, and the interactive activity fingerprint.',
          ]} />
          <Update date="Sep 29–30, 2026" tag="Agents" items={[
            'Agent-aware tracking: outside changes recorded separately from coding time, with one-click Claude Code and Codex connections.',
            'Minimal, Moderate and Extensive tracking levels, with a plain-language privacy summary.',
          ]} />
          <Update date="Oct 1–3, 2026" tag="Release candidate" items={[
            'Prepared the 0.6.0 Marketplace release: new branding, and packaged-extension tests in clean VS Code profiles.',
            'Fixed double-encoded sign-in callbacks on desktop VS Code.',
            'Wrote a privacy policy and audited each claim against the code. 387 extension tests and 763 website tests passing.',
          ]} />
          <Update date="In progress" tag="Next" items={[
            'Publishing 0.6.0 on the VS Code Marketplace and replacing the homepage’s “coming soon” with an install link.',
          ]} />
        </Section>

        <Section num="08" title="Lessons learned">
          <ul className="dot">
            <li><b>Define the metric before the dashboard.</b> Deciding what counts as a second of coding took longer than any chart, and every later feature depended on it.</li>
            <li><b>Design privacy in from the start.</b> Because uploads were summaries-only and consents were separate from day one, writing the privacy policy meant documenting the code, not changing it.</li>
            <li><b>Test in the real host.</b> The worst bugs, like callback encoding and publisher-name casing, only appeared in a real VS Code window running the packaged extension.</li>
            <li><b>Two repos need one contract.</b> A versioned protocol with a parity check kept two independently deployed apps from drifting apart.</li>
          </ul>
        </Section>

        <Section num="09" title="Future improvements">
          <ul className="dot">
            <li>The Marketplace release, with an install link from the homepage.</li>
            <li>Self-service export and deletion of synced data from the settings page; the API exists, the button doesn&rsquo;t yet.</li>
            <li>Historical trends and project timelines built from the daily summaries already being collected.</li>
            <li>Reconciling the same work seen from two machines or editors, before showing anything like human-versus-agent ratios.</li>
            <li>GitHub sign-in and password recovery.</li>
          </ul>
        </Section>

        <Section num="10" title="What I&rsquo;d build differently today">
          <p>I&rsquo;d design the sync contract and the profile together from day one. The website started as a manual-stats profile and the extension came later, so the profile went through three layout versions and a &ldquo;which source wins&rdquo; rule to reconcile typed-in totals with synced ones. I&rsquo;d also put a real browser-and-editor end-to-end test in CI early: the trickiest bugs lived in the handoff between VS Code, the browser and the website, which is exactly where unit tests can&rsquo;t see.</p>
        </Section>

        <CaseNav
          prev={{ to: '/projects/wordloot', lbl: 'Previous', label: <>&larr; WordLoot</> }}
          next={{ to: '/projects/wtm', lbl: 'Next project', label: <>What&rsquo;s The Move &rarr;</> }}
        />
      </article>
    </>
  )
}
