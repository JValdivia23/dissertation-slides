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
About 20 seconds. The first two papers addressed radar analysis methods. This third paper is an observational case study, published in the Journal of the Atmospheric Sciences. Credit Katja Friedrich, Troy Zaremba, and Sarah Tessendorf. Do not imply that the spectral methods of Papers 1 and 2 produced this study's population results: the Chapter 4 identification procedure uses its own quality control, polar-coordinate smoothing, azimuthal-mean perturbation, and contouring. The fourth paper later combines the methodological work with the cell track from this study. Next, outline the core problem and three research objectives.
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
  <p class="ask">How do particle signatures change across stages?</p>
  <p>Examine systematic trends in polarimetric radar variables (<em>Z</em><sub>e</sub>, <em>Z</em><sub>DR</sub>, <em>ρ</em><sub>HV</sub>) and infer crystal habit evolution.</p>
</div>

<div class="limit-card">
  <h3>Environmental conditions</h3>
  <p class="ask">What factors govern the cell lifecycle?</p>
  <p>Assess the roles of vertical wind shear, cloud-top thermodynamic stability, and moisture depletion in cell maintenance and decay.</p>
</div>

</div>

<!--
About 45 seconds. The first two papers developed radar analysis methods. This third paper applies high-resolution radar observations to address an open physical problem: following an entire CTGC population through time.

While past studies revealed the instantaneous 1–2 km structure of generating cells using isolated RHI sweeps or aircraft passes, the complete life cycle of a population—from first appearance through organization to decay—has remained uncharacterized observationally.

We address three questions:
First, macrostructure: how do cell count, size, and clustering change over time?
Second, microphysics: what do polarimetric variables reveal about particle sorting and habit changes as cells mature?
And third, environment: what thermodynamic and shear conditions support each stage?

To answer these, we analyze repeated volumetric radar scans from one winter storm during WINTRE-MIX.
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
  <img src="../figures/wintremix-map.png" alt="Topographic study-area map locating DOW6, the ECCC S-band radar, the Sorel sounding site, and the DOW6 RHI scan path" />
</div>

<p class="fine">Paper Figure 2. DOW6 supplies the repeated 6-minute volumetric scans for cell detection; ECCC radar, soundings, and airborne radar provide mesoscale context.</p>

<!--
About 45 seconds. Introduce the observational framework. The dataset comes from the Winter Precipitation Type Research Multi-scale Experiment (WINTRE-MIX), conducted in late winter 2022 across the US–Canada border in the St. Lawrence and Champlain valleys.

Point to the map: DOW6 was deployed near the valley confluence to sample winter storm IOP05. The primary platform is the Doppler on Wheels 6 from the NSF-supported CSWR facility: an X-band dual-polarization radar sampling 17 PPI sweeps every six minutes between 02:00 and 04:00 UTC, with 75-meter range resolution. CTGCs were observed between 5.5 and 8 km MSL.

Supporting context came from Environment and Climate Change Canada's operational S-band radar at Blainville for storm-scale coverage, two radiosondes launched at Sorel for vertical thermodynamics, and a flight pass by the NRC Convair-580 with the NAX cloud radar.

Next, I will explain how we identify CTGC features from these volumetric scans.
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
      <p>Apply 2D Gaussian smoothing (9×9 window), contour at 5 dB, and discard nested or &lt;0.09 km² regions.</p>
      <p class="ctgc-secondary">Gaussian σ = 1 gate in range and azimuth.</p>
      <p class="ctgc-result">Closed boundaries describe the horizontal CTGC distribution.</p>
    </div>
  </div>
</div>

<p class="fine ctgc-source">{{ clicks >= 6 ? 'Gaussian smoothing and area screening (≥0.09 km²) yield coherent closed cell boundaries.' : 'Illustrative reflectivity field · maxima and azimuthal means computed from the example.' }}</p>

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
About 90 seconds. This click-stepped schematic explains the sampling and reduction behind the Paper 3 detection method. It uses the 17 nominal elevations from Paper Figure 3: 0.4–50 degrees. The coarse reflectivity values and cell locations are illustrative, with actual maxima and azimuthal means calculated from that same schematic volume. One initial azimuth is shown in a range–height view. The straight beam centerlines have exaggerated vertical scale; gates are schematic samples, not the radar's actual 75-m spacing. The volume scan repeats every six minutes. Standard quality control and initial reflectivity smoothing precede the operations illustrated here.

[click] Select only observations in the 5.5–8 km MSL cloud-top layer identified in RHI scans. At a particular range, only a few of the 17 elevations intersect the layer. Missing coverage stays missing; the animation does not fill these gaps.

