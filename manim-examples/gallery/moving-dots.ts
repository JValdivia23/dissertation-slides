import { Scene, Dot, VGroup, Line, ValueTracker, BLUE, GREEN, RED, RIGHT } from 'manim-web';

const scene = new Scene(document.getElementById('container'), {
  width: 800,
  height: 450,
  backgroundColor: '#000000',
});

const d1 = new Dot({ color: BLUE });
const d2 = new Dot({ color: GREEN });
new VGroup(d1, d2).arrange(RIGHT, 1);
const l1 = new Line({ start: d1.getCenter(), end: d2.getCenter() }).setColor(RED);
const x = new ValueTracker(0);
const y = new ValueTracker(0);
d1.addUpdater((z) => z.setX(x.getValue()));
d2.addUpdater((z) => z.setY(y.getValue()));
l1.addUpdater((z) => z.become(new Line({ start: d1.getCenter(), end: d2.getCenter() })));
scene.add(d1, d2, l1);
await scene.play(x.animateTo(5));
await scene.play(y.animateTo(4));
await scene.wait();
