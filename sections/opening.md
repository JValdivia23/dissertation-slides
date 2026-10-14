---
layout: default
class: ctgc-intro
---

# Cloud-Top Generating Cells

<div class="ctgc-definition">
  <p>“In radar, a small region of locally high reflectivity from which a trail of hydrometeors originates.”</p>
  <cite><a href="https://glossary.ametsoc.org/wiki/Generating_cell/">AMS Glossary of Meteorology — generating cell</a></cite>
</div>

<div class="ctgc-figure">
  <svg class="ctgc-example" viewBox="0 0 1080 478" role="img" aria-label="DOW6 range-height radar scan on 23 February 2022 at 02:28 UTC. A boxed cloud-top reflectivity enhancement is linked to a separate conceptual generating-cell schematic outside the radar plot.">
    <image href="../figures/ctgc-intro-rhi.png" x="40" y="18" width="660" height="431.28" />
    <text x="105" y="67" class="ctgc-rhi-label">DOW6 · 23 Feb 2022 · 02:28 UTC</text>
    <text x="326" y="474" text-anchor="middle" class="ctgc-axis-label">Horizontal distance from radar (km)</text>
    <text transform="translate(14 245) rotate(-90)" text-anchor="middle" class="ctgc-axis-label">Vertical distance from radar (km)</text>
    <rect x="378" y="100" width="54" height="68" class="ctgc-callout" />
    <path d="M432 100 L482 8 H788 V98 H824" class="ctgc-connector" />
    <text x="942" y="83" text-anchor="middle" class="ctgc-schematic-label">Conceptual generating cell</text>
    <rect x="824" y="98" width="236" height="300" class="ctgc-callout" />
    <image href="../figures/ctgc-intro-schematic.png" x="830" y="113" width="224" height="269.49" />
    <path d="M843 432 V414 M838 420 L843 414 L848 420" class="ctgc-air-key" />
    <text x="858" y="430" class="ctgc-key-label">Air motion</text>
    <path d="M843 445 V465" class="ctgc-particle-key" />
    <path d="M838 459 L843 465 L848 459" class="ctgc-particle-tip" />
    <text x="858" y="462" class="ctgc-key-label">Particle descent</text>
  </svg>
</div>

<p class="fine">WINTRE-MIX observation. Concept adapted from Kumjian et al. (2014); schematic is not to scale.</p>

<!--
Start with the AMS radar definition.

Point to the boxed feature in the DOW6 range-height scan. These cloud-top reflectivity enhancements are typically about one to two kilometers width.

Point to the conceptual core and surrounding shroud, then follow the descending particles. Ice particles form and grow in the cells and descend in fall streaks; they can continue growing in the cloud below.

Due to their scale this process is typically not resolved in numerical models. And some research suggest that CTGCs are present in every winter precipitation.
-->

---
class: ctgc-background
clicks: 1
---

# CTGC Formation

<div class="ctgc-background-stages">

<section class="ctgc-background-panel ctgc-known">
  <div class="ctgc-known-copy">
    <h2></h2>
    <dl class="ctgc-processes">
      <div>
        <dt>Potential instability</dt>
        <dd>Lifting potentially unstable air can initiate cloud-top convection.</dd>
      </div>
      <div>
        <dt>Wind shear</dt>
        <dd>Influences cell shape and organization; can support shear-driven initiation.</dd>
      </div>
      <div>
        <dt>Longwave radiative cooling</dt>
        <dd>Destabilizes the upper cloud and helps sustain convection.</dd>
      </div>
    </dl>
    <p class="ctgc-process-sources">Kumjian et al. (2014); Rauber et al. (2014); Keeler et al. (2016b, 2017).</p>
    <div class="ctgc-known-takeaways">
      <p v-click.hide="1">Instability and shear influence CTGC structure and organization.</p>
      <p v-click="1">Radiative cooling can sustain cells in initially stable clouds.</p>
    </div>
  </div>
  <div class="ctgc-simulations">
    <figure v-click.hide="1">
      <svg class="ctgc-simulation-plot" viewBox="0 0 1040 940" role="img" aria-label="Keeler et al. (2017), Figure 9: simulated ice precipitation mixing ratio at 7.5 km under nighttime radiation. Rows vary initial stability; columns vary wind shear from 0 to 4 to 10 meters per second per kilometer.">
        <g transform="translate(13 11)">
          <image href="../figures/ctgc-keeler-instability.png" width="1002" height="924" />
        </g>
      </svg>
      <figcaption>Idealized plan views · Keeler et al. (2017), Fig. 9.<br>7.5 km · <i>t</i> = 180 min · 50.1 × 50.1 km domain.</figcaption>
    </figure>
    <figure v-click="1">
      <svg class="ctgc-simulation-plot" viewBox="0 0 1040 940" role="img" aria-label="Keeler et al. (2016b), Figure 18: simulated ice precipitation mixing ratio at 7.5 km. Rows vary initial stability; columns compare nighttime, daytime, and no radiation. Cells occur in initially stable simulations with radiative forcing, but not without it.">
        <g transform="translate(12.086 18.993) scale(0.827338)">
          <image href="../figures/ctgc-keeler-radiation.png" width="1236" height="1102" />
        </g>
      </svg>
      <figcaption>Idealized plan views · Keeler et al. (2016b), Fig. 18.<br>7.5 km · <i>t</i> = 180 min · 50.1 × 50.1 km domain.</figcaption>
    </figure>
  </div>
