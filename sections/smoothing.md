---
layout: section
class: paper-title
title: Radar Data Smoothing using the Discrete Cosine Transform
---

<div class="paper-title-content">
  <p class="paper-kicker">Paper 1 · Radar smoothing</p>
  <h1>Radar Data Smoothing using the Discrete Cosine Transform</h1>
  <h2>A Fast Spectral Domain Algorithm</h2>
  <div class="paper-authors">
    <p><strong>Jairo M. Valdivia-Prado</strong></p>
    <p>Coauthors: Will Chapman · Katja Friedrich</p>
  </div>
  <p class="paper-affiliation">Department of Atmospheric and Oceanic Sciences · University of Colorado Boulder</p>
  <p class="paper-citation">Published as Valdivia, Chapman, and Friedrich, <em>Atmospheric Measurement Techniques</em> 19, 5211–5222 (2026) · doi:10.5194/amt-19-5211-2026</p>
</div>

<!--
About 20 seconds. This is the first of four paper talks. The journal article uses Jairo M. Valdivia in its published byline; the presenter name here matches the defense cover. Credit Will Chapman and Katja Friedrich. Start the paper's own introduction on the next slide rather than reviewing the dissertation roadmap again.
-->

---
class: radar-data-intro
---

# The nature of radar data

<div class="radar-data-figure">
  <img v-click.hide="1" src="../extras/raw_zh_rhi.png" alt="Unsmoothed C-band radar reflectivity cross-section and a close-up of cloud-top cells" />
  <img v-click="1" src="../extras/raw_zdr_rhi.png" alt="Unsmoothed differential reflectivity from the same radar scan and close-up" />
</div>

<div class="radar-data-points">
  <p>Radar is natively collected in <strong>polar coordinates</strong>.</p>
  <p>Raw radar observations are <strong>noisy</strong>.</p>
</div>

<!--
About 45 seconds. This is a COW1high range–height scan on 23 February 2022 at 02:28:53–02:29:05 UTC. In this vertical scan, the native coordinates are range and elevation angle. First show unsmoothed horizontal reflectivity; one click replaces it with differential reflectivity from the same scan and with the same spatial bounds. The right panels enlarge 17–23 km range and 4.5–7.5 km altitude. Gate-to-gate variability and missing observations motivate smoothing, but not every small-scale change is random noise; coherent cloud-top structures remain visible. The ZDRC field is calibration-corrected but not smoothed. The reflectivity view corresponds to panels (a) and (e) of Figure 4 in the AMT paper; the ZDR view is newly plotted from the same RHI file. Transition to the polar-grid geometry problem.
-->

---
class: convolution-cartesian
---

# Convolution on a Cartesian grid

<div class="convolution-demo">
  <div class="convolution-demo-labels"><span>Noisy input</span><span>Smoothed output</span></div>
  <div class="convolution-canvas" role="img" aria-label="Animated synthetic Cartesian grid: a boxcar kernel begins at the center and reveals its average on the first click, then scans row by row from upper left to lower right, revealing each average as it reaches that cell; then the box dissolves into weight dots across all cells, which resize as the Gaussian weighting glides across the grid.">
    <CuManim :steps="4" :width="1080" :height="320" :construct="cartesianConvolution" />
    <svg v-if="clicks === 0" class="convolution-first-frame" viewBox="0 0 1080 390" aria-hidden="true">
      <rect v-for="(cell, index) in cartesianPreview.input" :key="`in-${index}`" :x="cell.x" :y="cell.y" :width="cell.w" :height="cell.h" :fill="cell.fill" />
      <rect v-for="(cell, index) in cartesianPreview.backing" :key="`back-${index}`" :x="cell.x" :y="cell.y" :width="cell.w" :height="cell.h" :fill="cell.fill" />
      <rect v-for="(tile, index) in cartesianPreview.tint" :key="`tint-${index}`" :x="tile.x" :y="tile.y" :width="tile.w" :height="tile.h" fill="#cfb87c" fill-opacity="0.25" />
      <rect v-for="(bar, index) in cartesianPreview.bars" :key="`bar-${index}`" :x="bar.x" :y="bar.y" :width="bar.w" :height="bar.h" fill="#cfb87c" />
      <path :d="`M${cartesianPreview.arrowShaft.x1},${cartesianPreview.arrowShaft.y1} L${cartesianPreview.arrowShaft.x2},${cartesianPreview.arrowShaft.y2}`" stroke="#cfb87c" stroke-width="6" stroke-linecap="round" fill="none" />
      <polygon :points="cartesianPreview.arrowTip.map(point => `${point.x},${point.y}`).join(' ')" fill="#cfb87c" />
    </svg>
  </div>
  <p class="convolution-demo-caption">Illustrative, evenly spaced grid · <strong>{{ clicks >= 3 ? 'Gaussian: center-weighted mean' : 'Boxcar: equal-weight mean' }}</strong></p>
