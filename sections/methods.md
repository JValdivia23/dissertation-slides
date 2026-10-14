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
The second paper is titled:

Again this is with the collaboration of Will Chapman and Katja Friedrich.

It is under review at Computer and Geosciences.
-->

---
class: local-math local-intro
---

# Local statistics on incomplete grids

<p class="local-math-lead">Smoothing uses a kernel average, but filled gaps contribute to that average.</p>

<div class="local-kernel-row">
<svg class="local-kernel-svg" viewBox="0 0 140 132" role="img" aria-label="Illustrative kernel neighborhood with valid, missing, and excluded observations">
  <rect x="14" y="10" width="112" height="112" rx="4" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.6" />
  <g>
    <rect x="22" y="18" width="18" height="18" class="k-valid" />
    <rect x="42" y="18" width="18" height="18" class="k-valid" />
    <rect x="62" y="18" width="18" height="18" class="k-missing" />
    <rect x="82" y="18" width="18" height="18" class="k-valid" />
    <rect x="102" y="18" width="18" height="18" class="k-valid" />
    <rect x="22" y="38" width="18" height="18" class="k-valid" />
    <rect x="42" y="38" width="18" height="18" class="k-excluded" />
    <rect x="62" y="38" width="18" height="18" class="k-valid" />
    <rect x="82" y="38" width="18" height="18" class="k-valid" />
    <rect x="102" y="38" width="18" height="18" class="k-missing" />
    <rect x="22" y="58" width="18" height="18" class="k-valid" />
    <rect x="42" y="58" width="18" height="18" class="k-valid" />
    <rect x="62" y="58" width="18" height="18" class="k-center" />
    <rect x="82" y="58" width="18" height="18" class="k-valid" />
    <rect x="102" y="58" width="18" height="18" class="k-valid" />
    <rect x="22" y="78" width="18" height="18" class="k-missing" />
    <rect x="42" y="78" width="18" height="18" class="k-valid" />
    <rect x="62" y="78" width="18" height="18" class="k-valid" />
    <rect x="82" y="78" width="18" height="18" class="k-excluded" />
    <rect x="102" y="78" width="18" height="18" class="k-valid" />
    <rect x="22" y="98" width="18" height="18" class="k-valid" />
    <rect x="42" y="98" width="18" height="18" class="k-valid" />
    <rect x="62" y="98" width="18" height="18" class="k-valid" />
    <rect x="82" y="98" width="18" height="18" class="k-valid" />
    <rect x="102" y="98" width="18" height="18" class="k-valid" />
    <line x1="46" y1="42" x2="56" y2="52" class="k-cross" />
    <line x1="56" y1="42" x2="46" y2="52" class="k-cross" />
    <line x1="86" y1="82" x2="96" y2="92" class="k-cross" />
    <line x1="96" y1="82" x2="86" y2="92" class="k-cross" />
  </g>
  <circle cx="71" cy="67" r="3.2" class="k-target" />
</svg>
<ul class="local-kernel-legend">
  <li><span class="sw k-valid" aria-hidden="true"></span>Valid observation</li>
  <li><span class="sw k-missing" aria-hidden="true"></span>Missing value</li>
  <li><span class="sw k-cross-sw" aria-hidden="true">×</span>Suspicious, masked</li>
</ul>
</div>

<div class="local-math-grid cols-3">
<section class="local-math-card">
<h2>Use valid observations</h2>

</section>
<section class="local-math-card">
<h2>Estimate mean and spread</h2>

</section>
<section class="local-math-card">
<h2>Generalize the grid</h2>

</section>
</div>

<p class="local-math-lead">How can the kernel average use retained values only, while also reporting variability, and suitable boundaries?</p>

<!--
What is the problem?
Sometimes our data has missing values or just data that looks suspicious and you don't want to include it on your calculations.

What we want in this project is to just use the valid observations.
If we are smoothing using the mean and we have a reliable estimate, then why not compute the variance, or the standard deviation.

If the method is fast enough then why only use it for polar coordinates.
-->

---
class: local-math local-mask
---

# Extending spectral smoothing to local statistics

<p class="local-math-lead">Retain the spectral filter; normalize by available support.</p>

<div class="local-flow-grid">
<section class="local-flow-box">
<h2>Masked values</h2>
<p>Keep retained values, zero elsewhere.</p>

$$
x \cdot m
$$
</section>
<span aria-hidden="true">+</span>
<section class="local-flow-box">
<h2>Mask</h2>
<p>Record where data contribute.</p>

