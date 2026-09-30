import { Scene, UpdateFromAlphaFunc, VGroup, VMobject, linear } from 'manim-web'

type Point = [number, number, number]
type Shape = { points: Point[], color: string, opacity: number, width: number }
type VolumeView = { center: Point, size: number }

export const fusionStages = ['Three radars', 'Scan', 'Cell frame', 'Three grids', 'Anomalies', 'Weighted merge', 'VAD / section']
export const fusionColors = {
  radars: ['#78baff', '#85bec8', '#ef8f9b'],
  reflectivity: ['#244765', '#4c9b9f', '#ded6a0', '#eaa456', '#ef7476'],
  anomaly: ['#78baff', '#101b2b', '#cfb87c', '#eaa456', '#ef7476'],
  anomalyOffsets: [0, 20, 45, 70, 100],
}

const WIDTH = 1000
const HEIGHT = 580
const FRAME_W = 10
const FRAME_H = 5.8
const BACKGROUND = '#101b2b'
const GOLD = '#cfb87c'
const WHITE = '#edf2f7'
const GRID = '#52667b'
const RAD = Math.PI / 180
const N = 10
const COORDS = Array.from({ length: N }, (_, i) => -28 + 4 * i)
const HEIGHTS = Array.from({ length: 9 }, (_, i) => 1 + i)
const PLANES = [2, 4, 6] // Illustrative horizontal slices at 3, 5, and 7 km.
const RADAR_NAMES = ['DOW6 · X', 'COW · C', 'ECCC · S']
// Indexed by radar identity: X band at right, C band at bottom, S band at left.
const MAP_SITES: Point[] = [[2.7, -.85, 0], [0, -1.85, 0], [-2.7, -.85, 0]]
const CLOUD_START: Point = [-.8, .7, 0]
const CLOUD_SCAN: Point = [.65, 1.1, 0]
const CLOUD_END: Point = [1.35, 1.45, 0]
const BOX_SIZE = 3.15
const VIEWS: VolumeView[] = [-3.15, 0, 3.15].map(x => ({ center: [x, -.35, 0], size: 2.3 }))
const MERGED_VIEW: VolumeView = { center: [-1.4, -.15, 0], size: 4.1 }

// Observation-informed schematic, not a digitized retrieval or a particular
// analysis time. Chapter 5 Figures 1(i) and 3(i) show winds FROM the southwest,
// a speed minimum near 2–3 km, and stronger flow above the shear layer.
// Restrict the illustration to the VAD's approximately 1–6.5-km coverage.
export const fusionWindProfile = [
  { z: 1, speed: 28, from: 230 },
  { z: 1.5, speed: 27, from: 240 },
  { z: 2.2, speed: 23, from: 250 },
  { z: 2.5, speed: 25, from: 250 },
  { z: 3.5, speed: 30, from: 245 },
  { z: 4.5, speed: 34, from: 240 },
  { z: 5.5, speed: 34, from: 235 },
  { z: 6.5, speed: 35, from: 230 },
]
const WIND_COLOR = '#85bec8'
const WIND_LEFT = 2.4
const WIND_RIGHT = 4.05
const WIND_VECTOR_SCALE = .015 // Same map-view length scale at every height.

function windSpeedPoint(speed: number, z: number): Point {
  return [WIND_LEFT + (WIND_RIGHT - WIND_LEFT) * speed / 40, sectionPoint(0, z)[1], 0]
}
export function fusionWindVectors() {
  return fusionWindProfile.filter(p => p.z % 1 === .5).map(p => {
    // Meteorological bearings describe where wind comes FROM. Negate both
    // components so arrowheads show horizontal flow TOWARD (N up, E right).
    const east = -p.speed * WIND_VECTOR_SCALE * Math.sin(p.from * RAD)
    const north = -p.speed * WIND_VECTOR_SCALE * Math.cos(p.from * RAD)
    const y = sectionPoint(0, p.z)[1]
    return { ...p, start: [4.45 - east / 2, y - north / 2, 0] as Point,
      end: [4.45 + east / 2, y + north / 2, 0] as Point }
  })
}

