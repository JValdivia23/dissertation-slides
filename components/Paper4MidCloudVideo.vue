<script setup lang="ts">
import { useIsSlideActive, useSlideContext } from '@slidev/client'
import { ref, watch } from 'vue'
import Paper4HoldVideo from './Paper4HoldVideo.vue'
import source from '../figures/paper4-cutaway-mid.mp4'
import startFrame from '../figures/paper4-midcloud-entry.png'
import endFrame from '../figures/paper4-midcloud-end.png'

const active = useIsSlideActive()
const { $clicks: clicks, $nav: nav } = useSlideContext()
const pose = ref<'start' | 'play' | 'end'>('start')

watch([clicks, active], ([step, isActive], previous) => {
  if (step <= 0) pose.value = 'start'
  else if (isActive && previous?.[1] && previous[0] === 0) pose.value = 'play'
  else pose.value = 'end'
}, { immediate: true, flush: 'post' })

function advance() {
  if (active.value) nav.value.next()
}

function start() {
  if (clicks.value === 0) advance()
}
</script>

<template>
  <Paper4HoldVideo
    class="paper4-video-player paper4-midcloud-video"
    :data-step="Math.min(clicks, 1)"
    :src="source"
    :start-frame="startFrame"
    :end-frame="endFrame"
    :pose="pose"
    :active="active"
    :crop-top="300"
    :role="clicks === 0 ? 'button' : 'img'"
    :tabindex="active && clicks === 0 ? 0 : -1"
    @click.stop="start"
    @keydown.enter.prevent.stop="advance"
    @keydown.space.prevent.stop="advance"
    label="Three-dimensional reflectivity-anomaly elevation cutaway. Click once to reveal the mid-cloud echo structures, then hold the final view."
  />
</template>

<style scoped>
.paper4-midcloud-video[data-step="0"] {
  cursor: pointer;
}

.paper4-midcloud-video:focus-visible {
  outline: 3px solid var(--cu-gold);
  outline-offset: 4px;
}
</style>
