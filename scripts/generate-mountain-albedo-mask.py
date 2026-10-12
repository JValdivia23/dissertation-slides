#!/usr/bin/env python3
"""Draw slide 54's prescribed-soil mask from the actual CESM surface input.

Run on Casper in the existing my_env environment, not the local macOS Python.
Read only the four small surface fields below; never load the full input file.
The output includes SVG/PDF/PNG, a compact data snapshot, and provenance JSON.
"""

from __future__ import annotations

import argparse
import base64
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path

import cartopy
import cartopy.crs as ccrs
import cartopy.feature as cfeature
from cartopy.io import shapereader
import matplotlib

matplotlib.use("Agg")

from matplotlib.colors import BoundaryNorm, ListedColormap
from matplotlib.patches import Patch
import matplotlib.pyplot as plt
import numpy as np
import xarray as xr


DEFAULT_SOURCE = Path(
    "/glade/u/home/jairovp/my_cesm_mods/"
    "surfdata_0.9x1.25_hist_78pfts_CMIP6_simyr1850_c190214_whitemodified.nc"
)
STEM = "soil-modification-mask"
GOLD = "#CFB87C"
OTHER_LAND = "#E7E9EC"
COASTLINE = "#565A5C"


def array_hash(values: np.ndarray, dtype: str) -> str:
    return hashlib.sha256(np.ascontiguousarray(values, dtype=dtype).tobytes()).hexdigest()


def pack_mask(values: np.ndarray) -> str:
    return base64.b64encode(np.packbits(values.ravel(), bitorder="big").tobytes()).decode("ascii")


def unpack_mask(encoded: str, shape: tuple[int, int]) -> np.ndarray:
    packed = np.frombuffer(base64.b64decode(encoded, validate=True), dtype=np.uint8)
    count = int(np.prod(shape))
    if packed.size != (count + 7) // 8:
        raise ValueError("Packed mask length does not match the native grid")
    return np.unpackbits(packed, bitorder="big", count=count).reshape(shape).astype(bool)


def read_surface(source: Path) -> dict:
    names = ["SOIL_COLOR", "LANDFRAC_PFT", "LATIXY", "LONGXY"]
    with xr.open_dataset(source, cache=False) as dataset:
        fields = {name: dataset[name].values for name in names}
        dimensions = list(dataset["SOIL_COLOR"].dims)
        attributes = {name: dict(dataset[name].attrs) for name in names}
    soil, fraction, latitude_grid, longitude_grid = (fields[name] for name in names)
    if soil.ndim != 2 or any(values.shape != soil.shape for values in fields.values()):
        raise ValueError("Expected four aligned two-dimensional surface fields")
    if not all(np.isfinite(values).all() for values in fields.values()):
        raise ValueError("Surface fields contain missing or nonfinite values")
    latitude, longitude = latitude_grid[:, 0], longitude_grid[0, :]
    if not np.allclose(latitude_grid, latitude[:, None], rtol=0, atol=1e-10):
        raise ValueError("Latitude is not rectilinear")
    if not np.allclose(longitude_grid, longitude[None, :], rtol=0, atol=1e-10):
        raise ValueError("Longitude is not rectilinear")
    if np.any(np.diff(latitude) <= 0) or np.any(np.diff(longitude) <= 0):
        raise ValueError("Native coordinates must increase monotonically")
    modified, land = soil == 21, fraction > 0
    if not modified.any() or np.any(modified & ~land):
        raise ValueError("Modified soil must be present and have positive land support")
    if fraction.min() < 0 or fraction.max() > 1 + 1e-8:
        raise ValueError("Land fractions are outside their physical range")
    stat = source.stat()
    return {
        "schema_version": 1,
        "source": {
            "path": str(source),
            "size_bytes": stat.st_size,
            "mtime_utc": datetime.fromtimestamp(stat.st_mtime, timezone.utc).isoformat(),
            "field_sha256": {
                name: array_hash(values, "<i4" if name == "SOIL_COLOR" else "<f8")
                for name, values in fields.items()
            },
            "field_attributes": attributes,
        },
        "native_grid": {
            "dimensions": dimensions,
            "shape": list(soil.shape),
            "latitude": latitude.tolist(),
            "longitude": longitude.tolist(),
        },
        "masks": {
            "encoding": "base64 of numpy.packbits; bitorder=big; native C row-major order",
            "modified_predicate": "SOIL_COLOR == 21",
            "land_predicate": "LANDFRAC_PFT > 0",
            "modified": pack_mask(modified),
            "land": pack_mask(land),
            "modified_sha256": array_hash(modified, "u1"),
            "land_sha256": array_hash(land, "u1"),
        },
        "statistics": {
            "modified_cells": int(modified.sum()),
            "land_support_cells": int(land.sum()),
            "modified_latitude_min": float(latitude_grid[modified].min()),
            "modified_latitude_max": float(latitude_grid[modified].max()),
            "modified_cells_at_or_poleward_of_60_degrees": int(
                (modified & (np.abs(latitude_grid) >= 60)).sum()
            ),
        },
    }


def coordinate_edges(centers: np.ndarray, latitude: bool = False) -> np.ndarray:
    edges = np.r_[
        centers[0] - (centers[1] - centers[0]) / 2,
        (centers[:-1] + centers[1:]) / 2,
        centers[-1] + (centers[-1] - centers[-2]) / 2,
    ]
    return np.clip(edges, -90, 90) if latitude else edges


