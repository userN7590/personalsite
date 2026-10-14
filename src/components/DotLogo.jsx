import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

/*
 * Project marks drawn as a field of white dots (home page).
 * - Every mark is sampled onto the same grid as the faint background dots, so a
 *   logo reads as part of the grid lighting up. Tone is baked into the alpha of
 *   the /assets/dots silhouettes, so two-colour marks keep their structure.
 * - Every CYCLE_MS the dots swirl from one mark to the next (left-to-right sweep).
 * - The cursor pushes dots away and lights up the grid beneath it.
 */

export const LOGOS = [
  { key: 'rebilt', name: 'REBILT', src: '/assets/logos/rebilt-star.svg', to: '/projects/rebilt', live: true,
    blurb: 'A curated directory of independent remakes of the software people already use.' },
  { key: 'wordloot', name: 'WordLoot', src: '/assets/dots/wordloot.png', to: '/projects/wordloot', live: true,
    blurb: 'A word-prediction game running on a real-money ledger.' },
  { key: 'stack-stats', name: 'Stack Stats', src: '/assets/dots/stack-stats.png', to: '/projects/stack-stats', live: true,
    blurb: 'Everyday coding activity, turned into a developer profile.' },
]

const CYCLE_MS = 5200
const TICK = 1000 / 60      // physics runs at a fixed 60 Hz regardless of display refresh rate
const SPRING = 0.05
const DAMP = 0.8
const SWIRL = 0.014         // sideways pull so dots curve into place instead of flying straight
const FADE = 0.09
const PUSH = 2.6            // cursor repulsion at the centre of its radius (px / tick²)
const SPOT = 110            // radius of the grid spotlight under the cursor
const LEVELS = 8            // alpha buckets: one fill() per bucket instead of one per dot
const TAU = Math.PI * 2

