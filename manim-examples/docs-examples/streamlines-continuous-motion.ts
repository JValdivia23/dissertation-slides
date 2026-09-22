import { Scene, NumberPlane, StreamLines, BLACK } from 'manim-web';

const scene = new Scene(document.getElementById('container'), {
  width: 854,
  height: 480,
  backgroundColor: BLACK,
});

const plane = new NumberPlane({
  xRange: [-7, 7, 1],
  yRange: [-4, 4, 1],
  backgroundLineStyle: {
    color: '#333355',
    strokeWidth: 0.5,
    opacity: 0.3,
  },
});
scene.add(plane);

const streamLines = new StreamLines({
  func: (x, y) => [
    Math.sin(x / 2) + Math.cos(y / 2) * 0.5,
    Math.cos(x / 2) * 0.5 - Math.sin(y / 2),
  ],
  xRange: [-6, 6, 0.5],
  yRange: [-3.5, 3.5, 0.5],
  numLines: 25,
  strokeWidth: 3,
  maxLineLength: 12,
  stepSize: 0.08,
  opacity: 0.9,
});
scene.add(streamLines);

// Start continuous flowing animation
streamLines.startAnimation({
  warmUp: true, // randomize initial phases
  flowSpeed: 1.5, // speed multiplier
  timeWidth: 0.3, // visible window fraction
});

await scene.wait(10);

// Stop and restore static streamlines
streamLines.endAnimation();