def generate(snapshot: dict, output: Path, script_sha256: str | None) -> None:
    shape = tuple(snapshot["native_grid"]["shape"])
    latitude = np.asarray(snapshot["native_grid"]["latitude"])
    longitude = np.asarray(snapshot["native_grid"]["longitude"])
    if shape != (latitude.size, longitude.size):
        raise ValueError("Coordinate lengths do not match the native grid")
    for name, values in [
        ("LATIXY", np.broadcast_to(latitude[:, None], shape)),
        ("LONGXY", np.broadcast_to(longitude[None, :], shape)),
    ]:
        if array_hash(values, "<f8") != snapshot["source"]["field_sha256"][name]:
            raise ValueError(f"{name} coordinate checksum mismatch")
    modified = unpack_mask(snapshot["masks"]["modified"], shape)
    land = unpack_mask(snapshot["masks"]["land"], shape)
    for name, values in [("modified", modified), ("land", land)]:
        if array_hash(values, "u1") != snapshot["masks"][f"{name}_sha256"]:
            raise ValueError(f"{name} mask checksum mismatch")
    if int(modified.sum()) != snapshot["statistics"]["modified_cells"] or np.any(modified & ~land):
        raise ValueError("Modified-cell count or native land support is inconsistent")
    # Reorder, but do not interpolate or reclassify, the native longitude cells.
    wrapped = (longitude + 180) % 360 - 180
    order = np.argsort(wrapped)
    categories = np.ma.masked_where(~modified[:, order], np.ones(shape, dtype=np.uint8))
    coastline_path = Path(shapereader.natural_earth("110m", "physical", "coastline"))
    land_path = Path(shapereader.natural_earth("110m", "physical", "land"))
    cmap = ListedColormap([GOLD])
    cmap.set_bad((1, 1, 1, 0))
    plt.rcParams.update({"font.family": "DejaVu Sans", "svg.fonttype": "path", "pdf.fonttype": 42})
    figure = plt.figure(figsize=(10.8, 6.0), facecolor="white")
    axes = figure.add_axes([0.01, 0.12, 0.98, 0.85], projection=ccrs.Robinson(central_longitude=0))
    axes.set_global()
    axes.set_facecolor("white")
    axes.add_feature(cfeature.LAND.with_scale("110m"), facecolor=OTHER_LAND, edgecolor="none", zorder=0)
    axes.pcolormesh(
        coordinate_edges(wrapped[order]), coordinate_edges(latitude, latitude=True),
        categories, transform=ccrs.PlateCarree(), cmap=cmap,
        norm=BoundaryNorm([0.5, 1.5], cmap.N), shading="flat",
        rasterized=True, antialiased=False, zorder=1,
    )
    axes.coastlines(resolution="110m", color=COASTLINE, linewidth=0.55, zorder=2)
    axes.spines["geo"].set_edgecolor(COASTLINE)
    axes.spines["geo"].set_linewidth(0.8)
    figure.legend(
        handles=[
            Patch(facecolor=GOLD, edgecolor="#8D7334", label="Modified soil (albedo 0.8)"),
            Patch(facecolor=OTHER_LAND, edgecolor="#90959A", label="Other land"),
        ],
        loc="lower center", bbox_to_anchor=(0.5, 0.025), ncol=2, frameon=False,
        fontsize=16, handlelength=1.4, handleheight=0.9, columnspacing=1.8,
    )
    output.mkdir(parents=True, exist_ok=True)
    for extension in ["svg", "pdf", "png"]:
        figure.savefig(output / f"{STEM}.{extension}", dpi=300, bbox_inches="tight", pad_inches=0.05)
    plt.close(figure)
    provenance = {
        "generated_utc": datetime.now(timezone.utc).isoformat(),
        "generator": "scripts/generate-mountain-albedo-mask.py",
        "generator_sha256": script_sha256,
        "source": snapshot["source"],
        "statistics": snapshot["statistics"],
        "mask_sha256": snapshot["masks"]["modified_sha256"],
        "plot": {
            "projection": "Robinson", "central_longitude": 0,
            "coordinate_transform": "PlateCarree",
            "modified_color": GOLD, "other_land_color": OTHER_LAND,
            "ocean_color": "#FFFFFF", "native_cells_without_interpolation": True,
            "extra_latitude_filter_applied": False,
            "coastline": "Natural Earth 110m physical coastline (public domain)",
            "coastline_shapefile_sha256": hashlib.sha256(coastline_path.read_bytes()).hexdigest(),
            "land_background": "Natural Earth 110m physical land (cartographic context, not the model land mask)",
            "land_shapefile_sha256": hashlib.sha256(land_path.read_bytes()).hexdigest(),
            "prescribed_albedo": 0.8,
            "albedo_value_source": "Author-confirmed experiment parameter, not inferred from SOIL_COLOR",
        },
        "software": {"numpy": np.__version__, "xarray": xr.__version__,
                     "matplotlib": matplotlib.__version__, "cartopy": cartopy.__version__},
    }
    (output / "surface-mask.json").write_text(json.dumps(snapshot, indent=2) + "\n")
    (output / f"{STEM}-provenance.json").write_text(json.dumps(provenance, indent=2) + "\n")
    print(json.dumps({"output": str(output), "statistics": snapshot["statistics"]}, indent=2))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--surface", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument("--snapshot", type=Path, help="Rebuild from the compact snapshot instead of NetCDF")
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--script-sha256", help="SHA-256 of this script when streamed to remote Python")
    args = parser.parse_args()
    source_snapshot = json.loads(args.snapshot.read_text()) if args.snapshot else read_surface(args.surface)
    generate(source_snapshot, args.output, args.script_sha256)
