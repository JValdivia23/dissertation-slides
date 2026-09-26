import {
  Arrow,
  Circle,
  FadeIn,
  FadeOut,
  Line,
  Polygon,
  Rectangle,
  Scene,
  Square,
  Transform,
  UpdateFromAlphaFunc,
  VGroup,
  linear,
} from 'manim-web'

const BACKGROUND = '#101b2b'
const GOLD = '#cfb87c'
const GRID = '#52667b'
const CELL_SIZE = 0.53
const GRID_SIZE = 7
const GAUSSIAN_WEIGHTS = Array.from({ length: 3 }, (_, row) =>
  Array.from({ length: 3 }, (_, col) => Math.exp(-((row - 1) ** 2 + (col - 1) ** 2) / (2 * 0.85 ** 2))))
const SCAN_ORDER: Array<[number, number]> = Array.from({ length: GRID_SIZE }, (_, row) =>
  Array.from({ length: GRID_SIZE }, (_, offset): [number, number] =>
    [row, row % 2 === 0 ? offset : GRID_SIZE - 1 - offset])).flat()

function clamp(index: number) {
  return Math.max(0, Math.min(GRID_SIZE - 1, index))
}

function sampleField() {
  const speckle = [
    [0.06, -0.10, 0.08, -0.05, 0.15, -0.06, 0.04],
    [-0.04, 0.12, -0.10, 0.09, -0.08, 0.13, -0.09],
    [0.10, -0.12, 0.13, -0.11, 0.10, -0.07, 0.12],
    [-0.08, 0.11, -0.09, 0.16, -0.11, 0.11, -0.05],
    [0.12, -0.07, 0.10, -0.08, 0.14, -0.09, 0.09],
    [-0.09, 0.10, -0.07, 0.12, -0.09, 0.12, -0.08],
    [0.07, -0.09, 0.13, -0.07, 0.11, -0.07, 0.06],
  ]
  return speckle.map((row, i) => row.map((noise, j) => {
    const broadFeature = 0.6 * Math.exp(-((i - 3.1) ** 2 + (j - 3.6) ** 2) / 6)
    return Math.max(0.04, Math.min(0.96, 0.18 + broadFeature + noise))
  }))
}

function smooth(field: number[][], weights: number[][], row: number, col: number) {
  let total = 0
  let weightSum = 0
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const weight = weights[i + 1][j + 1]
      total += field[clamp(row + i)][clamp(col + j)] * weight
      weightSum += weight
    }
  }
  return total / weightSum
}

function fieldColor(value: number) {
  const low = [36, 68, 95]
  const high = [222, 226, 192]
  return `rgb(${low.map((channel, i) => Math.round(channel + (high[i] - channel) * value)).join(',')})`
}

export interface PreviewRect {
  x: number
  y: number
  w: number
  h: number
  fill: string
  fillOpacity?: number
  stroke?: string
  strokeWidth?: number
}

export interface PreviewLine {
  x1: number
  y1: number
  x2: number
  y2: number
}

export interface PreviewTip {
  x: number
  y: number
}

// Standard Manim-style arrow geometry shared by the scene and the preview:
// a shaft ending at the tip base plus a filled triangular tip.
export const ARROW_START: [number, number, number] = [-0.9, 0, 0]
export const ARROW_END: [number, number, number] = [0.9, 0, 0]
const ARROW_STROKE_WIDTH = 6
const ARROW_TIP_LENGTH = 0.35
const ARROW_TIP_WIDTH = 0.2

// First-frame overlay geometry in 1080x390 display pixels, derived from the
// same parameters as the Manim scene so the static frame matches click 1.
const DISPLAY_W = 1080
const DISPLAY_H = 390
const FRAME_W = 14
const FRAME_H = 5.05

function previewX(x: number) {
  return (x + FRAME_W / 2) * DISPLAY_W / FRAME_W
}

function previewY(y: number) {
  return (FRAME_H / 2 - y) * DISPLAY_H / FRAME_H
}