</section>

</div>

<!--
Through simulations we know that there are 3 main processes that control CTGCs formation.

Keeler on 2017 evaluated how different combination of these factors can form and organize CTGC.

On this figure, in the vertical axis we have the potential stability.
And in the horizontal axis we have the wind shear.
We observe that unstable conditions can trigger CTGC even when no shear is present, but wind shear can make the them bigger and shape them in horizontal roll-like structures. 


[click] In other hand, radiative cooling can destabilize the layer below it.
-->

---
class: ctgc-background
---

# CTGC Observational Gaps

<div class="ctgc-background-stages">

<section class="ctgc-background-panel ctgc-gaps">

  <div class="ctgc-gap-cards">
    <div class="ctgc-gap-card">
      <h3>Population life cycle</h3>
      <div class="ctgc-gap-figure" aria-hidden="true">
        <svg viewBox="0 0 220 110"><g fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M18 88 H202 M60 83 V93 M110 83 V93 M160 83 V93 M196 82 L202 88 L196 94" />
          <rect x="42" y="34" width="12" height="10" /><rect x="58" y="46" width="12" height="10" /><rect x="44" y="58" width="12" height="10" />
          <rect x="93" y="29" width="18" height="14" /><rect x="114" y="42" width="18" height="14" /><rect x="97" y="58" width="18" height="14" />
          <rect x="155" y="41" width="14" height="11" /><rect x="176" y="56" width="10" height="8" />
        </g></svg>
        <span>Formation → growth → decay</span>
      </div>
      <p class="ask">How does a population develop and decay?</p>
      <p>Evolution of cell number, size, and polarimetric signatures was poorly characterized.</p>
    </div>
    <div class="ctgc-gap-card">
      <h3>Horizontal structure</h3>
      <div class="ctgc-gap-figure" aria-hidden="true">
        <svg viewBox="0 0 220 110"><g fill="none" stroke="currentColor" stroke-width="1.8">
          <rect x="12" y="14" width="78" height="78" stroke-dasharray="4 3" /><rect x="130" y="14" width="78" height="78" stroke-dasharray="4 3" />
          <ellipse cx="34" cy="34" rx="9" ry="6" /><ellipse cx="62" cy="45" rx="9" ry="6" /><ellipse cx="37" cy="66" rx="9" ry="6" /><ellipse cx="69" cy="75" rx="8" ry="5" />
          <path d="M98 53 H122 M116 47 L122 53 L116 59" />
          <ellipse cx="167" cy="36" rx="23" ry="8" transform="rotate(-20 167 36)" /><ellipse cx="170" cy="67" rx="23" ry="13" transform="rotate(20 170 67)" />
        </g></svg>
        <span>Illustrative plan-view changes</span>
      </div>
      <p class="ask">How do cell shape and spatial organization change?</p>
      <p>Morphology, distribution, and merging needed quantitative observations through time.</p>
    </div>
    <div class="ctgc-gap-card">
      <h3>Associated precipitation</h3>
      <div class="ctgc-gap-figure" aria-hidden="true">
        <svg viewBox="0 0 220 110"><g fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M136 12 H178 M172 6 L178 12 L172 18" />
          <rect x="30" y="48" width="160" height="24" fill="currentColor" fill-opacity="0.08" />
          <rect x="136" y="24" width="42" height="24" /><path d="M157 44 L110 72 V94" />
          <path d="M52 84 V94 M72 84 V94 M132 84 V94 M152 84 V94 M172 84 V94" />
          <rect x="95" y="48" width="30" height="46" stroke-dasharray="4 3" />
        </g><g fill="currentColor" font-size="12"><text x="128" y="16" text-anchor="end">Motion</text><text x="53" y="64">Cloud</text></g></svg>
        <span>Cell → fall streak → precipitation</span>
      </div>
      <p class="ask">How does precipitation evolve below a moving cell?</p>
      <p>Three-dimensional connections and enhancement relative to surrounding precipitation remained uncertain.</p>
    </div>
  </div>
  <p class="ctgc-gap-history">Precipitation-growth studies: Hobbs et al. (1980); Houze et al. (1981); Plummer et al. (2015). Individual-cell attribution remains unresolved.</p>
