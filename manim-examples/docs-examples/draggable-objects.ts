import { Circle, Square, Dot, Line, Text, makeDraggable, BLUE, GREEN, RED, YELLOW, WHITE } from 'manim-web';

const circle = new Circle({ radius: 0.5, color: BLUE, fillOpacity: 0.8 });
circle.moveTo([-2, 1, 0]);

const square = new Square({ sideLength: 0.8, color: GREEN, fillOpacity: 0.8 });
square.moveTo([2, 1, 0]);

const dot = new Dot({ color: YELLOW, radius: 0.15 });
dot.moveTo([0, -1, 0]);

// Line updates reactively as objects are dragged — Draggable
// re-renders the scene after each onDrag callback by default
const line = new Line({ start: circle.getCenter(), end: dot.getCenter() }).setColor(RED);
const updateLine = () =>
  line.become(new Line({ start: circle.getCenter(), end: dot.getCenter() }).setColor(RED));

const label = new Text({ text: 'Drag the shapes!', fontSize: 24, color: WHITE });
label.moveTo([0, 2.5, 0]);

scene.add(circle, square, dot, line, label);

// Free drag
makeDraggable(circle, scene, { onDrag: updateLine });
makeDraggable(dot, scene, { onDrag: updateLine });

// Constrained to X axis with grid snapping
makeDraggable(square, scene, { constrainY: [1, 1], snapToGrid: 0.5 });
