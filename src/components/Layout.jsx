import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import SiteHeader from './SiteHeader'
import Footer from './Footer'

export default function Layout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const isWide = pathname === '/projects'

  // The projects page widens the column (was `body.wide` in the prototype).
  useEffect(() => {
    const root = document.getElementById('root')
    if (!root) return
    root.classList.toggle('wide', isWide)
    return () => root.classList.remove('wide')
  }, [isWide])

  // Scroll to top on navigation.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <SiteHeader defaultIntroOpen={isHome} />
      <Outlet />
      <Footer />
    </>
  )
}
