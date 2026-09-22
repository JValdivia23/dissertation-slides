import { Scene, Line, ORIGIN, LEFT, WHITE, YELLOW } from 'manim-web';

const scene = new Scene(document.getElementById('container'), {
  width: 800,
  height: 450,
  backgroundColor: '#000000',
});

const updaterForth = (mobj, dt) => {
  mobj.rotateAboutOrigin(dt);
};
const updaterBack = (mobj, dt) => {
  mobj.rotateAboutOrigin(-dt);
};
const lineReference = new Line({ start: ORIGIN, end: LEFT }).setColor(WHITE);
const lineMoving = new Line({ start: ORIGIN, end: LEFT }).setColor(YELLOW);
lineMoving.addUpdater(updaterForth);
scene.add(lineReference, lineMoving);
await scene.wait(2);
lineMoving.removeUpdater(updaterForth);
lineMoving.addUpdater(updaterBack);
await scene.wait(2);
lineMoving.removeUpdater(updaterBack);
await scene.wait(0.5);
