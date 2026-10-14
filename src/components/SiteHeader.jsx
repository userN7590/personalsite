import { Link, NavLink } from 'react-router-dom'

const NAV = [
  { to: '/projects', label: 'Projects' },
]

export default function SiteHeader() {
  return (
    <header className="topbar">
      <Link className="brand" to="/" aria-label="Filip Stopyra — home">
        <span className="brand-mark" aria-hidden="true">FS</span>
        <span className="brand-name">Filip Stopyra</span>
      </Link>
      <nav className="sitenav" aria-label="Sections">
        {NAV.map((item) => (
          <NavLink key={item.to} to={item.to}>{item.label}</NavLink>
        ))}
      </nav>
    </header>
  )
}
