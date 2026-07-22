import { Backlink, Section, Challenge, Tradeoff, Ent, CaseNav } from '../../components/case/CaseParts'
import Carousel from '../../components/Carousel'

export default function WTM() {
  return (
    <>
      <Backlink />
      <article className="case">
        <div className="case-head">
          <span className="logo-float logo-lg">
            <img className="logo-dark" src="/assets/logos/wtm-logo.png" alt="What's The Move" />
            <img className="logo-light" src="/assets/logos/wtm-logo-ink.png" alt="What's The Move" />
          </span>
          <span className="case-kicker">Products &amp; Apps</span>
          <div className="case-status">
            <span className="st-wrap"><span className="dot-wip" aria-hidden="true"></span><span className="st">in development</span></span>
            <span className="sep">·</span>
            <span className="st">expected release q4 2026</span>
          </div>
          <p className="case-summary">WTM (&ldquo;What&rsquo;s The Move&rdquo;) is a map-first nightlife app built around one question: where is everyone going tonight? Most discovery tools rely on permanent ratings, scheduled events, or historical popularity &mdash; WTM focuses on <em>current</em> activity instead. The MVP is anonymous map browsing, venue details, community reports on tonight&rsquo;s conditions, and the ability to &ldquo;bump&rdquo; a venue you plan to visit. I&rsquo;m building it with React Native, Expo, and TypeScript on a Supabase + PostGIS backend.</p>
          <p className="case-tags">React Native · Expo · TypeScript · Mapbox · Supabase · PostGIS</p>
        </div>

        <Carousel variant="phone" slides={[
          { node: <img src="/assets/projects/wtm.png" alt="WTM — map-first nightlife interface" />,
            caption: 'The map is the primary interface; social surfaces are part of the broader direction.' },
        ]} />

        <Section num="01" title="Problem">
          <p>Choosing where to go out usually means stitching together incomplete information from several places. Google Maps shows ratings and typical busy periods, event platforms show what was scheduled, and social media shows isolated posts. None of them reliably answers whether a particular venue is worth visiting <em>tonight</em>.</p>
          <p>Nightlife information also expires fast &mdash; that a bar is empty, packed, charging a cover, or forming a long line may only be useful for a short window. So the core challenge wasn&rsquo;t finding nearby venues; it was producing a useful, time-sensitive signal from incomplete community activity without requiring every user to make an account or constantly share their location.</p>
        </Section>

        <Section num="02" title="Product overview">
          <p>The map is the primary interface. You can open WTM and browse nearby nightlife without making an account, which keeps the gap between downloading the app and getting value from it small. Each venue shows recent activity and the practical details you need before deciding to go:</p>
          <ul className="dot">
            <li><b>Map</b> &mdash; browse nearby venues anonymously, no account required.</li>
            <li><b>Reports</b> &mdash; observed conditions: how busy or empty it feels, whether there&rsquo;s a line, whether a cover is being collected, and the current atmosphere.</li>
            <li><b>Bumps</b> &mdash; a signal that you plan to visit a venue tonight. Bumps represent upcoming interest; reports represent observed conditions &mdash; keeping them separate stops planned attendance from being read as confirmed activity.</li>
            <li><b>Accounts only when contributing</b> &mdash; required to submit data or use social features, not to browse.</li>
          </ul>
          <p>Friends, chats, pub crawls, recaps, and rewards are part of the broader product direction, but they&rsquo;re not in the initial discovery-focused MVP.</p>
        </Section>

        <Section num="03" title="Technical architecture">
          <p>WTM is a cross-platform mobile app built with React Native, Expo, and TypeScript. Expo Router provides file-based navigation and Mapbox powers the interactive map. Supabase is the backend foundation, and the public marketing site lives separately at <b>wtmtonight.xyz</b> so each project has a simpler deployment workflow.</p>
          <div className="arch">
            <div className="arch-tier"><div className="arch-box hl"><b>React Native + Expo app</b><span>Expo Router · Mapbox map · venue details</span></div></div>
            <div className="arch-conn"></div>
            <div className="arch-tier">
              <div className="arch-box"><b>Mapbox + location</b><span>map UI · markers · nearby ranking</span></div>
              <div className="arch-box hl"><b>Supabase</b><span>auth · PostgreSQL · PostGIS · row-level security</span></div>
            </div>
            <div className="arch-conn"></div>
            <div className="arch-tier"><div className="arch-box"><b>Request flow</b><span>client requests venues in view &rarr; PostGIS filters &rarr; combined with bumps + recent reports</span></div></div>
          </div>
        </Section>

        <Section num="04" title="Data model">
          <p>The model centers on venues and the short-lived activity attached to them. Venue records carry coordinates and standard info so they can be queried spatially through PostGIS; <b>bumps</b> connect a user to a venue they intend to visit on a given night; <b>reports</b> connect a recent observation to a venue, reporter, timestamp, and condition.</p>
          <div className="erd">
            <Ent name="venues" fields={[['id', 'pk', true], ['name', 'text'], ['location', 'geo']]} />
            <Ent name="bumps" fields={[['id', 'pk', true], ['venue_id', 'fk'], ['user_id', 'fk'], ['night', 'date']]} />
            <Ent name="reports" fields={[['id', 'pk', true], ['venue_id', 'fk'], ['condition', 'enum'], ['created_at', 'ts']]} />
          </div>
          <p className="erd-rel">The key distinction is permanent vs. temporary data: venue identity and location change rarely, bumps are relevant only to a particular night, and reports lose value as conditions change. WTM is about <em>tonight</em>, so timestamps and expiration rules are part of the product model rather than incidental metadata &mdash; the later social, recap, and reward schemas aren&rsquo;t finalized yet.</p>
        </Section>

        <Section num="05" title="Technical challenges">
          <Challenge n="01" q="Making temporary data useful">
            <p>WTM has to tell current activity from stale information. A report from earlier in the evening may still help, while the same report hours later could mislead. That needs freshness rules for bumps and reports plus clear timestamps in the UI &mdash; and eventually different signals may need different expiration or weighting rather than one universal definition of &ldquo;recent.&rdquo;</p>
          </Challenge>
          <Challenge n="02" q="Geographic querying on a mobile map">
            <p>The app must request enough venues to be useful without loading an entire city. PostGIS handles nearby and map-bound queries, but the client has to update them carefully as the user pans &mdash; frequent requests would create backend load and make the interface feel unstable, so it needs deliberate refresh behavior, sensible bounds, and marker clustering as density grows.</p>
          </Challenge>
          <Challenge n="03" q="Building around community data">
            <p>WTM gets better as people submit bumps and reports, but a new product starts with little activity. The map still has to provide value through venue discovery when live signals are sparse &mdash; which is why reports are an enhancement to the venue map, not a requirement for the app to be usable.</p>
          </Challenge>
          <Challenge n="04" q="Protecting location privacy">
            <p>Location improves nearby discovery, but WTM doesn&rsquo;t need a user&rsquo;s precise continuous position. It&rsquo;s designed around venue-level intent and activity instead of person-level tracking &mdash; which matters most for planned social features, where showing that a friend bumped a venue is very different from showing their live coordinates.</p>
          </Challenge>
        </Section>

        <Section num="06" title="Design decisions & tradeoffs">
          <Tradeoff q="Map-first navigation">
            <p>The central question is spatial &mdash; what&rsquo;s nearby, how nightlife is distributed across an area, whether moving to another neighborhood is worth it. A map is more demanding than a ranked list, especially on mobile, but it communicates that in a way a feed can&rsquo;t.</p>
          </Tradeoff>
          <Tradeoff q="Anonymous browsing">
            <p>Requiring registration before showing anything useful would hurt early adoption, so public discovery needs no account and auth is reserved for reports, bumps, and social actions. The tradeoff is designing a careful transition from anonymous browsing to account creation.</p>
          </Tradeoff>
          <Tradeoff q="Bumps instead of continuous tracking">
            <p>A bump is an intentional statement that you plan to visit, giving a social signal without monitoring anyone through the night. It&rsquo;s less precise than continuous tracking, but easier to understand, more privacy-respecting, and more realistic for an early version.</p>
          </Tradeoff>
          <Tradeoff q="Focused MVP before social expansion">
            <p>I explored friends, group chats, pub crawls, leaderboards, recaps, passport stamps, and a ticket-based reward economy. They could strengthen retention, but building them at once would obscure the core test: can a live map, venue pages, bumps, and recent reports help someone make a better nightlife decision?</p>
          </Tradeoff>
        </Section>

        <Section num="07" title="Current status">
          <p>WTM is in progress and hasn&rsquo;t launched publicly, so there are no meaningful usage metrics &mdash; and I won&rsquo;t invent any. What exists is the product direction, MVP scope, mobile interface, mapping approach, backend stack, and the larger social concepts; development has set up the React Native and Expo app, integrated the map-focused architecture, and planned the Supabase and PostGIS data layer.</p>
          <p>I paused active development in <b>June 2026</b> to focus on my job search, portfolio, and finishing Simple Rents. The pause was a prioritization decision, not a loss of interest in the product &mdash; the current target is a public release in <b>Q4 2026</b>.</p>
        </Section>

        <Section num="08" title="Lessons learned">
          <ul className="dot">
            <li>&ldquo;Live&rdquo; isn&rsquo;t a visual feature &mdash; it affects the database, timestamps, expiration rules, ranking, moderation, and how confidently the UI can describe current conditions.</li>
            <li>Separate the core product from ideas that improve retention. Social systems, rewards, and recaps can&rsquo;t compensate for a map that fails to answer the original question.</li>
            <li>Anonymous access isn&rsquo;t just an onboarding choice &mdash; it changes auth boundaries, permissions, contribution flows, and how much value the app must give before asking anything of the user.</li>
          </ul>
        </Section>

        <Section num="09" title="Future improvements">
          <p>The next phase would focus on completing and validating the discovery loop: open the map without an account &rarr; find relevant nearby venues &rarr; inspect recent bumps and reports &rarr; decide where to go &rarr; contribute updated info afterward.</p>
          <ul className="dot">
            <li>Once that loop works reliably: friends, nightlife-specific chats, shared pub crawls, personal recaps, and historical activity archives.</li>
            <li>The ticket economy and location-based passport stamps are longer-term concepts &mdash; only after the contribution system proves useful without artificial rewards.</li>
          </ul>
        </Section>

        <Section num="10" title="What I&rsquo;d build differently today">
          <p>I&rsquo;d start with an even narrower technical prototype: one nightlife area, a controlled venue dataset, bumps that reset nightly, and a small set of timestamped report types. That version would test the hardest assumptions &mdash; whether users understand the signals, whether the information stays fresh, and whether the map changes an actual decision &mdash; before investing in chats, feeds, rewards, or historical features. I&rsquo;d also define expiration and confidence rules before expanding the interface, because for WTM the credibility of the live data matters more than the number of features around it.</p>
        </Section>

        <CaseNav
          prev={{ to: '/projects/wordloot', lbl: 'Previous', label: <>&larr; WordLoot</> }}
          next={{ to: '/projects/simple-rents', lbl: 'Next project', label: <>Simple Rents &rarr;</> }}
        />
      </article>
    </>
  )
}
