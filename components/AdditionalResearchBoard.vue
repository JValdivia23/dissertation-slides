<script setup lang="ts">
import { useIsSlideActive, useNav, useSlideContext } from '@slidev/client'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { CSSProperties } from 'vue'
import { additionalPublications } from '../data/additional-publications'
import {
  publicationArrivalDelays,
  publicationBoardPoses,
  publicationIntroPoses,
} from './publication-board-layout'

const headers = import.meta.glob<string>('../figures/additional-publications/*-header.png', {
  eager: true,
  import: 'default',
  query: '?url',
})
const { $clicks, $renderContext } = useSlideContext()
const { isPrintMode } = useNav()
const isActive = useIsSlideActive()
const field = ref<HTMLElement>()
const size = ref({ width: 884, height: 391 })
const mediaPrint = ref(false)
const staticMode = computed(() => isPrintMode.value || mediaPrint.value
  || !['slide', 'presenter'].includes($renderContext.value))
const expanded = computed(() => staticMode.value || $clicks.value >= 1)
const introPoses = computed(() => publicationIntroPoses(additionalPublications, size.value.width, size.value.height))
const boardPoses = computed(() => publicationBoardPoses(additionalPublications, size.value.width,
  size.value.height + (expanded.value ? 0 : 46)))

function paperStyle(id: string): CSSProperties {
  const pose = (!expanded.value && introPoses.value[id]) || boardPoses.value[id]
  const entersFromLeft = ['diurnal-cycle', 'extreme-rainfall'].includes(id)
  return {
    width: `${pose.width}px`,
    height: `${pose.height}px`,
    '--paper-x': `${pose.x}px`,
    '--paper-y': `${pose.y}px`,
    '--paper-angle': `${pose.angle}deg`,
    '--entry-x': entersFromLeft ? '-110px' : '100px',
    '--entry-y': id === 'parsivel-preprint' ? '75px' : '-35px',
    '--entry-angle': entersFromLeft ? '-7deg' : '6deg',
    '--arrival-delay': expanded.value && !staticMode.value
      ? `${publicationArrivalDelays[id] ?? 0}ms` : '0ms',
  }
}

let resizeObserver: ResizeObserver | undefined
let printPreference: MediaQueryList | undefined
function syncPrint() {
  mediaPrint.value = printPreference?.matches ?? false
}
onMounted(() => {
  resizeObserver = new ResizeObserver(([entry]) => {
    if (entry.contentRect.width > 0 && entry.contentRect.height > 0)
      size.value = { width: entry.contentRect.width, height: entry.contentRect.height }
  })
  if (field.value) resizeObserver.observe(field.value)
  printPreference = window.matchMedia('print')
  syncPrint()
  printPreference.addEventListener('change', syncPrint)
})
onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  printPreference?.removeEventListener('change', syncPrint)
})
</script>

<template>
  <section
    class="publication-board"
    :class="{ 'is-expanded': expanded, 'is-static': staticMode, 'is-active': isActive }"
    :data-expanded="expanded"
    :data-clicks="$clicks"
    aria-label="Additional research contributions, 2024–2026"
  >
    <header class="publication-board-heading">
      <h1>Additional research contributions</h1>
      <p class="publication-board-summary" :aria-hidden="!expanded">
        <span><strong>6</strong> journal articles</span>
        <span><strong>2</strong> first (1 shared)</span>
        <span><strong>4</strong> co-authored</span>
        <span><strong>+1</strong> co-authored preprint</span>
      </p>
    </header>

    <p class="publication-board-scope">
      <span>2024–2026 · Outside this dissertation</span>
      <span>Selected journal-page headers</span>
    </p>

    <div ref="field" class="publication-board-field">
      <div class="publication-board-counts" :aria-hidden="expanded" :inert="expanded">
        <p class="publication-board-category">6 published journal articles</p>
        <div class="publication-board-stat">
          <strong>2</strong>
          <span>First-author publications</span>
          <small>Including 1 shared first authorship</small>
        </div>
        <div class="publication-board-stat">
          <strong>4</strong>
          <span>Other co-authored publications</span>
        </div>
        <p class="publication-board-preprint"><a href="https://doi.org/10.5194/egusphere-2026-2705" target="_blank" rel="noopener noreferrer"><strong>+1</strong> co-authored preprint</a></p>
      </div>

      <figure
        v-for="paper in additionalPublications"
        :key="paper.id"
        class="publication-card"
        :class="{ 'is-hidden': !expanded && !paper.initial, 'is-preprint': paper.status === 'preprint' }"
        :style="paperStyle(paper.id)"
        :data-publication="paper.id"
        :data-status="paper.status"
        :aria-hidden="!expanded && !paper.initial"
        :inert="!expanded && !paper.initial"
      >
        <figcaption>
          <span>{{ paper.journal }} · {{ paper.year }}</span>
          <span class="publication-card-role">{{ paper.status === 'preprint' ? 'Preprint · Co-author' : paper.role }}</span>
        </figcaption>
        <a class="publication-card-header" :href="paper.href" target="_blank" rel="noopener noreferrer" :title="paper.title">
          <img
            :src="headers[`../figures/additional-publications/${paper.asset}`]"
            :width="paper.width"
            :height="paper.height"
            :alt="`${paper.title}. ${paper.journal}, ${paper.year}. ${paper.status === 'preprint' ? 'Preprint; ' : ''}${paper.role}; Jairo’s name outlined.`"
            draggable="false"
          />
          <svg :viewBox="`0 0 ${paper.width} ${paper.height}`" aria-hidden="true">
            <rect v-bind="paper.highlight" rx="2" />
          </svg>
        </a>
      </figure>
    </div>
  </section>