function clamp(value: number) { return Math.max(0, Math.min(1, value)) }
function mix(a: number, b: number, t: number) { return a + (b - a) * t }
function mixPoint(a: Point, b: Point, t: number): Point { return a.map((value, i) => mix(value, b[i], t)) as Point }
function mixColor(a: string, b: string, t: number) {
  return `#${[1, 3, 5].map(i => Math.round(mix(parseInt(a.slice(i, i + 2), 16), parseInt(b.slice(i, i + 2), 16), t)).toString(16).padStart(2, '0')).join('')}`
}
function fieldColor(value: number, anomaly = false) {
  const stops = anomaly ? fusionColors.anomaly : fusionColors.reflectivity
  const breaks = anomaly ? [-4, 0, 5, 10, 16] : [0, 11.25, 22.5, 33.75, 45]
  const interval = value >= breaks[4] ? 3 : Math.max(0, breaks.findIndex((_, i) => i < 4 && value < breaks[i + 1]))
  return mixColor(stops[interval], stops[interval + 1], clamp((value - breaks[interval]) / (breaks[interval + 1] - breaks[interval])))
}
function line(points: Point[], color = GRID, opacity = 1, width = 1.5): Shape { return { points, color, opacity, width } }
function fill(points: Point[], color: string, opacity = 1): Shape { return { points, color, opacity, width: 0 } }
function rect(x: number, y: number, w: number, h: number): Point[] {
  return [[x, y, 0], [x + w, y, 0], [x + w, y + h, 0], [x, y + h, 0], [x, y, 0]]
}
function ellipse(p: Point, rx: number, ry = rx): Point[] {
  return Array.from({ length: 33 }, (_, i) => [p[0] + rx * Math.cos(i * Math.PI / 16), p[1] + ry * Math.sin(i * Math.PI / 16), 0])
}
function arrow(a: Point, b: Point, tip = .12): Point[] {
  const angle = Math.atan2(b[1] - a[1], b[0] - a[0])
  return [a, b, [b[0] - tip * Math.cos(angle - .5), b[1] - tip * Math.sin(angle - .5), 0], b,
    [b[0] - tip * Math.cos(angle + .5), b[1] - tip * Math.sin(angle + .5), 0]]
}
function boxAt(p: Point): Point[] {
  // The centroid is three quarters of the way across the box, not its center.
  return rect(p[0] - .75 * BOX_SIZE, p[1] - .75 * BOX_SIZE, BOX_SIZE, BOX_SIZE)
}
function volumePoint(x: number, y: number, z: number, view: VolumeView): Point {
  return [view.center[0] + view.size * ((x + 10) / 40 + .24 * (y + 10) / 40),
    view.center[1] + view.size * (.20 * (y + 10) / 40 + .68 * (z - 5) / 8), 0]
}
function mapPoint(x: number, y: number): Point { return [CLOUD_END[0] + x * BOX_SIZE / 40, CLOUD_END[1] + y * BOX_SIZE / 40, 0] }
function sectionPoint(x: number, z: number): Point { return [-4.25 + (x + 30) * 5.7 / 40, -1.8 + (z - 1) * 3.55 / 8, 0] }

