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
