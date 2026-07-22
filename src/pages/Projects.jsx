import { Link } from 'react-router-dom'

function Card({ to, logo, name, status, statusLive, desc, tags }) {
  return (
    <Link className="pcard" to={to}>
      <div className={`pcard-logo${logo.cluster ? ' mc-cluster' : ''}`}>{logo.node}</div>
      <div className="pcard-body">
        <div className="pcard-top">
          <h3>{name}</h3>
          <span className={`st${statusLive ? ' live' : ''}`}>{status}</span>
        </div>
        <p className="pcard-desc">{desc}</p>
        <p className="pcard-tags">{tags}</p>
        <span className="pcard-cta">Read case study <span className="arw">&rarr;</span></span>
      </div>
    </Link>
  )
}

export default function Projects() {
  return (
    <>
      <h1 className="page-title"><span className="t">Projects</span></h1>

      {/* Products & Apps */}
      <section className="cat">
        <h2 className="cat-h"><span className="cat-num">A</span><span className="cat-t">Products &amp; Apps</span><span className="cat-c">3 projects</span></h2>
        <div className="cards">
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
        </div>
      </section>

      {/* Research */}
      <section className="cat">
        <h2 className="cat-h"><span className="cat-num">B</span><span className="cat-t">Research &amp; Internships</span><span className="cat-c">1 project</span></h2>
        <div className="cards">
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
        </div>
      </section>

      {/* Game Servers */}
      <section className="cat">
        <h2 className="cat-h"><span className="cat-num">C</span><span className="cat-t">Game Servers</span><span className="cat-c">where it started</span></h2>
        <div className="cards">
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
        </div>
      </section>
    </>
  )
}