[click] At each polar range–azimuth gate, take the largest of the sampled in-layer reflectivities. The highlighted example at 36.25 km has two contributing elevations, marked by white rings, and the selected maxima move into a common radial strip. The maximum is over available observations, not a reconstructed continuous vertical profile.

[click] Each of these elevations is a PPI sweep around the radar. Rotate the same strip into plan view, and repeat the reduction over all azimuths to obtain Z_max(r, theta). The sweep is a reveal of this one schematic volume, not a simultaneous scan or a time-evolving storm. The PPI volume samples height; reducing the elevations to one layer maximum produces the two-dimensional horizontal footprint. Gray rings have no in-layer samples.

[click] Highlight one range ring and average its valid Z_max values over azimuth. The small profile plots those exact values; the gold dashed line is their mean in dBZ. Each range has its own background value.

[click] Subtract the range-dependent mean from every gate to obtain Z-prime. The profile is now centered on zero, with peaks marking enhancements above the range-ring background. This logarithmic reflectivity difference has units of dB. Localized enhancements remain prominent as the broad background weakens.

[click] Now switch explicitly from the schematic to the observed 03:18 UTC example, Paper Figure 5(e). Apply the paper's two-dimensional Gaussian filter to Z-prime (sigma 1 gate in each direction, 9-by-9 window), contour at a 5-dB enhancement, remove nested contours, and discard regions smaller than 0.09 square kilometers. These are coherent horizontal boundaries for the population analysis. A connected boundary can encompass more than one turret.
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
About 45 seconds. These three enlarged panels from Paper 4 supporting Figure S1 show the broader precipitation system and connect the two observational papers: the storm and the selected cell are the same. Color is ECCC equivalent reflectivity in dBZ, not cloud-top reflectivity or the perturbation field from the previous slide. Small black dots are the DOW6-derived CTGC centroids from both sets, not separate color-coded set labels. The red marker follows the selected Set 1 cell northeast, and the red box is the moving 40-by-40-kilometer domain used later in Paper 4. The dashed circle marks DOW6's 75-kilometer range. Do not interpret every strong low-level echo as precipitation from this cell.

The two groups began before this displayed sequence: Set 1 near 02:18 UTC west of DOW6, moving northeast; Set 2 near 02:48 UTC to the southwest, moving east. Those onset times come from Paper 3, not from these later S1 panels. Focus on Set 1 because its complete population sequence was observed; Set 2's dissipation was not fully captured. This is radar storm context, not a thermodynamic diagnosis or proof of wave-driven forcing. The soundings and RHI sequence next provide the vertical and environmental context. Paper 4 is submitted to GRL, not published.
-->

---
class: population-environment
clicks: 2
---

# Vertical evolution and environmental conditions

<div class="population-environment-lead">
  <p v-click.hide="1" class="population-lead">DOW6 RHI observations show the evolution of the 5.5–8 km MSL generating layer.</p>
  <p v-click="[1,2]" class="population-lead"><strong>Sorel · 02:00 UTC</strong> · Gray shading marks the 5.5–8 km MSL generating layer.</p>
  <p v-click="2" class="population-lead"><strong>Sorel · 04:15 UTC</strong> · Gray shading marks the same 5.5–8 km MSL layer.</p>
</div>

