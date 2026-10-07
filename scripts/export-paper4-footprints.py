#!/usr/bin/env python3
"""Export an unchanged, vector-preserving copy of Chapter 5 Figure S2.

Requires PyMuPDF. Run from this checkout with:
  python3 scripts/export-paper4-footprints.py --source /path/to/gc3_anom_accum_1x2.pdf

The PDF is read-only. The full figure is exported, including its original
legends, contours, color scales, and raster data. Paper4Footprints.vue clips
the maps and colorbars in source PDF coordinates and typesets larger axes
and panel headings without changing the fields or color normalization.
"""

from __future__ import annotations

import argparse
import hashlib
from pathlib import Path

import pymupdf


ROOT = Path(__file__).resolve().parents[1]
SOURCE_SHA256 = "447af87a68d325b8cb79507fb76b83857479569820d2e2567b6c70d842113b0c"


def export(source: Path, output: Path) -> None:
    if hashlib.sha256(source.read_bytes()).hexdigest() != SOURCE_SHA256:
        raise ValueError("Chapter 5 Figure S2 differs from the source manifest")
    with pymupdf.open(source) as document:
        if len(document) != 1:
            raise ValueError("Expected a single-page figure")
        svg = document[0].get_svg_image(text_as_path=True)
    output.write_text(svg, encoding="utf-8")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--output", type=Path, default=ROOT / "figures/paper4-footprints-source.svg")
    args = parser.parse_args()
    export(args.source, args.output)
