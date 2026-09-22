import { Scene, PolarPlane, MathTex, BLACK } from 'manim-web';

const scene = new Scene(document.getElementById('container'), {
  width: 600,
  height: 600,
  backgroundColor: BLACK,
});

const angleLatex = [
  '0',
  '\\tau/12',
  '\\tau/6',
  '\\tau/4',
  '\\tau/3',
  '5\\tau/12',
  '\\tau/2',
  '7\\tau/12',
  '2\\tau/3',
  '3\\tau/4',
  '5\\tau/6',
  '11\\tau/12',
];
const angleLabels = angleLatex.map((latex) => new MathTex({ latex, fontSize: 28 }));
const radiusLabels = ['r_1', 'r_2', 'r_3'].map((latex) => new MathTex({ latex, fontSize: 24 }));

// Wait for LaTeX rendering so PolarPlane can place labels using real glyph bounds.
await Promise.all([...angleLabels, ...radiusLabels].map((l) => l.waitForRender()));

scene.add(
  new PolarPlane({
    radius: 3,
    size: 6,
    angularDivisions: 12,
    radialDivisions: 3,
    angleLabels,
    radiusLabels,
  }),
);
