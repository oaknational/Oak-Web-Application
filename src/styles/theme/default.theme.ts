import { Lexend } from "next/font/google";

import { OakTheme } from "./types";

const lexend = Lexend({ subsets: ["latin"] });

const theme: OakTheme = {
  name: "default",
  colors: {
    white: "#fff",
    black: "#222222",
    transparent: "transparent",
    inherit: "inherit",
    // new design kit colours
    oakGreen: "#287C34",
    mint: "#bef2bd",
    mint30: "#ebfbeb",
    mint50: "#dff9de",
    aqua: "#b0e2de",
    aqua50: "#cee7e5",
    aqua30: "#e7f6f5",
    lemon: "#ffe555",
    lemon30: "#fff7cc",
    lemon50: "#f6e8a0",
    lavender: "#a0b6f2",
    lavender50: "#c6d1ef",
    lavender30: "#e3e9fb",
    lavender60: "#8FA6E4",
    pink: "#deb7d5",
    pink50: "#e5d1e0",
    pink30: "#f5e9f2",
    pink60: "#cF9cc3",
    amber: "#ff934e",
    amber50: "#ffc8a6",
    amber30: "#ffdfca",
    blue: "#374cf1",
    magenta: "#d02aa7",
    purple: "#845ad9",
    teal: "#037b7d",
    red: "#dd0035",
    grey10: "#F9F9F9",
    grey20: "#F2F2F2",
    grey30: "#E4E4E4",
    grey40: "#CACACA",
    grey50: "#808080",
    grey60: "#575757",
    grey70: "#2d2d2d",
    grey80: "#1a1a1a",
    navy: "#0D24C4",
    navy110: "#0a1d9d",
    navy120: "#081676",
  },
  contrastColors: {
    white: "black",
    black: "white",
    transparent: "inherit",
    inherit: "inherit",
    // new design kit colours
    oakGreen: "white",
    mint: "black",
    mint50: "black",
    mint30: "black",
    aqua: "black",
    aqua30: "black",
    aqua50: "black",
    lemon: "black",
    lemon50: "black",
    lemon30: "black",
    lavender: "black",
    lavender50: "black",
    lavender30: "black",
    lavender60: "black",
    pink: "black",
    pink30: "black",
    pink50: "black",
    pink60: "black",
    amber: "black",
    amber30: "black",
    amber50: "black",
    blue: "white",
    magenta: "white",
    purple: "white",
    teal: "white",
    red: "white",
    grey10: "black",
    grey20: "black",
    grey30: "black",
    grey40: "black",
    grey50: "white",
    grey60: "white",
    grey70: "white",
    grey80: "white",
    navy: "white",
    navy110: "white",
    navy120: "white",
  },
  buttonIconBackgroundColors: {
    lemon: "black",
    oakGreen: "white",
    black: "white",
  },
  buttonDropShadows: {
    blue: "5px 3px 16px 0px #2332a3",
    oakGreen: "8px 5px 13px 1px #0b4413",
  },
  buttonFocusUnderlineColors: {
    blue: "lemon",
    oakGreen: "magenta",
    black: "lemon",
  },
  fonts: {
    // Paragraphs etc.
    body: lexend.style.fontFamily,
    // Buttons etc.
    ui: lexend.style.fontFamily,
    // Headings etc.
    heading: lexend.style.fontFamily,
    headingLight: lexend.style.fontFamily,
  },
  input: {
    height: "60px",
    fontSize: "16px",
    borderRadius: "8px",
    borderWidth: "1px",
    states: {
      default: {
        text: "black",
        placeholder: "grey60",
        icon: "grey60",
        border: "grey70",
        background: "white",
      },
      active: {
        text: "black",
        placeholder: "grey60",
        icon: "grey60",
        border: "grey70",
        background: "white",
      },
      valid: {
        text: "black",
        placeholder: "grey60",
        icon: "grey70",
        border: "grey70",
        background: "white",
      },
      invalid: {
        text: "black",
        placeholder: "grey60",
        icon: "grey60",
        border: "grey70",
        background: "grey40",
      },
      disabled: {
        text: "black",
        placeholder: "grey60",
        icon: "grey60",
        border: "grey70",
        background: "grey40",
      },
    },
  },
  button: {
    disabled: {
      background: "grey50",
      text: "white",
    },
    primary: {
      background: "black",
      text: "white",
    },
    secondary: {
      background: "grey70",
      text: "white",
    },
    tertiary: {
      background: "grey40",
      text: "black",
    },
    minimal: {
      background: "transparent",
      text: "black",
    },
  },
  header: {
    height: "all-spacing-12",
    background: "mint50",
    color: "black",
  },
  checkbox: {
    default: {
      color: "black",
    },
    disabled: {
      color: "grey40",
    },
  },
  selectListBox: {
    states: {
      default: {
        background: "white",
        color: "grey60",
      },
      isFocused: {
        background: "white",
        color: "grey40",
        weight: 700,
      },
      isFocusedSelected: {
        color: "grey40",
      },
      isFocusedNotSelected: {
        color: "grey40",
      },
    },
  },
  toggle: {
    on: {
      labelColor: "grey10",
      background: "white",
      switchColor: "grey70",
    },
    off: {
      labelColor: "grey70",
      background: "white",
      switchColor: "grey70",
    },
    disabled: {
      labelColor: "grey40",
      background: "white",
      switchColor: "grey50",
    },
  },
  video: {
    controls: {
      primary: "blue",
      secondary: "oakGreen",
      tertiary: "white",
    },
  },
};

export default theme;
