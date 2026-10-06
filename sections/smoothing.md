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
  <div class="convolution-canvas" role="img" aria-label="Animated synthetic Cartesian grid: a boxcar kernel begins at the center and reveals its average on the first click, then scans row by row from upper left to lower right, revealing each average as it reaches that cell.">
    <CuManim :steps="2" :width="1080" :height="320" :construct="cartesianConvolution" />
    <svg v-if="clicks === 0" class="convolution-first-frame" viewBox="0 0 1080 390" aria-hidden="true">
      <rect v-for="(cell, index) in cartesianPreview.input" :key="`in-${index}`" :x="cell.x" :y="cell.y" :width="cell.w" :height="cell.h" :fill="cell.fill" />
      <rect v-for="(cell, index) in cartesianPreview.backing" :key="`back-${index}`" :x="cell.x" :y="cell.y" :width="cell.w" :height="cell.h" :fill="cell.fill" />
      <rect v-for="(tile, index) in cartesianPreview.tint" :key="`tint-${index}`" :x="tile.x" :y="tile.y" :width="tile.w" :height="tile.h" fill="#cfb87c" fill-opacity="0.25" />
      <rect v-for="(bar, index) in cartesianPreview.bars" :key="`bar-${index}`" :x="bar.x" :y="bar.y" :width="bar.w" :height="bar.h" fill="#cfb87c" />
      <path :d="`M${cartesianPreview.arrowShaft.x1},${cartesianPreview.arrowShaft.y1} L${cartesianPreview.arrowShaft.x2},${cartesianPreview.arrowShaft.y2}`" stroke="#cfb87c" stroke-width="6" stroke-linecap="round" fill="none" />
      <polygon :points="cartesianPreview.arrowTip.map(point => `${point.x},${point.y}`).join(' ')" fill="#cfb87c" />
    </svg>
  </div>
  <p class="convolution-demo-caption">Illustrative, evenly spaced grid · <strong>Boxcar: equal-weight mean</strong></p>
</div>

<script setup>
import { useNav } from '@slidev/client'
import { cartesianConvolution, cartesianPreview } from '../scenes/convolution'

const { clicks } = useNav()
</script>

<!--
About 40 seconds. After slide 8, explain that we want to reduce gate-to-gate variability while preserving coherent structure. Convolution applies the same local operation at each position. The three-by-three boxcar kernel starts over the center of this synthetic, evenly spaced grid. Click 1: all nine kernel weights are equal, so their average appears at the corresponding output cell. Click 2: clear that example, then scan successive rows from the upper-left cell, alternately left-to-right and right-to-left, revealing each output value as the kernel reaches it; finish at the lower right. Edge values are extended with nearest-value padding in this illustration; this is not Paper 1's DCT boundary treatment. These are illustrative, complete data, not a measured radar field or a comparison of method performance. The kernel is symmetric, so the sliding weighted average is the convolution used here. Transition: a fixed pixel window has a fixed physical footprint on an evenly spaced Cartesian grid, but radar is sampled in range and angle.
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
      <p>17–23 km zoom · 5-pixel boxcar · Paper Figure 4(e, f)</p>
      <p>Images show one Z<sub>H</sub> sweep. Smoothed with Dynamic Kernel method.</p>
    </div>
  </div>
  <div class="smoothing-cost-visual">
    <div class="smoothing-cost-frame">
      <img src="../figures/dct-noisy-zoom.png" alt="Top: unsmoothed C-band reflectivity zoom at 17–23 km range and 4.5–7.5 km altitude" />
    </div>
    <div class="smoothing-cost-frame">
      <img src="../figures/dct-spatial-zoom.png" alt="Bottom: the reflectivity zoom after spatial dynamic-boxcar smoothing, retaining three cloud-top cells" />
    </div>
  </div>
</div>