</div>

<script setup>
import { useNav } from '@slidev/client'
import { cartesianConvolution, cartesianPreview } from '../scenes/convolution'

const { clicks } = useNav()
</script>

<!--
About 1 minute. After slide 8, explain that we want to reduce gate-to-gate variability while preserving coherent structure. Convolution applies the same local operation at each position. The three-by-three boxcar kernel starts over the center of this synthetic, evenly spaced grid. Click 1: all nine kernel weights are equal, so their average appears at the corresponding output cell. Click 2: clear that example, then scan successive rows from the upper-left cell, alternately left-to-right and right-to-left, revealing each output value as the kernel reaches it; finish at the lower right. Edge values are extended with nearest-value padding in this illustration; this is not Paper 1's DCT boundary treatment. Click 3: dissolve the box and show the Gaussian weights as dots in every cell, sized by the same discrete Gaussian (truncated to three-by-three samples and normalized for the output); weights far from the center are near zero, visible as specks. Click 4: glide the weighting across the grid along the same row-by-row path with dot sizes tracking it, revealing each Gaussian output value in sync. These are illustrative, complete data, not a measured radar field or a comparison of method performance. The kernels are symmetric, so the sliding weighted average is the convolution used here. Transition: a fixed pixel window has a fixed physical footprint on an evenly spaced Cartesian grid, but radar is sampled in range and angle.
-->

---
class: convolution-polar
---

# A fixed polar-grid window changes physical size

<p class="convolution-polar-context">The same three-by-three sample window in range and elevation angle</p>

<div class="convolution-demo">
  <div class="convolution-canvas" role="img" aria-label="Animated range–elevation radar grid: on the first click a three-by-three sample window glides from the first gates by the radar out to far range, where its transverse physical width is larger; on the second click the middle window returns for comparison while the far window's angular width is reduced.">
    <CuManim :steps="2" :width="1080" :height="320" :construct="polarConvolution" />
    <svg v-if="clicks === 0" class="convolution-first-frame" viewBox="0 0 1080 390" aria-hidden="true">
      <path v-for="(ray, index) in polarPreview.rays" :key="`ray-${index}`" :d="ray" class="convolution-preview-line" />
      <path v-for="(arc, index) in polarPreview.arcs" :key="`arc-${index}`" :d="arc" class="convolution-preview-line" />
      <path :d="polarPreview.near" class="convolution-preview-footprint" />
      <path :d="polarPreview.chord" class="convolution-preview-chord" />
      <rect :x="polarPreview.radar.x - 8" :y="polarPreview.radar.y - 8" width="16" height="16" fill="#cfb87c" />
    </svg>
  </div>
  <div class="convolution-polar-takeaway">
    <p>Angular sample spacing grows with range: <strong>r Δθ</strong>. Range-gate spacing stays fixed.</p>
    <p>To keep a fixed physical smoothing width, <strong>adjust the angular window with range.</strong></p>
  </div>
</div>

<script setup>
import { useNav } from '@slidev/client'
import { polarConvolution, polarPreview } from '../scenes/convolution'

const { clicks } = useNav()
</script>

<!--
About 1 minute 10 seconds. Click 1: glide a three-by-three sample window from the first gates by the radar out to far range; the near example fades as the sweep launches, so a single box travels. Adjacent rays diverge, so its transverse footprint is larger at far range even though the number of angular samples and the range-direction width are unchanged. Click 2: bring the middle window back for comparison while narrowing the far window's angular width to approximately the near window's physical transverse width. This is a schematic of footprint changes, not a distortion of the measurements. For 1–2 km cloud-top generating cells, the smoothing scale needs to be specified in distance, not gate count. The angular width decreases with range to hold the physical width approximately fixed; the range-direction kernel stays fixed. A spatial kernel that changes with range is computationally costly. The next slide shows what that computation achieves on a radar field and why the processing time matters. Do not say range gates themselves widen with range.
-->

---
class: smoothing-cost
---

# Range-adaptive spatial smoothing is costly

