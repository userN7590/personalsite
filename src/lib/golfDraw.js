import { W, H, BALL_R, CUP_R, blobRadius, creekX, mulberry32 } from './golfCourse'

// Static course art, drawn once per course/size into an offscreen layer.
// Muted greens so the course sits comfortably inside the dark site.

const TAU = Math.PI * 2
const C = {
  rough: '#1c3a22', fairway: '#2b6534', fringe: '#2f7339', green: '#3a8646',
  sand: '#c4ad78', sandEdge: '#9c8656', water: '#1b4a72', waterDeep: '#143a5c', waterEdge: '#79acd8',
  wood: '#86643f', woodDark: '#5c4329', canopy: '#16391d', canopyHi: '#2d6236',
}

function blobPath(b, n = 64) {
  const p = new Path2D()
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * TAU, r = blobRadius(b, a)
    const x = b.x + Math.cos(a) * r, y = b.y + Math.sin(a) * r
    if (i === 0) p.moveTo(x, y); else p.lineTo(x, y)
  }
  p.closePath()
  return p
}

function creekPath(c) {
  const p = new Path2D()
  for (let y = -4; y <= H + 4; y += 6) { const x = creekX(c, y) - c.w; if (y === -4) p.moveTo(x, y); else p.lineTo(x, y) }
  for (let y = H + 4; y >= -4; y -= 6) p.lineTo(creekX(c, y) + c.w, y)
  p.closePath()
  return p
}

function stripes(ctx, gap, color, angle) {
  ctx.save()
  ctx.translate(W / 2, H / 2)
  ctx.rotate(angle)
  ctx.fillStyle = color
  for (let x = -W; x < W; x += gap * 2) ctx.fillRect(x, -H, gap, H * 2)
  ctx.restore()
}

// light from the top left; white where a slope faces it, black where it faces away
function hillshade(c) {
  const cv = document.createElement('canvas')
  cv.width = c.HW; cv.height = c.HH
  const g = cv.getContext('2d')
  const img = g.createImageData(c.HW, c.HH)
  const L = [-0.55, -0.6, 0.58], E = 2.4
  const flat = L[2] / Math.hypot(...L)
  for (let k = 0; k < c.HW * c.HH; k++) {
    const nx = -c.gx[k] * E, ny = -c.gy[k] * E, nl = Math.hypot(nx, ny, 1)
    const s = (nx * L[0] + ny * L[1] + L[2]) / (nl * Math.hypot(...L)) - flat
    const a = Math.min(1, Math.abs(s) * 1.6)
    const v = s > 0 ? 255 : 0
    img.data[k * 4] = img.data[k * 4 + 1] = img.data[k * 4 + 2] = v
    img.data[k * 4 + 3] = a * (s > 0 ? 62 : 100)
  }
  g.putImageData(img, 0, 0)
  return cv
}

