"""Plot corrected, unsmoothed ZDR from the Figure 4 COW1high RHI scan."""

from matplotlib.colors import Normalize

from plot_zh import arguments, render_rhi


if __name__ == "__main__":
    args = arguments("raw_zdr_rhi.png", __doc__)
    render_rhi(
        input_path=args.input, output_path=args.output, field="ZDRC",
        colorbar_label=r"$Z_{DR}$ (dB)",
        cmap_name="viridis", norm=Normalize(vmin=-1, vmax=3),
        ticks=[-1, 0, 1, 2, 3],
    )
