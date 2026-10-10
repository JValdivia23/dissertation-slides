---
layout: section
class: paper-title paper4-title
title: Tracking and Quantifying 3D Cloud-Top Generating-Cell Structure and
  Associated Precipitation
---

<div class="paper-title-content">
  <p class="paper-kicker">Paper 4 · CTGC fall streak and precipitation</p>
  <h1>Tracking and Quantifying 3D Cloud-Top Generating-Cell Structure and Associated Precipitation</h1>
  <div class="paper-authors">
    <p><strong>Jairo M. Valdivia-Prado</strong></p>
    <p>Coauthors: Katja Friedrich · Troy Zaremba · Sarah Tessendorf</p>
  </div>
  <p class="paper-affiliation">Department of Atmospheric and Oceanic Sciences · University of Colorado Boulder</p>
  <p class="paper-citation">Submitted to <em>Geophysical Research Letters</em> on 16 September 2026</p>
</div>

<!--
About 20 seconds. This fourth paper is submitted to Geophysical Research Letters, 16 September 2026. It uses the selected Set 1 cell track introduced in Paper 3. Papers 1 and 2 enter this analysis through polar smoothing and the weighted local background. Credit Katja Friedrich, Troy Zaremba, and Sarah Tessendorf. Start with the physical questions of tracking in 3D and precipitation connection.
-->

---
class: paper4-question
---

# Following CTGC precipitation in three dimensions

<div class="paper4-question-body">
  <div class="paper4-question-story">
    <p class="paper4-question-lead">We know CTGC fall streaks extends downward below the generating layer.</p>
    <section><strong>Structure</strong><span>Can we resolve the 3D cell and its fall streak through underlying cloud?</span></section>
    <section><strong>Evolution</strong><span>How does the fall streak interact with pre-existing cloud?</span></section>
    <section><strong>Precipitation</strong><span>Can we quantify the precipitation enhancement due to CTGC?</span></section>
  </div>
  <svg class="paper4-question-diagram" viewBox="0 0 610 380" role="img" aria-label="Conceptual vertical schematic: a cloud-top generating cell, a southwestward fall-streak path through an existing cloud and precipitation layer, a melting layer, and precipitation below; not an observed cross section">
    <rect x="35" y="122" width="540" height="179" rx="55" class="paper4-cloud" />
    <path d="M440 52 C472 28 511 48 515 75 C538 78 549 105 533 119 L389 119 C369 102 382 73 407 73 C413 62 423 55 440 52Z" class="paper4-cell" />
    <path d="M450 115 C423 158 385 181 359 205 S288 258 234 309" class="paper4-streak" />
    <path d="M80 275 H535" class="paper4-melting" />
    <path d="M165 187 L157 207 M205 176 L197 196 M251 213 L243 233 M330 168 L322 188 M490 205 L482 225 M238 312 L230 332 M308 310 L300 330 M420 309 L412 329" class="paper4-precip" />
    <text x="360" y="38">Tracked CTGC</text>
    <text x="56" y="143">Pre-existing cloud / precipitation</text>
    <text x="61" y="265">Melting layer</text>

  </svg>
</div>

<!--
About 35 seconds. The central challenge: particles generated in cloud-top turrets fall into underlying cloud, where they grow through aggregation, vapor deposition, and riming. However, pre-existing precipitation and overlapping neighboring cells make direct attribution challenging. The schematic illustrates the core concept: a tracked CTGC near cloud top, a southwestward fall streak descending through an existing cloud layer, across the melting level, and into the rain layer below.
-->

---
class: paper4-fusion
clicks: 5
---

# 3D tracking methodology

<div class="fusion-stages" aria-label="Methodology animation stages">
  <span v-for="(label, index) in fusionStages" :key="label" :class="{ active: Math.min(clicks, 5) === index }">{{ label }}</span>
</div>

