# Manim in this Slidev deck

This presentation uses `manim-web@0.3.24` through the experimental `<CuManim>`
component in the pinned CU Boulder theme. The component is a Slidev click
adapter; `manim-web` supplies the scenes, mobjects, and animations. This is
JavaScript/TypeScript API syntax, not Python Manim syntax.

## Sources for API details

1. **Installed types for this version:** `node_modules/manim-web/dist/index.d.ts`
   lists exports. Follow its re-exports into `dist/core/`, `dist/mobjects/`,
   and `dist/animation/` for constructor signatures and option names. The
   complete declarations are restored by `npm ci`; `index.d.ts` alone is only
   an export map.
2. **Local upstream examples:** [the version-pinned index](../manim-examples/INDEX.md)
    lists all 39 official gallery snippets, 18 further documentation snippets,
    60 standalone TypeScript files, and 89 HTML pages. Read the
    [archive notes](../manim-examples/README.md)
   before adapting them; these original sources are not automatically compatible
   with `<CuManim>`.
3. **Working integration examples:**
   `node_modules/slidev-theme-cu-boulder/examples/manim.md` (also in the
   `beta/cu-manim` checkout at `~/projects/slidev-cu/examples/manim.md`). The
   theme checkout's example uses `theme: ../`; this deck uses
   `theme: cu-boulder` because the theme is installed as a dependency.
4. **Online references:** the [official TypeDoc API][api] and
   [interactive examples][examples]. The online site can change independently
   of our pinned package, so resolve any disagreement in favor of the installed
   `0.3.24` declarations and test the behavior in a browser.

The theme dependency is pinned to a commit on `beta/cu-manim` in `package.json`.
Update the theme in its own repository and then update this deck's dependency
and lockfile; do not change the installed copy in `node_modules/`.

## A click-stepped slide

Add a slide like this to `slides.md` after a slide separator. The deck's first
frontmatter already sets `theme: cu-boulder`.

```md
---
layout: default
---

# Square to circle

<CuManim :steps="2" :width="800" :height="320" :construct="squareToCircle" />

<script setup>
import { BLACK, Circle, Create, Scene, Square, Transform } from 'manim-web'

async function squareToCircle() {
  const scene = new Scene(document.getElementById('container'), {
    width: 800,
    height: 450,
    backgroundColor: BLACK,
  })
  const square = new Square({ sideLength: 2 })
  await scene.play(new Create(square))
  await scene.play(new Transform(square, new Circle({ radius: 1.2 })))
}
</script>
```

Import the library at the top of the slide's `<script setup>`. Construct a fresh
`Scene` **inside** the function passed to `:construct`, before its first
`await`. `<CuManim>` supplies the `#container` element and owns scene cleanup
when the slide is left or replayed. Do not cache the scene across runs.

The component's `:width` and `:height` cap the **displayed** canvas. The
`Scene` options set its internal render dimensions; the values need not match.
The adapter also limits the visible height above the CU footer. Use a dark
scene background and contrasting mobject colors, such as `BLACK` and `WHITE`,
or CSS color strings accepted by the library.

## Click and lifecycle rules

- `:steps` is the number of `scene.play(...)` **calls**, not the number of
  animations passed to each call. One `play(new FadeIn(a), new FadeIn(b))` is
  one click. Set the count explicitly so Slidev keeps Space on this slide.
- Each `play()` waits for its Slidev click, then runs at its authored duration.
  `await scene.wait(...)` neither sleeps nor consumes a click in `<CuManim>`.
  `scene.add(...)` also consumes no click; the adapter defers pre-play additions
  until the next play or the construct function completes.
- Going backward restarts the construct function and replays earlier steps at
  tiny durations through `Scene.play()`. Do not use `Player.seek()`; it is known
  to fail on `MathTex` groups in `manim-web@0.3.24`.
- Create the scene synchronously. A scene that awaits asynchronous setup
  **before its first `scene.add()` or `scene.play()`** may not be registered
  for cleanup; rewinding or leaving during that interval is a known beta
  limitation. Review such slides carefully, especially those loading math or
  fonts. Use one `<CuManim>` per slide until multi-instance click behavior is
  verified.
