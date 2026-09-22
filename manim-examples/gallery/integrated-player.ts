import {
  Player,
  Circle,
  Square,
  Triangle,
  Create,
  Transform,
  FadeIn,
  FadeOut,
  Indicate,
  Rotate,
  BLACK,
  BLUE,
  RED,
  GREEN,
  YELLOW,
} from 'manim-web';

const player = new Player(document.getElementById('container'), {
  width: 800,
  height: 450,
  backgroundColor: BLACK,
});

player.sequence(async (scene) => {
  // Create a blue circle
  const circle = new Circle({ radius: 1.5, color: BLUE });
  await scene.play(new Create(circle));

  await scene.wait(0.5);

  // Transform to red square
  const square = new Square({ sideLength: 3, color: RED });
  await scene.play(new Transform(circle, square));

  // Indicate
  await scene.play(new Indicate(circle));

  // Transform to green triangle
  const triangle = new Triangle({ color: GREEN });
  triangle.scale(2);
  await scene.play(new Transform(circle, triangle));

  // Rotate 180°
  await scene.play(new Rotate(circle, { angle: Math.PI }));

  // Fade out
  await scene.play(new FadeOut(circle));

  // Bring in a yellow circle
  const circle2 = new Circle({ radius: 1, color: YELLOW });
  await scene.play(new FadeIn(circle2));

  await scene.wait(1);
});
