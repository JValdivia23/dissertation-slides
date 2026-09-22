import {
  Scene,
  Square,
  Shift,
  MoveToTarget,
  Scale,
  Rotate,
  BLUE,
  ORANGE,
  LEFT,
  BLACK,
} from 'manim-web';

const scene = new Scene(document.getElementById('container'), {
  width: 800,
  height: 450,
  backgroundColor: BLACK,
});

const square = new Square({ color: BLUE, fillOpacity: 1 });

await scene.play(new Shift(square, { direction: LEFT }));

square.generateTarget();
square.targetCopy.setFill(ORANGE);
await scene.play(new MoveToTarget(square));

await scene.play(new Scale(square, { scaleFactor: 0.3 }));

await scene.play(new Rotate(square, { angle: 0.4 }));
