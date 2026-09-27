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
class: smoothing-conclusions
---

# Local statistics with missing data

<div class="smoothing-conclusion-list">
  <section>
    <p>Estimate the local average without filling gaps first.</p>
  </section>
  <section>
    <p>Measure local variability around that average.</p>
  </section>
  <section>
    <p>Report the data support behind each estimate.</p>
  </section>
</div>

<!--
About 45 seconds. Paper 1 interpolates gaps before the DCT; this paper weights only valid observations where support is sufficient. Real grids have beam blockage, clutter filtering, and masked gates. Three outputs are needed at each location: the local average, the local variability, and how much valid data supports them. Support is a diagnostic for where an estimate is weakly constrained, not itself an uncertainty. Where support is too low, the implementation falls back to a filled field; that fallback is the exception, not the estimate. Transition to the filtering operator and its boundary model.
-->

---
class: local-math
---

# Boundary conditions are part of the transform

<p class="local-math-lead">The spectral operator filters in the transform domain.</p>

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
\omega_k = 2\pi k / n
$$

  </section>
</div>

<p class="fine">Gaussian example: H<sub>g</sub>[k] = exp[−½(sω<sub>k</sub>)²], s = W/√12. Same form, different grid. Boxcar and discrete boxcar are also implemented.</p>

<!--
About 1 minute. S_g is a linear spectral filter: transform, multiply by the transfer function H_g, invert. It can be applied to data, mask, squared data, or a prefilled field; it is not itself a local mean. The transform is also a boundary model. DCT-II with ortho normalization means half-sample symmetric reflective extension with Neumann-compatible interpretation; DFT/RFFT means periodic extension. The bars are schematic: gold is the finite signal, muted bars show the assumed continuation. Reflective mirrors the ends; periodic repeats the opposite end. The Gaussian response has the same functional form under both modes but is evaluated on different frequency grids: pi k / n reflective, 2 pi k / n periodic for n samples. Boxcar and discrete boxcar responses are also implemented; the discrete boxcar matches spatial discrete convolution on complete inputs. Next: does the boundary choice matter in practice?
-->

---
class: figure-slide
---

# Boundary treatment changes the edges

<div class="fig">
  <img src="../figures/local-stats-boundary.png" alt="One-dimensional non-periodic signal: reflective DCT follows the trend at the edges while periodic treatment wraps toward the opposite end" />
</div>

<p class="fine">1D non-periodic signal, N = 200, W = 15 Gaussian. Dashed boxes mark the edge regions.</p>

<!--
About 1 minute. A 1D non-periodic synthetic signal with trend plus Gaussian noise, matched W = 15 Gaussian kernel, 5 seeds. Reflective DCT follows local trend continuity; periodic treatment pulls the edges toward the opposite end. All-domain RMSE is about 0.28 reflective versus 1.00 periodic; edge-only RMSE over the first and last W samples is about 0.38 versus 2.52. This realization shows a mild left-right asymmetry under reflective DCT, consistent with different local slope context near each boundary. This is a boundary-model check, not a general accuracy claim. Transition from boundaries to missing data.
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
m = 1, 0
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

<p class="fine">Three-point boxcar on [2, missing, 4]. Gaussian, boxcar, and discrete boxcar kernels are retained from the prior DCT study.</p>

<!--
About 1 minute 15 seconds. Here x is the observed field and m is 1 where valid, 0 where missing. Define the zero-masked field z as x times m: retain observed values and put explicit zero at missing locations. S_g is the spectral smoothing operator from the prior slide: transform, multiply by H_g, invert. The denominator d is the filtered mask. The three-point boxcar example is a spatial illustration of the same ratio: filtered values 2, filtered mask 2/3, normalized mean 3. Zero placeholders never enter as zero-valued observations because the denominator removes their weight. Gaussian and boxcar kernels are retained because they gave the strongest efficiency-performance trade-off in the prior radar DCT study; the discrete boxcar is included because it matches spatial discrete convolution on complete inputs. Transition to the remaining moments.
-->

---
class: local-math
---

# Local variance from the same operator

<p class="local-math-lead">Filter the squared values on a third path, then form the moments.</p>

<div class="local-math-center">

$$
M_2 = \mathcal{S}_g\{z^2\} / d, \quad \sigma^2 = \max(0, M_2 - \mu^2), \quad \sigma = \sqrt{\sigma^2}
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
z^2 = x^2 \cdot m
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

<p class="fine">Population-style local variance within window support, not Bessel-corrected. The clamp handles floating-point cancellation.</p>

<!--
About 1 minute. One spectral operator supplies all three filtered inputs: z, z squared times m, and m. M_2 is the normalized second moment. Variance is M_2 minus mu squared, clamped at zero before the square root to avoid small negative values from floating-point cancellation in low-support regions. This is population-style variance within window support, not a Bessel-corrected sample variance. The same three-point example continues: M_2 is 10, mu squared is 9, variance is 1, standard deviation is 1. The denominator-floor rule for the mean also applies to M_2, so variance and standard deviation inherit the same stability. Next: how much data supports each location?
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

