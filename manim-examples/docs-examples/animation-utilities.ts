import {
  Circle, Square, Create, Transform,
  prepareAnimation,
} from 'manim-web';

// Accept direct Animation instances
const circle = new Circle({ radius: 1, color: BLUE });
const anim1 = prepareAnimation(new Create(circle));
await scene.play(anim1);

// Accept functions returning animations
const square = new Square({ sideLength: 2, color: RED });
const anim2 = prepareAnimation(() => new Transform(circle, square));
await scene.play(anim2);