export function drawCourse(ctx, c, k) {
  ctx.save()
  ctx.setTransform(k, 0, 0, k, 0, 0)
  const rand = mulberry32(c.seed ^ 0x5bd1e995)

  // rough, speckled
  ctx.fillStyle = C.rough
  ctx.fillRect(0, 0, W, H)
  for (let i = 0; i < 1600; i++) {
    ctx.fillStyle = rand() < 0.5 ? 'rgba(255,255,255,.035)' : 'rgba(0,0,0,.14)'
    ctx.fillRect(rand() * W, rand() * H, 1.7, 1.7)
  }

  // fairway: a union of circles along the route, with mowing stripes
  const fair = new Path2D()
  for (const s of c.path) { fair.moveTo(s.x + s.w, s.y); fair.arc(s.x, s.y, s.w, 0, TAU) }
  ctx.fillStyle = C.fairway
  ctx.fill(fair)
  ctx.save(); ctx.clip(fair); stripes(ctx, 16, 'rgba(255,255,255,.045)', -0.5); ctx.restore()

  // green with a fringe
  ctx.beginPath(); ctx.arc(c.hole.x, c.hole.y, c.greenR + 5, 0, TAU); ctx.fillStyle = C.fringe; ctx.fill()
  const green = new Path2D(); green.arc(c.hole.x, c.hole.y, c.greenR, 0, TAU)
  ctx.fillStyle = C.green; ctx.fill(green)
  ctx.save(); ctx.clip(green); stripes(ctx, 7, 'rgba(255,255,255,.04)', 0.9); ctx.restore()

  // sand with wind ripples; dunes get tighter ripples
  for (const b of c.sands) {
    const p = blobPath(b)
    ctx.fillStyle = C.sand; ctx.fill(p)
    ctx.save(); ctx.clip(p)
    ctx.strokeStyle = 'rgba(80,60,30,.16)'; ctx.lineWidth = 1
    const step = b.dune ? 4.5 : 7
    for (let rr = step; rr < b.r * 1.6; rr += step) {
      ctx.beginPath(); ctx.ellipse(b.x + b.r * 0.15, b.y - b.r * 0.1, rr * 1.15, rr * 0.8, 0.4, 0, TAU); ctx.stroke()
    }
    ctx.restore()
    ctx.strokeStyle = C.sandEdge; ctx.lineWidth = 1.6; ctx.stroke(p)
  }

  // terrain shading over turf and sand (water stays flat)
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(hillshade(c), -c.HCELL / 2, -c.HCELL / 2, c.HW * c.HCELL, c.HH * c.HCELL)  // pixel i centred on node i

  // water
  const water = [...c.ponds.map((b) => blobPath(b))]
  if (c.creek) water.push(creekPath(c.creek))
  for (const p of water) {
    const grad = ctx.createLinearGradient(0, 0, W * 0.3, H)
    grad.addColorStop(0, C.water); grad.addColorStop(1, C.waterDeep)
    ctx.fillStyle = grad; ctx.fill(p)
    ctx.save(); ctx.clip(p)
    ctx.strokeStyle = 'rgba(255,255,255,.07)'; ctx.lineWidth = 1.2
    for (let i = 0; i < 26; i++) {
      const x = rand() * W, y = rand() * H, l = 6 + rand() * 12
      ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + l / 2, y - 2, x + l, y); ctx.stroke()
    }
    ctx.restore()
    ctx.strokeStyle = C.waterEdge; ctx.globalAlpha = 0.55; ctx.lineWidth = 2; ctx.stroke(p); ctx.globalAlpha = 1
  }

  // bridge over the creek
  if (c.creek) {
    const { x0, x1, y, half } = c.creek.bridge
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(x0 + 2, y - half + 3, x1 - x0, half * 2)
    ctx.fillStyle = C.wood; ctx.fillRect(x0, y - half, x1 - x0, half * 2)
    ctx.strokeStyle = 'rgba(0,0,0,.28)'; ctx.lineWidth = 1
    for (let x = x0 + 5; x < x1; x += 5.5) { ctx.beginPath(); ctx.moveTo(x, y - half); ctx.lineTo(x, y + half); ctx.stroke() }
    ctx.fillStyle = C.woodDark
    ctx.fillRect(x0, y - half - 2, x1 - x0, 3); ctx.fillRect(x0, y + half - 1, x1 - x0, 3)
  }

  // tee box
  ctx.save()
  ctx.translate(c.tee.x, c.tee.y)
  ctx.fillStyle = 'rgba(255,255,255,.07)'; ctx.fillRect(-16, -16, 32, 32)
  ctx.fillStyle = '#e9e8e2'
  ctx.beginPath(); ctx.arc(-13, -13, 2.4, 0, TAU); ctx.arc(-13, 13, 2.4, 0, TAU); ctx.fill()
  ctx.restore()

  // trees: shadow, canopy, highlight
  for (const t of c.trees) {
    ctx.fillStyle = 'rgba(0,0,0,.32)'
    ctx.beginPath(); ctx.ellipse(t.x + t.r * 0.35, t.y + t.r * 0.45, t.r * 1.05, t.r * 0.9, 0, 0, TAU); ctx.fill()
  }
  for (const t of c.trees) {
    const g = ctx.createRadialGradient(t.x - t.r * 0.35, t.y - t.r * 0.4, t.r * 0.1, t.x, t.y, t.r)
    g.addColorStop(0, C.canopyHi); g.addColorStop(1, C.canopy)
    ctx.fillStyle = g
    ctx.beginPath(); ctx.arc(t.x, t.y, t.r, 0, TAU); ctx.fill()
  }

  // cup
  ctx.fillStyle = 'rgba(0,0,0,.3)'
  ctx.beginPath(); ctx.arc(c.hole.x + 0.8, c.hole.y + 1.2, CUP_R + 1.5, 0, TAU); ctx.fill()
  const cup = ctx.createRadialGradient(c.hole.x, c.hole.y - 3, 1, c.hole.x, c.hole.y, CUP_R)
  cup.addColorStop(0, '#000'); cup.addColorStop(0.75, '#070707'); cup.addColorStop(1, '#262626')
  ctx.fillStyle = cup
  ctx.beginPath(); ctx.arc(c.hole.x, c.hole.y, CUP_R, 0, TAU); ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,.45)'; ctx.lineWidth = 1
  ctx.beginPath(); ctx.arc(c.hole.x, c.hole.y, CUP_R, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke()

  // border
  ctx.strokeStyle = 'rgba(0,0,0,.55)'; ctx.lineWidth = 6
  ctx.strokeRect(0, 0, W, H)
  ctx.restore()
}

