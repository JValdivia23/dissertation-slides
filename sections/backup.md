---
layout: section
---

# Backup

Jump here only if asked.

<!--
Not part of the 40 minutes.
-->

---

# Backup: limits of this case

- One storm, and one cell in the three-dimensional analysis
- Six-minute volumes; soundings at 02:00 and 04:15 UTC
- A boundary can enclose several cells
- Overlapping echoes block attribution to the tracked cell
- Rates depend on the chosen $Z$–rate relations

<!--
Use this if the question is "what does this not show?"

Also: COW loses the cell at the last time. The footprints are time-mean masks, so they are not the streak's position at every step. Results change little from the 85th to the 95th percentile.
-->

---
class: smoothing-conclusions population-limits
---

# Project 3: Limits

<div class="smoothing-conclusion-list">
  <section>
    <h2>Detection and boundaries</h2>
    <p>The 5-dB threshold, smoothing, and X-band sensitivity can exclude weaker features.</p>
    <p>A contour may contain several turrets: counts and areas describe detected radar features, not individual updrafts.</p>
  </section>
  <section>
    <h2>Temporal resolution</h2>
    <p>Six-minute volumes can miss short-lived cells and rapid merging or splitting.</p>
    <p>Stage boundaries are selected from population trends, so stage durations are approximate.</p>
  </section>
  <section>
    <h2>Microphysical interpretation</h2>
    <p>Z<sub>DR</sub> evolution is consistent with aggregation and sorting, but does not uniquely identify particle habits or processes.</p>
    <p>Uncorrected differential attenuation can lower absolute values.</p>
  </section>
  <section>
    <h2>Environmental attribution</h2>
    <p>Two soundings provide environmental context but do not resolve local, short-timescale instability.</p>
    <p>The observations do not isolate the mechanisms responsible for initiation, organization, or decay.</p>
  </section>
</div>

<p class="population-limits-scope"><strong>Scope:</strong> One winter storm; additional cases are needed to assess how general these lifecycle and microphysical trends are.</p>

<!--
Supporting slide, no clicks. Use if asked about population-study limitations. Read the panels from top left to bottom right, then the scope statement. These are the boundaries of the conclusions, not reasons to dismiss the observed evolution. Suggested delivery: “We identify radar features, which can omit weak cells or combine several turrets. Six-minute sampling limits individual-cell histories, and the population stage boundaries are approximate. The polarimetric evolution supports aggregation and sorting, but does not identify particles uniquely. Absolute Z_DR may be biased low, although the paper's attenuation bounds argue against attenuation as the primary explanation for the late increase. Two soundings constrain the environment, not the forcing mechanism. These conclusions describe one winter storm.”

Detection and boundaries: the threshold balances coherent detection against false positives. It is a 5-dB reflectivity enhancement in the perturbation field, not an absolute 5-dBZ echo threshold. Smoothing and X-band sensitivity can obscure weak or small features; the small-area screen primarily removes noise-scale regions. Connected contours may encompass several adjacent turrets, so increasing area reflects both physical organization and segmentation connectivity, not solely the growth of one updraft. Do not call all observed clustering an artifact.

Temporal resolution: six-minute volume sampling can miss short-lived cells and rapid splitting or merging. Lifecycle stage transitions were selected from count and area trends; small shifts change stage durations and the statistics assigned to each stage. The approximately 1.7-hour population sequence is not a typical individual-cell lifetime, and the selected nearly 50-minute track is not a population lifetime estimate.

Microphysical interpretation: particle shape, orientation, density, and mixtures affect Z_DR, so the proposed aggregation and later preferential fallout/sorting are interpretations consistent with the observations, not direct particle-habit measurements. Full differential-attenuation correction was not applied through the mixed-phase beam paths. Bird-bath calibration addresses instrumental offsets, not propagation effects. The paper's conservative attenuation-bound analysis argues against attenuation as the primary driver of the late higher Z_DR; distinguish that case-specific evidence from uncertainty in absolute values. Do not argue that a negative bias alone, without examining how it changes in time, rules out every possible temporal artifact.