function createEngine(canvas, { onVisible }) {
  const ctx = canvas.getContext('2d')
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  let size = 0, dpr = 1, gap = 6
  let images = null, shapes = []
  let n = 0
  let px, py, vx, vy, tx, ty, tb, b, ph, ntx, nty, ntb, at, alpha
  let want = 0
  let bg = null, bgHi = null, spot = null, spotGrad = null
  const pointer = { x: 0, y: 0, on: false }
  let raf = 0, last = 0, acc = 0, running = false, visible = true, destroyed = false

  const dots = (a, r) => {
    const c = document.createElement('canvas')
    c.width = c.height = Math.round(size * dpr)
    const g = c.getContext('2d')
    g.scale(dpr, dpr)
    g.fillStyle = `rgba(255,255,255,${a})`
    g.beginPath()
    for (let y = gap / 2; y < size; y += gap) {
      for (let x = gap / 2; x < size; x += gap) { g.moveTo(x + r, y); g.arc(x, y, r, 0, TAU) }
    }
    g.fill()
    return c
  }

  // Sample a mark onto the dot grid: [x, y, brightness, x, y, brightness, ...]
  const sample = (img) => {
    const off = document.createElement('canvas')
    off.width = off.height = size
    const o = off.getContext('2d', { willReadFrequently: true })
    const box = size * 0.56
    const s = Math.min(box / img.naturalWidth, box / img.naturalHeight)
    const w = img.naturalWidth * s, h = img.naturalHeight * s
    o.drawImage(img, (size - w) / 2, (size - h) / 2, w, h)
    const data = o.getImageData(0, 0, size, size).data
    const pts = []
    for (let y = gap / 2; y < size; y += gap) {
      for (let x = gap / 2; x < size; x += gap) {
        const a = data[((y | 0) * size + (x | 0)) * 4 + 3] / 255
        if (a > 0.18) pts.push(x, y, Math.min(1, a * 1.05))
      }
    }
    return pts
  }

  const alloc = (count) => {
    if (count === n) return
    const keep = Math.min(n, count)
    const grow = (old) => { const a = new Float32Array(count); if (old) a.set(old.subarray(0, keep)); return a }
    ;[px, py, vx, vy, tx, ty, tb, b, ph, ntx, nty, ntb, at] = [px, py, vx, vy, tx, ty, tb, b, ph, ntx, nty, ntb, at].map(grow)
    alpha = new Float32Array(count)
    for (let p = keep; p < count; p++) {
      px[p] = tx[p] = Math.random() * size
      py[p] = ty[p] = Math.random() * size
      ph[p] = Math.random() * TAU
    }
    n = count
  }

  const show = (i, snap = false) => {
    want = i
    if (!images) return
    const s = shapes[i]
    const m = s ? s.length / 3 : 0
    if (!m) return
    const order = new Uint32Array(n)
    for (let k = 0; k < n; k++) order[k] = k
    for (let k = n - 1; k > 0; k--) { const j = (Math.random() * (k + 1)) | 0; const t = order[k]; order[k] = order[j]; order[j] = t }
    const now = performance.now()
    for (let k = 0; k < n; k++) {
      const p = order[k]
      const j = k < m ? k : (Math.random() * m) | 0   // spare dots park inside the shape, faded out
      ntx[p] = s[j * 3]; nty[p] = s[j * 3 + 1]; ntb[p] = k < m ? s[j * 3 + 2] : 0
      if (snap) {
        tx[p] = px[p] = ntx[p]; ty[p] = py[p] = nty[p]; tb[p] = b[p] = ntb[p]; vx[p] = vy[p] = 0; at[p] = 0
      } else if (reduce) {
        tb[p] = 0                                  // fade out in place, then reappear in the new mark
        at[p] = now + 380
      } else {
        at[p] = now + (ntx[p] / size) * 420 + Math.random() * 260
      }
    }
  }

  const step = (now) => {
    const R = size * 0.17, R2 = R * R
    for (let p = 0; p < n; p++) {
      if (at[p] && now >= at[p]) {
        tx[p] = ntx[p]; ty[p] = nty[p]; tb[p] = ntb[p]; at[p] = 0
        if (reduce) { px[p] = tx[p]; py[p] = ty[p] }
      }
      const x = px[p], y = py[p]
      const dx = tx[p] - x, dy = ty[p] - y
      let ax = dx * SPRING, ay = dy * SPRING
      if (!reduce) {
        ax -= dy * SWIRL; ay += dx * SWIRL
        if (pointer.on) {
          const ex = x - pointer.x, ey = y - pointer.y, d2 = ex * ex + ey * ey
          if (d2 < R2 && d2 > 0.01) {
            const d = Math.sqrt(d2), f = (1 - d / R) ** 2 * PUSH
            ax += (ex / d) * f; ay += (ey / d) * f
          }
        }
      }
      vx[p] = (vx[p] + ax) * DAMP; vy[p] = (vy[p] + ay) * DAMP
      px[p] = x + vx[p]; py[p] = y + vy[p]
      b[p] += (tb[p] - b[p]) * FADE
    }
  }

  const spotlight = () => {
    const S = spot.width, sx = Math.round((pointer.x - SPOT) * dpr), sy = Math.round((pointer.y - SPOT) * dpr)
    const x0 = Math.max(0, sx), y0 = Math.max(0, sy)
    const x1 = Math.min(bgHi.width, sx + S), y1 = Math.min(bgHi.height, sy + S)
    if (x1 <= x0 || y1 <= y0) return
    const g = spot.getContext('2d')
    g.globalCompositeOperation = 'source-over'
    g.clearRect(0, 0, S, S)
    g.drawImage(bgHi, x0, y0, x1 - x0, y1 - y0, x0 - sx, y0 - sy, x1 - x0, y1 - y0)
    g.globalCompositeOperation = 'destination-in'
    g.fillStyle = spotGrad
    g.fillRect(0, 0, S, S)
    ctx.drawImage(spot, sx, sy)
  }

  const draw = (t) => {
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(bg, 0, 0)
    if (pointer.on && !reduce) spotlight()
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.fillStyle = '#fff'
    const r = gap * 0.21
    for (let p = 0; p < n; p++) alpha[p] = b[p] * (0.8 + 0.2 * Math.sin(t * 0.0021 + ph[p]))
    for (let k = 1; k <= LEVELS; k++) {
      const lo = (k - 1) / LEVELS, hi = k / LEVELS
      let any = false
      ctx.beginPath()
      for (let p = 0; p < n; p++) {
        const a = alpha[p]
        if (a > lo && a <= hi && a > 0.03) { ctx.moveTo(px[p] + r, py[p]); ctx.arc(px[p], py[p], r, 0, TAU); any = true }
      }
      if (any) { ctx.globalAlpha = hi; ctx.fill() }
    }
    ctx.globalAlpha = 1
  }

  const frame = (t) => {
    if (!running) return
    raf = requestAnimationFrame(frame)
    if (!last) last = t
    acc = Math.min(acc + (t - last), 100)
    last = t
    while (acc >= TICK) { step(t); acc -= TICK }
    draw(t)
  }

  const start = () => {
    if (running || destroyed || !images || !visible || !size) return
    running = true; last = 0; acc = 0
    raf = requestAnimationFrame(frame)
  }
  const stop = () => { running = false; cancelAnimationFrame(raf) }

  const build = (snap) => {
    shapes = images.map((img) => (img ? sample(img) : []))
    alloc(Math.max(1, ...shapes.map((s) => s.length / 3)))
    show(want, snap)
  }

  const setup = () => {
    const s = Math.round(canvas.clientWidth)
    if (!s || s === size) return
    const first = !size
    size = s
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    gap = size >= 400 ? 6 : 5
    canvas.width = canvas.height = Math.round(size * dpr)
    bg = dots(0.085, 0.75)
    bgHi = dots(0.6, 0.9)
    spot = document.createElement('canvas')
    spot.width = spot.height = Math.ceil(SPOT * 2 * dpr)
    const h = spot.width / 2
    spotGrad = spot.getContext('2d').createRadialGradient(h, h, 0, h, h, h)
    spotGrad.addColorStop(0, 'rgba(0,0,0,1)')
    spotGrad.addColorStop(1, 'rgba(0,0,0,0)')
    if (images) { build(!first); draw(performance.now()) }
    start()
  }

  const toLocal = (e) => {
    const rect = canvas.getBoundingClientRect(), k = size / rect.width
    pointer.x = (e.clientX - rect.left) * k
    pointer.y = (e.clientY - rect.top) * k
    pointer.on = true
  }
  const off = () => { pointer.on = false }
  const onUp = (e) => { if (e.pointerType !== 'mouse') off() }
  canvas.addEventListener('pointermove', toLocal)
  canvas.addEventListener('pointerdown', toLocal)
  canvas.addEventListener('pointerleave', off)
  canvas.addEventListener('pointercancel', off)
  canvas.addEventListener('pointerup', onUp)

  const ro = new ResizeObserver(setup)
  ro.observe(canvas)
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    onVisible?.(visible)
    if (visible) start(); else stop()
  })
  io.observe(canvas)

  Promise.all(LOGOS.map((l) => new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = l.src
  }))).then((imgs) => {
    if (destroyed) return
    images = imgs
    if (size) build(false)
    start()
  })

  return {
    show,
    destroy() {
      destroyed = true
      stop()
      ro.disconnect()
      io.disconnect()
      canvas.removeEventListener('pointermove', toLocal)
      canvas.removeEventListener('pointerdown', toLocal)
      canvas.removeEventListener('pointerleave', off)
      canvas.removeEventListener('pointercancel', off)
      canvas.removeEventListener('pointerup', onUp)
    },
  }
}