<div class="fusion-body">
  <div class="fusion-visual">
    <div class="fusion-canvas" role="img" aria-label="Five-click methodological schematic: three radar sweeps sample a moving cloud, a box follows the selected cell, radar data are gridded independently, individual weighted backgrounds are subtracted, and anomalies are merged with Gaussian beam-center weights. Illustrative fields, not observed data or exact particle trajectories.">
      <CuManim v-if="fusionActive" :steps="5" :width="1000" :height="310" :construct="constructFusion" />
      <div v-else class="fusion-inactive-frame" aria-hidden="true" />
      <svg v-if="clicks === 0 || !fusionActive" class="fusion-first-frame" viewBox="0 0 1000 580" aria-hidden="true">
        <path v-for="(item, i) in fusionPreview" :key="i" :d="item.d" :fill="item.color" :fill-opacity="item.fill" :stroke="item.color" :stroke-opacity="item.stroke" :stroke-width="item.width" />
      </svg>
      <svg class="fusion-labels" viewBox="0 0 1000 580" aria-hidden="true">
        <defs>
          <linearGradient id="fusion-field-scale">
            <stop v-for="(color, i) in clicks >= 4 ? fusionColors.anomaly : fusionColors.reflectivity" :key="i" :offset="`${clicks >= 4 ? fusionColors.anomalyOffsets[i] : i * 25}%`" :stop-color="color" />
          </linearGradient>
        </defs>
        <g v-if="clicks <= 2">
          <text v-for="(item, i) in fusionLabels.map" :key="i" :x="item.x" :y="item.y" :fill="item.color" :text-anchor="item.anchor">{{ item.text }}</text>
          <g v-if="clicks === 2">
            <text v-for="(item, i) in fusionLabels.frame" :key="i" :x="item.x" :y="item.y" :fill="item.color" :text-anchor="item.anchor">{{ item.text }}</text>
          </g>
          <text v-else x="500" y="535" class="fusion-muted">{{ clicks === 1 ? 'Cloud translates while the three beams sweep together' : 'Selected cell embedded in a moving cloud' }}</text>
        </g>
        <g v-else-if="clicks <= 4">
          <g v-for="(radar, i) in fusionLabels.grids" :key="i">
            <text :x="radar.name.x" :y="radar.name.y" :fill="radar.name.color" class="fusion-label-title">{{ radar.name.text }}</text>
            <text :x="radar.field.x" :y="radar.field.y">{{ clicks === 4 ? radar.anomaly.text : radar.field.text }}</text>
            <text v-if="clicks === 4" :x="radar.background.x" :y="radar.background.y" :fill="radar.background.color">{{ radar.background.text }}</text>
          </g>
          <text v-if="clicks === 3" x="500" y="525" class="fusion-muted">Same voxel coordinates · separate radar fields and coverage</text>
        </g>
        <g v-else>
          <text v-for="(item, i) in fusionLabels.merge" :key="i" :x="item.x" :y="item.y" :fill="item.color" :text-anchor="item.anchor">{{ item.text }}</text>
        </g>
        <g v-if="clicks >= 3" class="fusion-scale">
          <rect x="360" y="545" width="245" height="10" fill="url(#fusion-field-scale)" />
          <text x="340" y="558" text-anchor="end">{{ clicks >= 4 ? '−4' : '0' }}</text>
          <text x="627" y="558" text-anchor="start">{{ clicks >= 4 ? '16 dB' : '45 dBZ' }}</text>
        </g>
      </svg>
    </div>
    <p class="fusion-view-caption">{{ fusionCaptions[Math.min(clicks, 5)] }}</p>
  </div>
  <div class="fusion-explanation">
    <div v-if="clicks === 0">
      <h2>Three complementary views</h2>
      <p><strong>DOW6 · X band</strong><br /><strong>COW · C band</strong><br /><strong>ECCC · S band</strong></p>
      <p>Different sites and viewing angles sample the same moving storm.</p>
      <p class="fusion-secondary">Nine synchronized volume sets, every six minutes.</p>
    </div>
    <div v-else-if="clicks === 1">
      <h2>Synchronized volume scans</h2>
      <p>The three beams start at <strong>0°</strong> and sweep at equal speed in this illustration.</p>
      <p>The cloud moves during sampling.</p>
      <p class="fusion-secondary">The observations synchronize six-minute volumes—not necessarily identical antenna rotations.</p>
    </div>
    <div v-else-if="clicks === 2">
      <h2>Follow the selected cell</h2>
      <p>The Paper 3 centroid track defines the moving origin: <strong>cell at (0, 0)</strong>.</p>
      <p><strong>40 × 40 km</strong> horizontal domain:<br />x, y = −30 to +10 km.</p>
      <p class="fusion-secondary">Altitude: 1–9 km MSL. The box extends farther southwest to retain the downwind region.</p>
    </div>
    <div v-else-if="clicks === 3">
      <h2>Grid each radar independently</h2>
      <p>Polar smoothing → common Cartesian coordinates → gap filling and <strong>500-m 3D smoothing</strong>.</p>
      <p>Grid spacing: <strong>100 m</strong> in x, y, and z.</p>
      <p class="fusion-secondary">These are three separate fields on the same grid, not yet a merged reflectivity volume. Dim tiles mark unsampled voxels.</p>
    </div>
    <div v-else-if="clicks === 4">
      <h2>Subtract each radar's background</h2>
      <p>Calculate a beam-weighted local mean over <strong>40 × 40 × 2 km</strong>.</p>
      <div class="fusion-equation">

