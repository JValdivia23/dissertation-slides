#!/usr/bin/env python3
"""Validate the committed map snapshot and provenance with Python's stdlib."""

import base64
import hashlib
import json
from pathlib import Path
import struct


ROOT = Path(__file__).resolve().parents[1]
FIGURES = ROOT / "figures/mountain-albedo"
snapshot = json.loads((ROOT / "data/mountain-albedo-surface-mask.json").read_text())
provenance = json.loads((FIGURES / "soil-modification-mask-provenance.json").read_text())
rows, columns = snapshot["native_grid"]["shape"]
latitude = snapshot["native_grid"]["latitude"]
longitude = snapshot["native_grid"]["longitude"]
assert (rows, columns) == (192, 288)
assert len(latitude) == rows and len(longitude) == columns


def decode_mask(name):
    packed = base64.b64decode(snapshot["masks"][name], validate=True)
    assert len(packed) == (rows * columns + 7) // 8
    values = bytes((byte >> shift) & 1 for byte in packed for shift in range(7, -1, -1))[:rows * columns]
    assert hashlib.sha256(values).hexdigest() == snapshot["masks"][f"{name}_sha256"]
    return values


modified, land = decode_mask("modified"), decode_mask("land")
assert sum(modified) == snapshot["statistics"]["modified_cells"] == 2061
assert sum(land) == snapshot["statistics"]["land_support_cells"] == 22648
assert all(not changed or supported for changed, supported in zip(modified, land))
modified_latitudes = [latitude[index // columns] for index, value in enumerate(modified) if value]
assert min(modified_latitudes) == snapshot["statistics"]["modified_latitude_min"]
assert max(modified_latitudes) == snapshot["statistics"]["modified_latitude_max"]
assert sum(abs(value) >= 60 for value in modified_latitudes) == 0
assert snapshot["statistics"]["modified_cells_at_or_poleward_of_60_degrees"] == 0
lat_bytes = b"".join(struct.pack("<d", value) * columns for value in latitude)
lon_bytes = struct.pack(f"<{columns}d", *longitude) * rows
assert hashlib.sha256(lat_bytes).hexdigest() == snapshot["source"]["field_sha256"]["LATIXY"]
assert hashlib.sha256(lon_bytes).hexdigest() == snapshot["source"]["field_sha256"]["LONGXY"]
assert provenance["source"] == snapshot["source"]
assert provenance["statistics"] == snapshot["statistics"]
assert provenance["mask_sha256"] == snapshot["masks"]["modified_sha256"]
assert provenance["generator_sha256"] == hashlib.sha256(
    (ROOT / "scripts/generate-mountain-albedo-mask.py").read_bytes()
).hexdigest()
assert provenance["plot"]["extra_latitude_filter_applied"] is False
assert provenance["plot"]["native_cells_without_interpolation"] is True
for extension in ["svg", "pdf", "png"]:
    assert (FIGURES / f"soil-modification-mask.{extension}").stat().st_size > 0
svg = (FIGURES / "soil-modification-mask.svg").read_text()
assert "Modified soil (albedo 0.8)" in svg and "Other land" in svg
assert "Blanco" not in svg
assert "../figures/mountain-albedo/soil-modification-mask.svg" in (ROOT / "sections/close.md").read_text()
print("PASS: native masks, coordinate hashes, 2,061 cells, polar exclusions, provenance, and figure assets")