// All sites, scan tilts, beam widths, and values below are deliberately
// schematic, not the observed radar geometry or a particle-trajectory model.
// These smooth fields stand in for each independently gridded/smoothed radar.
// The weighted local backgrounds and normalized anomaly merge ARE computed.
const SYNTHETIC_RADARS = [
  { site: [34, -6], tilts: [.4, .8, 1.2, 1.6, 2, 2.8, 3.6, 4.4, 5.2, 6.8, 8.4, 10, 11.6, 14.8, 18], range: 75, offset: 14 },
  { site: [-40, -25], tilts: [.5, 1, 2, 3, 4.5, 6.5, 9, 12], range: 88.5, offset: 20 },
  { site: [5, 40], tilts: [.5, 1.5, 2.5, 3.5, 5, 7, 9, 12], range: 240, offset: 27 },
]
function syntheticWeight(r: number, x: number, y: number, z: number) {
  const radar = SYNTHETIC_RADARS[r]
  const dx = x - radar.site[0]
  const dy = y - radar.site[1]
  const horizontal = Math.hypot(dx, dy)
  const range = Math.hypot(horizontal, z)
  const elevation = Math.atan2(z, horizontal) / RAD
  const tilt = radar.tilts.reduce((a, b) => Math.abs(a - elevation) < Math.abs(b - elevation) ? a : b) * RAD
  const azimuth = Math.atan2(dy, dx)
  const sampledAzimuth = Math.round(azimuth / RAD) * RAD
  const along = dx * Math.cos(tilt) * Math.cos(sampledAzimuth) + dy * Math.cos(tilt) * Math.sin(sampledAzimuth) + z * Math.sin(tilt)
  const distance = Math.sqrt(Math.max(0, range * range - along * along))
  const sigma = Math.max(.15, range * RAD / 2.355)
  return range > radar.range || distance > 3 * sigma ? 0 : Math.exp(-.5 * (distance / sigma) ** 2)
}
function syntheticReflectivity(r: number, x: number, y: number, z: number) {
  const core = 12 * Math.exp(-(x * x + y * y) / 32 - ((z - 7.5) / 1.1) ** 2)
  const downwind = -2.5 * (7.5 - z)
  const streak = 8 * Math.exp(-((x - downwind) ** 2 + (y - downwind) ** 2) / 30 - ((z - 4.5) / 2.6) ** 2)
  const existing = 5 * Math.exp(-(((x + 20) / 3.5) ** 2) - ((z - 3.5) / 1.8) ** 2)
  return SYNTHETIC_RADARS[r].offset + .4 * z + .04 * x + .025 * y + existing
    + [1, .88, 1.08][r] * (core + streak) + .35 * Math.sin(x / 9 + r) * Math.cos(y / 12)
}
const radarFields = SYNTHETIC_RADARS.map((_, r) => HEIGHTS.map(z => COORDS.map(y => COORDS.map(x => ({
  weight: syntheticWeight(r, x, y, z), reflectivity: syntheticReflectivity(r, x, y, z), background: 0, anomaly: 0,
})))))
radarFields.forEach(field => field.forEach((plane, zi) => plane.forEach((row, yi) => row.forEach((p, xi) => {
  // A centered 40 × 40 × 2-km weighted boxcar. This coarse demonstration
  // truncates and renormalizes boundary windows; it is not a DCT implementation.
  let weightedSum = 0
  let weightSum = 0
  field.forEach((layer, li) => {
    if (Math.abs(HEIGHTS[li] - HEIGHTS[zi]) > 1) return
    layer.forEach((neighbors, ny) => {
      if (Math.abs(COORDS[ny] - COORDS[yi]) > 20) return
      neighbors.forEach((neighbor, nx) => {
        if (Math.abs(COORDS[nx] - COORDS[xi]) > 20) return
        weightedSum += neighbor.weight * neighbor.reflectivity
        weightSum += neighbor.weight
      })
    })
  })
  p.background = weightSum ? weightedSum / weightSum : 0
  p.anomaly = p.reflectivity - p.background
}))))
export function mergeRadarAnomalies(samples: { weight: number, anomaly: number }[]) {
  const denominator = samples.reduce((sum, p) => sum + p.weight, 0)
  return denominator ? samples.reduce((sum, p) => sum + p.weight * p.anomaly, 0) / denominator : null
}
const merged = HEIGHTS.map((_, zi) => COORDS.map((_, yi) => COORDS.map((_, xi) =>
  mergeRadarAnomalies(radarFields.map(field => field[zi][yi][xi])))))
const focus = { zi: 6, yi: 7, xi: 7 } // (0, 0, 7 km), the same voxel in each grid.
export const fusionData = {
  coordinates: COORDS, heights: HEIGHTS, radarFields, merged, focus,
  samples: radarFields.map(field => field[focus.zi][focus.yi][focus.xi]),
  result: merged[focus.zi][focus.yi][focus.xi],
}