Environmental attribution: the two Sorel soundings are offset from the cells in space and time and cannot resolve local, short-lived instability. VAD provides intermediate wind context but does not fill the thermodynamic sampling gap. Shear relaxation and layer-specific drying accompany the evolution, but the observations do not isolate a radiative, shear, or wave mechanism. No definitive wave signature was found; that is not proof that waves were absent. Finally, additional storms are needed to test the generality of the lifecycle and microphysical trends. Refer to Project 3: Conclusions in the main talk.
-->

---
class: smoothing-conclusions population-limits paper4-limits
---

# Project 4: Limitations

<div class="smoothing-conclusion-list">
  <section>
    <h2>CTGC Contribution</h2>
    <p>The 51% snow and 72% rain contrasts do not measure the tracked cell’s precipitation.</p>
  </section>
  <section>
    <h2>Unresolved mechanisms</h2>
    <p>The roles of wind shear and CTGC triggers remain unresolved.</p>
  </section>
  <section>
    <h2>Footprints and rate estimates</h2>
    <p>Time-mean footprints may miss instantaneous streak boundaries; rates depend on chosen reflectivity–rate relations.</p>
  </section>
  <section>
    <h2>Case scope</h2>
    <p>One selected cell cannot establish a population mean or a storm-total precipitation contribution.</p>
  </section>
</div>

<style>
.paper4-limits .smoothing-conclusion-list {
  max-height: 22rem;
}

.paper4-limits .smoothing-conclusion-list p {
  font-size: 0.95rem;
  text-wrap: pretty;
}
</style>

<!--
Supporting slide, no clicks. Use if asked about single-cell-study limitations.
Read the panels from top left to bottom right.
These limitations follow Chapter 5's discussion, matching the submitted paper.

Suggested delivery: “The 51% snow and 72% rain contrasts do not measure this
cell's share of precipitation. Changing shear and overlapping CTGC
precipitation may both affect the bands, but their relative roles remain
unresolved. The fixed footprints may miss instantaneous streak boundaries,
and the estimated rates depend on reflectivity–rate relations. Finally, one
cell cannot establish a population mean or its contribution to storm-total
precipitation.”

Supporting detail for discussion and questions, not the timed delivery:

Attribution: The 51% liquid-equivalent snow-rate and 72% rain-rate enhancements
compare rates inside versus outside the layer-specific footprints. They are
spatial contrasts associated with persistent reflectivity enhancements, not
the tracked cell's contribution or a fraction of storm-total precipitation.
Both regions may include other CTGCs and pre-existing precipitation; the
outside region is not a control without generating cells.

Unresolved mechanisms: Changing shear and overlapping CTGC precipitation may
both contribute to the less distinct north–south band pattern, but their
relative roles remain unresolved. The observed connection is consistent with
seeder–feeder growth, not a direct measurement of the growth mechanisms.
Three-dimensional winds, particle trajectories, cloud liquid water, and
ice-particle measurements would help constrain the processes and attribution.

Footprints and rate estimates: The upper-decile footprints come from time-mean
column-maximum reflectivity anomaly; they capture persistent features but may
miss the fall streak's instantaneous position and extent. Rates depend on the
chosen Z–S and Z–R relations and are estimates, not measured mass fluxes.
The paper tested p85, p90, and p95: snow-rate enhancement spans 49–51% and
rain-rate enhancement 68–75%. These ranges describe threshold sensitivity,
not confidence intervals or the total rate-estimation uncertainty.

Case scope: One selected cell in one winter storm cannot establish a population
mean or a storm-total precipitation contribution. Additional cases are needed
to assess which structural relationships and precipitation contrasts recur.

Sampling details for questions: Nine synchronized volume sets, six minutes
apart, can miss changes between scans. The 02:00 and 04:15 UTC soundings provide
thermodynamic context rather than continuous local measurements along the
02:54–03:42 UTC cell track. Keep these supporting constraints in the notes
rather than displacing the paper's principal limitations on the slide.
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
class: smoothing-synthetic
---

# Synthetic validation of DCT smoothing

<div class="synthetic-comparison-figure">
  <img src="../figures/dct-synthetic-input-row.png" alt="Paper Figure 2(a–c): synthetic ground truth, the same field with added noise of standard deviation 2, and the added noise pattern" />
  <img v-click="1" src="../figures/dct-synthetic-result-row.png" alt="Paper Figure 2(d–f): DCT-smoothed field with RMSE 0.263, spatial dynamic-kernel result with RMSE 0.241, and their small but nonzero difference on its own color scale" />
