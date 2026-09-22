import {
  TexTemplate, TexTemplateLibrary, TexFontTemplates,
  MathTex, Create,
} from 'manim-web';

// Create a custom template
const template = new TexTemplate();
template.addPackage('physics');
console.log(template.getBody('$\\int_0^\\infty e^{-x^2} dx$'));

// Use pre-built templates
const defaultTemplate = TexTemplateLibrary.default;
const mathTemplate = TexTemplateLibrary.fullMath;

// Font templates available
const palatino = TexFontTemplates.palatino;
console.log(palatino.description); // "Palatino"
