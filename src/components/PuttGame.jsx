import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation } from 'react-router-dom'

/*
 * A tiny mini-golf easter egg (desktop only).
 * - A glowing ball spawns in the empty page margin ("padding"), inset from every
 *   element and the viewport edge by ~10% of the gutter.
 * - Click/hold the ball, drag BACK, release to launch it forward (slingshot).
 * - A hole spawns in the opposite margin on first grab.
 * - Every content tile (text, cards, images…) is a solid wall the ball bounces off.
 * - Physics are top-down (friction, no gravity). Sinking is just a small moment.
 */

const BALL_R = 10
const HOLE_R = 18
const FRICTION = 0.985
const REST = 0.62            // bounciness
const MAXV = 30              // max launch speed (px/frame)
const PULL_K = 0.16          // pull distance -> launch speed
const MAX_PULL = 240
const STOP = 0.06            // speed below which the ball rests

// Content tiles that act as walls. Curated so we bounce off individual boxes and
// text lines (not one giant merged block), then de-duplicated by containment.
const SELECTORS = [
  'h1', 'h2', 'h3', 'h4', 'p', 'li', 'img', 'figure', 'table',
  '.pcard', '.arch-box', '.ent', '.plugin-card', '.metric', '.server-row',
  '.btn', '.flags', '.sitenav', '.page-title', '.case-title', '.case-summary',
  '.case-tags', '.case-status', '.pullquote', '.aire-cred', '.carousel',
  '.name', '.tagline', '.topemail', '.toplinks', '.backlink', '.log-entry', 'footer',
]

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
const rand = (lo, hi) => lo + Math.random() * (hi - lo)

