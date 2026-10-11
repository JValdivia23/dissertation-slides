---
class: dissertation-synthesis
title: Dissertation contributions
clicks: 1
---

<div class="dissertation-synthesis-body">
  <h1 v-click.hide="1" class="dissertation-synthesis-title">Dissertation contributions</h1>
  <DissertationSynthesis>
    <template #conclusion>
      <p class="dissertation-conclusion">This dissertation developed an efficient spectral radar-processing framework and new CTGC observation techniques, characterized the population life cycle and inferred microphysical evolution, and resolved an evolving three-dimensional fall streak, providing new insight into how CTGCs enhance precipitation.</p>
      <p class="dissertation-scope">One winter storm; one cell analyzed in 3D.</p>
    </template>
  </DissertationSynthesis>
</div>

<script setup>
import DissertationSynthesis from '../components/DissertationSynthesis.vue'
</script>

<style>
.dissertation-synthesis-body {
  position: relative;
  display: flex;
  flex: 1;
  min-height: 0;
  margin: 0 0 1.8rem;
}

.dissertation-synthesis-title {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  margin: 0;
  padding-bottom: 0.25rem;
  font-size: 1.75rem;
  visibility: visible;
  pointer-events: none;
  transition: opacity 160ms ease, visibility 0s linear;
}

.dissertation-synthesis-title.slidev-vclick-hidden {
  visibility: hidden;
  transition-delay: 0s, 160ms;
}

@media (prefers-reduced-motion: reduce) {
  .dissertation-synthesis-title {
    transition: none;
  }
}
</style>

<!--
About 60–75 seconds, one click. The title is visible on entry and fades out on
the first click without shifting the diagram or changing the final frame.
Chapter 6, Summary of Key Findings, explains this integration.

Suggested delivery: “The four studies come together in the cell-relative
analysis. The smoothing and local-statistics methods supply the reflectivity
anomalies. The population study supplies the selected-cell track and its
temporal context. Together with observations from three radars, these allow
us to follow the fall streak through the surrounding precipitation field.”

Trace the two inputs separately before pointing to Paper 4. This is an
analysis-dependency diagram, not a physical pathway or a sequence in which
Papers 1–2 produced the Paper 3 population detection. The selected-cell track
defines the moving reference frame; the methods provide the anomaly fields.
Population evolution supplies context, not the radar measurements themselves.
Do not introduce new numbers or imply particle trajectories were retrieved.

[click] The title fades out as the diagram moves upward and softens while a gold
connector and compact conclusion card appear beneath it. Read the overall
contribution as one sentence:
“This dissertation developed an efficient spectral radar-processing framework and
new CTGC observation techniques, characterized the population life cycle and
inferred microphysical evolution, and resolved an evolving three-dimensional fall
streak, providing new insight into how CTGCs enhance precipitation.”

The observational scope remains one winter storm and one cell analyzed in 3D.
The animation links the studies to the overall contribution, not a physical
particle pathway or a claim that the methods directly produced population detection.

Supporting details for questions, not the timed delivery:

The method contribution is broader than this case. Paper 1 maintained an
approximately consistent physical smoothing scale across range; Paper 2
extended the framework to normalized local statistics with support and
explicit boundary assumptions. Do not treat its estimated gap values as
measurements or claim that sparse observational support creates information.
The benchmark was not a timing of the complete multi-radar volume workflow.

The 1.7-hour sequence describes collective population activity, not a typical
individual-cell lifetime. Contours can contain several turrets; fewer, larger
features support merging and clustering, not only individual-cell growth.
The early decrease and later increase in differential reflectivity are
microphysical interpretations, not unique measurements of particle habits.

The fall-streak connection is consistent with seeder–feeder growth; particle
growth along the streak and roll circulations were not directly measured.
The 51% snow and 72% rain enhancements remain in the preceding paper section.
They are spatial contrasts, not the cell's share of precipitation. Do not
repeat these numbers here or claim a measured storm-total contribution.

Transition to future work: the methods provide a way to test these observed
relationships across storms and to constrain the unresolved mechanisms.
-->

---
class: dissertation-outlook
title: Future work
---

