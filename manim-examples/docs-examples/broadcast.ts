import {
  Scene,
  Circle,
  Square,
  Broadcast,
  Create,
  FadeIn,
  FadeOut,
  TEAL_A,
  YELLOW,
  BLACK,
} from 'manim-web';

const scene = new Scene(document.getElementById('container'), {
  width: 800,
  height: 450,
  backgroundColor: BLACK,
});

// Basic Broadcast - circle emanates outward with fading copies
const circle = new Circle({ radius: 1.5, color: TEAL_A });
scene.add(circle);
await scene.play(new Create(circle));
await scene.play(new Broadcast(circle));
await scene.wait(0.5);

// Broadcast with custom options on a square
await scene.play(new FadeOut(circle));
const square = new Square({ sideLength: 2, color: YELLOW });
scene.add(square);
await scene.play(new FadeIn(square));
await scene.play(
  new Broadcast(square, {
    nMobs: 3,
    initialOpacity: 0.8,
    lagRatio: 0.3,
    duration: 2,
  }),
);
await scene.wait(0.5);
