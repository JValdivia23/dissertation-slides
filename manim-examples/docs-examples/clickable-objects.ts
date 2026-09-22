import { Circle, Square, Text, makeClickable, makeDraggable, BLUE, GREEN, YELLOW, RED, PURPLE, ORANGE, TEAL, PINK, WHITE } from 'manim-web';

const PALETTE = [BLUE, GREEN, YELLOW, RED, PURPLE, ORANGE, TEAL, PINK];

// Clickable: a discrete tap action — the circle never moves
let colorIndex = 0;
let clickCount = 0;
const circle = new Circle({ radius: 0.7, color: BLUE, fillOpacity: 0.9 });
circle.moveTo([-2.5, 0.3, 0]);
const counter = new Text({ text: 'Clicks: 0', fontSize: 22, color: WHITE });
counter.moveTo([-2.5, -1.6, 0]);

// Draggable: a continuous gesture that repositions the square
const square = new Square({ sideLength: 1.3, color: GREEN, fillOpacity: 0.9 });
square.moveTo([2.5, 0.3, 0]);
const posLabel = new Text({ text: 'Square: (2.5, 0.3)', fontSize: 22, color: WHITE });
posLabel.moveTo([2.5, -1.6, 0]);

scene.add(circle, counter, square, posLabel);

// This scene has no animation loop, so the callbacks call scene.render()
// to repaint after mutating a mobject.

// Click cycles color + counts; double-click resets (reset is idempotent)
const clickable = makeClickable(circle, scene, {
  onClick: () => {
    clickCount += 1;
    colorIndex = (colorIndex + 1) % PALETTE.length;
    circle.setColor(PALETTE[colorIndex]);
    counter.setText(`Clicks: ${clickCount}`);
    scene.render();
  },
  onDoubleClick: () => {
    clickCount = 0;
    colorIndex = 0;
    circle.setColor(BLUE);
    counter.setText('Clicks: 0');
    scene.render();
  },
});

// Drag repositions the square and reports its live position
const draggable = makeDraggable(square, scene, {
  onDrag: (_mobject, position) => {
    posLabel.setText(`Square: (${position[0].toFixed(1)}, ${position[1].toFixed(1)})`);
    scene.render();
  },
});

// Remove the event listeners when finished
// clickable.dispose();
// draggable.dispose();
