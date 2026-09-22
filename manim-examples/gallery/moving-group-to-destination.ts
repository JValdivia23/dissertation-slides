import {
  Scene,
  VGroup,
  Dot,
  Shift,
  LEFT,
  ORIGIN,
  RIGHT,
  RED,
  YELLOW,
  BLACK,
  scaleVec,
  subVec,
} from 'manim-web';

const scene = new Scene(document.getElementById('container'), {
  width: 800,
  height: 450,
  backgroundColor: BLACK,
});

const group = new VGroup(
  new Dot({ point: LEFT }),
  new Dot({ point: ORIGIN }),
  new Dot({ point: RIGHT, color: RED }),
  new Dot({ point: scaleVec(2, RIGHT) }),
).scale(1.4);

const dest = new Dot({ point: [4, 3, 0], color: YELLOW });

scene.add(group, dest);

await scene.play(
  new Shift(group, {
    direction: subVec(dest.getCenter(), group.get(2).getCenter()),
  }),
);
await scene.wait(0.5);
