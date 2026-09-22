import {
  VGroup, Circle, Square, Triangle,
  TransformMatchingShapes, Create,
  BLUE, RED, GREEN, YELLOW,
} from 'manim-web';

// Source shapes
const source = new VGroup();
source.add(new Circle({ radius: 0.5, color: BLUE, fillOpacity: 0.5 }));
source.add(new Square({ sideLength: 1, color: RED, fillOpacity: 0.5 }));
source.add(new Triangle({ sideLength: 1, color: GREEN, fillOpacity: 0.5 }));
await scene.play(new Create(source));

// Target shapes (rearranged)
const target = new VGroup();
target.add(new Circle({ radius: 0.7, color: YELLOW, fillOpacity: 0.5 }));
target.add(new Square({ sideLength: 1.2, color: GREEN, fillOpacity: 0.5 }));
target.add(new Triangle({ sideLength: 0.8, color: BLUE, fillOpacity: 0.5 }));

// Shapes are matched and transformed smoothly
await scene.play(new TransformMatchingShapes(source, target, { duration: 2 }));
