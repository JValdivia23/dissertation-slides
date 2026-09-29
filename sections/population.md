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
          <g v-if="clicks >= 4" class="ctgc-ring-profile">
            <line x1="520" y1="252" x2="698" y2="252" class="ctgc-link-arrow" marker-end="url(#ctgc-arrow-head)" />
            <path d="M715 165 V338 H955" />
            <path :d="`M715 ${clicks === 5 ? ctgcRingProfile.zeroY : ctgcRingProfile.meanY} H955`" class="ctgc-mean-line" />
            <polyline :points="clicks === 5 ? ctgcRingProfile.perturbation : ctgcRingProfile.maximum" />
            <text x="704" y="188" text-anchor="end">{{ clicks === 5 ? '12' : '18' }}</text>
            <text x="704" y="340" text-anchor="end">{{ clicks === 5 ? '−4' : '0' }}</text>
            <text x="715" y="365">0°</text><text x="955" y="365">360°</text>
            <text x="835" y="397">Azimuth</text>
            <text x="835" y="435" class="ctgc-gold">{{ clicks === 5 ? 'Reference becomes zero' : `Azimuthal mean = ${ctgcData.focus.mean.toFixed(1)} dBZ` }}</text>
          </g>
          <g v-else>
            <text x="830" y="270">One value per (r, θ)</text>
            <text x="830" y="307">Horizontal CTGC footprint</text>
            <text x="830" y="399" class="ctgc-muted">Gray: no in-layer samples</text>
          </g>
          <rect x="715" y="466" width="240" height="16" fill="url(#ctgc-field-scale)" />
          <text x="715" y="512">{{ clicks === 5 ? '−4' : '0' }}</text>
          <text x="835" y="512">{{ clicks === 5 ? '4' : '9' }}</text>
          <text x="955" y="512">{{ clicks === 5 ? '12 dB' : '18 dBZ' }}</text>
        </g>
      </svg>
      <div v-if="clicks >= 6" class="ctgc-observed">
        <img src="../figures/population-contours-final.png" alt="Observed example at 03:18 UTC: Paper Figure 5(e), final closed CTGC boundaries after Gaussian smoothing, 5-dB contouring, and screening" />
      </div>
    </div>
    <p class="ctgc-view-caption">{{ clicks >= 6 ? 'Observed example · 03:18 UTC · Paper Figure 5(e)' : clicks <= 2 ? 'Schematic · one azimuth · vertical scale exaggerated' : 'Schematic · same volume reduced to a horizontal field' }}</p>
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

<p class="fine ctgc-source">{{ clicks >= 6 ? 'Paper Figure 5(e): Gaussian smoothing and area screening (≥0.09 km²) yield coherent closed cell boundaries.' : 'Illustrative reflectivity field · maxima and azimuthal means computed from the example.' }}</p>

<script setup>
import { useNav } from '@slidev/client'
import { ctgcIdentification, ctgcStages, ctgcPreview, ctgcLabels, ctgcData, ctgcColors, ctgcRingProfile } from '../scenes/ctgc-identification'

const { clicks } = useNav()
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
class: population-bands
---

# Two spatiotemporal groups in one storm

<div class="population-bands-body">
  <img src="../figures/precip-bands.png" alt="Paper Figure 10: four ECCC low-level reflectivity snapshots with the paths of the earlier Set 1 and later Set 2 annotated" />
  <div class="population-bands-points">
    <section><h2>Set 1 · earlier</h2><p>First detected near 02:18 UTC west of DOW6; translated northeast.</p></section>
    <section><h2>Set 2 · later</h2><p>First detected near 02:48 UTC southwest of DOW6; translated east.</p></section>
    <p>Focus on Set 1: its full population evolution was observed within the radar domain.</p>
  </div>
</div>

<p class="fine">Paper Figure 10: ECCC reflectivity at 500 m MSL shows the associated precipitation bands. Set membership comes from DOW6 cell centroids, not the ECCC field.</p>