# Future work

<div class="dissertation-outlook-actions">
  <section><p>Compare population evolution across storms <br />using faster scans and improved environmental sampling.</p></section>
  <section><p>Constrain growth along fall streaks using three-dimensional winds, liquid-water and particle measurements, and geometry-aware polarimetric analysis.</p></section>
  <section><p>Use observation-constrained simulations with and without CTGC ice supply <br />to estimate its effect on precipitation.</p></section>
</div>

<style>
.dissertation-outlook-actions {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  gap: 1.4rem;
  min-height: 0;
  margin-bottom: 1.4rem;
}

.dissertation-outlook-actions section {
  padding: 0.6rem 0.95rem;
  border-left: 4px solid var(--cu-gold);
}

.dissertation-outlook-actions p {
  margin: 0;
  font-size: 1.15rem;
  line-height: 1.45;
  text-wrap: pretty;
}
</style>

<!--
About 50–55 seconds, no clicks. These three concrete research directions
follow Chapter 6's Outlook: population and dynamics, particle growth, and
precipitation attribution. They are proposed work, not dissertation results.

Suggested delivery: “The next step is to test which aspects of this evolution
recur across storms, with faster radar scans and better sampling of the
environment. We also need winds, liquid water, and particle measurements to
constrain growth along the fall streak. Finally, observation-constrained
simulations with and without the CTGC ice supply can estimate how that supply
changes precipitation, rather than treating an observed rate contrast as a
contribution estimate.”

Supporting details for questions, not the timed delivery:

Across-storm comparison should separate collective population duration from
individual-cell persistence. Rapid volumes, three-dimensional winds, and
more frequent soundings would help relate initiation, merging, and decay to
the environment. Shear, cloud-top cooling, moisture supply, and horizontal
convective rolls are mechanisms to test, not established causes in this case.

Particle growth along the streak remains unresolved. Spatially separated
radars view different angles, wavelengths, sampling volumes, and propagation
paths. A geometry-aware extension must consider scattering, attenuation,
calibration, and beam mismatch rather than directly merging polarimetric
values. Liquid-water and ice-particle measurements, winds, and trajectories
would provide complementary constraints; trajectories are future work here.

The attribution experiment must compare transport, growth, and precipitation
under controlled changes in CTGC ice supply. It should distinguish mass
acquired in feeder clouds from the change relative to precipitation without
the generating-cell ice. Observations should constrain and evaluate the
simulations; neither the 51% nor the 72% is already that contribution.
Keep detailed modeling references in discussion unless asked.
-->

---
class: additional-research
title: Additional research contributions
---

# Additional research contributions

<p class="additional-research-scope"><span>2024–2026 · Outside this dissertation</span><span class="additional-research-selected">Selected journal-page headers</span></p>

