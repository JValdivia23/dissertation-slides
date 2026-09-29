import { Scene, UpdateFromAlphaFunc, VGroup, VMobject } from 'manim-web'

type Point = [number, number, number]
type Shape = { points: Point[], color: string, fill: number, stroke: number, width: number }

export const ctgcStages = ['17 elevations', '5.5–8 km', 'Layer maximum', 'PPI map', 'Azimuthal mean', 'Perturbation', 'Boundaries']

// Chapter 4, Figure 3: nominal scan angles, rather than evenly spaced tilts.
// This deliberately coarse, deterministic field is a methodology illustration.
// The observed endpoint is Figure 5(e), kept separately in population.md.
const ELEVATIONS = [0.4, 0.8, 1.2, 1.6, 2, 2.8, 3.6, 4.4, 5.2, 6.8, 8.4, 10, 11.6, 14.8, 18, 21.1, 50]
const RANGES = Array.from({ length: 30 }, (_, i) => 1.25 + 2.5 * i)
const AZIMUTHS = Array.from({ length: 48 }, (_, i) => i * 2 * Math.PI / 48)
const RAD = Math.PI / 180
const LAYER = [5.5, 8]
const WIDTH = 1000
const HEIGHT = 580
const FRAME_W = 10
const FRAME_H = 5.8
const BACKGROUND = '#101b2b'
const GOLD = '#cfb87c'
const GRID = '#52667b'
const WHITE = '#edf2f7'
const MAP_CENTER: Point = [-1.15, 0, 0]
const MAP_SCALE = 2.35 / 75
const STRIP_Y = -2.05
const FOCUS_R = 14 // 36.25 km: two sampled elevations intersect the layer.
// Schematic cells sit 30 degrees clockwise from north (four azimuth bins), so
// the reference peak never straddles the 0/360-degree profile seam.
const FOCUS_THETA = Math.PI / 6
const FOCUS_AI = 4

export const ctgcColors = {
  reflectivity: ['#244765', '#4c9b9f', '#ded6a0', '#eaa456', '#ef7476'],
  perturbation: ['#78baff', '#101b2b', '#cfb87c', '#eaa456', '#ef7476'],
}

function mix(a: number, b: number, t: number) { return a + (b - a) * t }
function clamp(x: number) { return Math.max(0, Math.min(1, x)) }
function mixPoint(a: Point, b: Point, t: number): Point { return a.map((x, i) => mix(x, b[i], t)) as Point }
function mixColor(a: string, b: string, t: number) {
  return `#${[1, 3, 5].map(i => Math.round(mix(parseInt(a.slice(i, i + 2), 16), parseInt(b.slice(i, i + 2), 16), t)).toString(16).padStart(2, '0')).join('')}`
}
function color(value: number, perturbation = false) {
  const stops = perturbation ? ctgcColors.perturbation : ctgcColors.reflectivity
  const t = clamp(perturbation ? (value + 4) / 16 : value / 18) * (stops.length - 1)
  const i = Math.min(stops.length - 2, Math.floor(t))
  return mixColor(stops[i], stops[i + 1], t - i)
}

const cells = [
  { r: 36.25, theta: FOCUS_THETA, h: 6.2, amplitude: 12, width: 4.5 },
  { r: 58.75, theta: FOCUS_THETA, h: 7.1, amplitude: 11, width: 4 },
  { r: 43, theta: 0.4 * Math.PI + FOCUS_THETA, h: 6.3, amplitude: 12, width: 5 },
  { r: 31, theta: 0.9 * Math.PI + FOCUS_THETA, h: 6.9, amplitude: 13, width: 4.3 },
  { r: 54, theta: 1.2 * Math.PI + FOCUS_THETA, h: 6.7, amplitude: 14, width: 5 },
  { r: 65, theta: 1.62 * Math.PI + FOCUS_THETA, h: 6.2, amplitude: 12, width: 5.5 },
]

