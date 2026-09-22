import { ConvexHull3D, Create, Rotate, GREEN_C } from 'manim-web';

const hull = new ConvexHull3D({
  points: [
    [1, 0, 0], [-1, 0, 0],
    [0, 1, 0], [0, -1, 0],
    [0, 0, 1], [0, 0, -1],
    [0.5, 0.5, 0.5], [-0.5, -0.5, 0.5],
  ],
  color: GREEN_C,
  opacity: 0.6,
});

await scene.play(new Create(hull, { duration: 2 }));
await scene.play(new Rotate(hull, { angle: Math.PI, duration: 3 }));

// Switch to wireframe
hull.setWireframe(true);
