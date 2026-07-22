import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import SiteHeader from './SiteHeader'
import Footer from './Footer'
import { ResumeProvider } from './ResumeViewer'
import PuttGame from './PuttGame'

export default function Layout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const isProjectsIndex = pathname === '/projects'
  const isCase = pathname.startsWith('/projects/')

  // The prototype toggled `body.wide` (projects index) and `body.case-page`
  // (case studies) to change the column width; we mirror that on #root.
  useEffect(() => {
    const root = document.getElementById('root')
    if (!root) return
    root.classList.toggle('wide', isProjectsIndex)
    root.classList.toggle('case-page', isCase)
    return () => root.classList.remove('wide', 'case-page')
  }, [isProjectsIndex, isCase])

  // Scroll to top on navigation.
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])

  // Every external (http) link opens in a new tab. Runs after each navigation so
  // it covers newly-rendered pages and any links added later; internal router
  // links (relative hrefs) and the resume link (/assets/...) are left untouched.
  useEffect(() => {
    document.querySelectorAll('a[href^="http"]').forEach((a) => {
      a.setAttribute('target', '_blank')
      a.setAttribute('rel', 'noopener noreferrer')
    })
  }, [pathname])

  return (
    <ResumeProvider>
      <SiteHeader defaultIntroOpen={isHome} startHere={isHome} />
      <Outlet />
      <Footer />
      <PuttGame />
    </ResumeProvider>
  )
}
