#!/usr/bin/env python3
"""Export source-figure crops for slides 39–43, without changing plotted data.

Requires Poppler (pdftoppm) and Pillow. Run from this checkout with:
  python3 scripts/export-population-context.py --manuscript /path/to/manuscript

Sources are the dissertation's recorded Paper 3 Figures 6/9/12 and Paper 4
Figure S1. The manuscript remains read-only; only presentation PNGs are written.
Crop coordinates refer to the original PDF pages rendered at 216 dpi.
"""

from __future__ import annotations

import argparse
import hashlib
from pathlib import Path
import subprocess
import tempfile

from PIL import Image, ImageOps


SOURCES = {
    "s1": ("figs/chapter5/gc3_eccc_ctgc.pdf", "88d57db6b6eb9586d36d49be1d95cf7485cba96eb67502bd55fde25b2c1436fa"),
    "rhi": ("figs/chapter4/figure06.pdf", "077c52170ac14ee47885650725348919201840a6affc80aa50e8472ee219a500"),
    "sounding": ("figs/chapter4/figure09.pdf", "b2d574f85cb83444cb9c474b59b6d1dd7b76827b0bda3398e14de49b3b716fda"),
    "maps": ("figs/chapter4/figure12.pdf", "50a3107e1284f8acd156be2d38cf0056287b84b11714f85b0bf17c9bf33adeb8"),
}


def export(manuscript: Path, output: Path) -> None:
    output.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="population-context-") as temp:
        images = {}
        for key, (relative, checksum) in SOURCES.items():
            source = manuscript / relative
            if hashlib.sha256(source.read_bytes()).hexdigest() != checksum:
                raise ValueError(f"Source differs from SOURCE_MANIFEST.md: {source}")
            prefix = Path(temp) / key
            subprocess.run([
                "pdftoppm", "-r", "216", "-png", "-singlefile", str(source), str(prefix),
            ], check=True)
            with Image.open(prefix.with_suffix(".png")) as image:
                images[key] = image.convert("RGB")

        crops = {
            "population-storm-0254.png": ("s1", (50, 72, 569, 585)),
            "population-storm-0318.png": ("s1", (669, 653, 1189, 1168)),
            "population-storm-0342.png": ("s1", (1292, 1233, 1813, 1748)),
            "population-storm-scale.png": ("s1", (1877, 212, 2086, 1640)),
            # NW-focused RHI portions; the long original headings are replaced
            # by slide captions. Height and range axes are retained in each crop.
            "population-rhi-0222.png": ("rhi", (20, 60, 815, 425)),
            "population-rhi-0240.png": ("rhi", (20, 486, 815, 850)),
            "population-rhi-0304.png": ("rhi", (20, 908, 815, 1275)),
            "population-rhi-0334.png": ("rhi", (20, 1333, 815, 1698)),
            "population-rhi-scale.png": ("rhi", (1510, 238, 1699, 1510)),
            # Shared contour-area scale for the Figure 12 maps; the
            # centroids legend below it is already explained in the caption.
            "population-area-scale.png": ("maps", (2100, 460, 2440, 1105)),
        }
        for name, (key, box) in crops.items():
            crop = images[key].crop(box)
            if name == "population-area-scale.png":
                # Tighten to the scale content, then add an even white border
                # so the title (including the superscript) and every row keep
                # uniform padding on all four sides.
                gray = crop.convert("L")
                bbox = gray.point(lambda value: 255 if value > 225 else 0).getbbox()
                assert bbox is not None
                crop = crop.crop(bbox)
                crop = ImageOps.expand(crop, border=30, fill="white")
            if key == "rhi" and name != "population-rhi-scale.png":
                plot_top = {"0222": 76, "0240": 500, "0304": 924, "0334": 1348}[name[-8:-4]]
                # Remove only remnants of the long source headings above the
                # plotting area, retaining the complete left-side height ticks.
                crop.paste("white", (94, 0, crop.width, plot_top - box[1] - 1))
            crop.save(output / name, optimize=True)

        # Panels b/c and f/g share the original height axis in panels a/e.
        # Keep that axis and sounding-time label alongside each humidity/wind
        # pair, without redrawing, rescaling, or otherwise changing the curves.
        for time, top, bottom, axis_bottom in [("0200", 84, 883, 791), ("0415", 958, 1746, 1657)]:
            axis = images["sounding"].crop((0, top, 137, bottom))
            # Exclude the unrelated temperature x-axis tick fragment below
            # the shared height axis; the humidity/wind axes remain untouched.
            axis.paste("white", (0, axis_bottom - top, axis.width, axis.height))
            profiles = images["sounding"].crop((704, top, 1857, bottom))
            pair = Image.new("RGB", (axis.width + profiles.width, axis.height), "white")
            pair.paste(axis, (0, 0))
            pair.paste(profiles, (axis.width, 0))
            pair.save(output / f"population-environment-{time}.png", optimize=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--manuscript", type=Path, required=True)
    parser.add_argument("--output", type=Path, default=Path(__file__).resolve().parents[1] / "figures")
    args = parser.parse_args()
    export(args.manuscript, args.output)