</div>

<img class="synthetic-field-scale" src="../figures/dct-synthetic-field-scale.png" alt="Shared field-value color scale for the synthetic truth, noisy data, and two smoothed fields" />

<p class="fine">Synthetic reflectivity-like field · Paper Figure 2(a–f). Noise and difference panels have separate scales.</p>

<!--
About 1 minute. First show the synthetic ground truth, noisy observation with added noise of standard deviation 2, and the noise pattern. This is an artificial reflectivity-like field, not the measured C-band RHI on the next slide. Click 1: reveal the paper's DCT-smoothed result, spatial dynamic-kernel result, and DCT-minus-dynamic-kernel difference. Both remove much of the speckle and preserve the broad structures. The DCT and spatial outputs are visually nearly indistinguishable, but not numerically identical: their RMSEs against the known truth are 0.263 and 0.241, respectively. The difference panel uses a separate narrow scale and shows small structured discrepancies, especially near edges; do not call the outputs exactly equal or confuse this with an error-to-truth panel. These are the boxcar comparisons from panels (a)–(f) of the paper's Figure 2. The shared field-value scale is shown below, while the noise and difference panels retain their own colorbars. Next move from controlled synthetic data to the real C-band radar comparison.
-->

---
class: figure-slide
---

# Backup: DCT and spatial smoothing on radar data

<div class="fig">
  <img src="../figures/backup-dct-radar.png" alt="C-band radar field smoothed by a spatial dynamic kernel and by the DCT" />
</div>

<p class="fine">23 Feb 2022, 02:28 UTC. Window of 5 pixels. Difference is the rightmost column of the comparison.</p>

---
class: convolution-cartesian
---

# Backup: Gaussian weighting on a Cartesian grid

<div class="convolution-demo">
  <div class="convolution-demo-labels"><span>Noisy input</span><span>Smoothed output</span></div>
  <div class="convolution-canvas" role="img" aria-label="Backup animation of a synthetic Cartesian grid: Gaussian weights appear as dots sized by distance from the center; on the first click the center average appears, then the weighting glides row by row revealing each output value.">
    <CuManim :steps="2" :width="1080" :height="320" :construct="cartesianGaussianConvolution" />
    <svg v-if="clicks === 0" class="convolution-first-frame" viewBox="0 0 1080 390" aria-hidden="true">
      <rect v-for="(cell, index) in cartesianGaussianPreview.input" :key="`in-${index}`" :x="cell.x" :y="cell.y" :width="cell.w" :height="cell.h" :fill="cell.fill" />
      <rect v-for="(cell, index) in cartesianGaussianPreview.backing" :key="`back-${index}`" :x="cell.x" :y="cell.y" :width="cell.w" :height="cell.h" :fill="cell.fill" />
      <circle v-for="(dot, index) in cartesianGaussianPreview.dots" :key="`dot-${index}`" :cx="dot.x" :cy="dot.y" :r="dot.r" fill="#fff1c4" fill-opacity="0.8" />
      <path :d="`M${cartesianGaussianPreview.arrowShaft.x1},${cartesianGaussianPreview.arrowShaft.y1} L${cartesianGaussianPreview.arrowShaft.x2},${cartesianGaussianPreview.arrowShaft.y2}`" stroke="#cfb87c" stroke-width="6" stroke-linecap="round" fill="none" />
      <polygon :points="cartesianGaussianPreview.arrowTip.map(point => `${point.x},${point.y}`).join(' ')" fill="#cfb87c" />
    </svg>
  </div>
  <p class="convolution-demo-caption">Illustrative, evenly spaced grid · <strong>Gaussian: center-weighted mean</strong></p>
</div>

<script setup>
import { useNav } from '@slidev/client'
import { cartesianGaussianConvolution, cartesianGaussianPreview } from '../scenes/convolution'

const { clicks } = useNav()
</script>

<p class="fine">Same synthetic field as the boxcar illustration · Gaussian sigma 0.85 cells.</p>

<!--
Use if asked about kernel choice. Same synthetic, complete field as the boxcar illustration. Click 1: the Gaussian-weighted average at the center appears at the corresponding output cell. Click 2: the weighting glides along the same row-by-row path with dot sizes tracking it, revealing each Gaussian output value in sync. Dots are sized by the same discrete Gaussian, sigma 0.85 cells, truncated to three-by-three samples and normalized for the output. This is an illustration of center-weighted averaging, not a comparison of method performance.
-->

