import { Arc, Arrow, Create, BLUE, RED, YELLOW } from 'manim-web';

const arc = new Arc({
  radius: 2,
  startAngle: 0,
  angle: Math.PI * 1.2,
  color: BLUE,
});
await scene.play(new Create(arc));

const arrow1 = new Arrow({
  start: [-3, -1.5, 0],
  end: [0, 1.5, 0],
  color: RED,
  tipLength: 0.3,
});

const arrow2 = new Arrow({
  start: [0, 1.5, 0],
  end: [3, -1.5, 0],
  color: YELLOW,
  tipLength: 0.3,
});

await scene.play(new Create(arrow1));
await scene.play(new Create(arrow2));