<div class="smoothing-cost-body">
  <div class="smoothing-cost-story">
    <section>
      <h2>One volume · personal timing</h2>
      <strong>~20 min</strong>
      <p>Spatial smoothing of 20 sweeps and four moments: Z<sub>H</sub>, Z<sub>DR</sub>, ρ<sub>HV</sub>, K<sub>DP</sub></p>
    </section>
    <section>
      <h2>Two hours · extrapolated</h2>
      <strong>~6 h 40 min</strong>
      <p>~20 volumes at a 6-min cadence, processed serially</p>
    </section>
    <div class="smoothing-cost-source">
      <p>Same RHI: full view and 17–23 km zoom · 5-pixel boxcar · Paper Figure 4(a, b, e, f)</p>
      <p>Images show one Z<sub>H</sub> sweep. The separate personal timing covers the full four-moment volume, smoothing only; the two-hour total is extrapolated.</p>
    </div>
  </div>
  <div class="smoothing-cost-visual">
    <div class="smoothing-cost-frame">
      <img v-click.hide="1" src="../figures/dct-noisy-zoom.png" alt="Top, before click: unsmoothed C-band reflectivity zoom at 17–23 km range and 4.5–7.5 km altitude" />
      <img v-click="1" src="../figures/dct-noisy-full.png" alt="Top, after click: the same unsmoothed RHI across the full 0–60 km range; a red box locates the earlier zoom" />
    </div>
    <div class="smoothing-cost-frame">
      <img v-click.hide="1" src="../figures/dct-spatial-zoom.png" alt="Bottom, before click: the reflectivity zoom after spatial dynamic-boxcar smoothing, retaining three cloud-top cells" />
      <img v-click="1" src="../figures/dct-spatial-full.png" alt="Bottom, after click: the same spatially smoothed RHI across the full 0–60 km range; a red box locates the earlier zoom" />
    </div>
  </div>
</div>

<!--
About 1 minute 20 seconds. We saw that maintaining a physical smoothing width requires the angular window to change with range. Point to the top image: the unsmoothed reflectivity zoom from the 23 February 2022 C-band RHI varies from gate to gate. The lower image shows the paper's 5-pixel spatial dynamic boxcar: the three cloud-top structures remain while much of the gate-to-gate variability is reduced. These matched zooms are panels (e) and (f) of the paper's Figure 4, with the same bounds and color scale. Click 1: replace both zooms in place with the full original and spatially smoothed RHI panels (a) and (b); the red boxes indicate the zoom region. In my separate radar-data test, spatial smoothing alone took about 20 minutes for an entire 20-sweep volume and four fields: Z_H, Z_DR, rho_HV, and K_DP. That is not 20 minutes for the pictured sweep or zoom, and does not include reading or other processing. With one volume every 6 minutes, two hours contains roughly 20 volumes; at the same per-volume rate, serial smoothing would take about 400 minutes, or 6 hours 40 minutes. This total is extrapolated, not a measured two-hour run, and my personal timing is distinct from the controlled paper benchmark shown later. We need a faster way to compute the smoothing operation: the convolution theorem.
-->

---
class: smoothing-spectral
---

# Convolution becomes spectral multiplication

<div class="smoothing-theorem-body">
  <div class="smoothing-theorem-statement">
    <p>Convolution theorem, along the angle direction at each range <strong>r</strong></p>
    <div>DCT<sub>θ</sub>{x<sub>r</sub> * h<sub>r</sub>}(k) = X<sub>r</sub>(k) · H<sub>r</sub>(k)</div>
    <p>Sliding a spatial kernel ↔ multiplying spectral coefficients</p>
  </div>
  <div class="spectral-steps">
    <section><span>1</span><h2>Transform</h2><p>DCT along angle</p></section>
    <section><span>2</span><h2>Multiply</h2><p>Use the range-specific response H<sub>r</sub>(k)</p></section>
    <section><span>3</span><h2>Invert</h2><p>Return to the smoothed angular profile</p></section>
    <section><span>4</span><h2>Along range</h2><p>Repeat DCT → multiply → invert with a fixed width</p></section>
  </div>
</div>

<p class="spectral-summary">The DCT uses reflected boundaries; the angular response varies with range, not one global 2D filter.</p>

<!--
About 1 minute 25 seconds. On slide 9 we moved a kernel across a field and computed a weighted sum at each location. The convolution theorem says that, for a matched kernel and boundary treatment, the same filtering operation can instead be obtained by transforming the data, multiplying matching frequency coefficients by the kernel's transfer response, and transforming back. Here x_r is an angular profile at range r, h_r is its symmetric smoothing kernel, and H_r(k) is the corresponding DCT transfer response; k indexes frequency. We choose the DCT because its symmetric extension reflects the data at the boundaries rather than wrapping the far edge back onto the near edge. Transform along angle, multiply by H_r(k), which changes with range to maintain the physical width illustrated on slide 10, then invert. Next transform along range, multiply by a fixed-width response, and invert again. These are sequential separable one-dimensional operations, not one global 2D transfer function; the range-dependent step avoids repeated spatial neighborhood calculations. Do not equate the personal spatial-smoothing time on slide 11 with a measured DCT runtime. The main field comparison uses boxcar smoothing; the large-array timing callout later uses the analytical Gaussian DCT. Avoid saying one filter produced both results.