<div class="population-environment-figure">
  <div v-click.hide="1" class="population-rhi-grid">
    <figure><figcaption>02:22 · deep stratiform echo</figcaption><img src="../figures/population-rhi-0222.png" alt="Paper 3 Figure 6(a), NW-focused RHI crop at 02:22 UTC: a deep stratiform echo extends to approximately 7 km" /></figure>
    <figure><figcaption>02:40 · distinct cloud-top turrets</figcaption><img src="../figures/population-rhi-0240.png" alt="Paper 3 Figure 6(b), NW-focused RHI crop at 02:40 UTC: numerous narrow generating-cell turrets appear near cloud top" /></figure>
    <figure><figcaption>03:04 · fewer, larger features</figcaption><img src="../figures/population-rhi-0304.png" alt="Paper 3 Figure 6(c), NW-focused RHI crop at 03:04 UTC: fewer and larger cloud-top reflectivity features" /></figure>
    <figure><figcaption>03:34 · increasing echo separation</figcaption><img src="../figures/population-rhi-0334.png" alt="Paper 3 Figure 6(d), NW-focused RHI crop at 03:34 UTC: the generating layer is increasingly separated from the echo below" /></figure>
    <svg class="population-rhi-scale" viewBox="0 0 64 300" role="img" aria-label="DOW6 reflectivity scale, −10 to 40 dBZ">
      <defs><clipPath id="population-rhi-scale-clip"><rect x="4" y="27" width="14" height="253" /></clipPath></defs>
      <image href="../figures/population-rhi-scale.png" x="1" y="22.6" width="71.5" height="266" preserveAspectRatio="none" clip-path="url(#population-rhi-scale-clip)" />
      <text x="32" y="15" class="population-scale-unit">dBZ</text>
      <g v-for="(value, index) in [40, 30, 20, 10, 0, -10]" :key="value">
        <line x1="18" x2="23" :y1="27 + index * 50.6" :y2="27 + index * 50.6" />
        <text x="28" :y="27 + index * 50.6">{{ value }}</text>
      </g>
    </svg>
  </div>
  <figure v-click="[1,2]" class="population-sounding-row" data-sounding="0200">
    <div class="population-sounding-plot">
      <img src="../figures/population-sounding-0200.png" alt="Paper 3 Figure 9(a–d), complete 02:00 UTC Sorel sounding row: temperature, dewpoint and ice-equivalent potential temperature; specific humidity; total wind speed and u/v components; and the vertical gradient of ice-equivalent potential temperature. Original axes, legends and gray 5.5–8 km generating-layer shading are retained." />
      <svg viewBox="0 0 2453 886" aria-hidden="true">
        <rect x="731" y="222" width="142" height="175" />
        <path d="M1796 222 H1816 V397 H1796" />
        <rect x="1974" y="222" width="62" height="175" />
      </svg>
    </div>
    <figcaption class="population-sounding-annotations">
      <div class="population-sounding-layer"><strong><span aria-hidden="true"></span>CTGC layer</strong><p>5.5–8 km MSL</p></div>
      <div><strong>Moisture</strong><p>Initial layer humidity</p></div>
      <div><strong>Bulk vector shear</strong><p class="population-sounding-value">≈18 m s<sup>−1</sup></p></div>
      <div><strong>Stability</strong><p>Near-neutral / weakly stable<br />Shallow negative at cloud top</p></div>
    </figcaption>
  </figure>
  <figure v-click="2" class="population-sounding-row" data-sounding="0415">
    <div class="population-sounding-plot">
      <img src="../figures/population-sounding-0415.png" alt="Paper 3 Figure 9(e–h), complete 04:15 UTC Sorel sounding row with the same temperature, humidity, wind and stability panels and axes: specific humidity is lower in the generating layer, bulk vector wind shear is approximately 9 meters per second, and the profile is more uniformly stable." />
      <svg viewBox="0 0 2453 886" aria-hidden="true">
        <rect x="731" y="222" width="142" height="175" />
        <path d="M1796 222 H1816 V397 H1796" />
        <rect x="1974" y="222" width="62" height="175" />
      </svg>
    </div>
    <figcaption class="population-sounding-annotations">
      <div class="population-sounding-layer"><strong><span aria-hidden="true"></span>CTGC layer</strong><p>5.5–8 km MSL</p></div>
      <div><strong>Moisture</strong><p>Drier than at 02:00</p></div>
      <div><strong>Bulk vector shear</strong><p class="population-sounding-value">≈9 m s<sup>−1</sup> · weaker</p></div>
      <div><strong>Stability</strong><p>More uniformly stable</p></div>
    </figcaption>
  </figure>
</div>

<div class="population-environment-message">
  <p v-click.hide="1"><strong>Cloud-top features become fewer and larger,</strong> with increasing separation from the underlying stratiform echo.</p>
  <p v-click="1" class="population-sounding-source">Paper Figure 9(a–h) · Sorel, 23 February 2022. Soundings bracket the event; these are accompanying conditions, not demonstrated causes.</p>
</div>

<!--
About 85–90 seconds, two clicks. Begin with the northwest portions of the four DOW6 RHI scans in Paper 3 Figure 6. These are fixed-azimuth cuts at 316 degrees, not a Lagrangian vertical sequence of the red selected cell. At 02:22 the stratiform echo is deep, with cloud top near 7 km. By 02:40 there are many distinct cloud-top turrets. At 03:04 the visible generating features are fewer and larger. By 03:34 the generating-layer echo is increasingly separated from the stratiform echo below. This apparent decoupling is consistent with drying, but reflectivity alone does not measure humidity. The cross-shear viewing direction emphasizes turret spacing and does not capture the complete along-shear fall streak. Negative ranges point northwest from DOW6; the shared color scale is equivalent reflectivity in dBZ.

