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
      <p>Spatial smoothing of 20 sweeps and five variables: Z<sub>H</sub>, Z<sub>DR</sub>, ρ<sub>HV</sub>, K<sub>DP</sub>, VEL</p>
    </section>
    <section>
      <h2>Two hours · extrapolated</h2>
      <strong>~6 h 40 min</strong>
      <p>~20 volumes at a 6-min time-step</p>
    </section>
    <div class="smoothing-cost-source">
      <p>Same RHI: full view and 17–23 km zoom · 5-pixel boxcar · Paper Figure 4(a, b, e, f)</p>
      <p>Images show one Z<sub>H</sub> sweep. Smoothed with Dynamic Kernel method.</p>
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
About 1 minute 20 seconds. We saw that maintaining a physical smoothing width requires the angular window to change with range. Point to the top image: the unsmoothed reflectivity zoom from the 23 February 2022 C-band RHI varies from gate to gate. The lower image shows the paper's 5-pixel spatial dynamic boxcar: the three cloud-top structures remain while much of the gate-to-gate variability is reduced. These matched zooms are panels (e) and (f) of the paper's Figure 4, with the same bounds and color scale. Click 1: replace both zooms in place with the full original and spatially smoothed RHI panels (a) and (b); the red boxes indicate the zoom region. In my separate radar-data test, spatial smoothing alone took about 20 minutes for an entire 20-sweep volume and four fields: Z_H, Z_DR, rho_HV, and K_DP. That is not 20 minutes for the pictured sweep or zoom, and does not include reading or other processing. With one volume every 6 minutes, two hours contains roughly 20 volumes; at the same per-volume rate, serial smoothing would take about 400 minutes, or 6 hours 40 minutes. This total is extrapolated, not a measured two-hour run, and my personal timing is distinct from the controlled paper benchmark shown later. I propose using a fast transform to compute the smoothing more efficiently.
-->

---
class: smoothing-dct-intro
---

# Discrete cosine transform (DCT)

<div class="dct-intro-body">
  <p class="dct-intro-lead">A DCT represents samples along a chosen dimension (space or time) as cosine components.</p>
  <div class="dct-intro-flow">
    <section>
      <h2>Samples along one axis</h2>
      <svg viewBox="0 0 320 130" aria-hidden="true">
        <line class="dct-intro-axis" x1="14" y1="110" x2="306" y2="110" />
        <polyline class="dct-intro-profile" points="18,87 44,70 70,77 96,43 122,54 148,82 174,68 200,38 226,58 252,75 278,59 304,84" />
        <g class="dct-intro-samples">
          <circle cx="18" cy="87" r="3.5" /><circle cx="44" cy="70" r="3.5" />
          <circle cx="70" cy="77" r="3.5" /><circle cx="96" cy="43" r="3.5" />
          <circle cx="122" cy="54" r="3.5" /><circle cx="148" cy="82" r="3.5" />
          <circle cx="174" cy="68" r="3.5" /><circle cx="200" cy="38" r="3.5" />
          <circle cx="226" cy="58" r="3.5" /><circle cx="252" cy="75" r="3.5" />
          <circle cx="278" cy="59" r="3.5" /><circle cx="304" cy="84" r="3.5" />
        </g>
      </svg>
      <p>Schematic 1D profile · x(n)</p>
    </section>
    <div class="dct-intro-arrows" aria-hidden="true"><span>DCT →</span><span>← inverse DCT</span></div>
    <section>
      <h2>Cosine coefficients</h2>
      <svg viewBox="0 0 320 130" aria-hidden="true">
        <line class="dct-intro-axis" x1="14" y1="105" x2="306" y2="105" />
        <g class="dct-intro-bars">
          <rect x="20" y="27" width="16" height="78" /><rect x="50" y="48" width="16" height="57" />
          <rect x="80" y="73" width="16" height="32" /><rect x="110" y="88" width="16" height="17" />
          <rect x="140" y="105" width="16" height="17" /><rect x="170" y="80" width="16" height="25" />
          <rect x="200" y="94" width="16" height="11" /><rect x="230" y="99" width="16" height="6" />
          <rect x="260" y="102" width="16" height="3" /><rect x="290" y="103" width="16" height="2" />
        </g>
      </svg>
      <p>Low to high frequency · X(k)</p>
    </section>
  </div>
  <p class="dct-intro-note">Unchanged coefficients reconstruct the original samples, no smoothing yet. Our radar method filters along both angle and range.</p>