function previewRect(cx: number, cy: number, w: number, h: number, rect: Omit<PreviewRect, 'x' | 'y' | 'w' | 'h'>): PreviewRect {
  const round = (value: number) => Math.round(value * 10) / 10
  return {
    x: round(previewX(cx) - w * DISPLAY_W / FRAME_W / 2),
    y: round(previewY(cy) - h * DISPLAY_H / FRAME_H / 2),
    w: round(w * DISPLAY_W / FRAME_W),
    h: round(h * DISPLAY_H / FRAME_H),
    ...rect,
  }
}

function buildCartesianPreview() {
  const input = sampleField()
  const center = cellPosition(3, 3, -3.7)
  const span = 3 * CELL_SIZE
  const thick = 0.075
  const ext = 0.06
  const previewInput: PreviewRect[] = []
  const backing: PreviewRect[] = []
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const [ix, iy] = cellPosition(row, col, -3.7)
      previewInput.push(previewRect(ix, iy, CELL_SIZE - 0.025, CELL_SIZE - 0.025, {
        fill: fieldColor(input[row][col]),
        stroke: '#243548',
        strokeWidth: 1.2,
      }))
      const [ox, oy] = cellPosition(row, col, 3.7)
      backing.push(previewRect(ox, oy, CELL_SIZE - 0.025, CELL_SIZE - 0.025, {
        fill: '#1c2d40',
        stroke: '#364a5f',
        strokeWidth: 1.2,
      }))
    }
  }
  const tint = Array.from({ length: 3 }, (_, i) => Array.from({ length: 3 }, (_, j) => {
    const [cx, cy] = [center[0] + (j - 1) * CELL_SIZE, center[1] + (1 - i) * CELL_SIZE]
    return previewRect(cx, cy, CELL_SIZE - 0.035, CELL_SIZE - 0.035, { fill: GOLD, fillOpacity: 0.25 })
  })).flat()
  const bars = [
    previewRect(center[0], center[1] + span / 2, span + 2 * ext, thick, { fill: GOLD }),
    previewRect(center[0], center[1] - span / 2, span + 2 * ext, thick, { fill: GOLD }),
    previewRect(center[0] - span / 2, center[1], thick, span + 2 * ext, { fill: GOLD }),
    previewRect(center[0] + span / 2, center[1], thick, span + 2 * ext, { fill: GOLD }),
  ]
  const roundCoord = (value: number) => Math.round(value * 10) / 10
  const tipBaseX = ARROW_END[0] - ARROW_TIP_LENGTH
  const arrowShaft: PreviewLine = {
    x1: roundCoord(previewX(ARROW_START[0])),
    y1: roundCoord(previewY(ARROW_START[1])),
    x2: roundCoord(previewX(tipBaseX)),
    y2: roundCoord(previewY(ARROW_END[1])),
  }
  const arrowTip: PreviewTip[] = [
    { x: roundCoord(previewX(ARROW_END[0])), y: roundCoord(previewY(ARROW_END[1])) },
    { x: roundCoord(previewX(tipBaseX)), y: roundCoord(previewY(ARROW_TIP_WIDTH)) },
    { x: roundCoord(previewX(tipBaseX)), y: roundCoord(previewY(-ARROW_TIP_WIDTH)) },
  ]
  return { input: previewInput, tint, bars, backing, arrowShaft, arrowTip }
}

export const cartesianPreview = buildCartesianPreview()

function cellPosition(row: number, col: number, centerX: number): [number, number, number] {
  return [centerX + (col - 3) * CELL_SIZE, (3 - row) * CELL_SIZE, 0]
}

function fieldCell(row: number, col: number, centerX: number, value: number) {
  return new Square({
    sideLength: CELL_SIZE - 0.025,
    center: cellPosition(row, col, centerX),
    color: '#243548',
    fillOpacity: 1,
    strokeWidth: 1.2,
  })
    .setStyle({
      strokeColor: '#243548',
      strokeWidth: 1.2,
    })
    .setFill(fieldColor(value), 1)
}

