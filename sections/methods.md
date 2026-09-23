---
layout: image-right
image: ./figures/polar-scale.png
imageAlt: A constant index window covers a larger physical area at far range
imageCaption: A fixed window in range–azimuth index is not a fixed physical area.
---

# A fixed window is not a fixed area

- The same gates cover more area farther from the radar
- These cells are 1–2 km, so the scale has to stay physical
- Repeating that calculation on full volumes is slow

<!--
This is the reason for a range-dependent azimuth kernel. Close the point in one sentence and go to the result.

If asked about gaps: treating a missing value as zero changes the mean. That is the next method, not this figure.
-->

---
class: figure-slide
---

# Same smoothing, at a small fraction of the cost

<div class="fig">
  <img src="../figures/dct-benchmark.png" alt="Execution time and speedup of DCT smoothing against a spatial dynamic kernel" />
</div>

<p class="fine">Gaussian DCT on a ~180-million-pixel array: seconds, not tens of minutes. Speedup grows with window size.</p>

<!--
The operation is convolution through a transfer function. The azimuth kernel narrows with range so the physical scale stays roughly constant.

Chapter 6 number, if asked: a 5-pixel window, less than 12 s versus about 42 min (2518 s) for the spatial dynamic kernel. On the synthetic polar test, the two outputs were nearly indistinguishable. Do not say identical.

Panel (b): Gaussian speedup exceeds 800× at the largest window. Other kernels and the Gibbs example are backup.

Published as Valdivia, Chapman, and Friedrich, AMT, 2026.
-->

---
class: figure-slide
---

# A local mean, a variance, and a sample count

<div class="fig">
  <img src="../figures/local-stats-pipeline.png" alt="Normalized-convolution pipeline from a gappy field to local mean, standard deviation, and effective sample count" />
</div>

<p class="fine">Missing values stay missing. <em>N</em><sub>eff</sub> says how much data supports the estimate.</p>

<!--
Normalized convolution. The mask goes through the same transform as the field, so gaps are not filled with zeros before the mean is taken.

Boundaries: periodic in azimuth, so 0° and 360° stay neighbors; reflective in range and elevation, so the ends of a finite scan are not tied together.

This is under review at Computers & Geosciences. Preprint arXiv:2604.22721. Do not call it published.

The outlier test and the 1D boundary comparison are backup. The use in the dissertation is the background mean for Z-prime.
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
