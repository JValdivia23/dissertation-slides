---
layout: section
class: paper-title
title: Spectral-Domain Local Statistics with Missing-Data Support
---

<div class="paper-title-content">
  <p class="paper-kicker">Paper 2 · Local statistics</p>
  <h1>Spectral-Domain Local Statistics with Missing-Data Support</h1>
  <h2>For Cartesian and Polar Grids</h2>
  <div class="paper-authors">
    <p><strong>Jairo M. Valdivia-Prado</strong></p>
    <p>Coauthors: Will Chapman · Katja Friedrich</p>
  </div>
  <p class="paper-affiliation">Department of Atmospheric and Oceanic Sciences · University of Colorado Boulder</p>
  <p class="paper-citation">Under review at <em>Computers &amp; Geosciences</em> · Preprint arXiv:2604.22721 · doi:10.48550/arXiv.2604.22721</p>
</div>

<!--
About 20 seconds. This is the second of four paper talks. Name the paper and its status once: under review at Computers and Geosciences, with an arXiv preprint. Do not call it published. Credit Will Chapman and Katja Friedrich. Start the paper's own problem on the next slide.
-->

---
class: local-math
---

# Local statistics on incomplete grids

<p class="local-math-lead">Background and data coverage change across the field.</p>

<svg class="local-problem-svg" viewBox="0 0 320 118" role="img" aria-label="Illustrative field with varying background, one unusual observation, and two missing patches">
  <rect x="8" y="8" width="100" height="102" fill="currentColor" fill-opacity="0.16" stroke="currentColor" stroke-width="1" opacity="0.9" />
  <rect x="108" y="8" width="104" height="102" fill="currentColor" fill-opacity="0.26" stroke="currentColor" stroke-width="1" opacity="0.9" />
  <rect x="212" y="8" width="100" height="102" fill="currentColor" fill-opacity="0.36" stroke="currentColor" stroke-width="1" opacity="0.9" />
  <rect x="24" y="20" width="44" height="28" fill="var(--cu-bg)" stroke="var(--cu-gold-accessible)" stroke-width="2" stroke-dasharray="5 3" />
  <rect x="232" y="62" width="52" height="30" fill="var(--cu-bg)" stroke="var(--cu-gold-accessible)" stroke-width="2" stroke-dasharray="5 3" />
  <circle cx="162" cy="60" r="12" fill="none" stroke="var(--cu-gold)" stroke-width="2.6" />
  <circle cx="162" cy="60" r="3.4" fill="var(--cu-gold)" />
  <circle cx="128" cy="34" r="2.8" fill="currentColor" opacity="0.7" />
  <circle cx="188" cy="86" r="2.8" fill="currentColor" opacity="0.7" />
  <circle cx="262" cy="34" r="2.8" fill="currentColor" opacity="0.7" />
  <circle cx="60" cy="84" r="2.8" fill="currentColor" opacity="0.7" />
</svg>

<div class="local-math-grid cols-3">
<section class="local-math-card">
<h2>Background changes</h2>
<p>An observation is evaluated against its neighborhood, not a domain constant.</p>
</section>
<section class="local-math-card">
<h2>Variability changes</h2>
<p>Neighborhood spread sets what counts as unusual at that location.</p>
</section>
<section class="local-math-card">
<h2>Coverage changes</h2>
<p>Missing gates change how much information supports each neighborhood.</p>
</section>
</div>

<p class="local-math-lead">How can local mean and variability be estimated on incomplete grids while accounting for data support and boundary conditions?</p>

<!--
About 50 seconds. Real grids have beam blockage, clutter filtering, and masked gates. The background varies across the field, so one domain-wide average is not the right reference. Variability also varies: the same deviation can be routine in one neighborhood and unusual in another. Missing observations change the comparison further because two otherwise identical neighborhoods can rest on different amounts of valid data. The question for this paper is how to estimate local mean and variability efficiently on incomplete grids while tracking support and using boundary conditions suited to the grid. Paper 1 interpolates gaps before smoothing and reports a smoothed field; this paper weights valid observations and also reports variability and support.
-->