$$
m
$$
</section>
<span aria-hidden="true">→</span>
<section class="local-flow-box">
<h2>Filter both, then divide</h2>
<p>Same spectral operator throughout.</p>

$$
\mu = \mathcal{S}_g\{x \cdot m\} / \mathcal{S}_g\{m\}
$$
</section>
</div>

<div class="local-math-grid cols-3">
<section class="local-math-card">
<h2>Extended statistics</h2>
<svg class="local-card-illustration" viewBox="0 0 220 82" role="img" aria-label="Observed and missing samples produce a local mean, spread, and available-support indicator">
  <line class="diagram-axis" x1="12" y1="61" x2="94" y2="61" />
  <g class="diagram-stem">
    <line x1="22" y1="38" x2="22" y2="61" />
    <line x1="40" y1="20" x2="40" y2="61" />
    <line x1="58" y1="30" x2="58" y2="61" />
    <line x1="76" y1="48" x2="76" y2="61" />
  </g>
  <g class="diagram-observed-dot">
    <circle cx="22" cy="38" r="4" />
    <circle cx="40" cy="20" r="4" />
    <circle cx="58" cy="30" r="4" />
    <circle cx="76" cy="48" r="4" />
  </g>
  <circle class="diagram-missing-dot" cx="90" cy="39" r="4" />
  <path class="diagram-arrow" d="M101 39h18m-6-6 6 6-6 6" />
  <path class="diagram-spread" d="M135 27v21m0-10h57m0-11v21" />
  <circle class="diagram-estimate-dot" cx="164" cy="38" r="5" />
  <g class="diagram-support">
    <circle cx="140" cy="63" r="3" />
    <circle cx="154" cy="63" r="3" />
    <circle cx="168" cy="63" r="3" />
    <circle cx="182" cy="63" r="3" />
  </g>
  <circle class="diagram-missing-dot" cx="196" cy="63" r="3" />
</svg>
<p>Repeat for squared values to obtain the second moment, variance, and standard deviation.</p>
</section>
<section class="local-math-card">
<h2>Explicit boundaries</h2>
<svg class="local-card-illustration" viewBox="0 0 240 82" role="img" aria-label="Left: a signal reflects at a mirrored boundary. Right: the signal wraps from the end back to the beginning at a periodic boundary">
  <path class="diagram-boundary-data" d="M18 55 36 25 54 43 66 43m78 12 18-30 18 18 12 0" />
  <path class="diagram-mirror" d="M65 13v62m4-62v62" />
  <path class="diagram-boundary-copy" d="M68 43 80 43 98 25 116 55 M128 43 140 43 M196 55 214 25 232 43" />
  <path class="diagram-periodic-seam" d="M142 20v53m52-53v53" />

</svg>
<p>DCT for reflective axes; RFFT for periodic axes such as full-circle azimuth.</p>
</section>
<section class="local-math-card">
<h2>Gap filling</h2>
<svg class="local-card-illustration" viewBox="0 0 220 82" role="img" aria-label="A missing cell is estimated from neighboring observations, with the filled value distinguished from observations">
  <g class="diagram-observed-cell">
    <rect x="26" y="12" width="16" height="16" /><rect x="46" y="12" width="16" height="16" /><rect x="66" y="12" width="16" height="16" />
    <rect x="26" y="32" width="16" height="16" /><rect x="66" y="32" width="16" height="16" />
    <rect x="26" y="52" width="16" height="16" /><rect x="46" y="52" width="16" height="16" /><rect x="66" y="52" width="16" height="16" />
    <rect x="140" y="12" width="16" height="16" /><rect x="160" y="12" width="16" height="16" /><rect x="180" y="12" width="16" height="16" />
    <rect x="140" y="32" width="16" height="16" /><rect x="180" y="32" width="16" height="16" />
    <rect x="140" y="52" width="16" height="16" /><rect x="160" y="52" width="16" height="16" /><rect x="180" y="52" width="16" height="16" />
  </g>
  <rect class="diagram-missing-cell" x="46" y="32" width="16" height="16" />
  <path class="diagram-arrow" d="M98 40h29m-7-7 7 7-7 7" />
  <rect class="diagram-estimated-cell" x="160" y="32" width="16" height="16" />
</svg>
<p>Missing data can be filled with the mean where support is insufficient.</p>
</section>
</div>

<!--
And the way we solve this, I actually the same as we will do it in the spacial domain.

