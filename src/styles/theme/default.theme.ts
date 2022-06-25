import { OakTheme } from "./types";

const theme: OakTheme = {
  name: "default",
  colors: {
    white: "#fff",
    black: "#000",
    transparent: "transparent",
    inherit: "inherit",
    grey1: "#f2f2f2",
    grey2: "#e6e6e6",
    grey3: "#ccc",
    grey4: "#b3b3b3",
    grey5: "#999",
    grey6: "#808080",
    grey7: "#666",
    grey8: "#4d4d4d",
    grey9: "#333",
    grey10: "#1a1a1a",
    inYourFace: "#ef476f",
    calmAndWarm: "#ffd166",
    niceAndSharp: "#06d6a0",
    deeperWins: "#073b4c",
    limeade: "#32be00",
    madangGreen: "#bef2bd",
    mustard: "#ffe555",
    peranoBlue: "#a0b6f2",
    powderBlue: "#b0e2de",
    melaniePink: "#deb7d5",
    error: "red",
  },
  contrastColors: {
    white: "black",
    black: "white",
    transparent: "inherit",
    inherit: "inherit",
    grey1: "black",
    grey2: "black",
    grey3: "black",
    grey4: "black",
    grey5: "black",
    grey6: "white",
    grey7: "white",
    grey8: "white",
    grey9: "white",
    grey10: "white",
    inYourFace: "white",
    calmAndWarm: "grey9",
    niceAndSharp: "grey8",
    deeperWins: "white",
    limeade: "black",
    madangGreen: "black",
    mustard: "black",
    peranoBlue: "black",
    powderBlue: "black",
    melaniePink: "black",
    error: "white",
  },
  fonts: {
    // Paragraphs etc.
    body: "ABeeZee, sans-serif",
    // Buttons etc.
    ui: "Lexend, sans-serif",
    // Headings etc.
    heading: "Lexend, sans-serif",
  },
  input: {
    height: "40px",
    borderRadius: "8px",
    borderWidth: "1px",
    states: {
      default: {
        text: "black",
        placeholder: "grey6",
        icon: "grey6",
        border: "grey6",
      },
      active: {
        text: "black",
        placeholder: "grey6",
        icon: "grey6",
        border: "grey8",
      },
      valid: {
        text: "black",
        placeholder: "grey6",
        icon: "grey8",
        border: "grey8",
      },
      invalid: {
        text: "black",
        placeholder: "grey6",
        icon: "grey6",
        border: "grey8",
      },
      disabled: {
        text: "black",
        placeholder: "grey6",
        icon: "grey6",
        border: "grey8",
      },
    },
  },
  bigInput: {
    height: "40px",
    borderRadius: "20px",
    borderWidth: "0",
    states: {
      default: {
        text: "black",
        placeholder: "grey6",
        icon: "grey6",
        border: "grey8",
      },
      active: {
        text: "black",
        placeholder: "grey6",
        icon: "grey6",
        border: "grey8",
      },
      valid: {
        text: "black",
        placeholder: "grey6",
        icon: "grey6",
        border: "grey8",
      },
      invalid: {
        text: "black",
        placeholder: "grey6",
        icon: "grey6",
        border: "grey8",
      },
      disabled: {
        text: "black",
        placeholder: "grey6",
        icon: "grey6",
        border: "grey8",
      },
    },
  },
  button: {
    disabled: {
      background: "grey6",
      text: "white",
    },
    primary: {
      background: "black",
      text: "white",
    },
    secondary: {
      background: "grey9",
      text: "white",
    },
    tertiary: {
      background: "grey3",
      text: "black",
    },
  },
  badge: {
    size: "54px",
    circleSize: "48px",
    fontSize: "16px",
    iconSize: 20,
    starColor: "grey6",
    circleColor: "grey8",
    textColor: "white",
  },
  lessonControl: {
    default: {
      background: "white",
      border: "2px solid",
      borderColor: "transparent",
    },
    current: {
      background: "grey3",
      border: "2px dashed",
      borderColor: "niceAndSharp",
    },
    complete: {
      background: "grey7",
      border: "2px solid",
      borderColor: "transparent",
    },
  },
  checkbox: {
    default: {
      color: "black",
    },
    disabled: {
      color: "grey4",
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

export default theme;
