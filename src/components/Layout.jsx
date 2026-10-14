import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import SiteHeader from './SiteHeader'
import Footer from './Footer'
import MiniGolf from './MiniGolf'

export default function Layout() {
  const { pathname } = useLocation()

  // Scroll to top on navigation.
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])

  // Every external (http) link opens in a new tab. Runs after each navigation so
  // it covers newly-rendered pages and any links added later; internal router
  // links (relative hrefs) are left untouched.
  useEffect(() => {
    document.querySelectorAll('a[href^="http"]').forEach((a) => {
      a.setAttribute('target', '_blank')
      a.setAttribute('rel', 'noopener noreferrer')
    })
  }, [pathname])

  // The frame draws the two full-height rails; every page is a stack of
  // full-width bands inside it, so their hairlines meet the rails exactly.
  return (
    <>
      <div className="frame">
        <SiteHeader />
        <main className="main">
          <Outlet />
        </main>
        <Footer />
      </div>
      <MiniGolf />
    </>
  )
}
