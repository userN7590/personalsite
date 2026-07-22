import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const PDF = '/assets/Filip-Stopyra-Resume.pdf'
const ResumeContext = createContext(() => {})

export function useResume() {
  return useContext(ResumeContext)
}

// Provider + overlay panel with an embedded PDF (React port of the design's
// [data-resume] viewer). Phones render PDFs poorly inline, so small screens
// fall back to opening the file directly.
export function ResumeProvider({ children }) {
  const [open, setOpen] = useState(false)

  const openResume = useCallback((e) => {
    if (window.matchMedia('(max-width: 640px)').matches) return // let the native viewer handle it
    if (e) e.preventDefault()
    setOpen(true)
  }, [])

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, close])

  return (
    <ResumeContext.Provider value={openResume}>
      {children}
      <div
        className={`resume-overlay${open ? ' show' : ''}`}
        role="dialog"
        aria-label="Resume"
        onClick={(e) => { if (e.target === e.currentTarget) close() }}
      >
        <div className="resume-panel">
          <div className="resume-bar">
            <span className="resume-title">Filip-Stopyra-Resume.pdf</span>
            <span className="resume-actions">
              <a className="rbtn" href={PDF} target="_blank" rel="noopener">open in new tab <span className="ar">&#8599;</span></a>
              <a className="rbtn" href={PDF} download="Filip-Stopyra-Resume.pdf">download <span className="ar">&#8595;</span></a>
              <button className="rbtn rclose" type="button" aria-label="Close" onClick={close}>close <span className="ar">&#10005;</span></button>
            </span>
          </div>
          {open && <iframe className="resume-frame" title="Resume PDF" src={`${PDF}#view=FitH`} />}
        </div>
      </div>
    </ResumeContext.Provider>
  )
}
