import { useState } from 'react'

function Figure({ project }) {
  if (project.image) {
    return (
      <>
        <img src={project.image} alt={project.alt} style={project.imgStyle} />
        {project.tag && <span className="frame-tag">{project.tag}</span>}
      </>
    )
  }
  // Intentional neutral fallback when there's no screenshot yet:
  // a quiet typographic label plate rather than a "missing image" box.
  return <span className="slot-ph">{project.fallback || project.name}</span>
}

function Plugins() {
  const [open, setOpen] = useState(false)
  const list = [
    ['Economy & shops', 'currency, player markets, balances'],
    ['Ranks & permissions', 'custom tiers, prefixes'],
    ['Moderation tools', 'punishments, logging, anti-grief'],
    ['Minigame framework', 'arenas, queues, scoring'],
    ['Discord integration', 'chat relay, linked accounts'],
    ['Cosmetics & perks', 'donor rewards, monetization'],
  ]
  return (
    <div className={`plugins${open ? ' open' : ''}`}>
      <button
        className="plugins-toggle"
        type="button"
        aria-expanded={open}
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v) }}
      >
        Plugins &amp; systems I built <span className="count">({list.length})</span>{' '}
        <span className="chev">&#9662;</span>
      </button>
      <div className="plugins-collapse"><div className="plugins-inner">
        <ul className="plain">
          {list.map(([name, loc]) => (
            <li key={name}>{name} <span className="loc">{loc}</span></li>
          ))}
        </ul>
      </div></div>
    </div>
  )
}

function Project({ project, isOpen, onToggle }) {
  // Toggle when clicking the figure, head, or the "continue reading" button —
  // but not when clicking a link or the nested plugins control.
  const handleToggle = (e) => {
    if (e.target.closest('a') || e.target.closest('.plugins')) return
    onToggle()
  }

  return (
    <article className={`proj${isOpen ? ' open' : ''}`} id={project.id}>
      <div className={`proj-figure${project.image ? '' : ' placeholder'}`} onClick={handleToggle}>
        <Figure project={project} />
      </div>
      <div className="proj-text">
        <div className="proj-head" onClick={handleToggle}>
          <h3>
            {project.logo && (
              <img className={`plogo${project.logoPin ? ' pin' : ''}`} src={project.logo} alt="" />
            )}
            {project.name}
          </h3>
          <span className={`st${project.live ? ' live' : ''}`}>{project.status}</span>
        </div>
        <div className="proj-body">
          {project.body}
          {project.plugins && <Plugins />}
          <p className="meta">{project.meta}</p>
        </div>
        <button className="proj-more" type="button" onClick={handleToggle}>
          <span className="more-label">Continue reading</span>
          <span className="less-label">Show less</span>
          <span className="arw">&#8595;</span>
        </button>
      </div>
    </article>
  )
}

const PROJECTS = [
  {
    id: 'wordloot',
    name: 'WordLoot',
    status: 'live · wordloot.xyz',
    live: true,
    image: '/assets/projects/wordloot.png',
    alt: 'WordLoot daily word-prediction game',
    tag: 'live',
    logo: '/assets/logos/wordloot-mark.png',
    body: (
      <>
        <p>Built a daily word-prediction game backed by a full account and virtual-economy system &mdash; user accounts, coin balances, a scoring engine, automated round generation, and a transaction ledger.</p>
        <p>The hard part wasn&rsquo;t the game &mdash; it was the systems underneath it. I designed the scoring logic, the balance ledger, and the reconciliation infrastructure that keep the in-game economy fair, auditable, and consistent at scale. It&rsquo;s effectively a small fintech backend disguised as a word game.</p>
      </>
    ),
    meta: (
      <>
        Python · Supabase · PostgreSQL · Ledger &amp; Transactions · Economy Design · Backend Engineering&nbsp;|&nbsp;
        <a href="https://wordloot.xyz">Visit&nbsp;&#8599;</a>&nbsp;·&nbsp;
        <a href="https://wiki.wordloot.xyz">Documentation&nbsp;&#8599;</a>
      </>
    ),
  },
  {
    id: 'rentalcrm',
    name: 'RentalCRM',
    status: 'in progress',
    fallback: 'RentalCRM',
    body: (
      <>
        <p>Property-management software built from real rental operations. Manage units, leases, maintenance requests, tenant communication, and property performance in one place.</p>
        <p>I grew up helping manage rentals, so I started with the operational pain points instead of a feature checklist. The goal is simple: replace the spreadsheets, text messages, and scattered documents that small landlords use today with a workflow that actually reflects how properties are managed.</p>
      </>
    ),
    meta: 'Python · PostgreSQL · Operations Software · Real Estate',
  },
  {
    id: 'wtm',
    name: 'What’s The Move (WTM)',
    status: 'in progress',
    image: '/assets/projects/wtm.png',
    alt: "What's The Move — map-first nightlife app",
    imgStyle: { objectPosition: 'center top' },
    tag: 'preview',
    logo: '/assets/logos/wtm-mark.png',
    logoPin: true,
    body: (
      <>
        <p>A nightlife discovery app built around a simple question: where is everyone actually going tonight?</p>
        <p>Instead of endless scrolling, WTM uses a live map powered by community activity and venue reports to surface what&rsquo;s happening right now. The project combines maps, real-time data, social features, and local discovery into a single experience designed for nights out.</p>
      </>
    ),
    meta: 'React Native · Maps · Supabase · Real-Time Systems · Location Data',
  },
  {
    id: 'aire',
    name: 'AIRE — fake-image detection',
    status: 'internship / research',
    fallback: 'AIRE · Research',
    body: (
      <>
        <p>Research internship focused on detecting AI-generated and manipulated images using out-of-distribution detection techniques and computer vision models.</p>
        <p>My work focused on evaluation and generalization &mdash; building testing pipelines that measure whether a detector works on new datasets rather than simply performing well on the data it was trained against.</p>
      </>
    ),
    meta: 'Python · Computer Vision · Machine Learning · Evaluation',
  },
  {
    id: 'minecraft',
    name: 'Minecraft server development',
    status: 'where it started',
    fallback: 'Minecraft Servers',
    plugins: true,
    body: (
      <>
        <p>Before building apps and software products, I spent years running large multiplayer Minecraft servers. That meant building plugins, designing game economies, managing infrastructure, handling payments, and maintaining communities with real users.</p>
        <p>Looking back, it was my first startup. Every system had to be balanced, every update had to keep players engaged, and every mistake was immediately reflected in player retention. Most of the product and engineering instincts I use today started here.</p>
      </>
    ),
    meta: 'Java · Game Systems · Economy Design · Community Management',
  },
]

export default function Projects() {
  const [openId, setOpenId] = useState(null)

  return (
    <>
      <h1 className="page-title"><span className="num">01</span><span className="t">Projects</span></h1>
      <p className="page-sub">A written archive, not a portfolio. Open one to read the full story.</p>

      <div className="projects">
        {PROJECTS.map((project) => (
          <Project
            key={project.id}
            project={project}
            isOpen={openId === project.id}
            onToggle={() => setOpenId((cur) => (cur === project.id ? null : project.id))}
          />
        ))}
      </div>
    </>
  )
}
