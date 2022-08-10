import { OakTheme, default as defaultTheme } from ".";

const oakBrandTheme: OakTheme = {
  // Extends default theme
  ...defaultTheme,
  name: "Oak Brand",
  button: {
    ...defaultTheme.button,
    // Simply altering primary button config as an example
    primary: {
      background: "pupilsGreen",
      text: "white",
    },
  },
};

export default oakBrandTheme;