function kernel(center: [number, number, number], gaussian = false) {
  const weights = gaussian
    ? GAUSSIAN_WEIGHTS
    : [[1, 1, 1], [1, 1, 1], [1, 1, 1]]
  // NOTE: fill meshes multiply stroke opacity (_opacity) with fillOpacity,
  // so never set strokeOpacity: 0 here -- it would erase the fill as well.
  // strokeWidth: 0 skips stroke geometry while keeping fills visible.
  const tiles = weights.flatMap((row, i) => row.map((weight, j) => new Square({
    sideLength: CELL_SIZE - 0.035,
    center: [center[0] + (j - 1) * CELL_SIZE, center[1] + (1 - i) * CELL_SIZE, 0],
    color: GOLD,
    fillOpacity: gaussian ? 0.07 + 0.55 * weight : 0.25,
    strokeWidth: 0,
  }).setStyle({
    strokeColor: GOLD,
    strokeWidth: 0,
  }).setFill(GOLD, gaussian ? 0.07 + 0.55 * weight : 0.25)))
  // Stroked outlines lose their vertical edges over bright cells in this
  // renderer, so the reticle is built from filled bars (standard mesh path).
  const span = 3 * CELL_SIZE
  const thick = 0.075
  const ext = 0.06
  const [cx, cy, cz] = center
  const bar = (width: number, height: number, x: number, y: number) => new Rectangle({
    width,
    height,
    center: [x, y, cz],
    color: GOLD,
    fillOpacity: 1,
    strokeWidth: 0,
  }).setStyle({
    strokeColor: GOLD,
    strokeWidth: 0,
  }).setFill(GOLD, 1)
  const bars = [
    bar(span + 2 * ext, thick, cx, cy + span / 2),
    bar(span + 2 * ext, thick, cx, cy - span / 2),
    bar(thick, span + 2 * ext, cx - span / 2, cy),
    bar(thick, span + 2 * ext, cx + span / 2, cy),
  ]
  return new VGroup(...tiles, ...bars)
}

// The grid cells and the kernel are created lazily and can end up tied in
// draw order, which lets bright cells cover the kernel outline mid-sweep.
// Pinning render orders keeps the kernel (then its weight markers) on top.
function pinToFront(window: VGroup, markers?: VGroup) {
  const layers: Array<[VGroup, number]> = markers
    ? [[window, 9999], [markers, 10000]]
    : [[window, 9999]]
  for (const [group, order] of layers) {
    const host = group.getThreeObject()
    host.renderOrder = order
    host.traverse((object: { renderOrder: number }) => { object.renderOrder = order })
  }
}

function scan(window: VGroup, outputCells: Square[], alpha: number, markers?: VGroup) {
  const progress = Math.min(SCAN_ORDER.length - 1, alpha * (SCAN_ORDER.length - 1))
  const reached = Math.floor(progress)
  const [row, col] = SCAN_ORDER[reached]
  const [nextRow, nextCol] = SCAN_ORDER[Math.min(reached + 1, SCAN_ORDER.length - 1)]
  const start = cellPosition(row, col, -3.7)
  const end = cellPosition(nextRow, nextCol, -3.7)
  const fraction = progress - reached
  const position: [number, number, number] = [
    start[0] + (end[0] - start[0]) * fraction,
    start[1] + (end[1] - start[1]) * fraction,
    0,
  ]
  window.moveTo(position)
  markers?.moveTo(position)
  pinToFront(window, markers)

  // The next value appears only when the window reaches that cell.
  for (let index = 0; index <= reached; index++) {
    const [outputRow, outputCol] = SCAN_ORDER[index]
    outputCells[outputRow * GRID_SIZE + outputCol].setStrokeOpacity(1)
  }
}

function sweepFromCenter(window: VGroup, outputCells: Square[], alpha: number, markers?: VGroup) {
  const resetFraction = 0.08
  if (alpha < resetFraction) {
    const center = cellPosition(3, 3, -3.7)
    const upperLeft = cellPosition(0, 0, -3.7)
    const progress = alpha / resetFraction
    const position: [number, number, number] = [
      center[0] + (upperLeft[0] - center[0]) * progress,
      center[1] + (upperLeft[1] - center[1]) * progress,
      0,
    ]
    window.moveTo(position)
    markers?.moveTo(position)
    pinToFront(window, markers)
    return
  }
  scan(window, outputCells, (alpha - resetFraction) / (1 - resetFraction), markers)
}

