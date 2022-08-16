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
    pastelTurqoise: "#b0e2de", // TODO: add tints
    // feedback colors
    warning: "#ff7234",
    failure: "#ff2f20",
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
    pastelTurqoise: "black", // TODO: add tints
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
    body: "ABeeZee, sans-serif",
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
        placeholder: "grey7",
        icon: "grey7",
        border: "grey8",
        background: "white",
      },
      active: {
        text: "black",
        placeholder: "grey7",
        icon: "grey7",
        border: "grey8",
        background: "grey3",
      },
      valid: {
        text: "black",
        placeholder: "grey7",
        icon: "grey8",
        border: "grey8",
        background: "white",
      },
      invalid: {
        text: "black",
        placeholder: "grey7",
        icon: "grey7",
        border: "grey8",
        background: "grey5",
      },
      disabled: {
        text: "black",
        placeholder: "grey7",
        icon: "grey7",
        border: "grey8",
        background: "grey5",
      },
    },
  },
  bigInput: {
    height: "40px",
    fontSize: "16px",
    borderRadius: "20px",
    borderWidth: "0",
    states: {
      default: {
        text: "black",
        placeholder: "grey7",
        icon: "grey7",
        border: "grey8",
        background: "white",
      },
      active: {
        text: "black",
        placeholder: "grey7",
        icon: "grey7",
        border: "grey8",
        background: "white",
      },
      valid: {
        text: "black",
        placeholder: "grey7",
        icon: "grey7",
        border: "grey8",
        background: "white",
      },
      invalid: {
        text: "black",
        placeholder: "grey7",
        icon: "grey7",
        border: "grey8",
        background: "white",
      },
      disabled: {
        text: "black",
        placeholder: "grey7",
        icon: "grey7",
        border: "grey8",
        background: "white",
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
    background: "pupilsPink",
    color: "black",
    width: "40vw",
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
  lessonControl: {
    default: {
      background: "white",
      border: "2px solid",
      borderColor: "transparent",
    },
    current: {
      background: "grey3",
      border: "2px dashed",
      borderColor: "black",
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
  selectListBox: {
    states: {
      default: {
        background: "white",
      },
      isFocused: {
        background: "grey8",
        color: "white",
      },
      isFocusedSelected: {
        color: "grey10",
      },
      isFocusedNotSelected: {
        color: "black",
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
