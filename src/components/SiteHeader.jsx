import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useResume } from './ResumeViewer'

const RESUME = '/assets/Filip-Stopyra-Resume.pdf'

const NAV = [
  { to: '/projects', label: 'projects' },
  { to: '/experience', label: 'experience' },
  { to: '/changelog', label: 'changelog' },
]

// Heritage flags (Polish + American) — flags only, no text
function Flags() {
  return (
    <p className="flags" aria-label="Polish and American">
      <svg className="flag flag-pl" viewBox="0 0 32 20" role="img" aria-label="Poland">
        <rect width="32" height="10" fill="#ffffff" />
        <rect y="10" width="32" height="10" fill="#d4213d" />
      </svg>
      <svg className="flag flag-us" viewBox="0 0 38 20" role="img" aria-label="United States">
        <rect width="38" height="20" fill="#b22234" />
        <g fill="#ffffff">
          {[1.538, 4.615, 7.692, 10.769, 13.846, 16.923].map((y) => (
            <rect key={y} y={y} width="38" height="1.538" />
          ))}
        </g>
        <rect width="15.2" height="10.769" fill="#3c3b6e" />
        <g fill="#ffffff">
          {[1.7, 3.4, 5.1, 6.8, 8.5].map((cy, row) =>
            (row % 2 === 0 ? [2.5, 6.3, 10.1, 13.9] : [4.4, 8.2, 12]).map((cx) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r=".7" />
            ))
          )}
        </g>
      </svg>
    </p>
  )
}

export default function SiteHeader({ defaultIntroOpen = false, startHere = false }) {
  const [introOpen, setIntroOpen] = useState(defaultIntroOpen)
  const openResume = useResume()

  return (
    <header className={`topid${introOpen ? '' : ' intro-closed'}`}>
      <Link className="name" to="/">Filip Stopyra</Link>
      <p className="tagline">Software developer. Cleveland, Ohio.</p>
      <Flags />
      <p className="topemail">stopyrafilip1@gmail.com</p>
      <p className="toplinks">
        <a href="https://github.com/userN7590">github</a> ·{' '}
        <a href="https://www.linkedin.com/in/filipstopyra">linkedin</a> ·{' '}
        <a href={RESUME} onClick={openResume}>resume (pdf)</a>
      </p>

      <div className="intro-wrap">
        <div className="intro-collapse"><div className="intro-inner">
          <p className="lead">
            I&rsquo;m a software developer who likes building practical software around real
            problems &mdash; full-stack apps, backends, and the systems that hold them
            together, across app development and applied research.
          </p>
        </div></div>
        <button
          className="intro-toggle"
          type="button"
          aria-expanded={introOpen}
          aria-label={introOpen ? 'Collapse intro' : 'Expand intro'}
          onClick={() => setIntroOpen((v) => !v)}
        >
          <span className="chev">&#9662;</span>
        </button>
      </div>

      <nav className="sitenav" aria-label="Sections">
        {NAV.map((item, i) => (
          <span key={item.to} className={item.to === '/projects' ? 'nav-projects' : undefined}>
            <NavLink to={item.to}>{item.label}</NavLink>
            {startHere && item.to === '/projects' && (
              <span className="start-here" aria-hidden="true">
                <svg className="sh-arrow" width="26" height="30" viewBox="0 0 26 30" fill="none"
                     stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 29 C 13 20, 10.5 10, 13 2.5" />
                  <path d="M8 8 L 13 2 L 18 8" />
                </svg>
                <span className="sh-label">start here</span>
              </span>
            )}
            {i < NAV.length - 1 && <span className="sep">·</span>}
          </span>
        ))}
      </nav>
    </header>
  )
}