function reflectivity(r: number, theta: number, height: number) {
  const background = 4.5 + 2.2 * Math.cos(r / 13) + 0.35 * Math.sin(2 * theta)
  const layer = 0.9 * Math.exp(-(((height - 6.5) / 1.1) ** 2))
  return background + layer + cells.reduce((sum, cell) => {
    const distance2 = r ** 2 + cell.r ** 2 - 2 * r * cell.r * Math.cos(theta - cell.theta)
    return sum + cell.amplitude * Math.exp(-distance2 / (2 * cell.width ** 2) - (height - cell.h) ** 2 / (2 * 0.7 ** 2))
  }, 0)
}

// r is the shared polar range gate. Straight rays and exaggerated height are
// schematic; the side view uses r*cos(elevation) as horizontal distance.
function samplesAt(r: number, theta: number) {
  return ELEVATIONS.map(elevation => {
    const height = r * Math.sin(elevation * RAD)
    return { elevation, height, value: reflectivity(r, theta, height) }
  }).filter(sample => sample.height >= LAYER[0] && sample.height <= LAYER[1])
}

const maxima = RANGES.map(r => AZIMUTHS.map(theta => {
  const samples = samplesAt(r, theta)
  return samples.length ? Math.max(...samples.map(sample => sample.value)) : null
}))
const means = maxima.map(row => {
  const valid = row.filter((value): value is number => value !== null)
  return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : null
})
const perturbations = maxima.map((row, i) => row.map(value => value === null ? null : value - means[i]!))

export const ctgcData = {
  elevations: ELEVATIONS, ranges: RANGES, azimuths: AZIMUTHS, layer: LAYER,
  maxima, means, perturbations,
  focus: {
    range: RANGES[FOCUS_R], samples: samplesAt(RANGES[FOCUS_R], FOCUS_THETA),
    maximum: maxima[FOCUS_R][FOCUS_AI]!, mean: means[FOCUS_R]!, perturbation: perturbations[FOCUS_R][FOCUS_AI]!,
  },
}

function sidePoint(r: number, elevation: number): Point {
  return [-4.15 + r * Math.cos(elevation * RAD) * 7.95 / 75, -1.45 + r * Math.sin(elevation * RAD) * 0.42, 0]
}
function stripPoint(r: number): Point { return [-4.15 + r * 7.95 / 75, STRIP_Y, 0] }
function mapPoint(r: number, theta: number): Point {
  return [MAP_CENTER[0] + r * Math.sin(theta) * MAP_SCALE, MAP_CENTER[1] + r * Math.cos(theta) * MAP_SCALE, 0]
}
function rectangle(x: number, y: number, w: number, h: number): Point[] {
  return [[x - w / 2, y - h / 2, 0], [x + w / 2, y - h / 2, 0], [x + w / 2, y + h / 2, 0], [x - w / 2, y + h / 2, 0], [x - w / 2, y - h / 2, 0]]
}
function dot(p: Point, radius = 0.052): Point[] {
  return Array.from({ length: 13 }, (_, i) => [p[0] + radius * Math.cos(i * Math.PI / 6), p[1] + radius * Math.sin(i * Math.PI / 6), 0])
}
function ring(r: number, fraction = 1): Point[] {
  return Array.from({ length: 97 }, (_, i) => mapPoint(r, i / 96 * 2 * Math.PI * fraction))
}
function sector(r: number, theta: number): Point[] {
  const half = Math.PI / AZIMUTHS.length
  return [mapPoint(r - 1.25, theta - half), mapPoint(r + 1.25, theta - half), mapPoint(r + 1.25, theta), mapPoint(r + 1.25, theta + half), mapPoint(r - 1.25, theta + half), mapPoint(r - 1.25, theta), mapPoint(r - 1.25, theta - half)]
}
function shape(points: Point[], color: string, fill = 0, stroke = 1, width = 1): Shape { return { points, color, fill, stroke, width } }
function mobject(s: Shape) {
  // In 0.3.24 strokeOpacity is also the fill's overall alpha. As in
  // convolution.ts, filled objects use width 0 and keep their fill mesh alive;
  // animate their overall opacity rather than creating/deleting fill geometry.
  return new VMobject().setPointsAsCorners(s.points).setColor(s.color)
    .setFillOpacity(s.width === 0 ? 1 : s.fill)
    .setStrokeOpacity(s.width === 0 ? s.fill : s.stroke).setStrokeWidth(s.width)
}
function screen(p: Point) { return [(p[0] / FRAME_W + .5) * WIDTH, (.5 - p[1] / FRAME_H) * HEIGHT] }
function svgPath(points: Point[]) { return `M${points.map(p => screen(p).map(v => v.toFixed(2)).join(',')).join(' L')}` }
function label(p: Point, text: string, anchor = 'middle') {
  const [x, y] = screen(p)
  return { x, y, text, anchor }
}

