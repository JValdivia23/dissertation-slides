#!/usr/bin/env python3
"""Reproduce Paper 2's speed detector and export display samples for slide 30.

Requires numpy==1.26.4 and scipy==1.13.1. Both source repositories are read-only;
the toolkit is imported from a temporary copy of the recorded commit. See
docs/outlier-animation.md for the regeneration command and display conventions.
"""

from __future__ import annotations

import __future__
import argparse
import ast
import hashlib
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import time

import numpy as np


PAPER_COMMIT = "c46edba5fc70581a2a727219916ac9aa79d0f932"
TOOLKIT_COMMIT = "9d3b60ed408b5be819ae0eee0276c56840b712a7"
GENERATOR = "02_arXiv_Paper/scripts/generate_synthetic_validation.py"
METRICS = "02_arXiv_Paper/results/synthetic_metrics.json"
FUNCTIONS = {
    "synthetic_field", "polar_truth", "synthetic_cyclone_wind_3d", "rmse", "make_mcar_mask",
    "make_block_mask", "run_missingness_experiment", "periodic_fft_gaussian_smooth",
    "run_boundary_experiment", "run_variance_calibration", "run_timing_summary",
    "run_outlier_identification_experiment",
}


def git_file(repo: Path, path: str) -> bytes:
    return subprocess.check_output(["git", "-C", str(repo), "show", f"{PAPER_COMMIT}:{path}"])


def reproduce(paper_repo: Path, toolkit_repo: Path):
    source = git_file(paper_repo, GENERATOR)
    recorded = json.loads(git_file(paper_repo, METRICS))
    with tempfile.TemporaryDirectory(prefix="slide30-toolkit-") as temp:
        # Read blobs directly; git archive may consult unrelated working-tree
        # attributes/index entries in a cloud-synchronized source checkout.
        paths = subprocess.check_output([
            "git", "-C", str(toolkit_repo), "ls-tree", "-r", "--name-only", "-z",
            TOOLKIT_COMMIT, "dct_toolkit",
        ]).decode().strip("\0").split("\0")
        for path in paths:
            target = Path(temp) / path
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(subprocess.check_output([
                "git", "-C", str(toolkit_repo), "show", f"{TOOLKIT_COMMIT}:{path}",
            ]))
        sys.path.insert(0, temp)
        import dct_toolkit

        assert dct_toolkit.__version__ == "0.5.0"
        namespace = {"np": np, "time": time}
        for name in ("dct_count", "dct_mean", "dct_smooth", "dct_std", "dct_variance"):
            namespace[name] = getattr(dct_toolkit, name)
        # Execute the original numerical functions verbatim, without its plotting
        # imports, main(), or any output paths in the upstream repository.
        tree = ast.parse(source)
        selected = [node for node in tree.body if isinstance(node, ast.FunctionDef) and node.name in FUNCTIONS]
        assert {node.name for node in selected} == FUNCTIONS
        module = ast.Module(body=selected, type_ignores=[])
        exec(compile(module, GENERATOR, "exec", flags=__future__.annotations.compiler_flag), namespace)

        truth_2d = namespace["synthetic_field"]((160, 160))
        truth = namespace["synthetic_cyclone_wind_3d"]((18, 96, 96))
        runs = []
        representative = None
        for seed in recorded["seeds"]:
            rng = np.random.default_rng(seed)
            # These calls consume the SAME shared RNG as the original main().
            # Starting the outlier experiment directly from the seed changes data.
            namespace["run_missingness_experiment"](truth_2d, (9., 9.), rng)
            namespace["run_boundary_experiment"](rng)
            namespace["run_variance_calibration"](truth_2d, (9., 9.), rng)
            namespace["run_timing_summary"](truth_2d, (9., 9.), rng)
            result = namespace["run_outlier_identification_experiment"](
                truth, (3., 7., 7.), recorded["outlier_3d"]["threshold_grid"], rng,
            )
            row = next(row for row in result["threshold_metrics"] if row["threshold"] == 3.)
            runs.append({"seed": seed, **row})
            if representative is None:
                representative = result["representative"]
            print(f"seed {seed}: TP={int(row['tp'])}, FP={int(row['fp'])}, FN={int(row['fn'])}")

        reference = next(row for row in recorded["outlier_3d"]["threshold_sweep"] if row["threshold"] == 3.)
        aggregate = {}
        for key in ("precision", "recall", "f1"):
            values = [row[key] for row in runs]
            aggregate[key] = {"mean": float(np.mean(values)), "std": float(np.std(values, ddof=1))}
            np.testing.assert_allclose(aggregate[key]["mean"], reference[key]["mean"], rtol=0, atol=1e-12)
            np.testing.assert_allclose(aggregate[key]["std"], reference[key]["std"], rtol=0, atol=1e-12)

        assert representative["n_injected_total"] == 526
        assert representative["n_detected_total"] == 445
        assert representative["selected_threshold"] == 3.
        speed = np.sqrt(sum(representative[f"{c}_observed"] ** 2 for c in "uvw"))
        mean = dct_toolkit.dct_mean(speed, width=(3., 7., 7.), coordinates="cartesian", restore_input_nan=False)
        std = dct_toolkit.dct_std(speed, width=(3., 7., 7.), coordinates="cartesian", restore_input_nan=False)
        score = np.abs(speed - mean) / np.maximum(std, 1e-6)
        np.testing.assert_array_equal(score > 3., representative["detected_mask"])
        return representative, speed, mean, std, score, runs, aggregate, hashlib.sha256(source).hexdigest()


