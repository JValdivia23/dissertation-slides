# Mountain albedo modification: presentation figures

Prepared 11 October 2026 from the author's PDFs in `MAE_figures/`. This side
project is outside the dissertation chapters and published-article counts.
Collaborators: Jen Kay, Aneesh Subramanian, and Katja Friedrich. Status:
manuscript in preparation; planned submission to Geophysical Research Letters.

## Confirmed experiment and statistical interpretation

The author confirmed soil albedo 0.8 above 1,000 m globally, with vegetation
unchanged. The gray temperature band and the maps' `|Z| ≥ 1.96` stippling use
ensemble spread, not uncertainty in the ensemble mean. The snow figure names
CESM2-LE as the reference and reports the 2015–2029 mean. No model resolution,
forcing scenario, or number of perturbed members is inferred from these plots.

The earlier context is slides 15–19 of
`/Users/java1127/Library/CloudStorage/OneDrive-UCB-O365/presentations/modificacion_del_clima-unajma/presentacion-20min.pptx`.
Reference slide 17 supplies the experiment-map image and the visual structure
for the first slide. Its older time period and temperature summary are not
used for the updated results.

## Presentation-only derivatives

The original PDFs are not modified. PNGs are rendered at four pixels per PDF
point using `scripts/export-mountain-albedo.py` and PyMuPDF. Crop coordinates
are PDF points measured from the upper-left corner. The Rocky Mountains crop
retains only its regional map and color bar; the other result crops retain
the source width.

| Slide asset | Source PDF in `MAE_figures/` | Crop top | Annotation changes |
| --- | --- | --- | --- |
| `global-temperature.png` | `30_trefht_anomaly_spaghetti_global.pdf` | 20 | Omit the original title; correct the gray-band key to `Spread (±1.96σ)`; enlarge axis and legend text |
| `global-precipitation.png` | `60_prect_ensemble_map_abs_delta_global.pdf` | 22 | Omit the title containing a literal `\n`; enlarge colorbar tick and unit labels; the slide notes explain stippling |
| `rocky-mountains-snow.png` | `50_snow_ensemble_map_regional.pdf` | 95 | Crop `(270, 95, 523, 421)` to retain the Rocky Mountains map and its original color bar; enlarge colorbar text; omit regional-average and threshold-area summaries |
| `regional-snow.png` | `50_snow_ensemble_map_regional.pdf` | 95 | Omit the original title and panel-header rows; prepend one compact row with region names and the same means in meters; the slide supplies the period and reference |

Annotation-only masks and retyped 12-point Arial labels improve readability
when the temperature and snow figures share one slide. Temperature axis text
is replaced outside the plot frame; its legend swatches and line samples are
retained. The precipitation and snow colorbar numbers and units are retyped
below their bars, preserving the original scales and tick positions. All
mask bounds and label coordinates are recorded in the exporter. Curves,
gridded map values, stippling, contours, and color gradients are unchanged.
Pixel comparisons against fresh renders of the supplied PDFs confirmed that
the temperature data field below the legend and the main snow/precipitation
map fields are unchanged by the annotation edits.
On another platform, pass an available Unicode TrueType font with `--font`.

The retained full-region context image `regional-snow.png`, not displayed in
the revised slides, is placed below a 30-point header row. Its 14-point Arial
labels are centered over the source panels at x = 128.34, 393.84, and 659.34
points. Keeping the labels inside the image preserves alignment as it scales.

The snow maps retain their original, different color scales in meters,
elevation contours, summary-region outlines, stippling, and shared legend.
The displayed regional means retain the source values and units:

- Himalayas: +0.095 m.
- Rocky Mountains: +0.057 m.
- Andes: +0.003 m.

The author clarified that the requested one-foot snow callout refers to
**peak local increases**, not the Rockies-wide mean. One foot is 0.3048 m;
the plotted Rocky Mountains color scale reaches 0.3 m. The slide explicitly
labels the callout as a peak and retains the map's 2015–2029 mean period.
The exact peak is not recalculated from underlying model output here.

Per-panel percentages exceeding the Z threshold and regional means are left
in the source PDF, not repeated on the revised results slide. Snow depth is
not glacier mass balance or evidence of glacier recovery.

## Experiment map from reference slide 17

`scripts/export-mountain-albedo.py --presentation /path/to/presentacion-20min.pptx`
resolves the relationship for the picture named `Clases de suelo` on slide 17.
The byte-identical embedded PNG is preserved as `soil-modification-source.png`.
`soil-modification.png` retains the full width and the upper 92% of that image
(1600 × 736 pixels), omitting its Spanish legend. The slide supplies the short
English key “White areas: modified soil.” White identifies synthetic soil
class 21, assigned albedo 0.8; other colors are the unmodified soil classes.
The PowerPoint and the manuscript are not modified.

## Slide interaction

Slide 54, “Side project,” presents the experiment without clicks: the global
soil-modification map, albedo 0.8, elevation above 1,000 m, and unchanged
vegetation. Its footer identifies the collaborators and preparation status.

Slide 55, “Side project: results,” has one click. On entry, the global
temperature plot and focused Rocky Mountains snow panel are shown together,
with the author's requested cooling and local-peak snow callouts. The click
replaces both panels with the global precipitation map and “Precipitation
patterns change globally.” The ensemble-reference caption remains visible.