const sideGrid = [
  ...[0, 2, 4, 6, 8].map(h => shape([[-4.15, -1.45 + h * .42, 0], [3.8, -1.45 + h * .42, 0]], GRID, 0, h ? .25 : .8)),
  ...[0, 15, 30, 45, 60, 75].map(r => shape([[-4.15 + r * 7.95 / 75, -1.45, 0], [-4.15 + r * 7.95 / 75, 2.1, 0]], GRID, 0, .22)),
]
const beams = ELEVATIONS.map(elevation => {
  const endRange = Math.min(75, 8.8 / Math.sin(elevation * RAD))
  return shape([sidePoint(0, elevation), sidePoint(endRange, elevation)], '#85bec8', 0, .5, .85)
})
const sideSamples = RANGES.flatMap((r, ri) => ELEVATIONS.map(elevation => {
  const height = r * Math.sin(elevation * RAD)
  const value = reflectivity(r, FOCUS_THETA, height)
  return { r, ri, elevation, height, value, inside: height >= LAYER[0] && height <= LAYER[1], position: sidePoint(r, elevation) }
}).filter(sample => sample.height <= 8.8))
const sampleShapes = sideSamples.map(sample => shape(dot(sample.position), color(sample.value), .9, 0, 0))
const radarShape = shape(dot(sidePoint(0, 0), .09), WHITE, 1, 0, 0)
const initialShapes = [...sideGrid, ...beams, ...sampleShapes, radarShape]

export const ctgcPreview = initialShapes.map(s => ({
  d: svgPath(s.points), color: s.color, fill: s.fill, stroke: s.stroke, width: s.width,
}))

// Text stays in SVG/Slidev, so the scene registers synchronously and rewind never
// waits for a font or MathTex download. All coordinates share the Manim frame.
export const ctgcLabels = {
  side: [
    ...[0, 2, 4, 6, 8].map(h => label([-4.35, -1.45 + h * .42 - .06, 0], String(h), 'end')),
    ...[0, 15, 30, 45, 60, 75].map(r => label([-4.15 + r * 7.95 / 75, -1.73, 0], String(r))),
    label([-4.15, 2.5, 0], 'Height (km MSL)', 'start'),
    label([-.2, -2.62, 0], 'Horizontal distance (km)'),
    label([-4.15, -2.15, 0], 'DOW6', 'start'),
  ],
  layer: [label([3.92, -1.45 + 5.5 * .42, 0], '5.5', 'start'), label([3.92, -1.45 + 8 * .42, 0], '8 km', 'start')],
  map: [
    label([-1.15, 2.57, 0], 'N'), label([1.42, -.07, 0], 'E'),
    label([-1.15, -2.67, 0], 'Polar range–azimuth map'),
  ],
}

function profile(values: number[], low: number, high: number) {
  return values.concat(values[0]).map((value, i) => `${mix(715, 955, i / values.length).toFixed(2)},${mix(338, 180, (value - low) / (high - low)).toFixed(2)}`).join(' ')
}
export const ctgcRingProfile = {
  maximum: profile(maxima[FOCUS_R] as number[], 0, 18),
  perturbation: profile(perturbations[FOCUS_R] as number[], -4, 12),
  meanY: mix(338, 180, means[FOCUS_R]! / 18),
  zeroY: mix(338, 180, 4 / 16),
}

