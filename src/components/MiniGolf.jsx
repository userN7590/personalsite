import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation } from 'react-router-dom'
import { W, H, BALL_R, CUP_R, SURF, generateCourse, surfaceAt, slopeAt, describeCourse } from '../lib/golfCourse'
import { drawCourse, drawFlag, drawBall, drawAim, drawRings } from '../lib/golfDraw'

/*
 * Mini-golf easter egg (desktop only).
 * - A glowing ball sits in the empty page margin; clicking it opens a window.
 * - Every hole is a freshly generated course: rolling terrain, sand dunes,
 *   water that sends you back to the tee, trees, and a creek with a bridge.
 * - Drag anywhere on the course, pull back, release to putt. Esc cancels a putt.
 * - Top-down physics on a fixed 60 Hz step, in world units scaled to the canvas.
 */

const TICK = 1000 / 60
const MAXV = 15             // max launch speed (world units / tick)
const PULL_K = 0.11         // pull distance -> launch speed
const MAX_PULL = 140
const MIN_PULL = 5          // shorter pulls count as a cancelled putt
const STOP = 0.04
const SINK_V = 6            // faster than this over the cup and the ball lips out
const SLOPE_K = 0.12        // terrain gradient -> acceleration
const REST = 0.5            // bounciness off trees and the course edge
const FRICTION = {
  [SURF.ROUGH]: { roll: 0.955, drag: 0.07, slope: 0.8 },
  [SURF.FAIRWAY]: { roll: 0.978, drag: 0.032, slope: 1 },
  [SURF.GREEN]: { roll: 0.983, drag: 0.02, slope: 1 },
  [SURF.SAND]: { roll: 0.86, drag: 0.2, slope: 0.5 },
  [SURF.BRIDGE]: { roll: 0.978, drag: 0.03, slope: 0 },
}
const HINT = 'Drag anywhere on the course, pull back, and let go to putt.'

