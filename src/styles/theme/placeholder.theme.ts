import { OakTheme, default as defaultTheme } from ".";

const placeholderTheme: OakTheme = {
  // Extends default theme
  ...defaultTheme,
  name: "placeholder",
  button: {
    ...defaultTheme.button,
    // Simply altering primary button config as an example
    primary: {
      background: "limeade",
      text: "white",
    },
  },
};

export default placeholderTheme;
