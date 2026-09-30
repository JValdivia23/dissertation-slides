<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  src: string
  startFrame: string
  endFrame: string
  pose: 'start' | 'play' | 'end'
  active: boolean
  label: string
  controls?: boolean
}>()
const emit = defineEmits<{ ended: [], error: [message: string] }>()
const player = ref<HTMLVideoElement | null>(null)
const live = ref(false)
const finished = ref(false)
const failed = ref(false)
let generation = 0

const heldFrame = computed(() => props.pose === 'end' || finished.value ? props.endFrame : props.startFrame)
const currentPose = computed(() => live.value ? 'playing' : props.pose === 'end' || finished.value ? 'end' : 'start')

function sync() {
  const video = player.value
  const current = ++generation
  live.value = false
  finished.value = false
  failed.value = false
  if (!video) return
  video.pause()
  if (!props.active || props.pose !== 'play') return

  video.currentTime = 0
  video.muted = true
  void video.play().then(() => {
    if (current === generation && props.active && props.pose === 'play') live.value = true
  }).catch((error: Error) => {
    // Leaving, rewinding, or advancing early intentionally interrupts play().
    if (current !== generation || !props.active || props.pose !== 'play') return
    failed.value = true
    emit('error', error.message)
  })
}

function end() {
  if (!props.active || props.pose !== 'play') return
  finished.value = true
  live.value = false
  emit('ended')
}

watch(() => [props.src, props.active, props.pose], sync, { flush: 'post' })
onMounted(sync)
onBeforeUnmount(() => {
  generation++
  player.value?.pause()
})
</script>

<template>
  <div class="paper4-held-video" :data-pose="currentPose" :data-active="active" role="img" :aria-label="label">
    <video
      ref="player"
      :src="src"
      :poster="startFrame"
      :controls="controls && live"
      :class="{ live }"
      muted
      playsinline
      preload="metadata"
      tabindex="-1"
      aria-hidden="true"
      @ended="end"
    />
    <img v-show="!live" :src="heldFrame" alt="" aria-hidden="true" />
    <span v-if="failed" class="paper4-video-fallback" role="status">Video unavailable · static view shown</span>
  </div>
</template>

<style scoped>
.paper4-held-video {
  position: relative;
  width: 100%;
  /* Keep the full source width, including the moving compass. Only trim
     vertical white margins outside the union of every frame in both clips:
     y=600..1660 in the 2030-pixel source. Use the same crop for all holds. */
  aspect-ratio: 2030 / 1060;
  overflow: hidden;
  background: white;
}

.paper4-held-video video,
.paper4-held-video img {
  position: absolute;
  left: 0;
  top: -56.60377358%;
  width: 100%;
  height: 191.50943396%;
  max-width: none;
  object-fit: fill;
}

.paper4-held-video video {
  visibility: hidden;
}

.paper4-held-video video.live {
  visibility: visible;
}

.paper4-held-video video:not([controls]) {
  pointer-events: none;
}

.paper4-video-fallback {
  position: absolute;
  bottom: 0;
  inset-inline: 0;
  padding: 0.4rem;
  color: #1a1a1a;
  background: #fff;
  font-size: 0.65rem;
  text-align: center;
}

</style>