<div class="additional-research-body">
  <div class="additional-research-counts">
    <p class="additional-research-category">6 published journal articles</p>
    <div class="additional-research-stat">
      <strong>2</strong>
      <span>First-author publications</span>
      <small>Including 1 shared first authorship</small>
    </div>
    <div class="additional-research-stat">
      <strong>4</strong>
      <span>Other co-authored publications</span>
    </div>
    <p class="additional-research-preprint"><a href="https://doi.org/10.5194/egusphere-2026-2705" target="_blank" rel="noopener noreferrer"><strong>+1</strong> co-authored preprint</a></p>
  </div>

  <div class="additional-research-headers" aria-label="Selected publications">
    <figure>
      <figcaption><span>Atmospheric Measurement Techniques · 2024</span><span class="additional-research-role">First author</span></figcaption>
      <a class="additional-research-header" href="https://amt.copernicus.org/articles/17/2295/2024/" target="_blank" rel="noopener noreferrer">
        <img src="../figures/additional-publications/hailstorm-header.png" width="764" height="150" alt="Publisher-page header: Hailstorm events in the Central Andes of Peru: insights from historical data and radar microphysics. Jairo M. Valdivia is the first author." />
        <svg viewBox="0 0 764 150" aria-hidden="true"><rect x="4" y="95.5" width="114.4" height="24.5" rx="2" /></svg>
      </a>
    </figure>
    <figure>
      <figcaption><span>Scientific Reports · 2024</span><span class="additional-research-role">Shared first author</span></figcaption>
      <a class="additional-research-header" href="https://www.nature.com/articles/s41598-024-71840-2" target="_blank" rel="noopener noreferrer">
        <img src="../figures/additional-publications/precipitation-types-header.png" width="795" height="141" alt="Publisher-page header: Future changes of precipitation types in the Peruvian Andes. Jairo Valdivia shares equal contribution with Valeria Llactayo and Christian Yarleque." />
        <svg viewBox="0 0 795 141" aria-hidden="true"><rect x="146.2" y="82" width="98.9" height="23" rx="2" /></svg>
      </a>
    </figure>
    <figure>
      <figcaption><span>IEEE Access · 2026</span><span class="additional-research-role">Co-author</span></figcaption>
      <a class="additional-research-header" href="https://ieeexplore.ieee.org/document/11595539" target="_blank" rel="noopener noreferrer">
        <img src="../figures/additional-publications/sophy-header.png" width="900" height="192" alt="Publisher-page header: Toward Operational Use of the SOPHy X-Band Radar in Peru: A Bayesian Fuzzy Logic Approach for Ground Clutter Filtering in Complex Orography. Jairo M. Valdivia-Prado is a co-author." />
        <svg viewBox="0 0 900 192" aria-hidden="true"><rect x="439.6" y="128.5" width="188.8" height="24.5" rx="2" /></svg>
      </a>
    </figure>
  </div>
</div>

<style>
.additional-research h1 {
  margin-bottom: 0;
  padding-bottom: 0;
  font-size: 1.75rem;
  line-height: 1.2;
}

.additional-research-scope {
  display: grid;
  grid-template-columns: minmax(0, 0.45fr) minmax(0, 1fr);
  align-items: baseline;
  gap: 1.65rem;
  margin: 0.3rem 0 0.7rem;
  color: var(--cu-text-muted);
  font-size: 0.9rem;
  line-height: 1.35;
}

.additional-research-selected {
  font-size: 0.8rem;
}

.additional-research-body {
  display: grid;
  flex: 1;
  grid-template-columns: minmax(0, 0.45fr) minmax(0, 1fr);
  align-items: center;
  gap: 1.65rem;
  min-height: 0;
  margin-bottom: 0.45rem;
}

.additional-research-counts {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.3rem;
  min-width: 0;
}

.additional-research-category {
  margin: 0;
  color: var(--cu-text-muted);
  font-size: 0.9rem;
  line-height: 1.3;
}