<!--
About 40 seconds. The detected CTGCs were neither spatially uniform nor all simultaneous. Set 1 appeared west of DOW6 near 02:18 UTC and translated northeast; Set 2 appeared later to the southwest near 02:48 UTC and translated east. On the ECCC radar panels, the blue and red annotations mark low-level precipitation bands or boundaries associated with the two groups. This is spatial-temporal context, not evidence that low-level bands caused the cells, nor definitive evidence of waves: the paper's Doppler-velocity diagnostics did not establish a persistent wave signature. Set 2's dissipation was not fully captured. Follow Set 1 for the complete life-cycle discussion. The grouping itself was based on DOW6 cell-centroid locations and tracks; the associated centroid plot is in the paper's appendix.
-->

---
class: population-maps
---

# From small boundaries to contiguous clusters

<p class="population-lead">Set 1: two snapshots of the same event, 42 minutes apart.</p>

<div class="population-map-pair">
  <figure><img src="../figures/population-map-initiation.png" alt="Paper Figure 12(a), 02:30 UTC: many small CTGC boundaries, mostly blue or cyan area classes, west of DOW6" /><figcaption>02:30 · many small features</figcaption></figure>
  <span aria-hidden="true">→</span>
  <figure><img src="../figures/population-map-mature.png" alt="Paper Figure 12(c), 03:12 UTC: fewer, larger contiguous CTGC boundaries, including red and orange area classes" /><figcaption>03:12 · larger contiguous features</figcaption></figure>
</div>

<p class="fine">Paper Figure 12(a, c). Color indicates contour area (warmer = larger); insets show Set 1 blue and Set 2 red centroids. A large boundary can contain several cells.</p>

<!--
About 45 seconds. These are the initiation snapshot at 02:30 and a mid-mature snapshot at 03:12, both from Figure 12. The black star marks DOW6; warmer colors indicate larger contiguous contour areas. At first there are many small, separate enhancements west of the radar. Later there are fewer, larger patches, some tens of square kilometers. The insets classify centroids into Set 1 (blue) and Set 2 (red); focus on the northern/earlier Set 1. The paper reports contiguous complexes up to about 60 km², but that does not mean one isolated 1–2 km turret grew to 60 km². A contour can connect multiple adjacent cells, so this is evidence of population organization and merging, plus sensitivity to segmentation. The time series next quantifies the count and area changes.
-->

---
class: population-trends
---

# Set 1: structure and polarimetric evolution

<p class="population-lead">The approximately 1.7-hour observed population is divided into initiation, mature, and dissipation stages.</p>

<div class="population-trends-figure">
  <img v-click.hide="1" src="../figures/population-count-area.png" alt="Paper Figure 13(a): Set 1 CTGC count peaks near 02:30 UTC, while mean contour area grows into the mature stage, then the number declines" />
  <img v-click="1" src="../figures/population-zdr.png" alt="Paper Figure 13(c): Set 1 mean differential reflectivity decreases during initiation and then rises through mature and dissipation stages" />
</div>

<div class="population-trends-message">
  <p v-click.hide="1"><strong>Count peaks early.</strong> During maturity, count falls while mean contiguous area rises; later the count and coverage decline.</p>
  <p v-click="1"><strong>Mean Z<sub>DR</sub> falls, then rises.</strong> The later increase is consistent with differential sedimentation and particle sorting in the cloud-top layer.</p>
</div>

<div class="population-trends-source fine">
  <p v-click.hide="1">Paper Figure 13(a), Set 1: red = count; blue = mean boundary area; green dashed = area mode; gray = 10th–90th percentile.</p>
  <p v-click="1">Paper Figure 13(c), Set 1, 02:18–03:54 UTC: blue = mean Z<sub>DR</sub>; green dashed = mode; gray = 10th–90th percentile. Particle habits are inferred.</p>
</div>

<!--
About 1 minute 15 seconds. Begin with Figure 13(a), cropped to Set 1. The red curve is detected feature count and the blue curve is mean contour area; the dashed green is the area mode and gray shading the 10th–90th percentile. Set 1 begins near 02:18 UTC; count rises sharply around 02:30–02:36, then declines during the mature stage while mean area grows, consistent with merging or clustering. During dissipation from roughly 03:24 to 04:00 the count and total coverage fall, although the mean area of surviving features does not necessarily decline monotonically because smaller features disappear. The stages are defined mainly from the count/area evolution. The chapter text and table place the first transition near 02:30, while the plotted dashed divider appears closer to 02:36; avoid presenting its minute as exact. Dissipation begins near 03:24. The chart's last plotted label is 03:54, while the study period extends to 04:00. This is about 1.7 hours of collective activity, not a mean individual-cell lifetime.