</template>

<style scoped>
.publication-board {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
}

.publication-board-heading {
  position: relative;
}

.publication-board-heading h1 {
  margin-bottom: 0;
  padding-bottom: 0;
  font-size: 1.75rem;
  line-height: 1.2;
}

.is-expanded .publication-board-heading h1 {
  font-size: 1.2rem;
}

.publication-board-summary {
  position: absolute;
  top: 0.12rem;
  right: 0;
  display: flex;
  gap: 0.9rem;
  margin: 0;
  color: var(--cu-text-muted);
  font-size: 0.7rem;
  line-height: 1.3;
  opacity: 0;
  pointer-events: none;
  transition: opacity 250ms ease;
}

.publication-board-summary strong {
  color: var(--cu-heading);
  font-size: 0.9rem;
}

.is-expanded .publication-board-summary {
  opacity: 1;
  transition-delay: 120ms;
}

.publication-board-scope {
  display: grid;
  grid-template-columns: minmax(0, 0.45fr) minmax(0, 1fr);
  align-items: baseline;
  gap: 1.65rem;
  height: 1.215rem;
  margin: 0.3rem 0 0.7rem;
  color: var(--cu-text-muted);
  font-size: 0.9rem;
  line-height: 1.35;
}

.publication-board-scope span:last-child {
  font-size: 0.8rem;
}

.is-expanded .publication-board-scope {
  height: 0;
  margin: 0;
}

.is-expanded .publication-board-scope span:first-child {
  position: absolute;
  right: 0;
  bottom: 0;
  font-size: 0.68rem;
  line-height: 1.3;
}

.is-expanded .publication-board-scope span:last-child {
  display: none;
}

.publication-board-field {
  position: relative;
  flex: 1;
  min-height: 0;
  margin-bottom: 0.45rem;
  isolation: isolate;
}

.publication-board-counts {
  position: absolute;
  top: 50%;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.3rem;
  width: calc((100% - 1.65rem) * 0.45 / 1.45);
  transform: translateY(-50%);
  transition: opacity 180ms ease, transform 350ms ease;
}

.is-expanded .publication-board-counts {
  opacity: 0;
  pointer-events: none;
  transform: translateY(-50%) scale(0.93);
}

.publication-board-category {
  margin: 0;
  color: var(--cu-text-muted);
  font-size: 0.9rem;
  line-height: 1.3;
}

.publication-board-stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.publication-board-stat strong {
  color: var(--cu-heading);
  font-size: 3.4rem;
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.publication-board-stat span {
  font-size: 1.05rem;
  line-height: 1.3;
}

.publication-board-stat small {
  color: var(--cu-text-muted);
  font-size: 0.8rem;
  line-height: 1.35;
}

.publication-board-preprint {
  margin: 0.25rem 0 0;
  font-size: 0.95rem;
  line-height: 1.35;
}

.publication-board-preprint a {
  color: var(--cu-text);
  border-bottom: 0;
  text-decoration: none;
}

.publication-board-preprint strong {
  margin-right: 0.3rem;
  font-size: 1.35rem;
}

.publication-card {
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
  background: white;
  opacity: 1;
  transform: translate3d(var(--paper-x), var(--paper-y), 0) rotate(var(--paper-angle));
  transform-origin: center;
  transition: transform 720ms cubic-bezier(0.22, 1.12, 0.36, 1), width 650ms ease, height 650ms ease, opacity 300ms ease;
  transition-delay: var(--arrival-delay);
}

.publication-card.is-hidden {
  opacity: 0;
  pointer-events: none;
  transform: translate3d(calc(var(--paper-x) + var(--entry-x)), calc(var(--paper-y) + var(--entry-y)), 0)
    rotate(calc(var(--paper-angle) + var(--entry-angle))) scale(0.92);
}

.is-expanded .publication-card {
  box-shadow: 0 4px 12px rgb(0 0 0 / 14%);
}

.publication-card figcaption {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  height: 14.56px;
  margin: 0 0 2.4px;
  color: var(--cu-text-muted);
  font-size: 0.7rem;
  line-height: 14.56px;
  white-space: nowrap;
}

.publication-card-role {
  color: var(--cu-heading);
  font-weight: 600;
}

.is-expanded .publication-card figcaption {
  gap: 0.4rem;
  height: 13.6px;
  margin-bottom: 2px;
  padding: 0 3px;
  color: #50545a;
  font-size: 0.68rem;
  line-height: 13.6px;
}

.is-expanded .publication-card-role {
  color: #171717;
}

.is-preprint .publication-card-role {
  padding: 0 3px;
  background: #cfb87c;
}

.publication-card-header {
  position: relative;
  display: block;
  width: 100%;
  overflow: hidden;
  border: 1px solid var(--cu-border);
  background: white;
}

.is-preprint .publication-card-header {
  border-color: #8d7334;
}

.publication-card-header img {
  display: block;
  width: 100%;
  height: auto;
}

.publication-card-header svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.publication-card-header rect {
  fill: none;
  stroke: #8d7334;
  stroke-width: 2.5;
}

.publication-card-header:focus-visible,
.publication-board-preprint a:focus-visible {
  outline: 2px solid var(--cu-gold-accessible);
  outline-offset: 3px;
}

.publication-card:focus-within {
  z-index: 5;
}

.is-static *,
.publication-board:not(.is-active) * {
  transition: none !important;
}

@media (prefers-reduced-motion: reduce) {
  .publication-board * {
    transition: none !important;
  }
}
</style>