---
class: figure-slide
---

# Backup: a hard spectral cutoff rings

<div class="fig">
  <img src="../figures/backup-gibbs.png" alt="Gibbs ringing from an ideal low-pass filter compared with a Gaussian DCT taper" />
</div>

<p class="fine">The talk uses a Gaussian taper, not a hard cutoff.</p>

---
class: figure-slide
---

# Backup: periodic boundaries wrap

<div class="fig">
  <img src="../figures/backup-boundary.png" alt="One-dimensional comparison of periodic and reflective smoothing at the edges of a non-periodic signal" />
</div>

<p class="fine">Reflective DCT follows the local trend. Periodic treatment pulls the edges toward the opposite end.</p>

---
class: figure-slide
---

# Backup: gaps, without filling them first

<div class="fig">
  <img src="../figures/backup-polar-radar.png" alt="DOW6 reflectivity smoothed at two window sizes, including beam-blockage gaps" />
</div>

<p class="fine">DOW6, 23 Feb 2022. Periodic azimuth, reflective range. Blocked sectors stay unsupported.</p>

---
class: figure-slide
---

# Backup: the variance can flag outliers

<div class="fig">
  <img src="../figures/backup-outliers.png" alt="Synthetic wind field with injected outliers and detections from local statistics" />
</div>

<p class="fine">A validation of the local statistics, not a result of the storm.</p>

---
class: figure-slide
---

# Backup: two soundings, and the wind in between

<div class="fig">
  <img src="../figures/backup-sounding.png" alt="Sorel soundings at 02:00 and 04:15 UTC and DOW6 VAD winds" />
</div>

<p class="fine">Sorel, 02:00 and 04:15 UTC. Gray band is the 5.5–8 km generating-cell layer.</p>

<!--
Use for environment questions. Moisture and shear are context. They are not a demonstrated cause of the life cycle.
-->

---
class: figure-slide
---

# Backup: the storm at 03:00 UTC

<div class="fig">
  <img src="../figures/backup-synoptic.png" alt="ERA5 synoptic maps at 850 and 500 hPa on 23 February 2022" />
</div>

<p class="fine">ERA5. The green star is DOW6. Not a synoptic analysis of the cells.</p>

---
class: figure-slide
---

# Backup: where the boundaries were

<div class="fig">
  <img src="../figures/lifecycle-maps.png" alt="Maps of identified generating-cell areas at four times" />
</div>

<p class="fine">Set 1 in blue on the insets. Larger markers are merged boundaries, not necessarily single cells.</p>

---
class: figure-slide
---

# Backup: the same cell in $Z_{DR}$

<div class="fig">
  <img src="../figures/backup-single-cell-zdr.png" alt="Differential reflectivity sequence for the tracked generating cell" />
</div>

<p class="fine">Same track as the reflectivity sequence. The population's $Z_{DR}$ rise has an individual-cell example.</p>

---
class: figure-slide
---

# Backup: mid-level precipitation the streak meets

<div class="fig">
  <img src="../figures/backup-midlevel.png" alt="Reflectivity anomaly in the 3.5 to 5 km layer" />
</div>

<p class="fine">3.5–5 km. The fall streak overlaps structures that are already there.</p>

---
class: figure-slide
---

# Backup: the tracked cell in the population

<div class="fig">
  <img src="../figures/backup-cell-context.png" alt="Generating-cell population and the selected cell at nine analysis times" />
</div>

<p class="fine">Nine analysis times, 02:54–03:42 UTC. The 3D cell is one member of Set 1.</p>

---
class: local-math
---

# Local mean, variance, and support

<p class="local-math-lead">One shared denominator from the filtered mask.</p>

<div class="local-eq-rows">
<div class="local-eq-row">
<div class="local-eq-label">Data density</div>
<div class="local-eq-math">

$$
\rho = \mathcal{S}_g\{m\}
$$

</div>
</div>
<div class="local-eq-row">
<div class="local-eq-label">Mean</div>
<div class="local-eq-math">

$$
\mu = \mathcal{S}_g\{x \cdot m\} / \rho
$$