export async function ctgcIdentification() {
  const scene = new Scene(document.getElementById('container'), {
    width: WIDTH, height: HEIGHT, frameWidth: FRAME_W, frameHeight: FRAME_H, backgroundColor: BACKGROUND,
  })
  const grid = sideGrid.map(mobject)
  const rays = beams.map(mobject)
  const samples = sampleShapes.map(mobject)
  const radar = mobject(radarShape)
  const band = mobject(shape(rectangle(-.175, -1.45 + 6.75 * .42, 7.95, 2.5 * .42), GOLD, .1, 0, 1.5))
  const side = new VGroup(...grid, ...rays, band, ...samples, radar)
  // Register before any await; CuManim owns cleanup, including interrupted steps.
  scene.add(side)

  // 1: select gates by height; the 17 tilts remain recognizable in the background.
  await scene.play(new UpdateFromAlphaFunc(side, (_, alpha) => {
    band.setStrokeOpacity(.9 * alpha)
    rays.forEach(ray => ray.setStrokeOpacity(mix(.5, .16, alpha)))
    samples.forEach((point, i) => point.setStrokeOpacity(sideSamples[i].inside ? mix(.9, 1, alpha) : mix(.9, .09, alpha)))
  }, { duration: 1.1 }))

  const winners = RANGES.map((r, ri) => {
    const candidates = samplesAt(r, FOCUS_THETA).sort((a, b) => b.value - a.value)
    const winner = candidates[0]
    return winner ? { ri, r, value: winner.value, position: sidePoint(r, winner.elevation) } : null
  }).filter((winner): winner is NonNullable<typeof winner> => winner !== null)
  const maximumMarks = winners.map(winner => mobject(shape(dot(winner.position, .073), color(winner.value), 0, 0, 0)))
  const focusWinner = winners.find(winner => winner.ri === FOCUS_R)!
  const focus = mobject(shape([focusWinner.position, stripPoint(RANGES[FOCUS_R])], GOLD, 0, 0, 1.6))
  const sourceMarks = ctgcData.focus.samples.map(sample => mobject(shape(dot(sidePoint(RANGES[FOCUS_R], sample.elevation), .11), WHITE, 0, 0, 1.4)))
  const strip = new VGroup(...maximumMarks, focus, ...sourceMarks)
  scene.add(strip)

  // 2: maxima travel from their sampled elevation to the common polar range strip.
  await scene.play(new UpdateFromAlphaFunc(strip, (_, alpha) => {
    const movement = clamp((alpha - .22) / .78)
    maximumMarks.forEach((mark, i) => mark
      .setPointsAsCorners(dot(mixPoint(winners[i].position, stripPoint(winners[i].r), movement), .09))
      .setStrokeOpacity(clamp(alpha * 5)))
    focus.setStrokeOpacity(.85 * alpha)
    sourceMarks.forEach(mark => mark.setStrokeOpacity(alpha))
    samples.forEach((point, i) => point.setStrokeOpacity(sideSamples[i].inside ? mix(1, .3, alpha) : .09))
  }, { duration: 1.8 }))

  const tiles = RANGES.flatMap((r, ri) => AZIMUTHS.map((theta, ai) => ({
    ri, ai, r, theta,
    maximum: maxima[ri][ai], perturbation: perturbations[ri][ai],
    object: mobject(shape(sector(r, theta), maxima[ri][ai] === null ? '#263548' : color(maxima[ri][ai]!), 0, 0, 0)),
  })))
  const rangeRings = [25, 50, 75].map(r => mobject(shape(ring(r), GRID, 0, 0, .7)))
  const sweep = mobject(shape([MAP_CENTER, mapPoint(75, 0)], GOLD, 0, 0, 1.4))
  const mapRadar = mobject(shape(dot(MAP_CENTER, .065), WHITE, 0, 0, 0))
  // VGroup offsets successive children in z. Group by range so 1,440 sibling
  // offsets cannot push the outer gates through the 2D camera's near plane.
  const tileRings = RANGES.map((_, ri) => new VGroup(...tiles.filter(tile => tile.ri === ri).map(tile => tile.object)))
  const map = new VGroup(...tileRings, ...rangeRings, sweep, mapRadar)
  scene.add(map)

  // 3: rotate the same radial maxima into plan view, then reveal all azimuths.
  await scene.play(new UpdateFromAlphaFunc(map, (_, alpha) => {
    const turn = clamp(alpha / .42)
    const reveal = clamp((alpha - .32) / .68)
    grid.forEach((line, i) => line.setStrokeOpacity(sideGrid[i].stroke * (1 - turn)))
    rays.forEach(ray => ray.setStrokeOpacity(.16 * (1 - turn)))
    samples.forEach((point, i) => point.setStrokeOpacity((sideSamples[i].inside ? .3 : .09) * (1 - turn)))
    band.setStrokeOpacity(.9 * (1 - turn))
    radar.setStrokeOpacity(1 - turn)
    focus.setStrokeOpacity(.85 * (1 - turn))
    sourceMarks.forEach(mark => mark.setStrokeOpacity(1 - turn))
    maximumMarks.forEach((mark, i) => mark
      .setPointsAsCorners(dot(mixPoint(stripPoint(winners[i].r), mapPoint(winners[i].r, FOCUS_THETA), turn), mix(.09, .045, turn)))
      .setStrokeOpacity(1 - reveal))
    tiles.forEach(tile => tile.object.setStrokeOpacity(clamp((reveal - tile.ai / AZIMUTHS.length) * AZIMUTHS.length) * (tile.maximum === null ? .55 : 1)))
    rangeRings.forEach(line => line.setStrokeOpacity(.4 * turn))
    mapRadar.setStrokeOpacity(turn)
    sweep.setPointsAsCorners([MAP_CENTER, mapPoint(75, reveal * Math.PI * 2)]).setStrokeOpacity(reveal > 0 && reveal < .999 ? .9 : 0)
  }, { duration: 2.5 }))

  const ringHighlight = mobject(shape(ring(RANGES[FOCUS_R], 0), GOLD, 0, 0, 2))
  const reference = new VGroup(ringHighlight)
  scene.add(reference)

  // 4: the reference averages azimuth at fixed range, using the maxima above.
  await scene.play(new UpdateFromAlphaFunc(reference, (_, alpha) => {
    // Transparent strokes render in the same pass as the polar fill meshes.
    // Pin them above the field, following the convolution scene's reticle.
    reference.getThreeObject().traverse((object: { renderOrder: number }) => { object.renderOrder = 9999 })
    ringHighlight.setPointsAsCorners(ring(RANGES[FOCUS_R], alpha)).setStrokeOpacity(.999 * alpha)
    tiles.forEach(tile => tile.object.setStrokeOpacity(tile.maximum === null ? .55 : tile.ri === FOCUS_R ? 1 : mix(1, .43, alpha)))
  }, { duration: 1.3 }))

  // 5: subtract each ring's own dBZ mean. Missing rings remain missing.
  await scene.play(new UpdateFromAlphaFunc(map, (_, alpha) => {
    tiles.forEach(tile => {
      if (tile.maximum === null) return
      tile.object.setColor(mixColor(color(tile.maximum), color(tile.perturbation!, true), alpha))
        .setStrokeOpacity(tile.ri === FOCUS_R ? 1 : mix(.43, 1, alpha))
    })
    ringHighlight.setStrokeOpacity(mix(.999, .35, alpha))
  }, { duration: 1.5 }))

  // 6: the slide overlays the explicitly labelled observed Figure 5(e).
  await scene.play(new UpdateFromAlphaFunc(map, (_, alpha) => {
    tiles.forEach(tile => tile.object.setStrokeOpacity((tile.maximum === null ? .55 : 1) * (1 - alpha)))
    rangeRings.forEach(line => line.setStrokeOpacity(.4 * (1 - alpha)))
    ringHighlight.setStrokeOpacity(.35 * (1 - alpha))
    mapRadar.setStrokeOpacity(1 - alpha)
  }, { duration: .6 }))
}
