<script setup lang="ts">
import { slideHeight, slideWidth, useIsSlideActive, useNav, useSlideContext } from '@slidev/client'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { CSSProperties } from 'vue'

// Vite bundles the photographs with the correct base path for GitHub Pages.
// Photographs and video-derived stills stay in pictures/; source videos are not bundled.
const sources = import.meta.glob<string>('../pictures/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG}', {
  eager: true,
  import: 'default',
  query: '?url',
})
const photos = Object.entries(sources)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, src], index) => ({ path, src, index }))

const isActive = useIsSlideActive()
const { isPrintMode } = useNav()
const { $renderContext } = useSlideContext()
const paused = ref(false)
const reducedMotion = ref(false)
const hidden = ref(false)
const ratios = ref<Record<number, number>>({})
const settledCount = ref(0)
const failed = ref(new Set<number>())
const settled = new Set<number>()
const featured = ref<number[]>([])
const controlsVisible = ref(false)

const staticMode = computed(() => isPrintMode.value
  || !['slide', 'presenter'].includes($renderContext.value)
  || reducedMotion.value)
const running = computed(() => isActive.value && !staticMode.value
  && !paused.value && !hidden.value && photos.length > 0
  && settledCount.value === photos.length)

// Seeded ordering keeps the composition stable across reloads and exports.
function random(seed: number) {
  let state = seed
  return () => {
    state |= 0
    state = state + 0x6D2B79F5 | 0
    let value = Math.imul(state ^ state >>> 15, 1 | state)
    value ^= value + Math.imul(value ^ value >>> 7, 61 | value)
    return ((value ^ value >>> 14) >>> 0) / 4294967296
  }
}

const nextRandom = random(20261015)
const order = photos.map(photo => photo.index)
for (let i = order.length - 1; i > 0; i--) {
  const j = Math.floor(nextRandom() * (i + 1))
  ;[order[i], order[j]] = [order[j], order[i]]
}
const featureOrder = computed(() => order.filter(index => !failed.value.has(index)))

const jitter = random(42)
const motion = photos.map(() => ({
  tilt: (jitter() - 0.5) * 2,
  duration: 16 + jitter() * 12,
  delay: -jitter() * 28,
  offset: (jitter() - 0.5) * 2,
}))

function aspect(index: number) {
  return ratios.value[index] || 4 / 3
}

