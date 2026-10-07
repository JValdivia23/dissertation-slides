<script setup lang="ts">
import footprintFigure from '../figures/paper4-footprints-source.svg'

// Coordinates are in the source PDF's points. Include the 0.8-point frames
// inside each clip; preserve both complete maps, their in-plot keys and GC
// markers, and both complete colorbars, including their extension triangles.
const source = { width: 881.92511, height: 403.67975, top: 60.57599, size: 305.56 }
const plot = { x: 70, y: 1, size: source.size }
const colorbar = { x: 386, width: 15.27802 }
const distanceTicks = [-30, -25, -20, -15, -10, -5, 0, 5]
const panels = [
  {
    name: 'Rain',
    layer: '1–1.5 km MSL',
    threshold: '2.9',
    plotLeft: 48.96563,
    colorbarLeft: 362.92181,
    colorbarTicks: [-4, -3, -2, -1, 0, 1, 2, 3, 4],
    // The two source scales differ: do not normalize or share a colorbar.
    colorbarZero: 213.35600,
    colorbarStep: 34.71156,
  },
  {
    name: 'Snow',
    layer: '2.5–3 km MSL',
    threshold: '2.2',
    plotLeft: 510.75653,
    colorbarLeft: 824.71271,
    colorbarTicks: [-3, -2, -1, 0, 1, 2, 3],
    colorbarZero: 213.35600,
    colorbarStep: 40.66860,
  },
]

function label(value: number) { return value < 0 ? `−${-value}` : String(value) }
function xPosition(value: number) { return plot.x + (value + 30) / 40 * plot.size }
function yPosition(value: number) { return plot.y + (10 - value) / 40 * plot.size }
function colorbarPosition(panel: typeof panels[number], value: number) {
  return plot.y + panel.colorbarZero - value * panel.colorbarStep - source.top
}
function clip(left: number, width: number) {
  return `${left - 0.4} ${source.top - 0.4} ${width + 0.8} ${source.size + 0.8}`
}
</script>

<template>
  <div class="paper4-footprints-body">
    <div class="paper4-footprint-figure">
      <figure v-for="panel in panels" :key="panel.name">
        <figcaption>
          <strong>{{ panel.name }} · {{ panel.layer }}</strong>
        </figcaption>
        <svg viewBox="0 0 440 365" role="img" :aria-label="`${panel.name} footprint, ${panel.layer}: time-mean layer-maximum reflectivity anomaly in dB, with original black p90 contours at ${panel.threshold} dB. Cell-relative x and y distances in km; the selected cell is at the origin. Original color scale retained.`">
          <rect width="440" height="365" fill="#ffffff" />
          <svg class="paper4-footprint-map" :x="plot.x - 0.4" :y="plot.y - 0.4" :width="plot.size + 0.8" :height="plot.size + 0.8" :viewBox="clip(panel.plotLeft, source.size)" aria-hidden="true">
            <image :href="footprintFigure" :width="source.width" :height="source.height" />
          </svg>
          <svg class="paper4-footprint-colorbar" :x="colorbar.x - 0.4" :y="plot.y - 0.4" :width="colorbar.width + 0.8" :height="plot.size + 0.8" :viewBox="clip(panel.colorbarLeft, colorbar.width)" aria-hidden="true">
            <image :href="footprintFigure" :width="source.width" :height="source.height" />
          </svg>
          <g aria-hidden="true">
            <g v-for="value in distanceTicks" :key="`x-${value}`">
              <path :d="`M${xPosition(value)} ${plot.y + plot.size}v4`" />
              <text :x="xPosition(value)" y="329" text-anchor="middle">{{ label(value) }}</text>
            </g>
            <g v-for="value in distanceTicks" :key="`y-${value}`">
              <path :d="`M${plot.x} ${yPosition(value)}h-4`" />
              <text x="59" :y="yPosition(value)" text-anchor="end" dominant-baseline="central">{{ label(value) }}</text>
            </g>
            <text class="paper4-footprint-axis-title" :x="plot.x + plot.size / 2" y="357" text-anchor="middle">x (km)</text>
            <text class="paper4-footprint-axis-title" :transform="`translate(15 ${plot.y + plot.size / 2}) rotate(-90)`" text-anchor="middle">y (km)</text>
            <g v-for="value in panel.colorbarTicks" :key="`colorbar-${value}`">
              <path :d="`M${colorbar.x + colorbar.width} ${colorbarPosition(panel, value)}h4`" />
              <text x="410" :y="colorbarPosition(panel, value)" dominant-baseline="central">{{ label(value) }}</text>
            </g>
            <text class="paper4-footprint-axis-title" x="395" y="329" text-anchor="middle">dB</text>
          </g>
        </svg>
      </figure>
    </div>
    <div class="paper4-footprint-legend" role="group" aria-label="Footprint figure key">
      <span>Time-mean layer-maximum <em>Z</em>′ (dB)</span>
      <span class="paper4-footprint-contour-key"><svg viewBox="0 0 48 20" aria-hidden="true"><path d="M4 10H44" stroke="#000000" stroke-width="4" /></svg><span>Black contour: upper 10% (p90)</span></span>
    </div>
  </div>
</template>

<style scoped>
.paper4-footprints-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.2rem;
  width: 100%;
  min-height: 0;
}

.paper4-footprint-figure {
  display: grid;
  flex: 1;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: minmax(0, 1fr);
  gap: 0.85rem;
  min-height: 0;
}

figure {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 0.2rem;
  min-width: 0;
  min-height: 0;
  margin: 0;
}

figcaption {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
  color: var(--cu-heading);
  font-size: 1.05rem;
  line-height: 1.25;
  white-space: nowrap;
}

figure > svg {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 0;
}

figure > svg text {
  fill: #000000;
  font-family: inherit;
  font-size: 17px;
}

figure > svg .paper4-footprint-axis-title {
  font-size: 18px;
}

figure > svg path {
  fill: none;
  stroke: #000000;
  stroke-width: 0.8;
}

.paper4-footprint-legend {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  gap: 1.4rem;
  font-size: 1.05rem;
  line-height: 1.3;
  white-space: nowrap;
}

.paper4-footprint-contour-key {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.paper4-footprint-contour-key svg {
  flex: none;
  width: 2.4rem;
  height: 1.15rem;
  border: 1px solid #bbbbbb;
  background: #ffffff;
}
</style>
