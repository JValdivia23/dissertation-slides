export interface PhotoHome {
  index: number
  x: number
  y: number
  width: number
  height: number
}

export interface PhotoBody extends PhotoHome {
  homeX: number
  homeY: number
  vx: number
  vy: number
  scale: number
  phase: number
  scaleLimit: number
}

export interface PhotoRect {
  left: number
  top: number
  right: number
  bottom: number
}

export interface PhotoZoom {
  index: number
  anchorX: number
  anchorY: number
  originX: number
  originY: number
  initialScale: number
  targetScale: number
  width: number
  height: number
}

export const BREATH_PERIOD = 20
export const ZOOM_IN = 0.42
export const ZOOM_HOLD = 3.1
export const ZOOM_OUT = 0.55
export const ZOOM_DURATION = ZOOM_IN + ZOOM_HOLD + ZOOM_OUT

const MARGIN = 18
const GAP = 8
const clamp = (value: number, low: number, high: number) => Math.max(low, Math.min(high, value))
const smooth = (value: number) => {
  const t = clamp(value, 0, 1)
  return t * t * (3 - 2 * t)
}

export function photoOrder(count: number) {
  let state = 20261015
  const order = Array.from({ length: count }, (_, index) => index)
  for (let i = count - 1; i > 0; i--) {
    state = state + 0x6D2B79F5 | 0
    let value = Math.imul(state ^ state >>> 15, 1 | state)
    value ^= value + Math.imul(value ^ value >>> 7, 61 | value)
    const j = Math.floor(((value ^ value >>> 14) >>> 0) / 4294967296 * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  return order
}

function partitionRows(indices: number[], aspects: number[], count: number) {
  count = Math.min(count, indices.length)
  if (!count) return []
  const sums = [0]
  indices.forEach(index => sums.push(sums[sums.length - 1] + aspects[index]))
  const target = sums[indices.length] / count
  const costs = Array.from({ length: count + 1 }, () => Array(indices.length + 1).fill(Infinity))
  const breaks = Array.from({ length: count + 1 }, () => Array(indices.length + 1).fill(0))
  costs[0][0] = 0
  for (let row = 1; row <= count; row++) {
    for (let end = row; end <= indices.length; end++) {
      for (let start = row - 1; start < end; start++) {
        const cost = costs[row - 1][start] + (sums[end] - sums[start] - target) ** 2
        if (cost < costs[row][end]) {
          costs[row][end] = cost
          breaks[row][end] = start
        }
      }
    }
  }
  const rows: number[][] = []
  let end = indices.length
  for (let row = count; row > 0; row--) {
    const start = breaks[row][end]
    rows.unshift(indices.slice(start, end))
    end = start
  }
  return rows
}

// These are home positions, not fixed animation rows. They also provide the
// full-photo, deterministic layout for overview and reduced-motion views.
export function photoHomes(aspects: number[], width: number, height: number, order = photoOrder(aspects.length)) {
  const marginX = width * 0.025
  const marginY = height * 0.04
  const gap = width * 0.0125
  const centerHeight = height * 0.22
  const bandHeight = (height - marginY * 2 - centerHeight - gap * 2) / 2
  const rowHeight = (bandHeight - gap) / 2
  const homes: PhotoHome[] = []
  const sideIndices = order.filter(index => aspects[index] < 1)
    .slice(0, Math.min(8, Math.max(0, aspects.length - 4)))
  const sideSet = new Set(sideIndices)
  const rows = partitionRows(aspects.map((_, index) => index).filter(index => !sideSet.has(index)), aspects, 4)
  const centers = [marginY + rowHeight / 2, marginY + rowHeight * 1.5 + gap,
    height - marginY - rowHeight * 1.5 - gap, height - marginY - rowHeight / 2]

  function place(indices: number[], left: number, y: number, availableWidth: number, maxHeight: number) {
    if (!indices.length) return
    const totalAspect = indices.reduce((sum, index) => sum + aspects[index], 0)
    const photoHeight = Math.min(maxHeight, (availableWidth - gap * (indices.length - 1)) / totalAspect)
    let x = left + (availableWidth - photoHeight * totalAspect - gap * (indices.length - 1)) / 2
    indices.forEach(index => {
      const photoWidth = photoHeight * aspects[index]
      homes[index] = { index, x: x + photoWidth / 2, y, width: photoWidth, height: photoHeight }
      x += photoWidth + gap
    })
  }
  rows.forEach((row, index) => place(row, marginX, centers[index], width - marginX * 2, rowHeight))
  const sideWidth = width * 0.313 - marginX
  place(sideIndices.filter((_, index) => index % 2 === 0), marginX, height / 2, sideWidth, centerHeight - gap)
  place(sideIndices.filter((_, index) => index % 2 === 1), width - marginX - sideWidth, height / 2, sideWidth, centerHeight - gap)
  return homes
}

export function titleObstacle(width: number, height: number): PhotoRect {
  // Reserve space for the stationary heading, subtitle, and personal messages.
  return { left: width * 0.325, right: width * 0.675, top: height * 0.385, bottom: height * 0.625 }
}

export function photoRect(body: PhotoHome & { scale: number }): PhotoRect {
  const halfWidth = body.width * body.scale / 2
  const halfHeight = body.height * body.scale / 2
  return { left: body.x - halfWidth, right: body.x + halfWidth,
    top: body.y - halfHeight, bottom: body.y + halfHeight }
}

export function rectanglesOverlap(a: PhotoRect, b: PhotoRect) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
}

export function breathingScale(seconds: number, offset: number) {
  if (seconds <= 0) return 1
  const phase = (seconds / BREATH_PERIOD + offset) * Math.PI * 2
  const wave = (Math.sin(phase) + 1) / 2
  // Staggered narrow crests: a few grow while most neighbors stay smaller.
  // Independent full-range sine waves would exceed the available canvas area.
  const target = 0.5 + 1.5 * wave ** 5
  return 1 + (target - 1) * smooth(seconds / 2.2)
}

export function createPhotoSimulation(homes: PhotoHome[], width: number, height: number) {
  const rows = [...new Set(homes.map(home => home.y))].sort((a, b) => a - b)
  const phases = new Map<number, number>()
  rows.forEach((y, row) => {
    const neighbors = homes.filter(home => home.y === y).sort((a, b) => a.x - b.x)
    neighbors.forEach((home, column) => {
      // Nearly opposite phases keep immediate neighbors from cresting together.
      // An irrational spacing and quarter-cycle band offsets avoid synchronized
      // groups that would overcrowd the canvas and force sudden position changes.
      phases.set(home.index, column * (Math.SQRT2 - 1) + row / 4)
    })
  })
  const obstacle = titleObstacle(width, height)
  const barrier = { left: obstacle.left - GAP, right: obstacle.right + GAP,
    top: obstacle.top - GAP, bottom: obstacle.bottom + GAP }
  const bodies: PhotoBody[] = homes.map(home => ({ ...home, homeX: home.x, homeY: home.y,
    vx: 0, vy: 0, scale: 1,
    phase: phases.get(home.index) ?? 0, scaleLimit: 2 }))

  function confine(body: PhotoBody) {
    const halfWidth = body.width * body.scale / 2
    const halfHeight = body.height * body.scale / 2
    const driftX = Math.max(70, body.width * 0.75)
    const driftY = Math.max(90, body.height * 1.2)
    const minX = Math.max(MARGIN + halfWidth, body.homeX - driftX)
    const maxX = Math.min(width - MARGIN - halfWidth, body.homeX + driftX)
    const minY = Math.max(MARGIN + halfHeight, body.homeY - driftY)
    const maxY = Math.min(height - MARGIN - halfHeight, body.homeY + driftY)
    body.x = clamp(body.x, minX, maxX)
    body.y = clamp(body.y, minY, maxY)
    if (!rectanglesOverlap(photoRect(body), barrier)) return
    const options = [
      { x: obstacle.left - GAP - halfWidth, y: body.y },
      { x: obstacle.right + GAP + halfWidth, y: body.y },
      { x: body.x, y: obstacle.top - GAP - halfHeight },
      { x: body.x, y: obstacle.bottom + GAP + halfHeight },
    ].filter(point => point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY)
    options.sort((a, b) => (a.x - body.x) ** 2 + (a.y - body.y) ** 2
      - (b.x - body.x) ** 2 - (b.y - body.y) ** 2)
    if (options[0]) {
      body.x = options[0].x
      body.y = options[0].y
    }
  }

  function step(dt: number, seconds: number) {
    dt = clamp(dt, 0, 1 / 30)
    if (!dt) return
    const scaleResponse = 1 - Math.exp(-dt * 9)
    for (const body of bodies) {
      body.scaleLimit = Math.min(2, body.scaleLimit + dt * 0.45)
      const targetScale = Math.min(body.scaleLimit, breathingScale(seconds, body.phase))
      body.scale += clamp((targetScale - body.scale) * scaleResponse, -dt * 0.7, dt * 0.7)
      body.vx = (body.vx + (body.homeX - body.x) * 8 * dt) * Math.exp(-dt * 7)
      body.vy = (body.vy + (body.homeY - body.y) * 8 * dt) * Math.exp(-dt * 7)
      body.x += clamp(body.vx, -45, 45) * dt
      body.y += clamp(body.vy, -45, 45) * dt
      confine(body)
    }

    // Soft position-based contacts act on the real rectangular photo bounds.
    // Large cards are heavier. Repeated small corrections avoid bouncy,
    // high-speed collisions; home springs are the only source of translation
    // apart from these contacts, not an independent floating animation.
    for (let pass = 0; pass < 24; pass++) {
      for (let i = 0; i < bodies.length; i++) {
        const a = bodies[i]
        for (let j = i + 1; j < bodies.length; j++) {
          const b = bodies[j]
          const dx = b.x - a.x
          const dy = b.y - a.y
          const overlapX = (a.width * a.scale + b.width * b.scale) / 2 + GAP - Math.abs(dx)
          const overlapY = (a.height * a.scale + b.height * b.scale) / 2 + GAP - Math.abs(dy)
          if (overlapX <= 0 || overlapY <= 0) continue
          const massA = 1 / Math.sqrt(a.width * a.height * a.scale ** 2)
          const massB = 1 / Math.sqrt(b.width * b.height * b.scale ** 2)
          const weightA = massA / (massA + massB)
          const weightB = 1 - weightA
          const ax = a.x
          const ay = a.y
          const bx = b.x
          const by = b.y
          function tryAxis(horizontal: boolean) {
            a.x = ax
            a.y = ay
            b.x = bx
            b.y = by
            const correction = (horizontal ? overlapX : overlapY) * 0.85
              * ((horizontal ? dx : dy) >= 0 ? 1 : -1)
            if (horizontal) {
              a.x -= correction * weightA
              b.x += correction * weightB
            }
            else {
              a.y -= correction * weightA
              b.y += correction * weightB
            }
            confine(a)
            confine(b)
            const remainingX = (a.width * a.scale + b.width * b.scale) / 2 + GAP - Math.abs(b.x - a.x)
            const remainingY = (a.height * a.scale + b.height * b.scale) / 2 + GAP - Math.abs(b.y - a.y)
            const movement = Math.hypot(a.x - ax, a.y - ay) + Math.hypot(b.x - bx, b.y - by)
            return { ax: a.x, ay: a.y, bx: b.x, by: b.y,
              score: Math.max(0, Math.min(remainingX, remainingY)) + movement * 0.03 }
          }
          // If the nearest-axis correction is blocked by an edge or the title,
          // use the other axis rather than repeatedly pushing into that wall.
          const horizontal = tryAxis(true)
          const vertical = tryAxis(false)
          const chosen = horizontal.score <= vertical.score ? horizontal : vertical
          a.x = chosen.ax
          a.y = chosen.ay
          b.x = chosen.bx
          b.y = chosen.by
        }
      }
      bodies.forEach(confine)
    }

    // Crowded neighbors yield in size as well as position. Start inside the
    // contact gap, before photographs overlap, and limit contraction per frame
    // so the pressure response remains smooth. The limit recovers between crests.
    const yielded = new Map<number, number>()
    for (let i = 0; i < bodies.length; i++) {
      const a = bodies[i]
      for (let j = i + 1; j < bodies.length; j++) {
        const b = bodies[j]
        const overlapX = (a.width * a.scale + b.width * b.scale) / 2 + GAP - Math.abs(b.x - a.x)
        const overlapY = (a.height * a.scale + b.height * b.scale) / 2 + GAP - Math.abs(b.y - a.y)
        if (overlapX <= 0.5 || overlapY <= 0.5) continue
        const candidates = [a, b].filter(body => body.scale > 0.5)
          .sort((left, right) => breathingScale(seconds, left.phase) - breathingScale(seconds, right.phase))
        for (const body of candidates) {
          const budget = Math.max(0, dt * 1.8 - (yielded.get(body.index) ?? 0))
          const dimension = overlapX < overlapY ? body.width : body.height
          const reduction = Math.min(body.scale - 0.5, budget, Math.min(overlapX, overlapY) * 2 / dimension)
          if (reduction <= 0) continue
          body.scale -= reduction
          body.scaleLimit = Math.min(body.scaleLimit, body.scale)
          yielded.set(body.index, (yielded.get(body.index) ?? 0) + reduction)
          break
        }
      }
    }
  }

  return { bodies, step }
}

// Choose an expansion origin in the existing card, not a new spotlight position.
// Each candidate stays inside one clear lane around the central heading. Keeping
// this anchor fixed throughout the zoom also makes every intermediate frame safe.
export function photoZoom(body: PhotoBody, width: number, height: number): PhotoZoom {
  const obstacle = titleObstacle(width, height)
  const rect = photoRect(body)
  const lanes: PhotoRect[] = [
    { left: MARGIN, top: MARGIN, right: obstacle.left - 4, bottom: height - MARGIN },
    { left: obstacle.right + 4, top: MARGIN, right: width - MARGIN, bottom: height - MARGIN },
    { left: MARGIN, top: MARGIN, right: width - MARGIN, bottom: obstacle.top - 4 },
    { left: MARGIN, top: obstacle.bottom + 4, right: width - MARGIN, bottom: height - MARGIN },
  ]
  const desired = Math.min(width * 0.35 / body.width, height * 0.69 / body.height, 4.4)
  let best: PhotoZoom = { index: body.index, anchorX: body.x, anchorY: body.y,
    originX: 0.5, originY: 0.5, initialScale: body.scale, targetScale: body.scale,
    width: body.width, height: body.height }
  let bestScore = -Infinity
  for (const lane of lanes) {
    if (rect.left < lane.left - 0.01 || rect.right > lane.right + 0.01
      || rect.top < lane.top - 0.01 || rect.bottom > lane.bottom + 0.01) continue
    for (const originX of [0, 0.5, 1]) {
      for (const originY of [0, 0.5, 1]) {
        const anchorX = rect.left + (rect.right - rect.left) * originX
        const anchorY = rect.top + (rect.bottom - rect.top) * originY
        let capacity = desired
        if (originX) capacity = Math.min(capacity, (anchorX - lane.left) / (body.width * originX))
        if (originX < 1) capacity = Math.min(capacity, (lane.right - anchorX) / (body.width * (1 - originX)))
        if (originY) capacity = Math.min(capacity, (anchorY - lane.top) / (body.height * originY))
        if (originY < 1) capacity = Math.min(capacity, (lane.bottom - anchorY) / (body.height * (1 - originY)))
        const targetScale = Math.max(body.scale, capacity)
        const score = targetScale / body.scale - (Math.abs(originX - 0.5) + Math.abs(originY - 0.5)) * 0.04
        if (score > bestScore) {
          bestScore = score
          best = { ...best, anchorX, anchorY, originX, originY, targetScale }
        }
      }
    }
  }
  return best
}

export function zoomRect(zoom: PhotoZoom, age: number): PhotoRect {
  const progress = age < ZOOM_IN ? 1 - (1 - clamp(age / ZOOM_IN, 0, 1)) ** 3
    : age < ZOOM_IN + ZOOM_HOLD ? 1 : 1 - smooth((age - ZOOM_IN - ZOOM_HOLD) / ZOOM_OUT)
  const scale = zoom.initialScale + (zoom.targetScale - zoom.initialScale) * progress
  const width = zoom.width * scale
  const height = zoom.height * scale
  const left = zoom.anchorX - width * zoom.originX
  const top = zoom.anchorY - height * zoom.originY
  return { left, top, right: left + width, bottom: top + height }
}

export function zoomOpacity(age: number) {
  return 1 - smooth((age - ZOOM_IN - ZOOM_HOLD) / ZOOM_OUT)
}