// flagstick, faded when the ball is close so the cup stays readable
export function drawFlag(ctx, c, ballDist, t) {
  const { x, y } = c.hole
  const a = ballDist < 60 ? 0.3 + 0.7 * (ballDist / 60) : 1
  ctx.save()
  ctx.globalAlpha = a
  ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.lineWidth = 2
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 22, y + 12); ctx.stroke()
  ctx.strokeStyle = '#ecebe5'; ctx.lineWidth = 2; ctx.lineCap = 'round'
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 40); ctx.stroke()
  const wave = Math.sin(t * 0.004) * 2.5
  ctx.fillStyle = '#ef4444'
  ctx.beginPath(); ctx.moveTo(x + 1, y - 40); ctx.quadraticCurveTo(x + 13, y - 36 + wave, x + 24, y - 33 + wave); ctx.lineTo(x + 1, y - 26); ctx.closePath(); ctx.fill()
  ctx.restore()
}

export function drawBall(ctx, x, y, scale = 1) {
  if (scale <= 0) return
  const r = BALL_R * scale
  ctx.fillStyle = 'rgba(0,0,0,.4)'
  ctx.beginPath(); ctx.ellipse(x + 1.6, y + 2.2, r, r * 0.85, 0, 0, TAU); ctx.fill()
  const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r)
  g.addColorStop(0, '#ffffff'); g.addColorStop(0.5, '#ecebe6'); g.addColorStop(1, '#b4b3ac')
  ctx.fillStyle = g
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill()
}

// aim: dotted line in the shot direction, coloured blue → red with power
export function drawAim(ctx, x, y, dx, dy, power) {
  const len = 22 + power * 150
  const col = `hsl(${218 - power * 214} 95% ${62 - power * 4}%)`
  ctx.save()
  ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 2.2
  ctx.setLineDash([3, 5]); ctx.lineCap = 'round'
  ctx.beginPath(); ctx.moveTo(x + dx * (BALL_R + 4), y + dy * (BALL_R + 4)); ctx.lineTo(x + dx * len, y + dy * len); ctx.stroke()
  ctx.setLineDash([])
  const hx = x + dx * (len + 6), hy = y + dy * (len + 6)
  ctx.beginPath()
  ctx.moveTo(hx, hy)
  ctx.lineTo(hx - dx * 9 - dy * 5, hy - dy * 9 + dx * 5)
  ctx.lineTo(hx - dx * 9 + dy * 5, hy - dy * 9 - dx * 5)
  ctx.closePath(); ctx.fill()
  ctx.restore()
}

export function drawRings(ctx, x, y, p, color) {
  ctx.save()
  ctx.strokeStyle = color
  for (const off of [0, 0.25]) {
    const q = Math.min(1, Math.max(0, (p - off) / (1 - off)))
    if (q <= 0 || q >= 1) continue
    ctx.globalAlpha = 1 - q
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.arc(x, y, 4 + q * 26, 0, TAU); ctx.stroke()
  }
  ctx.restore()
}
