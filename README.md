# Dissertation Slides

Slidev presentation source for the dissertation defense. Built with Slidev 53 and the CU Boulder theme.

## Local development

Requires Node.js 22.12+ (24 LTS recommended) and npm.

```sh
npm ci
npm run dev
npm run build
```

## Theme and animations

- Theme: `cu-boulder`, pinned to `JValdivia23/slidev-theme-cu-boulder` commit `89514b7` on `beta/cu-manim`.
- `manim-web@0.3.24` is a direct dependency for `<CuManim>` slides.
- Before writing Manim slides, read `docs/manim-web-guide.md`.
- `manim-examples/` is a version-pinned upstream source reference, not Slidev slides; keep archived files unchanged.

## Publishing

No deployment workflow is configured yet. The planned path is GitHub Actions building the static Slidev site for the personal website.
