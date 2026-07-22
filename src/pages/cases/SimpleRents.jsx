import { Backlink, Section, Challenge, Tradeoff, Ent, CaseNav } from '../../components/case/CaseParts'

export default function SimpleRents() {
  return (
    <>
      <Backlink />
      <article className="case">
        <div className="case-head">
          <span className="logo-float logo-lg">
            <img className="logo-dark" src="/assets/logos/rents-logo.png" alt="Simple Rents" />
            <img className="logo-light" src="/assets/logos/rents-logo-ink.png" alt="Simple Rents" />
          </span>
          <span className="case-kicker">Products &amp; Apps</span>
          <div className="case-status">
            <span className="st-wrap"><span className="dot-wip" aria-hidden="true"></span><span className="st">in beta testing</span></span>
            <span className="sep">·</span>
            <span className="st">real users on real portfolios</span>
          </div>
          <p className="case-summary">Simple Rents is property-management software I&rsquo;m building for small, independent landlords who have outgrown spreadsheets but don&rsquo;t need enterprise software. It organizes properties, units, leases, tenants, maintenance, documents, and finances into one address-first dashboard &mdash; the command center a small landlord actually needs, instead of the spreadsheets and group texts they use today. It&rsquo;s under active development.</p>
          <p className="case-tags">React · TypeScript · AWS · PostgreSQL · Amazon Cognito · Amazon S3</p>
        </div>

        <Section num="01" title="Problem">
          <p>Small landlords don&rsquo;t run on software &mdash; they run on a spreadsheet, a notebook, and a thread of text messages. Rent dates, lease renewals, maintenance requests, inspections, move-ins and move-outs all live in someone&rsquo;s head. A single missed renewal or forgotten rent-due is real money and real risk.</p>
          <p>Most existing platforms answer this with more features, heavier setup, and workflows built for professional management companies &mdash; the opposite of what a small landlord needs. I grew up helping manage rentals, so I started from those operational pain points rather than a feature checklist. The goal is narrow and concrete: one organized place to understand a portfolio and stay ahead of what needs attention.</p>
        </Section>

        <Section num="02" title="Product overview">
          <p>A landlord lands on a dashboard that gives a quick read of the whole portfolio &mdash; occupancy, rental income, expenses, upcoming events, and maintenance activity. Properties are presented address-first: open one to manage its units, leases, documents, financial records, and maintenance history. Underneath sits an operational calendar where the things an operator has to stay ahead of all land on one timeline &mdash; rent received and rent due, maintenance, lease starts and expiries, renewal reminders, inspections, and money deadlines like utilities, HOA, insurance, and taxes &mdash; color-coded by property and filterable by event type.</p>
          <ul className="dot">
            <li><b>Portfolio dashboard</b> &mdash; occupancy, income, expenses, upcoming events, and maintenance at a glance.</li>
            <li><b>Address-first properties</b> &mdash; each property opens to its units, leases, documents, finances, and maintenance.</li>
            <li><b>Portfolio model</b> &mdash; Properties &rarr; Units &rarr; Leases &rarr; Tenants, all linked.</li>
            <li><b>Operational calendar</b> &mdash; rent, maintenance, leases, and deadlines in one filterable timeline.</li>
          </ul>
          <p>The first version focuses on the daily work of landlords managing roughly 1&ndash;50 units &mdash; not every possible property-management feature.</p>
        </Section>

        <Section num="03" title="Technical architecture">
          <p>The app is a React and TypeScript frontend backed by AWS-managed services. The diagram below is the <em>planned</em> production architecture &mdash; the shape I&rsquo;m building toward, designed to stay inexpensive while usage is low and scale as the product grows. Each landlord account keeps its own portfolio data and uploaded documents isolated.</p>
          <div className="arch">
            <div className="arch-tier"><div className="arch-box hl"><b>React + TypeScript app</b><span>dashboard · properties · leases · finances · documents</span></div></div>
            <div className="arch-conn"></div>
            <div className="arch-tier">
              <div className="arch-box"><b>Amazon Cognito</b><span>authentication &amp; accounts</span></div>
              <div className="arch-box"><b>Amazon CloudFront</b><span>frontend assets &amp; file delivery</span></div>
            </div>
            <div className="arch-conn"></div>
            <div className="arch-tier"><div className="arch-box hl"><b>AWS API layer</b><span>application logic · portfolio rules · access control</span></div></div>
            <div className="arch-conn"></div>
            <div className="arch-tier">
              <div className="arch-box"><b>PostgreSQL</b><span>properties · units · leases · maintenance · finances</span></div>
              <div className="arch-box"><b>Amazon S3</b><span>leases · receipts · images · documents</span></div>
            </div>
          </div>
        </Section>

        <Section num="04" title="Data model">
          <p>Everything hangs off a property. The hierarchy &mdash; property, unit, lease, tenant &mdash; is what lets the system generate the right events for the right place at the right time. Keeping properties and units separate lets the same model support a single-family rental and a multi-unit building without two different workflows.</p>
          <div className="erd">
            <Ent name="properties" fields={[['id', 'pk', true], ['name', 'text'], ['color', 'text']]} />
            <Ent name="units" fields={[['id', 'pk', true], ['property_id', 'fk'], ['label', 'text']]} />
            <Ent name="leases" fields={[['id', 'pk', true], ['unit_id', 'fk'], ['start / end', 'date'], ['rent', 'int']]} />
            <Ent name="tenants" fields={[['id', 'pk', true], ['lease_id', 'fk'], ['name', 'text']]} />
            <Ent name="maintenance" fields={[['id', 'pk', true], ['unit_id', 'fk'], ['status', 'enum']]} />
            <Ent name="payments" fields={[['id', 'pk', true], ['lease_id', 'fk'], ['due / paid', 'date']]} />
          </div>
          <p className="erd-rel">Calendar events aren&rsquo;t hand-entered &mdash; they&rsquo;re <b>derived</b> from these records. A lease&rsquo;s term produces rent-due dates and a renewal reminder; a maintenance row produces a request event; a payment produces &ldquo;rent received.&rdquo; Change the underlying data and the calendar stays correct.</p>
        </Section>

        <Section num="05" title="Technical challenges">
          <Challenge n="01" q="Modeling real-estate reality">
            <p>A lease ties a tenant to a unit for a term with a rent schedule, then renews, ends, or turns over. Getting the property &rarr; unit &rarr; lease &rarr; tenant relationships right was the foundation &mdash; everything the calendar shows depends on that structure being faithful to how rentals actually work.</p>
          </Challenge>
          <Challenge n="02" q="Turning records into a timeline">
            <p>Rent-due dates, lease milestones, and reminders are generated from the data rather than entered by hand. That keeps the calendar trustworthy, but it means the event-generation logic has to handle recurring schedules and edge cases like mid-term changes.</p>
          </Challenge>
          <Challenge n="03" q="Keeping a portfolio readable">
            <p>A full portfolio on one calendar becomes noise fast. Color-coding by property and filtering by event type (payments, leases &amp; tenants, maintenance, inspections) is what keeps it a tool instead of a wall of dots.</p>
          </Challenge>
          <Challenge n="04" q="Importing imperfect data">
            <p>Landlord records are rarely clean &mdash; addresses, tenant details, lease dates, and expenses live across multiple spreadsheets and documents. The hard part is an import process that accepts imperfect information without forcing every landlord into one rigid format.</p>
          </Challenge>
          <Challenge n="05" q="One model, two property types">
            <p>A single-family home and a multi-unit building have different structures, but a landlord shouldn&rsquo;t have to learn two systems. The data model and the setup flow have to cover both while staying understandable.</p>
          </Challenge>
        </Section>

        <Section num="06" title="Design decisions & tradeoffs">
          <Tradeoff q="AWS over an all-in-one hosted backend">
            <p>Using AWS is more infrastructure work than leaning on a single all-in-one platform. I chose it for direct experience with production cloud architecture and more control over auth, file storage, databases, permissions, and future scaling. The tradeoff is a slower initial build and more operational responsibility.</p>
          </Tradeoff>
          <Tradeoff q="Address-first organization">
            <p>Properties show up as recognizable places, not abstract records. Address, occupancy, rent, costs, and upcoming activity lead because that&rsquo;s how small landlords actually think about their portfolios.</p>
          </Tradeoff>
          <Tradeoff q="Derived events instead of manual entries">
            <p>More modeling work up front, but the calendar can never drift out of sync with the underlying leases and payments. Correctness beats the quick win of letting people type in events.</p>
          </Tradeoff>
          <Tradeoff q="Focused initial scope">
            <p>Tenant portals, automated messaging, portfolio scoring, and deeper analytics are valuable, but shipping all of them first would make the product slower to finish and harder to learn. The first release prioritizes properties, leases, maintenance, finances, documents, and reminders.</p>
          </Tradeoff>
        </Section>

        <Section num="07" title="Where it stands">
          <p>Simple Rents is in beta &mdash; a working build is in the hands of its first real users, so the focus right now is validation, not growth. My parents are running their actual portfolio through it day to day, which surfaces real-world bugs and workflow gaps faster than any test plan would:</p>
          <ul className="dot">
            <li>10+ units actively managed by my parents in the beta.</li>
            <li>A potential second early portfolio of roughly 15 units.</li>
            <li>Support targeted at landlords managing 1&ndash;50 units.</li>
            <li>Real landlord spreadsheets and workflows informing every decision.</li>
          </ul>
          <p>The first real measure of success is simple: whether these landlords can replace parts of their spreadsheet-based workflow with the app.</p>
        </Section>

        <Section num="08" title="Lessons learned">
          <ul className="dot">
            <li>The domain model is most of the product &mdash; once the property/unit/lease/tenant shape is right, features fall out of it.</li>
            <li>A good calendar is a <em>view</em>; the data is the real asset. Generate, don&rsquo;t store, what you can derive.</li>
            <li>A technically clean system still fails if getting data into it means reorganizing your whole business first &mdash; designing around imperfect data matters as much as the model.</li>
            <li>It&rsquo;s given me hands-on experience with cloud architecture, relational modeling, account-level security, document storage, and the cost tradeoffs of managed infrastructure.</li>
          </ul>
        </Section>

        <Section num="09" title="Future improvements">
          <ul className="dot">
            <li>Flexible spreadsheet and document importing for messy real-world records.</li>
            <li>Tenant accounts and self-service portals.</li>
            <li>Automated rent and lease reminders, with reconciliation against the lease schedule.</li>
            <li>Portfolio and property health scores, plus deeper financial reporting.</li>
            <li>Maintenance communication and photo tracking.</li>
            <li>English and Polish localization.</li>
          </ul>
          <p>These get added based on actual landlord usage &mdash; not treated as launch requirements.</p>
        </Section>

        <Section num="10" title="What I&rsquo;d build differently today">
          <p>Simple Rents is still early enough that big decisions can change before they get expensive, and right now I&rsquo;m mostly guarding against premature complexity &mdash; especially around analytics, messaging, automation, and tenant-facing features. I&rsquo;d also lock the lease and rent-schedule model down earlier, since so much of the calendar derives from it. And if early testing shows I modeled a landlord&rsquo;s workflow wrong, I&rsquo;d rather simplify or restructure than keep an architecture just because it&rsquo;s already built. The goal isn&rsquo;t the biggest property platform &mdash; it&rsquo;s one small landlords actually keep using.</p>
        </Section>

        <CaseNav
          prev={{ to: '/projects/wtm', lbl: 'Previous', label: <>&larr; What&rsquo;s The Move</> }}
          next={{ to: '/projects/aire', lbl: 'Next project', label: <>AIRE &rarr;</> }}
        />
      </article>
    </>
  )
}