<!--
About 1 minute 20 seconds. We saw that maintaining a physical smoothing width requires the angular window to change with range. Point to the top image: the unsmoothed reflectivity zoom from the 23 February 2022 C-band RHI varies from gate to gate. The lower image shows the paper's 5-pixel spatial dynamic boxcar: the three cloud-top structures remain while much of the gate-to-gate variability is reduced. These matched zooms are panels (e) and (f) of the paper's Figure 4, with the same bounds and color scale. In my separate radar-data test, spatial smoothing alone took about 20 minutes for an entire 20-sweep volume and four fields: Z_H, Z_DR, rho_HV, and K_DP. That is not 20 minutes for the pictured sweep or zoom, and does not include reading or other processing. With one volume every 6 minutes, two hours contains roughly 20 volumes; at the same per-volume rate, serial smoothing would take about 400 minutes, or 6 hours 40 minutes. This total is extrapolated, not a measured two-hour run, and my personal timing is distinct from the controlled paper benchmark shown later. I propose using a fast transform to compute the smoothing more efficiently.
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

<p class="smoothing-theorem-terms"><strong>f</strong> = data, <strong>g</strong> = smoothing kernel, <strong>T</strong> = spectral transform</p>

<div class="smoothing-theorem-explanation">
  <section><h2>Spatial domain: convolution (*)</h2><p>Slide the kernel across the data.</p></section>
  <span aria-hidden="true">↔</span>
  <section><h2>Transform domain: multiplication (·)</h2><p>Multiply corresponding coefficients, then invert.</p></section>
</div>

<!--
About 50 seconds. On slide 9 we moved a kernel across a field and computed a weighted sum at each location. Here f represents sampled data and g a smoothing kernel. The left side of the equation transforms their spatial convolution—the result of sliding g over f. The right side says that with a suitable spectral transform T and matching boundary treatment, we can instead transform the data and kernel, multiply corresponding coefficients, and inverse-transform the product to recover the filtered data. The multiplication is point-wise in the transform domain, not multiplication of the original samples. We know the data and the desired spatial kernel; the remaining piece is the kernel's matching spectral response T{g}, called the transfer function H. Paper 1 derives analytical responses for boxcar and Gaussian kernels, so I will not derive those here. Next, demonstrate the established DCT computation with a twelve-sample 1D signal before stating this work's contribution for 2D polar radar fields. Exact equivalence requires matching the kernel and reflected boundary treatment; the spatial baseline in the paper also handles missing pixels differently. The field comparison uses boxcar smoothing; the later large-array timing callout uses the analytical Gaussian DCT. Avoid saying one filter produced both results.

This first method needs a complete field: gaps are interpolated before the DCT. Discuss that limitation after the results.
-->

---
class: convolution-cartesian dct-convolution
clicks: 5
---

# DCT convolution in one dimension

<div class="convolution-demo">
  <div class="convolution-canvas" role="img" aria-label="Five-click Manim animation: twelve sampled values expand about their mean into a constant mean component and eleven signed, amplitude-weighted cosine components in depth; the weights move into a coefficient plot; a three-point boxcar response multiplies them; the updated components return to the shared mean reference; adding their deviations to the mean reconstructs the smoothed signal at the original sample positions.">
    <CuManim v-if="dctActive" :steps="5" :width="1080" :height="360" :construct="constructDct" />
  </div>
  <p class="convolution-demo-caption">Illustrative 12-sample signal · Three-point boxcar · Reflected boundaries</p>
</div>

<script setup>
import { useIsSlideActive, useNav } from '@slidev/client'
import { dctConvolution } from '../scenes/dct-convolution'

const { clicks } = useNav()
const dctActive = useIsSlideActive()
function constructDct() { return dctConvolution(() => clicks.value) }
</script>

<!--
About 90 seconds, five clicks. Reuse the twelve illustrative sample heights from the former DCT introduction; they are not radar observations. All cosine weights, transfer-function values, and reconstructed samples are calculated from those values. The DCT-II basis is cos[pi*k*(n+1/2)/12], including the constant k=0 mode. Display the expansion weights a_0 = mean(x), a_k = (2/N) sum_n x[n] cos[pi*k*(n+1/2)/N] for k>0, not an unnormalized DCT library output. The original signal stays at its initial vertical position. On the first click, the reference axis moves to mu=43.75 and every mode is already scaled by its actual signed weight, using the original signal's vertical scale. The k=0 contribution is the flat mean itself; higher modes are displayed as mu+a_k*cos(...) to share that reference. The repeated display offset is not summed: reconstruct as mu plus the eleven deviations, adding mu only once. Depth separates mode index k; it is not a third physical dimension of the sampled data. All labels and figure geometry are native Manim mobjects.