const pad = (v) => String(v).padStart(2, '0')

export default function DotLogo() {
  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  const [index, setIndex] = useState(0)
  const [hover, setHover] = useState(false)
  const [onScreen, setOnScreen] = useState(true)
  const logo = LOGOS[index]
  const next = () => setIndex((i) => (i + 1) % LOGOS.length)

  useEffect(() => {
    const engine = createEngine(canvasRef.current, { onVisible: setOnScreen })
    engineRef.current = engine
    return () => { engine.destroy(); engineRef.current = null }
  }, [])

  useEffect(() => { engineRef.current?.show(index) }, [index])

  return (
    <div className="dl">
      <div className="dl-stage ticks" onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
        <span className="dl-tag l">Selected work</span>
        <span className="dl-tag r">{pad(index + 1)} / {pad(LOGOS.length)}</span>
        <canvas ref={canvasRef} className="dl-canvas" role="img" aria-label={`${logo.name} logo drawn in dots`} />
      </div>
      <div className="dl-meta">
        <Link className="dl-label" to={logo.to}>
          <span className="dl-name">
            {logo.name}
            {logo.live && <span className="st-wrap"><span className="dot-live" aria-hidden="true" /><span className="st live">live</span></span>}
          </span>
          <span className="dl-blurb">{logo.blurb}</span>
        </Link>
        <Link className="dl-go" to={logo.to} tabIndex={-1} aria-hidden="true">&rarr;</Link>
      </div>
      <div className="dl-steps">
        {LOGOS.map((l, i) => (
          <button
            key={l.key}
            type="button"
            className={`dl-step${i === index ? ' on' : ''}`}
            aria-label={`Show ${l.name}`}
            aria-pressed={i === index}
            onClick={() => setIndex(i)}
          >
            <span
              className="dl-fill"
              style={i === index ? { animationDuration: `${CYCLE_MS}ms`, animationPlayState: hover || !onScreen ? 'paused' : 'running' } : undefined}
              onAnimationEnd={i === index ? next : undefined}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
