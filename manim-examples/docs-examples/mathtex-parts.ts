import { MathTex, Create, FadeIn, Indicate, RED, BLUE, GREEN, WHITE } from 'manim-web';

// Create individually colored equation parts
const xSquared = new MathTex({ latex: 'x^2', color: RED });
const plus = new MathTex({ latex: '+', color: WHITE });
const ySquared = new MathTex({ latex: 'y^2', color: BLUE });
const equals = new MathTex({ latex: '=', color: WHITE });
const rSquared = new MathTex({ latex: 'r^2', color: GREEN });

// Animate each part independently
await scene.play(new Create(xSquared));
await scene.play(new Create(ySquared));
await scene.play(new Create(rSquared));

// Highlight specific parts
await scene.play(new Indicate(xSquared, { color: YELLOW }));