// Balance the total aspect ratios, not the photo counts. This gives mixed
// portrait/landscape rows similar heights without cropping any photographs.
function partitionRows(indices: number[], count: number): number[][] {
  count = Math.min(count, indices.length)
  if (!count) return []
  const sums = [0]
  indices.forEach(index => sums.push(sums[sums.length - 1] + aspect(index)))
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

const positions = computed(() => {
  const width = slideWidth.value
  const height = slideHeight.value
  const marginX = width * 0.025
  const marginY = height * 0.04
  const gap = width * 0.0125
  const centerHeight = height * 0.22
  const bandHeight = (height - marginY * 2 - centerHeight - gap * 2) / 2
  const rowHeight = (bandHeight - gap) / 2
  const result: Record<number, { x: number, y: number, width: number, height: number }> = {}

  function placeRow(indices: number[], left: number, centerY: number, availableWidth: number, maxHeight: number) {
    if (!indices.length) return
    const totalAspect = indices.reduce((sum, index) => sum + aspect(index), 0)
    const photoHeight = Math.min(maxHeight, (availableWidth - gap * (indices.length - 1)) / totalAspect)
    const usedWidth = photoHeight * totalAspect + gap * (indices.length - 1)
    let x = left + (availableWidth - usedWidth) / 2
    indices.forEach(index => {
      const photoWidth = photoHeight * aspect(index)
      result[index] = {
        x: x + photoWidth / 2,
        y: centerY + motion[index].offset,
        width: photoWidth,
        height: photoHeight,
      }
      x += photoWidth + gap
    })
  }

  // Fill the corners and the full upper/lower bands. Eight portrait photographs
  // occupy the sides of the central opening, where their height is useful.
  const sideIndices = order.filter(index => aspect(index) < 1).slice(0, 8)
  const sideSet = new Set(sideIndices)
  const rows = partitionRows(photos.map(photo => photo.index).filter(index => !sideSet.has(index)), 4)
  const centers = [
    marginY + rowHeight / 2,
    marginY + rowHeight * 1.5 + gap,
    height - marginY - rowHeight * 1.5 - gap,
    height - marginY - rowHeight / 2,
  ]
  rows.forEach((row, index) => placeRow(row, marginX, centers[index], width - marginX * 2, rowHeight))
  const sideWidth = width * 0.313 - marginX
  placeRow(sideIndices.filter((_, index) => index % 2 === 0), marginX, height / 2, sideWidth, centerHeight - gap)
  placeRow(sideIndices.filter((_, index) => index % 2 === 1), width - marginX - sideWidth, height / 2, sideWidth, centerHeight - gap)
  return result
})

function photoStyle(index: number): CSSProperties {
  const position = positions.value[index]
  const { width, height } = position
  const drift = motion[index]
  const side = featured.value.indexOf(index)
  const scale = side === -1 ? 1 : Math.min(
    slideWidth.value * 0.295 / width,
    slideHeight.value * 0.59 / height,
  )
  const x = side === -1 ? position.x : slideWidth.value * (side === 0 ? 0.181 : 0.819)
  const y = side === -1 ? position.y : slideHeight.value / 2

  return {
    width: `${width}px`,
    height: `${height}px`,
    '--photo-x': `${x}px`,
    '--photo-y': `${y}px`,
    '--photo-scale': scale,
    '--photo-tilt': `${side === -1 ? drift.tilt : 0}deg`,
    '--float-duration': `${drift.duration}s`,
    '--float-delay': `${drift.delay}s`,
  }
}

function settlePhoto(index: number, event?: Event) {
  if (event) {
    const image = event.target as HTMLImageElement
    if (image.naturalWidth && image.naturalHeight)
      ratios.value[index] = image.naturalWidth / image.naturalHeight
  }
  else {
    failed.value = new Set([...failed.value, index])
  }
  if (!settled.has(index)) {
    settled.add(index)
    settledCount.value = settled.size
  }
}

const INTRO_MS = 1800
const CYCLE_MS = 4800
const HOLD_MS = 3600
let elapsed = 0
let lastFrame: number | undefined
let frame: number | undefined
let lastBatch = -1
let lastSpotlight = false
let controlsTimer: ReturnType<typeof setTimeout> | undefined

function showControls() {
  if (!isActive.value || staticMode.value) return
  controlsVisible.value = true
  clearTimeout(controlsTimer)
  controlsTimer = setTimeout(() => { controlsVisible.value = false }, 2000)
}

function togglePause(event: MouseEvent) {
  paused.value = !paused.value
  // Slidev suspends navigation shortcuts while a button has focus. Mouse users
  // should be able to advance immediately; keyboard users retain their focus.
  if (event.detail > 0) (event.currentTarget as HTMLButtonElement).blur()
}

function tick(timestamp: number) {
  if (!running.value) return
  if (lastFrame !== undefined) elapsed += timestamp - lastFrame
  lastFrame = timestamp

  const sequence = featureOrder.value
  if (elapsed >= INTRO_MS && sequence.length) {
    const phase = elapsed - INTRO_MS
    const batch = Math.floor(phase / CYCLE_MS) % Math.ceil(sequence.length / 2)
    const spotlight = phase % CYCLE_MS < HOLD_MS
    if (batch !== lastBatch || spotlight !== lastSpotlight) {
      featured.value = spotlight ? sequence.slice(batch * 2, batch * 2 + 2) : []
      lastBatch = batch
      lastSpotlight = spotlight
    }
  }
  frame = requestAnimationFrame(tick)
}

function stop() {
  if (frame !== undefined) cancelAnimationFrame(frame)
  frame = undefined
  lastFrame = undefined
}

// Slidev keeps inactive slides mounted. Do not run their clocks in the background.
watch(isActive, () => {
  stop()
  elapsed = 0
  lastBatch = -1
  lastSpotlight = false
  featured.value = []
  paused.value = false
  controlsVisible.value = false
  clearTimeout(controlsTimer)
})
watch(staticMode, () => {
  stop()
  elapsed = 0
  lastBatch = -1
  lastSpotlight = false
  featured.value = []
})
watch(running, (value) => {
  stop()
  if (value) frame = requestAnimationFrame(tick)
}, { immediate: true, flush: 'post' })

let motionPreference: MediaQueryList | undefined
function syncMotionPreference() {
  reducedMotion.value = motionPreference?.matches ?? false
}
function syncVisibility() {
  hidden.value = document.visibilityState === 'hidden'
}
onMounted(() => {
  motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
  syncMotionPreference()
  syncVisibility()
  motionPreference.addEventListener('change', syncMotionPreference)
  document.addEventListener('visibilitychange', syncVisibility)
})
onBeforeUnmount(() => {
  stop()
  clearTimeout(controlsTimer)
  motionPreference?.removeEventListener('change', syncMotionPreference)
  document.removeEventListener('visibilitychange', syncVisibility)
})
</script>

<template>
  <section
    class="thank-you-photos"
    :class="{ 'is-playing': running, 'has-featured': featured.length > 0, 'is-static': staticMode, 'show-controls': controlsVisible || paused }"
    :data-photo-count="photos.length"
    :data-active="isActive"
    :data-ready="settledCount === photos.length"
    aria-label="Personal acknowledgments: family, friends, and colleagues"
    @pointermove="showControls"
    @pointerleave="controlsVisible = false"
  >
    <div class="thank-you-photo-field">
      <div
        v-for="photo in photos"
        :key="photo.path"
        class="thank-you-photo"
        :class="{ 'is-featured': featured.includes(photo.index) }"
        :style="photoStyle(photo.index)"
        :data-photo-index="photo.index"
      >
        <div class="thank-you-photo-drift">
          <div class="thank-you-photo-frame">
            <img
              v-if="!failed.has(photo.index)"
              :src="photo.src"
              :alt="`Personal acknowledgment photograph ${photo.index + 1} of ${photos.length}`"
              draggable="false"
              :loading="staticMode ? 'eager' : 'lazy'"
              :decoding="staticMode ? 'sync' : 'async'"
              @load="settlePhoto(photo.index, $event)"
              @error="settlePhoto(photo.index)"
            />
            <span v-else class="thank-you-photo-unavailable">Photo unavailable</span>
          </div>
        </div>
      </div>
    </div>

    <div class="thank-you-center">
      <h1 :style="{ fontSize: `${slideWidth * 0.061}px` }">Thank you</h1>
    </div>

    <button
      v-if="isActive && !staticMode && photos.length"
      class="thank-you-pause"
      type="button"
      :aria-label="paused ? 'Resume photo animation' : 'Pause photo animation'"
      :aria-pressed="paused"
      @click.stop="togglePause"
      @keydown.space.stop
      @keydown.enter.stop
      @keyup.space.stop
    >
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path v-if="paused" d="M5 3 L12 8 L5 13 Z" />
        <path v-else d="M4 3 H6 V13 H4 Z M10 3 H12 V13 H10 Z" />
      </svg>
      {{ paused ? 'Resume' : 'Pause' }}
    </button>
  </section>
</template>

<style scoped>
.thank-you-photos {
  position: absolute;
  inset: 0;
  overflow: hidden;
  isolation: isolate;
  background: radial-gradient(ellipse at center, #302d27 0%, #1b1b1b 48%, #111 100%);
  color: #fff;
  font-family: var(--slidev-font-sans, 'Noto Sans', Helvetica, Arial, sans-serif);
}

.thank-you-photo-field {
  position: absolute;
  inset: 0;
}

.thank-you-photo {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  transform: translate3d(var(--photo-x), var(--photo-y), 0) translate(-50%, -50%) scale(var(--photo-scale));
  transform-origin: center;
  transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1), opacity 420ms ease;
  will-change: transform;
}

.thank-you-photo.is-featured {
  z-index: 3;
}

.has-featured .thank-you-photo:not(.is-featured) {
  opacity: 0.9;
}

.thank-you-photo-drift {
  width: 100%;
  height: 100%;
  animation: thank-you-float var(--float-duration) ease-in-out var(--float-delay) infinite;
  animation-play-state: paused;
}

.is-playing .thank-you-photo:not(.is-featured) .thank-you-photo-drift {
  animation-play-state: running;
}

.thank-you-photo-frame {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 65%);
  border-radius: 2px;
  background: #252525;
  box-shadow: 0 3px 10px rgb(0 0 0 / 45%);
  transform: rotate(var(--photo-tilt));
  transition: transform 420ms ease;
}

