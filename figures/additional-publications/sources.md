# Additional research contributions: sources and counting rules

Verified on 10 October 2026 for the dissertation-defense slide. The time window
is 2024–2026, inclusive. Counts refer to distinct published journal articles
outside the dissertation's four paper-based chapters, not Google Scholar entries.

## Publication inventory

| Publication | Year | Journal | Authorship category | DOI |
| --- | --- | --- | --- | --- |
| Hailstorm events in the Central Andes of Peru: insights from historical data and radar microphysics | 2024 | Atmospheric Measurement Techniques | First author | https://doi.org/10.5194/amt-17-2295-2024 |
| Future changes of precipitation types in the Peruvian Andes | 2024 | Scientific Reports | Shared first authorship / equal contribution | https://doi.org/10.1038/s41598-024-71840-2 |
| Dynamic atmospheric mechanisms associated with the diurnal cycle of hydrometeors and precipitation in the Andes–Amazon transition zone of central Peru during the summer season | 2024 | Journal of Earth System Science | Other co-author | https://doi.org/10.1007/s12040-024-02278-3 |
| Surface energy exchanges and stability conditions associated with convective intense rainfall events on the central Andes of Peru | 2025 | Agricultural and Forest Meteorology | Other co-author | https://doi.org/10.1016/j.agrformet.2025.110570 |
| Extreme Precipitation Events Associated with Summer Rains in the Western Slope of the Peruvian Andes Using a Numerical Modeling and Weather Radar Data: Case Studies | 2025 | Pure and Applied Geophysics | Other co-author | https://doi.org/10.1007/s00024-025-03834-8 |
| Toward Operational Use of the SOPHy X-Band Radar in Peru: A Bayesian Fuzzy Logic Approach for Ground Clutter Filtering in Complex Orography | 2026 | IEEE Access | Other co-author | https://doi.org/10.1109/ACCESS.2026.3710444 |

Total: **6 published journal articles**, comprising **2 first/shared-first-author
articles (1 shared)** and **4 other co-authored articles**. These are mutually
exclusive categories; shared first authorship is not counted again under other
co-authored articles.

The Scientific Reports publisher page's Author notes explicitly state:
“These authors contributed equally: Valeria Llactayo, Jairo Valdivia and
Christian Yarleque.” This updates the preliminary first-listed-author tally of
1 first-author and 5 co-authored articles. The slide labels the shared credit
explicitly rather than implying two sole-first-author articles.

An additional **co-authored preprint**, not included in the journal-article
counts, is *Evaluation and Correction of Precipitation Types Measured by a
PARSIVEL2 Disdrometer in a Tropical Glacier Environment*, Pérez-Tello et al.
(2026), https://doi.org/10.5194/egusphere-2026-2705. The publisher page still
identifies it as an EGUsphere preprint on the verification date.

## Exclusions

The dissertation's `SOURCE_MANIFEST.md` and `chapter2.tex`–`chapter5.tex` identify
these four thesis studies, which are excluded regardless of publication status:

- DCT radar smoothing (Chapter 2).
- Spectral-domain local statistics (Chapter 3; arXiv:2604.22721).
- Temporal evolution of cloud-top generating cells (Chapter 4).
- Three-dimensional generating-cell structure and associated precipitation
  (Chapter 5; submitted GRL manuscript).

The 2025 AMS generating-cell conference abstract is also excluded. Preprints
and published versions of the same work are not counted twice. Pre-2024
publications are outside the selected time window.

## Publisher-header screenshots

The opening frame's three selected examples represent hailstorm observations,
future precipitation phase, and radar ground-clutter filtering. One click
spreads them across the content area and automatically introduces the four
remaining headers at 220, 480, 740, and 1000 ms. Each move takes about 720 ms.
The final board contains all six journal articles and the separately labeled
preprint, not just the initial three examples. Publication counts do not change.