This first method needs a complete field: gaps are interpolated before the DCT. Discuss that limitation after the results.
-->

---
class: smoothing-comparison
---

# DCT and spatial smoothing retain similar structure

<div class="smoothing-comparison-figures">
  <img src="../figures/dct-spatial-panel.png" alt="C-band reflectivity smoothed with a spatial dynamic boxcar kernel, panel b of the paper's comparison" />
  <img src="../figures/dct-spectral-panel.png" alt="The same C-band scan smoothed using a DCT boxcar, panel c of the paper's comparison" />
</div>

<img class="smoothing-comparison-scale" src="../figures/dct-comparison-scale.png" alt="Shared reflectivity scale in dBZ" />

<p class="fine">C-band radar, 23 Feb 2022, 02:28 UTC; 5-pixel window. Cropped panels (b) and (c) from the paper's Figure 4.</p>

<!--
About 1 minute 30 seconds. Point to the cloud-top features near 5–7 km. The DCT and spatial dynamic boxcar produce closely matching structures, but are not identical; the original paper includes a difference panel. The spatial method skips missing values whereas Paper 1 linearly interpolates gaps before the DCT. These crops preserve the source panels and common color scale; the full eight-panel comparison remains in backup. Do not attribute all differences to algorithmic error.
-->

---
class: smoothing-benchmark
---

# The spectral method reduces processing time

<div class="smoothing-benchmark-body">
  <div class="smoothing-benchmark-result">
    <p>About 180 million pixels</p>
    <div><strong>42 min</strong><span>spatial dynamic kernel</span></div>
    <div><strong>&lt;12 s</strong><span>Gaussian DCT</span></div>
  </div>
  <img src="../figures/dct-volume-benchmark.png" alt="Execution time versus number of pixels, comparing the spatial dynamic kernel and DCT smoothing variants" />
</div>

<p class="fine">Random-noise benchmark arrays, 5-pixel window. Cropped panel (c) from the paper's Figure 5.</p>

<!--
About 1 minute 30 seconds. This is a controlled computation benchmark on arrays of increasing size, not a measured processing time for the displayed C-band scan. At 180 million pixels, the spatial baseline takes 2518 seconds (about 42 minutes); the analytical Gaussian DCT takes less than 12 seconds. At a different fixed data size, the Gaussian method also exceeds 800× speedup for the largest tested window. Keep those two comparisons separate. The crop foregrounds the data-size result.
-->

---
class: smoothing-limitation
---

# Limitation: the DCT needs a complete field

<div class="smoothing-limitation-flow">
  <section><h2>Radar gaps</h2><p>Blocked or filtered gates have no valid observation.</p></section>
  <span aria-hidden="true">→</span>
  <section><h2>Paper 1 treatment</h2><p>Interpolate those gaps before transforming the field.</p></section>
</div>

<p class="smoothing-caution">Broad gaps can bias the smoothed estimate within or near the missing region.</p>

<!--
About 55 seconds. A spectral transform requires defined input values; this paper uses linear interpolation before smoothing. A short gap may be less consequential than a wide blocked sector, where interpolation can introduce a low-frequency bridge and kinks at the edges. These filled values are not observations. This is a limitation of the first method, not a claim that the paper's real-data comparison is invalid. The next paper extends the spectral framework to explicit valid-data support.
-->

---
class: smoothing-conclusions
---

# Paper 1: conclusions

<div class="smoothing-conclusion-list">
  <p><strong>Physical scale:</strong> the angular window adapts to radar range.</p>
  <p><strong>Field comparison:</strong> DCT and spatial smoothing give closely matching structures in the example.</p>
  <p><strong>Computation:</strong> the DCT is much faster on the large-array benchmark.</p>
</div>

<p class="smoothing-next">Next: local statistics with missing-data support.</p>

<!--
About 55 seconds. Summarize the method, quality comparison, and computational result, then pause. The main qualification is that Paper 1 interpolates missing gates. Paper 2 addresses incomplete grids using support-aware local statistics; it is a separate methodological study. Do not imply either methods paper produced the Chapter 4 population results. The paper is published in AMT (2026).
-->