$$Z'_r(p)=\widetilde Z_{e,r}(p)-\mu_r(p)$$

</div>
      <p>Localized enhancements remain relative to that radar's own background.</p>
      <p class="fusion-secondary">Gold slabs illustrate the 2-km vertical window; μ values refer to the highlighted voxel.</p>
    </div>
    <div v-else>
      <h2>Merge the anomalies</h2>
      <p><strong>Gaussian beam-center weights:</strong> nearer the beam center → greater weight.</p>
      <div class="fusion-equation">

$$Z'(p)=\frac{\sum_r M_r(p)Z'_r(p)}{\sum_r M_r(p)}$$

</div>
      <p class="fusion-secondary">M = 0 where a radar does not sample the voxel. Merge anomalies, not raw cross-wavelength reflectivity.</p>
      <p class="fusion-result">One 3D enhancement field, in dB.</p>
    </div>
  </div>
</div>

<script setup>
import { useIsSlideActive, useNav } from '@slidev/client'
import { multiRadarFusion, fusionStages, fusionPreview, fusionLabels, fusionColors } from '../scenes/multi-radar-fusion'

const { clicks } = useNav()
// Slidev retains slide components. Mount the scene only while this slide is
// active, so a neighboring slide's clicks cannot start a hidden replay.
const fusionActive = useIsSlideActive()
function constructFusion() { return multiRadarFusion(() => clicks.value) }
const fusionCaptions = [
  'Schematic sites and cloud · not observed radar locations',
  'Schematic antenna synchronization · actual volume cadence: 6 minutes',
  'Moving cell-relative domain · centroid is not at the box center',
  'Illustrative slices of 3D grids · displayed voxels are coarsened',
  'Illustrative fields · weighted backgrounds computed separately',
  'Computed weighted merge of the illustrative anomalies',
]
</script>

<!--
About 75 seconds, five clicks. Chapter 5 Data and Methods. This is a methodological illustration, not the observed volume data. The radar locations, scan angles, beam widths, cloud, and deliberately coarse displayed voxels are schematic. The smooth synthetic fields represent independently gridded/smoothed radar reflectivity; the beam-weighted local backgrounds, individual anomalies, and normalized merge are numerically computed from those illustrative fields. The coarse example truncates and renormalizes background windows at its domain boundaries; it is not an implementation or validation of the papers' DCT operators. Text and equations remain in Slidev/SVG, matching the earlier Manim slides.

