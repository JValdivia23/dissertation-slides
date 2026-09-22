import {
  BLUE,
  Camera2D,
  Circle,
  Create,
  RED,
  Scene,
  SplitScreenCamera,
  Square,
  YELLOW,
} from 'manim-web';

const scene = new Scene(document.getElementById('container'), {
  width: 800,
  height: 450,
  backgroundColor: '#1a1a2e',
});

const leftCamera = new Camera2D({
  frameWidth: 14,
  frameHeight: 8,
  position: [-3, 0, 10],
  aspectMode: 'contain',
});
const rightCamera = new Camera2D({
  frameWidth: 4,
  frameHeight: 4,
  position: [3, 0, 10],
  aspectMode: 'contain',
});

const split = new SplitScreenCamera({
  leftCamera,
  rightCamera,
  split: 'horizontal',
  splitRatio: 0.5,
});
const mc = split.getMultiCamera();
mc.setViewportBorder(0, { borderColor: '#888888', borderWidth: 2 });
mc.setViewportBorder(1, { borderColor: '#888888', borderWidth: 2 });
scene.useMultiCamera(mc);

const circle = new Circle({ radius: 1, color: RED, strokeWidth: 4 });
circle.shift([-3, 0, 0]);
const square = new Square({ sideLength: 1.5, color: BLUE, strokeWidth: 4 });
square.shift([3, 0, 0]);
const marker = new Circle({ radius: 0.15, color: YELLOW, strokeWidth: 3 });

scene.add(marker);
await scene.play(new Create(circle));
await scene.play(new Create(square));
await scene.wait(0.8);

scene.useMultiCamera(null);
