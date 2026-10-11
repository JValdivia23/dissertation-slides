import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { test } from 'node:test'
import {
  BREATH_PERIOD,
  breathingScale,
  createPhotoSimulation,
  photoHomes,
  photoOrder,
  photoRect,
  photoZoom,
  rectanglesOverlap,
  titleObstacle,
  zoomOpacity,
  zoomRect,
  ZOOM_DURATION,
} from '../components/thank-you-physics.ts'

const width = 980
const height = width * 9 / 16
const directory = new URL('../pictures/', import.meta.url)

function jpegAspect(filename: string) {
  const data = readFileSync(new URL(filename, directory))
  assert.equal(data.readUInt16BE(0), 0xFFD8)
  let offset = 2
  while (offset < data.length) {
    assert.equal(data[offset], 0xFF)
    while (data[offset] === 0xFF) offset++
    const marker = data[offset++]
    const length = data.readUInt16BE(offset)
    if ([0xC0, 0xC1, 0xC2].includes(marker))
      return data.readUInt16BE(offset + 5) / data.readUInt16BE(offset + 3)
    offset += length
  }
  throw new Error(`No JPEG dimensions found in ${filename}`)
}

const filenames = readdirSync(directory).filter(filename => /^acknowledgments-\d+[.]jpg$/.test(filename)).sort()
const aspects = filenames.map(jpegAspect)
const order = photoOrder(aspects.length)
const homes = photoHomes(aspects, width, height, order)
const obstacle = titleObstacle(width, height)

function close(a: number, b: number, tolerance = 1e-8) {
  assert.ok(Math.abs(a - b) < tolerance, `${a} differs from ${b}`)
}

function assertSafe(rect: ReturnType<typeof photoRect>) {
  assert.ok(rect.left >= 18 - 1e-8 && rect.right <= width - 18 + 1e-8, 'Horizontal clipping')
  assert.ok(rect.top >= 18 - 1e-8 && rect.bottom <= height - 18 + 1e-8, 'Vertical clipping')
  assert.ok(!rectanglesOverlap(rect, obstacle), 'Photo crosses the heading or pause control')
}

test('all photographs retain their proportions in the static collage', () => {
  assert.equal(homes.length, filenames.length)
  assert.equal(new Set(order).size, filenames.length)
  for (const home of homes) {
    close(home.width / home.height, aspects[home.index])
    assertSafe(photoRect({ ...home, scale: 1 }))
  }
})

test('every breathing phase spans 0.5× to 2× with staggered crests', () => {
  for (let rank = 0; rank < homes.length; rank++) {
    let min = Infinity
    let max = -Infinity
    for (let frame = 0; frame <= 1200; frame++) {
      const scale = breathingScale(5 + frame / 1200 * BREATH_PERIOD, rank / homes.length)
      assert.ok(scale >= 0.5 && scale <= 2)
      min = Math.min(min, scale)
      max = Math.max(max, scale)
    }
    assert.ok(min < 0.501 && max > 1.999)
  }
  const large = homes.filter((_, rank) => breathingScale(10, rank / homes.length) > 1.6)
  assert.ok(large.length > 0 && large.length < homes.length / 4, 'Too many photos expand together')
})

test('growing cards push their neighbors instead of passing through them', () => {
  const simulation = createPhotoSimulation([
    { index: 0, x: 130, y: 100, width: 100, height: 70 },
    { index: 1, x: 255, y: 100, width: 100, height: 70 },
  ], width, height)
  simulation.bodies[0].scale = 2
  simulation.step(1 / 60, -1)
  assert.ok(simulation.bodies[1].x - simulation.bodies[0].x > 125)
  assert.ok(!rectanglesOverlap(photoRect(simulation.bodies[0]), photoRect(simulation.bodies[1])))
})