Entry: identify the three instruments and wavelength bands. Different views help describe the same moving cell despite incomplete, range-dependent sampling. The paper analyzes nine synchronized volume sets, every six minutes, from 02:54 to 03:42 UTC.

[click] The three beams start at zero-degree azimuth (north) and rotate clockwise together at constant speed while the cloud translates northeast. This equal-speed, common-phase rotation demonstrates synchronized sampling; it is not a claim that the actual antennas used identical azimuth starts, angular speeds, or elevation schedules. The observed synchronization is at the volume level. This plan view stands in for repeated multi-elevation sweeps, not a full reconstruction from one PPI.

[click] Draw the asymmetric 40-by-40-km box and move it with the selected cell. The Paper 3 centroid track supplies the origin, x=y=0; the horizontal bounds are -30 to +10 km, so the cell is not centered in the box. Altitude spans 1–9 km MSL. Retaining more of the southwest region anticipates the expected downwind signature. This is the common analysis domain, not an exclusive particle-source mask.

[click] Map each radar separately into that common frame. The actual pipeline smooths reflectivity in polar coordinates using Paper 1, grids independently, fills gaps, and applies beam-weighted 500-m smoothing in all Cartesian directions. Grid spacing is 100 m in all directions; grid spacing is not the native or effective resolution. The animation shows three horizontal slices at 3, 5, and 7 km to make the 3D grids legible, not three layers replacing the full vertical volume. Dim tiles indicate that a radar does not sample a voxel; they are not zero reflectivity. Preserve each radar's own field and sampling weights through this stage.

[click] Use the Paper 2 weighted-local-statistics framework to calculate each radar's own background. For a voxel, the background is the spatial mean of smoothed dBZ reflectivity with Gaussian beam weights over a 40-by-40-by-2-km boxcar window. The gold slabs show the 6–8-km example around the highlighted (0,0,7 km) voxel; repeat the window at other heights. Subtract the background separately for every radar. Z'_r is a logarithmic reflectivity difference, in dB. Different wavelengths can have different equivalent reflectivity because of scattering and attenuation; do not claim anomaly subtraction makes all wavelength effects vanish.

[click] Use the same radar-beam weights in the normalized weighted average. Weight decreases with distance from the beam center according to a Gaussian, not simply with horizontal distance from the radar. The right-hand inset compares the same voxel relative to each radar's beam center; its M values come from the illustrative fields. No radar coverage means M=0, and a voxel with no contributing radar remains missing. The three independent anomaly grids become one common 3D Z-prime field, not a raw-reflectivity maximum or a wind retrieval. Continue to the observed generating-layer maps and VAD context on the next slide.
-->

---
class: paper4-layer-slide
---

# Generating layer (5.5–9 km) and downwind domain

<div class="paper4-layer-body">
  <figure class="paper4-layer-main">
    <img src="../figures/paper4-layer-9times.png" alt="Chapter 5 / Madison Slide 9: 5.5–9 km layer-maximum reflectivity anomaly maps across nine analysis times (02:54–03:42 UTC); the tracked cell stays at the origin while the domain extends southwestward into the downwind fall-streak region" />

  </figure>
  <div class="paper4-layer-side">
    <figure class="paper4-panel-i-figure">
      <img src="../figures/paper4-vad-polar.png" alt="Polar plot of VAD wind direction profile showing upper-level flow directing particles toward the southwest" />
      <figcaption>VAD wind direction profile</figcaption>
    </figure>
    <div class="paper4-layer-facts">
      <section><strong>Generating layer · 5.5–9 km</strong>: layer maximum of <em>Z</em>′ isolates cloud-top cells</section>
      <section><strong>Wind direction from VAD</strong>: shear directs falling particles toward the <strong>southwest (SW)</strong></section>
      <section><strong>Asymmetric subdomain</strong>: <strong>−30 to +10 km</strong> in <em>x</em> and <em>y</em> captures downwind fallout</section>
    </div>
  </div>
</div>

