import {
  Scene,
  NumberPlane,
  Create,
  ApplyComplexFunction,
  BLACK,
} from 'manim-web';

const scene = new Scene(document.getElementById('container'), {
  width: 800,
  height: 450,
  backgroundColor: BLACK,
});

// Create a number plane grid
const grid = new NumberPlane();
grid.prepareForNonlinearTransform();
scene.add(grid);
await scene.play(new Create(grid, { duration: 2, lagRatio: 0.1 }));
await scene.wait(0.5);

// Apply z => z^2: squares every complex number
// This maps the grid non-linearly, bending lines into parabolic curves
await scene.play(
  new ApplyComplexFunction(grid, {
    func: (z) => ({
      re: z.re * z.re - z.im * z.im,
      im: 2 * z.re * z.im,
    }),
    duration: 3,
  }),
);
await scene.wait(1);