function mapShapes(step: number, alpha: number): Shape[] {
  const opacity = step < 3 ? 1 : step === 3 ? 1 - alpha : 0
  const turn = step === 1 ? 4 * Math.PI * alpha : 0
  const cloud = step === 0 ? CLOUD_START : step === 1 ? mixPoint(CLOUD_START, CLOUD_SCAN, alpha)
    : step === 2 ? mixPoint(CLOUD_SCAN, CLOUD_END, alpha) : CLOUD_END
  const box = step < 2 ? 0 : step === 2 ? clamp(alpha * 3) : 1
  const result: Shape[] = []
  for (const x of [-4, -2, 0, 2, 4]) result.push(line([[x, -2.25, 0], [x, 2.15, 0]], GRID, .16 * opacity))
  for (const y of [-2, 0, 2]) result.push(line([[-4.6, y, 0], [4.6, y, 0]], GRID, .16 * opacity))
  MAP_SITES.forEach((site, r) => {
    const color = fusionColors.radars[r]
    const beamEnd = (angle: number): Point => [site[0] + 5.2 * Math.sin(angle), site[1] + 5.2 * Math.cos(angle), 0]
    const sampled = alpha === 0 || alpha === 1 ? 0 : Math.max(0, Math.sin(turn - Math.atan2(cloud[0] - site[0], cloud[1] - site[1])) * 12)
    result.push(line(ellipse(site, .8), color, .15 * opacity, 1))
    result.push(line(ellipse(site, 1.6), color, .12 * opacity, 1))
    result.push(fill([site, beamEnd(turn - .045), beamEnd(turn + .045), site], color, .13 * opacity))
    result.push(line([site, beamEnd(turn)], color, .85 * opacity, 2.5))
    result.push(line(ellipse(site, .18), color, opacity, 2.5))
    result.push(fill(ellipse(site, .075), color, opacity))
    result.push(line(ellipse(cloud, .12 + .018 * sampled), color, step === 1 ? .25 * sampled / 12 * opacity : 0, 2))
  })
  const cloudOutline = Array.from({ length: 49 }, (_, i) => {
    const a = i / 48 * 2 * Math.PI
    const radius = 1 + .10 * Math.cos(5 * a)
    return [cloud[0] + .62 * radius * Math.cos(a), cloud[1] + .31 * radius * Math.sin(a), 0] as Point
  })
  result.push(fill(cloudOutline, WHITE, .15 * opacity), line(cloudOutline, WHITE, .85 * opacity, 2))
  result.push(line([CLOUD_START, step <= 1 ? cloud : CLOUD_SCAN, cloud], GOLD, step ? .55 * opacity : 0, 1.8))
  result.push(fill(ellipse(cloud, .075), GOLD, opacity))
  result.push(line(boxAt(cloud), GOLD, box * opacity, 2.5))
  result.push(line([[cloud[0] - .15, cloud[1], 0], [cloud[0] + .15, cloud[1], 0], cloud,
    [cloud[0], cloud[1] - .15, 0], [cloud[0], cloud[1] + .15, 0]], GOLD, box * opacity, 2))
  return result
}

function volumeShapes(step: number, alpha: number): Shape[] {
  const reveal = step < 3 ? 0 : step === 3 ? alpha : 1
  const subtract = step < 4 ? 0 : step === 4 ? alpha : 1
  const merge = step < 5 ? 0 : step === 5 ? clamp((alpha - .28) / .65) : 1
  const section = step === 6 ? alpha : 0
  const result: Shape[] = []
  VIEWS.forEach((view, r) => {
    const current: VolumeView = { center: mixPoint(view.center, MERGED_VIEW.center, merge), size: mix(view.size, MERGED_VIEW.size, merge) }
    const fade = reveal * (r === 0 ? 1 : 1 - merge) * (1 - section)
    function point(x: number, y: number, z: number): Point {
      return mixPoint(mapPoint(x, y), volumePoint(x, y, z, current), reveal)
    }
    PLANES.forEach(zi => COORDS.forEach((y, yi) => COORDS.forEach((x, xi) => {
      const p = radarFields[r][zi][yi][xi]
      const value = merged[zi][yi][xi]
      const points = [[x - 1.92, y - 1.92], [x + 1.92, y - 1.92], [x + 1.92, y + 1.92], [x - 1.92, y + 1.92], [x - 1.92, y - 1.92]]
        .map(([px, py]) => point(px, py, HEIGHTS[zi]))
      const rawColor = fieldColor(p.reflectivity)
      const anomalyColor = fieldColor(p.anomaly, true)
      const color = mixColor(mixColor(rawColor, anomalyColor, subtract), fieldColor(value ?? 0, true), merge)
      const ownOpacity = p.weight ? mix(.88, p.anomaly > 1.5 ? .95 : .35, subtract) : .035
      const mergedOpacity = value === null ? .035 : value > 1.5 ? .96 : .35
      result.push(fill(points, color, mix(ownOpacity, mergedOpacity, merge) * fade))
    })))
    // Wireframe and the three displayed horizontal slices retain depth cues.
    for (const z of [1, 3, 5, 7, 9]) result.push(line([point(-30, -30, z), point(10, -30, z), point(10, 10, z), point(-30, 10, z), point(-30, -30, z)], GRID, .8 * fade, 1))
    for (const [x, y] of [[-30, -30], [-30, 10], [10, -30], [10, 10]]) result.push(line([point(x, y, 1), point(x, y, 9)], GRID, .85 * fade, 1.2))
    // Visible part of the 40 × 40 × 2-km window centered at (0, 0, 7).
    // Its +20-km sides lie beyond this asymmetric grid's +10-km boundary.
    for (const z of [6, 8]) result.push(line([point(-20, -20, z), point(10, -20, z), point(10, 10, z), point(-20, 10, z), point(-20, -20, z)], GOLD,
      (step === 4 ? .7 * Math.sin(alpha * Math.PI / 2) : step === 5 ? .7 * (1 - clamp(alpha * 3)) : 0) * fade, 1.7))
    const marker = point(0, 0, 7)
    result.push(line(ellipse(marker, .10 + .045 * merge), WHITE, step >= 4 ? fade : 0, 2.5))
  })
  return result
}

