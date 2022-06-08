import { OakTheme, default as defaultTheme } from ".";

const ausTheme: OakTheme = {
  // Extends default theme
  ...defaultTheme,
  name: "aus",
  button: {
    ...defaultTheme.button,
    // Simply altering primary button config as an example
    primary: {
      background: "inYourFace",
      text: "white",
    },
  },
};

export default ausTheme;