This is what is know as normalized convolution. But we want to do this normalized convolution in the spectral domain.

Once we have a definition of the mean, we can compute the second moment of our data and get the variance, therefore the standard deviation. 
And you can keep going, if you compute the 3th moment you'll get the skewness and the 4th moment the kurtosis. 

The way we make the the boundaries periodic instead of reflective is using the FFT instead of DCT.

We can also use the our local statistic to do the gap filling and even filter our data.
-->

---
class: local-math local-workflow
---

# Spectral local-statistics workflow



<div class="local-pipeline-fig">
  <img src="../figures/local-stats-pipeline.png" alt="Reflective Cartesian spectral filtering example on a 2D field with missing values, producing local mean, standard deviation, and effective sample count" />
</div>

<p class="local-takeaway">Local statistics on polar and Cartesian grids, from retained values only.</p>
<p class="local-takeaway">The same idea extends to N-dimensional grids, with per-dimension kernels and boundary conditions.</p>

<p class="fine convolution-demo-caption">See the preprint <a href="https://doi.org/10.48550/arXiv.2604.22721" target="_blank" rel="noopener noreferrer">Valdivia et al. (arXiv:2604.22721)</a> for the mathematical formulation and implementation.</p>

<!--
The way that this works, is...

What are we doing in the paper is turn this concept into the an N-dimensional space.
And for some property of the transfer function we can control our kernel type per dimension.

And you can also control your boundary conditions per dimensions.
-->

---
class: outlier-animation
---

# Outlier detection in a 3D wind field

<p class="outlier-lead">Flag a wind-speed residual larger than k local standard deviations.</p>

<div class="outlier-stages" aria-label="Animation stages">
  <span v-for="(label, index) in outlierStages" :key="label" :class="{ active: Math.min(clicks, 4) === index }">{{ label }}</span>
</div>

<div class="outlier-body">
  <div class="outlier-visual">
    <div class="outlier-canvas" role="img" aria-label="Click-stepped 3D synthetic wind example: noise and injected anomalies, local-mean circulation, a close-up of two actual speed scores, then true detections, false alarms, and missed anomalies.">
      <CuManim :steps="4" :width="1000" :height="275" :construct="outlierDetection" />
      <svg v-if="clicks === 0" class="outlier-first-frame" viewBox="0 0 1000 560" aria-hidden="true">
        <path v-for="(edge, i) in outlierPreview.edges" :key="`edge-${i}`" :d="edge" fill="none" stroke="#52667b" stroke-width="1.5" opacity="0.55" />
        <path v-for="(arrow, i) in outlierPreview.arrows" :key="`arrow-${i}`" :d="arrow" fill="none" stroke="#85bec8" stroke-width="2" opacity="0.8" />
      </svg>
    </div>
    <p class="outlier-view-caption">{{ clicks === 3 ? 'Enlarged neighborhood · wind speed in arbitrary units' : 'Sparse 3D rendering · statistics use all 165,888 grid points' }}</p>
  </div>
  <div class="outlier-explanation">
    <div v-if="clicks >= 3" class="outlier-equation">

$$
|\,\|v\| - \mu_{\|v\|}\,| > k\,\sigma_{\|v\|}
$$

</div>
    <div v-else-if="clicks === 1" class="outlier-equation">

$$
\text{Global mean} = 0
$$

