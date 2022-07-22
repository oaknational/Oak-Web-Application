import { OakTheme, default as defaultTheme } from ".";

const ausTheme: OakTheme = {
  // Extends default theme
  ...defaultTheme,
  name: "aus",
  button: {
    ...defaultTheme.button,
    // Simply altering primary button config as an example
    primary: {
      background: "teachersLilac",
      text: "white",
    },
  },
  lessonControl: {
    ...defaultTheme.lessonControl,
    current: {
      background: "grey3",
      border: "2px solid",
      borderColor: "grey9",
    },
  },
  toggle: {
    on: {
      labelColor: "grey10",
      background: "white",
      switchColor: "grey8",
    },
    off: {
      labelColor: "grey8",
      background: "white",
      switchColor: "grey8",
    },
    disabled: {
      labelColor: "grey3",
      background: "white",
      switchColor: "grey6",
    },
  },
};

export default ausTheme;