</div>

<p class="spectral-summary">JPEG also uses the DCT for image compression; here we use it to filter radar data, not to compress it.</p>

<!--
About 55 seconds. The proposed way around repeated spatial windows begins with a fast discrete cosine transform. This is a general transform of sampled data along a chosen dimension, spatial or temporal: it expresses the samples as coefficients of cosine components ordered from low to high frequency. The drawing illustrates one 1D slice, not a measured spectrum from the RHI or the full 2D operation. Applying the inverse DCT with coefficients unchanged reconstructs the original samples; the transform alone has not smoothed anything. The DCT is familiar from JPEG, where it is applied to image blocks as part of compression; here we filter a 2D polar radar field by applying DCT-based smoothing along angle and along range in separate passes, without JPEG quantization or encoding. The cosine basis corresponds to reflecting data at the boundaries rather than wrapping opposite edges together. The next slide shows how the convolution theorem supplies the weighting in each pass. The angular response changes with range; the range response has fixed width.
-->

---
class: smoothing-spectral
---

# Convolution theorem

<p class="smoothing-theorem-lead">There is an equivalent operation in the spectral domain for any convolution in the spatial/time domain.</p>

$$
\mathcal{T}\{\vec{f} * \vec{g}\} = \mathcal{T}\{\vec{f}\} \cdot \mathcal{T}\{\vec{g}\}
$$

<div class="smoothing-theorem-definition">

$$
H(k) \equiv \mathcal{T}\{\vec{g}\}(k) \qquad \text{kernel transfer function}
$$

</div>

<p class="smoothing-theorem-terms"><strong>f</strong> = sampled data · <strong>g</strong> = smoothing kernel · <strong>T</strong> = spectral transform</p>

<div class="smoothing-theorem-explanation">
  <section><h2>Spatial domain: convolution (*)</h2><p>Slide the kernel across the data; calculate a weighted sum at each location.</p></section>
  <span aria-hidden="true">↔</span>
  <section><h2>Transform domain: multiplication (·)</h2><p>Transform the data and kernel, multiply corresponding coefficients, then invert.</p></section>
</div>

<p class="spectral-summary">For radar: DCT convolution along angle (range-varying width), then along range (fixed width).</p>

<!--
About 50 seconds. On slide 9 we moved a kernel across a field and computed a weighted sum at each location. Here f represents sampled data and g a smoothing kernel. The left side of the equation transforms their spatial convolution—the result of sliding g over f. The right side says that with a suitable spectral transform T and matching boundary treatment, we can instead transform the data and kernel, multiply corresponding coefficients, and inverse-transform the product to recover the filtered data. The multiplication is point-wise in the transform domain, not multiplication of the original samples. We know the data and the desired spatial kernel; the remaining piece is the kernel's matching spectral response T{g}, called the transfer function H. Paper 1 derives analytical responses for boxcar and Gaussian kernels, so I will not derive those here. How do we choose and apply H on a polar grid, where angular spacing changes with range but range-gate spacing does not? Next slide. Exact equivalence requires matching the kernel and reflected boundary treatment; the spatial baseline in the paper also handles missing pixels differently. The field comparison uses boxcar smoothing; the later large-array timing callout uses the analytical Gaussian DCT. Avoid saying one filter produced both results.

This first method needs a complete field: gaps are interpolated before the DCT. Discuss that limitation after the results.
-->

---
class: smoothing-transfer
---

# Transfer functions on a polar grid

<p class="transfer-polar-lead">Choose a smoothing kernel and its analytical DCT-domain response, H(k; W).</p>

<div class="transfer-polar-dimensions">
  <section>

## Angle: response varies with range

Adjacent rays separate by approximately rΔθ.

