---
layout: image-right
image: ./figures/ctgc-concept.png
imageAlt: DOW6 range-height scan on 23 February 2022 at 02:28 UTC, with a conceptual cloud-top generating cell inset
imageCaption: DOW6 RHI, 23 Feb 2022, 02:28 UTC. Concept adapted from Kumjian et al. (2014).
---

# Cloud-Top Generating Cells

<v-clicks>

- Small convective regions near cloud top (~1–2 km)
- Ice particles seed the cloud below and descend in **fall streaks**
- Their small scale challenges prediction and observation

</v-clicks>

<!--
[click] Point to the boxed feature in the radar cross section. This is a vertical view through a winter storm. These small convective regions near cloud top are cloud-top generating cells, typically about one to two kilometers across.

[click] Point to the conceptual inset, then follow the trail downward. Ice particles form and grow in the cells and fall in trails called fall streaks. As they descend through the underlying cloud, they can continue to grow and enhance precipitation. The cells seed ice into a cloud that provides conditions for further growth—a seeder–feeder interaction.

[click] Despite their possible importance to winter precipitation, these small, high-altitude features are poorly resolved by many operational weather prediction models. They are also difficult to observe repeatedly at enough detail while they move and evolve. We know more about their structure at individual moments than about how they evolve and how precipitation develops below them.

That leads to the observational gaps I will address in this dissertation.
-->

---

# Observational Gaps

- **Time:** snapshots do not describe how a population organizes or how long an individual cell persists
- **Depth:** a moving cell's fall streak overlaps precipitation already present below it
- **Measurement:** radar geometry, missing observations, and large data volumes complicate consistent analysis

<!--
Previous work describes structure at individual times more fully than temporal evolution. Kumjian et al. followed one cell for about 10 minutes. A population can persist while individual cells turn over, so the group's duration is not a cell lifetime.

The underlying cloud may already be producing precipitation before the cell seeds it. A fall streak overlapping other echoes is not, by itself, evidence that one cell produced the precipitation below it. Following the cell and its surroundings requires repeated volumetric observations.

The measurement issue motivates the first two studies. A fixed range–azimuth window covers more area farther from the radar, and missing values are not observed zeros.
-->

---

# Physical and Microphysical Questions

1. What processes govern the formation and organization of cloud-top generating cells?
2. How do ice particles change within the cells and as they descend through underlying cloud?
3. How much does ice supplied by the cells change precipitation in those clouds?

<!--
These are broader motivating questions, not three causal claims made by this dissertation. The observations describe organization and radar signatures, but do not establish the circulation that forms the cells or directly measure particle growth along the entire streak. Overlapping sources and precipitation already present below the cells prevent quantification of one cell's precipitation contribution.
-->

---

# Dissertation Research Questions

1. How can radar fields be analyzed efficiently at a consistent physical scale, including where observations are missing?
2. How did one observed cell population evolve in organization and polarimetric signatures?
3. How did a selected cell's fall streak relate to precipitation already present below it?

<p class="fine">The observational analyses concern one winter storm and one selected cell.</p>

<!--
The first question is addressed by two methodological studies. The second concerns the population in one WINTRE-MIX event; the third concerns a cell selected from that population. The fall-streak analysis examines structure and precipitation contrasts, not the cell's individual contribution to precipitation.
-->

---
class: dissertation-map
---

# Dissertation Organization

<p class="map-frame">Chapter 1 · Introduction and motivation</p>

<div class="map-group">
  <div class="map-group-title">Radar-analysis methods</div>
  <div class="map-row">
    <div class="map-item"><span>Chapter 2</span><strong>Radar smoothing at a consistent physical scale</strong></div>
    <div class="map-item"><span>Chapter 3</span><strong>Local statistics with missing-data support</strong></div>
  </div>
</div>

<div class="map-group">
  <div class="map-group-title">Observational studies</div>
  <div class="map-row">
    <div class="map-item"><span>Chapter 4</span><strong>Temporal evolution of a cell population</strong></div>
    <div class="map-item"><span>Chapter 5</span><strong>Three-dimensional structure of one cell and associated precipitation</strong></div>
  </div>
</div>

<p class="map-integration">Chapter 5 integrates the radar methods with the cell track from Chapter 4.</p>
<p class="map-frame">Chapter 6 · Synthesis and outlook</p>

<!--
The four core chapters are the four studies. Chapters 2 and 3 address radar-analysis methods. Chapter 4 follows the CTGC population; do not imply that the new methods in Chapters 2 and 3 produced its results. Chapter 5 explicitly combines those methods with the track identified in Chapter 4 to examine one cell and its precipitation.

Status, if asked:

- Valdivia, Chapman, and Friedrich, AMT, 2026. doi:10.5194/amt-19-5211-2026
- Valdivia, Chapman, and Friedrich, arXiv:2604.22721. Under review. Not accepted.
- Valdivia, Friedrich, Zaremba, and Tessendorf, JAS, 2026. doi:10.1175/JAS-D-25-0088.1
- Same author team, GRL manuscript 2026GL126989, submitted 16 September 2026. Not accepted.

Transition: begin Chapter 2 with the change in physical area covered by a fixed radar window.
-->
