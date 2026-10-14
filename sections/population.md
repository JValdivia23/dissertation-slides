---
layout: section
class: paper-title
title: Temporal Evolution of Cloud-Top Generating Cells
---

<div class="paper-title-content">
  <p class="paper-kicker">Paper 3 · CTGC population</p>
  <h1>Temporal Evolution of Cloud-Top Generating Cells</h1>
  <h2>A Case Study</h2>
  <div class="paper-authors">
    <p><strong>Jairo M. Valdivia-Prado</strong></p>
    <p>Coauthors: Katja Friedrich · Troy Zaremba · Sarah Tessendorf</p>
  </div>
  <p class="paper-affiliation">Department of Atmospheric and Oceanic Sciences · University of Colorado Boulder</p>
  <p class="paper-citation">Published as Valdivia, Friedrich, Zaremba, and Tessendorf, <em>Journal of the Atmospheric Sciences</em> 83, 1405–1431 (2026) · doi:10.1175/JAS-D-25-0088.1</p>
</div>

<!--
Now let's jump into CTGC itself.
-->

---
class: population-objectives
---

# Objectives: CTGC population evolution

<p class="population-lead">
  While instantaneous cell structures are known from snapshots, the <strong>complete lifecycle of a CTGC population</strong> has remained undocumented observationally.
</p>

<div class="limit-row">

<div class="limit-card">
  <h3>Macrostructural evolution</h3>
  <p class="ask">How do CTGCs organize and evolve through time?</p>
  <p>Track changes in cell counts, horizontal dimensions, and the merging of individual cells into contiguous clusters.</p>
</div>

<div class="limit-card">
  <h3>Microphysical progression</h3>
  <p class="ask">How do particle signatures change?</p>
  <p>Examine systematic trends in polarimetric radar variables (<em>Z</em><sub>e</sub>, <em>Z</em><sub>DR</sub>, <em>ρ</em><sub>HV</sub>) and infer crystal habit evolution.</p>
</div>

<div class="limit-card">
  <h3>Environmental conditions</h3>
  <p class="ask">What factors govern the cell lifecycle?</p>
  <p>Assess the roles of vertical wind shear, cloud-top thermodynamic stability, and moisture depletion in cell maintenance and decay.</p>
</div>

</div>

<!--
As I mentioned in the introduction. The complete lifecycle of CTGC was not documented before. Not from the observational perspective.

We want to explore how CTGCs organize and evolve through time?

Is the microphysic of the particles also evolving?

We also explored a lil bit about what environmental conditions are related to this evolution.
-->

---
class: population-context
---

# WINTRE-MIX: Study area and instrumentation

<div class="population-context-body">
  <div class="population-context-story">
    <div>
      <strong>WINTRE-MIX Campaign · IOP05</strong>
      <span>22–23 February 2022 · St. Lawrence and Champlain valleys (US–Canada border). Studying winter precipitation near 0°C in complex terrain.</span>
    </div>
    <div>
      <strong>DOW6 X-band radar (primary)</strong>
      <span>Dual-polarization Doppler radar; 75 m range resolution; 17 PPI sweeps every 6 min (02:00–04:00 UTC).</span>
    </div>
    <div>
      <strong>Context instrumentation</strong>
      <span>Operational S-band radar from Environment and Climate Change Canada (ECCC Blainville; 240 km range); radiosondes from Sorel, QC (02:00 &amp; 04:15 UTC); airborne NAX radar on the NRC Convair-580.</span>
    </div>
  </div>
  <div class="population-context-map">
    <img class="population-context-study-map" src="../figures/wintremix-map.png" alt="Topographic study-area map locating DOW6, the ECCC S-band radar, the Sorel sounding site, and the DOW6 RHI scan path" />
    <img class="population-context-locator" src="../figures/wintremix-north-america-locator.svg" alt="North America locator: a red box marks the study region near Montréal in southern Québec and the adjoining northeastern United States" />
  </div>
