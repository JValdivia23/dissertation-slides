import { ManimBanner } from 'manim-web';

const banner = new ManimBanner({ darkTheme: true });

// Draw the logo shapes
await scene.play(banner.createAnimation({ duration: 2 }));

// Reveal the text
await scene.play(banner.expandAnimation({ duration: 1.5 }));
