<script setup lang="ts">
import { slideHeight, slideWidth, useIsSlideActive, useNav, useSlideContext } from '@slidev/client'
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import type { CSSProperties } from 'vue'
import { createPhotoSimulation, photoHomes, photoOrder, photoRect, photoZoom, zoomOpacity, zoomRect, ZOOM_DURATION } from './thank-you-physics'
import type { PhotoRect, PhotoZoom } from './thank-you-physics'

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
const focus = shallowRef<(PhotoZoom & { started: number }) | undefined>()
const focusAge = ref(0)
const poses = shallowRef<{ rect: PhotoRect, backgroundScale: number }[]>([])
const controlsVisible = ref(false)

const staticMode = computed(() => isPrintMode.value
  || !['slide', 'presenter'].includes($renderContext.value)
  || reducedMotion.value)
const running = computed(() => isActive.value && !staticMode.value
  && !paused.value && !hidden.value && photos.length > 0
  && settledCount.value === photos.length)

const order = photoOrder(photos.length)
const featureOrder = computed(() => order.filter(index => !failed.value.has(index)))
const homes = computed(() => photoHomes(photos.map(photo => ratios.value[photo.index] || 4 / 3),
  slideWidth.value, slideHeight.value, order))

function rectStyle(index: number, rect: PhotoRect): CSSProperties {
  const home = homes.value[index]
  return {
    width: `${home.width}px`,
    height: `${home.height}px`,
    '--photo-x': `${rect.left}px`,
    '--photo-y': `${rect.top}px`,
    '--photo-scale': (rect.right - rect.left) / home.width,
  }
}

function photoStyle(index: number): CSSProperties {
  const rect = staticMode.value || !poses.value[index]
    ? photoRect({ ...homes.value[index], scale: 1 }) : poses.value[index].rect
  return {
    ...rectStyle(index, rect),
    opacity: focus.value?.index === index ? 1 - zoomOpacity(focusAge.value) : undefined,
  }
}

const spotlightStyle = computed<CSSProperties>(() => focus.value ? {
  ...rectStyle(focus.value.index, zoomRect(focus.value, focusAge.value)),
  opacity: zoomOpacity(focusAge.value),
} : {})

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

const INTRO_SECONDS = 1.4
const FIRST_ZOOM_SECONDS = 4.4
const CYCLE_SECONDS = 5.2
let elapsed = 0
let lastFrame: number | undefined
let frame: number | undefined
let nextSpotlight = FIRST_ZOOM_SECONDS
let pending: number[] = []
let simulation: ReturnType<typeof createPhotoSimulation> | undefined
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

function stop() {
  if (frame !== undefined) cancelAnimationFrame(frame)
  frame = undefined
  lastFrame = undefined
}

function resetSimulation() {
  elapsed = 0
  lastFrame = undefined
  nextSpotlight = FIRST_ZOOM_SECONDS
  focus.value = undefined
  focusAge.value = 0
  pending = [...featureOrder.value]
  simulation = createPhotoSimulation(homes.value, slideWidth.value, slideHeight.value)
  poses.value = homes.value.map(home => ({ rect: photoRect({ ...home, scale: 1 }), backgroundScale: 1 }))
}

function startSpotlight() {
  if (!simulation || !featureOrder.value.length) return
  pending = pending.filter(index => !failed.value.has(index))
  if (!pending.length) pending = [...featureOrder.value]
  const candidates = pending.map(index => photoZoom(simulation!.bodies[index], slideWidth.value, slideHeight.value))
  // Prefer a photo with room for a clear enlargement. Large breathing photos
  // stay in the queue and get their turn after they contract; none are omitted.
  const chosen = candidates.find(zoom => zoom.targetScale >= 2 && zoom.targetScale / zoom.initialScale >= 1.7)
    ?? candidates.reduce((best, zoom) => zoom.targetScale / zoom.initialScale > best.targetScale / best.initialScale ? zoom : best)
  pending.splice(pending.indexOf(chosen.index), 1)
  focus.value = { ...chosen, started: elapsed }
  nextSpotlight = elapsed + CYCLE_SECONDS
}

function tick(timestamp: number) {
  if (!running.value || !simulation) return
  const dt = lastFrame === undefined ? 0 : Math.min((timestamp - lastFrame) / 1000, 1 / 30)
  lastFrame = timestamp
  elapsed += dt
  if (focus.value && elapsed - focus.value.started >= ZOOM_DURATION) focus.value = undefined
  // The foreground enlargement is anchored, but its background body continues
  // breathing. Cross-fade back on return so freezing a card cannot jam contacts
  // or cause a jump when the spotlight ends.
  simulation.step(dt, elapsed - INTRO_SECONDS)
  if (!focus.value && elapsed >= nextSpotlight) startSpotlight()
  focusAge.value = focus.value ? elapsed - focus.value.started : 0
  poses.value = simulation.bodies.map(body => ({
    rect: photoRect(body),
    backgroundScale: body.scale,
  }))
  frame = requestAnimationFrame(tick)
}

watch([homes, featureOrder], resetSimulation, { immediate: true })

// Slidev keeps inactive slides mounted. Do not run their clocks in the background.
watch(isActive, () => {
  stop()
  resetSimulation()
  paused.value = false
  controlsVisible.value = false
  clearTimeout(controlsTimer)
})
watch(staticMode, () => {
  stop()
  resetSimulation()
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
    :class="{ 'is-playing': running, 'has-featured': !!focus, 'is-static': staticMode, 'show-controls': controlsVisible || paused }"
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
        :class="{ 'is-zoom-source': focus?.index === photo.index }"
        :style="photoStyle(photo.index)"
        :data-photo-index="photo.index"
        :data-background-scale="poses[photo.index]?.backgroundScale ?? 1"
      >
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

      <div
        v-if="focus && !staticMode"
        class="thank-you-spotlight is-featured"
        :style="spotlightStyle"
        :data-photo-index="focus.index"
        :data-zoom-anchor-x="focus.anchorX"
        :data-zoom-anchor-y="focus.anchorY"
        aria-hidden="true"
      >
        <div class="thank-you-photo-frame">
          <img :src="photos[focus.index].src" alt="" draggable="false" />
        </div>
      </div>
    </div>

    <div class="thank-you-center">
      <h1 :style="{ fontSize: `${slideWidth * 0.061}px` }">Thanks all</h1>
      <p :style="{ fontSize: `${slideWidth * 0.02}px` }">for making this possible</p>
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

.thank-you-photo,
.thank-you-spotlight {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  transform: translate3d(var(--photo-x), var(--photo-y), 0) scale(var(--photo-scale));
  transform-origin: top left;
  transition: opacity 350ms ease;
  will-change: transform;
}

.thank-you-spotlight {
  z-index: 3;
  pointer-events: none;
}

.thank-you-spotlight,
.thank-you-photo.is-zoom-source {
  transition: none;
}

.has-featured .thank-you-photo:not(.is-zoom-source) {
  opacity: 0.94;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 9px;
  text-align: center;
  transform: translateY(-14px);
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

.thank-you-center p {
  margin: 0;
  padding: 0;
  color: rgb(255 255 255 / 85%);
  font-weight: 400;
  line-height: 1.3;
  white-space: nowrap;
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

.is-static .thank-you-photo,
.is-static .thank-you-photo-frame {
  transition: none;
}

@media (prefers-reduced-motion: reduce), print {
  .thank-you-photo,
  .thank-you-photo-frame {
    transition: none;
  }

  .thank-you-pause {
    display: none;
  }
}
</style>