<!--
About 50 seconds. Madison Slide 9 and Paper Figure 1. Left: 5.5–9 km layer maximum of Z' across nine analysis times (02:54–03:42 UTC). The dashed circle marks the selected cell at the origin. Right: the polar VAD wind profile showing upper-tropospheric shear directing sedimenting ice southwestward relative to the cell, motivating the asymmetric -30 to +10 km analysis domain.
-->

---
class: paper4-evolution
---

# Three-dimensional evolution

<Paper4Evolution />

<script setup>
import Paper4Evolution from '../components/Paper4Evolution.vue'
</script>

<!--
About 50 seconds. Madison Slide 10. This 12-second 3D animation (Paper 4 hero sequence in continuous time) renders Z' isosurfaces at 5 and 7 dB in the moving frame. Note three immediate physical observations: First, other generating cells continuously form and dissipate in the vicinity of the tracked cell. Second, tracing a continuous fall streak in 3D isosurfaces alone is challenging because turbulent eddies, shear, and evaporation create patchy signatures aloft. Third, notice the large, persistent red feature in the lowest layer: a strong melting-layer enhancement is present throughout the entire sequence.

The original twelve-second evolution is preserved. It now plays once, then
explicitly returns to the Madison reference volume and camera pose in a short
crossfade and holds that frame. This reset is not additional storm evolution
or a new observed time. The original movies did not join because the evolution's last volume
differs from the camera-rotation clip's first volume. This reference ending is
the same image, crop, scale, and position used on entry to the next slide.
The scientific statements above are unchanged; their text is now on the left
so the volume can remain at the right across both slides. Motion is web-only.
-->

---
src: ./paper4-lateral-view.md
---

---
class: figure-slide paper4-cross-full
---

# Understanding the fall streak: Vertical cross-sections

<div class="fig">
  <img src="../figures/paper4-cross-full.png" alt="Chapter 5 Figure 3: vertical reflectivity-anomaly cross sections along the fall-streak line across all nine analysis times from 02:54 to 03:42 UTC; persistent trail exists before cell maturity, and fall streak connection becomes prominent by time step 5 (03:18 UTC)" />
</div>

<!--
About 50 seconds. Madison Slide 12 and Paper Figure 3. Vertical cross sections along the southwestward fall-streak azimuth across all nine times (02:54 to 03:42 UTC). Two critical takeaways: First, a persistent trail and melting-layer enhancement exist at 02:54 UTC, even before the selected generating cell reaches peak intensity. Second, a coherent downward connection from the cloud-top cell into the mid-cloud layer is not fully established until time step 5 (03:18 UTC, panel e, indicated by the black arrow). By 03:36–03:42 UTC, the southwestward enhancement extends downward through the mid-cloud layer into the melting layer.
-->

---
class: paper4-video paper4-midcloud
clicks: 1
---

# Understanding the mid-cloud layer (3.5–5 km)

<div class="paper4-video-body">
  <Paper4MidCloudVideo />
  <figure class="paper4-roll-photo">
    <img src="../figures/paper4-cloud-streets-cropped.png" alt="Photograph of boundary-layer cloud streets illustrating parallel convective roll structures" />
    <figcaption>Analogous organization aloft</figcaption>
  </figure>
  <div class="paper4-video-points paper4-midcloud-takeaway">
    <section>
      <h2>Horizontal convective rolls?</h2>
      <p>Mid-cloud echoes exhibit organized, elongated parallel bands aligned with the background shear.</p>
    </section>
  </div>
</div>

<script setup>
import Paper4MidCloudVideo from '../components/Paper4MidCloudVideo.vue'
</script>

<!--
About 45 seconds. Madison Slide 13. Slicing through the 3.5–5 km mid-cloud layer reveals elongated, quasi-parallel reflectivity enhancements oriented roughly north–south. These structures resemble horizontal convective rolls or shear-parallel precipitation bands (conceptually analogous to visible cloud streets). Importantly, these rolls already produce their own precipitation trails, establishing that mid-cloud echoes are not created in a vacuum by cloud-top turrets alone.

