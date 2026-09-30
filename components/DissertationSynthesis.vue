<template>
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
</template>

<style scoped>
.dissertation-synthesis-diagram {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-height: 0;
  width: 100%;
  margin: 0;
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
</style>