.additional-research-stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.additional-research-stat strong {
  color: var(--cu-heading);
  font-size: 3.4rem;
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.additional-research-stat span {
  font-size: 1.05rem;
  line-height: 1.3;
}

.additional-research-stat small {
  color: var(--cu-text-muted);
  font-size: 0.8rem;
  line-height: 1.35;
}

.additional-research-preprint {
  margin: 0.25rem 0 0;
  font-size: 0.95rem;
  line-height: 1.35;
}

.additional-research-preprint a {
  color: var(--cu-text);
  border-bottom: 0;
  text-decoration: none;
}

.additional-research-preprint strong {
  margin-right: 0.3rem;
  font-size: 1.35rem;
}

.additional-research-headers {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  width: 100%;
  max-width: 33.5rem;
  min-width: 0;
}

.additional-research-headers figure {
  margin: 0;
}

.additional-research-headers figcaption {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.15rem;
  color: var(--cu-text-muted);
  font-size: 0.7rem;
  line-height: 1.3;
}

.additional-research-role {
  color: var(--cu-heading);
  font-weight: 600;
  white-space: nowrap;
}

.additional-research-header {
  position: relative;
  display: block;
  width: 100%;
  overflow: hidden;
  border: 1px solid var(--cu-border);
  background: white;
}

.additional-research-header img {
  display: block;
  width: 100%;
  height: auto;
}

.additional-research-header svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.additional-research-header rect {
  fill: none;
  stroke: #8d7334;
  stroke-width: 2.5;
}

.additional-research-header:focus-visible,
.additional-research-preprint a:focus-visible {
  outline: 2px solid var(--cu-gold-accessible);
  outline-offset: 3px;
}
</style>

<!--
About 45–60 seconds, no clicks. These are additional research contributions,
not additional dissertation chapters. The three publisher headers are selected
examples, not the complete list counted on the left.

Suggested delivery: “Alongside the dissertation, I contributed to six other
journal articles published since 2024: two with first or shared first
authorship, and four as a co-author. These include hailstorm observations in
the Peruvian Andes, future changes in precipitation phase, and radar
ground-clutter filtering. I also co-authored a disdrometer-evaluation preprint,
which is reported separately from the published articles.”

Shared authorship: the Scientific Reports Author notes state, “These authors
contributed equally: Valeria Llactayo, Jairo Valdivia and Christian Yarleque.”
Thus the two first-author publications comprise one sole-first-author article
and one shared-first-author article, not two sole-first-author articles.

The four other co-authored publications are the Journal of Earth System Science
diurnal-cycle study (2024), the Agricultural and Forest Meteorology surface
energy/stability study (2025), the Pure and Applied Geophysics extreme-rainfall
case studies (2025), and the IEEE Access SOPHy clutter-filtering study (2026).
Do not invent specific personal roles in these collaborative studies; explain
them from your own experience if asked.

The extra preprint is Pérez-Tello et al. (2026), “Evaluation and Correction of
Precipitation Types Measured by a PARSIVEL2 Disdrometer in a Tropical Glacier
Environment,” https://doi.org/10.5194/egusphere-2026-2705. It is not counted as
a published journal article.

Exclude the four thesis studies (DCT smoothing, spectral local statistics,
CTGC population evolution, and 3D CTGC/fall-streak structure), the related
2025 AMS conference abstract, and duplicate preprint/published versions.
Inventory, DOI links, screenshot provenance, and counting rules:
figures/additional-publications/sources.md. Verified 10 October 2026.

Transition to personal acknowledgments.
-->

---
layout: none
title: Thank you
---

<ThankYouPhotos />

<script setup>
import ThankYouPhotos from '../components/ThankYouPhotos.vue'
</script>

<!--
Personal acknowledgments. All photographs in pictures/ appear around a stationary
“Thank you.” Background photographs expand and contract from 0.5× to 2×, gently
pushing their neighbors while remaining tethered to their home positions.
Individual photographs periodically zoom in from their current locations,
expanding inward near the edges rather than moving to fixed spotlight positions.
Every photograph is featured before the sequence repeats.

Move the pointer to reveal Pause below the heading, or reach it with Tab, to hold
the current photographs while speaking. Use Resume to continue. Moving to
Questions stops the animation. Reduced-motion,
overview, and print/export views use the static collage.
-->

---
class: dissertation-questions
title: Questions
---

<div class="dissertation-questions-content">
  <h1>Questions</h1>
  <p>Thank you to the committee, the WINTRE-MIX participants, <br />and NSF awards AGS-2113995 and AGS-2114011.</p>
</div>

<style>
.dissertation-questions-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 1.6rem;
  min-height: 0;
  margin-bottom: 1.4rem;
  text-align: center;
}

.dissertation-questions-content h1 {
  margin: 0;
  font-size: 2.75rem;
}

.dissertation-questions-content p {
  max-width: 42rem;
  margin: 0;
  color: var(--cu-text);
  font-size: 1.1rem;
  line-height: 1.6;
  text-wrap: pretty;
}
</style>

<!--
Pause.

Likely questions, and where to go:

- Williams: boundary conditions, Neff, why the anomaly is not a raw composite. Backup: boundary, polar gaps, DCT comparison.
- Winters: why two bands, shear, soundings. Backup: synoptic and sounding. Do not claim rolls.
- Zaremba: sampling versus airborne volumes, overlap of the fall streak. Backup: mid-level anomaly and the nine-time context.
- Tessendorf: how general is one storm, seeder–feeder. Stay on the attribution limit.
- Friedrich: where Chapter 2 and 3 enter Chapter 5. The bridge slide is the answer.

Backup starts on the next slide.
-->