</div>
</div>
<div class="local-eq-row">
<div class="local-eq-label">Variance, std</div>
<div class="local-eq-math">

$$
\sigma^2 = \mathcal{S}_g\{x^2 \cdot m\} / \rho - \mu^2, \quad \sigma = \sqrt{\sigma^2}
$$

</div>
</div>
<div class="local-eq-row">
<div class="local-eq-label">Effective number</div>
<div class="local-eq-math">

$$
N_{\mathrm{eff}} = A\,\rho
$$

</div>
</div>
<div class="local-eq-row">
<div class="local-eq-label">Area</div>
<div class="local-eq-math">

$$
A = \prod_d W_d, \quad A_{\mathrm{polar}}(r) = W_{\mathrm{range}} \cdot W_{\mathrm{az,grid}}(r)
$$

</div>
</div>
</div>

<!--
About 80 seconds. x is the observed field and m is 1 where retained, 0 where missing or excluded. S_g is the spectral smoothing operator: transform, multiply by H_g, invert. The filtered mask ρ is the shared denominator: normalizing the filtered values gives the mean, and normalizing the filtered squared values gives the second moment for variance and standard deviation. The same denominator measures available support through N_eff: ρ is the retained fraction, and A is the nominal window area — the product of axis widths on Cartesian grids, range-dependent on polar grids — so N_eff reads as the effective number of contributing grid cells. Zero placeholders never enter as zero-valued observations because the denominator removes their weight. The prefilled-field fallback applies only where ρ is below epsilon; screening weakly supported estimates is a separate analysis choice. Next: how the spectral operator implements boundaries.
-->


---
class: local-math
---

# Boundary conditions are part of the transform

<p class="local-math-lead">The choice of transform is also a boundary model for S<sub>g</sub>.</p>

<div class="local-math-center">

$$
\mathcal{S}_g\{f\} = \mathcal{T}^{-1}\{\mathcal{T}\{f\} \cdot H_g\}
$$

</div>

<div class="local-math-grid cols-2">
  <section class="local-math-card">
    <h2>Reflective (DCT-II)</h2>
    <svg class="local-boundary-svg" viewBox="0 0 300 70" aria-hidden="true">
      <line x1="10" y1="56" x2="290" y2="56" stroke="currentColor" stroke-width="1.2" opacity="0.6" />
      <rect class="ext" x="70" y="37" width="16" height="18" />
      <rect class="ext" x="90" y="43" width="16" height="12" />
      <rect class="orig" x="110" y="43" width="16" height="12" />
      <rect class="orig" x="130" y="37" width="16" height="18" />
      <rect class="orig" x="150" y="31" width="16" height="24" />
      <rect class="orig" x="170" y="25" width="16" height="30" />
      <rect class="orig" x="190" y="19" width="16" height="36" />
      <rect class="orig" x="210" y="13" width="16" height="42" />
      <rect class="ext" x="230" y="13" width="16" height="42" />
      <rect class="ext" x="250" y="19" width="16" height="36" />
    </svg>
    <p>Mirror at the ends. Finite axes.</p>

$$
\omega_k = \pi k / n
$$

  </section>
  <section class="local-math-card">
    <h2>Periodic (RFFT)</h2>
    <svg class="local-boundary-svg" viewBox="0 0 300 70" aria-hidden="true">
      <line x1="10" y1="56" x2="290" y2="56" stroke="currentColor" stroke-width="1.2" opacity="0.6" />
      <rect class="ext" x="70" y="19" width="16" height="36" />
      <rect class="ext" x="90" y="13" width="16" height="42" />
      <rect class="orig" x="110" y="43" width="16" height="12" />
      <rect class="orig" x="130" y="37" width="16" height="18" />
      <rect class="orig" x="150" y="31" width="16" height="24" />
      <rect class="orig" x="170" y="25" width="16" height="30" />
      <rect class="orig" x="190" y="19" width="16" height="36" />
      <rect class="orig" x="210" y="13" width="16" height="42" />
      <rect class="ext" x="230" y="43" width="16" height="12" />
      <rect class="ext" x="250" y="37" width="16" height="18" />
    </svg>
    <p>Repeat end to start. Circular azimuth.</p>

$$
\omega_k = 2\pi k / n
$$

  </section>
</div>

