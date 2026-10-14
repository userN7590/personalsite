import { Children, useCallback, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

// Categories on this page, in order. Feeds the section guide in the header.
const SECTIONS = [
  { id: 'products', num: 'A', title: <>Products &amp; Apps</>, count: 5 },
  { id: 'research', num: 'B', title: <>Research &amp; Internships</>, count: 1 },
  { id: 'servers', num: 'C', title: 'Game Servers', count: 1 },
]

function Card({ to, logo, name, status, statusLive, desc, tags, cta = 'Read case study' }) {
  return (
    <Link className="pcard" to={to}>
      <div className={`pcard-logo${logo.cluster ? ' mc-cluster' : ''}`}>{logo.node}</div>
      <div className="pcard-body">
        <div className="pcard-top">
          <h3>{name}</h3>
          {status && (statusLive
            ? <span className="st-wrap"><span className="dot-live" aria-hidden="true" /><span className="st live">{status}</span></span>
            : <span className="st">{status}</span>)}
        </div>
        <p className="pcard-desc">{desc}</p>
        <p className="pcard-tags">{tags}</p>
        <span className="pcard-cta">{cta} <span className="arw">&rarr;</span></span>
      </div>
    </Link>
  )
}

// Vertical "on this page" list; smooth-scrolls to a category (scroll-padding clears the sticky bar).
function Guide() {
  const go = (e, id) => {
    const el = document.getElementById(id)
    if (!el) return
    e.preventDefault()
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' })
  }
  return (
    <nav className="guide" aria-label="Sections on this page">
      <p className="guide-lbl">On this page</p>
      <ol>
        {SECTIONS.map((s) => (
          <li key={s.id}>
            <a href={`#${s.id}`} onClick={(e) => go(e, s.id)}>
              <span className="guide-num">{s.num}</span>
              <span className="guide-t">{s.title}</span>
              <span className="guide-c">{String(s.count).padStart(2, '0')}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

const FOLD_KEY = 'projects-expanded'
const readExpanded = () => { try { return sessionStorage.getItem(FOLD_KEY) === '1' } catch { return false } }

// Card grid that shows the first row, fades out through the second, and hides the
// rest behind a "show all" button. The cut follows the third card (the start of
// row two on desktop), so it adapts when the grid drops to one column.
function Fold({ children }) {
  const gridRef = useRef(null)
  const [state, setState] = useState(() => (readExpanded() ? 'open' : 'closed')) // closed | opening | open
  const [cut, setCut] = useState(null)   // { fade, end, full } in px
  const total = Children.count(children)

  useLayoutEffect(() => {
    const grid = gridRef.current
    const measure = () => {
      const c = grid.children[2]
      if (!c) { setCut(null); return }
      setCut({ fade: c.offsetTop + c.offsetHeight * 0.3, end: c.offsetTop + c.offsetHeight * 0.7, full: grid.scrollHeight })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(grid)
    return () => ro.disconnect()
  }, [])

  const expand = useCallback(() => {
    setState((s) => (s === 'closed' ? 'opening' : s))
    try { sessionStorage.setItem(FOLD_KEY, '1') } catch { /* private mode: just don't remember */ }
    setTimeout(() => setState('open'), 600) // also covers reduced motion, where no transition runs
  }, [])

  // keyboard users tabbing into a faded or hidden card get the full list
  const onFocus = (e) => {
    if (state !== 'closed') return
    const cards = [...gridRef.current.children]
    if (cards.indexOf(e.target.closest('.pcard')) >= 2) expand()
  }

  const closed = state === 'closed' && cut
  const style = closed
    ? { maxHeight: cut.end, '--fade': `${cut.fade}px`, '--end': `${cut.end}px` }
    : state === 'opening' && cut ? { maxHeight: cut.full } : undefined

  return (
    <div className={`fold${closed ? ' closed' : ''}`}>
      <div className="fold-clip" style={style} onFocus={onFocus}>
        <div className="cards" ref={gridRef}>{children}</div>
      </div>
      {closed && (
        <div className="fold-more">
          <button className="btn btn-ghost" type="button" onClick={expand}>
            Show all {total} projects <span className="ar">&darr;</span>
          </button>
        </div>
      )}
    </div>
  )
}

function Category({ id, num, title, count, fold, children }) {
  return (
    <section className="cat rule" id={id}>
      <h2 className="cat-h"><span className="cat-num">{num}</span><span className="cat-t">{title}</span><span className="cat-c">{count}</span></h2>
      {fold ? <Fold>{children}</Fold> : <div className="cards">{children}</div>}
    </section>
  )
}

export default function Projects() {
  return (
    <>
      <header className="page-head band has-guide">
        <div className="page-head-copy">
          <p className="kicker">Index</p>
          <h1>Projects</h1>
          <p className="page-sub">Products I&rsquo;ve built and run, research I&rsquo;ve done, and the game servers where it all started.</p>
        </div>
        <Guide />
      </header>

      <Category id="products" num="A" title={<>Products &amp; Apps</>} count="5 projects" fold>
        <Card
          to="/projects/rebilt"
          logo={{ node: <img src="/assets/logos/rebilt-logo-light.svg" alt="REBILT" /> }}
          name="REBILT"
          status="live"
          statusLive
          desc="A curated directory of independently built alternatives to the software people already use: open and indie remakes of tools like Figma, Airtable and Google Analytics, every listing checked and credited to its builder."
          tags="TypeScript · Next.js · Cloudflare Workers · D1 · Better Auth"
        />
        <Card
          to="/projects/wordloot"
          logo={{ node: <img src="/assets/logos/wordloot-logo.png" alt="WordLoot" /> }}
          name="WordLoot"
          status="live"
          statusLive
          desc={<>A word-prediction platform with accounts, a coin economy, scoring, ledgering, and crypto payment rails. A miniature fintech system disguised as a word game.</>}
          tags="Python · Supabase · PostgreSQL · Payments"
        />
        <Card
          to="/projects/stack-stats"
          logo={{ node: <img src="/assets/logos/stack-stats-mark.webp" alt="Stack Stats" /> }}
          name="Stack Stats"
          status="live"
          statusLive
          desc="A local-first VS Code extension and a public profile site that turn everyday coding into a developer profile: coding time, sessions, languages and streaks, including the work that never becomes a GitHub commit."
          tags="TypeScript · VS Code API · Next.js · Supabase · PKCE auth"
        />
        <Card
          to="/projects/wtm"
          logo={{ node: <img src="/assets/logos/wtm-logo.png" alt="What's The Move" /> }}
          name={<>What&rsquo;s The Move</>}
          status="expected release q4 2026"
          desc={<>A map-first nightlife app answering one question: where is everyone going tonight? Anonymous map browsing, venue details, community reports on current conditions, and &ldquo;bumps&rdquo; for where you plan to go.</>}
          tags="React Native · Expo · Mapbox · Supabase · PostGIS"
        />
        <Card
          to="/projects/simple-rents"
          logo={{ node: <img src="/assets/logos/rents-logo.png" alt="Simple Rents" /> }}
          name="Simple Rents"
          status="in beta testing"
          desc={<>Property-management software built from real rental operations. Properties, units, leases, tenants, maintenance, and payments on one operational calendar.</>}
          tags="React · TypeScript · AWS · PostgreSQL"
        />
      </Category>

      <Category id="research" num="B" title={<>Research &amp; Internships</>} count="1 project">
        <Card
          to="/projects/aire"
          logo={{ node: (
            <span className="aire-marks">
              <img className="nsf" src="/assets/logos/nsf.png" alt="National Science Foundation" />
              <img className="mc-swap-dark osc" src="/assets/logos/osc-logo.svg" alt="Ohio Supercomputer Center" />
            </span>
          ) }}
          name="Ohio Supercomputer Center"
          status="ml research intern"
          desc={<>An NSF-funded machine-learning research internship (AIRE &rsquo;25) detecting AI-generated and manipulated images. My focus: evaluation and generalization &mdash; does a detector still work on data it has never seen?</>}
          tags="Python · Computer Vision · ML · Evaluation"
        />
      </Category>

      <Category id="servers" num="C" title="Game Servers" count="where it started">
        <Card
          to="/projects/minecraft"
          logo={{ cluster: true, node: (
            <span className="mc-row">
              <img src="/assets/logos/mc-tnt.webp" alt="Blitz Raids TNT" />
              <img src="/assets/logos/mc-blitz-bolt.png" alt="Blitz bolt" />
              <img src="/assets/logos/mc-atlas-a.png" alt="A server mark" />
              <img className="mc-swap-dark" src="/assets/logos/mc-apollo-meteor.png" alt="Apollo Realms" />
              <img src="/assets/logos/mc-riverside.png" alt="Riverside" />
            </span>
          ) }}
          name="Server development"
          status="self-taught"
          desc={<>Years running large multiplayer servers &mdash; custom plugins, game economies, infrastructure, payments, and real communities. My first startup, basically.</>}
          tags="Java · Game Systems · Economy · Community"
        />
      </Category>
    </>
  )
}