</div>

<p class="fine">Paper Figure 2. DOW6 supplies the repeated 6-minute volumetric scans for cell detection; ECCC radar, soundings, and airborne radar provide mesoscale context.</p>

<!--
For this study we are using data from WINTRE-MIX field campaign.
That its being collected during the night of feb 22 and 23 in the US Canada border.

Our main instrument is the DOW6 an x-band radar.

But we also have information of an S band and some soundings.
-->

---
class: population-identification
---

# CTGC detection: Layer maximum and perturbation


<div class="ctgc-stages" aria-label="Animation stages">
  <span v-for="(label, index) in ctgcStages" :key="label" :class="{ active: Math.min(clicks, 6) === index }">{{ label }}</span>
</div>

<div class="ctgc-body">
  <div class="ctgc-visual">
    <div class="ctgc-canvas" role="img" aria-label="Click-stepped radar sampling illustration: 17 elevations, selection of the 5.5–8 km layer, sampled maxima, a horizontal PPI composite, azimuthal means, reflectivity perturbations, and observed CTGC boundaries.">
      <CuManim :steps="6" :width="1000" :height="310" :construct="ctgcIdentification" />
      <svg v-if="clicks === 0" class="ctgc-first-frame" viewBox="0 0 1000 580" aria-hidden="true">
        <path v-for="(item, i) in ctgcPreview" :key="i" :d="item.d" :fill="item.color" :fill-opacity="item.fill" :stroke="item.color" :stroke-opacity="item.stroke" :stroke-width="item.width" />
      </svg>
      <svg v-if="clicks < 6" class="ctgc-labels" viewBox="0 0 1000 580" aria-hidden="true">
        <defs>
          <linearGradient id="ctgc-field-scale">
            <stop v-for="(color, i) in clicks === 5 ? ctgcColors.perturbation : ctgcColors.reflectivity" :key="i" :offset="`${i * 25}%`" :stop-color="color" />
          </linearGradient>
          <marker id="ctgc-arrow-head" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L8,4 L0,8 z" fill="#cfb87c" />
          </marker>
        </defs>
        <g v-if="clicks <= 2">
          <text v-for="(item, i) in ctgcLabels.side" :key="i" :x="item.x" :y="item.y" :text-anchor="item.anchor">{{ item.text }}</text>
          <rect x="700" y="27" width="140" height="12" fill="url(#ctgc-field-scale)" />
          <text x="681" y="42">0</text><text x="902" y="42">18 dBZ</text>
          <text v-if="clicks === 2" x="540" y="528" class="ctgc-gold">Retain the maximum at each range gate</text>
          <g v-if="clicks >= 1" class="ctgc-gold">
            <text v-for="(item, i) in ctgcLabels.layer" :key="i" :x="item.x" :y="item.y" :text-anchor="item.anchor">{{ item.text }}</text>
          </g>
        </g>
        <g v-else>
          <text v-for="(item, i) in ctgcLabels.map" :key="i" :x="item.x" :y="item.y" :text-anchor="item.anchor">{{ item.text }}</text>
          <text v-if="clicks === 5" x="830" y="95" class="ctgc-map-title">Z′ (dB)</text>
          <text v-else x="830" y="95" class="ctgc-map-title">Z<tspan baseline-shift="sub" style="font-size: 18px">max</tspan><tspan> (dBZ)</tspan></text>
          <text x="830" y="128">{{ clicks >= 4 ? 'One range ring: 36.25 km' : 'Sampled layer maximum' }}</text>
          <g v-if="clicks >= 4" class="ctgc-ring-profile" :class="{ 'ctgc-no-anim': ctgcNoAnim }">
            <line x1="520" y1="252" x2="698" y2="252" class="ctgc-link-arrow" marker-end="url(#ctgc-arrow-head)" />
            <path d="M715 165 V338 H955" />
            <path :d="`M715 ${ctgcRingProfile.meanY} H955`" class="ctgc-mean-line ctgc-xfade" :class="{ faded: clicks === 5 }" />
            <path :d="`M715 ${ctgcRingProfile.zeroY} H955`" class="ctgc-mean-line ctgc-xfade" :class="{ faded: clicks !== 5 }" />
            <polyline :points="ctgcRingProfile.maximum" class="ctgc-profile-poly ctgc-xfade" :class="{ faded: clicks === 5 }" />
            <polyline :points="ctgcRingProfile.perturbation" class="ctgc-profile-poly ctgc-xfade" :class="{ faded: clicks !== 5 }" />
            <text x="704" y="188" text-anchor="end">{{ clicks === 5 ? '12' : '18' }}</text>
            <text x="704" y="340" text-anchor="end">{{ clicks === 5 ? '−4' : '0' }}</text>
            <text x="715" y="365">0°</text><text x="955" y="365">360°</text>
            <text x="835" y="397">Azimuth</text>
            <text x="835" y="435" class="ctgc-gold">{{ clicks === 5 ? 'Reference becomes zero' : `Azimuthal mean = ${ctgcData.focus.mean.toFixed(1)} dBZ` }}</text>
          </g>
          <g v-else>
            <text x="830" y="270">One value per (r, θ)</text>
            <text x="830" y="307">Horizontal CTGC footprint</text>
          </g>
          <rect x="715" y="466" width="240" height="16" fill="url(#ctgc-field-scale)" />
          <text x="715" y="512">{{ clicks === 5 ? '−4' : '0' }}</text>
          <text x="835" y="512">{{ clicks === 5 ? '4' : '9' }}</text>
          <text x="955" y="512">{{ clicks === 5 ? '12 dB' : '18 dBZ' }}</text>
        </g>
      </svg>
      <div v-if="clicks >= 6" class="ctgc-observed">
        <img src="../figures/population-contours-final.png" alt="Observed example at 03:18 UTC: Valdivia, et al. 2026 Figure 5e, final closed CTGC boundaries after Gaussian smoothing, 5-dB contouring, and screening" />
      </div>
    </div>
    <p class="ctgc-view-caption">{{ clicks >= 6 ? 'Observed example · 03:18 UTC · Validiva, et al. 2026 Fig. 5e' : clicks <= 2 ? 'Schematic · one azimuth · vertical scale exaggerated' : 'Schematic · same volume reduced to a horizontal field' }}</p>
  </div>
  <div class="ctgc-explanation">
    <div v-if="clicks === 0">
      <h2>Discrete vertical sampling</h2>
      <p><strong>17 PPI elevations · 0.4°–50°</strong></p>
      <p>Each ray is a side view of one elevation sweep.</p>
      <p class="ctgc-secondary">The volume repeats every 6 minutes.</p>
    </div>
    <div v-else-if="clicks === 1">
      <h2>Select the generating layer</h2>
      <p><strong>5.5–8 km MSL</strong>, identified from RHI observations.</p>
      <p>Only sampled gates inside this band contribute.</p>
      <p class="ctgc-secondary">The number of contributing elevations changes with range.</p>
    </div>
    <div v-else-if="clicks === 2">
      <h2>Layer column maximum</h2>
      <p>Extract maximum reflectivity in the 5.5–8 km MSL cell layer at each range–azimuth gate (<em>r</em>, <em>θ</em>).</p>
      <p class="ctgc-secondary">The white rings mark the contributing samples; only the largest value is retained.</p>
    </div>
    <div v-else-if="clicks === 3">
      <h2>Repeat around the radar</h2>
      <p>Each PPI samples azimuth around the radar.</p>
      <p>Retaining one maximum per (<em>r</em>, <em>θ</em>) produces the <strong>2D Z<sub>max</sub> field</strong>.</p>
      <p class="ctgc-secondary">The layer maximum collapses the elevation dimension.</p>
    </div>
    <div v-else-if="clicks === 4">
      <h2>A range-dependent background</h2>
      <p>Average Z<sub>max</sub> over valid azimuths at the same range.</p>
      <p>The highlighted ring has a mean of <strong>{{ ctgcData.focus.mean.toFixed(1) }} dBZ</strong>.</p>
      <p class="ctgc-secondary">Repeat for every range ring.</p>
    </div>
    <div v-else-if="clicks === 5">
      <h2>Reflectivity perturbation (Z′)</h2>
      <p>Subtract the range-dependent azimuthal mean:</p>
      <div class="ctgc-equation">

