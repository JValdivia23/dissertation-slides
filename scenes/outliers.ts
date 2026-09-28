import { Scene, UpdateFromAlphaFunc, VGroup, VMobject } from 'manim-web'
import data from '../data/outlier-animation.json'

type Point = [number, number, number]
type Sample = typeof data.focus
type Field = 'truth' | 'observed' | 'meanVector'

export const outlierData = data
export const outlierStages = ['Wind field', 'Noise + anomalies', 'Local mean', 'Local speed test', 'Detections']
export const outlierColors = {
  flow: '#85bec8', mean: '#cfb87c', tp: '#ff777f', fp: '#ffb45c', fn: '#78baff', ordinary: '#edf2f7',
}

// Orthographic projection of the original 3D coordinates. Shared by Manim and
// the initial SVG so entry / rewind to click zero has an identical first frame.
// Heights are compressed for readability; this is a view of a static volume.
const WIDTH = 1000
const HEIGHT = 560
const FRAME_W = 8.4
const FRAME_H = FRAME_W * HEIGHT / WIDTH
const YAW = 0.65
const ELEVATION = 0.42
const ZOOM = 6
const BACKGROUND = '#101b2b'

function project(p: number[], zoom = 1, center: number[] = [0, 0, 0]): Point {
  const [x, y, z] = p.map((value, axis) => value - center[axis])
  return [
    2 * zoom * (Math.cos(YAW) * x - Math.sin(YAW) * y),
    2 * zoom * (-Math.sin(ELEVATION) * (Math.sin(YAW) * x + Math.cos(YAW) * y) + 0.52 * Math.cos(ELEVATION) * z),
    0,
  ]
}

function mix(a: number[], b: number[], alpha: number) {
  return a.map((value, axis) => value + (b[axis] - value) * alpha)
}

function mixColor(a: string, b: string, alpha: number) {
  const rgb = (hex: string) => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16))
  return `#${mix(rgb(a), rgb(b), alpha).map(value => Math.round(value).toString(16).padStart(2, '0')).join('')}`
}

function arrowPoints(sample: Sample, vector: number[], zoom = 1, center: number[] = [0, 0, 0], length = 0.11): Point[] {
  const start = project(sample.position, zoom, center)
  const end = project(sample.position.map((p, axis) => p + length * vector[axis]), zoom, center)
  const dx = end[0] - start[0]
  const dy = end[1] - start[1]
  const size = Math.hypot(dx, dy)
  const ux = dx / Math.max(size, 1e-8)
  const uy = dy / Math.max(size, 1e-8)
  const tip = Math.min(size * 0.38, zoom > 2 ? 0.10 : 0.075)
  const left: Point = [end[0] - tip * ux - tip * 0.45 * uy, end[1] - tip * uy + tip * 0.45 * ux, 0]
  const right: Point = [end[0] - tip * ux + tip * 0.45 * uy, end[1] - tip * uy - tip * 0.45 * ux, 0]
  return [start, end, left, end, right]
}

function path(points: Point[], color: string, width = 2, opacity = 1) {
  return new VMobject().setPointsAsCorners(points).setColor(color).setStrokeWidth(width).setStrokeOpacity(opacity).setFillOpacity(0)
}

const corners: Point[] = Array.from({ length: 8 }, (_, i) => [i & 1 ? 1 : -1, i & 2 ? 1 : -1, i & 4 ? 1 : -1])
const edges = corners.flatMap((point, i) => [1, 2, 4].filter(bit => !(i & bit)).map(bit => [point, corners[i | bit]]))

function svgPath(points: Point[]) {
  return `M${points.map(([x, y]) => `${((x / FRAME_W + .5) * WIDTH).toFixed(2)},${((.5 - y / FRAME_H) * HEIGHT).toFixed(2)}`).join(' L')}`
}

export const outlierPreview = {
  edges: edges.map(edge => svgPath(edge.map(p => project(p)))),
  arrows: data.overview.map(sample => svgPath(arrowPoints(sample, sample.truth))),
}

function markPoints(position: number[], zoom: number, center: number[], radius: number): Point[] {
  const [x, y] = project(position, zoom, center)
  return Array.from({ length: 25 }, (_, i) => [x + radius * Math.cos(i * Math.PI / 12), y + radius * Math.sin(i * Math.PI / 12), 0])
}

function samePoint(a: Sample, b: Sample) {
  return a.index.every((value, axis) => value === b.index[axis])
}