</section>

</div>

<!--
About 30 seconds, no clicks. Present the three observational gaps, framed as the state of knowledge before this dissertation. First, the full population life cycle: how the number, size, and inferred particle properties of cells change from formation through dissipation. Population duration is not the lifetime of an individual cell. Second, time-resolved horizontal morphology and organization: the changing cell shapes, spatial distributions, and merging processes. Prior observations had documented instantaneous structure and organization; do not claim that no plan views existed before this work. The diagrams are illustrative questions, not the dissertation's results.

Third, the evolving three-dimensional connection between moving cells, their fall streaks, and precipitation relative to the surrounding field. Early work by Hobbs et al. (1980) and Houze et al. (1981) quantified precipitation growth; later studies, including Plummer et al. (2015), also provide quantitative evidence. Do not claim that no quantification occurred after the 1980s or equate the fraction of mass growth inside a cell with its contribution to total precipitation. The dissertation measures precipitation contrasts associated with a tracked fall streak, not the causal fraction produced by one cell or the storm-total contribution.

The slide's final attribution statement is a continuing limitation, not a gap claimed to have been closed by this dissertation.

Transition: addressing these gaps requires sustained observations of moving cells and their precipitation. The next slide explains why previous sampling rarely provided that view. Keep the observational limitations and the event-based dissertation objectives distinct from the broader scientific questions.
-->

---
class: observation-limits
---

# Observational Limitations

<div class="limit-row">

<div class="limit-card">
  <div class="geom-row" aria-hidden="true">
    <div>
      <svg viewBox="0 0 72 52"><g transform="translate(16,6) scale(1.667)"><g transform="rotate(90 12 12)"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="currentColor" stroke="none" /></g></g></svg>
      <span>Aircraft</span>
    </div>
    <div>
      <svg viewBox="0 0 72 52"><path d="M14 44 L34 12 A28 28 0 0 1 58 30 L14 44" fill="none" stroke="currentColor" stroke-width="1.8" /><circle cx="14" cy="44" r="2.4" fill="currentColor" /></svg>
      <span>PPI/RHI</span>
    </div>
    <div>
      <svg viewBox="0 0 72 52"><path d="M36 4 V48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-dasharray="3 2.5" /><rect x="18" y="18" width="36" height="16" fill="none" stroke="currentColor" stroke-width="1.8" /></svg>
      <span>Vertical</span>
    </div>
  </div>
  <h3>Incidental snapshots</h3>
  <p>Most published views are a single aircraft pass, RHI/PPI scan, or vertically pointing profile, often collected while the study focused on the broader storm.</p>
</div>

<div class="limit-card">
  <div class="advect" aria-hidden="true">
    <div class="advect-motion"><span>Motion</span><i></i></div>
    <div class="advect-scene">
      <b></b>
      <b class="on"></b>
      <b></b>
      <span>Fixed scan</span>
    </div>
  </div>
  <h3>Advection through a fixed scan</h3>
  <p>A 1–2 km cell is observed only while it crosses the beam. A fixed scan does not remain with the cell or the snow falling below it.</p>
</div>