// This is a deliberately synthetic, complete field. Missing-data handling is
// introduced later in the paper segment, not implied by this illustration.
export async function cartesianConvolution() {
  const scene = new Scene(document.getElementById('container'), {
    width: 1080,
    height: 390,
    frameWidth: 14,
    frameHeight: 5.05,
    backgroundColor: BACKGROUND,
  })
  const input = sampleField()
  const boxcar = Array.from({ length: 3 }, () => [1, 1, 1])
  const inputCells: Square[] = []
  const outputBacking: Square[] = []
  const outputCells: Square[] = []
  const gaussianCells: Square[] = []
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      inputCells.push(fieldCell(row, col, -3.7, input[row][col]))
      outputBacking.push(new Square({
        sideLength: CELL_SIZE - 0.025,
        center: cellPosition(row, col, 3.7),
        color: '#1c2d40',
        fillOpacity: 1,
      }).setStyle({ fillColor: '#1c2d40', fillOpacity: 1, strokeColor: '#364a5f', strokeWidth: 1.2 }))
      outputCells.push(fieldCell(row, col, 3.7, smooth(input, boxcar, row, col)))
      gaussianCells.push(fieldCell(row, col, 3.7, smooth(input, GAUSSIAN_WEIGHTS, row, col)))
    }
  }

  const centerPosition = cellPosition(3, 3, -3.7)
  const window = kernel(centerPosition)
  const gaussianMarkers = new VGroup(...GAUSSIAN_WEIGHTS.flatMap((row, i) =>
    row.map((weight, j) => new Circle({
      radius: 0.04 + 0.18 * weight,
      center: cellPosition(i + 2, j + 2, -3.7),
      color: '#fff1c4',
      fillOpacity: 0.8,
      strokeWidth: 0,
    }))))
  const arrow = new Arrow({
    start: ARROW_START,
    end: ARROW_END,
    color: GOLD,
    strokeWidth: ARROW_STROKE_WIDTH,
    tipLength: ARROW_TIP_LENGTH,
    tipWidth: ARROW_TIP_WIDTH,
  })

  const boxcarExample = fieldCell(3, 3, 3.7, smooth(input, boxcar, 3, 3))
  const gaussianExample = fieldCell(3, 3, 3.7, smooth(input, GAUSSIAN_WEIGHTS, 3, 3))

  // The static preview matches this initial state. One play() is one Slidev click.
  scene.add(new VGroup(...inputCells), new VGroup(...outputBacking), window, arrow)
  await scene.play(new FadeIn(boxcarExample, { duration: 0.5 }))
  pinToFront(window)

  const boxcarOutput = new VGroup(...outputCells)
  outputCells.forEach(cell => cell.setStrokeOpacity(0))
  scene.add(boxcarOutput)
  await scene.play(
    new FadeOut(boxcarExample, { duration: 0.25 }),
    new UpdateFromAlphaFunc(
      window,
      (_, alpha) => sweepFromCenter(window, outputCells, alpha),
      { duration: 5.7, rateFunc: linear },
    ),
  )

  await scene.play(
    new Transform(window, kernel(centerPosition, true), { duration: 0.85 }),
    new FadeOut(boxcarOutput, { duration: 0.85 }),
    new FadeIn(gaussianExample, { duration: 0.85 }),
    new FadeIn(gaussianMarkers, { duration: 0.85 }),
  )
  pinToFront(window, gaussianMarkers)

  const gaussianOutput = new VGroup(...gaussianCells)
  gaussianCells.forEach(cell => cell.setStrokeOpacity(0))
  scene.add(gaussianOutput)
  await scene.play(
    new FadeOut(gaussianExample, { duration: 0.25 }),
    new UpdateFromAlphaFunc(
      window,
      (_, alpha) => sweepFromCenter(window, gaussianCells, alpha, gaussianMarkers),
      { duration: 5.7, rateFunc: linear },
    ),
  )
}

const RADAR: [number, number, number] = [-5.45, 0, 0]

function polarPoint(range: number, angle: number): [number, number, number] {
  return [RADAR[0] + range * Math.cos(angle), range * Math.sin(angle), 0]
}

