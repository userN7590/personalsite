import { Backlink, Section, Challenge, Tradeoff, Ent, CaseNav } from '../../components/case/CaseParts'
import Carousel from '../../components/Carousel'

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

export default function Rebilt() {
  return (
    <>
      <Backlink />
      <article className="case">
        <div className="case-head">
          <span className="logo-float logo-lg">
            <img className="logo-dark" src="/assets/logos/rebilt-logo-light.svg" alt="REBILT" />
          </span>
          <span className="case-kicker">Products &amp; Apps</span>
          <div className="case-status">
            <span className="st-wrap"><span className="dot-live" aria-hidden="true"></span><span className="st live">live</span></span>
            <span className="sep">·</span>
            <span className="case-url">rebilt.xyz</span>
          </div>
          <p className="case-summary">REBILT is a curated directory of independently built alternatives to the software people already use: open and indie remakes of tools like Figma, Airtable, Scrivener and Google Analytics, made by solo developers and small teams. Visitors browse, upvote, save and discuss projects, and builders submit their work for review. I built all of it, from the directory and accounts to moderation and the infrastructure underneath, and I run the curation myself.</p>
          <p className="case-tags">TypeScript · Next.js · Cloudflare Workers · D1 (SQLite) · Drizzle ORM · Better Auth · Product design · Curation</p>
          <div className="case-btns">
            <a className="btn btn-primary" href="https://rebilt.xyz">Visit site <span className="ar">&#8599;</span></a>
            <a className="btn btn-ghost" href="https://rebilt.xyz/feed.xml">RSS feed <span className="ar">&#8599;</span></a>
          </div>
        </div>

        <Carousel variant="wide" slides={[
          { node: <img src="/assets/projects/rebilt-wall.webp" alt="REBILT home page — the remake wall with search, category, status and license filters" />,
            caption: 'The remake wall: search, filter by category, status and license, then upvote what you’d use.' },
          { node: <img src="/assets/projects/rebilt-cards.webp" alt="Grid of REBILT project cards, each listing what it is an alternative to and who built it" loading="lazy" />,
            caption: 'Every card shows what a project replaces, who built it, its price, upvotes and comments.' },
          { node: <img src="/assets/projects/rebilt-project.webp" alt="REBILT project page for OpenPencil, an alternative to Figma" loading="lazy" />,
            caption: 'Project pages: what it replaces, who built it, status, price, platforms and license.' },
          { node: <img src="/assets/projects/rebilt-project-take.webp" alt="REBILT project page detail with the written take, builder card and update dates" loading="lazy" />,
            caption: 'A written take on every listing, with its latest release and when the listing was last reviewed.' },
          { node: <img src="/assets/projects/rebilt-builder.webp" alt="REBILT builder profile page" loading="lazy" />,
            caption: 'Builder profiles credit every project to the person or team behind it.' },
        ]} />

        <Section num="01" title="Problem">
          <p>Good independent alternatives to big software exist, but they&rsquo;re scattered across GitHub, Reddit threads and launch sites. Even when you find one, you can&rsquo;t easily tell whether it&rsquo;s real: whether &ldquo;open source&rdquo; means there&rsquo;s actually code, whether it&rsquo;s still maintained, or whether it&rsquo;s a scam wearing a nice landing page. Existing directories either list everything with no judgment or are SEO pages in disguise.</p>
          <p>So the real problem wasn&rsquo;t &ldquo;make a list of apps.&rdquo; It was: how do you build a directory people can trust, with every listing checked, credited to its builder and kept current, and run it cheaply as a solo developer?</p>
        </Section>

        <Section num="02" title="Product overview">
          <p>The home page is &ldquo;the remake wall&rdquo;: a grid of projects you can search, filter and sort. Each project gets its own page with real screenshots, what it replaces, who built it, and its latest release. Signed-in users can upvote, save and comment, and builders can submit their own projects for review.</p>
          <ul className="dot">
            <li><b>The remake wall</b> &mdash; search, categories, and status and license filters, with Featured, newest, most-upvoted and most-discussed sorting.</li>
            <li><b>Project pages</b> &mdash; screenshots, a written take, what it replaces, latest release, when the listing was last reviewed, and discussion.</li>
            <li><b>Builder profiles</b> &mdash; every project credited to the person or team behind it.</li>
            <li><b>Accounts</b> &mdash; Google and GitHub sign-in, upvotes, private saves, and comments under a public name you choose.</li>
            <li><b>Submissions and moderation</b> &mdash; a bot-protected submission form, an admin review queue, and private reports.</li>
            <li><b>Distribution</b> &mdash; an RSS feed of new listings and a generated link-preview image for every project.</li>
          </ul>
        </Section>

        <Section num="03" title="Technical architecture">
          <p>A single Cloudflare Worker serves the whole app at the edge: Next.js App Router pages (built with vinext, Cloudflare&rsquo;s Vite-based Next.js) plus the API routes. The curated catalog ships with the code; everything users create lives in D1.</p>
          <div className="arch">
            <div className="arch-tier"><div className="arch-box"><b>Browser</b><span>rebilt.xyz · wall, project pages, account</span></div></div>
            <div className="arch-conn"></div>
            <div className="arch-tier"><div className="arch-box hl"><b>Cloudflare Worker</b><span>server rendering · API routes · security headers</span></div></div>
            <div className="arch-conn"></div>
            <div className="arch-tier">
              <div className="arch-box"><b>Curated catalog</b><span>projects &amp; builders as typed TypeScript · reviewed in git</span></div>
              <div className="arch-box hl"><b>D1 (SQLite)</b><span>votes · comments · saves · submissions · reports · stats</span></div>
              <div className="arch-box"><b>Better Auth</b><span>Google &amp; GitHub sign-in · sessions in D1</span></div>
            </div>
            <p className="arch-label">Outside the Worker</p>
            <div className="arch-tier">
              <div className="arch-box"><b>GitHub releases feed</b><span>latest release dates · cached at the edge for 6 hours</span></div>
              <div className="arch-box"><b>Turnstile</b><span>bot check on submissions</span></div>
            </div>
            <p className="arch-note">The database never stores the catalog: it only holds what people do with it, keyed by each project&rsquo;s slug.</p>
          </div>
        </Section>

        <Section num="04" title="Data model">
          <p>The data is built around engagement and moderation. Login identity (managed by Better Auth) is kept apart from public identity, and the catalog itself isn&rsquo;t in the database at all.</p>
          <div className="erd">
            <Ent name="votes" fields={[['project_id', 'pk', true], ['user_id', 'pk', true]]} />
            <Ent name="saves" fields={[['user_id', 'pk', true], ['project_id', 'pk', true]]} />
            <Ent name="comments" fields={[['id', 'pk', true], ['project_id', 'text'], ['user_id', 'fk'], ['body', 'text']]} />
            <Ent name="projects (submissions)" fields={[['id', 'pk', true], ['status', 'enum'], ['listing_id', 'text'], ['decided_at', 'ts']]} />
            <Ent name="reports" fields={[['id', 'pk', true], ['project_id', 'text'], ['reason', 'enum'], ['status', 'enum']]} />
            <Ent name="project_stats_daily" fields={[['day', 'pk', true], ['project_id', 'pk', true], ['event', 'pk', true], ['count', 'int']]} />
          </div>
          <p className="erd-rel"><b>Composite primary keys</b> do the integrity work: one vote and one save per person per project is enforced by the database, not by application code. A submission moves from pending to approved to listed (or declined), and the submitter is notified of each decision.</p>
          <p className="erd-rel">Stats are aggregate daily counters with no user IDs, IPs or visitor identifiers. Public display names live in their own table, so nothing is ever posted under someone&rsquo;s Google name unless they choose to.</p>
        </Section>

        <Section num="05" title="Technical challenges">
          <Challenge n="01" q="A full-stack app with no servers">
            <p>Running server-rendered pages, auth and a database entirely on Cloudflare&rsquo;s edge meant working within Workers and D1: SQLite semantics, no long-lived processes, and a framework layer still catching up to Next.js. Database migrations run just before new code ships, so every schema change has to be backward compatible with the version still serving traffic.</p>
          </Challenge>
          <Challenge n="02" q="Rate limits without shared memory">
            <p>Worker instances don&rsquo;t share memory, so in-process rate limiting doesn&rsquo;t work. I moved the counters into D1 and made the comment and submission limits atomic, then added capped request bodies, origin checks on every write, and a Turnstile check bound to the site&rsquo;s own hostname.</p>
          </Challenge>
          <Challenge n="03" q="Accounts that can&rsquo;t be hijacked by email matching">
            <p>With several sign-in providers, the risky shortcut is auto-merging accounts that share an email address. REBILT never does: accounts require a verified email, and linking a second provider is an explicit action from the account page.</p>
          </Challenge>
          <Challenge n="04" q="Showing whether a project is still alive">
            <p>A directory of indie software goes stale fast. Each project page shows two separate dates: the project&rsquo;s latest release and when its listing was last reviewed. For projects on GitHub, the release date is read from the repo&rsquo;s public releases feed (no API key, no API rate limit) and cached at the edge for six hours, with a hand-kept fallback, so it never goes stale.</p>
          </Challenge>
        </Section>

        <Section num="06" title="Design decisions & tradeoffs">
          <Tradeoff q="The catalog as code instead of a CMS">
            <p>Every listing is a typed entry reviewed in git, so the site renders it with no database read and can&rsquo;t publish a half-finished entry. The tradeoff is that adding a project takes a deploy. At this curated scale that&rsquo;s a feature, and I wrote the process up as a repeatable checklist.</p>
          </Tradeoff>
          <Tradeoff q="Cloudflare Workers + D1 instead of a traditional server">
            <p>It&rsquo;s global, cheap and has nothing to patch. The cost is SQLite&rsquo;s limits, no in-memory state, and occasional framework quirks where the edge runtime doesn&rsquo;t behave quite like standard Next.js.</p>
          </Tradeoff>
          <Tradeoff q="Manual vetting and permission-only listings instead of open listing">
            <p>Every project is checked before it goes up: open-source claims against the actual repo, no paywall or DRM bypasses, verifiable downloads, an identifiable maker, and the creator&rsquo;s OK. It grows slower than a free-for-all directory, but trust is the product.</p>
          </Tradeoff>
          <Tradeoff q="First-party aggregate stats instead of third-party analytics">
            <p>Project views and outbound clicks are counted as daily totals in REBILT&rsquo;s own database, with nothing that identifies a visitor.</p>
          </Tradeoff>
        </Section>

        <Section num="07" title="Launch & updates">
          <Update date="Oct 7, 2026" tag="Rebuild" items={[
            'Moved off a hosted site builder onto Cloudflare Workers + D1, with real accounts.',
          ]} />
          <Update date="Oct 9, 2026" tag="Launch" items={[
            'Public release on rebilt.xyz.',
            'Google and GitHub sign-in, status filter, saved projects, pagination and project stats.',
            'A security review before launch: atomic limits, capped request bodies and hardened auth routes.',
          ]} />
          <Update date="Oct 10, 2026" tag="Moderation" items={[
            'Private project reports with an admin review queue.',
          ]} />
          <Update date="Oct 12–13, 2026" tag="Community feedback" items={[
            'Shipped three requests from a Reddit thread within days: a license filter, an RSS feed, and latest-release and listing-reviewed dates.',
            'Grew from 19 to 24 listed projects, including the first one submitted through the public form.',
          ]} />
          <Update date="In progress" tag="Next" items={[
            'A “what it replaces well, what it doesn’t yet” line on each listing, written by its creator.',
          ]} />
        </Section>

        <Section num="08" title="Lessons learned">
          <ul className="dot">
            <li><b>Curation is the product.</b> The vetting checklist matters more than any feature on the page.</li>
            <li><b>Ship feedback fast.</b> Small, specific requests delivered within days bring people back.</li>
            <li><b>Keep what you don&rsquo;t need out of the database.</b> A catalog in code and aggregate-only stats left less to secure and less to break.</li>
            <li><b>Edge runtimes change your assumptions.</b> With no shared memory, anything stateful has to go through the database, rate limits included.</li>
          </ul>
        </Section>

        <Section num="09" title="Future improvements">
          <ul className="dot">
            <li>&ldquo;Replaces well / doesn&rsquo;t yet&rdquo; lines from creators, collected through the submission form.</li>
            <li>Pages for each replaced app, so all the alternatives to one tool live in one place.</li>
            <li>Builders claiming their own profiles to keep their listings current, followed by a marketplace and launch tools for builders.</li>
            <li>Automated deploys from CI, plus checks that flag broken links and outdated screenshots.</li>
          </ul>
        </Section>

        <Section num="10" title="What I&rsquo;d build differently today">
          <p>I&rsquo;d start on Workers + D1 from day one instead of migrating off a hosted site builder, and set up automated deploys from the beginning. I&rsquo;d also model the path from submission to live listing as data earlier, so approving a submission could publish it directly instead of being a separate manual step. Most of what I&rsquo;d change is about the pipeline around the listings, not the listings themselves.</p>
        </Section>

        <CaseNav
          prev={{ to: '/projects', lbl: 'Back to', label: <>&larr; All projects</> }}
          next={{ to: '/projects/wordloot', lbl: 'Next project', label: <>WordLoot &rarr;</> }}
        />
      </article>
    </>
  )
}
