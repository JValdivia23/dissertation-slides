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
  <div class="convolution-canvas" role="img" aria-label="Animated synthetic Cartesian grid: a boxcar kernel begins at the center and reveals its average on the first click, then scans row by row from upper left to lower right, revealing each average as it reaches that cell; a Gaussian kernel then repeats the example and scan.">
    <CuManim :steps="4" :width="1080" :height="320" :construct="cartesianConvolution" />
    <svg v-if="clicks === 0" class="convolution-first-frame" viewBox="0 0 1080 390" aria-hidden="true">
      <rect v-for="(cell, index) in cartesianPreview.input" :key="`in-${index}`" :x="cell.x" :y="cell.y" :width="cell.w" :height="cell.h" :fill="cell.fill" stroke="#243548" stroke-width="1.2" />
      <rect v-for="(cell, index) in cartesianPreview.backing" :key="`back-${index}`" :x="cell.x" :y="cell.y" :width="cell.w" :height="cell.h" :fill="cell.fill" stroke="#364a5f" stroke-width="1.2" />
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
About 1 minute. After slide 8, explain that we want to reduce gate-to-gate variability while preserving coherent structure. Convolution applies the same local operation at each position. The three-by-three boxcar kernel starts over the center of this synthetic, evenly spaced grid. Click 1: all nine kernel weights are equal, so their average appears at the corresponding output cell. Click 2: clear that example, then scan successive rows from the upper-left cell, alternately left-to-right and right-to-left, revealing each output value as the kernel reaches it; finish at the lower right. Edge values are extended with nearest-value padding in this illustration; this is not Paper 1's DCT boundary treatment. Click 3: return to the center and change to a discrete Gaussian kernel (truncated to three-by-three samples and normalized); its nearer samples have more weight, and the center-weighted output appears. Click 4: repeat the same row-by-row scan for the Gaussian output. These are illustrative, complete data, not a measured radar field or a comparison of method performance. The kernels are symmetric, so the sliding weighted average is the convolution used here. Transition: a fixed pixel window has a fixed physical footprint on an evenly spaced Cartesian grid, but radar is sampled in range and angle.
-->

---
class: convolution-polar
---

# A fixed polar-grid window changes physical size

<p class="convolution-polar-context">The same three-by-three sample window in range and elevation angle</p>

<div class="convolution-demo">
  <div class="convolution-canvas" role="img" aria-label="Animated range–elevation radar grid: an identical three-by-three sample window covers a larger transverse physical width at far range, then its angular width is reduced.">
    <CuManim :steps="3" :width="1080" :height="320" :construct="polarConvolution" />
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
About 1 minute 10 seconds. Click 1: show the range–elevation grid and a three-by-three sample window near the radar. Click 2: move an identical index-space window outward, leaving the near example visible. Adjacent rays diverge, so its transverse footprint is larger at far range even though the number of angular samples and the range-direction width are unchanged. Click 3: show how a narrower angular window at far range gives approximately the near window's physical transverse width. This is a schematic of footprint changes, not a distortion of the measurements. For 1–2 km cloud-top generating cells, the smoothing scale needs to be specified in distance, not gate count. A spatial kernel that changes with range is computationally costly; the paper tests a spectral alternative against the spatial method for both field structure and processing time. The next slide quantifies the angular-width adjustment. Do not say range gates themselves widen with range.
-->

---
class: smoothing-geometry
---

# Change the angular window with range

<div class="smoothing-geometry-body">
  <div class="smoothing-equation">
    <p>For a target physical width <strong>L</strong>:</p>
    <div>W<sub>θ</sub>(r) = L / (r Δθ)</div>
    <p>Angular sample spacing is r Δθ.</p>
  </div>
  <div class="smoothing-range-pair">
    <section>
      <h2>Near the radar</h2>
      <div class="smoothing-samples smoothing-samples-near" aria-hidden="true"></div>
      <p>More angular samples within the same physical width</p>
    </section>
    <section>
      <h2>Farther away</h2>
      <div class="smoothing-samples smoothing-samples-far" aria-hidden="true"></div>
      <p>Fewer angular samples within that width</p>
    </section>
  </div>
</div>

<p class="fine">The range-direction kernel remains fixed; the angular width changes with range.</p>

<!--
About 1 minute 20 seconds. At fixed angular resolution, the distance between adjacent rays grows with range. To keep a specified length L, use more angular samples nearby and fewer farther out. In the paper W_theta is continuous for the analytical transfer function; a discrete spatial baseline rounds to an odd number of samples. The equation and preceding text in Chapter 2 show the 1/r dependence.
-->

---
class: smoothing-spectral
---

# Smoothing in the spectral domain

<div class="spectral-steps">
  <section><span>1</span><h2>Transform</h2><p>DCT of angular profiles</p></section>
  <section><span>2</span><h2>Weight</h2><p>Range-specific spectral response</p></section>
  <section><span>3</span><h2>Invert</h2><p>Return to the radar grid</p></section>
  <section><span>4</span><h2>Repeat</h2><p>Fixed-width pass along range</p></section>
</div>

<p class="spectral-summary">The filter changes with range, but the spectral multiplication remains efficient.</p>

<!--
About 1 minute 25 seconds. The convolution theorem motivates transforming each angular profile, multiplying by an analytical transfer function whose width depends on range, and transforming back. Then apply a fixed-width range-direction pass. This is a sequence of separable one-dimensional operations, not a single global two-dimensional transfer function. DCT boundary treatment corresponds to reflection rather than a periodic wrap. The main field comparison uses boxcar smoothing; the large-array timing callout later uses the analytical Gaussian DCT. Avoid saying one filter produced both results.

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
