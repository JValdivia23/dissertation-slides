import { Scene, UpdateFromAlphaFunc, VGroup, VMobject } from 'manim-web'

type Point = [number, number, number]
type Shape = { points: Point[], color: string, opacity: number, width: number, fill: number }

export const zdrStages = ['H / V comparison', 'Positive', 'Near zero', 'Negative', 'Early decrease', 'Later increase']
export const zdrColors = {
  horizontal: '#78baff', vertical: '#ef8f9b', crystal: '#85bec8', aggregate: '#cfb87c', white: '#edf2f7', grid: '#52667b',
}

const WIDTH = 1000
const HEIGHT = 580
const FRAME_W = 10
const FRAME_H = 5.8
const BACKGROUND = '#101b2b'

// Qualitative examples, not a scattering calculation or prescribed particle
// habits. The particle is viewed in the H–V plane of a near-horizontal beam.
const EXAMPLES = [
  { rx: .62, ry: .62, h: 0, v: 0 },
  { rx: 1.05, ry: .25, h: 2.6, v: .95 },
  { rx: .62, ry: .62, h: 1.75, v: 1.75 },
  { rx: .25, ry: 1.05, h: .95, v: 2.6 },
]

export const zdrParticles = {
  layerBottom: -.975,
  aggregates: [[-2.4, .85, 0], [-.9, -.05, 0], [.85, .8, 0], [2.65, -.05, 0]] as Point[],
  crystals: [[-3.45, -.15, 0], [-2.75, 1.4, 0], [-.35, 1.35, 0], [.25, -.55, 0], [2, 1.4, 0], [3.6, .85, 0]] as Point[],
}
const CLUSTER_OFFSETS: Point[] = [[-.48, .3, 0], [.47, .15, 0], [0, -.45, 0]]

// Orthogonal electric-field directions in 3D. Both signals propagate along X;
// H oscillates along Y and V along Z. Project into the existing 2D Manim frame
// rather than introducing a separate 3D scene / camera or another click.
export const zdrWaveAxes = {
  propagation: [1, 0, 0] as Point,
  horizontal: [0, 1, 0] as Point,
  vertical: [0, 0, 1] as Point,
  amplitude: .26,
}

function mix(a: number, b: number, alpha: number) { return a + (b - a) * alpha }
function clamp(value: number) { return Math.max(0, Math.min(1, value)) }
function rectangle(x: number, y: number, width: number, height: number): Point[] {
  return [[x, y, 0], [x + width, y, 0], [x + width, y + height, 0], [x, y + height, 0], [x, y, 0]]
}
function ellipse(x: number, y: number, rx: number, ry: number, angle = 0): Point[] {
  return Array.from({ length: 49 }, (_, i) => {
    const theta = i / 48 * 2 * Math.PI
    const dx = rx * Math.cos(theta)
    const dy = ry * Math.sin(theta)
    return [x + dx * Math.cos(angle) - dy * Math.sin(angle), y + dx * Math.sin(angle) + dy * Math.cos(angle), 0]
  })
}
function aggregate(x: number, y: number, radius: number): Point[] {
  return Array.from({ length: 49 }, (_, i) => {
    const theta = i / 48 * 2 * Math.PI
    const r = radius * (1 + .14 * Math.sin(5 * theta) + .08 * Math.cos(3 * theta))
    return [x + r * Math.cos(theta), y + r * Math.sin(theta), 0]
  })
}
function arrow(start: Point, end: Point, tip = .14): Point[] {
  const angle = Math.atan2(end[1] - start[1], end[0] - start[0])
  return [start, end, [end[0] - tip * Math.cos(angle - .5), end[1] - tip * Math.sin(angle - .5), 0], end,
    [end[0] - tip * Math.cos(angle + .5), end[1] - tip * Math.sin(angle + .5), 0]]
}
function shape(points: Point[], color: string, opacity = 1, width = 2, fill = 0): Shape {
  return { points, color, opacity, width, fill }
}

function dish(): Point[] {
  // A smooth right-facing parabola; its vertex remains attached to the mast.
  return Array.from({ length: 33 }, (_, i) => {
    const t = -1 + i / 16
    return [-4.05 + .15 * t * t, .2 + .5 * t, 0]
  })
}

function projectWave(k: number, horizontal: number, vertical: number, centerY: number): Point {
  return [-3.35 + 1.08 * k + .3 * horizontal, centerY + .08 * k - .4 * horizontal + vertical, 0]
}

