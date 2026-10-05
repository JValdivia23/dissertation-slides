import { Scene, Text, UpdateFromAlphaFunc, VGroup, VMobject, linear } from 'manim-web'
import { dctData, meanReferencedModeAt, partialReconstructionAt } from './dct-convolution-data'
import { rotateDctPoint } from './dct-convolution-view'

type Point = [number, number, number]
type View = { yaw: number, elevation: number, scale: number, offset: number, offsetY: number }

const WIDTH = 1080
const HEIGHT = 440
const FRAME_W = 17.5
const FRAME_H = FRAME_W * HEIGHT / WIDTH
const BACKGROUND = '#101b2b'
const WHITE = '#edf2f7'
const MUTED = '#9baec3'
const GRID = '#52667b'
const INPUT = '#78baff'
const GOLD = '#cfb87c'
const NEGATIVE = '#f28f9b'
const COLORS = ['#cfb87c', '#85d4d1', '#83cbe2', '#83bdef', '#9daff1', '#b7a1ee',
  '#d49ddd', '#e4a3c6', '#f0afad', '#f1be99', '#e0ce94', '#bdd994']
const N = dctData.samples.length
const CURVE_SAMPLES = 145
const SIGNAL_SCALE = .045
// The data-value origin is shared by every frame. Rotate around the mean
// instead of translating the signal to a separate decomposition baseline.
const SIGNAL_BASE = -2.55
const SIGNAL_CENTER = -1.15
const MEAN = dctData.weights[0]
const MEAN_HEIGHT = SIGNAL_BASE + SIGNAL_SCALE * MEAN
const BAR_BASE = -.6
const BAR_WIDTH = .38
const BAR_SCALE = .055
const GAIN_BASE = -2.22
const GAIN_SCALE = .72
const FRONT: View = { yaw: 0, elevation: 0, scale: 1.35, offset: 0, offsetY: 0 }
// Pan the entire depth figure down, without changing its rotation or data.
const DEPTH: View = { yaw: 30 * Math.PI / 180, elevation: 25 * Math.PI / 180, scale: 1, offset: -2.1, offsetY: -.5 }

export const dctStages = ['Original signal', 'DCT: mean and weighted cosines', 'Cosine coefficients',
  'Apply the boxcar transfer function', 'Return to the cosine components', 'Inverse DCT: reconstruct the signal']

function mix(a: number, b: number, alpha: number) { return a + (b - a) * alpha }
function clamp(value: number) { return Math.max(0, Math.min(1, value)) }
function interval(alpha: number, start: number, end: number) { return clamp((alpha - start) / (end - start)) }
function pointMix(a: Point, b: Point, alpha: number): Point {
  return [mix(a[0], b[0], alpha), mix(a[1], b[1], alpha), mix(a[2], b[2], alpha)]
}
function viewMix(a: View, b: View, alpha: number): View {
  return { yaw: mix(a.yaw, b.yaw, alpha), elevation: mix(a.elevation, b.elevation, alpha),
    scale: mix(a.scale, b.scale, alpha), offset: mix(a.offset, b.offset, alpha),
    offsetY: mix(a.offsetY, b.offsetY, alpha) }
}

// A complete yaw/elevation rotation, followed by orthographic projection.
// The mean at the center of the front signal is the rotation anchor;
// its line tilts with the sample axis, but its underlying value never changes.
// Front-view horizontal fitting does not affect the depth view's angles.
// Text remains camera-facing and replay is independent of camera timers.
// There are no SVG/HTML figure overlays: paths, labels, and bars are mobjects.
function project(x: number, y: number, z: number, view: View): Point {
  const rotated = rotateDctPoint([x, y, z], [SIGNAL_CENTER, MEAN_HEIGHT, 0], view.yaw, view.elevation)
  return [view.offset + view.scale * (rotated[0] - SIGNAL_CENTER), rotated[1] + view.offsetY, 0]
}
function sampleX(n: number) { return -5.4 + 8.5 * (n + .5) / N }
function modeDepth(k: number) { return k * .67 }
function barX(k: number) { return -5.85 + 11.7 * k / (N - 1) }
function sampleLine(n: number) {
  const start = Math.max(0, Math.min(N - 1, Math.floor(n)))
  const end = Math.max(0, Math.min(N - 1, start + 1))
  return mix(dctData.samples[start], dctData.samples[end], clamp(n - start))
}
function curve(fn: (n: number) => Point) {
  return Array.from({ length: CURVE_SAMPLES }, (_, i) => fn(-.5 + N * i / (CURVE_SAMPLES - 1)))
}
function circle(center: Point, radius: number) {
  return Array.from({ length: 21 }, (_, i): Point => [center[0] + radius * Math.cos(i * Math.PI / 10),
    center[1] + radius * Math.sin(i * Math.PI / 10), 0])
}
function rectangle(x: number, baseline: number, width: number, height: number): Point[] {
  return [[x - width / 2, baseline, 0], [x + width / 2, baseline, 0],
    [x + width / 2, baseline + height, 0], [x - width / 2, baseline + height, 0],
    [x - width / 2, baseline, 0]]
}
function signed(value: number) {
  if (Math.abs(value) < 1e-9) return '0'
  const decimals = Math.abs(value) < .05 ? 3 : 2
  return `${value < 0 ? '−' : '+'}${Math.abs(value).toFixed(decimals)}`
}