---
class: local-math local-contrib
---

# From smoothing to support-aware statistics

<p class="local-math-lead">Normalized convolution extends the spectral smoother to incomplete data.</p>

<div class="local-pipeline-fig">
  <img src="../figures/local-stats-pipeline.png" alt="Spectral normalized-convolution pipeline on a 2D field with missing values, producing local mean, standard deviation, and effective sample count" />
</div>

<div class="local-math-grid cols-3">
<section class="local-math-card">
<h2>Beyond the mean</h2>
<p>Local mean, variance, standard deviation, and effective support.</p>
</section>
<section class="local-math-card">
<h2>Mask-weighted</h2>
<p>Filter data and mask, then normalize by local support.</p>
</section>
<section class="local-math-card">
<h2>Geometry and stability</h2>
<p>Cartesian and polar operators with explicit boundaries and low-support rules.</p>
</section>
</div>

<p class="fine">2D illustration with missing values in gray; inset shows μ, σ, and N<sub>eff</sub>. Normalized convolution is the foundation; spectral operators and safeguards are the extension.</p>

<!--
About 50 seconds. The pipeline figure is from the manuscript: a 2D field with missing values, spectral filtering with DCT-II and a Gaussian response, and the resulting local mean, standard deviation, and effective sample count in the zoomed inset. Relative to the prior DCT smoothing work, this paper generalizes mean-only interpolation-first smoothing by deriving normalized statistics beyond the mean, unifying Cartesian and polar forms under explicit boundary modes, formalizing stability and support diagnostics, and adding threshold-based 3D outlier validation. Normalized convolution itself is the established foundation; the spectral integration and the stated safeguards are the extension. Next: the central estimator.
-->

---
class: local-math
---

# Normalized convolution with missing data

<p class="local-math-lead">A weighted average over valid observations only.</p>

<div class="local-math-center">

$$
\mu_i = \frac{\sum_j w_{ij} m_j x_j}{\sum_j w_{ij} m_j}
$$

</div>

<div class="local-math-grid cols-3">
<section class="local-math-card">
<h2>Smooth the values</h2>
<p>Zero-mask the field, then filter.</p>

$$
z = x \cdot m
$$

$$
\mathcal{S}_g\{z\}
$$

<p>Example: (2 + 0 + 4) / 3 = 2.</p>
</section>
<section class="local-math-card">
<h2>Smooth the mask</h2>
<p>Filter where data exist.</p>

$$
m = 1 \text{ observed},\; 0 \text{ missing}
$$

$$
d = \mathcal{S}_g\{m\}
$$

<p>Example: (1 + 0 + 1) / 3 = 2/3.</p>
</section>
<section class="local-math-card">
<h2>Divide by support</h2>
<p>Missing gates carry zero weight.</p>

$$
\mu = \mathcal{S}_g\{z\} / d
$$

<p>Example: 2 / (2/3) = 3.</p>
</section>
</div>

<p class="fine">Three-point boxcar on [2, missing, 4]. Here w<sub>ij</sub> are kernel weights and S<sub>g</sub>{f} = T<sup>−1</sup>{T{f} · H<sub>g</sub>}. Gaussian, boxcar, and discrete boxcar kernels are retained from the prior DCT study.</p>

<!--
About 50 seconds. Here x is the observed field and m is 1 where valid, 0 where missing. Define z as x times m: retain observed values and put explicit zero at missing locations. S_g is the spectral smoothing operator: transform, multiply by H_g, invert. The denominator d is the filtered mask. The three-point boxcar example is a spatial illustration of the same ratio: filtered values 2, filtered mask 2/3, normalized mean 3. Zero placeholders never enter as zero-valued observations because the denominator removes their weight. Carry this example forward: mean 3, and later variance 1 with effective support 2 of 3 nominal samples.
-->

---
class: local-math
---

# Local variance from the same operator

<p class="local-math-lead">Filter the squared values on a third path, then form the moments.</p>

