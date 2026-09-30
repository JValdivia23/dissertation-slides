---
class: dissertation-synthesis
title: Dissertation synthesis
---

<div class="dissertation-synthesis-body">
  <DissertationSynthesis />
</div>

<script setup>
import DissertationSynthesis from '../components/DissertationSynthesis.vue'
</script>

<style>
.dissertation-synthesis-body {
  display: flex;
  flex: 1;
  min-height: 0;
  margin: 0 0 1.8rem;
}
</style>

<!--
About 40–45 seconds, no clicks. Navigation title only; no visible heading.
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
-->

---
class: conclusions-bullets dissertation-conclusions
title: General conclusions
---

<div class="dissertation-conclusion-body">

- Spectral methods provide efficient radar smoothing and missing-data-aware local statistics with explicit boundary treatment.
- The observed population evolved over approximately 1.7 hours, with mature-stage merging and clustering into fewer, larger radar features.
- Differential-reflectivity changes are consistent with early aggregation and later preferential fallout and particle sorting.
- The selected cell’s fall streak extended below the melting layer within pre-existing precipitation, consistent with a seeder–feeder interaction.

</div>

<p class="dissertation-scope">The observational findings describe one winter storm, <br />with three-dimensional analysis of one selected cell.</p>

<style>
.dissertation-conclusion-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.dissertation-conclusion-body li {
  text-wrap: pretty;
}

.dissertation-scope {
  margin: 0.7rem 0 1.4rem 1.7rem;
  padding: 0.45rem 0.75rem 0.45rem 0.95rem;
  border-left: 4px solid var(--cu-gold);
  color: var(--cu-text);
  font-size: 1.05rem;
  line-height: 1.4;
  text-wrap: pretty;
}
</style>

<!--
About 55–60 seconds, no clicks. Four plain-text findings with no visible title
or bold lead-in labels. They summarize Chapter 6 and answer the three
dissertation objectives: methods; population organization and inferred
particle properties; one cell's three-dimensional precipitation context.

Suggested delivery: “First, the spectral methods make smoothing and local
statistics efficient while treating boundaries and missing observations
explicitly. In the observed storm, the population evolved over about
1.7 hours, organizing through merging and clustering. The polarimetric
evolution is consistent with early aggregation and later preferential
fallout and sorting. Finally, the selected cell's fall streak continued
below the melting layer within an existing precipitation field, consistent
with a seeder–feeder interaction. The observational findings describe this
storm and the selected cell, rather than universal CTGC behaviour.”

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
