import { Scene, Axes, Dot, MAROON, ValueTracker, linspace, BLACK } from 'manim-web';

const scene = new Scene(document.getElementById('container'), {
  width: 800,
  height: 450,
  backgroundColor: BLACK,
});

const ax = new Axes({
  xRange: [0, 10],
  yRange: [0, 100, 10],
  axisConfig: { includeTip: false },
});
const labels = ax.getAxisLabels({ xLabel: 'x', yLabel: 'f(x)' });

const t = new ValueTracker(0);

const func = (x) => {
  return 2 * (x - 5) ** 2;
};
const graph = ax.plot(func, { color: MAROON });

const initialPoint = [ax.coordsToPoint(t.getValue(), func(t.getValue()))];
const dot = new Dot({ point: initialPoint });

dot.addUpdater((x) => x.moveTo(ax.coordsToPoint(t.getValue(), func(t.getValue()))));
const xSpace = linspace(...ax.xRange.slice(0, 2), 200);
const minimumIndex = xSpace.reduce((mi, _, i, a) => (func(a[i]) < func(a[mi]) ? i : mi), 0);

scene.add(ax, labels, graph, dot);
await scene.play(t.animateTo(xSpace[minimumIndex]));
await scene.wait();
