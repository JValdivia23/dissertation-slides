# Local manim-web examples

This is a source-reference snapshot from
[`maloyan/manim-web` v0.3.24](https://github.com/maloyan/manim-web/tree/v0.3.24)
(commit `f687ad88e57293bcf40203f1bf2771dc1e45ca15`), matching this deck's
`manim-web` dependency. The upstream [MIT license](LICENSE) and the
[KaTeX font license](LICENSE.KATEX) are included. Browse
the complete, linked [example index](INDEX.md) or the
[interactive upstream gallery](https://maloyan.github.io/manim-web/examples/).

## What is here

- [`gallery/`](gallery/) contains the **39 TypeScript source blocks** from the
  official examples page, extracted without changing their code from
  [`docs/docs/examples.mdx`](upstream-v0.3.24/docs/docs/examples.mdx).
- [`docs-examples/`](docs-examples/) contains **18 further source blocks** from
  the four annotated documentation pages that are absent from the main gallery.
- [`upstream-v0.3.24/examples/`](upstream-v0.3.24/examples/) preserves the
  upstream examples tree: **60 `.ts` files, 89 `.html` files, and one font**.
  Some HTML pages contain their own inline examples; others pair with a `.ts`
  file. Four additional annotated example pages are preserved under
  [`upstream-v0.3.24/docs/docs/examples/`](upstream-v0.3.24/docs/docs/examples/).
- [`INDEX.md`](INDEX.md) lists all 57 distinct documentation snippets and 60
  standalone TypeScript examples, with links to all 89 HTML pages (60 paired
  with TypeScript files and 29 HTML-only pages).

These are **upstream source references**, not Slidev slides or tests of
`<CuManim>`. The gallery snippets and standalone examples sometimes differ;
both versions remain available. Upstream `.ts` files may import `../src/index.ts`
and rely on accompanying HTML controls. Gallery snippets may use top-level
`await`, `Player`, export functions, or their own `#container`. They are not
automatically loaded by `slides.md` or `npm run build`.

## Use in this presentation

Read [`docs/manim-web-guide.md`](../docs/manim-web-guide.md) before adapting a
snippet. Import from `manim-web` in the slide's `<script setup>`, create the
scene inside the function passed to `<CuManim :construct>`, and set `:steps` to
the number of `scene.play()` calls. Keep the upstream files unchanged; write
presentation-specific scenes in `slides.md` or other deck source files.

`<CuManim>` owns the canvas and Slidev navigation. Player controls, pointer
interaction, export buttons, camera/3D variants, and asynchronous scene setup
may require different integration; their presence in this archive does not
mean they work inside `<CuManim>`. Check exact signatures against the installed
`node_modules/manim-web/dist/*.d.ts` declarations for version `0.3.24`.

## Rebuild the index

The pinned MDX source and examples tree are preserved above. From the project
root, run `node manim-examples/extract-gallery.mjs` to regenerate the 39 gallery
snippets, 18 further docs snippets, and `INDEX.md`. The extractor checks
expected counts for this tag and fails if the source set changes; review and
update it when changing the pinned `manim-web` version.
