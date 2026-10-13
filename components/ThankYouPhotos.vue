<script setup lang="ts">
import { slideHeight, slideWidth, useIsSlideActive, useNav, useSlideContext } from '@slidev/client'
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import type { CSSProperties } from 'vue'
import { createPhotoSimulation, photoHomes, photoOrder, photoRect, photoZoom, zoomOpacity, zoomRect, ZOOM_DURATION } from './thank-you-physics'
import type { PhotoRect, PhotoZoom } from './thank-you-physics'
import { fitPersonalThanksFontSize, parsePersonalThanks, personalThanksAt, personalThanksLineReveals, THANKS_LINE_HEIGHT, wrapPersonalThanks } from './personal-thanks'

const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  personalThanks?: string
}>(), { title: '', subtitle: '', personalThanks: '' })

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
const reducedMotion = ref(false)
const hidden = ref(false)
const handwritingReady = ref(false)
const ratios = ref<Record<number, number>>({})
const settledCount = ref(0)
const failed = ref(new Set<number>())
const settled = new Set<number>()
const focus = shallowRef<(PhotoZoom & { started: number }) | undefined>()
const focusAge = ref(0)
const poses = shallowRef<{ rect: PhotoRect, backgroundScale: number }[]>([])
const messages = computed(() => parsePersonalThanks(props.personalThanks))
const messageTime = ref(0)
const messageState = computed(() => personalThanksAt(messageTime.value, messages.value.length))

const staticMode = computed(() => isPrintMode.value
  || !['slide', 'presenter'].includes($renderContext.value)
  || reducedMotion.value)
const running = computed(() => isActive.value && !staticMode.value
  && !hidden.value && handwritingReady.value && (photos.length > 0 || messages.value.length > 0)
  && settledCount.value === photos.length)

const messageIndex = computed(() => staticMode.value ? 0 : messageState.value.index)
const currentMessage = computed(() => messages.value[messageIndex.value] ?? '')
let measurement: CanvasRenderingContext2D | null | undefined
const messageWidth = computed(() => slideWidth.value * 0.35 - 10)
function measureMessage(text: string, size: number) {
  measurement!.font = `500 ${size}px "Personal Thanks Handwriting", "Bradley Hand", cursive`
  return measurement!.measureText(text).width
}
const messageFontSize = computed(() => {
  const preferred = slideWidth.value * 0.0245
  if (!handwritingReady.value || !measurement) return preferred
  return fitPersonalThanksFontSize(currentMessage.value, messageWidth.value,
    slideWidth.value * 0.0551, preferred, measureMessage)
})
const messageLines = computed(() => {
  if (!handwritingReady.value || !measurement) return []
  return wrapPersonalThanks(currentMessage.value, messageWidth.value, messageFontSize.value, measureMessage)
    .map(text => ({ text, width: measureMessage(text, messageFontSize.value) }))
})
const messageReveals = computed(() => personalThanksLineReveals(
  staticMode.value ? 1 : messageState.value.reveal, messageLines.value.map(line => line.width)))

function messageLineStyle(index: number): CSSProperties {
  const reveal = messageReveals.value[index] ?? 0
  return {
    visibility: reveal > 0 ? 'visible' : 'hidden',
    // Include ink overhangs above, below, and left of each complete line.
    // Only the right edge advances; no letters are inserted or repositioned.
    clipPath: reveal >= 1 ? 'none' : `inset(-0.3em ${(1 - reveal) * 100}% -0.3em -0.3em)`,
  }
}

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

function stop() {
  if (frame !== undefined) cancelAnimationFrame(frame)
  frame = undefined
  lastFrame = undefined
}

function resetSimulation() {
  elapsed = 0
  messageTime.value = 0
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
  messageTime.value = elapsed - INTRO_SECONDS
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

watch([homes, featureOrder, messages], resetSimulation, { immediate: true })

// Slidev keeps inactive slides mounted. Do not run their clocks in the background.
watch(isActive, () => {
  stop()
  resetSimulation()
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
  measurement = document.createElement('canvas').getContext('2d')
  // Load the local font before starting either clock; no external font service
  // or fallback-font reflow during the first message's entrance is required.
  document.fonts.load('500 24px "Personal Thanks Handwriting"')
    .finally(() => { handwritingReady.value = true })
    .catch(() => {})
})
onBeforeUnmount(() => {
  stop()
  motionPreference?.removeEventListener('change', syncMotionPreference)
  document.removeEventListener('visibilitychange', syncVisibility)
})
</script>

<template>
  <section
    class="thank-you-photos"
    :class="{ 'is-playing': running, 'has-featured': !!focus, 'is-static': staticMode }"
    :data-photo-count="photos.length"
    :data-active="isActive"
    :data-ready="settledCount === photos.length"
    :data-message-count="messages.length"
    :data-handwriting-ready="handwritingReady"
    aria-label="Personal acknowledgments: family, friends, and colleagues"
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
      <h1 :style="{ fontSize: `${slideWidth * 0.049}px` }">{{ props.title }}</h1>
      <p class="thank-you-subtitle" :style="{ fontSize: `${slideWidth * 0.015}px` }">{{ props.subtitle }}</p>
      <div class="thank-you-message-slot" :style="{ height: `${slideWidth * 0.0551}px` }" aria-hidden="true">
        <p
          class="thank-you-message"
          :data-message-index="messageIndex"
          :data-written-progress="staticMode ? 1 : messageState.reveal"
          :style="{ fontSize: `${messageFontSize}px`, lineHeight: THANKS_LINE_HEIGHT, opacity: staticMode ? 1 : messageState.opacity }"
        >
          <span
            v-for="(line, index) in messageLines"
            :key="index"
            class="thank-you-message-line"
            :data-line-progress="messageReveals[index]"
            :style="messageLineStyle(index)"
          >{{ line.text }}</span>
        </p>
      </div>
    </div>

    <!-- Expose every acknowledgment once, without announcing timed changes. -->
    <ol v-if="messages.length" class="thank-you-message-list" aria-label="Personal thanks">
      <li v-for="(message, index) in messages" :key="index">{{ message }}</li>
    </ol>
  </section>
</template>

<style scoped>
@font-face {
  font-family: 'Personal Thanks Handwriting';
  src: url('../assets/fonts/Caveat-variable.ttf') format('truetype');
  font-style: normal;
  font-weight: 400 700;
  font-display: swap;
}

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
  inset: 38.5% 32.5% 37.5%;
  z-index: 4;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  text-align: center;
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

.thank-you-subtitle {
  margin: 0;
  padding: 0;
  color: rgb(255 255 255 / 85%);
  font-weight: 400;
  line-height: 1.3;
  white-space: nowrap;
}

.thank-you-message-slot {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 100%;
  margin-top: 2px;
  padding: 0 5px;
  overflow: hidden;
}

.thank-you-message {
  width: 100%;
  margin: 0;
  padding: 0;
  color: #eadbb8;
  font-family: 'Personal Thanks Handwriting', 'Bradley Hand', cursive;
  font-weight: 500;
}

.thank-you-message-line {
  display: block;
  width: max-content;
  max-width: 100%;
  margin-inline: auto;
  white-space: pre;
}

.thank-you-message-list {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
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
}
</style>