Initial frame: identify the twelve samples. The connected line is a visual guide.
[click] Move the reference to the mean while keeping the signal's height unchanged, then fan out the weighted cosine components into depth. Point to k=0, which is flat at the mean, and the signed weights at right. The other components oscillate about the shared mean reference with their actual amplitudes; small-weight modes are nearly flat. There is no smoothing yet: the same weights reconstruct the original samples.
[click] Move those weights into the signed coefficient plot. These are the actual coefficients of the displayed signal, ordered from low to high frequency.
[click] Introduce the three-point equal-weight average and its matching DCT-domain response H(k) = [1 + 2*cos(pi*k/12)]/3. Then multiply every a_k by H(k). Faint bar outlines retain the original coefficients. H(0)=1 preserves the mean; H(8)=0 removes that mode; H(9..11)<0 reverses signs while attenuating magnitude. Do not describe the boxcar as a hard spectral cutoff or a purely positive taper. The response is not a naive DCT of a three-element array.
[click] Reverse the coefficient-plot transition, returning each new weight b_k to its already amplitude-weighted cosine component. The cosine frequencies have not changed, and b_0=a_0 keeps the mean fixed.
[click] Keep the flat mean and add the eleven weighted deviations. The gold reconstruction is a real pointwise sum, starting at the mean rather than dropping to zero. Do not add the shared display reference twelve times. Finish with twelve gold samples over the faint blue original. The result equals a direct three-point average using half-sample reflection, including x[-1]=x[0] and x[12]=x[11]. Numerical equivalence and the single-mean reconstruction are checked independently in scripts/test-dct-convolution.ts. Curves between samples illustrate the cosine interpolant; equivalence to direct convolution is asserted at the twelve sample positions, not for an arbitrary continuous interpolation.

Transition: this demonstrated an established spectral-domain smoothing operation on one axis with one fixed width. The next slide states this work's contribution: DCT smoothing of 2D radar fields in native polar coordinates, with range-dependent angular filtering to maintain a consistent physical scale. Refer listeners to the paper for the formulation rather than explaining the extension here. The transfer-function details, two successive DCT passes, and synthetic validation are available in the supporting slides if asked. Do not imply one global 2D multiplication. Gaps are interpolated before Paper 1's method; discuss that limitation after the results.
-->

---
class: smoothing-contribution
---

# Challenge: 

<div class="flex flex-1 items-center gap-12 min-h-0">
  <p class="flex-1 text-2xl leading-relaxed">Spectral operation of <strong>2D radar fields</strong> in <strong>polar coordinates</strong>.</p>
  <svg class="shrink-0" width="360" height="225" viewBox="0 0 320 200" role="img" aria-label="Illustrative two-dimensional radar sampling grid in range and angle, not measured radar data">
    <path d="M32 158 L250.24 32 A252 252 0 0 1 284 158 Z" fill="#cfb87c" fill-opacity="0.12" />
    <g fill="#cfb87c" fill-opacity="0.55">
      <path d="M141.12 95 L195.68 63.5 A189 189 0 0 1 209.6 93.36 L150.4 114.91 A126 126 0 0 0 141.12 95 Z" />
      <path d="M156.09 136.12 L218.13 125.18 A189 189 0 0 1 221 158 L158 158 A126 126 0 0 0 156.09 136.12 Z" />
    </g>
    <g fill="none" stroke="currentColor" stroke-opacity="0.65" stroke-width="2">
      <path d="M32 158 H284 M32 158 L280.18 114.24 M32 158 L268.8 71.81 M32 158 L250.24 32" />
      <path d="M86.56 126.5 A63 63 0 0 1 95 158 M141.12 95 A126 126 0 0 1 158 158 M195.68 63.5 A189 189 0 0 1 221 158 M250.24 32 A252 252 0 0 1 284 158" />
    </g>
    <circle cx="32" cy="158" r="4" fill="currentColor" />
    <text x="162" y="190" text-anchor="middle" fill="currentColor" style="font-size: 22px">Range</text>
    <text x="242" y="24" fill="currentColor" style="font-size: 22px">Angle</text>
  </svg>
</div>



<p class="fine convolution-demo-caption">See <a href="https://doi.org/10.5194/amt-19-5211-2026" target="_blank" rel="noopener noreferrer">Valdivia et al. (2026)</a> for the mathematical formulation and implementation.</p>