[click] Play the original three-second elevation cutaway once, then hold its
final view. Entry and rewind show the decoded first frame; direct entry at the
completed click and return from the following slide show the final frame.
The photograph, its caption, and the bottom takeaway appear together after
playback ends, without another click. Their layout space stays reserved;
rewind hides them, while completed entry shows them immediately.
The cloud-street photograph uses Madison slide 13's original crop, exported
without resampling by scripts/export-paper4-midcloud.py. It remains an analogy
for the organization of the echoes aloft, not an observation of this storm.
-->

---
class: paper4-map-evolution
---

# Mid-cloud layer: max Z' between 3.5 and 5 km

<Paper4EvolutionMaps :src="midCloudMaps" alt="Chapter 5 Figure 4: column-maximum reflectivity anomaly over 3.5–5 km MSL at all nine analysis times from 02:54 to 03:42 UTC, in dB; cell-relative distance axes, analysis corridor, transect, and selected-cell circle are retained">
    <section>
      <h2>Mid-cloud evolution</h2>
      <p>North–south bands are already present at 02:54 UTC and become less distinct during 03:24–03:42 UTC.</p>
    </section>
    <section>
      <h2>CTGCs seed mid-level clouds</h2>
      <p>As the cell passes overhead, its falling ice feeds into the pre-existing clouds.</p>
    </section>
</Paper4EvolutionMaps>

<script setup>
import Paper4EvolutionMaps from '../components/Paper4EvolutionMaps.vue'
import midCloudMaps from '../figures/paper4-mid-full.png'
</script>

<!--
About 45 seconds. Paper Figure 4, replacing Madison slide 14's cutaway video.
These are column-maximum reflectivity-anomaly maps over 3.5–5 km MSL at all
nine analysis times from 02:54 to 03:42 UTC, in the moving cell-relative frame.
The plotted quantity is Z-prime-max in dB, not equivalent reflectivity in dBZ.
Keep the original time labels, distance axes, colorbar, corridor, transect,
and selected-cell circle visible; the figure caption is omitted on the slide
so the complete nine-panel figure can fill the left-hand space.

North–south elongated structures are already present at 02:54 UTC and persist,
but become less distinct during 03:24–03:42 UTC. Changes in shear and the
increasing prominence of CTGC precipitation may both contribute to this
evolution. The roll-updraft and seeder–feeder mechanisms remain interpretations:
these anomaly maps do not retrieve vertical velocity or exclusive particle
origin. Use the preceding vertical sections when discussing the connection
between the selected CTGC and the existing mid-cloud echoes.
-->

---
class: paper4-footprints
---

# Precipitation: fall-streak footprints

<div class="paper4-footprint-steps">
  <span>Layer maximum of <em>Z'</em></span><b>→</b><span>Average over the nine time steps</span><b>→</b><span>Upper 10% in each layer (p90)</span>
</div>

<Paper4Footprints />

<p class="paper4-footprint-takeaway">Two layer-specific footprints: <strong>rain · 1–1.5 km</strong> and <strong>snow · 2.5–3 km MSL</strong>.</p>

<script setup>
import Paper4Footprints from '../components/Paper4Footprints.vue'
</script>

<!--
About 45 seconds. To quantitatively evaluate the precipitation impact without requiring subjective manual contouring, we define objective footprints. For each height layer, we take the vertical maximum of Z' at each time, average those nine fields over time, and extract the upper decile (top 10%, p90) as the persistent footprint. Left: 1–1.5 km rain footprint. Right: 2.5–3 km snow footprint. Both sit southwest of the cell origin, matching the expected downwind fallout trajectory.

Figure source: Chapter 5 Figure S2 (Appendix 5.A), gc3_anom_accum_1x2.pdf.
The displayed quantity is A_mean: the time mean of the layer maximum of Z',
not equivalent reflectivity in dBZ. The exact rain and snow p90 thresholds
are 2.94 and 2.16 dB, rounded to the source panel labels' 2.9 and 2.2 dB.
The two original colorbars have different ranges and are retained separately.
The complete source maps, contours, GC markers, corridor and transect are
preserved; only surrounding headings and axes are typeset at larger sizes.
The source's small in-plot keys remain intact for fidelity; the readable
contour key below the panels replaces the need to read those embedded keys.
-->