<div class="local-math-center">

$$
M_2 = \mathcal{S}_g\{x^2 \cdot m\} / d, \quad \sigma^2 = \max(0, M_2 - \mu^2), \quad \sigma = \sqrt{\sigma^2}
$$

</div>

<div class="local-math-grid cols-3">
<section class="local-math-card">
<h2>Mean</h2>
<p>Values over support.</p>

$$
\mu = \mathcal{S}_g\{z\} / d
$$

<p>Example mean: 3.</p>
</section>
<section class="local-math-card">
<h2>Second moment</h2>
<p>Square before filtering.</p>

$$
x^2 \cdot m
$$

<p>Example: (4 + 0 + 16) / 3 divided by 2/3 is 10.</p>
</section>
<section class="local-math-card">
<h2>Spread</h2>
<p>Center, then clamp and root.</p>

$$
\sigma^2 = 10 - 9 = 1
$$

<p>Example std: 1.</p>
</section>
</div>

<p class="fine">Population-style local variance within window support, not Bessel-corrected. The clamp handles floating-point cancellation. Since m is binary, z² and x²·m agree.</p>

<!--
About 50 seconds. One spectral operator supplies all three filtered inputs: masked values, masked squared values, and the mask. M_2 is the normalized second moment. Variance is M_2 minus mu squared, clamped at zero before the square root to avoid small negative values from floating-point cancellation. This is population-style variance within window support, not a Bessel-corrected sample variance. The same three-point example continues: M_2 is 10, mu squared is 9, variance is 1, standard deviation is 1. The denominator-floor rule for the mean also applies to M_2. Next: how much data supports each location?
-->

---
class: local-math
---

# Data support and stability

<p class="local-math-lead">The denominator also measures available support.</p>

<div class="local-math-center">

$$
\rho = \mathrm{clip}(d, 0, 1), \quad N_{\mathrm{eff}} = \rho \cdot A
$$

</div>

<div class="local-math-grid cols-2">
<section class="local-math-card">
<h2>Effective support</h2>
<p>Filtered mask times window area.</p>

$$
A = \prod_{d=1}^{D} W_d
$$

<p>Same example: (2/3) × 3 = 2. Cartesian: product of axis widths. Polar: range-dependent area.</p>
</section>
<section class="local-math-card">
<h2>Low-support fallback</h2>
<p>Numerical floor with prefilled replacement.</p>

$$
\mu = \mathcal{S}_g\{z\}/d, \; d \ge \epsilon
$$

$$
\mu = \mathcal{S}_g\{\bar{x}\}, \; d \lt \epsilon
$$

<p>Implementation floor ε is 1e-3. Same rule for the second moment.</p>
</section>
</div>

<p class="fine"><em>N</em><sub>eff</sub> is a support diagnostic, not an uncertainty. Screening such as <em>N</em><sub>eff</sub> below half of <em>A</em> is an analysis choice. Prefill uses iterative smoothing with nearest completion, only where support is insufficient.</p>

