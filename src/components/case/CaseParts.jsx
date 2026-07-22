import { Link } from 'react-router-dom'

export function Backlink() {
  return (
    <Link className="backlink" to="/projects"><span className="arw">&larr;</span> Projects</Link>
  )
}

export function Section({ num, title, children }) {
  return (
    <section className="cs">
      <h2 className="cs-h"><span className="cs-num">{num}</span><span className="cs-t">{title}</span></h2>
      {children}
    </section>
  )
}

export function Challenge({ n, q, children }) {
  return (
    <div className="challenge">
      <p className="ch-q"><span className="n">{n}</span> {q}</p>
      {children}
    </div>
  )
}

export function Tradeoff({ q, children }) {
  return (
    <div className="tradeoff">
      <p className="td-q">{q}</p>
      {children}
    </div>
  )
}

// One entity box for the ERD diagrams. `fields` is [label, type, isKey?].
export function Ent({ name, fields }) {
  return (
    <div className="ent">
      <div className="ent-h">{name}</div>
      <ul>
        {fields.map(([fld, ty, key], i) => (
          <li className={key ? 'key' : undefined} key={i}>
            <span className="fld">{fld}</span><span className="ty">{ty}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// prev / next: { to, label, lbl }
export function CaseNav({ prev, next }) {
  return (
    <nav className="casenav" aria-label="More projects">
      {prev && <Link className="prev" to={prev.to}><span className="lbl">{prev.lbl}</span>{prev.label}</Link>}
      {next && <Link className="next" to={next.to}><span className="lbl">{next.lbl}</span>{next.label}</Link>}
    </nav>
  )
}