def export(paper_repo: Path, toolkit_repo: Path, output: Path):
    rep, speed, mean, std, score, runs, aggregate, source_hash = reproduce(paper_repo, toolkit_repo)
    injected, detected = rep["injected_mask"], rep["detected_mask"]
    shape = speed.shape
    iz, iy, ix = np.indices(shape)
    interior = (iz >= 4) & (iz <= 13) & (iy >= 20) & (iy <= 75) & (ix >= 20) & (ix <= 75)
    candidates = np.argwhere(injected & detected & interior & (speed > mean))
    focus = tuple(min(candidates, key=lambda i: abs(score[tuple(i)] - 4.5)))
    distance = (iz - focus[0]) ** 2 + (iy - focus[1]) ** 2 + (ix - focus[2]) ** 2
    ordinary = tuple(np.unravel_index(np.argmin(np.where(~injected & (score < .4) & (distance > 3), distance, np.inf)), shape))

    def point(index):
        i = tuple(int(v) for v in index)
        kind = "tp" if injected[i] and detected[i] else "fn" if injected[i] else "fp" if detected[i] else "ordinary"
        def vector(suffix):
            return [round(float(rep[f"{c}_{suffix}"][i]), 6) for c in "uvw"]
        return {
            "index": list(i),
            "position": [round(2 * i[2] / (shape[2] - 1) - 1, 6), round(2 * i[1] / (shape[1] - 1) - 1, 6), round(2 * i[0] / (shape[0] - 1) - 1, 6)],
            "truth": vector("truth"), "observed": vector("observed"), "meanVector": vector("mean"),
            "speed": round(float(speed[i]), 6), "meanSpeed": round(float(mean[i]), 6),
            "stdSpeed": round(float(std[i]), 6), "score": round(float(score[i]), 6), "kind": kind,
        }

    # One fixed cohort across animation stages, sampled only for rendering.
    # All detector calculations, counts, and scores use the full grid.
    background = [(z, y, x) for z in range(1, 18, 5) for y in range(6, 96, 12) for x in range(6, 96, 12)]
    indices = np.argwhere(injected)
    selected = np.random.default_rng(101).choice(len(indices), size=120, replace=False)
    anomalies = {tuple(indices[j]) for j in selected} | {focus}
    false_alarms = {tuple(i) for i in np.argwhere(detected & ~injected)}
    overview = sorted(set(background) | anomalies | false_alarms | {ordinary})
    # Enlarged context around the two inspected points. This crop is display-only:
    # the Gaussian response and the estimates were evaluated on the full volume.
    neighbors = [(focus[0] + z, focus[1] + y, focus[2] + x)
                 for z in (-1, 0, 1) for y in range(-6, 7, 2) for x in range(-6, 7, 2)]
    neighbors = sorted(set(neighbors) | {focus, ordinary})
    counts = {key: int(rep[key]) for key in ("tp", "fp", "fn")}
    full_hash = hashlib.sha256()
    for key in ("u_observed", "v_observed", "w_observed", "injected_mask", "detected_mask"):
        full_hash.update(rep[key].tobytes())
    data = {
        "meta": {
            "paperCommit": PAPER_COMMIT, "toolkitCommit": TOOLKIT_COMMIT, "generator": GENERATOR,
            "generatorSha256": source_hash, "fullArraysSha256": full_hash.hexdigest(),
            "seed": runs[0]["seed"], "shape": list(shape), "width": [3, 7, 7], "threshold": 3,
            "noiseStd": .14, "injectionProbability": .003, "injectionAmplitude": [1.25, 2.25],
            "injected": 526, "detected": 445, "counts": counts, "runs": runs, "aggregate": aggregate,
        },
        "overview": [point(i) for i in overview],
        "neighborhood": [point(i) for i in neighbors],
        "focus": point(focus), "ordinary": point(ordinary),
    }
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(data, separators=(",", ":")) + "\n")
    print(f"Verified all five runs against the paper. Wrote {output} ({output.stat().st_size:,} bytes).")
    print("Inspected anomaly:", data["focus"])
    print("Nearby ordinary point:", data["ordinary"])


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--paper-repo", type=Path, required=True)
    parser.add_argument("--toolkit-repo", type=Path, required=True)
    parser.add_argument("--output", type=Path, default=Path(__file__).resolve().parents[1] / "data/outlier-animation.json")
    args = parser.parse_args()
    export(args.paper_repo, args.toolkit_repo, args.output)
