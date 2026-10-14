// Procedural mini-golf courses: a seeded generator plus the surface and slope
// queries the physics needs. Everything is in world units (W × H); the canvas
// scales them to fit whatever size the dialog ends up.

export const W = 960
export const H = 600
export const BALL_R = 6.5
export const CUP_R = 10
export const SURF = { ROUGH: 0, FAIRWAY: 1, GREEN: 2, SAND: 3, WATER: 4, BRIDGE: 5 }

const TAU = Math.PI * 2
const CELL = 2                       // surface grid resolution
const GW = W / CELL, GH = H / CELL
const HCELL = 8                      // height grid resolution
const HW = W / HCELL + 1, HH = H / HCELL + 1
const GMAX = 1                       // cap on slope steepness

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
const lerp = (a, b, t) => a + (b - a) * t
const smooth = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t) }
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)

export function mulberry32(seed) {
  let a = seed | 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// smooth 2D value noise in roughly [-1, 1]
function noise2(rand) {
  const v = new Float32Array(256 * 256)
  for (let i = 0; i < v.length; i++) v[i] = rand() * 2 - 1
  const at = (ix, iy) => v[(iy & 255) * 256 + (ix & 255)]
  return (x, y) => {
    const ix = Math.floor(x), iy = Math.floor(y)
    let fx = x - ix, fy = y - iy
    fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy)
    const a = at(ix, iy), b = at(ix + 1, iy), c = at(ix, iy + 1), d = at(ix + 1, iy + 1)
    return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy
  }
}

// Catmull-Rom through the control points, sampled roughly every `step` units
function spline(points, step) {
  const out = []
  const P = [points[0], ...points, points[points.length - 1]]
  for (let i = 1; i < P.length - 2; i++) {
    const [p0, p1, p2, p3] = [P[i - 1], P[i], P[i + 1], P[i + 2]]
    const n = Math.max(2, Math.ceil(dist(p1, p2) / step))
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t
      const f = (a, b, c, d) => 0.5 * (2 * b + (c - a) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (3 * b - a - 3 * c + d) * t3)
      out.push({ x: f(p0.x, p1.x, p2.x, p3.x), y: f(p0.y, p1.y, p2.y, p3.y) })
    }
  }
  out.push({ ...points[points.length - 1] })
  return out
}

// A blob is a wobbly circle: r(θ) = r · (1 + Σ a·sin(kθ + p))
function blob(rand, x, y, r) {
  const harm = [2, 3, 5].map((k, i) => ({ k, a: rand() * [0.17, 0.1, 0.05][i], p: rand() * TAU }))
  return { x, y, r, harm }
}
export function blobRadius(b, ang) {
  let m = 1
  for (const h of b.harm) m += h.a * Math.sin(h.k * ang + h.p)
  return b.r * m
}
function inBlob(b, x, y) {
  const dx = x - b.x, dy = y - b.y, d2 = dx * dx + dy * dy, max = b.r * 1.35
  return d2 < max * max && Math.sqrt(d2) < blobRadius(b, Math.atan2(dy, dx))
}
export const creekX = (c, y) => c.x + c.amp * Math.sin(y * c.freq + c.phase)

export function surfaceAt(c, x, y) {
  const ix = clamp(Math.floor(x / CELL), 0, GW - 1), iy = clamp(Math.floor(y / CELL), 0, GH - 1)
  return c.surf[iy * GW + ix]
}

// height gradient at a point, bilinear between grid nodes
export function slopeAt(c, x, y) {
  const fx = clamp(x / HCELL, 0, HW - 1.001), fy = clamp(y / HCELL, 0, HH - 1.001)
  const i = Math.floor(fx), j = Math.floor(fy), tx = fx - i, ty = fy - j
  const k = j * HW + i
  const bl = (g) => lerp(lerp(g[k], g[k + 1], tx), lerp(g[k + HW], g[k + HW + 1], tx), ty)
  return [bl(c.gx), bl(c.gy)]
}