function createGame(canvas, cb) {
  const ctx = canvas.getContext('2d')
  let course = null, layer = null, k = 1
  const ball = { x: 0, y: 0, vx: 0, vy: 0 }
  let phase = 'ready'                 // ready | aiming | rolling | splash | sunk
  let strokes = 0, rollTicks = 0, sinkAt = 0
  const aim = { ax: 0, ay: 0, px: 0, py: 0, id: null }
  const effects = []                  // { x, y, t0, dur, color }
  const timers = new Set()
  const later = (fn, ms) => { const t = setTimeout(() => { timers.delete(t); fn() }, ms); timers.add(t) }
  let raf = 0, last = 0, acc = 0

  const paint = () => {
    if (!course || !canvas.width) return
    layer = document.createElement('canvas')
    layer.width = canvas.width; layer.height = canvas.height
    drawCourse(layer.getContext('2d'), course, k)
  }
  const resize = () => {
    const w = canvas.clientWidth
    if (!w) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const bw = Math.round(w * dpr)
    if (bw === canvas.width) return
    canvas.width = bw; canvas.height = Math.round(bw * H / W)
    k = canvas.width / W
    paint()
  }

  const toTee = () => { Object.assign(ball, { x: course.tee.x, y: course.tee.y, vx: 0, vy: 0 }); phase = 'ready' }
  const load = (c) => {
    timers.forEach(clearTimeout); timers.clear()
    course = c; strokes = 0; effects.length = 0
    toTee(); paint()
    cb.onStrokes(0)
  }

  const toWorld = (e) => {
    const r = canvas.getBoundingClientRect()
    return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H }
  }

  const splash = () => {
    phase = 'splash'
    effects.push({ x: ball.x, y: ball.y, t0: performance.now(), dur: 750, color: 'rgba(170,210,255,.95)' })
    strokes++; cb.onStrokes(strokes)
    cb.onMessage('Splash! +1 stroke, back to the tee.')
    later(toTee, 900)
  }
  const inCup = () => Math.hypot(course.hole.x - ball.x, course.hole.y - ball.y) < CUP_R - BALL_R * 0.3 && Math.hypot(ball.vx, ball.vy) < SINK_V
  const sink = () => {
    phase = 'sunk'
    Object.assign(ball, { x: course.hole.x, y: course.hole.y, vx: 0, vy: 0 })
    sinkAt = performance.now()
    effects.push({ x: ball.x, y: ball.y, t0: sinkAt, dur: 650, color: 'rgba(61,220,151,.95)' })
    later(() => cb.onSunk(strokes), 650)
  }
  const walls = () => {
    if (ball.x < BALL_R) { ball.x = BALL_R; ball.vx = Math.abs(ball.vx) * REST }
    else if (ball.x > W - BALL_R) { ball.x = W - BALL_R; ball.vx = -Math.abs(ball.vx) * REST }
    if (ball.y < BALL_R) { ball.y = BALL_R; ball.vy = Math.abs(ball.vy) * REST }
    else if (ball.y > H - BALL_R) { ball.y = H - BALL_R; ball.vy = -Math.abs(ball.vy) * REST }
  }
  const trees = () => {
    for (const t of course.trees) {
      const dx = ball.x - t.x, dy = ball.y - t.y, d = Math.hypot(dx, dy), min = t.r + BALL_R
      if (d >= min || d < 1e-6) continue
      const nx = dx / d, ny = dy / d
      ball.x = t.x + nx * min; ball.y = t.y + ny * min
      const v = ball.vx * nx + ball.vy * ny
      if (v < 0) { ball.vx -= (1 + REST) * v * nx; ball.vy -= (1 + REST) * v * ny }
    }
  }

  const tick = () => {
    if (phase !== 'rolling') return
    const c = course
    rollTicks++
    const s = surfaceAt(c, ball.x, ball.y)
    if (s === SURF.WATER) { splash(); return }
    const f = FRICTION[s]
    const [gx, gy] = slopeAt(c, ball.x, ball.y)
    const ax = -gx * SLOPE_K * f.slope, ay = -gy * SLOPE_K * f.slope
    ball.vx += ax; ball.vy += ay
    // the cup tugs a slow ball in
    const hx = c.hole.x - ball.x, hy = c.hole.y - ball.y, hd = Math.hypot(hx, hy)
    if (hd < CUP_R + BALL_R * 0.5 && hd > 0.5 && Math.hypot(ball.vx, ball.vy) < SINK_V * 1.4) {
      ball.vx += (hx / hd) * 0.4; ball.vy += (hy / hd) * 0.4
    }
    const sp = Math.hypot(ball.vx, ball.vy)
    const ns = Math.max(0, sp * f.roll - f.drag)
    // at rest once friction beats both the roll and the slope (or after ~25 s, just in case)
    if (ns < STOP && (Math.hypot(ax, ay) <= f.drag || rollTicks > 1500)) {
      ball.vx = 0; ball.vy = 0
      if (inCup()) { sink(); return }
      phase = 'ready'
      cb.onMessage(s === SURF.SAND ? 'In the sand. It takes a firm putt to get out.' : s === SURF.ROUGH ? 'In the rough.' : '')
      return
    }
    if (sp > 0) { ball.vx *= ns / sp; ball.vy *= ns / sp }
    const steps = Math.max(1, Math.ceil(ns / (BALL_R * 0.4)))
    for (let i = 0; i < steps; i++) {
      ball.x += ball.vx / steps; ball.y += ball.vy / steps
      walls(); trees()
      if (inCup()) { sink(); return }
      if (surfaceAt(c, ball.x, ball.y) === SURF.WATER) { splash(); return }
    }
  }

  const render = (t) => {
    if (!layer) return
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.drawImage(layer, 0, 0)
    ctx.setTransform(k, 0, 0, k, 0, 0)
    if (phase === 'ready') {
      ctx.strokeStyle = `rgba(255,255,255,${0.25 + 0.15 * Math.sin(t * 0.005)})`
      ctx.lineWidth = 1.2
      ctx.beginPath(); ctx.arc(ball.x, ball.y, BALL_R + 4 + Math.sin(t * 0.005) * 1.2, 0, Math.PI * 2); ctx.stroke()
    }
    if (phase !== 'splash') drawBall(ctx, ball.x, ball.y, phase === 'sunk' ? 1 - (t - sinkAt) / 350 : 1)
    drawFlag(ctx, course, phase === 'sunk' ? 0 : Math.hypot(ball.x - course.hole.x, ball.y - course.hole.y), t)
    if (phase === 'aiming') {
      const dx = aim.ax - aim.px, dy = aim.ay - aim.py, len = Math.hypot(dx, dy)
      if (len >= MIN_PULL) drawAim(ctx, ball.x, ball.y, dx / len, dy / len, Math.min(len, MAX_PULL) / MAX_PULL)
    }
    for (let i = effects.length - 1; i >= 0; i--) {
      const e = effects[i], p = (t - e.t0) / e.dur
      if (p >= 1) effects.splice(i, 1); else drawRings(ctx, e.x, e.y, p, e.color)
    }
  }

  const loop = (t) => {
    raf = requestAnimationFrame(loop)
    if (!last) last = t
    acc = Math.min(acc + (t - last), 100)
    last = t
    while (acc >= TICK) { tick(); acc -= TICK }
    render(t)
  }

  // slingshot from wherever the drag starts
  const onDown = (e) => {
    if (phase !== 'ready' || (e.pointerType === 'mouse' && e.button !== 0)) return
    e.preventDefault()
    canvas.setPointerCapture?.(e.pointerId)
    const p = toWorld(e)
    Object.assign(aim, { ax: p.x, ay: p.y, px: p.x, py: p.y, id: e.pointerId })
    phase = 'aiming'
  }
  const onMove = (e) => {
    if (phase !== 'aiming' || e.pointerId !== aim.id) return
    const p = toWorld(e)
    aim.px = p.x; aim.py = p.y
  }
  const onUp = (e) => {
    if (phase !== 'aiming' || e.pointerId !== aim.id) return
    if (canvas.hasPointerCapture?.(e.pointerId)) canvas.releasePointerCapture(e.pointerId)
    const dx = aim.ax - aim.px, dy = aim.ay - aim.py, len = Math.hypot(dx, dy)
    if (len < MIN_PULL) { phase = 'ready'; return }
    const speed = Math.min(Math.min(len, MAX_PULL) * PULL_K, MAXV)
    ball.vx = (dx / len) * speed; ball.vy = (dy / len) * speed
    strokes++; cb.onStrokes(strokes); cb.onMessage('')
    rollTicks = 0
    phase = 'rolling'
  }
  const cancelAim = () => {
    if (phase !== 'aiming') return false
    phase = 'ready'
    return true
  }

  canvas.addEventListener('pointerdown', onDown)
  canvas.addEventListener('pointermove', onMove)
  canvas.addEventListener('pointerup', onUp)
  canvas.addEventListener('pointercancel', cancelAim)
  canvas.addEventListener('lostpointercapture', cancelAim)
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  resize()
  raf = requestAnimationFrame(loop)

  return {
    load,
    cancelAim,
    destroy() {
      cancelAnimationFrame(raf)
      timers.forEach(clearTimeout)
      ro.disconnect()
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', cancelAim)
      canvas.removeEventListener('lostpointercapture', cancelAim)
    },
  }
}

