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
class: figure-slide
---

# Backup: DCT and spatial smoothing on radar data

<div class="fig">
  <img src="../figures/backup-dct-radar.png" alt="C-band radar field smoothed by a spatial dynamic kernel and by the DCT" />
</div>

<p class="fine">23 Feb 2022, 02:28 UTC. Window of 5 pixels. Difference is the rightmost column of the comparison.</p>

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
