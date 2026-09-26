"""Plot unsmoothed copolar correlation from the Figure 4 COW1high RHI scan."""

from matplotlib.colors import PowerNorm

from plot_zh import arguments, render_rhi


if __name__ == "__main__":
    args = arguments("raw_rhohv_rhi.png", __doc__)
    render_rhi(
        input_path=args.input, output_path=args.output, field="RHOHV",
        colorbar_label=r"$\rho_{HV}$", cmap_name="plasmidis",
        norm=PowerNorm(gamma=4, vmin=0.6, vmax=1.0),
        ticks=[0.6, 0.9, 0.95, 0.98, 1.0], extend="min",
    )
