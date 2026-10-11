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

## Personal acknowledgments

Edit the `personalThanks: |` frontmatter block under `title: Thanks all` in
[`sections/close.md`](sections/close.md) to add, change, or reorder the handwritten
messages. Keep each text line indented by two spaces and leave a blank line
between people. Soft-wrapped lines belong to the same message; HTML comments
and Markdown headings are ignored. There is no need to edit the Vue component.

Messages follow the file order and loop: a 3.2-second left-to-right write-on,
one line at a time, seven seconds fully visible, a 0.65-second fade out, and
a short blank interval. The full text layout is reserved while it is written.
Keep each message to a brief sentence; longer text is sized down to fit the
fixed area.
The heading and subtitle do not move, and the photo sequence is independent.
Reduced-motion, overview, and print-mode views show the first message without
animation. The locally bundled Caveat font is licensed under the SIL OFL;
see [`assets/fonts/`](assets/fonts/).