<!--
About 50 seconds. Rho is the smoothed mask clipped to [0,1]; N_eff is rho times the local window area A in grid units. The running example gives N_eff of 2 from 3 nominal samples. Keep two thresholds distinct. Epsilon of 1e-3 is the numerical floor in the implementation, with a prefilled-field fallback only in under-supported regions. A screening rule such as excluding estimates below half of nominal area is a separate analysis choice for weakly constrained neighborhoods, because variance and anomaly scores there are weakly constrained regardless of numerical stability. The same floor applies to the second moment. Next: how the spectral operator implements boundaries.
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
      <rect class="ext" x="70" y="19" width="16" height="36" />
      <rect class="ext" x="90" y="27" width="16" height="28" />
      <rect class="orig" x="110" y="27" width="16" height="28" />
      <rect class="orig" x="130" y="19" width="16" height="36" />
      <rect class="orig" x="150" y="31" width="16" height="24" />
      <rect class="orig" x="170" y="15" width="16" height="40" />
      <rect class="orig" x="190" y="23" width="16" height="32" />
      <rect class="orig" x="210" y="29" width="16" height="26" />
      <rect class="ext" x="230" y="29" width="16" height="26" />
      <rect class="ext" x="250" y="23" width="16" height="32" />
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
      <rect class="ext" x="70" y="23" width="16" height="32" />
      <rect class="ext" x="90" y="29" width="16" height="26" />
      <rect class="orig" x="110" y="27" width="16" height="28" />
      <rect class="orig" x="130" y="19" width="16" height="36" />
      <rect class="orig" x="150" y="31" width="16" height="24" />
      <rect class="orig" x="170" y="15" width="16" height="40" />
      <rect class="orig" x="190" y="23" width="16" height="32" />
      <rect class="orig" x="210" y="29" width="16" height="26" />
      <rect class="ext" x="230" y="27" width="16" height="28" />
      <rect class="ext" x="250" y="19" width="16" height="36" />
    </svg>
    <p>Repeat end to start. Circular azimuth.</p>

$$
2\pi k / n
$$

  </section>
</div>

<p class="fine">Gaussian example: H<sub>g</sub>[k] = exp[−½(sω<sub>k</sub>)²], s = W/√12. Same form, different grid. Boxcar and discrete boxcar are also implemented.</p>

<!--
About 45 seconds. S_g can be applied to data, mask, squared data, or a prefilled field; it is not itself a local mean. The transform is also a boundary model. DCT-II means half-sample symmetric reflective extension; DFT/RFFT means periodic extension. The bars are schematic: gold is the finite signal, muted bars show the assumed continuation. The Gaussian response has the same functional form under both modes but is evaluated on different frequency grids for n samples. Next: does the boundary choice matter in practice?
-->

---
class: figure-slide
---

# Boundary treatment changes the edges

<p class="local-criterion">Edge RMSE over the first and last W samples: 0.38 reflective versus 2.52 periodic.</p>

<div class="fig">
  <img src="../figures/local-stats-boundary.png" alt="One-dimensional non-periodic signal: reflective DCT follows the trend at the edges while periodic treatment wraps toward the opposite end" />
</div>

<p class="fine">1D non-periodic signal, N = 200, W = 15 Gaussian, mean over 5 seeds. All-domain RMSE 0.28 versus 1.00. Dashed boxes mark the edge regions.</p>

<!--
About 45 seconds. A 1D non-periodic synthetic signal with trend plus Gaussian noise, matched W = 15 Gaussian kernel, 5 seeds. Reflective DCT follows local trend continuity; periodic treatment pulls the edges toward the opposite end. All-domain RMSE is about 0.28 reflective versus 1.00 periodic; edge-only RMSE over the first and last W samples is about 0.38 versus 2.52. This is a boundary-model check, not a general accuracy claim. Transition from boundaries to dimensionality.
-->

---
class: local-math
---

# Cartesian filtering in N dimensions

<p class="local-math-lead">One field, filtered along each axis in turn.</p>

<div class="local-math-center">

$$
H_D(k_1,\ldots,k_D) = \prod_{d=1}^{D} H_d(k_d), \quad \mathcal{S}^{(D)} = \mathcal{S}_D \circ \cdots \circ \mathcal{S}_1
$$

</div>

<div class="local-dim-chain">
  <div class="local-dim-box">Pass 1<br />filter the volume along x</div>
  <span aria-hidden="true">→</span>
  <div class="local-dim-box">Pass 2<br />filter the same volume along y</div>
  <span aria-hidden="true">→</span>
  <div class="local-dim-box">Pass 3<br />filter the same volume along z</div>
</div>

<p class="fine">Each axis keeps its own width; the 3D wind test uses (3, 7, 7). Apply the full operator to x·m, x²·m, and m, then form ratios. Do not average separately normalized intermediates.</p>