function svgPoint([x, y]: [number, number, number]) {
  return `${((x + 7) * 1080 / 14).toFixed(1)},${((5.05 / 2 - y) * 390 / 5.05).toFixed(1)}`
}

function svgPath(points: [number, number, number][], closed = false) {
  return `M${points.map(svgPoint).join(' L')}${closed ? ' Z' : ''}`
}

const windowAngles = Array.from({ length: 13 }, (_, i) => -0.15 + 0.3 * i / 12)
const [radarX, radarY] = svgPoint(RADAR).split(',').map(Number)
export const polarPreview = {
  rays: Array.from({ length: 9 }, (_, i) => svgPath([RADAR, polarPoint(9.8, (i - 4) * 0.1)])),
  arcs: Array.from({ length: 19 }, (_, i) => svgPath(
    Array.from({ length: 25 }, (_, j) => polarPoint(2.4 + i * 0.4, (j - 12) * 0.0333)),
  )),
  near: svgPath([
    ...windowAngles.map(angle => polarPoint(4.4, angle)),
    ...windowAngles.slice().reverse().map(angle => polarPoint(3.2, angle)),
  ], true),
  chord: svgPath([polarPoint(3.8, -0.15), polarPoint(3.8, 0.15)]),
  radar: { x: radarX, y: radarY },
}

function footprint(inner: number, outer: number, halfAngle: number, color: string, fillOpacity = 0.2) {
  const angles = Array.from({ length: 13 }, (_, i) => -halfAngle + (2 * halfAngle * i) / 12)
  return new Polygon({
    vertices: [
      ...angles.map(angle => polarPoint(outer, angle)),
      ...angles.slice().reverse().map(angle => polarPoint(inner, angle)),
    ],
    color,
    fillOpacity,
    strokeWidth: 5,
  }).setStyle({ fillColor: color, fillOpacity, strokeColor: color, strokeWidth: 5 })
}

function widthChord(range: number, halfAngle: number) {
  return new Line({
    start: polarPoint(range, -halfAngle),
    end: polarPoint(range, halfAngle),
    color: '#f6f4e9',
    strokeWidth: 6,
  })
}

export async function polarConvolution() {
  const scene = new Scene(document.getElementById('container'), {
    width: 1080,
    height: 390,
    frameWidth: 14,
    frameHeight: 5.05,
    backgroundColor: BACKGROUND,
  })
  const rays = Array.from({ length: 9 }, (_, i) => new Line({
    start: RADAR,
    end: polarPoint(9.8, (i - 4) * 0.1),
    color: GRID,
    strokeWidth: 1.5,
  }))
  const arcs = Array.from({ length: 19 }, (_, i) => new Polygon({
    vertices: Array.from({ length: 25 }, (_, j) => polarPoint(2.4 + i * 0.4, (j - 12) * 0.0333)),
    closed: false,
    color: GRID,
    strokeWidth: 1.2,
  }))
  const radar = new Square({ sideLength: 0.18, center: RADAR, color: GOLD, fillOpacity: 1 })

  const near = new VGroup(footprint(3.2, 4.4, 0.15, GOLD), widthChord(3.8, 0.15))
  const traveling = near.copy()
  const far = new VGroup(footprint(8, 9.2, 0.15, GOLD), widthChord(8.6, 0.15))
  // At far range a narrower angular span covers approximately the near-window width.
  const adaptedAngle = 0.15 * 3.8 / 8.6
  const adapted = new VGroup(
    footprint(8, 9.2, adaptedAngle, '#6fd0aa', 0.26),
    widthChord(8.6, adaptedAngle),
  )
  const farOutline = footprint(8, 9.2, 0.15, '#74bed5', 0)
  farOutline.setStrokeOpacity(0.65).setStrokeWidth(2)

  await scene.play(
    new FadeIn(new VGroup(...rays, ...arcs, radar), { duration: 0.65 }),
    new FadeIn(near, { duration: 0.65 }),
  )
  await scene.play(new Transform(traveling, far, { duration: 1.4 }))
  await scene.play(
    new FadeIn(farOutline, { duration: 0.75 }),
    new Transform(traveling, adapted, { duration: 0.75 }),
  )
}