function weightShapes(step: number, alpha: number): Shape[] {
  const opacity = step < 5 ? 0 : step === 5 ? clamp(alpha * 4) : 1 - alpha
  const result: Shape[] = []
  result.push(line(rect(1.9, -1.75, 2.75, 3.7), GRID, opacity, 1.5))
  fusionData.samples.forEach((p, r) => {
    const y = 1.05 - r * .92
    const color = fusionColors.radars[r]
    const sigmaUnits = .15
    const distanceUnits = p.weight ? Math.min(.38, sigmaUnits * Math.sqrt(-2 * Math.log(p.weight))) : .48
    result.push(fill(rect(2.10, y - .18, 2.3, .36), color, .10 * opacity))
    result.push(line([[2.1, y, 0], [4.4, y, 0]], color, opacity, 1.6))
    result.push(line([[3.4, y, 0], [3.4, y + distanceUnits, 0]], WHITE, .9 * opacity, 1.5))
    result.push(fill(ellipse([3.4, y + distanceUnits, 0], .065), WHITE, opacity))
  })
  return result
}

function sectionShapes(step: number, alpha: number): Shape[] {
  const t = step === 6 ? alpha : 0
  const tilt = clamp((t - .18) / .72)
  const opacity = clamp(t * 3)
  const result: Shape[] = []
  function point(x: number, z: number) { return mixPoint(volumePoint(x, x, z, MERGED_VIEW), sectionPoint(x, z), tilt) }
  HEIGHTS.forEach((z, zi) => COORDS.forEach((x, xi) => {
    const value = merged[zi][xi][xi]
    const bottom = Math.max(1, z - .46)
    const top = Math.min(9, z + .46)
    const points = [[x - 1.94, bottom], [x + 1.94, bottom], [x + 1.94, top], [x - 1.94, top], [x - 1.94, bottom]]
      .map(([px, pz]) => point(px, pz))
    result.push(fill(points, fieldColor(value ?? 0, true), (value === null ? .03 : value > 1.5 ? .95 : .30) * opacity))
  }))
  result.push(line([point(-30, 1), point(10, 1), point(10, 9), point(-30, 9), point(-30, 1)], GOLD, opacity, 2.5))
  for (const z of [1, 3, 5, 7, 9]) result.push(line([point(-30, z), point(10, z)], GRID, .35 * opacity, 1))
  const cell = point(0, 7.5)
  result.push(line(ellipse(cell, .20, .12), WHITE, opacity, 2.5))
  // Dashed corridor is an expected direction, NOT a simulated particle path.
  for (let i = 0; i < 8; i++) {
    const a = i / 8
    const b = (i + .55) / 8
    result.push(line([point(-17.5 * a, 7.5 - 5.4 * a), point(-17.5 * b, 7.5 - 5.4 * b)], GOLD, .85 * opacity, 2.5))
  }
  // Ground-relative horizontal wind speed and direction are separate from
  // the cell-relative echo curtain. Direction glyphs are miniature PLAN views,
  // not vectors in the height–speed plane and not a vertical-wind retrieval.
  const top = fusionWindProfile.at(-1)!.z
  result.push(line([windSpeedPoint(0, top), windSpeedPoint(0, 1), windSpeedPoint(40, 1)], GRID, opacity, 1.5))
  for (const speed of [0, 20, 40]) result.push(line([windSpeedPoint(speed, 1), windSpeedPoint(speed, top)], GRID, .35 * opacity, 1))
  for (const z of [1, 3, 5, top]) {
    result.push(line([windSpeedPoint(0, z), windSpeedPoint(40, z)], GRID, .35 * opacity, 1))
    const y = sectionPoint(0, z)[1]
    result.push(line([[WIND_LEFT - .05, y, 0], [WIND_LEFT, y, 0]], WHITE, opacity, 1.5))
  }
  result.push(line(fusionWindProfile.map(p => windSpeedPoint(p.speed, p.z)), WIND_COLOR, opacity, 3))
  fusionWindProfile.forEach(p => result.push(fill(ellipse(windSpeedPoint(p.speed, p.z), .035), WIND_COLOR, opacity)))
  fusionWindVectors().forEach(p => result.push(line(arrow(p.start, p.end, .08), WIND_COLOR, opacity, 2.5)))
  return result
}

