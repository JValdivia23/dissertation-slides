<script setup lang="ts">
import { computed } from 'vue'
import volumeSource from '../figures/dct-volume-benchmark.png'
import windowSource from '../figures/dct-window-benchmark.png'

const props = defineProps<{ view: 'volume' | 'window' }>()

// Annotation coordinates follow the unchanged 775 × 647 source panels.
// Only analytical boxcar (orange) and Gaussian (green) share the second label.
const plots = {
  volume: {
    src: volumeSource,
    alt: 'Paper Figure 5(c): execution time versus number of pixels for a fixed five-pixel window on random-noise benchmark arrays',
    dynamicLabel: { x: 330, y: 112 },
    arrows: [
      { series: 'dynamic', color: '#8c564b', path: 'M455 125L445 209' },
      { series: 'boxcar', color: '#ff7f0e', path: 'M443 515L330 469' },
      { series: 'gaussian', color: '#2ca02c', path: 'M488 515L400 445' },
    ],
  },
  window: {
    src: windowSource,
    alt: 'Paper Figure 5(a): execution time versus window size on a fixed 474-by-1180-pixel RHI; analytical Gaussian and boxcar timings stay near 60 milliseconds while the tested spatial method rises',
    dynamicLabel: { x: 420, y: 156 },
    arrows: [
      { series: 'dynamic', color: '#8c564b', path: 'M505 174L460 246' },
      { series: 'boxcar', color: '#ff7f0e', path: 'M443 515L315 493' },
      { series: 'gaussian', color: '#2ca02c', path: 'M488 515L400 497' },
    ],
  },
}

const plot = computed(() => plots[props.view])
const markerId = (series: string) => `smoothing-benchmark-${props.view}-${series}-tip`
</script>

<template>
  <div class="smoothing-benchmark-plot" :data-benchmark-view="view">
    <img :src="plot.src" :alt="plot.alt" />
    <svg class="smoothing-benchmark-overlay" viewBox="0 0 775 647" aria-hidden="true">
      <defs>
        <marker v-for="arrow in plot.arrows" :id="markerId(arrow.series)" :key="arrow.series" viewBox="0 0 8 8" refX="8" refY="4" markerWidth="4" markerHeight="4" orient="auto">
          <path d="M0 0L8 4L0 8Z" :fill="arrow.color" />
        </marker>
      </defs>
      <text :x="plot.dynamicLabel.x" :y="plot.dynamicLabel.y" fill="#8c564b">Dynamic kernel</text>
      <text x="410" y="552" fill="#1a1a1a">Analytical solutions</text>
      <path v-for="arrow in plot.arrows" :key="arrow.series" class="smoothing-benchmark-pointer" :data-series="arrow.series" :d="arrow.path" :stroke="arrow.color" :marker-end="`url(#${markerId(arrow.series)})`" />
    </svg>
  </div>
</template>

<style scoped>
.smoothing-benchmark-plot {
  position: relative;
  width: 100%;
  max-width: calc(22rem * 775 / 647);
  min-width: 0;
  justify-self: center;
}

.smoothing-benchmark-plot > img {
  display: block;
  width: 100%;
  height: auto;
}

.smoothing-benchmark-overlay {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.smoothing-benchmark-overlay text {
  stroke: white;
  stroke-width: 3;
  stroke-linejoin: round;
  paint-order: stroke;
  font-size: 30px;
  font-weight: 700;
}

.smoothing-benchmark-pointer {
  fill: none;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