export function zdrWaveGeometry(phase = 0) {
  function wave(horizontal: boolean): Point[] {
    const centerY = horizontal ? .05 : .65
    const points = Array.from({ length: 97 }, (_, i) => {
      const k = i / 96
      // Taper to a common baseline at either end. The shared phase advances
      // crests toward +X without changing the transmitted wave amplitudes.
      const field = i === 0 || i === 96 ? 0 : zdrWaveAxes.amplitude * Math.sin(Math.PI * k) ** 2 * Math.sin(4 * Math.PI * k - phase)
      return projectWave(k, horizontal ? field : 0, horizontal ? 0 : field, centerY)
    })
    const end = projectWave(1, 0, 0, centerY)
    // Arrowheads follow propagation, not the instantaneous E-field slope.
    return [...points, ...arrow(projectWave(.86, 0, 0, centerY), end, .13).slice(2)]
  }
  function plane(horizontal: boolean): Point[] {
    const centerY = horizontal ? .05 : .65
    const offset = zdrWaveAxes.amplitude
    return [[0, -offset], [1, -offset], [1, offset], [0, offset], [0, -offset]]
      .map(([k, field]) => projectWave(k, horizontal ? field : 0, horizontal ? 0 : field, centerY))
  }
  return { horizontal: wave(true), vertical: wave(false), horizontalPlane: plane(true), verticalPlane: plane(false) }
}

function comparisonShapes(example: typeof EXAMPLES[number], opacity: number, revealed: number, phase = 0): Shape[] {
  const { horizontal: h, vertical: v, white, grid, aggregate: gold } = zdrColors
  const particle = ellipse(-.7, .35, example.rx, example.ry)
  const waves = zdrWaveGeometry(phase)
  return [
    // Two feed-support arms connect the dish rim ends, not its middle.
    shape(dish(), white, opacity, 3),
    shape([[-3.9, .7, 0], [-3.6, .2, 0], [-3.9, -.3, 0]], gold, opacity, 2.5),
    shape([[-4.05, .2, 0], [-4.05, -.4, 0], [-4.45, -.4, 0], [-3.65, -.4, 0]], white, opacity, 3),
    shape(arrow(projectWave(0, 0, 0, .35), projectWave(1, 0, 0, .35)), grid, .5 * opacity, 1.5),
    // Electric-field directions lie in the plane perpendicular to propagation.
    shape(arrow([-2.1, -1.2, 0], [.6, -1.2, 0]), h, .9 * opacity, 2.5),
    shape(arrow([-2.1, -1.2, 0], [-2.1, 1.7, 0]), v, .9 * opacity, 2.5),
    shape(particle, white, mix(.04, .14, revealed) * opacity, 0, 1),
    shape(particle, white, mix(.25, 1, revealed) * opacity, 3),
    shape(rectangle(1.65, .48, 2.75, .34), grid, .6 * opacity, 1.5),
    shape(rectangle(1.65, -.52, 2.75, .34), grid, .6 * opacity, 1.5),
    // Width encodes relative linear reflectivity; no numeric dB is inferred
    // from the cartoon shape. Keep nonzero fill geometry even when invisible.
    shape(rectangle(1.65, .48, Math.max(.001, example.h), .34), h, revealed * opacity, 0, 1),
    shape(rectangle(1.65, -.52, Math.max(.001, example.v), .34), v, revealed * opacity, 0, 1),
    shape(ellipse(-3.6, .2, .04, .04), gold, opacity, 0, 1),
    // The planes show why the foreshortened H waveform is flatter than V.
    // Vertical offsets separate the glyphs for legibility, not separate rays.
    shape(waves.horizontalPlane, h, .05 * opacity, 0, 1),
    shape(waves.horizontalPlane, h, .25 * opacity, .8),
    shape(waves.verticalPlane, v, .05 * opacity, 0, 1),
    shape(waves.verticalPlane, v, .25 * opacity, .8),
    shape(waves.horizontal, h, opacity, 3),
    shape(waves.vertical, v, opacity, 3),
  ]
}

function layerShapes(opacity: number, merge: number, fall: number): Shape[] {
  const { crystal, aggregate: gold } = zdrColors
  const shapes = [
    shape(rectangle(-4.2, zdrParticles.layerBottom, 8.4, 2.85), gold, .07 * opacity, 0, 1),
    shape(rectangle(-4.2, zdrParticles.layerBottom, 8.4, 2.85), gold, .7 * opacity, 1.8),
  ]
  zdrParticles.crystals.forEach(([x, y]) => {
    const points = ellipse(x, y - .08 * fall, .28, .07)
    shapes.push(shape(points, crystal, .25 * opacity, 0, 1), shape(points, crystal, opacity, 2.5))
  })
  zdrParticles.aggregates.forEach(([x, y], index) => {
    // Three independent oriented crystals converge to each aggregate.
    // This is a conceptual growth illustration, not mass-conserving scattering.
    CLUSTER_OFFSETS.forEach(([dx, dy]) => {
      const points = ellipse(x + dx * (1 - merge), y + dy * (1 - merge), .25, .065, dx * .45)
      shapes.push(shape(points, crystal, .9 * opacity * (1 - merge), 2.3))
    })
    // Aggregates leave the layer on click 5; pristine crystals stay crystals.
    const aggregateY = mix(y, -1.78, fall)
    const radius = mix(.12, .4, merge)
    const points = aggregate(x, aggregateY, radius)
    shapes.push(shape(points, gold, .22 * opacity * merge, 0, 1), shape(points, gold, opacity * merge, 2.5))
    // Differently oriented constituents make the rounded outline schematic,
    // rather than suggesting that real snow aggregates are perfect spheres.
    for (let i = 0; i < 3; i++) {
      const theta = (i + index * .2) * Math.PI / 3
      shapes.push(shape(ellipse(x + .09 * Math.cos(theta), aggregateY + .09 * Math.sin(theta), radius * .65, .035, theta), gold, .65 * opacity * merge, 1.3))
    }
    shapes.push(shape(arrow([x, -.5, 0], [x, -1.3, 0]), gold, .7 * opacity * fall, 2))
  })
  // Legend geometry remains part of the same deterministic scene.
  shapes.push(shape(ellipse(-3.8, -2.55, .25, .065), crystal, opacity, 2.5))
  shapes.push(shape(aggregate(.7, -2.55, .15), gold, opacity, 2.5))
  return shapes
}