<!--
About 30 seconds, no clicks. The polar-grid sketch is illustrative, not a radar observation. Suggested delivery: “The spectral-domain smoothing operation I just showed is established. Our contribution is to formulate and implement it for two-dimensional radar fields directly in their native polar coordinates. We adapt the angular filtering with range to maintain a consistent physical smoothing scale. I will leave the mathematical formulation to the paper and now show the results on measured radar data.” Do not claim that the convolution theorem, DCT, or 2D DCT alone is new. The novelty here is the range-aware formulation for the 2D polar radar field. Do not explain the transfer functions or successive passes during the main talk; the supporting slides titled Transfer functions on a polar grid, DCT smoothing on a polar grid, and Synthetic validation of DCT smoothing retain those details for questions. The DOI link opens the paper in a separate tab. Gaps still require interpolation in Paper 1; cover that limitation after the results.
-->

---
class: smoothing-comparison
---

# Spatial and DCT smoothing on a C-band scan

<div class="smoothing-comparison-view">
  <p v-click.hide="1">Full RHI: the red boxes locate the cloud-top zoom.</p>
  <p v-click="1">17–23 km zoom: the three cloud-top features remain distinct in both outputs.</p>
</div>

<div class="smoothing-comparison-figures">
  <div class="smoothing-comparison-frame">
    <img v-click.hide="1" src="../figures/dct-spatial-panel.png" alt="Full C-band RHI smoothed with a spatial dynamic boxcar, paper Figure 4(b); red box marks the cloud-top zoom" />
    <img v-click="1" src="../figures/dct-real-spatial-zoom-panel.png" alt="Spatial dynamic-boxcar zoom from paper Figure 4(f), showing three cloud-top features at 17–23 km range" />
  </div>
  <div class="smoothing-comparison-frame">
    <img v-click.hide="1" src="../figures/dct-spectral-panel.png" alt="Full C-band RHI smoothed with an analytical DCT boxcar, paper Figure 4(c); red box marks the cloud-top zoom" />
    <img v-click="1" src="../figures/dct-real-spectral-zoom-panel.png" alt="Analytical DCT-boxcar zoom from paper Figure 4(g), showing the same three cloud-top features at 17–23 km range" />
  </div>
</div>

<img class="smoothing-comparison-scale" src="../figures/dct-comparison-scale.png" alt="Shared reflectivity scale in dBZ" />

<p class="fine">C-band radar, 23 Feb 2022, 02:28 UTC · 5-pixel boxcar · Paper Figure 4(b, c, f, g). Spatial skips missing gates; DCT input is interpolated.</p>

<!--
About 1 minute 30 seconds. Move from the contribution statement to measured C-band radar. Initially show the matched full-RHI spatial dynamic-boxcar and analytical DCT-boxcar outputs, panels (b) and (c) of Figure 4. Point to the red boxes at 17–23 km. Click 1: replace both panels with their matched cloud-top zooms (f) and (g). The three roughly 1–2 km structures at about 5–7 km altitude remain distinguishable in both outputs. They are closely matching, not numerically identical; the original paper also includes difference panels. The spatial method skips missing values whereas Paper 1 linearly interpolates gaps before the DCT, so do not attribute every discrepancy to the filter itself. Both views retain the source axes and shared reflectivity color scale. The full eight-panel comparison remains in backup.
-->

---
class: smoothing-benchmark
---

# DCT benchmark: window width and data size