export async function dctConvolution(getInitialClick: () => number = () => 0) {
  const scene = new Scene(document.getElementById('container'), {
    width: WIDTH, height: HEIGHT, frameWidth: FRAME_W, frameHeight: FRAME_H,
    backgroundColor: BACKGROUND, frustumCulling: false,
  })
  const all: Array<VMobject | Text> = []
  function path(color: string, width = 2, fill = false) {
    const item = new VMobject().setPointsAsCorners([[0, 0, 0], [.001, 0, 0]])
      .setColor(color).setStrokeWidth(width).setFillOpacity(fill ? 1 : 0).setStrokeOpacity(0)
    all.push(item)
    return item
  }
  function label(text: string, color = WHITE, height = .25) {
    const item = new Text({ text, color, fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 48 })
    // Text uses a synchronous canvas texture; no font/glyph network request is
    // necessary, and the same textured label can move with its coefficient.
    item.getThreeObject()
    item.scale(height / item.getHeight())
    item.opacity = 0
    all.push(item)
    return item
  }
  function drawPath(item: VMobject, points: Point[], opacity: number) {
    item.getThreeObject().visible = opacity > 0
    if (opacity <= 0) return
    item.setPointsAsCorners(points).setStrokeOpacity(opacity)
  }
  function drawLabel(item: Text, position: Point, opacity = 1) {
    item.getThreeObject().visible = opacity > 0
    if (opacity <= 0) return
    item.moveTo(position)
    item.opacity = opacity
  }

  // Pre-render alternate text and crossfade it. In 0.3.24, setText() inside a
  // VGroup updater can resize the mesh without refreshing its rendered raster.
  // Fixed native Text mobjects avoid that observed texture-refresh problem.
  const headings = dctStages.map(title => label(title, WHITE, .36))
  const captions = ['Twelve sampled values · x[n]', null, null,
    'H(k) = [1 + 2 cos(πk/12)] / 3     ·     bₖ = aₖ H(k)',
    null, 'y[n] = μ + Σₖ₌₁¹¹ bₖ cos[πk(n + ½)/12]']
    .map(text => text === null ? null : label(text, MUTED, .25))
  const meanLabel = label(`μ = ${MEAN.toFixed(2)}`, GOLD, .25)
  const original = path(INPUT, 3)
  const result = path(GOLD, 4)
  const originalDots = dctData.samples.map(() => path(INPUT, 0, true))
  const resultDots = dctData.samples.map(() => path(GOLD, 0, true))
  const sampleAxis = path(GRID, 1.5)
  const sampleTicks = dctData.samples.map(() => path(GRID, 1))
  const sampleNumbers = dctData.samples.map((_, n) => label(String(n), MUTED, .21))
  const sampleAxisTitle = label('Sample position n', MUTED, .23)
  const depthAxis = path(GRID, 1.5)
  const depthAxisTitle = label('Mode k', MUTED, .23)
  const modeLines = dctData.samples.map((_, k) => path(COLORS[k], 2.3))
  const modeBaselines = dctData.samples.map(() => path(GRID, 1))
  const modeNumbers = dctData.samples.map((_, k) => label(`k=${k}`, COLORS[k], .24))
  const plotIndices = dctData.samples.map((_, k) => label(String(k), COLORS[k], .24))
  const weights = dctData.weights.map((weight, k) => label(signed(weight), COLORS[k], .24))
  const filteredLabels = dctData.filteredWeights.map((weight, k) => label(signed(weight), COLORS[k], .24))
  const bars = dctData.samples.map((_, k) => path(COLORS[k], 0, true))
  const ghostBars = dctData.samples.map((_, k) => path(COLORS[k], 1.4))
  const plotLevels = [-10, 0, 20, 40]
  const plotGuides = plotLevels.map(() => path(GRID, 1))
  const plotNumbers = plotLevels.map(value => label(String(value), MUTED, .21))
  const originalWeightTitle = label('aₖ', MUTED, .23)
  const filteredWeightTitle = label('bₖ', MUTED, .23)
  const gainCurve = path(GOLD, 2.7)
  const gainAxis = path(GRID, 1.2)
  const gainDots = dctData.response.map((_, k) => path(k > 8 ? NEGATIVE : GOLD, 0, true))
  const gainLabels = dctData.response.map((gain, k) => label(
    `×${gain < 0 ? '−' : ''}${Math.abs(gain).toFixed(2)}`, k > 8 ? NEGATIVE : GOLD, .21))
  const gainTitle = label('H(k)', GOLD, .23)
  const gainZero = label('0', MUTED, .21)
  const originalLegend = label('Original', INPUT, .25)
  const resultLegend = label('Smoothed', GOLD, .25)
  const illustration = new VGroup(...all).disableChildZLayering()

  function draw(step: number, alpha = 1) {
    alpha = clamp(alpha)
    const reveal = step === 1 ? alpha : step === 0 ? 0 : 1
    const toPlot = step === 2 ? alpha : step === 3 ? 1 : step === 4 ? 1 - alpha : 0
    const filtering = step === 3 ? interval(alpha, .34, .94) : step >= 4 ? 1 : 0
    const transfer = step === 3 ? interval(alpha, 0, .32) : step === 4 ? 1 - alpha : 0
    const reconstructing = step === 5
    const sumProgress = reconstructing ? interval(alpha, .08, .9) : 0
    const view = step === 0 ? FRONT : step === 1 ? viewMix(FRONT, DEPTH, alpha)
      : reconstructing ? viewMix(DEPTH, FRONT, interval(alpha, .15, 1)) : DEPTH
    const scale = mix(BAR_SCALE, .044, transfer)
    const plotOpacity = step === 2 ? interval(alpha, .3, .85) : step === 3 ? 1 : step === 4 ? 1 - interval(alpha, 0, .7) : 0
    const modeOpacity = step === 1 ? interval(alpha, .08, .7) : step === 2 ? 1 - interval(alpha, 0, .7)
      : step === 4 ? interval(alpha, .25, .85) : step === 5 ? 1 - sumProgress : 0
    const originalOpacity = step === 0 ? 1 : step === 1 ? mix(1, .12, alpha) : step === 2 ? .12 * (1 - alpha)
      : step === 4 ? .12 * alpha : step === 5 ? mix(.12, .22, alpha) : 0
    const axisOpacity = step === 0 ? .8 : step === 1 ? .8 : step === 2 ? .8 * (1 - alpha)
      : step === 4 ? .8 * alpha : step === 5 ? .8 : 0
    const depths = dctData.samples.map((_, k) => modeDepth(k) * reveal * (1 - sumProgress))
    const currentWeights = dctData.weights.map((value, k) => mix(value, dctData.filteredWeights[k], filtering))

    headings.forEach((item, index) => drawLabel(item, [0, 3.25, 0], index === step ? 1 : 0))
    captions.forEach((item, index) => {
      if (item) drawLabel(item, [0, index === 0 ? 2.67 : -3.02, 0], index === step ? 1 : 0)
    })

    const inputPoints = dctData.samples.map((value, n) => project(sampleX(n), SIGNAL_BASE + SIGNAL_SCALE * value, 0, view))
    drawPath(original, inputPoints, originalOpacity)
    inputPoints.forEach((point, n) => drawPath(originalDots[n], circle(point, .055), originalOpacity))
    // Move the reference axis up to the mean. The signal and all components
    // rotate together about that mean, with no independent downward shift.
    const axisHeight = step === 0 ? SIGNAL_BASE : step === 1
      ? mix(SIGNAL_BASE, MEAN_HEIGHT, interval(alpha, 0, .22)) : MEAN_HEIGHT
    const axisStart = project(sampleX(-.5), axisHeight, 0, view)
    const axisEnd = project(sampleX(N - .5), axisHeight, 0, view)
    drawPath(sampleAxis, [axisStart, axisEnd], axisOpacity)
    dctData.samples.forEach((_, n) => {
      const tick = project(sampleX(n), axisHeight, 0, view)
      drawPath(sampleTicks[n], [tick, [tick[0], tick[1] - .08, 0]], axisOpacity)
      drawLabel(sampleNumbers[n], [tick[0], tick[1] - .23, 0], axisOpacity)
    })
    drawLabel(sampleAxisTitle, [0, step === 0 ? -3.08 : -2.48, 0], axisOpacity * (step === 1 || step === 4 ? 0 : 1))
    const meanStart = project(sampleX(-.5), MEAN_HEIGHT, 0, view)
    drawLabel(meanLabel, [meanStart[0] - 1.1, meanStart[1], 0], step === 1 ? interval(alpha, .1, .32)
      : step === 2 ? 1 - alpha : step === 4 ? alpha : step === 5 ? 1 : 0)
    drawPath(depthAxis, [project(-5.4, MEAN_HEIGHT, 0, view), project(-5.4, MEAN_HEIGHT, modeDepth(N - 1) * reveal, view)], .5 * modeOpacity)
    drawLabel(depthAxisTitle, project(-6.2, MEAN_HEIGHT, modeDepth(N - 1) / 2, view), .8 * modeOpacity)

    for (let k = 0; k < N; k++) {
      const basisPoints = curve(n => {
        const height = SIGNAL_BASE + SIGNAL_SCALE * meanReferencedModeAt(currentWeights, k, n)
        const basisPoint = project(sampleX(n), height, depths[k], view)
        if (step === 1) {
          const source = project(sampleX(n), SIGNAL_BASE + SIGNAL_SCALE * sampleLine(n), 0, view)
          return pointMix(source, basisPoint, interval(alpha, k * .025, .68 + k * .025))
        }
        if (step === 2 || step === 4) {
          const destination: Point = [barX(k), BAR_BASE + currentWeights[k] * scale, 0]
          return pointMix(basisPoint, destination, toPlot)
        }
        return basisPoint
      })
      drawPath(modeLines[k], basisPoints, modeOpacity)
      drawPath(modeBaselines[k], [project(sampleX(-.5), MEAN_HEIGHT, depths[k], view),
        project(sampleX(N - .5), MEAN_HEIGHT, depths[k], view)], .3 * modeOpacity)

      const modePosition = project(3.55, MEAN_HEIGHT, modeDepth(k), DEPTH)
      const weightPosition: Point = [project(5, MEAN_HEIGHT, modeDepth(k), DEPTH)[0], modePosition[1], 0]
      const barPosition: Point = [barX(k), BAR_BASE + Math.max(0, currentWeights[k] * scale) + .24, 0]
      const indexPosition: Point = [barX(k), mix(-1.52, -2.65, transfer), 0]
      const labelOpacity = step === 0 ? 0 : step === 1 ? interval(alpha, .32, .9) : step === 5 ? 1 - interval(alpha, 0, .65) : 1
      const depthIndex = step === 1 ? pointMix(project(3.55, MEAN_HEIGHT, 0, FRONT), modePosition, alpha) : modePosition
      const depthWeight = step === 1 ? pointMix(project(5, MEAN_HEIGHT, 0, FRONT), weightPosition, alpha) : weightPosition
      const indexBlend = interval(toPlot, .55, .85)
      const indexLocation = pointMix(depthIndex, indexPosition, toPlot)
      drawLabel(modeNumbers[k], indexLocation, labelOpacity * (1 - indexBlend))
      drawLabel(plotIndices[k], indexLocation, labelOpacity * indexBlend)
      const weightLocation = pointMix(depthWeight, barPosition, toPlot)
      const filteredText = step === 3 ? interval(alpha, .42, .9) : step >= 4 ? 1 : 0
      drawLabel(weights[k], weightLocation, labelOpacity * (1 - filteredText))
      drawLabel(filteredLabels[k], weightLocation, labelOpacity * filteredText)
      drawPath(bars[k], rectangle(barX(k), BAR_BASE, BAR_WIDTH, currentWeights[k] * scale), .88 * plotOpacity)
      drawPath(ghostBars[k], rectangle(barX(k), BAR_BASE, BAR_WIDTH + .08, dctData.weights[k] * scale),
        .34 * filtering * plotOpacity)
      const gainPoint: Point = [barX(k), GAIN_BASE + GAIN_SCALE * dctData.response[k], 0]
      drawPath(gainDots[k], circle(gainPoint, .045), transfer)
      drawLabel(gainLabels[k], [barX(k), -1.44, 0], transfer)
    }

    plotLevels.forEach((value, index) => {
      const y = BAR_BASE + value * scale
      drawPath(plotGuides[index], [[-6.4, y, 0], [6.4, y, 0]], plotOpacity * (value === 0 ? .85 : .2))
      drawLabel(plotNumbers[index], [-6.7, y, 0], .8 * plotOpacity)
    })
    drawLabel(originalWeightTitle, [-6.7, 2.15, 0], plotOpacity * (1 - filtering))
    drawLabel(filteredWeightTitle, [-6.7, 2.15, 0], plotOpacity * filtering)
    const gainPoints = Array.from({ length: 97 }, (_, i): Point => {
      const k = (N - 1) * i / 96
      return [barX(k), GAIN_BASE + GAIN_SCALE * (1 + 2 * Math.cos(Math.PI * k / N)) / 3, 0]
    })
    const visibleGainPoints = gainPoints.slice(0, Math.max(2, Math.ceil(transfer * gainPoints.length)))
    drawPath(gainCurve, visibleGainPoints, transfer)
    drawPath(gainAxis, [[-6.4, GAIN_BASE, 0], [6.4, GAIN_BASE, 0]], .6 * transfer)
    drawLabel(gainTitle, [-6.82, -1.68, 0], transfer)
    drawLabel(gainZero, [-6.7, GAIN_BASE, 0], transfer)

    // Sum the deviations, retaining the constant mean exactly once. The
    // animation starts at that mean, not zero, and never sums the repeated
    // mean offsets that were used only to align the displayed mode layers.
    const sumPoints = curve(n => project(sampleX(n), SIGNAL_BASE + SIGNAL_SCALE *
      partialReconstructionAt(dctData.filteredWeights, n, sumProgress), 0, view))
    drawPath(result, sumPoints, reconstructing ? interval(alpha, 0, .15) : 0)
    const complete = reconstructing ? interval(alpha, .8, 1) : 0
    dctData.smoothed.forEach((value, n) => drawPath(resultDots[n], circle(project(sampleX(n), SIGNAL_BASE + SIGNAL_SCALE * value, 0, view), .061), complete))
    drawLabel(originalLegend, [-1.3, 2.2, 0], complete)
    drawLabel(resultLegend, [1.3, 2.2, 0], complete)
  }

  draw(0)
  scene.add(illustration) // Register synchronously so CuManim owns cleanup.
  // CuManim defers add() until the first play. Mount this same native Manim
  // object for click zero; on click one the adapter adopts it into Scene's
  // tracked mobjects. No separate renderer, image, or first-frame overlay.
  illustration._syncToThree()
  scene.threeScene.add(illustration.getThreeObject())
  illustration.getThreeObject().traverse((object: { material?: { resolution?: { set: (w: number, h: number) => void } } }) => {
    object.material?.resolution?.set(WIDTH, HEIGHT)
  })
  scene.render()

  // Also handle direct entry/re-entry at a restored click, which can settle
  // after the adapter captures its replay limit. The scene is registered first.
  await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
  const initialClick = getInitialClick()
  const duration = (step: number, seconds: number) => step <= initialClick ? .001 : seconds
  try {
    // Exactly five play calls = five presentation clicks. All timed movement,
    // including the 3D-view rotation and Text positions, is inside these plays.
    await scene.play(new UpdateFromAlphaFunc(illustration, (_, a) => draw(1, a), { duration: duration(1, 2.4), rateFunc: linear }))
    await scene.play(new UpdateFromAlphaFunc(illustration, (_, a) => draw(2, a), { duration: duration(2, 2), rateFunc: linear }))
    await scene.play(new UpdateFromAlphaFunc(illustration, (_, a) => draw(3, a), { duration: duration(3, 3.2), rateFunc: linear }))
    await scene.play(new UpdateFromAlphaFunc(illustration, (_, a) => draw(4, a), { duration: duration(4, 2), rateFunc: linear }))
    await scene.play(new UpdateFromAlphaFunc(illustration, (_, a) => draw(5, a), { duration: duration(5, 4), rateFunc: linear }))
  }
  catch (error) {
    // Leaving at click zero aborts before Scene adopts the primed native group.
    // Explicit disposal covers that untracked initial frame as well.
    illustration.dispose()
    throw error
  }
}