- The component blocks canvas pointer events so clicks and keyboard navigation
  remain with Slidev. Do not add separate canvas controls that compete with
  presentation navigation.

## Common mobjects (0.3.24)

| Mobject | Example options or methods | Exact declaration |
|---|---|---|
| `Square` | `{ sideLength: 2, color: BLUE, fillOpacity: 1 }` | `dist/mobjects/geometry/Rectangle.d.ts` |
| `Circle` | `{ radius: 1.2, color: BLUE, fillOpacity: 0 }` | `dist/mobjects/geometry/Circle.d.ts` |
| `Text` | `{ text: 'Title', fontSize: 48, color: WHITE, fontUrl }`; `await text.loadGlyphs()` when glyph outlines are needed | `dist/mobjects/text/Text.d.ts` |
| `MathTex` | `{ latex: '\\alpha + \\beta', color: WHITE }`; `await math.waitForRender()` before geometry-dependent layout | `dist/mobjects/text/MathTex.d.ts` |
| `Axes` | `{ xRange: [-5, 5, 1], yRange: [-3, 3, 1], xLength: 8 }`; `axes.coordsToPoint(x, y)` | `dist/mobjects/graphing/Axes.d.ts` |
| `NumberPlane` | Axes options plus `{ backgroundLineStyle: { color: '#334455', opacity: 0.3 } }` | `dist/mobjects/graphing/NumberPlane.d.ts` |

Paths in this and the next table are relative to `node_modules/manim-web/`.
The options use camelCase (`sideLength`, `fontUrl`, `rateFunc`), unlike many
Python Manim examples. `Text.fontSize` is in points, while `MathTex.fontSize`
is a scale factor (default `1`); check the two types before changing sizes.
`fontUrl` is optional and is used for extracting glyph outlines. If the font or
math needs to render asynchronously, test both forward playback and rewind.

## Common animations (0.3.24)

| Animation | Example call | Exact declaration |
|---|---|---|
| `Create` | `new Create(square, { duration: 2, lagRatio: 0.1 })` | `dist/animation/creation/Create.d.ts` |
| `Transform` | `new Transform(square, new Circle({ radius: 1.2 }))` | `dist/animation/transform/Transform.d.ts` |
| `FadeIn` / `FadeOut` | `new FadeIn(text, { shift: DOWN })` | `dist/animation/fading/FadeIn.d.ts`, `FadeOut.d.ts` |
| `Shift` | `new Shift(square, { direction: LEFT })` | `dist/animation/movement/Shift.d.ts` |
| `Rotate` | `new Rotate(square, { angle: Math.PI / 2 })` (radians) | `dist/animation/movement/Rotate.d.ts` |
| `ApplyPointwiseFunction` | `new ApplyPointwiseFunction(grid, p => [p[0], p[1] + Math.sin(p[0]), p[2]])` | `dist/animation/transform/ApplyPointwiseFunction.d.ts` |

The shared `AnimationOptions` in `dist/animation/Animation.d.ts` defines
`duration` in seconds and `rateFunc` for pacing. See
`dist/core/Scene.d.ts` for `SceneOptions`, `add`, `play`, and `wait`, and
`dist/core/Mobject.d.ts` for shared positioning, color, and updater methods.
For unfamiliar classes or methods, follow the re-exports in `index.d.ts`
instead of guessing from a Python example.

## Check a Manim slide

1. Run `npm run build` after adding it. The current starter cover alone does
   not exercise `<CuManim>`; build the deck **with the new slide present**.
2. Run `npm run dev`. In the browser, check the initial frame, each Space/click,
   reverse navigation, final frame, and any text/math/font rendering. Check
   light and dark Slidev modes and that the canvas does not overlap the footer.
3. After GitHub Pages deployment, check the same slide at its actual subpath.
   A successful build does not prove WebGL playback or external font loading.

PDF/PNG export needs the optional Playwright browser package and has not been
verified for these click-stepped frames. The static website build preserves
the interactive canvas; editable PowerPoint output will rasterize it.

[api]: https://maloyan.github.io/manim-web/api/
[examples]: https://maloyan.github.io/manim-web/examples/
