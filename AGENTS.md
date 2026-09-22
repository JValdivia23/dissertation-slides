# Agent Guide

## Project

This repository is the source for a dissertation presentation built with Slidev.
Work in this local checkout, not in OneDrive. Keep the presentation separate from
the CU Boulder theme and its experimental Manim integration.

## Thesis manuscript

The dissertation text lives outside this repository:

`/Users/java1127/Library/CloudStorage/OneDrive-UCB-O365/Papers/phd_thesis/manuscript`

Use it as the source of scientific content for the slides. Read `AGENTS.md`,
`SOURCE_MANIFEST.md`, and the chapter files there when checking claims, figure
captions, or chapter order. Do not edit, commit, or build the manuscript from
this repository unless you are explicitly asked to. Keep presentation source,
dependencies, and build output in this local checkout.

## Repositories and dependencies

- Presentation source belongs here: slides, figures, notes, configuration, and
  the GitHub publishing workflow.
- Theme source lives in `~/projects/slidev-cu` on `beta/cu-manim`. Change layouts,
  styles, or `<CuManim>` there, not in this repository or in `node_modules/`.
- For reproducible installs and GitHub Actions builds, depend on a pushed commit
  of `JValdivia23/slidev-theme-cu-boulder` from `beta/cu-manim`, not a local
  `file:` path. After a theme change, push the beta branch, update the commit
  reference here, and update `package-lock.json`.
- A deck using `<CuManim>` must install `manim-web` directly. The theme keeps it
  as an optional peer dependency.

## Local development

- Use npm and Node.js 22.12+ (Node.js 24 LTS is recommended); Slidev 53 is the
  development baseline.
- Run `npm ci` locally, `npm run dev` to preview, and `npm run build` before
  publishing. Do not copy dependencies or build output to OneDrive.
- Use the project-local Slidev skill in `.opencode/skills/slidev/` for syntax and
  feature references. Its upstream examples may use pnpm; use npm here. The
  project-local MCP server in `opencode.jsonc` operates on `slides.md`; see
  `docs/slidev-ai.md` for usage and limitations.
- Keep authored slides and their assets in this repository. Use `theme: cu-boulder`
  when loading the installed theme.
- Before writing or reviewing Manim slides, read `docs/manim-web-guide.md`.
  It documents `<CuManim>` click and lifecycle rules, common `manim-web@0.3.24`
  APIs, and checks. Browse `manim-examples/INDEX.md` for version-pinned upstream
  source examples, and keep those archived files unchanged. For any unfamiliar
  signature, follow `node_modules/manim-web/dist/index.d.ts` into its exported
  declaration files; the installed types take precedence over mutable online
  API pages.

## Git and publishing

- Commit authored files, `package.json`, `package-lock.json`, `AGENTS.md`, and
  GitHub Actions configuration. Do not commit `node_modules/`, Slidev/Vite
  caches, or `dist/`.
- GitHub Actions should install from the lockfile, build the static Slidev site,
  and deploy the generated output to GitHub Pages. Use the correct base path for
  the repository URL and verify it after deployment; link to that URL from the
  personal website.
- A web build is distinct from PDF/PNG export. Check click-stepped Manim frames
  in the deployed site, and do not claim export behavior is verified until it
  has been tested.
