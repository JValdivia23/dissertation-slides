import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  boxcarResponse,
  cosineBasis,
  cosineWeights,
  dctData,
  meanReferencedModeAt,
  partialReconstructionAt,
  reconstructAt,
  reflectedBoxcar,
  reflectedIndex,
} from '../scenes/dct-convolution-data.ts'
import { rotateDctPoint, type DctPoint } from '../scenes/dct-convolution-view.ts'

function close(actual: number, expected: number, tolerance = 1e-10) {
  assert.ok(Math.abs(actual - expected) < tolerance, `${actual} differs from ${expected}`)
}

test('all twelve original samples are reconstructed by the twelve cosine weights', () => {
  assert.equal(dctData.weights.length, 12)
  close(dctData.weights[0], dctData.samples.reduce((sum, value) => sum + value, 0) / 12)
  dctData.samples.forEach((value, n) => close(reconstructAt(dctData.weights, n), value))
})

test('the constant mode stays at the mean and higher modes retain their signed amplitudes', () => {
  for (const weights of [dctData.weights, dctData.filteredWeights]) {
    const mean = weights[0]
    for (let k = 0; k < 12; k++) {
      const samples = Array.from({ length: 12 }, (_, n) => meanReferencedModeAt(weights, k, n))
      close(samples.reduce((sum, value) => sum + value, 0) / 12, mean)
      if (k === 0) samples.forEach(value => close(value, mean))
      // At the half-sample boundary every basis cosine is +1, so the
      // departure from the displayed reference is exactly its signed weight.
      close(meanReferencedModeAt(weights, k, -.5) - mean, k === 0 ? 0 : weights[k])
    }
  }
})

test('adding the mean once and the displayed deviations recovers each sample', () => {
  for (const weights of [dctData.weights, dctData.filteredWeights]) {
    for (let n = 0; n < 12; n++) {
      let sum = weights[0]
      for (let k = 1; k < 12; k++) sum += meanReferencedModeAt(weights, k, n) - weights[0]
      close(sum, reconstructAt(weights, n))
    }
  }
})

test('the reconstruction animation begins at the mean, not at the zero axis', () => {
  for (let n = 0; n < 12; n++) {
    close(partialReconstructionAt(dctData.filteredWeights, n, 0), dctData.weights[0])
    close(partialReconstructionAt(dctData.filteredWeights, n, 1), dctData.smoothed[n])
  }
})

test('camera rotation fixes the mean pivot and preserves the three-dimensional geometry', () => {
  const pivot: DctPoint = [-1.15, -2.55 + .045 * dctData.weights[0], 0]
  const point: DctPoint = [3.1, pivot[1] + .5, 7.37]
  for (const yaw of [0, Math.PI / 6, Math.PI / 2]) {
    for (const elevation of [0, 25 * Math.PI / 180, Math.PI / 3]) {
      rotateDctPoint(pivot, pivot, yaw, elevation).forEach((value, i) => close(value, pivot[i]))
      const rotated = rotateDctPoint(point, pivot, yaw, elevation)
      close(Math.hypot(...rotated.map((value, i) => value - pivot[i])),
        Math.hypot(...point.map((value, i) => value - pivot[i])))
    }
  }
})

test('30-degree yaw and 25-degree elevation visibly tilt the constant-value sample axis', () => {
  const yaw = 30 * Math.PI / 180
  const elevation = 25 * Math.PI / 180
  const pivot: DctPoint = [-1.15, -2.55 + .045 * dctData.weights[0], 0]
  const left = rotateDctPoint([-5.4, pivot[1], 0], pivot, yaw, elevation)
  const right = rotateDctPoint([3.1, pivot[1], 0], pivot, yaw, elevation)
  const dx = right[0] - left[0]
  const dy = right[1] - left[1]
  close(dy / dx, -Math.tan(yaw) * Math.sin(elevation))
  assert.ok(Math.abs(dy) > 1, 'Yaw must affect projected vertical positions, not only horizontal spacing.')
  const angle = Math.atan2(dy, dx) * 180 / Math.PI
  assert.ok(angle < -13 && angle > -14, `Unexpected projected sample-axis angle: ${angle}`)
})

test('all twelve mean baselines share the same tilt with consistent depth separation', () => {
  const yaw = Math.PI / 6
  const elevation = 25 * Math.PI / 180
  const pivot: DctPoint = [-1.15, -2.55 + .045 * dctData.weights[0], 0]
  const front = rotateDctPoint([-5.4, pivot[1], 0], pivot, yaw, elevation)
  for (let k = 0; k < 12; k++) {
    const left = rotateDctPoint([-5.4, pivot[1], k * .67], pivot, yaw, elevation)
    const right = rotateDctPoint([3.1, pivot[1], k * .67], pivot, yaw, elevation)
    close(left[0] - front[0], k * .67 * Math.sin(yaw))
    close(left[1] - front[1], k * .67 * Math.cos(yaw) * Math.sin(elevation))
    close((right[1] - left[1]) / (right[0] - left[0]), -Math.tan(yaw) * Math.sin(elevation))
  }
})

test('the sampled DCT-II cosine basis is orthogonal, including the constant mode', () => {
  for (let k = 0; k < 12; k++) {
    for (let j = 0; j < 12; j++) {
      const product = Array.from({ length: 12 }, (_, n) => cosineBasis(k, n, 12) * cosineBasis(j, n, 12))
        .reduce((sum, value) => sum + value, 0)
      close(product, k !== j ? 0 : k === 0 ? 12 : 6)
    }
  }
})

test('the boxcar spectrum preserves the mean and correctly reverses negative-gain modes', () => {
  close(dctData.response[0], 1)
  close(dctData.response[8], 0)
  close(dctData.filteredWeights[0], dctData.weights[0])
  for (let k = 9; k < 12; k++) {
    assert.ok(dctData.response[k] < 0)
    assert.ok(dctData.weights[k] < 0)
    assert.ok(dctData.filteredWeights[k] > 0)
  }
})

test('spectral filtering equals direct reflected convolution at every sample', () => {
  dctData.smoothed.forEach((value, n) => close(value, dctData.spatialReference[n]))
  close(dctData.smoothed[0], (23 + 23 + 40) / 3)
  close(dctData.smoothed[11], (51 + 26 + 26) / 3)
})

test('reflection repeats endpoint samples, not opposite edges', () => {
  assert.deepEqual([-3, -2, -1, 0, 11, 12, 13, 14].map(n => reflectedIndex(n, 12)),
    [2, 1, 0, 0, 11, 11, 10, 9])
})

test('the same normalization and reflection work for other lengths and odd windows', () => {
  for (const length of [1, 2, 7, 12, 16]) {
    const samples = Array.from({ length }, (_, n) => 4 + 3 * Math.sin(n * 1.7) - .4 * n)
    const weights = cosineWeights(samples)
    for (const width of [1, 3, 5]) {
      const gain = boxcarResponse(length, width)
      const filtered = weights.map((weight, k) => weight * gain[k])
      reflectedBoxcar(samples, width).forEach((value, n) => close(reconstructAt(filtered, n), value))
    }
  }
})
