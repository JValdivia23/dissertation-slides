import { Scene, VMobject, Dot, Rotating, Shift, UP, LEFT, RIGHT, BLACK } from 'manim-web';

const scene = new Scene(document.getElementById('container'), {
  width: 800,
  height: 450,
  backgroundColor: BLACK,
});

const path = new VMobject();
path.fillOpacity = 0;
const dot = new Dot();
path.setPointsAsCorners([dot.getCenter(), dot.getCenter()]);

const updatePath = (pathMob) => {
  const previousPath = pathMob.copy();
  previousPath.addPointsAsCorners([dot.getCenter()]);
  pathMob.become(previousPath);
};
path.addUpdater(updatePath);

scene.add(path, dot);

await scene.play(new Rotating(dot, { angle: Math.PI, aboutPoint: RIGHT, duration: 2 }));
await scene.wait();
await scene.play(new Shift(dot, { direction: UP }));
await scene.play(new Shift(dot, { direction: LEFT }));
await scene.wait();
