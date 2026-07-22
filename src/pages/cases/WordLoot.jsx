import { Backlink, Section, Challenge, Tradeoff, Ent, CaseNav } from '../../components/case/CaseParts'
import Carousel from '../../components/Carousel'

export default function WordLoot() {
  return (
    <>
      <Backlink />
      <article className="case">
        <div className="case-head">
          <span className="logo-float logo-lg">
            <img className="logo-dark" src="/assets/logos/wordloot-logo.png" alt="WordLoot" />
            <img className="logo-light" src="/assets/logos/wordloot-logo-ink.png" alt="WordLoot" />
          </span>
          <span className="case-kicker">Products &amp; Apps</span>
          <div className="case-status">
            <span className="st-wrap"><span className="dot-live" aria-hidden="true"></span><span className="st live">live</span></span>
            <span className="sep">·</span>
            <span className="case-url">wordloot.xyz</span>
          </div>
          <p className="case-summary">WordLoot is a real-money word-prediction platform: players hold a coin balance, bet on a daily word round, and cash out in crypto. I built the backend that makes that safe to do &mdash; the scoring engine, the payout infrastructure, the balance ledger, and the round-generation system. In effect it&rsquo;s a small fintech system wearing a word game as a costume.</p>
          <p className="case-tags">Python · Supabase · PostgreSQL · Payments infrastructure · Economy design · Backend engineering</p>
          <div className="case-btns">
            <a className="btn btn-primary" href="https://wordloot.xyz">Visit site <span className="ar">&#8599;</span></a>
            <a className="btn btn-ghost" href="https://wiki.wordloot.xyz">Documentation <span className="ar">&#8599;</span></a>
          </div>
        </div>

        <Carousel slides={[
          { node: <img src="/assets/projects/wordloot.png" alt="WordLoot daily round — word entry, bet slider, current pot, place bet" />,
            caption: 'The daily round — pick a word, size your bet, watch the pot and timer.' },
        ]} />

        <Section num="01" title="Problem">
          <p>Building a word game is easy. Building a <em>fair, auditable, real-money economy</em> underneath one is not. The moment players can deposit and withdraw real value, every coin has to be accounted for, every payout has to be defensible, and the platform has to stay solvent no matter how a round resolves.</p>
          <p>So the real problem was never &ldquo;make a guessing game.&rdquo; It was: how do you move money in and out, keep balances correct to the coin, and resolve rounds in a way you could explain to a skeptical user &mdash; all as a solo developer?</p>
        </Section>

        <Section num="02" title="Product overview">
          <p>Each day a round opens with a countdown. A player picks a word, sizes a bet against their coin balance, and the potential payout updates live against the current pot. When the round closes, the scoring engine resolves every bet, distributes the pot to winners, and updates balances. Players can top up and cash out in crypto.</p>
          <ul className="dot">
            <li><b>Daily rounds</b> &mdash; time-boxed entry, live pot, automatic resolution.</li>
            <li><b>Coin economy</b> &mdash; a single balance players bet, win, and withdraw from.</li>
            <li><b>Crypto in / out</b> &mdash; deposits and payouts settled on-chain.</li>
            <li><b>Auditable scoring</b> &mdash; deterministic resolution so outcomes can be checked.</li>
          </ul>
        </Section>

        <Section num="03" title="Technical architecture">
          <p>A web client talks to a Python backend that owns all the money logic. Supabase provides auth and a managed PostgreSQL database; a payments layer bridges the coin balance to crypto deposits and withdrawals.</p>
          <div className="arch">
            <div className="arch-tier"><div className="arch-box"><b>Web client</b><span>wordloot.xyz · round UI, wallet</span></div></div>
            <div className="arch-conn"></div>
            <div className="arch-tier"><div className="arch-box hl"><b>Python backend</b><span>round generation · scoring · payout engine · ledger</span></div></div>
            <div className="arch-conn"></div>
            <div className="arch-tier">
              <div className="arch-box"><b>Supabase Auth</b><span>accounts · sessions</span></div>
              <div className="arch-box"><b>PostgreSQL</b><span>balances · ledger · rounds · bets</span></div>
              <div className="arch-box"><b>Payments</b><span>crypto deposits &amp; payouts</span></div>
            </div>
            <p className="arch-note">The backend is the only thing allowed to move coins — the client never writes balances directly.</p>
          </div>
        </Section>

        <Section num="04" title="Data model">
          <p>The system is organized around money movement, so the core entities are an account, an append-only ledger, and the rounds and bets that drive it.</p>
          <div className="erd">
            <Ent name="users" fields={[['id', 'pk', true], ['email', 'text'], ['balance', 'int']]} />
            <Ent name="ledger" fields={[['id', 'pk', true], ['user_id', 'fk'], ['delta', 'int'], ['reason', 'enum']]} />
            <Ent name="rounds" fields={[['id', 'pk', true], ['opens_at', 'ts'], ['pot', 'int'], ['status', 'enum']]} />
            <Ent name="bets" fields={[['id', 'pk', true], ['user_id', 'fk'], ['round_id', 'fk'], ['stake / payout', 'int']]} />
          </div>
          <p className="erd-rel">The <b>ledger</b> is append-only &mdash; it&rsquo;s the source of truth, and a user&rsquo;s balance is the sum of their entries. Deposits, bets, winnings, and withdrawals are all just rows with a <code>reason</code>, which makes every coin traceable back to the event that created it.</p>
        </Section>

        <Section num="05" title="Technical challenges">
          <Challenge n="01" q="Keeping balances correct to the coin">
            <p>A mutable &ldquo;balance&rdquo; column is easy to corrupt &mdash; a half-finished payout or a double-processed event and the number is silently wrong. I moved the source of truth to an append-only ledger: balance is derived from entries, never edited in place, so the history is always reconstructable and reconcilable.</p>
          </Challenge>
          <Challenge n="02" q="Resolving rounds you can defend">
            <p>Payouts had to be deterministic: the same round inputs always produce the same outcome and the same distribution of the pot. That made resolution testable and gave me something I could point at if a player ever asked &ldquo;why did I lose?&rdquo;</p>
          </Challenge>
          <Challenge n="03" q="Real money crossing a boundary">
            <p>Crypto deposits and withdrawals live outside the database. The hard part was reconciling on-chain events with internal balances exactly once &mdash; no double credits, no lost deposits &mdash; and treating every credit as a ledger entry rather than a direct balance write.</p>
          </Challenge>
          <Challenge n="04" q="Staying solvent">
            <p>Payouts are bounded by what&rsquo;s actually in the pot, so the platform can&rsquo;t pay out money it doesn&rsquo;t hold. Getting that invariant right under all round outcomes was as much accounting as engineering.</p>
          </Challenge>
        </Section>

        <Section num="06" title="Design decisions & tradeoffs">
          <Tradeoff q="Supabase instead of a hand-rolled backend">
            <p>As a solo dev I needed auth, a real Postgres database, and an API surface without standing up infrastructure for each. The tradeoff is vendor coupling and less control over the lowest layers &mdash; acceptable for getting a correct product live.</p>
          </Tradeoff>
          <Tradeoff q="Crypto payments instead of card rails">
            <p>Card processors are difficult for anything that looks like betting. Crypto sidesteps that and settles globally; the cost is a steeper UX and the custody/handling considerations that come with it.</p>
          </Tradeoff>
          <Tradeoff q="Append-only ledger instead of mutable balances">
            <p>More moving parts up front, but it buys auditability, easy reconciliation, and the ability to explain any balance. For a money system that&rsquo;s the right trade.</p>
          </Tradeoff>
        </Section>

        <Section num="07" title="Launch & updates">
          <article className="log-entry">
            <div className="log-meta"><span className="log-date">May 1, 2026</span><span className="dot">·</span><span className="log-proj">Launch</span></div>
            <h3 className="log-title">Public release</h3>
            <ul>
              <li>Initial rounds ran cleanly end to end &mdash; the round system proved reproducible day after day without manual intervention.</li>
              <li>100+ sign-ups in the first month.</li>
              <li>Thousands of coins bet across daily rounds.</li>
              <li>Dozens of successful deposit and withdrawal transactions with zero ledger discrepancies.</li>
            </ul>
          </article>
          <article className="log-entry">
            <div className="log-meta"><span className="log-date">In progress</span><span className="dot">·</span><span className="log-proj">Reboot</span></div>
            <h3 className="log-title">WordLoot 2.0</h3>
            <ul>
              <li>Rebuilding toward a rerelease: a native app version alongside the web client.</li>
              <li>Credit / debit card deposits and withdrawals in addition to crypto.</li>
              <li>Design refinements across the round, wallet, and results screens.</li>
            </ul>
          </article>
        </Section>

        <Section num="08" title="Lessons learned">
          <ul className="dot">
            <li>The economy <em>is</em> the product. The game is the surface; the ledger and payout integrity are what actually had to be right.</li>
            <li>Model money as accounting, not CRUD &mdash; invariants and immutable history beat clever balance updates every time.</li>
            <li>Auditability is cheaper to build in from the start than to bolt on after the first dispute.</li>
          </ul>
        </Section>

        <Section num="09" title="Future improvements">
          <ul className="dot">
            <li>Automated reconciliation and monitoring that flags any drift between the ledger and on-chain balances.</li>
            <li>More round formats and an admin / analytics view over rounds and payouts.</li>
            <li>A formal test suite around the payout math, including replay of historical rounds.</li>
          </ul>
        </Section>

        <Section num="10" title="What I&rsquo;d build differently today">
          <p>I&rsquo;d start from the append-only ledger and its invariants on day one instead of evolving into them, and I&rsquo;d stand up a staging environment that can replay payout logic against real round data before anything touches production. Most of what I&rsquo;d change is about making the money path provably correct earlier, not about the game itself.</p>
        </Section>

        <CaseNav
          prev={{ to: '/projects', lbl: 'Back to', label: 'All projects' }}
          next={{ to: '/projects/wtm', lbl: 'Next project', label: <>What&rsquo;s The Move &rarr;</> }}
        />
      </article>
    </>
  )
}
