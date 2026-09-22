import {
  Axes,
  BLUE,
  Create,
  Dot,
  Polygon,
  Scene,
  ValueTracker,
  YELLOW_B,
  YELLOW_D,
  BLACK,
} from 'manim-web';

const scene = new Scene(document.getElementById('container'), {
  width: 854,
  height: 480,
  backgroundColor: BLACK,
});

const ax = new Axes({
  xRange: [0, 10],
  yRange: [0, 10],
  xLength: 6,
  yLength: 6,
  tips: false,
});

const t = new ValueTracker(5);
const k = 25;

const graph = ax.plot((x) => k / x, { color: YELLOW_D, xRange: [k / 10, 10.0], numSamples: 750 });

function makeRectangle() {
  const corners = getRectangleCorners([0, 0], [t.getValue(), k / t.getValue()]);
  const vertices = corners.map(([x, y]) => ax.c2p(x, y));
  const p = new Polygon({ vertices, strokeWidth: 1, color: YELLOW_B, fillOpacity: 0.5 });
  p.fillColor = BLUE;
  return p;
}

const polygon = makeRectangle();
polygon.addUpdater(() => {
  polygon.become(makeRectangle());
});

const dot = new Dot();
dot.addUpdater(() => dot.moveTo(ax.c2p(t.getValue(), k / t.getValue())));

scene.add(ax, graph);
await scene.play(new Create(polygon));
scene.add(dot);
await scene.play(t.animateTo(10));
await scene.play(t.animateTo(k / 10));
await scene.play(t.animateTo(5));

function getRectangleCorners(bottomLeft, topRight) {
  return [
    [topRight[0], topRight[1]],
    [bottomLeft[0], topRight[1]],
    [bottomLeft[0], bottomLeft[1]],
    [topRight[0], bottomLeft[1]],
  ];
}