[click] Show the complete 02:00 UTC Sorel sounding row, Paper 3 Figure 9(a–d), across the slide. Retain all four original panels, their axes and legends: temperature/dewpoint and ice-equivalent potential temperature; specific humidity; total wind speed and u/v components; and the vertical gradient of ice-equivalent potential temperature. Gray shading identifies the 5.5–8 km MSL generating layer. The gold outlines focus attention on humidity and the near-zero stability-gradient region; the wind bracket marks the same height interval, not a difference in wind speed. Within this layer, the bulk vector shear is approximately 18 meters per second. The stability profile is generally near-neutral to weakly stable, with only a shallow weakly-negative gradient near cloud top. Mention this limited exception rather than claiming broad instability or a uniquely established initiation mechanism. The first humidity profile provides the reference for the next sounding; avoid an unrelated tour of the low-level warm nose.

[click] Crossfade to the complete 04:15 UTC row, Figure 9(e–h), with all panels aligned in the same positions. These are two measured profiles, not a morph or a continuous thermodynamic time series. Specific humidity is lower within the generating layer, not uniformly throughout the column. Its bulk vector wind shear is now approximately 9 meters per second, compared with approximately 18 at 02:00; do not describe this as halving the wind speed or derive the vector difference from the purple total-speed curve alone. The profile is more uniformly stable, despite small noisy gradient excursions near zero. Paper 3's VAD analysis, retained in the full backup Figure 9, gives intermediate kinematic context and shows shear relaxation during the organization period. The two soundings bracket the event rather than resolve its short-term thermodynamic evolution, and their spatial separation from the cells limits causal interpretation. These are accompanying conditions, not demonstrated causes; do not diagnose a unique radiative, shear, or wave initiation mechanism. Next watch the complete detected evolution, then quantify the horizontal population changes.
-->

---
class: population-video
---

# Horizontal evolution

<p class="population-lead">The complete detected evolution: both CTGC sets emerge, intensify, and dissipate.</p>

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
About 40 seconds. This looping animation from COMPSII slide 26 shows the full-domain detected reflectivity anomaly evolving through the observed population sequence: anomalies emerge, intensify into coherent features, and dissipate. Both spatiotemporal groups from the previous storm-context slide are visible here: the earlier Set 1 and the later Set 2. This is the same detection field quantified next: the maps show where the count and area time series come from, and the color scale is anomaly in dB, not equivalent reflectivity in dBZ. Do not attribute individual low-level echoes to the selected cell. The still maps and time series next quantify what this animation shows qualitatively.
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

<div class="population-trends-message">
  <p v-click.hide="1"><strong>Small boundaries become larger contiguous clusters.</strong> A large boundary can contain several cells.</p>
  <p v-click="1"><strong>Count peaks early.</strong> During maturity, count falls while mean contiguous area rises; later the count and coverage decline.</p>
</div>

<div class="population-trends-source fine">
  <p v-click.hide="1">Paper Figure 12(a, c), 42 minutes apart. Color = contour area in km² (right); insets show Set 1 blue and Set 2 red centroids.</p>
  <p v-click="1">Paper Figure 13(a), Set 1: red = count; blue = mean boundary area; green dashed = area mode; gray = 10th–90th percentile.</p>
</div>

<!--
About 1 minute. The two Figure 12 maps show initiation at 02:30 and mid-maturity at 03:12, 42 minutes apart. The black star marks DOW6; the scale at right gives the contour-area classes in square kilometers, with warmer colors indicating larger contiguous areas. Many small, separate enhancements become fewer, larger patches, some tens of square kilometers. The insets classify centroids into Set 1 (blue) and Set 2 (red); focus on the northern/earlier Set 1. Contiguous complexes up to approximately 60 km² do not mean an isolated 1–2 km turret grew to 60 km². A contour can connect multiple adjacent cells, so the maps show population organization and merging, with sensitivity to segmentation.

[click] Figure 13(a), cropped to Set 1, quantifies this evolution. The red curve is detected feature count and the blue curve is mean contour area; the dashed green is the area mode and gray shading the 10th–90th percentile. Set 1 begins near 02:18 UTC; count rises sharply around 02:30–02:36, then declines during the mature stage while mean area grows, consistent with merging or clustering. During dissipation from roughly 03:24 to 04:00 the count and total coverage fall, although the mean area of surviving features does not necessarily decline monotonically because smaller features disappear. The stages are defined mainly from the count/area evolution. The chapter text and table place the first transition near 02:30, while the plotted dashed divider appears closer to 02:36; avoid presenting its minute as exact. Dissipation begins near 03:24. The chart's last plotted label is 03:54, while the study period extends to 04:00. This is about 1.7 hours of collective activity, not a mean individual-cell lifetime. Polarimetry next adds the microphysical dimension.
-->

