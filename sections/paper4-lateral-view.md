---
class: paper4-lateral
clicks: 2
---

# Lateral view

<Paper4LateralView />

<script setup>
import Paper4LateralView from '../components/Paper4LateralView.vue'
</script>

<!--
About 45 seconds, following Madison slide 11. This is the original conference
reference volume and maximum-anomaly figure, not the schematic on slide 48.
The plotted maximum reflectivity anomaly is Z-prime-max in dB, not equivalent
reflectivity in dBZ. The reused two-dimensional panel is 02:54 UTC, as labeled;
it is a maximum projection, not a particle path or the single-transect cross
sections introduced on the next slide. Layer boxes identify regions for
discussion; they are not a time-invariant retrieval of layer boundaries.

Entry: continue from the exact reference frame, crop, scale, and viewport from slide
50's reference-view ending. The original MP4s do not join
on their own: slide 50 preserves the twelve-second evolution, then returns to
this reference volume before the handoff. This reset is not new storm evolution.

The original one-second camera rotation plays automatically on entry, without
an initial static stage or a click. It then holds its final lateral frame. Do
not loop, restart it on the next click, or advance time while describing the
vertical structure.

[click] Reveal the same figure used on the left side of Madison slide 11: the
02:54 panel, original shared distance axis, and original colorbar. The ring
marks the cloud-top feature highlighted in that presentation. Keep the lateral
isosurfaces visible on the right. The projection summarizes gridded anomaly
values, whereas the isosurfaces display only the 5- and 7-dB thresholds. A
maximum projection can superpose features; it does not demonstrate that they
form one continuous particle path.

[click] Label the generating, mid-cloud, and melting-layer regions. Cloud-top
turrets coexist with underlying echo structures and a strong low-level anomaly.
Ask whether the feature below the cell is a continuous cell-only fall streak,
or whether it interacts with pre-existing precipitation. Keep "Fall streak?"
as a question; the projection alone does not establish exclusive particle
origin. Continue to the time-resolved vertical cross sections for evidence.

Provenance: figure and video hold frames exported by
scripts/export-paper4-lateral.py from the original Madison slide 11 and the
byte-identical movie assets already bundled in figures/. The original files
and plotted values are unchanged. Video motion is web-only; static holds are
available for export, but PDF/PNG export must be checked separately.
-->
