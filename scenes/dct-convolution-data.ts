// The twelve heights from the former DCT-introduction SVG, measured upward
// from its y=110 baseline. These are illustrative values, not radar data.
export const dctSamples = [23, 40, 33, 67, 56, 28, 42, 72, 52, 35, 51, 26]

export function cosineBasis(k: number, n: number, length: number) {
  return Math.cos(Math.PI * k * (n + .5) / length)
}

// Expansion weights, rather than an unnormalized library DCT-II output:
// x[n] = sum_k a[k] cos(pi k (n + 1/2) / N). The constant mode uses 1/N;
// the remaining modes use 2/N. Use the same convention in every view.
export function cosineWeights(samples: number[]) {
  return samples.map((_, k) => samples.reduce((sum, value, n) =>
    sum + value * cosineBasis(k, n, samples.length), 0) * (k === 0 ? 1 : 2) / samples.length)
}

export function reconstructAt(weights: number[], n: number) {
  return weights.reduce((sum, weight, k) => sum + weight * cosineBasis(k, n, weights.length), 0)
}

// The depth view shares the original signal's mean as its visual reference.
// The constant mode is the mean itself; higher modes show their weighted
// deviations about it. Those display offsets must not be summed repeatedly.
export function meanReferencedModeAt(weights: number[], k: number, n: number) {
  return weights[0] + (k === 0 ? 0 : weights[k] * cosineBasis(k, n, weights.length))
}

export function partialReconstructionAt(weights: number[], n: number, progress: number) {
  let sum = weights[0]
  for (let k = 1; k < weights.length; k++) {
    const amount = Math.max(0, Math.min(1, (weights.length - 1) * progress - (k - 1)))
    sum += amount * weights[k] * cosineBasis(k, n, weights.length)
  }
  return sum
}

export function boxcarResponse(length: number, width = 3) {
  if (!Number.isInteger(width) || width < 1 || width % 2 === 0)
    throw new RangeError('The illustrative boxcar must have a positive odd integer width.')
  const radius = (width - 1) / 2
  return Array.from({ length }, (_, k) => {
    let gain = 1
    for (let offset = 1; offset <= radius; offset++)
      gain += 2 * Math.cos(Math.PI * k * offset / length)
    return gain / width
  })
}

// DCT-II reflection is half-sample symmetric: x[-1]=x[0], x[N]=x[N-1].
// The period also handles windows spanning more than one reflected copy.
export function reflectedIndex(index: number, length: number) {
  const wrapped = ((index % (2 * length)) + 2 * length) % (2 * length)
  return wrapped < length ? wrapped : 2 * length - 1 - wrapped
}

export function reflectedBoxcar(samples: number[], width = 3) {
  if (!Number.isInteger(width) || width < 1 || width % 2 === 0)
    throw new RangeError('The illustrative boxcar must have a positive odd integer width.')
  const radius = (width - 1) / 2
  return samples.map((_, n) => {
    let sum = 0
    for (let offset = -radius; offset <= radius; offset++)
      sum += samples[reflectedIndex(n + offset, samples.length)]
    return sum / width
  })
}

const weights = cosineWeights(dctSamples)
const response = boxcarResponse(dctSamples.length)
const filteredWeights = weights.map((weight, k) => weight * response[k])

export const dctData = {
  samples: dctSamples,
  weights,
  response,
  filteredWeights,
  smoothed: dctSamples.map((_, n) => reconstructAt(filteredWeights, n)),
  spatialReference: reflectedBoxcar(dctSamples),
}
