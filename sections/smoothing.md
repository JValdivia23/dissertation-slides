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
    <p>Presenter: <strong>Jairo M. Valdivia-Prado</strong></p>
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

<div class="radar-data-points">
  <p>Radar is natively collected in <strong>polar coordinates</strong>.</p>
  <p>Raw radar observations are <strong>noisy</strong>.</p>
</div>

<div class="radar-data-figure">
  <img v-click.hide="1" src="../extras/raw_zh_rhi.png" alt="Unsmoothed C-band radar reflectivity cross-section and a close-up of cloud-top cells" />
  <img v-click="1" src="../extras/raw_zdr_rhi.png" alt="Unsmoothed differential reflectivity from the same radar scan and close-up" />
</div>

<!--
About 45 seconds. This is a COW1high range–height scan on 23 February 2022 at 02:28:53–02:29:05 UTC. In this vertical scan, the native coordinates are range and elevation angle. First show unsmoothed horizontal reflectivity; one click replaces it with differential reflectivity from the same scan and with the same spatial bounds. The right panels enlarge 17–23 km range and 4.5–7.5 km altitude. Gate-to-gate variability and missing observations motivate smoothing, but not every small-scale change is random noise; coherent cloud-top structures remain visible. The ZDRC field is calibration-corrected but not smoothed. The reflectivity view corresponds to panels (a) and (e) of Figure 4 in the AMT paper; the ZDR view is newly plotted from the same RHI file. Transition to the polar-grid geometry problem.
-->

---
class: smoothing-problem
---

# A fixed radar-grid window changes physical size

<div class="smoothing-problem-figure">
  <img src="../figures/polar-scale.png" alt="A fixed angular-index window covers a larger physical area farther from the radar" />
</div>

<p class="smoothing-problem-takeaway">For 1–2 km cloud-top generating cells, the smoothing width must be specified in physical distance, not gate count.</p>

<p class="fine">A fixed number of angular gates spans a larger transverse distance at far range. Figure 1 from the AMT paper.</p>

<!--
About 1 minute 10 seconds. Introduce the problem independently of the dissertation opening. Radar data are sampled in range and angle; a fixed grid-space smoothing window changes its physical footprint with range. The cells of interest are small, so the smoothing scale must be tied to distance rather than a constant number of angle bins. The source figure is Figure 1 of the AMT paper.

Do not say that range gates themselves widen with range; it is the transverse angular spacing that grows. The cost of a spatial kernel that changes with range motivates the next slide.
-->

---
class: smoothing-objective
---

# Objective: consistent smoothing at lower cost

<div class="smoothing-cards">
  <section>
    <h2>Physical scale</h2>
    <p>Adjust the angular window with range so the intended smoothing width remains approximately constant.</p>
  </section>
  <section>
    <h2>Computation</h2>
    <p>Avoid applying a different spatial window at every range and angle.</p>
  </section>
</div>

<p class="smoothing-test">Test against a spatial dynamic kernel: <strong>compare the resulting radar fields and processing times.</strong></p>

<!--
About 45 seconds. The paper addresses a tradeoff: a range-dependent spatial kernel can maintain the physical smoothing scale, but repeatedly evaluating it on large data is expensive. The alternative is spectral-domain filtering with the Discrete Cosine Transform (DCT). Its test is not just speed: the smoothed field must also be compared with the spatial reference.
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