---
class: population-trends
---

# Set 1: polarimetric evolution

<p class="population-lead">Mean differential reflectivity falls early, then rises through maturity and dissipation.</p>

<div class="population-trends-figure">
  <img src="../figures/population-zdr.png" alt="Paper Figure 13(c): Set 1 mean differential reflectivity decreases during initiation and then rises through mature and dissipation stages" />
</div>

<div class="population-trends-message">
  <p><strong>Mean Z<sub>DR</sub> falls, then rises.</strong></p>
</div>

<div class="population-trends-source fine">
  <p>Paper Figure 13(c), Set 1, 02:18–03:54 UTC: blue = mean Z<sub>DR</sub>; green dashed = mode; gray = 10th–90th percentile. Particle habits are inferred.</p>
</div>

<!--
About 25 seconds. Figure 13(c) shows the mean and mode of differential reflectivity Z_DR with its 10th–90th percentile envelope. Mean Z_DR decreases early, then rises significantly through the mature and dissipation stages, passing about 1 dB late in the record. Pause on this observed trend before explaining the proposed microphysical mechanism. Introduce differential reflectivity on the next slide for audience members unfamiliar with the variable; its final two clicks return to this same curve. The population mean remains positive: the near-zero and negative examples next are teaching references, not values reached by this mean curve.
-->

---
class: population-identification population-zdr
---

# Differential reflectivity

<div class="ctgc-stages" aria-label="Animation stages">
  <span v-for="(label, index) in zdrStages" :key="label" :class="{ active: zdrStep === index }">{{ label }}</span>
</div>

<div class="ctgc-body" :data-step="zdrStep">
  <div class="ctgc-visual">
    <div class="ctgc-canvas" role="img" aria-label="Five-click differential-reflectivity illustration: horizontal and vertical returns, positive, near-zero, and negative reference cases, then aggregation and preferential sedimentation connected to the observed Set 1 evolution.">
      <CuManim :steps="5" :width="1000" :height="310" :construct="zdrInterpretation" />
      <svg v-if="zdrStep === 0" class="ctgc-first-frame" viewBox="0 0 1000 580" aria-hidden="true">
        <path v-for="(item, i) in zdrPreview" :key="i" :d="item.d" :fill="item.color" :fill-opacity="item.fill" :stroke="item.color" :stroke-opacity="item.stroke" :stroke-width="item.width" />
      </svg>
      <svg class="zdr-labels" viewBox="0 0 1000 580" aria-hidden="true">
        <g v-if="zdrStep <= 3">
          <text x="93" y="166">Radar</text>
          <text x="218" y="170" class="zdr-vertical">V</text>
          <text x="218" y="325" class="zdr-horizontal">H</text>
          <text x="430" y="68">Particle viewed along beam</text>
          <text x="560" y="445" class="zdr-horizontal">Horizontal</text>
          <text x="290" y="96" class="zdr-vertical">Vertical</text>
          <text x="795" y="136">Relative reflectivity</text>
          <text x="635" y="240" class="zdr-horizontal">H</text>
          <text x="635" y="340" class="zdr-vertical">V</text>
          <text x="795" y="425" class="zdr-comparison">{{ ['Compare H and V', 'H > V', 'H ≈ V', 'H < V'][zdrStep] }}</text>
          <text x="795" y="465" class="zdr-comparison">{{ ['', 'ZDR > 0 dB', 'ZDR ≈ 0 dB', 'ZDR < 0 dB'][zdrStep] }}</text>
          <text x="500" y="538" class="zdr-muted">{{ ['Two polarizations · the same radar sample', 'Idealized horizontally oriented plate', 'Idealized spherical particle', 'Idealized vertically elongated particle'][zdrStep] }}</text>
        </g>
        <g v-else>
          <text x="500" y="48">Generating layer · 5.5–8 km MSL</text>
          <text x="500" :y="zdrStep === 4 ? 475 : 83" class="zdr-gold">{{ zdrStep === 4 ? 'Aggregation: more isotropic particles' : 'Larger aggregates fall out faster' }}</text>
          <text x="165" y="553" text-anchor="start" class="zdr-crystal">Oriented crystals</text>
          <text x="603" y="553" text-anchor="start" class="zdr-gold">Aggregates</text>
        </g>
      </svg>
    </div>
    <p class="ctgc-view-caption">{{ zdrStep <= 3 ? 'Independent reference cases · idealized near-horizontal beam' : 'Conceptual particle sequence · sizes and fall speeds are schematic' }}</p>
  </div>
  <div class="ctgc-explanation">
    <div class="ctgc-equation">