<p class="fine">Gaussian example: H<sub>g</sub>[k] = exp[−½(sω<sub>k</sub>)²], s = W/√12. Same form, different grid. Boxcar and discrete boxcar are also implemented.</p>

<!--
Read the center equation as: S sub g of f equals the inverse transform of the transform of f, times H sub g. S_g is the spectral smoother, T is the forward transform, and H_g is the kernel response. The same operator applies to data, mask, squared data, or a prefilled field; it is not itself a local mean. The transform is also the boundary model: DCT-II, read D C T two, means half-sample symmetric reflective extension; RFFT means periodic extension. The bars are schematic: gold is the finite signal of n samples, muted bars the assumed continuation — mirrored at the edges on the left, wrapped end to start on the right. Below, omega sub k equals pi k over n is the DCT frequency grid, and omega sub k equals two pi k over n is the periodic grid; k is the wavenumber, the integer frequency-bin index; omega is the frequency in radians per grid sample; and n is the number of samples. The Gaussian response H sub g of k is e to the minus one-half s omega sub k squared, with s equals W over root twelve linking s to the window width W. Same functional form, different grid. Next: does the boundary choice matter in practice?
-->


---
class: local-math
---

# Spectral operations in N dimensional space

<p class="local-math-lead">Separability: one operator, two equivalent paths.</p>

<div class="local-math-center">

$$
\begin{aligned}
\mathcal{S}^{(D)}\{f\} &= \mathcal{T}^{-1}\{\mathcal{T}\{f\} \cdot H_D\} \\
H_D(k_1,\ldots,k_D) &= \prod_{d=1}^{D} H_d(k_d), \quad \mathcal{S}^{(D)} = \mathcal{S}_D \circ \cdots \circ \mathcal{S}_1
\end{aligned}
$$

</div>

<svg class="local-paths-svg" viewBox="40 0 366 134" role="img" aria-label="Single D-dimensional multiply by H D is equivalent to successive one-dimensional passes along x, then y, then z">
  <rect class="vol" x="158" y="8" width="40" height="40" />
  <path class="parrow" d="M203 28h40m-7-7 7 7-7 7" />
  <text class="pop" x="223" y="20" text-anchor="middle">×H_D</text>
  <rect class="vol vol-out" x="248" y="8" width="40" height="40" />
  <text class="equiv" x="223" y="86" text-anchor="middle">≡</text>
  <rect class="vol" x="70" y="92" width="36" height="36" />
  <path class="parrow" d="M111 110h44m-7-7 7 7-7 7" />
  <text class="pop" x="133" y="102" text-anchor="middle">×H_1</text>
  <text class="paxis" x="133" y="126" text-anchor="middle">x</text>
  <rect class="vol" x="160" y="92" width="36" height="36" />
  <path class="parrow" d="M201 110h44m-7-7 7 7-7 7" />
  <text class="pop" x="223" y="102" text-anchor="middle">×H_2</text>
  <text class="paxis" x="223" y="126" text-anchor="middle">y</text>
  <rect class="vol" x="250" y="92" width="36" height="36" />
  <path class="parrow" d="M291 110h44m-7-7 7 7-7 7" />
  <text class="pop" x="313" y="102" text-anchor="middle">×H_3</text>
  <text class="paxis" x="313" y="126" text-anchor="middle">z</text>
  <rect class="vol vol-out" x="340" y="92" width="36" height="36" />
</svg>

<p class="fine">Each axis keeps its own width. Apply the full operator to x·m, x²·m, and m, then form ratios.</p>

<!--
About 50 seconds. The D-dimensional smoother is one operator: transform, multiply once by H_D, invert — with H_D the product of the axis responses. By separability this equals successive one-dimensional passes: S_1 along x, then S_2 along y, then S_3 along z. The circle means then, applied right to left, so S_1 runs first. Each axis keeps its own width. As before, apply the full multidimensional operator to the masked field, masked squares, and mask, then form the normalized ratios; do not average separately normalized intermediates. Next: the same idea with mixed boundaries on a polar grid.
-->


---
class: smoothing-polar-dct
---

# Polar filtering with mixed boundaries

<p class="polar-dct-lead">Apply the separable filter to the two dimensions of the polar field, X(θ, r).</p>

<div class="polar-dct-passes">

<section class="polar-dct-pass">