$$Z'(r,\theta) = Z_{\max}(r,\theta) - \overline{Z_{\max}}_{\theta}(r)$$

</div>
      <p class="ctgc-secondary">Positive Z′ marks an enhancement above its range-ring background.</p>
    </div>
    <div v-else>
      <h2>Smoothing, 5-dB contouring &amp; screening</h2>
      <p>Apply 2D Gaussian smoothing, contour at 5 dB, and discard nested or &lt;0.09 km² regions.</p>
      <p class="ctgc-secondary">Gaussian σ = 1 gate in range and azimuth.</p>
      <p class="ctgc-result">Closed boundaries are used to quantify CTGCs.</p>
    </div>
  </div>
</div>

<p class="fine ctgc-source">{{ clicks >= 6 ? '' : '' }}</p>

<script setup>
import { ref, watch } from 'vue'
import { useNav } from '@slidev/client'
import { ctgcIdentification, ctgcStages, ctgcPreview, ctgcLabels, ctgcData, ctgcColors, ctgcRingProfile } from '../scenes/ctgc-identification'

const { clicks } = useNav()
// Forward steps fade the profile overlay alongside the 1.5 s map morph.
// Backward navigation replays the map instantly, so the overlay must snap too.
const ctgcNoAnim = ref(false)
let ctgcNoAnimFrame = 0
watch(clicks, (next, prev) => {
  if (next < prev) {
    ctgcNoAnim.value = true
    cancelAnimationFrame(ctgcNoAnimFrame)
    ctgcNoAnimFrame = requestAnimationFrame(() => requestAnimationFrame(() => { ctgcNoAnim.value = false }))
  }
})
</script>