$$Z_{\mathrm{DR}} = 10\log_{10}\!\left(\frac{z_{\mathrm{H}}}{z_{\mathrm{V}}}\right)\;\mathrm{dB}$$

</div>
    <p class="ctgc-secondary zdr-definition">z<sub>H</sub> and z<sub>V</sub> are linear reflectivities for horizontal and vertical polarization.</p>
    <div v-if="zdrStep === 0">
      <h2>Compare two polarizations</h2>
      <p>Radar compares the horizontal and vertical returns from the <strong>same sample</strong>.</p>
      <p class="ctgc-secondary">Their ratio depends on particle shape, orientation, density, and the mixture of particles.</p>
    </div>
    <div v-else-if="zdrStep === 1">
      <h2>Positive Z<sub>DR</sub></h2>
      <p><strong>Horizontal return is stronger.</strong></p>
      <p>Horizontally oriented plates can produce this signature.</p>
      <p class="ctgc-secondary">The shape and bars illustrate the comparison; they do not assign an exact dB value.</p>
    </div>
    <div v-else-if="zdrStep === 2">
      <h2>Z<sub>DR</sub> near zero</h2>
      <p><strong>Horizontal and vertical returns are approximately equal.</strong></p>
      <p>Zero does not mean no particles or no echo.</p>
      <p class="ctgc-secondary">Spheres are one example, not a unique explanation: orientations and particle mixtures also matter.</p>
    </div>
    <div v-else-if="zdrStep === 3">
      <h2>Negative Z<sub>DR</sub></h2>
      <p><strong>Vertical return is stronger.</strong></p>
      <p>A vertically elongated particle can produce this signature.</p>
      <p class="ctgc-secondary">This is a reference case, not a negative population mean observed in this study.</p>
    </div>
    <div v-else-if="zdrStep === 4">
      <h2>Early decrease in Set 1</h2>
      <p>Consistent with aggregation increasing the contribution from <strong>more isotropic particles</strong>.</p>
      <p class="ctgc-secondary">Aggregation is illustrated; riming can also reduce particle anisotropy. Neither is uniquely identified by Z<sub>DR</sub>.</p>
    </div>
    <div v-else>
      <h2>Later increase in Set 1</h2>
      <p>The later increase is consistent with differential sedimentation and particle sorting in the cloud-top layer.</p>
      <p class="ctgc-secondary">Aggregates fall out faster; oriented crystals contribute relatively more aloft.</p>
    </div>
    <figure v-if="zdrStep >= 4" class="zdr-observed">
      <div class="zdr-observed-frame">
        <img src="../figures/population-zdr.png" alt="The same observed Paper Figure 13(c) from slide 43: Set 1 mean differential reflectivity decreases early and rises later; the highlighted interval connects to the conceptual particle animation." />
        <svg viewBox="0 0 1066 467" aria-hidden="true">
          <rect :x="zdrStep === 4 ? 153 : 365" y="7" :width="zdrStep === 4 ? 212 : 633" height="435" />
        </svg>
      </div>
      <figcaption>Set 1 · {{ zdrStep === 4 ? 'early decrease' : 'later increase' }} · mean &gt; 0</figcaption>
    </figure>
  </div>
</div>

<p class="fine ctgc-source">{{ zdrStep <= 3 ? 'Illustrative scattering signatures, not a particle-identification key; real radar samples contain many particles.' : 'Paper Figure 13(c) and the proposed microphysical evolution · particle habits and mechanisms are inferred, not directly observed.' }}</p>

<script setup>
import { computed } from 'vue'
import { useNav } from '@slidev/client'
import { zdrInterpretation, zdrStages, zdrPreview } from '../scenes/zdr-interpretation'

const { clicks } = useNav()
const zdrStep = computed(() => Math.max(0, Math.min(clicks.value, 5)))
</script>

