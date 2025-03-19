import { OakTheme, default as defaultTheme } from ".";

const oakBrandTheme: OakTheme = {
  // Extends default theme
  ...defaultTheme,
  name: "Oak Brand",
  buttons: {
    ...defaultTheme.buttons,
    primary: {
      background: "oakGreen",
      text: "white",
    },
  },
};

export default oakBrandTheme;