<!--
How do we do to detect the CTGCs?

We know CTGC

From the countours we can compute the centroids, area, number, etc.
-->

---
class: population-video
---

# Horizontal evolution


<div class="population-video-body">
  <video class="population-video-player" muted autoplay loop playsinline controls poster="../figures/compsii-horizontal-poster.png">
    <source src="../figures/compsii-horizontal-evolution.mp4" type="video/mp4" />
  </video>
  <div class="population-video-points">
    <section><h2>Temporal evolution</h2><p>Detected anomalies emerge, intensify, and dissipate over the observed population sequence.</p></section>
    <section><h2>Spatial distribution</h2><p>Two distinct CTGC groups are visible: the earlier Set 1 and the later Set 2.</p></section>
  </div>
</div>

<!--
We observe how CTGC evolve, from many small cells
-->

---
class: population-storm
---

# CTGC population within the evolving storm

<p class="population-lead">23 February 2022 · WINTRE-MIX IOP05 · the same storm and selected cell in Papers 3 and 4.</p>

<div class="population-storm-sequence">
  <figure><img src="../figures/population-storm-0254.png" alt="Paper 4 Figure S1(a), 02:54 UTC: CTGC centroids over ECCC reflectivity, with the selected Set 1 cell west of DOW6 marked in red" /><figcaption>02:54 UTC</figcaption></figure>
  <figure><img src="../figures/population-storm-0318.png" alt="Paper 4 Figure S1(e), 03:18 UTC: the same selected cell has moved northeast among the CTGC population; the red box marks the moving analysis domain" /><figcaption>03:18 UTC</figcaption></figure>
  <figure><img src="../figures/population-storm-0342.png" alt="Paper 4 Figure S1(i), 03:42 UTC: the selected cell is northeast of DOW6 as the broader precipitation field translates across the domain" /><figcaption>03:42 UTC</figcaption></figure>
  <svg class="population-storm-scale" viewBox="0 0 64 300" role="img" aria-label="ECCC reflectivity scale, −5 to 40 dBZ, with open-ended extremes">
    <defs><clipPath id="population-storm-scale-clip"><path d="M11 27 L18 39 V268.5 L11 280 L4 268.5 V39Z" /></clipPath></defs>
    <image href="../figures/population-storm-scale.png" x="-3.8" y="24" width="65" height="265" preserveAspectRatio="none" clip-path="url(#population-storm-scale-clip)" />
    <text x="32" y="15" class="population-scale-unit">dBZ</text>
    <g v-for="(value, index) in [40, 35, 30, 25, 20, 15, 10, 5, 0, -5]" :key="value">
      <line x1="18" x2="23" :y1="39 + index * 25.5" :y2="39 + index * 25.5" />
      <text x="28" :y="39 + index * 25.5">{{ value }}</text>
    </g>
  </svg>
