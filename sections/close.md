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
      <p class="dissertation-scope"></p>
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
To conclude.
We have seen those for projects. 

On the first 2 papers we created an efficient spectral domain processing framework. 
On the paper 3 we characterized a CTGC population and its microphysical evolution.
Finally, on the paper 4 we resolved the 3D structure of a single CTGC and its fall streak, proving new insight into how CTGC enhance precipitation.
-->

---
class: dissertation-outlook
title: Future work
---

# Future work

<div class="dissertation-outlook-actions">
  <section><p>Analyze more CTGC cases using the large existing dataset.</p></section>
  <section><p>Study microphysical evolution along fall streaks.</p></section>
  <section><p>Improve estimates of CTGC contributions to precipitation.</p></section>
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
As a future work, there 3 main paths that I would like to highlight

We have a massive dataset collection. 

We also want to analyze the microphysical evolution of fall streaks

And improve the estimates of CTGC contributions, maybe analyzing the CTGC population contribution.

I have a couple of side projects that didn't see the light yet.
One is the dual doppler analysis
The other other one is the TMatrix simulations for PID with non-collocated radars.
-->

---
class: figure-slide mountain-albedo-experiment
title: Side project
---

# Side project

<p class="!mt-0 !mb-2 text-xl">Mountain albedo modification</p>

<div class="flex flex-1 min-h-0 items-center gap-8">
  <div class="w-1/4 flex-none">
    <div class="mb-7">
      <div class="text-5xl font-semibold">0.8</div>
      <div class="text-base mt-1">Soil albedo</div>
    </div>
    <div class="mb-7">
      <div class="text-3xl font-semibold">&gt;1,000 m</div>
      <div class="text-base mt-1">Elevation threshold · Globally</div>
    </div>
    <div class="text-base">Vegetation unchanged</div>
  </div>
  <div class="flex flex-col flex-1 h-full min-h-0">
    <div class="relative flex-1 min-h-0">
      <img class="absolute inset-0 w-full h-full object-contain object-bottom" src="../figures/mountain-albedo/soil-modification-mask.svg" alt="Prescribed soil-modification mask from the actual CESM surface input: gold marks 2,061 native grid cells assigned soil class 21 and albedo 0.8; other land is muted gray, and polar regions are unmodified" />
    </div>
  </div>
</div>

<p class="fine !mt-1 !mb-0 !text-[13px] !leading-snug">Collaborators: Jen Kay · Aneesh Subramanian · Katja Friedrich<br />In preparation · Planned submission to GRL</p>

<!--
But I have other side project that is being more successful.
-->

---
class: figure-slide mountain-albedo-results
title: 'Side project: results'
clicks: 1
---

# Side project: results

<div class="relative flex-1 min-h-0">
  <div v-show="$clicks < 1" class="absolute inset-0 grid grid-cols-[2fr_1fr] gap-7 min-h-0">
    <div class="flex flex-col min-h-0">
      <p class="!mt-0 !mb-1 text-sm text-center">Global temperature</p>
      <div class="relative w-full" style="aspect-ratio: 2823 / 1088">
        <img class="absolute inset-0 w-full h-full object-contain" src="../figures/mountain-albedo/global-temperature.png" alt="Global temperature anomaly time series; the experiment cools by almost one degree Celsius by 2030 relative to the ensemble reference, with gray shading showing ensemble spread" />
      </div>
      <p class="!mt-2 !mb-0 !leading-snug text-lg text-center">Temperature decrease:<br /><strong>almost 1°C by 2030</strong></p>
    </div>
    <div class="flex flex-col min-h-0">
      <p class="!mt-0 !mb-1 text-sm text-center">Rocky Mountains · 2015–2029 time mean</p>
      <div class="relative flex-1 min-h-0">
        <img class="absolute inset-0 w-full h-full object-contain" src="../figures/mountain-albedo/rocky-mountains-snow.png" alt="Rocky Mountains snow-depth difference map with the original color scale in meters; local peak increases approach one foot, not the regional average" />
      </div>
      <p class="!mt-2 !mb-0 !leading-snug text-lg text-center">Peak snow-depth increase:<br /><strong>~1 foot</strong> in the Rocky Mountains</p>
    </div>
  </div>
  <div v-show="$clicks >= 1" class="absolute inset-0 flex flex-col min-h-0 pt-3">
    <div class="relative flex-1 min-h-0">
      <img class="absolute inset-0 w-full h-full object-contain" src="../figures/mountain-albedo/global-precipitation.svg" alt="Revised global precipitation-difference map in millimeters per day, with the author's orange–purple color scale from minus 3 to plus 3 and cross markers based on ensemble spread" />
    </div>
    <p class="!mt-2 !mb-0 text-xl text-center"><strong>Precipitation patterns change globally.</strong></p>
  </div>
