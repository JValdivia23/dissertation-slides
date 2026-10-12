#!/usr/bin/env python3
"""Prepare the mountain-albedo experiment map and presentation figure crops.

Requires PyMuPDF and Poppler's pdftocairo. Run from this checkout:
  python3 scripts/export-mountain-albedo.py
  python3 scripts/export-mountain-albedo.py --precipitation-only
  python3 scripts/export-mountain-albedo.py --presentation /path/to/presentacion-20min.pptx

The source files remain unchanged. Temperature/snow annotations are enlarged;
the revised precipitation figure is converted intact, without label edits.
"""

from __future__ import annotations

import argparse
from pathlib import Path
import posixpath
import shutil
import subprocess
from xml.etree import ElementTree as ET
from zipfile import ZipFile

import pymupdf


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_FONT = Path("/System/Library/Fonts/Supplemental/Arial.ttf")
FIGURES = (
    ("30_trefht_anomaly_spaghetti_global.pdf", "global-temperature.png", 20),
    ("50_snow_ensemble_map_regional.pdf", "regional-snow.png", 95),
    ("50_snow_ensemble_map_regional.pdf", "rocky-mountains-snow.png", 95),
)
SNOW_HEADERS = ("Himalayas  +0.095 m", "Rocky Mountains  +0.057 m", "Andes  +0.003 m")
NS = {
    "p": "http://schemas.openxmlformats.org/presentationml/2006/main",
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
}


def export_experiment_map(presentation: Path, output: Path) -> None:
    """Preserve the reference map and crop its Spanish legend for the slide."""
    with ZipFile(presentation) as archive:
        slide = ET.fromstring(archive.read("ppt/slides/slide17.xml"))
        picture = next(
            pic for pic in slide.findall(".//p:pic", NS)
            if pic.find(".//p:cNvPr", NS).get("name") == "Clases de suelo"
        )
        relationship_id = picture.find(".//a:blip", NS).get(f"{{{NS['r']}}}embed")
        relationships = ET.fromstring(archive.read("ppt/slides/_rels/slide17.xml.rels"))
        target = next(
            rel.get("Target") for rel in relationships if rel.get("Id") == relationship_id
        )
        image = archive.read(posixpath.normpath(f"ppt/slides/{target}"))
    if not image.startswith(b"\x89PNG\r\n\x1a\n"):
        raise ValueError("The reference soil-class map is not a PNG")
    output.mkdir(parents=True, exist_ok=True)
    (output / "soil-modification-source.png").write_bytes(image)
    path = output / "soil-modification.png"
    with pymupdf.open(stream=image, filetype="png") as document:
        page = document[0]
        crop = pymupdf.Rect(0, 0, page.rect.width, page.rect.height * 0.92)
        scale = pymupdf.Pixmap(image).width / page.rect.width
        render(page, crop, path, scale)
    print(path)


def render(page: pymupdf.Page, crop: pymupdf.Rect, target: Path, scale: float) -> None:
    page.get_pixmap(
        matrix=pymupdf.Matrix(scale, scale), clip=crop, alpha=False,
    ).save(target)


def export_precipitation(source: Path, output: Path, scale: float) -> None:
    """Preserve the revised PDF's full extent, native images, and vector content."""
    converter = shutil.which("pdftocairo")
    if not converter:
        raise RuntimeError("Poppler's pdftocairo is required for the precipitation SVG")
    pdf = source / "60_prect_ensemble_map_abs_delta_global.pdf"
    output.mkdir(parents=True, exist_ok=True)
    with pymupdf.open(pdf) as document:
        if len(document) != 1:
            raise ValueError("The precipitation figure must be a single-page PDF")
        render(document[0], document[0].rect, output / "global-precipitation.png", scale)
    subprocess.run(
        [converter, "-svg", "-r", "300", str(pdf), str(output / "global-precipitation.svg")],
        check=True,
    )
    print(output / "global-precipitation.svg")
    print(output / "global-precipitation.png")