</div>

<p class="population-storm-key"><strong>Black dots:</strong> both CTGC sets · <strong>Red marker:</strong> selected Set 1 cell · <strong>Red box:</strong> Paper 4 analysis domain</p>


<p class="fine">ECCC reflectivity (dBZ) with DOW6-derived CTGC centroids; dashed circle = DOW6's 75-km range.</p>

<!--
This cells are embeded in a big precipitation system.

Those black dots are our CTGCs. And the red dot is the same cell at different time steps. It will become the main character later.
-->

---
class: population-trends population-maps
---

# Set 1: structure evolution

<p class="population-lead">The approximately 1.7-hour observed population is divided into initiation, mature, and dissipation stages.</p>

<div class="population-trends-figure">
  <div v-click.hide="1" class="population-map-scale-pair">
    <div class="population-map-pair">
      <figure><img src="../figures/population-map-initiation.png" alt="Paper Figure 12(a), 02:30 UTC: many small CTGC boundaries, mostly blue or cyan area classes, west of DOW6" /><figcaption>02:30 · many small features</figcaption></figure>
      <span aria-hidden="true">→</span>
      <figure><img src="../figures/population-map-mature.png" alt="Paper Figure 12(c), 03:12 UTC: fewer, larger contiguous CTGC boundaries, including red and orange area classes" /><figcaption>03:12 · larger contiguous features</figcaption></figure>
    </div>
    <img class="population-area-scale" src="../figures/population-area-scale.png" alt="Paper Figure 12 contour-area scale in square kilometers: 0–1, 1–2, 2–3, 3–5, 5–10, 10–20, 20–40, and 40 or more; warmer colors indicate larger area" />
  </div>
  <img v-click="1" src="../figures/population-count-area.png" alt="Paper Figure 13(a): Set 1 CTGC count peaks near 02:30 UTC, while mean contour area grows into the mature stage, then the number declines" />
</div>

<div class="population-trends-legend">
  <div v-click="1" class="population-legend-row" role="group" aria-label="CTGC count and area legend">
    <span class="population-legend-item"><svg class="population-legend-sample" viewBox="0 0 48 20" aria-hidden="true"><path d="M4 10H44" stroke="#ff0000" stroke-width="4" /><circle cx="24" cy="10" r="6" fill="#ff0000" /></svg><span>Count</span></span>
    <span class="population-legend-item"><svg class="population-legend-sample" viewBox="0 0 48 20" aria-hidden="true"><path d="M4 10H44" stroke="#0000ff" stroke-width="4" /></svg><span>Mean area</span></span>
    <span class="population-legend-item"><svg class="population-legend-sample" viewBox="0 0 48 20" aria-hidden="true"><path d="M4 10H44" stroke="#008000" stroke-width="4" stroke-dasharray="8 5" /></svg><span>Area mode</span></span>
    <span class="population-legend-item"><svg class="population-legend-sample" viewBox="0 0 48 20" aria-hidden="true"><rect x="4" y="4" width="40" height="12" fill="#e4e4e4" stroke="#aaaaaa" /></svg><span>10th–90th percentile of area</span></span>
  </div>
