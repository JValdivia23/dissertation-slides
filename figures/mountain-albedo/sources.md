# Mountain albedo modification: presentation figures

Result figures prepared 11 October 2026 from the author's PDFs in `MAE_figures/`.
Slide 54's experiment map was regenerated from its native surface input on
12 October 2026; see the source and regeneration instructions below. This side
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
Reference slide 17 supplies the visual structure for the first slide. Its old
map is now superseded by the native-data figure below. Its older time period
and temperature summary are not used for the updated results.

The actual input mask contains no modified cell centers at or poleward of 60°
latitude. The slide's “Globally” describes the distribution across mountain
regions, not modification of every high-elevation or polar cell.

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

## Slide 54: native prescribed-soil mask

### Source and extraction

The surface dataset is referenced by the current experiment's
`/glade/u/home/jairovp/MAE/mae_v1/control_file.md`:

```text
/glade/u/home/jairovp/my_cesm_mods/surfdata_0.9x1.25_hist_78pfts_CMIP6_simyr1850_c190214_whitemodified.nc
```

The file is 1,911,632,032 bytes. Only four small two-dimensional variables
were read through `xarray` on Casper, in the existing `my_env` environment:

- `SOIL_COLOR`: modification mask **`SOIL_COLOR == 21`**.
- `LATIXY` and `LONGXY`: native geographic coordinates.
- `LANDFRAC_PFT`: validation that every modified cell has positive model land
  support (`LANDFRAC_PFT > 0`); this field is **not** the displayed gray background.

The native dimensions are `lsmlat = 192`, `lsmlon = 288`. There are **2,061
modified cells**, with center latitudes from **41.937°S to 59.843°N**. There
are **zero** modified cell centers at or poleward of 60° latitude. No latitude filter
was added to the plot, and the mask was not reconstructed from `PHIS` or an
external elevation product. This preserves the experiment's actual assignments.

The 0.8 label is the author-confirmed prescribed soil-albedo parameter;
`SOIL_COLOR` itself is a class index, not a measured albedo. This figure does
not show realized surface/canopy albedo, albedo anomalies, or glacier recovery.
The `simyr1850` component of the static surface filename is not the time period
of the 2015–2030 climate-response simulation.

### Rendering and saved artifacts

- Generator: `scripts/generate-mountain-albedo-mask.py`.
- Compact native-data snapshot: `data/mountain-albedo-surface-mask.json`.
- Displayed figure: `figures/mountain-albedo/soil-modification-mask.svg`.
- Additional formats: `soil-modification-mask.pdf` and `soil-modification-mask.png`.
- Machine-readable provenance: `soil-modification-mask-provenance.json`.

The projection is **Robinson**, centered at 0° longitude, with a Plate Carrée
coordinate transform. Longitude columns are reordered from 0–360° into
−180–180°; the native mask is otherwise unchanged. Cell edges are coordinate
midpoints, with latitude edges clipped to ±90°. No interpolation, smoothing,
threshold adjustment, or clipping of prescribed cells to a coastline is applied.
Gold therefore represents whole model grid cells, not exact subgrid treated land area.
Latitude statistics and exclusions refer to cell centers; boundary cells
can extend beyond their center latitude, and are not artificially clipped at 60°.

Modified cells use CU gold **`#CFB87C`**. Muted **`#E7E9EC`** land polygons and
dark-gray coastlines come from **Natural Earth 110m** physical land/coastline
data (public domain), for cartographic context only. The ocean is white.
The legend is entirely English: “Modified soil (albedo 0.8)” and “Other land.”
The gray background is not the set of unmodified model cells and should not
be used to infer model land fractions. The cells are rasterized at 300 dpi;
SVG/PDF coastlines and legend remain vector graphics, with self-contained fonts.

The snapshot stores full-precision native coordinate vectors and packed
modification/land-support masks in native C row-major order (`numpy.packbits`,
big bit order, base64). It avoids copying the 1.9 GB surface file into this deck.
Provenance records the source path, size and modification time, selected-field
checksums, native statistics, generator checksum, colors/projection, Natural
Earth shapefile checksums, and software versions. Field digests use contiguous
little-endian int32 for `SOIL_COLOR`, float64 for the other source fields, and
uint8 for decoded masks. They are **not** a checksum of the entire NetCDF file.

### Regeneration on Casper

Run from this local checkout. The script is streamed to Casper, so neither
the MAE repository nor the source NetCDF is edited. Use the pre-installed
`my_env` environment; no package installation or batch simulation is needed.
The temporary output directory is separate from the MAE project.

```bash
remote_dir=$(ssh casper 'mktemp -d /glade/derecho/scratch/jairovp/dissertation-albedo-map.XXXXXX')
script_sha=$(shasum -a 256 scripts/generate-mountain-albedo-mask.py | awk '{print $1}')

ssh casper "bash -l -c 'set -e; module load conda; conda activate my_env; PYTHONDONTWRITEBYTECODE=1 HDF5_USE_FILE_LOCKING=FALSE python -B - --output ${remote_dir} --script-sha256 ${script_sha}'" \
  < scripts/generate-mountain-albedo-mask.py

scp "casper:${remote_dir}/soil-modification-mask.svg" \
    "casper:${remote_dir}/soil-modification-mask.pdf" \
    "casper:${remote_dir}/soil-modification-mask.png" \
    "casper:${remote_dir}/soil-modification-mask-provenance.json" \
    figures/mountain-albedo/
scp "casper:${remote_dir}/surface-mask.json" data/mountain-albedo-surface-mask.json
```

For a rebuild without rereading NetCDF, upload the compact snapshot to the
temporary directory and pass `--snapshot ${remote_dir}/surface-mask.json`.
The generator verifies coordinate and mask checksums before drawing. Snapshot
statistics, decoded masks, and the generator/provenance checksums should be
validated after retrieval. Temporary output can be removed after successful
copying; keep all authored assets and the data snapshot in this checkout.

Local validation uses only the Python standard library:

```bash
python3 scripts/test-mountain-albedo-mask.py
```

## Archived experiment map from reference slide 17

`scripts/export-mountain-albedo.py --presentation /path/to/presentacion-20min.pptx`
resolves the relationship for the picture named `Clases de suelo` on slide 17.
The byte-identical embedded PNG is preserved as `soil-modification-source.png`.
`soil-modification.png` retains the full width and the upper 92% of that image
(1600 × 736 pixels), omitting its Spanish legend. The slide supplies the short
English key “White areas: modified soil.” White identifies synthetic soil
class 21, assigned albedo 0.8; other colors are the unmodified soil classes.
These reference-image assets are retained for provenance, but are no longer
used on slide 54. The old crop helper does not overwrite the new native-mask
SVG/PDF/PNG. The PowerPoint and the manuscript are not modified.

## Slide interaction

Slide 54, “Side project,” presents the experiment without clicks: the global
native prescribed-soil mask, albedo 0.8, elevation above 1,000 m, and unchanged
vegetation. Its footer identifies the collaborators and preparation status.

Slide 55, “Side project: results,” has one click. On entry, the global
temperature plot and focused Rocky Mountains snow panel are shown together,
with the author's requested cooling and local-peak snow callouts. The click
replaces both panels with the global precipitation map and “Precipitation
patterns change globally.” The ensemble-reference caption remains visible.
