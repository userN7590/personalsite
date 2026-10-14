import { Link } from 'react-router-dom'
import DotLogo from '../components/DotLogo'

// Heritage flags (Polish + American) — flags only, no text
function Flags() {
  return (
    <span className="flags" aria-label="Polish and American">
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
    </span>
  )
}

export default function Home() {
  return (
    <section className="hero band">
      <div className="hero-copy">
        <p className="kicker">
          <span>Cleveland, Ohio</span>
          <Flags />
        </p>
        <h1 className="hero-title">Filip Stopyra</h1>
        <p className="hero-lead">
          I like building things and putting them out there. Right now that&rsquo;s a directory
          of indie software, a word game with its own coin economy, and a coding tracker for
          VS&nbsp;Code. It all started with running Minecraft servers.
        </p>
        <div className="hero-cta">
          <Link className="btn btn-primary" to="/projects">View projects <span className="ar r">&rarr;</span></Link>
        </div>
        <ul className="hero-links">
          <li><a className="email" href="mailto:stopyrafilip1@gmail.com">stopyrafilip1@gmail.com</a></li>
          <li><a href="https://github.com/userN7590">GitHub</a></li>
          <li><a href="https://www.linkedin.com/in/filipstopyra">LinkedIn</a></li>
        </ul>
      </div>
      <DotLogo />
    </section>
  )
}