<p>Cartesian: product of axis widths. Polar: range-dependent area. Exclude where <em>N</em><sub>eff</sub> is a small fraction of <em>A</em>, for example below half.</p>
</section>
<section class="local-math-card">
<h2>Low-support fallback</h2>
<p>Floor with prefilled replacement.</p>

$$
\mu = \mathcal{S}_g\{z\}/d, \; d \ge \epsilon
$$

$$
\mu = \mathcal{S}_g\{\bar{x}\}, \; d \lt \epsilon
$$

<p>Floor epsilon is 1e-3. Same rule for the second moment.</p>
</section>
</div>

<p class="fine"><em>N</em><sub>eff</sub> is a support diagnostic, not an uncertainty. Prefill uses iterative smoothing with nearest completion, only where support is insufficient.</p>

<!--
About 1 minute. Rho is the smoothed mask clipped to [0,1]; N_eff is rho times the local window area A in grid units. On Cartesian grids A is the product of axis widths W_d; on polar grids it is range-dependent. Two otherwise identical neighborhoods with different missing-data coverage give different N_eff. Operationally, mask or exclude estimates where N_eff falls below a chosen fraction of nominal area, for example below half, because variance and anomaly scores in under-supported regions are weakly constrained regardless of numerical stability. The stable mean uses a denominator floor epsilon of 1e-3 with a prefilled-field fallback only in under-supported regions. The prefilled field uses iterative spectral smoothing with nearest-neighbor completion. The same floor applies to the second moment. Do not present the fallback as the main estimator. Transition to dimensionality.
-->

---
class: local-math
---

# Cartesian filtering in N dimensions

<p class="local-math-lead">Separable kernels factor across regularly sampled axes.</p>

<div class="local-math-center">

$$
H_D(k_1,\ldots,k_D) = \prod_{d=1}^{D} H_d(k_d), \quad \mathcal{S}^{(D)} = \mathcal{S}_D \circ \cdots \circ \mathcal{S}_1
$$

</div>

<div class="local-dim-chain">
  <div class="local-dim-box">1D profile<br />filter along x</div>
  <span aria-hidden="true">→</span>
  <div class="local-dim-box">2D field<br />filter along x, then y</div>
  <span aria-hidden="true">→</span>
  <div class="local-dim-box">3D volume<br />filter along z, y, x</div>
</div>

<p class="fine">Each axis keeps its own width; the 3D wind test uses (3, 7, 7). Apply the full operator to z, z², and m, then form ratios. Do not average separately normalized intermediates.</p>

<!--
About 1 minute. For Cartesian D-dimensional smoothing, the transfer function is the product of axis transfer functions. Implementation reduces the operation to sequential 1D spectral multiplications while preserving spectral efficiency for large windows. Each dimension can keep its own window width; the cyclone-wind validation uses windows (3, 7, 7). The important connection: apply the full multidimensional operator to z, z squared times m, and m, then form the normalized moments. Normalization follows the complete filtering operation. Averaging independently normalized intermediate means would generally give a different result. Next: the same idea with mixed boundaries on a polar grid.
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
Y_{\mathrm{az}} = \mathcal{T}_{\mathrm{az}}^{-1}\!\left[\mathcal{T}_{\mathrm{az}}(X) \odot H_{\mathrm{az}}\right]
$$

At each range, the grid width follows $W_{\mathrm{az,grid}}(r) = W_{\mathrm{azimuth}}/(r\Delta\theta)$. $H_{\mathrm{az}}$ is a 2D array across azimuth and range.

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

<p class="spectral-summary">Full-circle scans use periodic azimuth with reflective range. The range-dependent azimuth response requires the intermediate field — not one global 2D product.</p>

<!--
About 1 minute 15 seconds. Polar arrays are indexed as azimuth by range. To hold physical azimuth width approximately fixed, the kernel width in grid units is W_az,grid(r) = W_azimuth / (r delta-theta), where r is the 1-based range index and delta-theta is azimuth spacing in radians. Because that width varies with range, H_az is a range-dependent 2D transfer-function array, not one global 2D multiplication. Stage 1 filters along azimuth with T_az as DCT for reflective or RFFT for periodic data. A partial-sector scan need not wrap in azimuth; the mode is an explicit assumption matched to the scan. Stage 2 filters the intermediate field Y_az along range with reflective DCT-II. For a full-circle scan the implemented mixed mode is periodic azimuth with reflective range. Apply the same two-stage operator to z, z squared times m, and m, then normalize. Polar effective area is range-dependent: A_polar(r) = W_range times W_az,grid(r). Next: validation, starting with structured 3D flow.
-->

---
class: figure-slide
---

# Outlier detection in a 3D wind field

<p class="local-criterion">

$$
|\,\|v\| - \mu_{\|v\|}\,| > k\,\sigma_{\|v\|}
$$