<div class="limit-card">
  <div class="duration" aria-hidden="true">
    <p>Tracked cell, at least 10 min</p>
    <div class="bar short"></div>
    <p>Population duration</p>
    <div class="bar long"></div>
  </div>
  <h3>Cell lifetime and population duration</h3>
  <p>One continuously tracked cell lasted at least ~10 min (Kumjian et al. 2014). Populations are common in winter storms sampled at sufficient resolution.</p>
</div>

</div>

<!--
These questions have stayed open because of how the cells are observed.

Most published observations are single snapshots, often collected while the study focused on the broader storm: an aircraft pass, an RHI or PPI scan, or a vertically pointing radar. Kumjian et al. (2014, J. Appl. Meteor. Climatol.) distinguished this kind of snapshot from a sequence intended to follow evolution. FROST, PLOWS, SNOWIE, and SOCRATES were not designed specifically to follow these cells.

The cells move with the flow. Kumjian et al. steered range–height scans along the mean cell motion, and still noted a motion component out of the scan plane.

Kumjian et al. followed one vigorous cell for about 10 minutes and reported lifetimes of at least 10 minutes. An older scanning-radar study inferred lifetimes of several hours; that was not a continuous track of one cell.

Populations are common in winter storms sampled closely enough to resolve them. Kumjian et al. found generating cells in every FROST case and described them as very common, if not ubiquitous. Rosenow et al. (2014) described them as ubiquitous in the PLOWS dataset. Tessendorf et al. (2024) described them as fairly ubiquitous in winter orographic clouds. Do not say every winter storm.

This dissertation does not try to close those three questions for winter storms in general. For one observed storm, it asks what the radar observations can show. Do not open the range-dependent radar window here; that begins the methods.
-->

---
class: dissertation-objectives
---

# Dissertation Objectives

<div class="limit-row">

<div class="limit-card">
  <h3>Radar analysis</h3>
  <div class="question-figure objective-methods" aria-hidden="true">
    <svg viewBox="0 0 220 112"><g fill="none" stroke="currentColor" stroke-width="1.8">
      <rect x="70" y="20" width="72" height="72" />
      <path d="M94 20 V92 M118 20 V92 M70 44 H142 M70 68 H142" />
      <rect x="97" y="47" width="18" height="18" stroke-dasharray="4 3" />
      <circle cx="106" cy="56" r="30" />
    </g></svg>
  </div>
  <p class="ask">Develop and evaluate efficient smoothing and local statistics for radar fields with changing sampling geometry and missing data.</p>
</div>

<div class="limit-card">
  <h3>Population evolution</h3>
  <div class="question-figure objective-population" aria-hidden="true">
    <svg viewBox="0 0 220 112"><g fill="none" stroke="currentColor" stroke-width="1.8">
      <path d="M20 92 H200 M60 86 V92 M110 86 V92 M160 86 V92" />
      <rect x="42" y="35" width="12" height="9" /><rect x="62" y="45" width="12" height="9" /><rect x="48" y="58" width="12" height="9" />
      <rect x="100" y="38" width="14" height="10" /><rect x="116" y="48" width="14" height="10" /><rect x="104" y="60" width="14" height="10" />
      <rect x="153" y="40" width="34" height="26" /><path d="M170 40 V66" stroke-dasharray="4 3" />
    </g></svg>
  </div>
  <p class="ask">Characterize changes in the organization and polarimetric signatures of one observed cell population.</p>
</div>

<div class="limit-card">
  <h3>One cell and its precipitation</h3>
  <div class="question-figure objective-cell" aria-hidden="true">
    <svg viewBox="0 0 220 112"><g fill="none" stroke="currentColor" stroke-width="1.8">
      <rect x="30" y="48" width="160" height="24" fill="currentColor" fill-opacity="0.08" />
      <rect x="136" y="24" width="42" height="24" />
      <path d="M157 44 L110 72 V94" />
      <path d="M52 84 V94 M72 84 V94 M132 84 V94 M152 84 V94 M172 84 V94" />
      <rect x="95" y="48" width="30" height="46" stroke-dasharray="4 3" />
    </g></svg>
  </div>
  <p class="ask">Examine a selected cell's three-dimensional structure and fall streak relative to the surrounding precipitation.</p>
