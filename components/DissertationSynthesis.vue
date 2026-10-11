<script setup lang="ts">
import { useSlideContext } from '@slidev/client'
import { computed } from 'vue'

const { $clicks } = useSlideContext()
const showConclusion = computed(() => $clicks.value >= 1)
</script>

<template>
  <div class="dissertation-synthesis-content" :class="{ 'has-conclusion': showConclusion }">
    <figure class="dissertation-synthesis-diagram">
      <svg viewBox="0 0 900 360" role="img" aria-labelledby="dissertation-synthesis-title dissertation-synthesis-description">
        <title id="dissertation-synthesis-title">Integration of the four dissertation studies</title>
        <desc id="dissertation-synthesis-description">Smoothing and local statistics from Papers 1 and 2 supply reflectivity-anomaly fields. Population analysis from Paper 3 supplies the selected-cell track and temporal context. These two inputs support the cell-relative three-dimensional fall-streak analysis in Paper 4; the methods are not shown as inputs to the population detection.</desc>

        <g class="synthesis-input synthesis-methods">
          <rect x="16" y="20" width="360" height="140" rx="4" />
          <text class="synthesis-paper" x="40" y="50">Papers 1–2</text>
          <text class="synthesis-heading" x="40" y="84">Smoothing and local statistics</text>
          <text class="synthesis-detail" x="40" y="125">Reflectivity-anomaly fields</text>
        </g>

        <g class="synthesis-input synthesis-population">
          <rect x="16" y="200" width="360" height="140" rx="4" />
          <text class="synthesis-paper" x="40" y="230">Paper 3</text>
          <text class="synthesis-heading" x="40" y="264">Population analysis</text>
          <text class="synthesis-detail" x="40" y="305">Selected-cell track and time context</text>
        </g>

        <g class="synthesis-connectors" aria-hidden="true">
          <path class="synthesis-methods-link" d="M376 90 H438 V180 M420 82 L430 90 L420 98" />
          <path class="synthesis-population-link" d="M376 270 H438 V180 M420 262 L430 270 L420 278" />
          <path class="synthesis-analysis-link" d="M438 180 H504 M494 172 L504 180 L494 188" />
        </g>

        <g class="synthesis-output">
          <rect x="508" y="104" width="376" height="152" rx="4" />
          <text class="synthesis-paper" x="532" y="138">Paper 4</text>
          <text class="synthesis-heading" x="532" y="177">Cell-relative three-dimensional</text>
          <text class="synthesis-heading" x="532" y="211">fall-streak analysis</text>
        </g>
      </svg>
    </figure>

    <section class="synthesis-conclusion-card" :aria-hidden="!showConclusion" :inert="!showConclusion">
      <slot name="conclusion" />
    </section>
  </div>
</template>

<style scoped>
.dissertation-synthesis-content {
  position: relative;
  flex: 1;
  min-height: 0;
  width: 100%;
}

.dissertation-synthesis-diagram {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
  width: 100%;
  margin: 0;
  transform-origin: center;
  transition: transform 550ms cubic-bezier(0.22, 1, 0.36, 1), opacity 400ms ease;
}

.has-conclusion .dissertation-synthesis-diagram {
  transform: translateY(-4.7rem) scale(0.74);
  opacity: 0.72;
}

.dissertation-synthesis-diagram svg {
  display: block;
  width: 100%;
  max-height: 100%;
  overflow: visible;
}

.synthesis-input rect {
  fill: color-mix(in srgb, var(--cu-text-muted) 5%, var(--cu-bg));
  stroke: var(--cu-text-muted);
  stroke-width: 1.5;
}

.synthesis-output rect {
  fill: color-mix(in srgb, var(--cu-gold) 10%, var(--cu-bg));
  stroke: var(--cu-gold-accessible);
  stroke-width: 2;
}

.synthesis-paper {
  fill: var(--cu-text-muted);
  font-size: 18px;
}

.synthesis-heading {
  fill: var(--cu-heading);
  font-size: 21px;
  font-weight: 600;
}

.synthesis-detail {
  fill: var(--cu-text);
  font-size: 18px;
}

.synthesis-connectors path {
  fill: none;
  stroke: var(--cu-gold-accessible);
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.dark .synthesis-output rect,
.dark .synthesis-connectors path {
  stroke: var(--cu-gold);
}

.synthesis-conclusion-card {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 0.9rem 1.15rem;
  border: 1.5px solid var(--cu-gold-accessible);
  border-radius: 6px;
  background: var(--cu-bg);
  box-shadow: 0 5px 18px color-mix(in srgb, var(--cu-heading) 8%, transparent);
  opacity: 0;
  pointer-events: none;
  transform: translateY(-3rem) scale(0.9);
  transform-origin: 71% 0;
  transition: transform 500ms cubic-bezier(0.22, 1, 0.36, 1), opacity 350ms ease;
}

.synthesis-conclusion-card::before {
  position: absolute;
  top: -4.8rem;
  left: 71%;
  width: 2px;
  height: 4.8rem;
  background: var(--cu-gold-accessible);
  content: '';
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 350ms ease;
}

.has-conclusion .synthesis-conclusion-card {
  opacity: 1;
  pointer-events: auto;
  transform: none;
  transition-delay: 140ms;
}

.has-conclusion .synthesis-conclusion-card::before {
  transform: scaleY(1);
  transition-delay: 140ms;
}

.synthesis-conclusion-card :slotted(p) {
  opacity: 0;
  transform: translateY(0.4rem);
  transition: opacity 300ms ease, transform 300ms ease;
}

.has-conclusion .synthesis-conclusion-card :slotted(p) {
  opacity: 1;
  transform: none;
  transition-delay: 240ms;
}

:slotted(.dissertation-conclusion) {
  margin: 0;
  color: var(--cu-heading);
  font-size: 1.2rem;
  line-height: 1.4;
  text-wrap: pretty;
}

:slotted(.dissertation-scope) {
  margin: 0.6rem 0 0;
  color: var(--cu-text-muted);
  font-size: 0.82rem;
  line-height: 1.4;
}

@media (prefers-reduced-motion: reduce) {
  .dissertation-synthesis-diagram,
  .synthesis-conclusion-card,
  .synthesis-conclusion-card::before,
  .synthesis-conclusion-card :slotted(p) {
    transition: none;
  }
}
</style>
