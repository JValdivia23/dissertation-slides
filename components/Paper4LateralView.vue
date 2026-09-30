<script setup lang="ts">
import { useIsSlideActive, useSlideContext } from '@slidev/client'
import { ref, watch } from 'vue'
import Paper4HoldVideo from './Paper4HoldVideo.vue'
import source from '../figures/paper4-lateral-view.mp4'
import startFrame from '../figures/paper4-lateral-entry.png'
import endFrame from '../figures/paper4-lateral-end.png'
import projection from '../figures/paper4-lateral-max.png'

const active = useIsSlideActive()
const { $clicks: clicks } = useSlideContext()
const pose = ref<'play' | 'end'>('end')
const scaleTicks = [12, 10, 8, 6, 4, 2, 0, -2, -4]

watch([clicks, active], ([step, isActive], previous) => {
  // Play on entry, not on a presentation click. Rewinding an annotation keeps
  // the lateral endpoint; leaving and entering again replays the camera move.
  pose.value = isActive && step === 0 && !previous?.[1] ? 'play' : 'end'
}, { immediate: true, flush: 'post' })
</script>

<template>
  <div class="paper4-lateral-view" :data-step="Math.min(clicks, 2)">
    <figure class="paper4-lateral-projection" :class="{ revealed: clicks >= 1 }" :aria-hidden="clicks < 1">
      <div class="paper4-lateral-plot" role="img" aria-label="Madison slide 11's original maximum-reflectivity-anomaly projection at 02:54 UTC, with height and distance axes and the original minus 4 to plus 12 dB scale. Click 2 labels generating, mid-cloud, and melting layers, and marks a possible fall-streak connection.">
        <img :src="projection" alt="" aria-hidden="true" />
        <svg class="paper4-lateral-overlay" viewBox="0 0 1000 995.21" aria-hidden="true">
          <defs>
            <marker id="paper4-streak-tip" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0 0L8 4L0 8Z" fill="#1a1a1a" />
            </marker>
          </defs>
          <!-- The feature ring is part of Madison's figure-reveal group. -->
          <ellipse v-if="clicks >= 1" cx="722.88" cy="369.64" rx="79.18" ry="105.51" class="paper4-feature-ring" />
          <!-- Retypeset only the tiny original tick text; the source scale,
               tick locations, limits, and plotted colors remain unchanged. -->
          <g class="paper4-scale-labels">
            <rect x="965" y="115" width="35" height="810" fill="white" />
            <text v-for="tick in scaleTicks" :key="tick" x="994" :y="132 + (12 - tick) / 16 * 771">{{ tick < 0 ? `−${-tick}` : tick }}</text>
          </g>
          <g v-if="clicks >= 2" class="paper4-layer-annotations">
            <rect x="169" y="230.32" width="687" height="208.92" />
            <rect x="169" y="475.18" width="687" height="140.67" />
            <rect x="169" y="684.16" width="687" height="82.28" />
            <text x="367" y="342">GC layer</text>
            <text x="670" y="555">Mid-cloud layer</text>
            <text x="460" y="736">Melting layer</text>
            <path d="M678 658H526" class="paper4-streak-pointer" marker-end="url(#paper4-streak-tip)" />
            <text x="772" y="668" class="paper4-streak-label">Fall streak?</text>
          </g>
        </svg>
      </div>
      <figcaption>Maximum reflectivity anomaly · <em>Z</em>′<sub>max</sub> (dB)</figcaption>
    </figure>

    <div class="paper4-projection-link" :class="{ revealed: clicks >= 1 }" :aria-hidden="clicks < 1">
      <span><em>Z</em>′<sub>max</sub></span>
      <svg viewBox="0 0 80 24" aria-hidden="true"><path d="M78 12H4 M17 2L4 12L17 22" /></svg>
    </div>

    <figure class="paper4-lateral-volume">
      <Paper4HoldVideo
        :src="source"
        :start-frame="startFrame"
        :end-frame="endFrame"
        :pose="pose"
        :active="active"
        label="Three-dimensional reflectivity-anomaly volume. The camera rotates to a lateral view automatically on slide entry, then holds that view."
      />
      <figcaption>Three-radar <em>Z</em>′ isosurfaces · <span class="paper4-cyan-key">5 dB</span> and <span class="paper4-red-key">7 dB</span></figcaption>
    </figure>

  </div>
</template>

<style scoped>
.paper4-lateral-view {
  display: grid;
  flex: 1;
  grid-template-columns: minmax(0, 1fr) 4.2rem minmax(0, 1.08fr);
  align-items: center;
  gap: 0.25rem 0.2rem;
  min-height: 0;
  width: 100%;
}

.paper4-lateral-view figure {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 0;
  min-height: 0;
  margin: 0;
}

.paper4-lateral-projection {
  height: 100%;
  opacity: 0;
  visibility: hidden;
}

.paper4-lateral-plot {
  position: relative;
  min-height: 0;
  width: 100%;
  max-height: calc(100% - 1.4rem);
  aspect-ratio: 1000 / 995.21;
}

.paper4-lateral-plot img,
.paper4-lateral-overlay {
  display: block;
  width: 100%;
  height: 100%;
}

.paper4-lateral-plot img {
  object-fit: contain;
}

.paper4-lateral-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.paper4-feature-ring {
  fill: none;
  stroke: #1a1a1a;
  stroke-width: 4;
}

.paper4-layer-annotations rect {
  fill: none;
  stroke: #1a1a1a;
  stroke-width: 2.5;
  stroke-dasharray: 9 5;
}

.paper4-layer-annotations text {
  fill: #1a1a1a;
  font-size: 32px;
  font-weight: 700;
  text-anchor: middle;
  paint-order: stroke;
  stroke: #fff;
  stroke-opacity: 0.9;
  stroke-width: 4px;
  stroke-linejoin: round;
}

.paper4-streak-pointer {
  fill: none;
  stroke: #1a1a1a;
  stroke-width: 3;
}

.paper4-layer-annotations .paper4-streak-label {
  font-size: 30px;
}

.paper4-scale-labels text {
  fill: #1a1a1a;
  font-size: 24px;
  dominant-baseline: middle;
  text-anchor: end;
}

.paper4-cyan-key {
  padding-bottom: 1px;
  border-bottom: 3px solid #82c8c8;
}

.paper4-red-key {
  padding-bottom: 1px;
  border-bottom: 3px solid #a32629;
}

.paper4-lateral-view figcaption {
  margin: 0.25rem 0 0;
  color: var(--cu-text-muted);
  font-size: 0.68rem;
  line-height: 1.3;
  text-align: center;
}

.paper4-projection-link {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  align-items: center;
  opacity: 0;
  visibility: hidden;
  color: var(--cu-heading);
  font-size: 0.9rem;
}

.paper4-projection-link svg {
  width: 100%;
  height: 1.2rem;
  fill: none;
  stroke: var(--cu-gold);
  stroke-width: 3;
  stroke-linejoin: round;
}

.revealed {
  opacity: 1;
  visibility: visible;
}
</style>

<style>
.slidev-layout.paper4-lateral {
  padding-top: 0.85rem;
  padding-bottom: 3.5rem;
}

.slidev-layout.paper4-lateral h1 {
  margin-bottom: 0.45rem;
  font-size: 1.75rem;
}
</style>