export async function outlierDetection() {
  const scene = new Scene(document.getElementById('container'), {
    width: WIDTH, height: HEIGHT, frameWidth: FRAME_W, frameHeight: FRAME_H,
    backgroundColor: BACKGROUND,
  })
  const arrows = data.overview.map(sample => path(arrowPoints(sample, sample.truth), outlierColors.flow, 2, .8))
  const frameLines = edges.map(edge => path(edge.map(p => project(p)), '#52667b', 1.5, .55))
  const overview = new VGroup(...arrows, ...frameLines)
  // Register synchronously, before the first await, for CuManim cleanup.
  scene.add(overview)

  function drawOverview(from: Field, to: Field, alpha: number, zoom = 1, center: number[] = [0, 0, 0], opacity = 1, results = false) {
    data.overview.forEach((sample, index) => {
      const injected = sample.kind === 'tp' || sample.kind === 'fn'
      const fromColor = from === 'meanVector' ? outlierColors.mean : from === 'observed' && injected ? outlierColors.tp : outlierColors.flow
      const toColor = to === 'meanVector' ? outlierColors.mean : to === 'observed' && injected ? outlierColors.tp : outlierColors.flow
      const color = results ? outlierColors[sample.kind as keyof typeof outlierColors] : mixColor(fromColor, toColor, alpha)
      const emphasis = results ? (sample.kind === 'ordinary' ? .14 : 1) : .8
      arrows[index]
        .setPointsAsCorners(arrowPoints(sample, mix(sample[from], sample[to], alpha), zoom, center))
        .setColor(color).setStrokeWidth(injected || (results && sample.kind === 'fp') ? 2.8 : 2).setStrokeOpacity(opacity * emphasis)
    })
    edges.forEach((edge, i) => frameLines[i]
      .setPointsAsCorners(edge.map(p => project(p, zoom, center)))
      .setStrokeOpacity(.55 * opacity))
  }

  // 1: reveal the original perturbations at fixed grid positions.
  await scene.play(new UpdateFromAlphaFunc(overview, (_, alpha) => {
    drawOverview('truth', 'observed', alpha)
  }, { duration: 1.3 }))

  // 2: local-mean COMPONENTS show the smoothed circulation. Scoring below uses
  // mean(speed), NOT magnitude(meanVector); both came from the original script.
  await scene.play(new UpdateFromAlphaFunc(overview, (_, alpha) => {
    drawOverview('observed', 'meanVector', alpha)
  }, { duration: 1.3 }))

  const focusCenter = data.focus.position.map((value, axis) => axis === 2 ? value - .06 : value)
  const localArrows = data.neighborhood.map(sample => path(arrowPoints(sample, sample.observed), '#85bec8', 2, 0))
  const anomalyRing = path(markPoints(data.focus.position, ZOOM, focusCenter, .13), outlierColors.tp, 3, 0)
  const ordinaryRing = path(markPoints(data.ordinary.position, ZOOM, focusCenter, .13), outlierColors.ordinary, 3, 0)
  const neighborhood = new VGroup(...localArrows, anomalyRing, ordinaryRing)
  scene.add(neighborhood)

  function drawNeighborhood(alpha: number, zoom: number, center: number[]) {
    data.neighborhood.forEach((sample, i) => {
      const focal = samePoint(sample, data.focus)
      const ordinary = samePoint(sample, data.ordinary)
      localArrows[i]
        .setPointsAsCorners(arrowPoints(sample, sample.observed, zoom, center, .035))
        .setColor(focal ? outlierColors.tp : ordinary ? outlierColors.ordinary : outlierColors.flow)
        .setStrokeWidth(focal || ordinary ? 3.4 : 2).setStrokeOpacity(alpha * (focal || ordinary ? 1 : .42))
    })
    anomalyRing.setPointsAsCorners(markPoints(data.focus.position, zoom, center, .13)).setStrokeOpacity(alpha)
    ordinaryRing.setPointsAsCorners(markPoints(data.ordinary.position, zoom, center, .13)).setStrokeOpacity(alpha)
  }

  // 3: zoom into measured neighborhood context and inspect two actual scores.
  await scene.play(new UpdateFromAlphaFunc(neighborhood, (_, alpha) => {
    const zoom = 1 + (ZOOM - 1) * alpha
    const center = mix([0, 0, 0], focusCenter, alpha)
    drawOverview('meanVector', 'observed', alpha, zoom, center, 1 - alpha)
    drawNeighborhood(alpha, zoom, center)
  }, { duration: 1.5 }))

  const resultMarkers = data.overview.map(sample => path(markPoints(sample.position, 1, [0, 0, 0], .035), outlierColors[sample.kind as keyof typeof outlierColors], 3, 0))
  const results = new VGroup(...resultMarkers)
  scene.add(results)

  // 4: return to the volume; colors compare the detector against injection truth.
  await scene.play(new UpdateFromAlphaFunc(results, (_, alpha) => {
    const zoom = ZOOM + (1 - ZOOM) * alpha
    const center = mix(focusCenter, [0, 0, 0], alpha)
    drawNeighborhood(1 - alpha, zoom, center)
    drawOverview('observed', 'observed', 1, zoom, center, alpha, true)
    resultMarkers.forEach((marker, i) => marker
      .setPointsAsCorners(markPoints(data.overview[i].position, zoom, center, .035))
      .setStrokeOpacity(data.overview[i].kind === 'ordinary' ? 0 : alpha))
  }, { duration: 1.5 }))
}
