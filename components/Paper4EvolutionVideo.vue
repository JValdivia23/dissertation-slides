<script setup lang="ts">
import { onSlideEnter, useIsSlideActive } from '@slidev/client'
import { ref } from 'vue'
import Paper4HoldVideo from './Paper4HoldVideo.vue'
import source from '../figures/paper4-evolution-reference.mp4'
import startFrame from '../figures/paper4-3d-poster.png'
import endFrame from '../figures/paper4-lateral-entry.png'

const active = useIsSlideActive()
const pose = ref<'play' | 'end'>('play')
onSlideEnter((to, from) => {
  // Back from the lateral-view slide: restore the end, not a fresh evolution.
  pose.value = from !== undefined && from > to ? 'end' : 'play'
})
</script>

<template>
  <Paper4HoldVideo
    :src="source"
    :start-frame="startFrame"
    :end-frame="endFrame"
    :pose="pose"
    :active="active"
    label="Three-dimensional reflectivity-anomaly evolution. Plays once and holds the same final frame used on the next slide."
    controls
  />
</template>
