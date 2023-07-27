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
    // used throughout
    oakGrey1: "#f5f5f5",
    oakGrey2: "#dadada",
    oakGrey3: "#878787",
    oakGrey4: "#575756",
    oakGrey5: "#2D2D2D",
    oakGrey6: "#1B1B1B",
    pastelTurquoise: "#b0e2de", // TODO: add tints
    // feedback colors
    warning: "#ff7234",
    failure: "#e51d4d",
    success: "#a3e420",
    // pupil colours
    pupilsHighlight: "#25AB38",
    pupilsAccentPink: "#d02aa7",
    pupilsGreen: "#85cb6d", // TODO: add tints
    pupilsLightGreen: "#D5EFD4",
    pupilsLimeGreen: "#BEF2BD",
    pupilsPink: "#deb7d5", // TODO: add tints
    // teacher colours
    teachersHighlight: "#374CF1",
    teachersGreen: "#037b7d",
    teachersYellow: "#ffe555",
    teachersPastelYellow: "#f6e8a0",
    teachersPastelBlue: "#a0b6f2",
    teachersRed: "#e51d4d",
    teachersPurple: "#845ad9",
    teachersLilac: "#c6d1ef",
    twilight: "#E5D1E0",
    videoBlue: "#CEE7E5",
    // hyperlinks
    hyperlink: "#0D24C4",
    // new design kit colours
    oakGreen: "#25ab38",
    mint: "#bef2bd",
    mint50: "#d5efd4",
    mint30: "#ebfbeb",
    aqua: "#b0e2de",
    aqua50: "#cee7e5",
    aqua30: "#e7f6f5",
    lemon: "#ff3555",
    lemon50: "#f6e8ao",
    lemon30: "#fff7cc",
    lavender: "#a0b6f2",
    lavender50: "#c6d1ef",
    lavender30: "#e3e9fb",
    pink: "#deb7d5",
    pink50: "#e5d1e0",
    pink30: "#f5e9f2",
    amber: "#ff934e",
    amber50: "#ffc8a6",
    amber30: "#ffdfca",
    blue: "#374cf1",
    magenta: "#d02aa7",
    purple: "#845ad9",
    teal: "#037b7d",
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
    // used throughout
    oakGrey1: "black",
    oakGrey2: "black",
    oakGrey3: "white",
    oakGrey4: "white",
    oakGrey5: "white",
    oakGrey6: "white",
    pastelTurquoise: "black", // TODO: add tints
    // feedback colors
    warning: "black",
    failure: "white",
    success: "black",
    // pupil colours
    pupilsHighlight: "white",
    pupilsAccentPink: "white",
    pupilsGreen: "black", // TODO: add tints
    pupilsLightGreen: "black",
    pupilsLimeGreen: "black",
    pupilsPink: "black", // TODO: add tints
    // teacher colours
    teachersHighlight: "white",
    teachersGreen: "white",
    teachersYellow: "black",
    teachersPastelYellow: "black",
    teachersPastelBlue: "black",
    teachersRed: "black",
    teachersPurple: "white",
    teachersLilac: "black",
    twilight: "black",
    videoBlue: "black",
    hyperlink: "white",
    // new design kit colours
    oakGreen: "white",
    mint: "black",
    mint50: "black",
    mint30: "black",
    aqua: "black",
    aqua50: "black",
    aqua30: "black",
    lemon: "black",
    lemon50: "black",
    lemon30: "black",
    lavender: "black",
    lavender50: "black",
    lavender30: "black",
    pink: "black",
    pink50: "black",
    pink30: "black",
    amber: "black",
    amber50: "black",
    amber30: "black",
    blue: "white",
    magenta: "white",
    purple: "white",
    teal: "white",
  },
  buttonIconBackgroundColors: {
    teachersHighlight: "teachersYellow",
    pupilsHighlight: "white",
    black: "white",
  },
  buttonDropShadows: {
    teachersHighlight: "5px 3px 16px 0px #2332a3",
    pupilsHighlight: "8px 5px 13px 1px #0b4413",
  },
  buttonFocusUnderlineColors: {
    teachersHighlight: "teachersYellow",
    pupilsHighlight: "pupilsAccentPink",
    black: "teachersYellow",
  },
  fonts: {
    // Paragraphs etc.
    body: "Lexend, sans-serif",
    // Buttons etc.
    ui: "Lexend, sans-serif",
    // Headings etc.
    heading: "Lexend, sans-serif",
    headingLight: "Lexend, sans-serif",
  },
  input: {
    height: "40px",
    fontSize: "16px",
    borderRadius: "8px",
    borderWidth: "1px",
    states: {
      default: {
        text: "black",
        placeholder: "oakGrey4",
        icon: "oakGrey4",
        border: "grey8",
        background: "white",
      },
      active: {
        text: "black",
        placeholder: "oakGrey4",
        icon: "oakGrey4",
        border: "grey8",
        background: "white",
      },
      valid: {
        text: "black",
        placeholder: "oakGrey4",
        icon: "grey8",
        border: "grey8",
        background: "white",
      },
      invalid: {
        text: "black",
        placeholder: "oakGrey4",
        icon: "oakGrey4",
        border: "grey8",
        background: "grey5",
      },
      disabled: {
        text: "black",
        placeholder: "oakGrey4",
        icon: "oakGrey4",
        border: "grey8",
        background: "grey5",
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
    minimal: {
      background: "transparent",
      text: "black",
    },
  },
  menu: {
    background: "twilight",
    width: 720,
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
  header: {
    height: 72,
    background: "pupilsLightGreen",
    color: "black",
  },
  checkbox: {
    default: {
      color: "black",
    },
    disabled: {
      color: "grey4",
    },
  },
  selectListBox: {
    states: {
      default: {
        background: "white",
        color: "oakGrey4",
      },
      isFocused: {
        background: "white",
        color: "grey4",
        weight: 700,
      },
      isFocusedSelected: {
        color: "grey4",
      },
      isFocusedNotSelected: {
        color: "grey4",
      },
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
  video: {
    controls: {
      primary: "teachersHighlight",
      secondary: "pupilsHighlight",
      tertiary: "white",
    },
  },
};

export default theme;
