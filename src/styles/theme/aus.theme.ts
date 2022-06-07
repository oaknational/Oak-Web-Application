import { OakTheme } from ".";

const ausTheme: OakTheme = {
  name: "aus",
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
    inYourFace: "#ef996f",
    calmAndWarm: "#ffa966",
    niceAndSharp: "#060ea0",
    deeperWins: "#07b04c",
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
      background: "grey7",
      text: "white",
    },
    primary: {
      background: "inYourFace",
      text: "white",
    },
    secondary: {
      background: "transparent",
      text: "inherit",
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
};

export default ausTheme;