def enlarge_labels(page: pymupdf.Page, target: str, font_path: Path) -> None:
    """Retype annotations at projection-friendly sizes, outside the data fields."""
    font = pymupdf.Font(fontfile=str(font_path))
    page.insert_font(fontname="AlbedoLegend", fontfile=str(font_path))
    spans = [
        span for block in page.get_text("dict")["blocks"]
        for line in block.get("lines", []) for span in line["spans"]
    ]

    def cover(bounds: tuple[float, float, float, float]) -> None:
        page.draw_rect(pymupdf.Rect(bounds), color=None, fill=(1, 1, 1), overlay=True)

    def text(label: str, x: float, y: float, size: float = 12, align: str = "center") -> None:
        width = font.text_length(label, fontsize=size)
        offset = width / 2 if align == "center" else width if align == "right" else 0
        page.insert_text(
            pymupdf.Point(x - offset, y), label, fontname="AlbedoLegend",
            fontsize=size, color=(0, 0, 0), overlay=True,
        )

    if target == "global-temperature.png":
        years = [s for s in spans if s["text"].isdigit() and len(s["text"]) == 4]
        ticks = sorted(
            (s for s in spans if 20 < s["origin"][0] < 50 and s["size"] == 9),
            key=lambda s: s["origin"][1],
        )
        if len(years) != 8 or len(ticks) != 8:
            raise ValueError("Temperature figure annotations differ from the recorded source")
        cover((0, 21, 54, 248))
        cover((100, 261, 695, page.rect.height))
        for label, span in zip(
            ["0.75", "0.50", "0.25", "0.00", "−0.25", "−0.50", "−0.75", "−1.00"], ticks,
        ):
            text(label, 49.8, span["origin"][1] + 1, align="right")
        for span in years:
            text(span["text"], (span["bbox"][0] + span["bbox"][2]) / 2, 270)
        text("Time (years)", 377.6, 285)
        ylabel = "Temperature anomaly (°C)"
        page.insert_text(
            pymupdf.Point(13, 139.1 + font.text_length(ylabel, fontsize=12) / 2),
            ylabel, fontname="AlbedoLegend", fontsize=12, rotate=90,
        )
        for bounds, label, x in [
            ((89.5, 25.5, 206, 42), "Spread (±1.96σ)", 90.109375),
            ((248.5, 25.5, 335, 42), "Ensemble mean", 249.309372),
            ((364.5, 25.5, 480, 42), "Experiment anomaly", 365.009372),
        ]:
            cover(bounds)
            text(label, x, 38.5, align="left")
    elif target == "rocky-mountains-snow.png":
        ticks = [s for s in spans if 270 < s["origin"][0] < 520 and 395 < s["origin"][1] < 405]
        if len(ticks) != 4:
            raise ValueError("Rocky Mountains colorbar annotations differ from the recorded source")
        cover((275, 391, 516, 421))
        cover((335, 360, 348, 376))
        for span in ticks:
            text(span["text"], (span["bbox"][0] + span["bbox"][2]) / 2, 402)
        text("0", 340.76, 373)
        text("Snow-depth difference (m)", 393.84, 417)


def export(source: Path, output: Path, font: Path, scale: float) -> None:
    output.mkdir(parents=True, exist_ok=True)
    for filename, target, top in FIGURES:
        with pymupdf.open(source / filename) as document:
            page = document[0]
            if target != "regional-snow.png":
                enlarge_labels(page, target, font)
            crop = pymupdf.Rect(0, top, page.rect.width, page.rect.height)
            if target == "rocky-mountains-snow.png":
                # Only the Rocky Mountains panel and its original color bar.
                crop = pymupdf.Rect(270, top, 523, 421)
                render(page, crop, output / target, scale)
            elif target == "regional-snow.png":
                # Include a single compact header row in the image so labels
                # stay aligned with their maps at every presentation size.
                with pymupdf.open() as presentation:
                    panel = presentation.new_page(width=crop.width, height=crop.height + 30)
                    panel.show_pdf_page(
                        pymupdf.Rect(0, 30, crop.width, panel.rect.height),
                        document, 0, clip=crop,
                    )
                    panel.insert_font(fontname="AlbedoLegend", fontfile=str(font))
                    for index, label in enumerate(SNOW_HEADERS):
                        center = 128.34 + index * 265.5
                        bounds = pymupdf.Rect(center - 125, 4, center + 125, 28)
                        panel.insert_textbox(
                            bounds, label, fontname="AlbedoLegend", fontsize=14,
                            align=pymupdf.TEXT_ALIGN_CENTER, color=(0, 0, 0),
                        )
                    render(panel, panel.rect, output / target, scale)
            else:
                render(page, crop, output / target, scale)
            print(output / target)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=ROOT / "MAE_figures")
    parser.add_argument("--output", type=Path, default=ROOT / "figures/mountain-albedo")
    parser.add_argument("--font", type=Path, default=DEFAULT_FONT)
    parser.add_argument("--presentation", type=Path, help="Reference PPTX containing the experiment map on slide 17")
    parser.add_argument("--scale", type=float, default=4)
    parser.add_argument("--precipitation-only", action="store_true", help="Update only the revised precipitation assets")
    args = parser.parse_args()
    if args.scale <= 0:
        parser.error("--scale must be positive")
    if not args.precipitation_only:
        export(args.source, args.output, args.font, args.scale)
    export_precipitation(args.source, args.output, args.scale)
    if args.presentation:
        export_experiment_map(args.presentation, args.output)