<div class="smoothing-benchmark-body">
  <div class="smoothing-benchmark-results">
    <div v-click.hide="1" class="smoothing-benchmark-result">
      <p>Random-noise arrays · fixed 5-pixel window</p>
      <div><strong>42 min</strong><span>spatial dynamic kernel · 2518 s</span></div>
      <div><strong>&lt;12 s</strong><span>Gaussian DCT · 180 million pixels</span></div>
      <p class="smoothing-benchmark-speedup"><strong>&gt;200×</strong> faster than the spatial dynamic kernel</p>
      <p class="smoothing-benchmark-takeaway">A full radar volume: overnight → between volume scans.</p>
    </div>
    <div v-click="1" class="smoothing-benchmark-result">
      <p>Fixed RHI · window 5–101 pixels</p>
      <div><strong>≈60 ms</strong><span>analytical Gaussian and boxcar</span></div>
      <div><strong>8.5 to &gt;44 s</strong><span>tested spatial dynamic kernel</span></div>
      <p class="smoothing-benchmark-speedup"><strong>&gt;800×</strong> faster at a 101-pixel window · <span>analytical boxcar &gt;700×</span></p>
      <p class="smoothing-benchmark-takeaway">Runtime is window-size agnostic: choose any width for free.</p>
    </div>
  </div>
  <div class="smoothing-benchmark-figures">
    <img v-click.hide="1" src="../figures/dct-volume-benchmark.png" alt="Paper Figure 5(c): execution time versus number of pixels for a fixed five-pixel window on random-noise benchmark arrays" />
    <img v-click="1" src="../figures/dct-window-benchmark.png" alt="Paper Figure 5(a): execution time versus window size on a fixed 474-by-1180-pixel RHI; analytical Gaussian and boxcar timings stay near 60 milliseconds while the tested spatial method rises" />
  </div>
</div>

<div class="smoothing-benchmark-source fine">
  <p v-click.hide="1">Paper Figure 5(c): fixed window width, varying data size. A full volume at the spatial method's 42-minute runtime becomes a task measured in seconds.</p>
  <p v-click="1">Paper Figure 5(a): fixed 474 × 1180-pixel RHI, varying window width. The filter response changes with width, but analytical-kernel runtime does not — a separate finding from the volume benchmark.</p>
</div>

<!--
About 1 minute 45 seconds. This paper benchmarks two different scaling questions. Open with the practical question: what does smoothing a full radar volume cost? Click 0 shows Figure 5(c), which fixes the window at 5 pixels and varies random-noise array size. At 180 million pixels — a full radar volume — the spatial dynamic-kernel implementation takes 2518 seconds, about 42 minutes. Gaussian DCT takes less than 12 seconds: over 200 times faster. That factor is derived from the reported times and is consistent with the paper's Figure 5(d); state it as a conservative bound. It is the difference between a job you run overnight and one you run between volume scans. This is a controlled array benchmark, not the C-band RHI on slide 15 or the 20-sweep example on slide 11. Click 1: switch to Figure 5(a), which holds one measured 474-by-1180-pixel RHI fixed and varies the window from 5 to 101 pixels. Here the story changes: the analytical Gaussian and boxcar DCT transfer functions change with width, so the smoothing itself is not width-independent, but their measured computation times stay approximately constant near 60 ms because evaluating the response does not iterate over every window weight. The tested spatial dynamic-kernel implementation rises from 8.5 to over 44 seconds. At width 101, Figure 5(b) gives over 800-fold Gaussian and over 700-fold analytical-boxcar speedup. Other discrete DCT responses are faster than this spatial baseline but their cost increases with window width. Two separate findings: the volume speedup does not transfer to the window-width test, and the window-width speedup does not transfer to the volume test. Do not claim all possible spatial algorithms scale this way.
-->

---
class: smoothing-limitation
---

# Limitations: missing data and boundaries