// Pure, fixed-order frames make forward, rewind, direct entry, and interrupted
// playback deterministic. The SVG entry preview comes from the same geometry.
export function fusionFrame(step: number, alpha = 1): Shape[] {
  alpha = clamp(alpha)
  return [...mapShapes(step, alpha), ...volumeShapes(step, alpha), ...weightShapes(step, alpha), ...sectionShapes(step, alpha)]
}
function svgPath(points: Point[]) {
  return `M${points.map(([x, y]) => `${((x / FRAME_W + .5) * WIDTH).toFixed(2)},${((.5 - y / FRAME_H) * HEIGHT).toFixed(2)}`).join(' L')}`
}
function label(x: number, y: number, text: string, color = WHITE, anchor = 'middle') {
  return { x: (x / FRAME_W + .5) * WIDTH, y: (.5 - y / FRAME_H) * HEIGHT, text, color, anchor }
}
export const fusionPreview = fusionFrame(0).filter(s => s.opacity > 0).map(s => ({
  d: svgPath(s.points), color: s.color, fill: s.width ? 0 : s.opacity, stroke: s.width ? s.opacity : 0, width: s.width,
}))
export const fusionLabels = {
  map: [
    ...MAP_SITES.map((site, r) => label(site[0], site[1] - .38, RADAR_NAMES[r], fusionColors.radars[r])),
    label(-4.45, 2.5, 'Ground-relative view', WHITE, 'start'), label(3.7, 2.5, '0° = N'),
  ],
  frame: [label(CLOUD_END[0] + 1.4, CLOUD_END[1] + .15, 'cell (0, 0)', GOLD),
    label(-3.5, -2.52, 'x, y: −30 to +10 km', GOLD, 'start')],
  grids: VIEWS.map((view, r) => ({
    name: label(view.center[0], 2.25, RADAR_NAMES[r], fusionColors.radars[r]),
    field: label(view.center[0], 1.84, 'Reflectivity (dBZ)'),
    anomaly: label(view.center[0], 1.84, 'Z′ (dB)'),
    background: label(view.center[0], -2.05, `μ = ${fusionData.samples[r].background.toFixed(1)} dBZ`, GOLD),
  })),
  merge: [label(-1.4, 2.28, 'Merged Z′ (dB)', GOLD), label(-1.4, -2.25, 'One shared cell-relative volume'),
    label(3.25, 2.28, 'Beam-center proximity'),
    ...fusionData.samples.map((p, r) => label(3.25, 1.52 - r * .92, `${['DOW6', 'COW', 'ECCC'][r]}: M = ${p.weight.toFixed(2)}`, fusionColors.radars[r])),
    label(3.25, -1.50, 'White point = same voxel')],
  section: [label(-1.4, 2.28, 'Cell-relative Z′ section (dB)', GOLD),
    ...[1, 5, 9].map(z => label(-4.42, sectionPoint(0, z)[1] - .08, String(z), WHITE, 'end')),
    label(-4.25, 2.05, 'km MSL', WHITE, 'start'), label(-4.25, -2.2, 'SW'), label(1.45, -2.2, 'NE'),
    label(sectionPoint(0, 1)[0], -2.2, 'cell (0, 0)', GOLD)],
  wind: [label(3.35, 2.28, 'VAD winds'), label(3.35, 1.91, 'ground-relative'),
    label(3.22, 1.26, 'Speed'), label(3.22, 1.00, '(m s⁻¹)'),
    label(4.45, 1.26, 'Direction'), label(4.45, 1.00, 'N ↑  E →'),
    label(2.21, 1.00, 'km', WHITE, 'end'),
    ...[1, 3, 5, 6.5].map(z => label(2.21, sectionPoint(0, z)[1] - .07, String(z), WHITE, 'end')),
    ...[0, 20, 40].map(speed => label(windSpeedPoint(speed, 1)[0], -2.11, String(speed))),
    label(4.45, -2.11, 'NE', WIND_COLOR), label(3.35, -2.52, 'Flow: SW → NE', WIND_COLOR)],
}