function build(seed) {
  const rand = mulberry32(seed)
  const r = (a, b) => a + rand() * (b - a)
  const flip = rand() < 0.5
  const fx = (x) => (flip ? W - x : x)
  const nz = noise2(rand)

  const tee = { x: fx(r(70, 120)), y: r(120, H - 120) }
  const hole = { x: fx(r(W - 170, W - 100)), y: r(110, H - 110) }

  // route: a creek with one bridge, or a dogleg or two
  const ctrl = [tee]
  let creek = null
  if (rand() < 0.45) {
    creek = { x: fx(r(W * 0.42, W * 0.58)), amp: r(16, 44), freq: r(0.006, 0.013), phase: r(0, TAU), w: r(15, 22) }
    const by = r(120, H - 120), half = r(21, 27)
    let lo = Infinity, hi = -Infinity
    for (let y = by - half; y <= by + half; y += 2) { const cx = creekX(creek, y); lo = Math.min(lo, cx - creek.w); hi = Math.max(hi, cx + creek.w) }
    creek.bridge = { y: by, half, x0: lo - 7, x1: hi + 7 }
    ctrl.push({ x: creekX(creek, by), y: by })
  } else {
    const n = rand() < 0.5 ? 1 : 2
    for (let i = 1; i <= n; i++) {
      const t = i / (n + 1)
      ctrl.push({ x: lerp(tee.x, hole.x, t) + r(-40, 40), y: clamp(lerp(tee.y, hole.y, t) + r(-170, 170), 90, H - 90) })
    }
  }
  ctrl.push(hole)
  const base = r(30, 42)
  const path = spline(ctrl, 7).map((p, i) => ({ x: p.x, y: p.y, w: clamp(base + nz(i * 0.09, 3.7) * 12, 22, 54) }))
  let length = 0
  for (let i = 1; i < path.length; i++) length += dist(path[i], path[i - 1])
  const greenR = r(54, 68)
  const normal = (i) => {
    const a = path[Math.max(0, i - 2)], b = path[Math.min(path.length - 1, i + 2)]
    const d = Math.hypot(b.x - a.x, b.y - a.y) || 1
    return [-(b.y - a.y) / d, (b.x - a.x) / d]
  }
  const fairMargin = (x, y) => path.reduce((m, s) => Math.min(m, Math.hypot(x - s.x, y - s.y) - s.w), Infinity)
  const inside = (b, pad) => b.x - b.r * 1.3 > pad && b.x + b.r * 1.3 < W - pad && b.y - b.r * 1.3 > pad && b.y + b.r * 1.3 < H - pad
  const nearCreek = (b, pad) => creek && Math.abs(b.x - creekX(creek, b.y)) < creek.w + b.r * 1.3 + pad

  // water
  const ponds = []
  const nPonds = creek ? (rand() < 0.35 ? 1 : 0) : 1 + Math.floor(rand() * 2.2)
  for (let tries = 0; ponds.length < nPonds && tries < 80; tries++) {
    const i = Math.floor(r(0.22, 0.8) * (path.length - 1)), s = path[i], [nx, ny] = normal(i)
    const rad = r(38, 82), side = rand() < 0.5 ? -1 : 1, off = s.w + rad * r(0.1, 1.1)
    const b = blob(rand, s.x + nx * off * side, s.y + ny * off * side, rad)
    if (dist(b, tee) < b.r * 1.3 + 70 || dist(b, hole) < b.r * 1.3 + greenR + 24 || !inside(b, -b.r * 0.5)) continue
    if (nearCreek(b, 30) || ponds.some((p) => dist(p, b) < p.r + b.r)) continue
    ponds.push(b)
  }

  // sand: greenside traps plus fairway bunkers; some are dunes (mounds)
  const sands = []
  const okSand = (b) => !(
    dist(b, tee) < b.r * 1.3 + 55 || dist(b, hole) < b.r * 1.35 + 22 || !inside(b, 8) || nearCreek(b, 12) ||
    ponds.some((p) => dist(p, b) < p.r * 1.3 + b.r * 1.3 + 6) || sands.some((q) => dist(q, b) < q.r + b.r + 4))
  const greenside = 1 + Math.floor(rand() * 2)
  for (let tries = 0; sands.length < greenside && tries < 40; tries++) {
    const ang = r(0, TAU), rad = r(20, 34)
    const b = blob(rand, hole.x + Math.cos(ang) * (greenR + rad * 0.45), hole.y + Math.sin(ang) * (greenR + rad * 0.45), rad)
    if (okSand(b)) sands.push(b)
  }
  const nSand = sands.length + 1 + Math.floor(rand() * 3)
  for (let tries = 0; sands.length < nSand && tries < 80; tries++) {
    const i = Math.floor(r(0.18, 0.88) * (path.length - 1)), s = path[i], [nx, ny] = normal(i)
    const rad = r(22, 46), side = rand() < 0.5 ? -1 : 1, off = s.w * r(-0.3, 1) + rad * 0.5
    const b = blob(rand, s.x + nx * off * side, s.y + ny * off * side, rad)
    if (okSand(b)) sands.push(b)
  }
  for (const b of sands) b.dune = rand() < 0.5 ? r(14, 26) : 0

  // trees, in clusters out in the rough
  const trees = []
  const clusters = 2 + Math.floor(rand() * 4)
  for (let k = 0; k < clusters; k++) {
    let cx = 0, cy = 0, found = false
    for (let t = 0; t < 40 && !found; t++) {
      cx = r(30, W - 30); cy = r(30, H - 30)
      found = fairMargin(cx, cy) > 34 && dist({ x: cx, y: cy }, hole) > greenR + 50 && dist({ x: cx, y: cy }, tee) > 70
    }
    if (!found) continue
    const count = 2 + Math.floor(rand() * 5)
    for (let n = 0, t = 0; n < count && t < 30; t++) {
      const rad = r(9, 15), ang = r(0, TAU), d = r(0, 58)
      const tr = { x: cx + Math.cos(ang) * d, y: cy + Math.sin(ang) * d, r: rad }
      if (tr.x < rad + 4 || tr.x > W - rad - 4 || tr.y < rad + 4 || tr.y > H - rad - 4) continue
      if (fairMargin(tr.x, tr.y) < rad + 10 || dist(tr, hole) < greenR + rad + 16 || dist(tr, tee) < rad + 60) continue
      if (ponds.some((p) => inBlob(p, tr.x, tr.y) || dist(p, tr) < p.r * 1.35 + rad) || sands.some((q) => dist(q, tr) < q.r * 1.35 + rad)) continue
      if (nearCreek({ ...tr, r: rad * 0.8 }, 6) || trees.some((o) => dist(o, tr) < o.r + rad + 2)) continue
      trees.push(tr); n++
    }
  }

  // surface grid (later fills win)
  const surf = new Uint8Array(GW * GH)
  const fillCircle = (x, y, rad, val) => {
    const i0 = clamp(Math.floor((x - rad) / CELL), 0, GW - 1), i1 = clamp(Math.ceil((x + rad) / CELL), 0, GW - 1)
    const j0 = clamp(Math.floor((y - rad) / CELL), 0, GH - 1), j1 = clamp(Math.ceil((y + rad) / CELL), 0, GH - 1)
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
      const px = i * CELL + CELL / 2, py = j * CELL + CELL / 2
      if ((px - x) ** 2 + (py - y) ** 2 < rad * rad) surf[j * GW + i] = val
    }
  }
  const fillBlob = (b, val) => {
    const R = b.r * 1.35
    const i0 = clamp(Math.floor((b.x - R) / CELL), 0, GW - 1), i1 = clamp(Math.ceil((b.x + R) / CELL), 0, GW - 1)
    const j0 = clamp(Math.floor((b.y - R) / CELL), 0, GH - 1), j1 = clamp(Math.ceil((b.y + R) / CELL), 0, GH - 1)
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
      if (inBlob(b, i * CELL + CELL / 2, j * CELL + CELL / 2)) surf[j * GW + i] = val
    }
  }
  for (const s of path) fillCircle(s.x, s.y, s.w, SURF.FAIRWAY)
  fillCircle(hole.x, hole.y, greenR, SURF.GREEN)
  for (const b of sands) fillBlob(b, SURF.SAND)
  for (const b of ponds) fillBlob(b, SURF.WATER)
  if (creek) {
    for (let j = 0; j < GH; j++) {
      const py = j * CELL + CELL / 2, cx = creekX(creek, py)
      const onBridge = Math.abs(py - creek.bridge.y) < creek.bridge.half
      for (let i = Math.max(0, Math.floor((cx - creek.w) / CELL)); i <= Math.min(GW - 1, Math.ceil((cx + creek.w) / CELL)); i++) {
        const px = i * CELL + CELL / 2
        if (onBridge && px > creek.bridge.x0 && px < creek.bridge.x1) surf[j * GW + i] = SURF.BRIDGE
        else if (Math.abs(px - cx) < creek.w) surf[j * GW + i] = SURF.WATER
      }
    }
  }

  // terrain: rolling noise plus sand dunes, flattened at the tee and the cup
  const amp = r(18, 34), sc = r(160, 260)
  const hgt = new Float32Array(HW * HH)
  for (let j = 0; j < HH; j++) for (let i = 0; i < HW; i++) {
    const x = i * HCELL, y = j * HCELL
    let h = (nz(x / sc + 11.3, y / sc + 7.1) + 0.5 * nz(x / (sc / 2) + 31.7, y / (sc / 2) + 3.9)) * amp
    for (const b of sands) if (b.dune) h += b.dune * Math.exp(-((Math.hypot(x - b.x, y - b.y) / (b.r * 0.8)) ** 2) * 2)
    hgt[j * HW + i] = h
  }
  const sampleH = (x, y) => hgt[clamp(Math.round(y / HCELL), 0, HH - 1) * HW + clamp(Math.round(x / HCELL), 0, HW - 1)]
  const hTee = sampleH(tee.x, tee.y), hCup = sampleH(hole.x, hole.y)
  for (let j = 0; j < HH; j++) for (let i = 0; i < HW; i++) {
    const x = i * HCELL, y = j * HCELL, k = j * HW + i
    const dc = Math.hypot(x - hole.x, y - hole.y)
    if (dc < greenR) hgt[k] = hCup + (hgt[k] - hCup) * lerp(0.55, 1, dc / greenR)     // gentler green
    hgt[k] = hTee + (hgt[k] - hTee) * smooth(18, 60, Math.hypot(x - tee.x, y - tee.y))
    hgt[k] = hCup + (hgt[k] - hCup) * smooth(12, 40, dc)
  }
  const gx = new Float32Array(HW * HH), gy = new Float32Array(HW * HH)
  for (let j = 0; j < HH; j++) for (let i = 0; i < HW; i++) {
    const k = j * HW + i
    let ax = (hgt[j * HW + Math.min(HW - 1, i + 1)] - hgt[j * HW + Math.max(0, i - 1)]) / (2 * HCELL)
    let ay = (hgt[Math.min(HH - 1, j + 1) * HW + i] - hgt[Math.max(0, j - 1) * HW + i]) / (2 * HCELL)
    const m = Math.hypot(ax, ay)
    if (m > GMAX) { ax *= GMAX / m; ay *= GMAX / m }
    gx[k] = ax; gy[k] = ay
  }

  // a full putt rolls ~520 units on fairway, ~250 in the rough
  const par = clamp(Math.round(length / 340 + 0.7 + (creek ? 0.4 : 0)), 2, 5)
  return { seed, tee, hole, par, path, greenR, ponds, sands, trees, creek, surf, hgt, gx, gy, HW, HH, HCELL, length }
}

