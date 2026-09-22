import {
  Scene,
  Polygon,
  LabeledPolygram,
  Circle,
  FadeIn,
  Create,
  BLACK,
  BLUE,
  WHITE,
} from 'manim-web';

const scene = new Scene(document.getElementById('container'), {
  width: 800,
  height: 450,
  backgroundColor: BLACK,
});

// Define polygon with holes
const ring1 = [
  [-3.8, -2.4, 0], [-2.4, -2.5, 0], [-1.3, -1.6, 0], [-0.2, -1.7, 0],
  [1.7, -2.5, 0], [2.9, -2.6, 0], [3.5, -1.5, 0], [4.9, -1.4, 0],
  [4.5, 0.2, 0], [4.7, 1.6, 0], [3.5, 2.4, 0], [1.1, 2.5, 0],
  [-0.1, 0.9, 0], [-1.2, 0.5, 0], [-1.6, 0.7, 0], [-1.4, 1.9, 0],
  [-2.6, 2.6, 0], [-4.4, 1.2, 0], [-4.9, -0.8, 0],
];
const ring2 = [
  [0.2, -1.2, 0], [0.9, -1.2, 0], [1.4, -2.0, 0], [2.1, -1.6, 0],
  [2.2, -0.5, 0], [1.4, 0.0, 0], [0.4, -0.2, 0],
];
const ring3 = [[-2.7, 1.4, 0], [-2.3, 1.7, 0], [-2.8, 1.9, 0]];

// Add polygon with holes to scene
const outerPoly = new Polygon({
  vertices: ring1, color: BLUE, fillOpacity: 0.75, strokeWidth: 2,
});
const hole1 = new Polygon({
  vertices: ring2, color: BLACK, fillOpacity: 1, strokeWidth: 0,
});
const hole2 = new Polygon({
  vertices: ring3, color: BLACK, fillOpacity: 1, strokeWidth: 0,
});
scene.add(outerPoly, hole1, hole2);

// Label fades in at the pole of inaccessibility
const labeled = new LabeledPolygram({
  vertexGroups: [ring1, ring2, ring3],
  label: 'Pole',
  precision: 0.01,
  labelFontSize: 28,
  labelColor: WHITE,
});
await scene.play(new FadeIn(labeled, { duration: 1 }));

// Draw reference circle at the pole
const circle = new Circle({
  radius: labeled.radius,
  color: WHITE,
  center: [labeled.pole[0], labeled.pole[1], 0],
});
await scene.play(new Create(circle, { duration: 0.8 }));