</div>

<p class="fine !mt-2 !mb-0 !text-xs !leading-snug">Experiment − CESM2-LE ensemble mean</p>

<!--
Temperature, snow in other areas
Precipitation globally.
-->

---
class: additional-research
title: Additional research contributions
clicks: 1
---

<AdditionalResearchBoard />

<script setup>
import AdditionalResearchBoard from '../components/AdditionalResearchBoard.vue'
</script>

<!--
About 45–60 seconds, one click. These are additional research contributions,
not additional dissertation chapters. The opening frame keeps the counts and
three selected headers. One click starts the complete document-board animation:
the current headers spread out, the counts move to the upper-right corner,
and four additional headers enter automatically with staggered delays.
The time window and outside-dissertation scope remain in the lower-right corner.

[click] Let the roughly two-second sequence finish. All six journal articles
and the separately labeled preprint remain visible; no further reveal clicks
are needed. The next click advances to personal acknowledgments. Backing up
one click restores the opening frame. Reduced-motion playback removes the
movement and delays; overview and print-mode views show the complete board.

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
title: Gracias a todos
subtitle: for making this possible
# One paragraph per message; keep two-space indentation and blank lines between people.
personalThanks: |
  A mi mamá, por siempre estar ahí cuando la necesito...

  To my advisor Katja, for her trust and guidance...

  To Yamina Silva, for showing me how to be a scientist...

  To my beautiful girlfriend Clairy, for being the loveliest person I ever met...

  A toda mi familia, en especial a mis tías que son como segundas mamás...

  A Jhonmer y Josep, las personas que han pasado más tiempo a mi lado...

  A todos mis amigas y amigos que compatireron sueños y experiencias conmigo
---

<ThankYouPhotos
  :title="$frontmatter.title"
  :subtitle="$frontmatter.subtitle"
  :personal-thanks="$frontmatter.personalThanks"
/>

<script setup>
import ThankYouPhotos from '../components/ThankYouPhotos.vue'
</script>

<!--
I cannot finish this defense without saying how thankful I am with all the people that was part of this long journey.

To my mom for always being there when I need her

To my advisor Katja for give me the opportunity to work with her, for all the trust and guidance she put into me

To Yamina Silva, Danny Scipion and all the awesome people from Geophysical institute of Peru, I am so lucky so have had the opportunity to work with the most outstanding earth scientists of Peru, and learn a lot of them, I would be here if it wasn't for them

To my girlfriend Clairy, for being the loveliest person I ever met

To all my familly, specially my aunts that always treated me as another son

To my brother, my cousins and all my friends who I have shared dreams and experiences

To all people in ATOC, atoc is jsut a great place to be
-->

---
class: dissertation-questions
title: Questions
---

<div class="dissertation-questions-content">
  <h1>Questions?</h1>
  <p>Thank you to my committee, <br />and all the people that make research projects possible.</p>
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
Finally, I want to thanks to my committee members and all the people that make research projects possible.
-->