---
class: paper4-contrast
---

# Higher precipitation rates in the footprint

<div class="paper4-contrast-body">
  <div class="paper4-contrast-numbers">
    <section><span>Snow · 2.5–3 km MSL</span><strong>+51%</strong><p>liquid-equivalent rate (<em>Z</em> = 2000 <em>S</em>²)</p></section>
    <section><span>Rain · 1–1.5 km MSL</span><strong>+72%</strong><p>rate below melting layer (<em>Z</em> = 200 <em>R</em><sup>1.6</sup>)</p></section>
    <p>Inside versus outside the footprint: snow <strong>+51%</strong>, rain <strong>+72%</strong>. Other cells and pre-existing precipitation exist in both regions.</p>
  </div>
  <div class="paper4-contrast-plot">
    <img src="../figures/paper4-rates-contrast.png" alt="Chapter 5 Figure S3(c): nine-time percent enhancement of radar-estimated rain rates in the rain-layer footprint and snow rates in the snow-layer footprint; time means are plus 72 percent and plus 51 percent" />
    <svg class="paper4-contrast-overlay" viewBox="0 0 1656 816" aria-hidden="true">
      <defs>
        <marker id="paper4-rain-arrow-tip" viewBox="0 0 8 8" refX="8" refY="4" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0 0L8 4L0 8Z" fill="#e67e22" />
        </marker>
        <marker id="paper4-snow-arrow-tip" viewBox="0 0 8 8" refX="8" refY="4" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0 0L8 4L0 8Z" fill="#1976d2" />
        </marker>
      </defs>
      <g class="paper4-rain-annotation">
        <text x="1095" y="116">Rain</text>
        <path class="paper4-contrast-arrow" d="M1080 106L960 151" marker-end="url(#paper4-rain-arrow-tip)" />
      </g>
      <g class="paper4-snow-annotation">
        <text x="960" y="420">Snow</text>
        <path class="paper4-contrast-arrow" d="M943 392L800 313" marker-end="url(#paper4-snow-arrow-tip)" />
      </g>
    </svg>
  </div>
</div>

<!--
About 55 seconds. Here is the quantitative synthesis from Chapter 5. Converting maximum equivalent reflectivity to precipitation rates using standard relations (Z = 2000 S^2 for snow aloft, Z = 200 R^1.6 for rain below), we compare the spatially averaged rates inside versus outside each footprint across the 9 analysis times. Liquid-equivalent snow rates average 51% higher inside the snow footprint; rain rates average 72% higher inside the rain footprint. Crucial attribution caveat: "outside" is the rest of the 40x40 km domain, not a zero-cloud control. This confirms a substantial localized enhancement consistent with seeder–feeder growth, but cannot be claimed as 100% created by the single cell alone.
-->

---
class: smoothing-conclusions paper4-conclusions conclusions-bullets
---

# Project 4: Conclusions

- Multi-radar 3D voxel resolves the evolving three-dimensional structure and fall streak of a tracked CTGC.
- The fall streak interacts and merges with pre-existing mid-level cloud (horizontal rolls) and underlying precipitation.
- Persistent fall-streak footprints show 51% higher snow and 72% higher rain rates, consistent with seeder–feeder enhancement.

<!--
About 30 seconds. In summary: By combining three research radars into a cell-relative moving framework, we followed a single cloud-top generating cell in 3D through its life cycle. Rather than acting in isolation, the cell's fall streak interacted with pre-existing mid-level rolls and melting-layer precipitation. While we cannot isolate this cell's exclusive mass contribution, persistent footprints show 51% higher snow and 72% higher rain rates, providing strong radar observational evidence for localized precipitation enhancement by cloud-top generating cells.
-->