export async function multiRadarFusion(getInitialClick: () => number = () => 0) {
  const scene = new Scene(document.getElementById('container'), {
    width: WIDTH, height: HEIGHT, frameWidth: FRAME_W, frameHeight: FRAME_H, backgroundColor: BACKGROUND,
  })
  const initial = fusionFrame(0)
  const objects = initial.map(s => new VMobject().setPointsAsCorners(s.points).setColor(s.color)
    // Keep fill geometry alive even for initially hidden grid/section tiles.
    .setFillOpacity(s.width === 0 ? 1 : 0).setStrokeOpacity(s.opacity).setStrokeWidth(s.width))
  // VGroup applies a small z offset per child. Chunk the tiles so 900 sibling
  // offsets cannot push the last grid through the 2D camera's near plane.
  const groups = Array.from({ length: Math.ceil(objects.length / 100) }, (_, i) => new VGroup(...objects.slice(i * 100, (i + 1) * 100)))
  const illustration = new VGroup(...groups)
  // A fully transparent material still costs a draw call. Cull inactive shapes
  // so the scan stage does not render hundreds of invisible voxel meshes.
  const native = objects.map((object, i) => {
    const mesh = object.getThreeObject()
    mesh.visible = initial[i].opacity > 0
    return mesh
  })
  scene.add(illustration) // Register synchronously before the first await.
  // On a slide re-entry, Slidev can restore the click AFTER CuManim has
  // captured its initial replay limit. Register the scene for cleanup first,
  // then let navigation settle and also shorten the already-completed plays.
  await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
  const initialClick = getInitialClick()
  function duration(step: number, seconds: number) { return step <= initialClick ? .001 : seconds }
  let previous = initial
  function draw(step: number, alpha: number) {
    const frame = fusionFrame(step, alpha)
    frame.forEach((s, i) => {
      const last = previous[i]
      if (s.points.length !== last.points.length || s.points.some((p, j) => p.some((v, k) => v !== last.points[j][k]))) objects[i].setPointsAsCorners(s.points)
      if (s.color !== last.color) objects[i].setColor(s.color)
      if (s.opacity !== last.opacity) {
        objects[i].setStrokeOpacity(s.opacity)
        native[i].visible = s.opacity > 0
      }
    })
    previous = frame
  }
  // Six play calls = six Slidev clicks. All text/math stays in SVG/Slidev.
  await scene.play(new UpdateFromAlphaFunc(illustration, (_, a) => draw(1, a), { duration: duration(1, 4), rateFunc: linear }))
  await scene.play(new UpdateFromAlphaFunc(illustration, (_, a) => draw(2, a), { duration: duration(2, 2.2) }))
  await scene.play(new UpdateFromAlphaFunc(illustration, (_, a) => draw(3, a), { duration: duration(3, 2.4) }))
  await scene.play(new UpdateFromAlphaFunc(illustration, (_, a) => draw(4, a), { duration: duration(4, 2) }))
  await scene.play(new UpdateFromAlphaFunc(illustration, (_, a) => draw(5, a), { duration: duration(5, 3) }))
  await scene.play(new UpdateFromAlphaFunc(illustration, (_, a) => draw(6, a), { duration: duration(6, 3.2) }))
}