// can a ball roll from the tee to the cup without touching water or trees?
function reachable(c) {
  const RC = 8, RW = W / RC, RH = H / RC
  const offsets = [[0, 0], [BALL_R, 0], [-BALL_R, 0], [0, BALL_R], [0, -BALL_R]]
  const ok = (i, j) => {
    const x = i * RC + RC / 2, y = j * RC + RC / 2
    if (x < BALL_R + 1 || x > W - BALL_R - 1 || y < BALL_R + 1 || y > H - BALL_R - 1) return false
    if (offsets.some(([dx, dy]) => surfaceAt(c, x + dx, y + dy) === SURF.WATER)) return false
    return !c.trees.some((t) => Math.hypot(t.x - x, t.y - y) < t.r + BALL_R)
  }
  const start = [Math.floor(c.tee.x / RC), Math.floor(c.tee.y / RC)]
  const goal = [Math.floor(c.hole.x / RC), Math.floor(c.hole.y / RC)]
  const seen = new Uint8Array(RW * RH)
  const queue = [start]
  seen[start[1] * RW + start[0]] = 1
  for (let q = 0; q < queue.length; q++) {
    const [i, j] = queue[q]
    if (i === goal[0] && j === goal[1]) return true
    for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const ni = i + di, nj = j + dj
      if (ni < 0 || nj < 0 || ni >= RW || nj >= RH || seen[nj * RW + ni] || !ok(ni, nj)) continue
      seen[nj * RW + ni] = 1
      queue.push([ni, nj])
    }
  }
  return false
}

export function generateCourse(seed) {
  for (let attempt = 0; attempt < 40; attempt++) {
    const c = build((seed + attempt * 7919) >>> 0)
    if (reachable(c)) return c
  }
  return build(seed)  // practically unreachable; the course is still drawn and playable by bouncing
}

export function describeCourse(c) {
  const bits = [`Par ${c.par}`]
  if (c.creek) bits.push('a creek with one bridge')
  if (c.ponds.length) bits.push(`${c.ponds.length} pond${c.ponds.length > 1 ? 's' : ''}`)
  if (c.sands.length) bits.push(`${c.sands.length} sand trap${c.sands.length > 1 ? 's' : ''}`)
  if (c.trees.length) bits.push(`${c.trees.length} trees`)
  return `Mini golf course: ${bits.join(', ')}.`
}