<div class="smoothing-limitation-flow">
  <section>
    <h2>Missing data</h2>
    <svg class="smoothing-limitation-diagram" viewBox="0 0 500 280" role="img" aria-label="Illustrative polar grid with a missing sector beginning halfway out in range and scattered patches of missing gates">
      <circle class="scan-field" cx="250" cy="140" r="118" />
      <g class="scan-grid">
        <circle cx="250" cy="140" r="59" />
        <circle cx="250" cy="140" r="89" />
        <path d="M132 140 H368 M250 22 V258 M167 57 L333 223 M333 57 L167 223" />
      </g>
      <g class="missing-gates">
        <path d="M288 95 L326 50 A118 118 0 0 1 364 109 L307 125 A59 59 0 0 0 288 95 Z" />
        <path d="M170 92 L179 85 L194 89 L199 101 L189 108 L173 104 Z" />
        <path d="M202 179 L211 171 L226 176 L229 187 L217 193 L204 190 Z" />
        <path d="M264 211 L273 204 L286 209 L288 220 L278 226 L266 221 Z" />
        <path d="M322 177 L332 172 L343 179 L340 189 L328 193 L319 185 Z" />
      </g>
      <circle class="scan-outline" cx="250" cy="140" r="118" />
      <circle class="scan-origin" cx="250" cy="140" r="4" />
    </svg>
    <p>Interpolating broad gaps can bias estimates near missing regions.</p>
  </section>
  <section>
    <h2>Boundary conditions</h2>
    <svg class="smoothing-limitation-diagram" viewBox="0 0 500 280" role="img" aria-label="Illustrative full-circle polar grid with neighboring azimuth rays joined across the zero-degree and 360-degree seam">
      <circle class="scan-field" cx="250" cy="140" r="118" />
      <g class="scan-grid">
        <circle cx="250" cy="140" r="59" />
        <circle cx="250" cy="140" r="89" />
        <path d="M132 140 H368 M250 22 V258 M167 57 L333 223 M333 57 L167 223" />
      </g>
      <path class="seam-neighborhood" d="M250 140 L237 23 A118 118 0 0 1 263 23 Z" />
      <path class="seam-rays" d="M250 140 L237 23 M250 140 L263 23" />
      <path class="seam-join" d="M237 23 Q250 3 263 23" />
      <path class="seam-arrow" d="M263 23 L253 19 M263 23 L260 13" />
      <circle class="scan-outline" cx="250" cy="140" r="118" />
      <circle class="scan-origin" cx="250" cy="140" r="4" />
    </svg>
    <p>Reflective edges suit finite RHIs; full-circle PPI azimuth joins at 0°/360°.</p>
  </section>
</div>

<!--
About 1 minute 10 seconds. These minimal polar sketches are illustrative, not measured fields or a demonstration of Paper 1's interpolation error. Two assumptions qualify Paper 1. First, its DCT needs defined input values, so the paper linearly interpolates missing gates before smoothing. In the left sketch, a blocked sector begins about halfway out in range, with separate isolated invalid patches. A short gap may be less consequential than a wide blocked sector: interpolation can introduce a low-frequency bridge and kinks at its edges. Filled values are not observations. Second, DCT-II in the angular and range passes assumes reflected boundaries. This is a reasonable model for the finite elevation and range limits of an RHI, not a universal radar boundary rule. On the right, the two rays on either side of 0/360 degrees are physically adjacent on a full-circle PPI; a periodic angular transform is more appropriate while range remains reflective. A partial-sector scan need not wrap in azimuth. There is also a scale-versus-noise trade-off: keeping physical smoothing width approximately fixed means fewer angular samples at longer ranges, where signal-to-noise ratio may be poorer, so the method does not guarantee equal noise reduction everywhere. The real-data demonstration here is reflectivity; Doppler velocity must be de-aliased before smoothing. Paper 2 extends the framework to support-aware local statistics and explicit periodic azimuth versus reflective range modes. Do not imply that it automatically solves the range-dependent noise trade-off.
-->

---
class: smoothing-conclusions conclusions-bullets
---

# Project 1: Conclusions

- Spectral domain smoothing makes radar processing practical for large datasets.
- DCT gives nearly identical results to convolution while being orders of magnitude faster.
- Missing data and boundary conditions still need explicit handling.

<!--
About 45 seconds. These statements are conclusions; the benchmark timings are supporting results already shown on slide 16. Suggested delivery: “So, in this work, we developed a fast DCT-based method for reducing noise in polar radar data. It gives results visually very close to spatial convolution while accounting for radar geometry. In our large-array benchmark, processing fell from about 42 minutes to under 12 seconds. But gaps still need to be interpolated, and the boundary assumption must suit the scan. Those limitations motivated my next project.” The 180-million-pixel data-size test uses random-noise arrays at a fixed five-pixel width: 2518 s for the tested spatial dynamic-kernel implementation versus less than 12 s for Gaussian DCT. It is not a measured full-volume processing time. Separately, on a fixed RHI, analytical Gaussian and boxcar runtimes stay near 60 ms across tested widths of 5–101 pixels; the filter response does change with width. The analytical Gaussian is the recommended general-purpose kernel, and analytical boxcar allows comparison with a spatial moving average. The synthetic outputs are visually nearly indistinguishable, not numerically identical; the real C-band cloud-top features remain distinct in both outputs. Slide 17 introduced the missing-data and boundary assumptions, so there is no need to repeat its details here. Do not imply that all spatial methods scale like the tested implementation. This paper is published in AMT (2026).
-->