.thank-you-photo-frame img {
  display: block;
  width: 100%;
  height: 100%;
  max-width: none;
  margin: 0;
  object-fit: contain;
}

.thank-you-photo-unavailable {
  display: grid;
  height: 100%;
  place-items: center;
  font-size: 8px;
}

.thank-you-center {
  position: absolute;
  inset: 39% 33% 39%;
  z-index: 4;
  display: grid;
  place-items: center;
  pointer-events: none;
}

.thank-you-center h1 {
  margin: 0;
  padding: 0;
  border: 0;
  color: #fff;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.035em;
  white-space: nowrap;
  text-shadow: 0 2px 20px rgb(0 0 0 / 25%);
}

.thank-you-pause {
  position: absolute;
  top: calc(50% + 43px);
  left: 50%;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 9px;
  border: 1px solid rgb(255 255 255 / 30%);
  border-radius: 20px;
  background: rgb(17 17 17 / 90%);
  color: #fff;
  font-size: 10px;
  line-height: 1;
  transform: translateX(-50%);
  cursor: pointer;
  opacity: 0;
  transition: opacity 180ms ease;
}

.show-controls .thank-you-pause,
.thank-you-pause:focus-visible {
  opacity: 1;
}

.thank-you-pause svg {
  width: 11px;
  height: 11px;
  fill: currentColor;
}

.thank-you-pause:hover,
.thank-you-pause:focus-visible {
  border-color: var(--cu-gold, #cfb87c);
  outline: 2px solid var(--cu-gold, #cfb87c);
  outline-offset: 3px;
}

@keyframes thank-you-float {
  0%, 100% { transform: translate3d(-2px, 1px, 0); }
  33% { transform: translate3d(2px, -2px, 0); }
  66% { transform: translate3d(-1px, 2px, 0); }
}

.is-static .thank-you-photo,
.is-static .thank-you-photo-frame {
  transition: none;
}

.is-static .thank-you-photo-drift {
  animation: none;
}

@media (prefers-reduced-motion: reduce), print {
  .thank-you-photo,
  .thank-you-photo-frame {
    transition: none;
  }

  .thank-you-photo-drift {
    animation: none;
  }

  .thank-you-pause {
    display: none;
  }
}
</style>
