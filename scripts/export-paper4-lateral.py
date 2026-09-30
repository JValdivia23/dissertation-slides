#!/usr/bin/env python3
"""Reuse the figure and video hold frames from Madison slides 10–11.

Requires Pillow, Poppler (pdftoppm), and FFmpeg. Only new presentation assets
are written; the PowerPoint and original MP4s remain unchanged. Example:

  python3 scripts/export-paper4-lateral.py --presentation /path/to/Madison.pptx

The figure is the same first panel, shared distance axis, and colorbar cropped
in Madison slide 11. Its underlying PDF is embedded inside the EMF. No echo
values, axes, or contours are redrawn. Layer labels remain separate overlays.
"""

from __future__ import annotations

import argparse
import hashlib
from pathlib import Path
import subprocess
import tempfile
from zipfile import ZipFile

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
PDF_SHA256 = "2cb8d2df4daf7e020943d2a02e8d26df9465c6811450ecd9a35d88af87458419"
MOVIES = {
    "paper4-3d-evolution.mp4": "e8b03263750e3fd4b736ce53e2f0d8571bb8d3fb93ce95692583d61292c1359f",
    "paper4-lateral-view.mp4": "fcacafb723d69cc1d47fa58cbe76bfc75cead9b098f32fe389acfd10592b2957",
}

# Slide 11's nested figure group, in PowerPoint EMUs. These positions retain
# the original plotting-area proportions and the separately cropped axes.
FIGURE_SIZE = (4391957, 4370927)
PARTS = [
    # (fractional source crop, destination rectangle relative to figure group)
    ((0, 0, .32607, .32432), (0, 0, 3875033, 3738048)),
    ((0, .94676, .31384, 1), (0, 3738048, 3739110, 615190)),
    ((.88146, 0, 1, 1), (3888350, 250503, 503607, 4120424)),
]


def export(presentation: Path, output: Path, temp_root: Path | None) -> None:
    output.mkdir(parents=True, exist_ok=True)
    for name, checksum in MOVIES.items():
        if hashlib.sha256((ROOT / "figures" / name).read_bytes()).hexdigest() != checksum:
            raise ValueError(f"Original movie differs from Madison source: {name}")

    with ZipFile(presentation) as archive:
        emf = archive.read("ppt/media/image17.emf")
    start = emf.find(b"%PDF")
    end = emf.find(b"%%EOF", start)
    if start < 0 or end < 0:
        raise ValueError("Madison slide 11's embedded figure PDF was not found")
    pdf = emf[start:end + len(b"%%EOF")]
    if hashlib.sha256(pdf).hexdigest() != PDF_SHA256:
        raise ValueError("Madison slide 11's figure differs from the recorded source")

    with tempfile.TemporaryDirectory(prefix="paper4-lateral-", dir=temp_root) as temp:
        source = Path(temp) / "madison-figure.pdf"
        source.write_bytes(pdf)
        prefix = Path(temp) / "figure"
        subprocess.run([
            "pdftoppm", "-r", "288", "-png", "-singlefile", str(source), str(prefix),
        ], check=True)
        with Image.open(prefix.with_suffix(".png")) as image:
            image = image.convert("RGB")
            scale = 1600 / FIGURE_SIZE[0]
            result = Image.new("RGB", (1600, round(FIGURE_SIZE[1] * scale)), "white")
            for crop, (x, y, w, h) in PARTS:
                bounds = tuple(round(v * (image.width if i % 2 == 0 else image.height)) for i, v in enumerate(crop))
                piece = image.crop(bounds).resize((round(w * scale), round(h * scale)), Image.Resampling.LANCZOS)
                result.paste(piece, (round(x * scale), round(y * scale)))
            result.save(output / "paper4-lateral-max.png", optimize=True)

        # Use decoded first/last frames, not the PowerPoint posters (which are
        # starting poses). Frame indices are checked against the source counts.
        for movie, count, frames in [
            ("paper4-3d-evolution.mp4", 360, [(359, "paper4-evolution-end.png")]),
            ("paper4-lateral-view.mp4", 30, [(0, "paper4-lateral-entry.png"), (29, "paper4-lateral-end.png")]),
        ]:
            actual = subprocess.check_output([
                "ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                "stream=nb_frames", "-of", "default=noprint_wrappers=1:nokey=1", str(ROOT / "figures" / movie),
            ], text=True).strip()
            if int(actual) != count:
                raise ValueError(f"Unexpected frame count in {movie}: {actual}")
            for frame, name in frames:
                target = Path(temp) / name
                subprocess.run([
                    "ffmpeg", "-v", "error", "-i", str(ROOT / "figures" / movie),
                    "-vf", f"select=eq(n\\,{frame})", "-frames:v", "1", str(target),
                ], check=True)
                with Image.open(target) as image:
                    image.convert("RGB").save(output / name, optimize=True)

        # Preserve all twelve seconds of evolution, then explicitly return to
        # the conference reference view (a view/data reset, not storm evolution).
        # Hold that reference for 0.6 s before the player switches to the exact
        # PNG also used by slide 54. The original MP4 remains unchanged.
        reference_movie = Path(temp) / "paper4-evolution-reference.mp4"
        subprocess.run([
            "ffmpeg", "-v", "error",
            "-i", str(ROOT / "figures" / "paper4-3d-evolution.mp4"),
            "-loop", "1", "-framerate", "30", "-i", str(output / "paper4-evolution-end.png"),
            "-loop", "1", "-framerate", "30", "-i", str(output / "paper4-lateral-entry.png"),
            "-filter_complex",
            "[0:v]fps=30,settb=AVTB,format=yuv420p[evolution];"
            "[1:v]trim=duration=0.7,settb=AVTB,setpts=PTS-STARTPTS,format=yuv420p[last];"
            "[2:v]trim=duration=1.2,settb=AVTB,setpts=PTS-STARTPTS,format=yuv420p[reference];"
            "[last][reference]xfade=transition=fade:duration=0.6:offset=0.1[reset];"
            "[evolution][reset]concat=n=2:v=1:a=0[out]",
            "-map", "[out]", "-an", "-c:v", "libx264", "-crf", "18",
            "-preset", "medium", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
            str(reference_movie),
        ], check=True)
        (output / reference_movie.name).write_bytes(reference_movie.read_bytes())


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--presentation", type=Path, required=True)
    parser.add_argument("--output", type=Path, default=ROOT / "figures")
    parser.add_argument("--temp-root", type=Path)
    args = parser.parse_args()
    export(args.presentation, args.output, args.temp_root)