<!--
About 75–90 seconds, five clicks. Entry: the radar compares horizontal and vertical reflectivity from the same sampled volume. Define Z_DR as ten times the base-ten logarithm of the ratio of linear horizontal to vertical reflectivity. The horizontal and vertical arrows indicate electric-field directions in the plane perpendicular to propagation; the particle is shown as viewed along an idealized near-horizontal beam. Beside the radar, blue H and pink V wave arrows show the polarized transmitted signal in schematic perspective: both propagate toward the particle, while their electric fields oscillate in perpendicular horizontal and vertical planes. The wave glyphs are offset vertically only for legibility, not separate physical beam paths. Both have the same illustrative 3D amplitude; H looks flatter because its horizontal plane is foreshortened. Their amplitudes do not change with particle shape or explain differences in returned reflectivity. Wave crests advance briefly during the existing first three clicks and disappear with the radar on click four. The bars are qualitative relative linear reflectivity, not calculated scattering cross-sections or measured values. These first three cases are independent illustrations, not a time sequence of one observed crystal changing shape.

[click] Positive Z_DR: the horizontal return is stronger. A horizontally oriented plate is an idealized example relevant to ice clouds. Real values depend on shape, orientation, density, wavelength, and the particle mixture; do not identify a particular crystal habit from Z_DR alone.

[click] Near-zero Z_DR: the horizontal and vertical returns are approximately equal. A sphere provides the simplest illustration, but less anisotropic particles, broad orientation distributions, or mixtures can also produce a small net difference. Zero is not no particles, no echo, or zero reflectivity. Aggregates and rimed crystals need not be spherical or have exactly zero Z_DR.

[click] Negative Z_DR: the vertical return is stronger, illustrated by a vertically elongated particle. Spend only about five seconds here. This explains the sign convention; it is not a negative population mean in our observations. Beam elevation and propagation/calibration effects can also influence actual radar measurements.

[click] Return explicitly to the same observed Figure 13(c) from the previous slide, with its early-decrease interval highlighted. The population mean remains positive; the teaching examples do not imply it reaches zero. The conceptual animation shows oriented crystals joining into larger, more isotropic aggregates. This is consistent with the paper's early aggregation interpretation; riming can also reduce anisotropy but is not separately animated or uniquely established. Shapes, counts, and sizes are schematic, and the radar ratio is reflectivity-weighted rather than a simple particle-number average. Reflectivity is relatively stable after initiation and rho_HV stays high; these additional plots remain in the full Figure 13. Do not call the contour-size increase growth of every individual cell.

[click] Highlight the subsequent overall rise through maturity and dissipation. The interpretation is that larger, more isotropic particles sediment out, leaving a relatively greater contribution from slower-falling oriented crystals aloft. Keep the oriented crystals visibly distinct while the aggregates cross the lower boundary of the 5.5–8 km MSL generating layer: aggregates do not transform back into pristine crystals. Polarimetry supports this inference but does not directly identify particle habit. The animation shows the proposed differential sedimentation and sorting, not measured particle trajectories, a unique mechanism, or an exact scattering calculation. Continue to the one selected cell tracked through this sequence; its Z_DR evolution shows the same population trend in a single example, which then supports the conceptual population-life-cycle figure.
-->

---
class: population-cell
clicks: 1
---

# One selected cell persisted for nearly 50 minutes

<div class="population-cell-body">
<div class="population-cell-text">
  <p class="population-lead">Manually tracked Set 1 cell · nine times · 02:55–03:43 UTC</p>
  <section><strong>Nearly 50 minutes</strong><p>The dashed circle follows the same feature from 02:55 to 03:43 UTC.</p></section>
  <section><strong>Peak near 03:25</strong><p>Strongest and largest near mid-track (maximum contour area about 45 km²), then weaker.</p></section>
  <section><strong>Sampling the moving cell</strong><p>PPI elevation changes between panels (6.9°, 11.6°) keep the cell in view; gray dashed arcs mark altitude.</p></section>
  <section><strong>Matching Z<sub>DR</sub> behavior</strong><p>Z<sub>DR</sub> falls to near zero during maturity, then exceeds 2 dB late in the track, consistent with the population trend.</p></section>
</div>

<div class="population-cell-full population-swap">
  <img v-click.hide="1" src="../figures/population-cell-full-z.png" alt="Paper Figure 17: the complete nine-panel reflectivity PPI sequence of the tracked cell from 02:55 to 03:43 UTC, with the dashed circle marking the cell in each panel" />
  <img v-click="1" src="../figures/population-cell-full-zdr.png" alt="Paper Figure 18: the complete nine-panel differential reflectivity PPI sequence for the same cell and times, with the dashed circle marking the cell in each panel" />
</div>
</div>

