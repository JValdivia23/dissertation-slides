#!/usr/bin/env python3
"""Export Madison slide 13's cloud-street crop and cutaway hold frames.

Requires Pillow and FFmpeg. Run from this checkout with:
  python3 scripts/export-paper4-midcloud.py --presentation /path/to/Madison.pptx

The original photograph and movie remain unchanged. Crop bounds come from
PowerPoint's actual srcRect: remove 28.468% at the top and 20% at the bottom.
The exported photograph is 1200 by 825 pixels, without resampling. First/last
frames come from the byte-identical three-second movie already in figures/.
"""

from __future__ import annotations

import argparse
import hashlib
import io
from pathlib import Path
import subprocess
import tempfile
from xml.etree import ElementTree as ET
from zipfile import ZipFile

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
PHOTO_SHA256 = "d9a7dbca20a4c30077d6be5d58375bf485296d0c6ff3b32b0ee495c971758f5a"
MOVIE_SHA256 = "8d8ae9b19070837df78fc530321718d275c35e2f577d22c6105a3a4220dba5e8"
NS = {
    "p": "http://schemas.openxmlformats.org/presentationml/2006/main",
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
}


def export(presentation: Path, output: Path, temp_root: Path | None) -> None:
    with ZipFile(presentation) as archive:
        photo = archive.read("ppt/media/image20.png")
        slide = ET.fromstring(archive.read("ppt/slides/slide13.xml"))
        original_movie = archive.read("ppt/media/media4.mp4")
    if hashlib.sha256(photo).hexdigest() != PHOTO_SHA256:
        raise ValueError("Madison slide 13's photograph differs from the recorded source")
    if (ROOT / "figures/paper4-cloud-streets.png").read_bytes() != photo:
        raise ValueError("The bundled original photograph differs from Madison slide 13")
    movie = ROOT / "figures/paper4-cutaway-mid.mp4"
    if movie.read_bytes() != original_movie or hashlib.sha256(original_movie).hexdigest() != MOVIE_SHA256:
        raise ValueError("The cutaway movie differs from Madison slide 13")

    picture = next(pic for pic in slide.findall(".//p:pic", NS)
                   if pic.find(".//p:cNvPr", NS).get("name") == "Picture 5")
    crop = picture.find(".//a:srcRect", NS)
    if crop is None or crop.get("t") != "28468" or crop.get("b") != "20000":
        raise ValueError("Madison slide 13's photograph crop differs from the recorded source")

    output.mkdir(parents=True, exist_ok=True)
    with Image.open(io.BytesIO(photo)) as image:
        bounds = (
            round(image.width * int(crop.get("l", "0")) / 100000),
            round(image.height * int(crop.get("t", "0")) / 100000),
            round(image.width * (1 - int(crop.get("r", "0")) / 100000)),
            round(image.height * (1 - int(crop.get("b", "0")) / 100000)),
        )
        image.convert("RGB").crop(bounds).save(output / "paper4-cloud-streets-cropped.png", optimize=True)

    count = subprocess.check_output([
        "ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
        "stream=nb_frames", "-of", "default=noprint_wrappers=1:nokey=1", str(movie),
    ], text=True).strip()
    if int(count) != 90:
        raise ValueError(f"Unexpected frame count in the cutaway movie: {count}")
    with tempfile.TemporaryDirectory(prefix="paper4-midcloud-", dir=temp_root) as temp:
        for frame, name in [(0, "paper4-midcloud-entry.png"), (89, "paper4-midcloud-end.png")]:
            target = Path(temp) / name
            subprocess.run([
                "ffmpeg", "-v", "error", "-i", str(movie), "-vf",
                f"select=eq(n\\,{frame})", "-frames:v", "1", str(target),
            ], check=True)
            with Image.open(target) as image:
                image.convert("RGB").save(output / name, optimize=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--presentation", type=Path, required=True)
    parser.add_argument("--output", type=Path, default=ROOT / "figures")
    parser.add_argument("--temp-root", type=Path)
    args = parser.parse_args()
    export(args.presentation, args.output, args.temp_root)
