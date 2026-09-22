import {
  Matrix, IntegerMatrix, DecimalMatrix, MobjectMatrix,
  Circle, Square, MathTex,
  Create, FadeIn, getDetText, YELLOW,
} from 'manim-web';

// Multiple matrix types (like Python Manim's MatrixExamples)
const m0 = new Matrix([['\\pi', '0'], ['-1', '1']]);
const m1 = new IntegerMatrix([[1.5, 0], [12, -1.3]], { bracketType: '()' });
const m2 = new DecimalMatrix([[3.456, 2.122], [33.2244, 12.33]], { numDecimalPlaces: 2 });
const m3 = new MobjectMatrix([
  [new Circle({ radius: 0.15 }), new Square({ sideLength: 0.25 })],
  [new MathTex({ latex: '\\pi' }), new Circle({ radius: 0.1 })],
]);

// Determinant text (like Python Manim's DeterminantOfAMatrix)
const matrix = new Matrix([[2, 0], [-1, 1]]);
const det = getDetText(matrix, { determinant: 3, color: YELLOW });
scene.add(matrix);
scene.add(det);