</div>

<div class="population-trends-message">
  <p v-click.hide="1"><strong>Small boundaries become larger contiguous clusters.</strong> A large boundary can contain several cells.</p>
  <p v-click="1"><strong>Count peaks early.</strong> During maturity, count falls while mean contiguous area rises; later the count and coverage decline.</p>
</div>

<!--
This is an example of how the size evolve.
Initially, most of them are 1 or 2 km2, then a few of them get bigger than 20 km2.
For reference the city of Boulder is around 14 km2.

If we looks at the number with more detail, we notice something interesting...

Here the red is the number of cells, and blue is the area.

Initially, the area and the number increase, that is what we call the initiation stage.

Then, the area keep increasing but the number decrease.

And later the area and the number decrease.
-->

---
class: population-trends
---

# Set 1: polarimetric evolution

<p class="population-lead">Mean differential reflectivity falls early, then rises through maturity and dissipation.</p>

<div class="population-trends-figure">
  <img src="../figures/population-zdr.png" alt="Paper Figure 13(c): Set 1 mean differential reflectivity decreases during initiation and then rises through mature and dissipation stages" />
</div>

<div class="population-trends-legend">
  <div class="population-legend-row" role="group" aria-label="Differential reflectivity legend">
    <span class="population-legend-item"><svg class="population-legend-sample" viewBox="0 0 48 20" aria-hidden="true"><path d="M4 10H44" stroke="#0000ff" stroke-width="4" /></svg><span>Mean Z<sub>DR</sub></span></span>
    <span class="population-legend-item"><svg class="population-legend-sample" viewBox="0 0 48 20" aria-hidden="true"><path d="M4 10H44" stroke="#008000" stroke-width="4" stroke-dasharray="8 5" /></svg><span>Mode Z<sub>DR</sub></span></span>
    <span class="population-legend-item"><svg class="population-legend-sample" viewBox="0 0 48 20" aria-hidden="true"><rect x="4" y="4" width="40" height="12" fill="#e4e4e4" stroke="#aaaaaa" /></svg><span>10th–90th percentile</span></span>
  </div>
</div>

<div class="population-trends-message">
  <p><strong>Mean Z<sub>DR</sub> falls, then rises: Suggesting aggregation and preferential sedimentation</strong></p>
</div>

<!--
It is even more interesting we look at the ZDR.

During the initiation stage, the ZDR decrease.

But once in the mature stage it keeps increasing even during dissipation.

We interpret this signal as
-->

---
class: population-zdr-summary
clicks: 2
---

# Differential reflectivity

<p class="zdr-summary-stage">{{ summaryStages[summaryStep] }}</p>