</div>
    <div v-if="clicks === 0" class="outlier-stage-copy">
      <h2>Synthetic circulation</h2>
      <p>18 × 96 × 96 grid</p>
      <p>Known wind field and anomaly locations.</p>
    </div>
    <div v-else-if="clicks === 1" class="outlier-stage-copy">
      <h2>Observed wind</h2>
      <p>Noise: σ = 0.14 per component.</p>
      <p><i class="outlier-key" :style="{ background: outlierColors.tp }"></i>Injected anomalies: 526 points.</p>
      <p class="outlier-secondary">Random vector perturbations of amplitude 1.25–2.25.</p>
    </div>
    <div v-else-if="clicks === 2" class="outlier-stage-copy">
      <h2>Local reference</h2>
      <p>Reflective DCT · widths (3, 7, 7)</p>
      <p>Estimate local mean and standard deviation of <strong>wind speed</strong>.</p>
      <p class="outlier-secondary">Arrows show the local-mean vector field.</p>
    </div>
    <div v-else-if="clicks === 3" class="outlier-score-cards">
      <section v-for="(sample, i) in [outlierData.focus, outlierData.ordinary]" :key="i" :class="{ flagged: i === 0 }">
        <h2><i class="outlier-key" :style="{ background: i === 0 ? outlierColors.tp : outlierColors.ordinary }"></i>{{ i === 0 ? 'Injected anomaly' : 'Ordinary point' }}</h2>
        <p>Speed <strong>{{ sample.speed.toFixed(2) }}</strong> · μ {{ sample.meanSpeed.toFixed(2) }} · σ {{ sample.stdSpeed.toFixed(2) }}</p>
        <div class="outlier-band" aria-hidden="true">
          <span class="outlier-interval" :style="{ left: `${100 * (sample.meanSpeed - 3 * sample.stdSpeed) / 2.6}%`, width: `${100 * 6 * sample.stdSpeed / 2.6}%` }"></span>
          <span class="outlier-mean-tick" :style="{ left: `${100 * sample.meanSpeed / 2.6}%` }"></span>
          <span class="outlier-speed-tick" :style="{ left: `${100 * sample.speed / 2.6}%` }"></span>
        </div>
        <p class="outlier-score-result">{{ sample.score.toFixed(2) }}σ {{ i === 0 ? '> 3σ → flagged' : '< 3σ → retained' }}</p>
      </section>
      <p class="outlier-secondary">Shaded interval: μ ± 3σ · marker: observed speed</p>
    </div>
    <div v-else class="outlier-stage-copy outlier-results">
      <h2>Detection at k = 3</h2>
      <p><i class="outlier-key" :style="{ background: outlierColors.tp }"></i><strong>406</strong> true detections</p>
      <p><i class="outlier-key" :style="{ background: outlierColors.fp }"></i><strong>39</strong> false alarms</p>
      <p><i class="outlier-key" :style="{ background: outlierColors.fn }"></i><strong>120</strong> missed anomalies</p>
      <p class="outlier-secondary">Full-volume counts for this realization.</p>
    </div>
  </div>
</div>

<p v-click="4" class="fine">Synthetic cyclone-like wind, 18 × 96 × 96, windows (3, 7, 7). At k = 3.0: precision 0.92, recall 0.77, F1 0.84, mean over 5 seeds.</p>
<p v-click="4" class="fine outlier-vector-note">Velocity-vector scoring may improve sensitivity to directional anomalies; this was not evaluated here.</p>

<script setup>
import { useNav } from '@slidev/client'
import { outlierDetection, outlierPreview, outlierData, outlierStages, outlierColors } from '../scenes/outliers'

const { clicks } = useNav()
</script>

<!--
I'm gonna do a quick demo to showcase what local statistics can do.
-->

---
class: figure-slide polar-figure
---

# Local smoothing on a polar radar scan

<div class="fig">
  <img src="../figures/local-stats-polar.png" alt="DOW6 X-band reflectivity: raw field and smoothed fields at window widths 5 and 15, with full-domain views and central 20 km zooms" />
</div>

<p class="fine">DOW6 X-band, WINTRE-MIX, 23 Feb 2022. Top: full domain. Bottom: 20 km central zoom. Missing sectors carry zero weight.</p>

<!--
But minding my own business, this is how my radar ppi looks like with this method.
-->

---
class: toolkit-availability
---

# Spectral statistics implementation

<div class="toolkit-body">
  <div class="toolkit-install">
    <section>
      <h2>Conda</h2>
      <pre><code>conda install conda-forge::dct-toolkit</code></pre>
    </section>
    <section>
      <h2>pip</h2>
      <pre><code>pip install dct-toolkit</code></pre>
    </section>
    <figure class="toolkit-qr">
      <img src="../figures/qr-dct-toolkit.png" alt="QR code linking to the dct-toolkit GitHub repository" />
      <figcaption>github.com/JValdivia23/dct-toolkit</figcaption>
    </figure>
  </div>
  <figure class="toolkit-shot">
    <img src="../extras/Screenshot_Conda.png" alt="Anaconda.org page for conda-forge dct-toolkit version 0.6.0 showing the conda install command" />
  </figure>
</div>

<!--
The code implementation was accepted in conda!
-->

---
class: smoothing-conclusions conclusions-bullets
---

# Project 2: Conclusions

- Compute local statistics in incomplete fields.
- Work in N-dimensional Cartesian or polar coordinates.
- Combine boundary conditions across dimensions, and mix kernel types per dimension.
- Potential applications go beyond radar: satellite observations, numerical simulations, even medical 3D-flow measurements.

<!--
We have this framework to compute local statistics...
-->
