"""Plot unsmoothed COW1high RHI reflectivity for presentation review.

Run with the project's `myenv` Python environment. The default input is the
original AMT paper scan; --input can point to another CF/Radial file. The
output is local to this directory, not the manuscript or paper repository.
"""

from __future__ import annotations

import argparse
from pathlib import Path

import cmweather  # noqa: F401 - registers the paper's ChaseSpectral colormap
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.colors import Normalize
from matplotlib.patches import Rectangle
import numpy as np
import xarray as xr


SOURCE = (
    Path.home()
    / "Library/CloudStorage/OneDrive-UCB-O365/Projects/AMT_DCT_paper"
    / "radar-dct-smoothing/_legacy_data"
    / "cfrad.20220223_022853.197_to_20220223_022905.383_COW1high_RHI.nc"
)
FULL_EXTENT = (0, 60, 0, 10)
DETAIL_EXTENT = (17, 23, 4.5, 7.5)


def sample_edges(centers: np.ndarray) -> np.ndarray:
    """Midpoint edges for gate ranges or measured ray angles."""
    edges = np.empty(centers.size + 1, dtype=float)
    edges[1:-1] = (centers[:-1] + centers[1:]) / 2
    edges[0] = centers[0] - (centers[1] - centers[0]) / 2
    edges[-1] = centers[-1] + (centers[-1] - centers[-2]) / 2
    return edges


def arguments(default_output: str, description: str) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=description)
    parser.add_argument("--input", type=Path, default=SOURCE, help="CF/Radial RHI file")
    parser.add_argument(
        "--output", type=Path, default=Path(__file__).with_name(default_output),
        help="Presentation PNG path",
    )
    return parser.parse_args()


def render_rhi(
    *,
    input_path: Path,
    output_path: Path,
    field: str,
    colorbar_label: str,
    cmap_name: str,
    norm: Normalize,
    ticks: list[float],
    extend: str = "both",
) -> None:
    with xr.open_dataset(input_path.expanduser()) as radar:
        if field not in radar:
            raise KeyError(f"{field} is not in {input_path}")
        ranges_km = radar["range"].values / 1000.0
        elevations = np.deg2rad(radar["elevation"].values)
        data = np.ma.masked_invalid(radar[field].values)
        altitude_m = radar.attrs.get("radar_altitude_m", 0.0)

    # Reproduce the geometry of cflib.plot_rhi used for Figure 4 in the AMT
    # paper: 4/3 effective Earth radius for height, slant-range projection for x.
    slant_m = sample_edges(ranges_km)[None, :] * 1000.0
    angle = sample_edges(elevations)[:, None]
    earth_radius_m = (4.0 / 3.0) * 6.374e6
    x_km = (slant_m / 1000.0) * np.cos(angle)
    height_km = (
        np.sqrt(slant_m**2 + earth_radius_m**2 + 2 * slant_m * earth_radius_m * np.sin(angle))
        - earth_radius_m + altitude_m
    ) / 1000.0

    cmap = matplotlib.colormaps[cmap_name].copy()
    cmap.set_bad("white")

    fig, (full, detail) = plt.subplots(1, 2, figsize=(16, 9), dpi=200,
                                      gridspec_kw={"width_ratios": [1.15, 1]})
    fig.patch.set_facecolor("white")
    fig.subplots_adjust(left=0.08, right=0.97, bottom=0.30, top=0.92, wspace=0.22)

    for ax, extent in (
        (full, FULL_EXTENT),
        (detail, DETAIL_EXTENT),
    ):
        ax.set_facecolor("white")
        image = ax.pcolormesh(x_km, height_km, data, cmap=cmap, norm=norm,
                              shading="auto", rasterized=True)
        ax.set_xlim(extent[0], extent[1])
        ax.set_ylim(extent[2], extent[3])
        ax.set_xlabel("Distance from radar (km)", fontsize=19, labelpad=9)
        ax.set_ylabel("Altitude (km)", fontsize=19, labelpad=9)
        ax.tick_params(labelsize=16, length=5, width=1.1)

    full.add_patch(Rectangle(
        (DETAIL_EXTENT[0], DETAIL_EXTENT[2]),
        DETAIL_EXTENT[1] - DETAIL_EXTENT[0],
        DETAIL_EXTENT[3] - DETAIL_EXTENT[2],
        fill=False, edgecolor="#D32F2F", linewidth=2.8, linestyle="--",
    ))

    colorbar_ax = fig.add_axes((0.27, 0.16, 0.46, 0.033))
    bar = fig.colorbar(image, cax=colorbar_ax, orientation="horizontal",
                       extend=extend, ticks=ticks)
    bar.set_label(colorbar_label, fontsize=20, labelpad=8)
    bar.ax.tick_params(labelsize=16, length=4)

    fig.savefig(output_path.expanduser(), dpi=200, facecolor="white",
                bbox_inches="tight", pad_inches=0.04)
    plt.close(fig)
    print(output_path.expanduser())


if __name__ == "__main__":
    args = arguments("raw_zh_rhi.png", __doc__)
    render_rhi(
        input_path=args.input, output_path=args.output, field="DBZHCC_F",
        colorbar_label=r"$Z_H$ (dBZ)",
        cmap_name="ChaseSpectral", norm=Normalize(vmin=-15, vmax=35),
        ticks=[-15, -10, 0, 10, 20, 30, 35],
    )