</p>

<div class="fig">
  <img src="../figures/local-stats-outliers.png" alt="Synthetic cyclone-like wind field with injected anomalies, the local-mean estimate, and detected outliers at threshold 3.0" />
</div>

<p class="fine">Synthetic cyclone-like wind. Injected anomalies are 0.3% of grid points. Detection at k = 3.0.</p>

<!--
About 1 minute 15 seconds. An idealized smooth 3D cyclone-like wind on an 18 by 96 by 96 grid, Gaussian perturbations of sigma 0.14 per component, plus sparse injected vector anomalies of amplitude 1.25 to 2.25 as ground truth. Scoring uses wind-speed residuals against local statistics with windows (3, 7, 7): flag where the absolute wind-speed residual exceeds k times local sigma. Panel (a) shows injected anomalies in red against structured flow; (b) shows the local-mean field; (c) separates true positives, false positives, and missed points at k = 3.0. At k = 3.0, mean precision is about 0.92, recall about 0.77, F1 about 0.84. Global moments fail here because signed components are mean-centered while valid shear keeps global spread large; local normalization restores contrast. This is a synthetic validation, not storm data. Next: how the threshold trades false alarms against misses.
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

<p class="fine">Lower k finds more, with more false alarms. Higher k is cleaner, but misses more. Mean F1 peaks at k = 3.0.</p>

<!--
About 45 seconds. Threshold sweep over k from 2.0 to 6.0, mean plus/minus std across seeds. At k = 2.0, precision is about 0.14 with recall about 0.86; at k = 3.0, precision about 0.92, recall about 0.77, F1 about 0.84; at k = 4.0, precision 1.00 with recall about 0.63. Mean F1 peaks at k = 3.0 within the tested sweep. Recommended practice is iterative: compute local statistics, flag with the z-score criterion, exclude flagged points from the mask, and recompute so outliers do not inflate local spread. Window width, support, and boundary mode also affect screening. Transition from synthetic winds to real radar.
-->

---
class: figure-slide
---

# Local smoothing on a polar radar scan

<div class="fig">
  <img src="../figures/local-stats-polar.png" alt="DOW6 X-band reflectivity: raw field and smoothed fields at window widths 5 and 15, with full-domain views and central 20 km zooms" />
</div>

<p class="fine">DOW6 X-band, WINTRE-MIX, 23 Feb 2022. Top: full domain. Bottom: 20 km central zoom. Shared dBZ scale.</p>

<!--
About 1 minute 15 seconds. Real-radar polar demonstration on uncorrected DOW6 reflectivity from the same 23 February 2022 event, following the dct_toolkit notebook workflow. W sets both the range width and the azimuth target width. Panels (a)–(c) are full-domain raw, W = 5, and W = 15; panels (d)–(f) are the matching 20 km central zooms. The operator uses mixed boundaries: periodic azimuth with reflective range. Missing sectors carry zero weight in the normalized estimate; despite extensive beam-blockage sectors, normalized convolution gives coherent local-mean estimates without obvious gap-driven artifacts, and no evident center-of-grid distortion appears even at W = 15. As expected, W = 5 preserves sharper gradients while W = 15 suppresses more small-scale variability; this is a tuning trade-off, not evidence for one globally optimal width. The evidence here is qualitative and dataset-specific. Next: what remains limited.
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
About 45 seconds. Three qualifications. First, low-support regions can remain numerically stable yet weakly constrained; exclude or down-weight estimates where N_eff is a small fraction of nominal area. Second, outlier screening depends on threshold k, kernel width, support, and boundary mode; there is no single best setting from these tests. Third, the real-radar block shows plausible behavior on one dataset with large missing sectors; broader generalization needs more benchmarks, and non-binary certainty masks are not evaluated. These experiments also do not re-prove normalized-convolution fundamentals or re-benchmark transform scaling from the prior DCT work. Transition to the takeaways.
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
About 45 seconds. Suggested delivery: “This extends the smoothing method to local statistics that account for missing observations and scan geometry.” Results use dct_toolkit at commit 9d3b60e. Future work should test more broadly against alternative baselines, expand sensitivity analyses, and evaluate non-binary certainty. This work is under review; cite the arXiv preprint, not a publication. The dissertation use of these statistics is the background mean for Z-prime, which I will introduce now before the storm. Then go to the population: the observational studies begin with how a cloud-top generating-cell population evolves.
-->

---

# The methods are how the cells get measured

- **Population:** smooth the perturbation, then contour
- **One cell:** smooth in polar coordinates, then a weighted local mean for $Z'$
- **The link:** the population track is the origin of the moving grid

<!--
This is the hinge. If you skip it, the methods feel like a separate thesis.

Z-prime is smoothed reflectivity minus a local background, computed per radar and merged with beam weights. It is not a raw reflectivity composite, and it is not a rainfall rate.

Then go to the storm. The audience should now trust a 5 dBZ contour and a Z-prime isosurface enough to look at them.
-->