## 1 · Azimuth pass — range-dependent width

<div class="polar-dct-detail">

$$
Y_{\mathrm{az}} = \operatorname{IRFFT}\!\left[\operatorname{RFFT}(X) \cdot H_{\mathrm{az}}\right]
$$

At each range index, the grid width follows $W_{\mathrm{az,grid}}(r) = W_{\mathrm{azimuth}}/(r\Delta\theta)$.

</div>

</section>

<section class="polar-dct-pass">

## 2 · Range pass — fixed reflective width

<div class="polar-dct-detail">

$$
Y = \operatorname{IDCT}_{r}\!\left[\operatorname{DCT}_{r}(Y_{\mathrm{az}}) \cdot H_{r}\right]
$$

At each angle, multiply range coefficients by the same fixed-width response.

</div>

</section>

</div>

<p class="spectral-summary">Full-circle: periodic azimuth with reflective range; partial-sector: reflective azimuth.</p>

<!--
About 50 seconds. Polar arrays are indexed as azimuth by range. To hold physical azimuth width approximately fixed, the kernel width in grid units is W_az,grid(r) = W_azimuth / (r delta-theta), where r is the 1-based range index and delta-theta is azimuth spacing in radians. This r is an index convention, distinct from physical range discussed in the smoothing section. Because that width varies with range, H_az is a range-dependent 2D transfer-function array, not one global 2D multiplication. For a full-circle scan the implemented mixed mode is periodic azimuth with reflective range, shown here with RFFT and IRFFT; a partial-sector scan need not wrap and uses reflective DCT in azimuth. Stage 2 filters the intermediate field Y_az along range with reflective DCT-II. Apply the same two-stage operator to masked values, masked squares, and mask, then normalize. Polar effective area is range-dependent: A_polar(r) = W_range times W_az,grid(r). Next: validation, starting with structured 3D flow.
-->

---
class: figure-slide
---

# Boundary treatment changes the edges

<p class="local-criterion">Edge RMSE over the first and last W samples: 0.38 reflective versus 2.52 periodic.</p>

<div class="fig">
  <img src="../figures/local-stats-boundary.png" alt="One-dimensional non-periodic signal: reflective DCT follows the trend at the edges while periodic treatment wraps toward the opposite end" />
</div>

<p class="fine">1D non-periodic signal, N = 200, W = 15 Gaussian. All-domain RMSE 0.28 versus 1.00. Dashed boxes mark the edge regions.</p>

<!--
About 45 seconds. A 1D non-periodic synthetic signal with trend plus Gaussian noise, matched W = 15 Gaussian kernel, 5 seeds. Reflective DCT follows local trend continuity; periodic treatment pulls the edges toward the opposite end. All-domain RMSE is about 0.28 reflective versus 1.00 periodic; edge-only RMSE over the first and last W samples is about 0.38 versus 2.52. This is a boundary-model check, not a general accuracy claim. Next: what is new in this work.
-->


---
class: figure-slide
---

# Outlier threshold sensitivity

<p class="local-criterion">

$$
|\,\|v\| - \mu_{\|v\|}\,| > k\,\sigma_{\|v\|}
$$

</p>

<div class="fig">
  <img src="../figures/local-stats-threshold.png" alt="Threshold sweep for 3D outlier identification: precision rises and recall falls with increasing k; F1 peaks near k = 3.0" />
</div>

<p class="fine">Precision is the fraction of detections that are true anomalies; recall is the fraction of true anomalies found. At k = 2.0: 0.14 and 0.86. At k = 3.0: 0.92, 0.77, F1 0.84. At k = 4.0: 1.00 and 0.63. Mean F1 peaks at k = 3.0 within the tested 2.0–6.0 sweep.</p>

<!--
About 40 seconds. Threshold sweep over k from 2.0 to 6.0, mean plus/minus std across seeds. Lower k finds more with more false alarms; higher k is cleaner but misses more. Mean F1 peaks at k = 3.0 within the tested sweep. Recommended practice is iterative: compute local statistics, flag with the z-score criterion, exclude flagged points from the mask, and recompute so outliers do not inflate local spread. Window width, support, and boundary mode also affect screening. Transition from synthetic winds to real radar.
F1 is the harmonic mean of precision and recall, so 0.84 means the k = 3.0 setting balances both.
-->