Click 1: Figure 13(c), now the mean and mode of differential reflectivity Z_DR with its 10th–90th percentile envelope. Mean Z_DR decreases early, then rises significantly through the mature and dissipation stages, passing about 1 dB late in the record. The interpretation is that larger, more isotropic particles sediment out, leaving a relatively greater contribution from slower-falling oriented crystals aloft. Polarimetry supports this inference but does not directly identify particle habit. Reflectivity is relatively stable after initiation and rho_HV stays high; these additional plots remain in the full Figure 13. Do not call the contour-size increase growth of every individual cell. Move to the explicitly conceptual synthesis.
-->

---
class: figure-slide population-schematic
---

# A conceptual population life cycle

<div class="fig">
  <img src="../figures/population-lifecycle-core.png" alt="Cropped core of Paper Figure 19: the conceptual three-stage life cycle, with observed boundary organization below and inferred particle evolution above" />
</div>

<p class="fine">Paper Figure 19, cropped. Bottom: observed boundary evolution. Top: microphysical interpretation from radar signatures, not direct particle imagery.</p>

<!--
About 40 seconds. Read the bottom row first: many small boundaries, then merging into contiguous features, then fewer detected boundaries. This part summarizes the count, area, and maps just shown. The top row is a conceptual interpretation, not a camera view of crystal habits: less organized particles initially; a mature core of more isotropic aggregates or rimed crystals and a surrounding shroud of oriented pristine crystals; then preferential fallout of larger particles, consistent with higher Z_DR remaining in the generating layer. Do not say every cell displayed this exact geometry or that direct in situ particles were measured here. Candidate influences discussed in the paper include shear-related organization and decreasing moisture, but the observations do not isolate the forcing mechanism. One unusually persistent cell lets us connect the population view to the next paper.
-->

---
class: population-cell
---

# One selected cell persisted for nearly 50 minutes

<p class="population-lead">Three of nine reflectivity snapshots from a manually tracked Set 1 cell.</p>

<div class="population-cell-sequence">
  <figure><img src="../figures/population-cell-0255.png" alt="Paper Figure 17(a), 02:55 UTC: the selected cell appears inside the dashed tracking circle" /><figcaption>02:55 · first observed</figcaption></figure>
  <figure><img src="../figures/population-cell-0325.png" alt="Paper Figure 17(f), 03:25 UTC: the tracked cell has a stronger, larger reflectivity signature" /><figcaption>03:25 · near peak area</figcaption></figure>
  <figure><img src="../figures/population-cell-0343.png" alt="Paper Figure 17(i), 03:43 UTC: the tracked reflectivity signature has weakened" /><figcaption>03:43 · last observed</figcaption></figure>
</div>

<p class="fine">Paper Figure 17(a, f, i), cropped. Dashed circles locate the same cell; PPI elevations are 6.9°, 11.6°, and 6.9°. This selected track is not a population lifetime estimate.</p>

<!--
About 45 seconds. The dashed circle follows one selected Set 1 feature from 02:55 to 03:43 UTC, nearly 50 minutes. These are three of the nine PPI reflectivity panels in Figure 17; the full sequence and the corresponding Z_DR series appear in the paper, with the Z_DR sequence also in backup. The middle panel at 03:25 shows a stronger and larger signature (the paper estimates a maximum contour area of roughly 45 km²), then the signature weakens. The elevation angle printed above each panel changes to continue sampling the moving cell; the gray dashed arcs indicate altitude. This is a manually followed, long-lived example, not evidence that typical cells live 50 minutes. Its Z_DR decreases to near zero during maturity and exceeds 2 dB late in the track, consistent with the population trend but subject to the same interpretive caveats. The track is the starting point for the cell-relative three-dimensional analysis in Paper 4.
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