</div>

</div>

<!--
These are the objectives this dissertation addresses, not the three broader questions. The first is addressed by two methodological studies. The second concerns the population in one WINTRE-MIX event; the third concerns a cell selected from that population. The fall-streak analysis examines structure and precipitation contrasts, not the cell's individual contribution to precipitation.

Transition from the limits: those sampling limits define what can be claimed. This dissertation develops tools to analyze the available radar data, then uses one observed storm to study a population and one selected cell. Do not imply that the methods in Chapters 2 and 3 produced the Chapter 4 results; Chapter 5 combines those methods with the track from Chapter 4.
-->

---
class: presentation-roadmap
---

# Presentation Roadmap

<div class="roadmap">
  <div class="roadmap-sources">
    <div class="roadmap-methods">
      <section class="roadmap-stage">
        <span class="roadmap-paper">Paper 1 <span class="roadmap-status published" title="Published" aria-label="Published">★</span></span>
        <div class="roadmap-method-content">
          <h2>Radar data smoothing using the DCT</h2>
          <p>Fast noise removal</p>
        </div>
      </section>
      <svg class="roadmap-method-link" viewBox="0 0 20 32" aria-hidden="true">
        <path d="M10 0 V26 M4 20 L10 26 L16 20" />
      </svg>
      <section class="roadmap-stage">
        <span class="roadmap-paper">Paper 2 <span class="roadmap-status review" title="Under review" aria-label="Under review">◷</span></span>
        <div class="roadmap-method-content">
          <h2>Spectral-domain local statistics</h2>
          <p>Spectral operation for cartesian and polar grids</p>
        </div>
      </section>
    </div>
    <section class="roadmap-stage roadmap-population">
      <span class="roadmap-paper">Paper 3 <span class="roadmap-status published" title="Published" aria-label="Published">★</span></span>
      <h2>Temporal evolution of cloud-top generating cells</h2>
      <p>CTGC population life cycle and organization</p>
    </section>
  </div>

  <svg class="roadmap-links" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true">
    <path d="M245 0 L500 65 M755 0 L500 65 M500 65 V94" />
    <path d="M490 82 L500 94 L510 82" />
  </svg>

  <section class="roadmap-stage roadmap-destination">
    <span class="roadmap-paper">Paper 4 <span class="roadmap-status review" title="Under review" aria-label="Under review">◷</span></span>
    <h2>Tracking 3D CTGC structure and associated precipitation</h2>
    <p>CTGC fall streak and precipitation</p>
  </section>
</div>

<p class="roadmap-legend fine"><span class="roadmap-status published">★</span> Published&nbsp;&nbsp;&nbsp;<span class="roadmap-status review">◷</span> Under review</p>

<!--
These four boxes represent the four papers in talk order. Paper 1 develops physical-scale smoothing for radar data; Paper 2 extends that spectral framework to local statistics with missing data. Paper 3 follows a population of cells in one storm and identifies a persistent cell. Paper 4 brings the methods from Papers 1 and 2 together with that cell track to examine three-dimensional structure, the fall streak, and precipitation context. I will close with a synthesis and limitations.

The arrows summarize the narrative, not every direct methodological input: Paper 1 leads to Paper 2, while Papers 2 and 3 connect to Paper 4. Paper 4 also draws directly on Paper 1's smoothing. The methods studies are Chapters 2 and 3, the population study is Chapter 4, and the selected-cell study is Chapter 5. Do not imply that the methods in Chapters 2 and 3 produced the Chapter 4 results. The precipitation contrasts do not attribute an individual contribution to the selected cell.

Status, if asked:

- Valdivia, Chapman, and Friedrich, AMT, 2026. doi:10.5194/amt-19-5211-2026
- Valdivia, Chapman, and Friedrich, arXiv:2604.22721. Under review. Not accepted.
- Valdivia, Friedrich, Zaremba, and Tessendorf, JAS, 2026. doi:10.1175/JAS-D-25-0088.1
- Same author team, GRL manuscript 2026GL126989, submitted 16 September 2026. Not accepted.

Transition: I will begin with the radar-analysis problem: smoothing at a consistent physical scale without repeatedly applying an expensive, range-dependent spatial window. Advance to Paper 1's title slide, then begin its independent introduction.
-->