| Local asset | Publisher page | Crop |
| --- | --- | --- |
| `hailstorm-header.png` | https://amt.copernicus.org/articles/17/2295/2024/ | Article title and author list |
| `precipitation-types-header.png` | https://www.nature.com/articles/s41598-024-71840-2 | Article title and author list |
| `sophy-header.png` | https://ieeexplore.ieee.org/document/11595539 | Article title and author list |
| `diurnal-cycle-header.png` | https://link.springer.com/article/10.1007/s12040-024-02278-3 | Article title and author list |
| `surface-energy-header.png` | https://doi.org/10.1016/j.agrformet.2025.110570 | Published PDF's title and author list; see fallback below |
| `extreme-rainfall-header.png` | https://link.springer.com/article/10.1007/s00024-025-03834-8 | Article title and author list |
| `parsivel-preprint-header.png` | https://egusphere.copernicus.org/preprints/2026/egusphere-2026-2705/ | Preprint title and author list |

Screenshots preserve the publishers' original text, fonts, author order, and
colors. Title and author regions are cropped separately and joined with a
small gap to omit utility controls and excess whitespace; no article text is
retyped. The AMT avatar thumbnail is omitted from the title crop. Gold outlines
around Jairo's name are separate slide overlays, not changes to the source
images. Each screenshot links to its publisher page. Scientific Reports shared
authorship is disclosed in the slide caption and speaker notes because the
equal-contribution note appears farther down the original page.

ScienceDirect returned a human-verification/device-time challenge. It was not
bypassed. For `surface-energy-header.png`, the published Version of Record was
downloaded through the institutional record below, from
https://repositorio.inaigem.gob.pe/bitstreams/35b24406-234e-4efa-b035-efdcea0d8c5a/download.
Only page 1's title and author list were rendered: PDF-point crop
`(35.5, 162, 492.5, 231)`, at 2.5 pixels per point. The original journal type,
author ordering, and ORCID icons remain intact. The full PDF is temporary and
is not included in the presentation repository.

The publisher identifies the Scientific Reports article as CC BY-NC-ND 4.0;
the AMT, IEEE Access, surface-energy article, and EGUsphere preprint are CC BY
4.0. No open reuse license is asserted for the two Springer page headers.
Article licenses do not necessarily apply to all website interface elements
or journal branding.
The crops are bibliographic identification for an academic defense, not a
claim of general permission to redistribute publisher website designs.

## Animation and presentation behavior

`components/AdditionalResearchBoard.vue` uses the slide's single registered
click (`clicks: 1`) to change from the initial count-and-three-header layout to
a deterministic document board. CSS transitions provide the staggered entry,
small rotations, and settling; no background animation loop or per-paper
clicks are used. `components/publication-board-layout.ts` fits the rotated
outer bounds within the content area without covering any other header.
Metadata, dimensions, and name-outline coordinates are recorded in
`data/additional-publications.ts`.

The complete board retains the 2024–2026/outside-dissertation scope in the
lower-right corner. Its compact count label and gold preprint badge both
identify the extra preprint as co-authored.

Reduced-motion playback retains the same one-click interaction but removes
motion and delays. Overview and print-mode views use the complete static board.
These fallbacks are not a claim that a PDF/PNG export has been run successfully.

## Metadata verification sources

- Google Scholar discovery:
  https://scholar.google.com/citations?hl=en&user=eCZJkKcAAAAJ&view_op=list_works&sortby=pubdate
- AMT, Scientific Reports, and IEEE Xplore publisher pages above; author order
  and publication metadata checked directly in the browser.
- Springer Nature Link and EGUsphere pages above; the additional title/author
  screenshots were captured directly in the browser.
- Crossref metadata for the Scientific Reports, Agricultural and Forest
  Meteorology, and Journal of Earth System Science articles.
- Journal of Earth System Science institutional record:
  https://repositorio.inaigem.gob.pe/items/262cd35b-21a3-4ad1-af4b-49eed12a3aca
- Agricultural and Forest Meteorology institutional record:
  https://repositorio.inaigem.gob.pe/items/9811b954-9946-4f32-901a-9c256ec58b90
- Pure and Applied Geophysics institutional record:
  https://repositorio.igp.gob.pe/items/a1653751-c1f5-4b92-871f-fa7cba96a338
- IEEE Access institutional record:
  https://repositorio.igp.gob.pe/items/827818ca-5e8c-4771-b676-3ff40346979f
- EGUsphere preprint page:
  https://egusphere.copernicus.org/preprints/2026/egusphere-2026-2705/