export default function PuttGame() {
  const { pathname } = useLocation()
  const [enabled, setEnabled] = useState(false)

  const overlayRef = useRef(null)
  const ballRef = useRef(null)
  const holeRef = useRef(null)
  const aimRef = useRef(null)
  const hintRef = useRef(null)
  const ringRef = useRef(null)

  const game = useRef({
    ball: { x: 0, y: 0, vx: 0, vy: 0, spawned: false },
    hole: { x: 0, y: 0, r: HOLE_R, active: false },
    obstacles: [],
    field: { w: 0, h: 0 },
    aiming: false,
    pointer: { x: 0, y: 0 },
    started: false,
    sunk: false,
  })

  // Desktop + fine-pointer only; re-check on resize.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px) and (pointer: fine)')
    const update = () => setEnabled(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!enabled) return
    let raf = 0

    const measureField = () => {
      const g = game.current
      g.field.w = document.documentElement.clientWidth
      g.field.h = Math.max(document.documentElement.scrollHeight, window.innerHeight)
    }

    const collectObstacles = () => {
      const g = game.current
      const sx = window.scrollX, sy = window.scrollY
      const sel = SELECTORS.map((s) => '#root ' + s).join(',')
      const cands = []
      document.querySelectorAll(sel).forEach((el) => {
        const cs = getComputedStyle(el)
        if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) return
        const r = el.getBoundingClientRect()
        if (r.width < 10 || r.height < 8) return
        cands.push({
          left: r.left + sx, top: r.top + sy, right: r.right + sx, bottom: r.bottom + sy,
          area: r.width * r.height,
        })
      })
      // keep only tiles not contained within another selected tile
      const eps = 1
      g.obstacles = cands.filter((r, i) => !cands.some((q, j) =>
        j !== i && q.area > r.area &&
        q.left <= r.left + eps && q.top <= r.top + eps &&
        q.right >= r.right - eps && q.bottom >= r.bottom - eps))
      return g.obstacles
    }

    // returns {min,max} usable x-range for a gutter, inset 10% from both sides
    const gutterRange = (start, end) => {
      const w = end - start
      const pad = Math.max(20, w * 0.10)
      const lo = start + pad + BALL_R
      const hi = end - pad - BALL_R
      return hi - lo > 4 ? { lo, hi } : null
    }

    const spawn = () => {
      const g = game.current
      measureField()
      collectObstacles()
      if (!g.obstacles.length) { g.ball.spawned = false; return }
      const contentMinX = Math.min(...g.obstacles.map((o) => o.left))
      const contentMaxX = Math.max(...g.obstacles.map((o) => o.right))
      const left = gutterRange(0, contentMinX)
      const right = gutterRange(contentMaxX, g.field.w)
      g.gutters = { left, right, contentMinX, contentMaxX }

      // pick a side that has room for the ball
      let side
      if (left && right) side = Math.random() < 0.5 ? 'left' : 'right'
      else side = left ? 'left' : right ? 'right' : null
      if (!side) { g.ball.spawned = false; return }

      const range = side === 'left' ? left : right
      // keep the ball within the current viewport so it's discoverable
      const yLo = window.scrollY + 70
      const yHi = window.scrollY + window.innerHeight - 70
      g.ball.x = rand(range.lo, range.hi)
      g.ball.y = clamp(rand(yLo, yHi), BALL_R + 4, g.field.h - BALL_R - 4)
      g.ball.vx = 0; g.ball.vy = 0; g.ball.spawned = true; g.ball.side = side
      g.hole.active = false
      g.started = false
      g.sunk = false
      if (ballRef.current) { ballRef.current.classList.remove('putt-sunk'); ballRef.current.classList.add('glow') }
    }

    const spawnHole = () => {
      const g = game.current
      const oppo = g.ball.side === 'left' ? g.gutters.right : g.gutters.left
      const range = oppo || (g.ball.side === 'left' ? g.gutters.left : g.gutters.right)
      if (!range) return
      const yLo = window.scrollY + 70
      const yHi = window.scrollY + window.innerHeight - 70
      g.hole.x = rand(range.lo, range.hi)
      g.hole.y = clamp(rand(yLo, yHi), HOLE_R + 4, g.field.h - HOLE_R - 4)
      g.hole.active = true
    }

    const collideRect = (p, o) => {
      const nx = clamp(p.x, o.left, o.right)
      const ny = clamp(p.y, o.top, o.bottom)
      const dx = p.x - nx, dy = p.y - ny
      const d2 = dx * dx + dy * dy
      if (d2 >= BALL_R * BALL_R) return
      if (d2 > 1e-6) {
        const d = Math.sqrt(d2), nrx = dx / d, nry = dy / d
        const overlap = BALL_R - d
        p.x += nrx * overlap; p.y += nry * overlap
        const vdot = p.vx * nrx + p.vy * nry
        if (vdot < 0) { p.vx -= (1 + REST) * vdot * nrx; p.vy -= (1 + REST) * vdot * nry }
      } else {
        const dl = p.x - o.left, dr = o.right - p.x, dt = p.y - o.top, db = o.bottom - p.y
        const m = Math.min(dl, dr, dt, db)
        if (m === dl) { p.x = o.left - BALL_R; p.vx = -Math.abs(p.vx) * REST }
        else if (m === dr) { p.x = o.right + BALL_R; p.vx = Math.abs(p.vx) * REST }
        else if (m === dt) { p.y = o.top - BALL_R; p.vy = -Math.abs(p.vy) * REST }
        else { p.y = o.bottom + BALL_R; p.vy = Math.abs(p.vy) * REST }
      }
    }

    const sink = () => {
      const g = game.current
      g.sunk = true
      g.ball.vx = 0; g.ball.vy = 0
      g.ball.x = g.hole.x; g.ball.y = g.hole.y
      if (ballRef.current) { ballRef.current.classList.remove('glow'); ballRef.current.classList.add('putt-sunk') }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${g.hole.x - window.scrollX}px, ${g.hole.y - window.scrollY}px)`
        ringRef.current.classList.remove('go'); void ringRef.current.offsetWidth; ringRef.current.classList.add('go')
      }
      setTimeout(spawn, 1400)
    }

    const physics = () => {
      const g = game.current
      if (!g.ball.spawned || g.aiming || g.sunk) return
      let p = g.ball
      p.vx *= FRICTION; p.vy *= FRICTION
      if (Math.hypot(p.vx, p.vy) < STOP) { p.vx = 0; p.vy = 0 }
      const dist = Math.hypot(p.vx, p.vy)
      if (dist === 0) return
      const steps = Math.max(1, Math.ceil(dist / (BALL_R * 0.5)))
      const stepx = p.vx / steps, stepy = p.vy / steps
      for (let s = 0; s < steps; s++) {
        p.x += stepx; p.y += stepy
        if (p.x < BALL_R) { p.x = BALL_R; p.vx = Math.abs(p.vx) * REST }
        else if (p.x > g.field.w - BALL_R) { p.x = g.field.w - BALL_R; p.vx = -Math.abs(p.vx) * REST }
        if (p.y < BALL_R) { p.y = BALL_R; p.vy = Math.abs(p.vy) * REST }
        else if (p.y > g.field.h - BALL_R) { p.y = g.field.h - BALL_R; p.vy = -Math.abs(p.vy) * REST }
        for (const o of g.obstacles) collideRect(p, o)
      }
      if (g.hole.active && !g.sunk) {
        const hd = Math.hypot(p.x - g.hole.x, p.y - g.hole.y)
        const sp = Math.hypot(p.vx, p.vy)
        if (hd < g.hole.r) {
          if (hd < g.hole.r - BALL_R * 0.35 && sp < 6) { sink(); return }
          if (sp < 11) { p.vx += (g.hole.x - p.x) * 0.03; p.vy += (g.hole.y - p.y) * 0.03 }
        }
      }
    }

    const render = () => {
      const g = game.current
      const sx = window.scrollX, sy = window.scrollY
      const ball = ballRef.current
      if (ball) {
        ball.style.display = g.ball.spawned ? '' : 'none'
        if (g.ball.spawned && !g.sunk) ball.style.transform = `translate(${g.ball.x - sx}px, ${g.ball.y - sy}px)`
      }
      const hole = holeRef.current
      if (hole) {
        hole.style.display = g.hole.active ? '' : 'none'
        if (g.hole.active) hole.style.transform = `translate(${g.hole.x - sx}px, ${g.hole.y - sy}px)`
      }
      const aim = aimRef.current
      if (aim) {
        if (g.aiming) {
          const pdx = g.ball.x - g.pointer.x, pdy = g.ball.y - g.pointer.y
          const len = clamp(Math.hypot(pdx, pdy), 0, MAX_PULL)
          const ang = Math.atan2(pdy, pdx) * 180 / Math.PI
          aim.style.display = ''
          aim.style.width = len + 'px'
          aim.style.transform = `translate(${g.ball.x - sx}px, ${g.ball.y - sy}px) rotate(${ang}deg)`
          aim.style.opacity = String(0.35 + 0.5 * (len / MAX_PULL))
        } else aim.style.display = 'none'
      }
      const hint = hintRef.current
      if (hint) {
        if (g.started && !g.launched) {
          hint.style.display = ''
          const hw = hint.offsetWidth || 180
          const cx = clamp(g.ball.x - sx, hw / 2 + 10, g.field.w - hw / 2 - 10)
          hint.style.transform = `translate(${cx}px, ${g.ball.y - sy - 24}px) translateX(-50%)`
        } else hint.style.display = 'none'
      }
    }

    const loop = () => { physics(); render(); raf = requestAnimationFrame(loop) }

    // pointer / slingshot on the ball
    const onDown = (e) => {
      const g = game.current
      if (!g.ball.spawned || g.sunk) return
      e.preventDefault()
      ballRef.current.setPointerCapture?.(e.pointerId)
      g.aiming = true
      g.ball.vx = 0; g.ball.vy = 0
      g.pointer.x = e.pageX; g.pointer.y = e.pageY
      ballRef.current.classList.remove('glow')
      ballRef.current.classList.add('aiming')
      if (!g.started) { g.started = true; g.launched = false; spawnHole() }
    }
    const onMove = (e) => {
      const g = game.current
      if (!g.aiming) return
      g.pointer.x = e.pageX; g.pointer.y = e.pageY
    }
    const onUp = (e) => {
      const g = game.current
      if (!g.aiming) return
      g.aiming = false
      ballRef.current.classList.remove('aiming')
      let pull = { x: g.ball.x - e.pageX, y: g.ball.y - e.pageY }
      const len = Math.hypot(pull.x, pull.y)
      if (len > MAX_PULL) { pull.x *= MAX_PULL / len; pull.y *= MAX_PULL / len }
      let vx = pull.x * PULL_K, vy = pull.y * PULL_K
      const sp = Math.hypot(vx, vy)
      if (sp > MAXV) { vx *= MAXV / sp; vy *= MAXV / sp }
      g.ball.vx = vx; g.ball.vy = vy
      g.launched = true
    }

    const onResize = () => { measureField(); collectObstacles() }

    measureField()
    // let the freshly-navigated page lay out before we spawn
    const t = setTimeout(spawn, 120)
    const ball = ballRef.current
    ball.addEventListener('pointerdown', onDown)
    ball.addEventListener('pointermove', onMove)
    ball.addEventListener('pointerup', onUp)
    ball.addEventListener('pointercancel', onUp)
    window.addEventListener('resize', onResize)
    const ro = new ResizeObserver(onResize)
    ro.observe(document.body)
    raf = requestAnimationFrame(loop)

    return () => {
      clearTimeout(t)
      cancelAnimationFrame(raf)
      ball.removeEventListener('pointerdown', onDown)
      ball.removeEventListener('pointermove', onMove)
      ball.removeEventListener('pointerup', onUp)
      ball.removeEventListener('pointercancel', onUp)
      window.removeEventListener('resize', onResize)
      ro.disconnect()
    }
    // re-run setup on navigation so the ball re-spawns per section
  }, [enabled, pathname])

  if (!enabled) return null

  return createPortal(
    <div className="putt-overlay" ref={overlayRef} aria-hidden="true">
      <div className="putt-hole" ref={holeRef} style={{ display: 'none' }} />
      <div className="putt-ring" ref={ringRef} />
      <div className="putt-aim" ref={aimRef} style={{ display: 'none' }} />
      <div className="putt-ball glow" ref={ballRef} style={{ display: 'none' }}>
        <div className="dot" />
      </div>
      <div className="putt-hint" ref={hintRef} style={{ display: 'none' }}>
        hold &middot; drag back &middot; release
      </div>
    </div>,
    document.body,
  )
}