test('extended playback keeps photographs separated, near home, and clear of the heading', () => {
  const simulation = createPhotoSimulation(homes, width, height)
  let maxDisplacement = 0
  let maxPenetration = 0
  let maxStep = 0
  for (let frame = 0; frame < 13800; frame++) {
    const before = simulation.bodies.map(body => ({ x: body.x, y: body.y }))
    simulation.step(1 / 60, frame / 60 - 1.4)
    for (const body of simulation.bodies) {
      assertSafe(photoRect(body))
      assert.ok(body.scale >= 0.5 && body.scale <= 2)
      maxDisplacement = Math.max(maxDisplacement, Math.hypot(body.x - body.homeX, body.y - body.homeY))
      maxStep = Math.max(maxStep, Math.hypot(body.x - before[body.index].x, body.y - before[body.index].y))
    }
    for (let i = 0; i < simulation.bodies.length; i++) {
      const a = photoRect(simulation.bodies[i])
      for (let j = i + 1; j < simulation.bodies.length; j++) {
        const b = photoRect(simulation.bodies[j])
        if (rectanglesOverlap(a, b))
          maxPenetration = Math.max(maxPenetration, Math.min(a.right - b.left, b.right - a.left, a.bottom - b.top, b.bottom - a.top))
      }
    }
  }
  assert.ok(maxDisplacement > 10, 'The collage should visibly respond to expansion')
  assert.ok(maxDisplacement < width * 0.22, 'Cards must remain near their home positions')
  assert.ok(maxPenetration < 3, `Persistent thumbnail overlap: ${maxPenetration.toFixed(2)} px`)
  assert.ok(maxStep < 4, `Sudden position change: ${maxStep.toFixed(2)} px per frame`)
})

test('spotlights expand from a fixed point in the existing photograph', () => {
  const simulation = createPhotoSimulation(homes, width, height)
  const lanes = new Set<string>()
  for (const body of simulation.bodies) {
    const zoom = photoZoom(body, width, height)
    const initial = photoRect(body)
    const start = zoomRect(zoom, 0)
    close(start.left, initial.left)
    close(start.top, initial.top)
    close(start.right, initial.right)
    close(start.bottom, initial.bottom)
    assert.ok(zoom.targetScale >= zoom.initialScale)
    for (let step = 0; step <= 100; step++) {
      const rect = zoomRect(zoom, step / 100 * ZOOM_DURATION)
      assertSafe(rect)
      close(rect.left + (rect.right - rect.left) * zoom.originX, zoom.anchorX)
      close(rect.top + (rect.bottom - rect.top) * zoom.originY, zoom.anchorY)
      close((rect.right - rect.left) / (rect.bottom - rect.top), aspects[body.index])
    }
    const end = zoomRect(zoom, ZOOM_DURATION)
    close(end.left, initial.left)
    close(end.top, initial.top)
    lanes.add(body.y < height * 0.4 ? 'top' : body.y > height * 0.6 ? 'bottom' : body.x < width / 2 ? 'left' : 'right')
  }
  assert.equal(lanes.size, 4, 'Spotlights must occur throughout the canvas')
})

test('an anchored foreground zoom does not freeze its background body', () => {
  const simulation = createPhotoSimulation(homes, width, height)
  const source = simulation.bodies[order[0]]
  const zoom = photoZoom(source, width, height)
  for (let frame = 0; frame < 240; frame++) {
    simulation.step(1 / 60, frame / 60)
    const rect = zoomRect(zoom, frame / 60)
    close(rect.left + (rect.right - rect.left) * zoom.originX, zoom.anchorX)
    close(rect.top + (rect.bottom - rect.top) * zoom.originY, zoom.anchorY)
  }
  assert.ok(Math.abs(source.scale - zoom.initialScale) > 0.1)
  close(zoomOpacity(0), 1)
  close(zoomOpacity(ZOOM_DURATION), 0)
})

test('empty, single-photo, and odd-count galleries have deterministic, complete orders', () => {
  for (const count of [0, 1, 42, 43, 44]) {
    const sequence = photoOrder(count)
    assert.deepEqual(sequence, photoOrder(count))
    assert.equal(new Set(sequence).size, count)
    assert.equal(photoHomes(Array(count).fill(4 / 3), width, height, sequence).length, count)
  }
})

test('zero-time updates preserve every position and size', () => {
  const simulation = createPhotoSimulation(homes, width, height)
  simulation.step(1 / 60, 5)
  const before = simulation.bodies.map(body => ({ ...body }))
  simulation.step(0, 20)
  assert.deepEqual(simulation.bodies, before)
})