<div class="zdr-summary-body" :data-step="summaryStep">
  <section class="zdr-summary-intro" :class="{ 'is-hidden': summaryStep > 0 }">
    <div class="zdr-summary-examples">
      <svg viewBox="0 0 500 290" role="img" aria-label="Independent positive-ZDR reference: an idealized horizontally oriented plate has a stronger horizontal than vertical return.">
        <text x="250" y="40" text-anchor="middle" class="zdr-reference-title">Positive ZDR reference</text>
        <ellipse cx="115" cy="145" rx="67" ry="17" fill="#edf2f7" fill-opacity="0.12" stroke="#edf2f7" stroke-width="3" />
        <text x="115" y="207" text-anchor="middle">Horizontal plate</text>
        <text x="229" y="133" class="zdr-horizontal">H</text>
        <text x="229" y="176" class="zdr-vertical">V</text>
        <rect x="265" y="113" width="180" height="25" rx="2" fill="#78baff" />
        <rect x="265" y="156" width="70" height="25" rx="2" fill="#ef8f9b" />
        <text x="350" y="253" text-anchor="middle" class="zdr-reference-value">H &gt; V · ZDR &gt; 0</text>
      </svg>
      <svg viewBox="0 0 500 290" role="img" aria-label="Independent near-zero-ZDR reference: an idealized spherical particle has approximately equal horizontal and vertical returns.">
        <text x="250" y="40" text-anchor="middle" class="zdr-reference-title">Near-zero ZDR reference</text>
        <circle cx="115" cy="145" r="42" fill="#edf2f7" fill-opacity="0.12" stroke="#edf2f7" stroke-width="3" />
        <text x="115" y="207" text-anchor="middle">Spherical particle</text>
        <text x="229" y="133" class="zdr-horizontal">H</text>
        <text x="229" y="176" class="zdr-vertical">V</text>
        <rect x="265" y="113" width="130" height="25" rx="2" fill="#78baff" />
        <rect x="265" y="156" width="130" height="25" rx="2" fill="#ef8f9b" />
        <text x="350" y="253" text-anchor="middle" class="zdr-reference-value">H ≈ V · ZDR ≈ 0</text>
      </svg>
    </div>
    <div class="zdr-summary-equation">

$$Z_{\mathrm{DR}} = 10\log_{10}\!\left(\frac{z_{\mathrm{H}}}{z_{\mathrm{V}}}\right)\;\mathrm{dB}$$

</div>
  </section>

  <div class="zdr-summary-results" :class="{ 'is-hidden': summaryStep === 0 }">
    <figure class="zdr-summary-observation">
      <div class="zdr-summary-chart">
        <img src="../figures/population-zdr.png" alt="Paper Figure 13(c), Set 1: mean differential reflectivity decreases in initiation, then increases overall through the mature and dissipation stages. The complete mean, mode, percentile envelope, and original stage dividers are retained." />
        <svg viewBox="0 0 1066 467" aria-hidden="true">
          <template v-if="summaryStep === 1">
            <rect class="zdr-summary-muted-region" x="313" y="9" width="419" height="431" />
            <rect class="zdr-summary-muted-region" x="736" y="9" width="261" height="431" />
          </template>
          <rect v-if="summaryStep === 2" class="zdr-summary-muted-region" x="154" y="9" width="155" height="431" />
        </svg>
      </div>
      <figcaption>Set 1 · blue: mean · dashed green: mode · gray: 10th–90th percentile</figcaption>
    </figure>
    <aside class="zdr-summary-concept">
      <p class="zdr-summary-layer-label">Generating layer · 5.5–8 km MSL</p>
      <div class="zdr-summary-canvas" role="img" aria-label="Conceptual particle evolution: oriented crystals aggregate on the first click; larger aggregates preferentially leave the generating layer on the second click while oriented crystals remain.">
        <CuManim v-if="summaryActive" :steps="2" :width="1000" :height="190" :construct="constructZdrLifecycle" />
        <svg v-if="summaryStep === 0" class="zdr-summary-preview" viewBox="0 0 1000 650" aria-hidden="true">
          <path v-for="(shape, index) in zdrLifecyclePreview" :key="index" :d="shape.d" :fill="shape.color" :fill-opacity="shape.fill" :stroke="shape.color" :stroke-opacity="shape.stroke" :stroke-width="shape.width" />
        </svg>
      </div>
      <div class="zdr-summary-legend">
        <span><i aria-hidden="true"></i>Oriented crystals</span>
        <span><i class="zdr-aggregate" aria-hidden="true"></i>Aggregates</span>
      </div>
    </aside>
  </div>
</div>