<!--
About 40 seconds. For Cartesian D-dimensional smoothing, the transfer function is the product of axis transfer functions. Implementation reduces the operation to sequential 1D spectral multiplications while preserving spectral efficiency for large windows. Each dimension keeps its own width; the cyclone-wind validation uses windows (3, 7, 7). Apply the full multidimensional operator to the masked field, masked squares, and mask, then form the normalized moments. Normalization follows the complete filtering operation. Next: the same idea with mixed boundaries on a polar grid.
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
Y_{\mathrm{az}} = \operatorname{IRFFT}\!\left[\operatorname{RFFT}(X) \odot H_{\mathrm{az}}\right]
$$

At each range index, the grid width follows $W_{\mathrm{az,grid}}(r) = W_{\mathrm{azimuth}}/(r\Delta\theta)$.

</div>

</section>

<section class="polar-dct-pass">

## 2 · Range pass — fixed reflective width

<div class="polar-dct-detail">

$$
Y = \operatorname{IDCT}_{r}\!\left[\operatorname{DCT}_{r}(Y_{\mathrm{az}}) \odot H_{r}\right]
$$

At each angle, multiply range coefficients by the same fixed-width response.

</div>

</section>

</div>

<p class="spectral-summary">Full-circle: periodic azimuth with reflective range; partial-sector: reflective azimuth. Here r is the range index and Δθ is azimuth spacing. The azimuth response is range-dependent, so the intermediate field is required.</p>

<!--
About 50 seconds. Polar arrays are indexed as azimuth by range. To hold physical azimuth width approximately fixed, the kernel width in grid units is W_az,grid(r) = W_azimuth / (r delta-theta), where r is the 1-based range index and delta-theta is azimuth spacing in radians. This r is an index convention, distinct from physical range discussed in the smoothing section. Because that width varies with range, H_az is a range-dependent 2D transfer-function array, not one global 2D multiplication. For a full-circle scan the implemented mixed mode is periodic azimuth with reflective range, shown here with RFFT and IRFFT; a partial-sector scan need not wrap and uses reflective DCT in azimuth. Stage 2 filters the intermediate field Y_az along range with reflective DCT-II. Apply the same two-stage operator to masked values, masked squares, and mask, then normalize. Polar effective area is range-dependent: A_polar(r) = W_range times W_az,grid(r). Next: validation, starting with structured 3D flow.
-->

---
class: figure-slide
---

# Outlier detection in a 3D wind field

<p class="local-criterion">Flag a wind-speed residual larger than k local standard deviations.</p>

<p class="local-criterion">

$$
|\,\|v\| - \mu_{\|v\|}\,| > k\,\sigma_{\|v\|}
$$

</p>

<div class="fig">
  <img src="../figures/local-stats-outliers.png" alt="Synthetic cyclone-like wind field with injected anomalies, the local-mean estimate, and detected outliers at threshold 3.0" />
</div>

<p class="fine">Synthetic cyclone-like wind, 18 × 96 × 96, windows (3, 7, 7). At k = 3.0: precision 0.92, recall 0.77, F1 0.84, mean over 5 seeds.</p>

<!--
About 50 seconds. An idealized smooth 3D cyclone-like wind with Gaussian perturbations of sigma 0.14 per component, plus sparse injected vector anomalies of amplitude 1.25 to 2.25 as ground truth at 0.3% of grid points. Scoring uses wind-speed residuals against local statistics: flag where the absolute wind-speed residual exceeds k times local sigma. Panel (a) shows injected anomalies in red against structured flow; (b) shows the local-mean field; (c) separates true positives, false positives, and missed points at k = 3.0. At k = 3.0, mean precision is about 0.92, recall about 0.77, F1 about 0.84. Signed-component global averages are near zero while valid shear keeps global spread large, which motivates neighborhood re-centering and re-scaling; this test reports local-detector skill against known anomalies. This is a synthetic validation, not storm data. Next: how the threshold trades false alarms against misses.
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
-->

---
class: figure-slide
---

# Local smoothing on a polar radar scan