$$
\begin{aligned}
W_{\theta}(r) &= \frac{W_{\mathrm{phys}}}{r\,\Delta\theta} \\
H_{\theta}(k_{\theta},r) &= H_{\mathrm{kernel}}\!\left(k_{\theta};W_{\theta}(r)\right)
\end{aligned}
$$

One angular-frequency response for each range.

  </section>

  <section>

## Range: fixed response

Range-gate spacing Δr is constant.

$$
\begin{aligned}
W_r &= \text{fixed in range gates} \\
H_r(k_r) &= H_{\mathrm{kernel}}\!\left(k_r;W_r\right)
\end{aligned}
$$

The same range-frequency response at every angle.

  </section>
</div>

<p class="spectral-summary">The angle responses form a range-indexed set; the range response is shared. Apply each in its own DCT pass.</p>

<p class="fine">Boxcar response via the Dirichlet identity: Oppenheim et al. (1999). Gaussian response: Smith (1997).</p>

<!--
About 45 seconds. The paper obtains the analytical continuous-width boxcar response using the Dirichlet-kernel identity cited to Oppenheim et al. (1999), and cites Smith (1997) for the normalized Gaussian response. We do not need to derive either on this slide. H_kernel denotes the chosen response as a function of spatial frequency and smoothing width; the Gaussian's native width parameter is sigma. For the field comparison after the method slide, we use the analytical boxcar response; the later large-array benchmark highlights the Gaussian response. Along angle, adjacent rays are physically separated by approximately r times delta theta, so a fixed physical smoothing scale translates to W_theta(r) = W_phys/(r delta theta) angular samples. Evaluate the chosen response at that width for each range, giving a range-indexed set of angular responses H_theta(k_theta,r). Along range, range gates have fixed separation, so W_r and the range response H_r(k_r) are fixed and shared across angles. These responses are derived for the chosen kernel and reflected DCT boundary treatment, not obtained by naively transforming an arbitrary finite array of weights. Next slide: apply the two responses in successive DCT filtering passes, with an inverse angular DCT between them.
-->

---
class: smoothing-polar-dct
---

# DCT smoothing on a polar grid

<p class="polar-dct-lead">Apply the separable filter to the two dimensions of the polar field, X(θ, r).</p>

<div class="polar-dct-passes">

<section class="polar-dct-pass">

## 1 · Angular pass — range-varying width

<div v-click="1" class="polar-dct-detail">

$$
Y_{\theta} = \operatorname{IDCT}_{\theta}\!\left[\operatorname{DCT}_{\theta}(X) \odot H_{\theta}(k_{\theta},r)\right]
$$

At each range, multiply angular-frequency coefficients by a response that changes with range.

</div>

</section>

<section class="polar-dct-pass">

## 2 · Range pass — fixed width

<div v-click="2" class="polar-dct-detail">

$$
Y = \operatorname{IDCT}_{r}\!\left[\operatorname{DCT}_{r}(Y_{\theta}) \odot H_{r}(k_{r})\right]
$$

At each angle, multiply range-frequency coefficients by the same fixed-width response.

</div>

</section>

</div>

<p class="spectral-summary">The angular response varies with range, so the intermediate field Y<sub>θ</sub> is needed between passes—not one global 2D multiplication.</p>

<!--
About 1 minute. We have now selected the angle-dependent response H_theta and fixed range response H_r. The separable boxcar lets us smooth the 2D field in two directions. Click 1: at every range, take the DCT along the angular samples, multiply corresponding coefficients by H_theta, and inverse-transform to get the intermediate angularly smoothed field Y_theta. Its angular width decreases in samples with range, holding the desired physical scale. Click 2: DCT the intermediate field along range, multiply by H_r, and inverse-transform to obtain the final 2D field Y. Range-gate spacing does not widen with range. The products are element-wise in the appropriate spectral domain; both passes use reflected boundaries. Because the angular response depends on spatial range, we must return to Y_theta before transforming along range. This is not one global 2D DCT followed by a single product H_theta times H_r. The field comparison on the next slide uses the boxcar response. Gaps are interpolated before this method; discuss the limitation after the results.
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