<p class="zdr-summary-message">{{ summaryMessages[summaryStep] }}</p>
<p class="fine zdr-summary-source">{{ summaryStep === 0 ? 'Independent idealized examples · bars show relative returned reflectivity' : 'Paper Figure 13(c) · schematic interpretation, not direct particle observations' }}</p>

<script setup>
import { computed } from 'vue'
import { useIsSlideActive, useNav } from '@slidev/client'
import { zdrLifecycleInterpretation, zdrLifecyclePreview } from '../scenes/zdr-lifecycle'

const { clicks } = useNav()
const summaryActive = useIsSlideActive()
const summaryStep = computed(() => Math.max(0, Math.min(clicks.value, 2)))
function constructZdrLifecycle() {
  return zdrLifecycleInterpretation(() => summaryActive.value ? summaryStep.value : 0)
}
const summaryStages = ['Horizontal and vertical returns', 'Initiation', 'Mature → Dissipation']
const summaryMessages = [
  'ZDR compares horizontal and vertical returns.',
  'Decreasing ZDR: consistent with aggregation.',
  'Increasing ZDR: consistent with sedimentation and particle sorting.',
]
</script>

<!--
And I am gonna make a pause here, because this is a big claim.


But is a population signal.
-->

---
class: population-cell
clicks: 1
---

# One selected cell persisted for nearly 50 minutes

<div class="population-cell-body">
<div class="population-cell-text">
  <p class="population-lead">Tracked CTGC · nine times-steps · 02:55–03:43 UTC</p>
    <section><strong>Sampling the moving cell</strong><p>PPI elevation changes between panels (6.9°, 11.6°) keep the cell in view; gray dashed arcs mark altitude.</p></section>
    <section><strong>Nearly 50 minutes</strong><p></p></section>
  <section><strong>Peak near 03:25</strong><p>Strongest and largest near mid-track (maximum contour area about 45 km²), then smaller.</p></section>
  <section><strong>Matching Z<sub>DR</sub> behavior</strong><p>Z<sub>DR</sub> falls to near zero during maturity, then exceeds 2 dB late in the track, consistent with the population trend.</p></section>
</div>

<div class="population-cell-full population-swap">
  <img v-click.hide="1" src="../figures/population-cell-full-z.png" alt="Paper Figure 17: the complete nine-panel reflectivity PPI sequence of the tracked cell from 02:55 to 03:43 UTC, with the dashed circle marking the cell in each panel" />
  <img v-click="1" src="../figures/population-cell-full-zdr.png" alt="Paper Figure 18: the complete nine-panel differential reflectivity PPI sequence for the same cell and times, with the dashed circle marking the cell in each panel" />
</div>
</div>

<!--
If our interpretation is true we should also see the same signal in a single CTGC.
-->

---
class: figure-slide population-schematic
---

# A conceptual population life cycle

<div class="fig">
  <img src="../figures/population-lifecycle-full.png" alt="Paper Figure 19: conceptual CTGC lifecycle across initiation, mature, and dissipation stages, showing simplified vertical cross-sections above and horizontal boundary evolution below, with legend defining pristine crystals, isotropic aggregates or rimed crystals, and 5-dBZ perturbation CTGC boundaries" />
</div>

<!--
That take us to the conceptual population life cycle.
-->

---
class: smoothing-conclusions population-conclusions conclusions-bullets
title: "Project 3: Conclusions"
---

# Project 3: Conclusions
- A CTGC population progressed through initiation, maturity, and dissipation over approximately 1.7 hours.
- Cell went from small and numerous to fewer and big, before dissipate.
- The polarimetric signals are consistent with early aggregation and later preferential sedimentation and particle sorting within the generating layer.

<p class="population-handoff">One selected cell showed a similar structural and polarimetric progression.</p>

<!--
The conclusions of this project are:

We were able to analyze a population of CTGC and we identify 3 stages.
-->