<div class="fig">
  <img src="../figures/local-stats-polar.png" alt="DOW6 X-band reflectivity: raw field and smoothed fields at window widths 5 and 15, with full-domain views and central 20 km zooms" />
</div>

<p class="fine">DOW6 X-band, WINTRE-MIX, 23 Feb 2022. Top: full domain. Bottom: 20 km central zoom. Shared dBZ scale. Missing sectors carry zero weight. W = 5 preserves gradients; W = 15 suppresses small-scale variability. Qualitative single-dataset demonstration.</p>

<!--
About 50 seconds. Real-radar polar demonstration on uncorrected DOW6 reflectivity from the same 23 February 2022 event, following the dct_toolkit notebook workflow. W sets both the range width and the azimuth target width. Panels (a)–(c) are full-domain raw, W = 5, and W = 15; panels (d)–(f) are the matching 20 km central zooms. The operator uses mixed boundaries: periodic azimuth with reflective range. Despite extensive beam-blockage sectors, normalized convolution gives coherent local-mean estimates without obvious gap-driven artifacts, and no evident center-of-grid distortion appears even at W = 15. As expected, W = 5 preserves sharper gradients while W = 15 suppresses more small-scale variability; this is a tuning trade-off, not evidence for one globally optimal width. The evidence here is qualitative and dataset-specific. Next: what remains limited.
-->

---
class: smoothing-conclusions
---

# Project 2: limits

<div class="smoothing-conclusion-list">
  <section>
    <p>Sparse observations weaken estimates even when numerically stable.</p>
  </section>
  <section>
    <p>Window width and threshold shape detection.</p>
  </section>
  <section>
    <p>The radar demonstration is qualitative and dataset-specific.</p>
  </section>
</div>

<!--
About 35 seconds. Three qualifications. First, low-support regions can remain numerically stable yet weakly constrained; exclude or down-weight estimates where N_eff is a small fraction of nominal area. Second, outlier screening depends on threshold k, kernel width, support, and boundary mode; there is no single best setting from these tests. Third, the real-radar block shows plausible behavior on one dataset with large missing sectors; broader generalization needs more benchmarks, and non-binary certainty masks are not evaluated. These experiments also do not re-prove normalized-convolution fundamentals or re-benchmark transform scaling from the prior DCT work. Transition to the takeaways.
-->

---
class: smoothing-conclusions
---

# Project 2: Conclusions

<div class="smoothing-conclusion-list">
  <section>
    <p>Spectral filtering estimates local averages and variability from incomplete data.</p>
  </section>
  <section>
    <p>Matching boundary conditions to the grid reduces edge artifacts.</p>
  </section>
  <section>
    <p>Local statistics identify anomalies, but interpretation depends on available data.</p>
  </section>
</div>

<!--
About 35 seconds. Suggested delivery: “This extends the smoothing method to local statistics that account for missing observations and scan geometry.” Results use dct_toolkit at commit 9d3b60e. Future work should test more broadly against alternative baselines, expand sensitivity analyses, and evaluate non-binary certainty. This work is under review; cite the arXiv preprint, not a publication. The dissertation use of these statistics is the weighted background mean in Z-prime, introduced on the next slide. Then go to the population: the observational studies begin with how a cloud-top generating-cell population evolves.
-->

---

# The methods are how the cells get measured

- **Population:** smooth the perturbation, then contour at 5 dBZ
- **One cell:** local background mean per radar for $Z'$, merged by beam weight
- **The link:** the population track is the origin of the moving grid

<!--
About 30 seconds. This is the hinge. Keep the two method roles distinct. Population identification smooths the reflectivity perturbation and contours it; that path does not use the Paper 2 background estimator. For the tracked cell, each radar's smoothed reflectivity minus its Paper 2 weighted background mean gives that radar's Z-prime, and the radars are merged by beam weight so an unsampled voxel does not vote. Z-prime is therefore an anomaly relative to each radar's background, not a raw reflectivity composite or a rainfall rate. The population track supplies the moving-grid origin used in that merge. Then go to the storm.
-->