// Reuse the detailed slide's particle geometry without its comparison tutorial
// or two legend glyphs. The summary keeps a larger HTML legend beside the data.
export function zdrLifecycleFrame(step: number, alpha = 1): Shape[] {
  alpha = clamp(alpha)
  const merge = step === 0 ? 0 : step === 1 ? alpha : 1
  const fall = step === 2 ? alpha : 0
  return layerShapes(1, merge, fall).slice(0, -2)
}

// Fixed shape order/count lets each frame update existing mobjects. The same
// pure geometry supplies the first-frame SVG and regression checks on rewind.
export function zdrFrame(step: number, alpha = 1): Shape[] {
  alpha = clamp(alpha)
  if (step <= 3) {
    const previous = EXAMPLES[Math.max(0, step - 1)]
    const next = EXAMPLES[step]
    const example = {
      rx: mix(previous.rx, next.rx, alpha), ry: mix(previous.ry, next.ry, alpha),
      h: mix(previous.h, next.h, alpha), v: mix(previous.v, next.v, alpha),
    }
    // Two phase cycles during each existing click; endpoints reset exactly to
    // the preview phase so holds, direct entry, and rewind match bit-for-bit.
    const phase = step === 0 || alpha === 0 || alpha === 1 ? 0 : 4 * Math.PI * alpha
    return [...comparisonShapes(example, 1, step === 0 ? 0 : step === 1 ? alpha : 1, phase), ...layerShapes(0, 0, 0)]
  }
  const entering = step === 4 ? clamp(alpha / .28) : 1
  const merge = step === 4 ? clamp((alpha - .25) / .7) : 1
  const fall = step === 5 ? alpha : 0
  return [...comparisonShapes(EXAMPLES[3], 1 - entering, 1), ...layerShapes(entering, merge, fall)]
}

function svgPath(points: Point[]) {
  return `M${points.map(([x, y]) => `${((x / FRAME_W + .5) * WIDTH).toFixed(2)},${((.5 - y / FRAME_H) * HEIGHT).toFixed(2)}`).join(' L')}`
}
export const zdrPreview = zdrFrame(0).map(s => ({
  d: svgPath(s.points), color: s.color, fill: s.fill * s.opacity, stroke: s.width ? s.opacity : 0, width: s.width,
}))

export async function zdrInterpretation() {
  const scene = new Scene(document.getElementById('container'), {
    width: WIDTH, height: HEIGHT, frameWidth: FRAME_W, frameHeight: FRAME_H, backgroundColor: BACKGROUND,
  })
  const objects = zdrFrame(0).map(s => new VMobject().setPointsAsCorners(s.points).setColor(s.color)
    .setFillOpacity(s.fill).setStrokeOpacity(s.opacity).setStrokeWidth(s.width))
  const illustration = new VGroup(...objects)
  // Register synchronously; CuManim owns disposal on rewind / interrupted exits.
  scene.add(illustration)

  function draw(step: number, alpha: number) {
    zdrFrame(step, alpha).forEach((s, i) => objects[i].setPointsAsCorners(s.points).setStrokeOpacity(s.opacity))
  }

  // Exactly five play calls = five Slidev clicks. Text/math stays in Slidev/SVG.
  await scene.play(new UpdateFromAlphaFunc(illustration, (_, alpha) => draw(1, alpha), { duration: 1.5 }))
  await scene.play(new UpdateFromAlphaFunc(illustration, (_, alpha) => draw(2, alpha), { duration: 1.5 }))
  await scene.play(new UpdateFromAlphaFunc(illustration, (_, alpha) => draw(3, alpha), { duration: 1.5 }))
  await scene.play(new UpdateFromAlphaFunc(illustration, (_, alpha) => draw(4, alpha), { duration: 2.8 }))
  await scene.play(new UpdateFromAlphaFunc(illustration, (_, alpha) => draw(5, alpha), { duration: 2.8 }))
}