function scoreName(n, par) {
  if (n === 1) return 'Hole in one!'
  const d = n - par
  const names = { '-3': 'Albatross!', '-2': 'Eagle!', '-1': 'Birdie!', 0: 'Par', 1: 'Bogey', 2: 'Double bogey' }
  return names[d] ?? (d < 0 ? 'Under par!' : `${d} over`)
}
const fmtOver = (o) => (o === 0 ? 'even' : o > 0 ? `+${o}` : `−${-o}`)
const newSeed = () => Math.floor(Math.random() * 2 ** 31)

function GolfDialog({ onClose }) {
  const canvasRef = useRef(null)
  const panelRef = useRef(null)
  const nextRef = useRef(null)
  const gameRef = useRef(null)
  const courseRef = useRef(null)
  const [course, setCourse] = useState(null)
  const [hole, setHole] = useState(1)
  const [strokes, setStrokes] = useState(0)
  const [msg, setMsg] = useState(HINT)
  const [result, setResult] = useState(null)       // { n, par }
  const [card, setCard] = useState({ played: 0, over: 0 })

  const deal = useCallback(() => {
    const c = generateCourse(newSeed())
    courseRef.current = c
    setCourse(c); setResult(null); setMsg(HINT)
    gameRef.current?.load(c)
  }, [])

  useEffect(() => {
    const game = createGame(canvasRef.current, {
      onStrokes: setStrokes,
      onMessage: setMsg,
      onSunk: (n) => {
        const par = courseRef.current.par
        setCard((s) => ({ played: s.played + 1, over: s.over + n - par }))
        setResult({ n, par })
      },
    })
    gameRef.current = game
    deal()
    return () => { game.destroy(); gameRef.current = null }
  }, [deal])

  // lock page scroll, take focus, Esc closes (or cancels a putt), Tab stays inside
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (!gameRef.current?.cancelAim()) onClose()
      } else if (e.key === 'Tab') {
        const items = [...panelRef.current.querySelectorAll('button')]
        if (!items.length) return
        const first = items[0], lastItem = items[items.length - 1]
        if (e.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current)) { e.preventDefault(); lastItem.focus() }
        else if (!e.shiftKey && document.activeElement === lastItem) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', onKey) }
  }, [onClose])

  useEffect(() => { if (result) nextRef.current?.focus() }, [result])

  const nextHole = () => { setHole((h) => h + 1); deal() }

  return createPortal(
    <div className="golf-overlay" onPointerDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="golf-panel" role="dialog" aria-modal="true" aria-labelledby="golf-title" ref={panelRef} tabIndex={-1}>
        <div className="golf-bar">
          <h2 className="golf-title" id="golf-title">Mini golf</h2>
          <span className="golf-hud">
            Hole {hole}<span className="sep">·</span>Par {course?.par ?? '–'}<span className="sep">·</span>Strokes {strokes}
            {card.played > 0 && <><span className="sep">·</span>Total {fmtOver(card.over)}</>}
          </span>
          <span className="golf-actions">
            <button className="rbtn" type="button" onClick={deal}>new course <span className="ar">&#8635;</span></button>
            <button className="rbtn" type="button" aria-label="Close" onClick={onClose}>close <span className="ar">&#10005;</span></button>
          </span>
        </div>
        <div className="golf-stage">
          <canvas ref={canvasRef} className="golf-canvas" role="img" aria-label={course ? describeCourse(course) : 'Mini golf course'} />
          {result && (
            <div className="golf-result">
              <div className="golf-card">
                <h3>{scoreName(result.n, result.par)}</h3>
                <p>{result.n} stroke{result.n === 1 ? '' : 's'} on a par {result.par}<br />Total {fmtOver(card.over)} after {card.played} hole{card.played === 1 ? '' : 's'}</p>
                <button className="btn btn-primary" type="button" ref={nextRef} onClick={nextHole}>Next hole <span className="ar r">&rarr;</span></button>
              </div>
            </div>
          )}
        </div>
        <div className="golf-foot">
          <span aria-live="polite">{msg}</span>
          {course && <span className="golf-seed">course #{course.seed.toString(36)}</span>}
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default function MiniGolf() {
  const { pathname } = useLocation()
  const [enabled, setEnabled] = useState(false)
  const [spot, setSpot] = useState(null)
  const [open, setOpen] = useState(false)
  const ballRef = useRef(null)

  // desktop + fine pointer only; re-check when that changes
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px) and (pointer: fine)')
    const update = () => setEnabled(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // park the ball in an empty margin beside the frame, inside the current viewport
  useEffect(() => {
    if (!enabled) { setSpot(null); return }
    const place = () => {
      const frame = document.querySelector('.frame')
      if (!frame) return
      const r = frame.getBoundingClientRect(), vw = document.documentElement.clientWidth
      const gutters = [[0, r.left], [r.right, vw]].filter(([a, b]) => b - a >= 44)
      if (!gutters.length) { setSpot(null); return }
      const [a, b] = gutters[Math.floor(Math.random() * gutters.length)]
      const bar = document.querySelector('.topbar')?.offsetHeight || 56
      setSpot({
        x: a + (b - a) * (0.3 + Math.random() * 0.4),
        y: window.scrollY + bar + 80 + Math.random() * Math.max(0, window.innerHeight - bar - 200),
      })
    }
    const first = setTimeout(place, 160)    // let the freshly-navigated page lay out
    let pending = 0
    const onResize = () => { clearTimeout(pending); pending = setTimeout(place, 200) }
    window.addEventListener('resize', onResize)
    return () => { clearTimeout(first); clearTimeout(pending); window.removeEventListener('resize', onResize) }
  }, [enabled, pathname])

  const close = useCallback(() => {
    setOpen(false)
    requestAnimationFrame(() => ballRef.current?.focus({ preventScroll: true }))
  }, [])

  return (
    <>
      {enabled && spot && createPortal(
        <button
          className="golf-ball"
          ref={ballRef}
          type="button"
          style={{ transform: `translate3d(${spot.x}px, ${spot.y}px, 0)` }}
          aria-label="Play mini golf"
          title="Play mini golf"
          onClick={() => setOpen(true)}
        >
          <span className="dot" />
        </button>,
        document.body,
      )}
      {open && <GolfDialog onClose={close} />}
    </>
  )
}