<!--
About 60 seconds, one click. Show the complete reflectivity sequence first: the dashed circle follows one selected Set 1 feature from 02:55 to 03:43 UTC, nearly 50 minutes, sampled at nine times. The middle panels near 03:25 show a stronger and larger signature (the paper estimates a maximum contour area of roughly 45 km²), then the signature weakens. The elevation angle printed above each panel changes to continue sampling the moving cell; the gray dashed arcs indicate altitude. Click once to swap to the full Z_DR sequence for the same cell and times: Z_DR decreases to near zero during maturity and exceeds 2 dB late in the track, consistent with the population trend but subject to the same interpretive caveats. This is a manually followed, long-lived example, not evidence that typical cells live 50 minutes. The track is also the starting point for the cell-relative three-dimensional analysis in Paper 4. Continue to the conceptual population-life-cycle figure, where this individual case supports the population synthesis.
-->

---
class: figure-slide population-schematic
---

# A conceptual population life cycle

<div class="fig">
  <img src="../figures/population-lifecycle-full.png" alt="Paper Figure 19: conceptual CTGC lifecycle across initiation, mature, and dissipation stages, showing simplified vertical cross-sections above and horizontal boundary evolution below, with legend defining pristine crystals, isotropic aggregates or rimed crystals, and 5-dBZ perturbation CTGC boundaries" />
</div>

<!--
About 40 seconds. This is the complete Paper Figure 19 schematic, synthesizing the observed boundary evolution and inferred microphysics across initiation, mature, and dissipation stages. Read the bottom row first: many small boundaries, then merging into contiguous features, then fewer detected boundaries. This part summarizes the count, area, and maps just shown. The top row is a conceptual interpretation, not a camera view of crystal habits: less organized particles initially; a mature core of more isotropic aggregates or rimed crystals and a surrounding shroud of oriented pristine crystals; then preferential fallout of larger particles, consistent with higher Z_DR remaining in the generating layer. The bottom legend defines the pristine crystal, aggregate/rimed crystal, and the 5-dBZ perturbation CTGC boundary. The selected cell just shown grounds this synthesis in one tracked example. Do not say every cell displayed this exact geometry or that direct in situ particles were measured here. Candidate influences discussed in the paper include shear-related organization and decreasing moisture, but the observations do not isolate the forcing mechanism. This closes the population results; the limitations follow.
-->

---
class: smoothing-conclusions
---

# Project 3: Limits

<div class="smoothing-conclusion-list">
  <section><p>The 5-dB threshold and X-band sensitivity can miss weak or small cells.</p></section>
  <section><p>Contiguous contours may join several turrets; six-minute scans miss rapid changes.</p></section>
  <section><p>One storm and radar polarimetry constrain, but do not prove, particle or forcing mechanisms.</p></section>
</div>

<!--
About 35 seconds. The threshold was chosen to balance noise and coherent detections, not to include every weak cloud-top feature. X-band sensitivity and the smoothing/size screen favor stronger cells; the detected boundaries are not necessarily individual updrafts. Connected regions may merge several turrets, so an increase in contour area is not exclusively physical growth of one cell. Six-minute sampling can miss short-lived cells and fast splitting/merging; stage boundaries are approximate. The observed Z_DR evolution is a polarimetric signature consistent with sorting, not a particle-habit measurement or proof of causality. The two soundings and wind context do not establish a unique radiative, shear, or wave mechanism. Uncorrected X-band differential attenuation can lower absolute Z_DR; the paper's conservative bound argues it cannot create the late higher Z_DR. These results describe one winter storm and require other cases to test generality.
-->

---
class: smoothing-conclusions population-conclusions conclusions-bullets
---

# Project 3: Conclusions

- Set 1 showed an approximately 1.7-hour population sequence: initiation, maturity, dissipation.
- Counts fell as mean boundary area rose during maturity: adjacent features clustered.
- Mean Z<sub>DR</sub> fell early, then rose, consistent with later particle sedimentation and sorting.

<p class="population-handoff">A selected cell track connects this population analysis to the three-dimensional fall-streak study.</p>

<!--
About 35 seconds. Suggested delivery: “In this one storm, the earlier cell group was visible for about 1.7 hours. It began as many small detected features; the count then fell while contiguous boundaries grew as the population organized, before activity declined. Differential reflectivity decreased early and increased later, consistent with particle sorting aloft, though radar does not directly reveal habits.” Keep population duration distinct from individual-cell lifetime, and the 5-dB radar boundaries distinct from one-to-one physical updrafts. The selected, nearly 50-minute track provides the moving reference for Paper 4. This paper is published in JAS (2026); the next one is submitted to GRL, not yet accepted. Do not say Papers 1 and 2 directly generated the Paper 3 identification; Paper 4 integrates their methods with this track.
-->
