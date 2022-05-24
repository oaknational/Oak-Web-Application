import { DefaultTheme, ThemedStyledProps } from "styled-components";

const theme = {
  // colors is list of all colors, with it's default contrast color
  colors: {
    white: {
      color: "#fff",
      contrastText: "#000",
      contrastBackground: "#000",
    },
    black: {
      color: "#000",
      contrastText: "#fff",
      contrastBackground: "#fff",
    },
    grey1: {
      color: "#f2f2f2",
      contrastText: "#000",
      contrastBackground: "#000",
    },
    grey2: {
      color: "#e6e6e6",
      contrastText: "#000",
      contrastBackground: "#000",
    },
    grey3: {
      color: "#ccc",
      contrastText: "#000",
      contrastBackground: "#000",
    },
    grey4: {
      color: "#b3b3b3",
      contrastText: "#000",
      contrastBackground: "#000",
    },
    grey5: {
      color: "#999",
      contrastText: "#000",
      contrastBackground: "#000",
    },
    grey6: {
      color: "#808080",
      contrastText: "#fff",
      contrastBackground: "#fff",
    },
    grey7: {
      color: "#666",
      contrastText: "#fff",
      contrastBackground: "#fff",
    },
    grey8: {
      color: "#4d4d4d",
      contrastText: "#fff",
      contrastBackground: "#fff",
    },
    grey9: {
      color: "#333",
      contrastText: "#fff",
      contrastBackground: "#fff",
    },
    grey10: {
      color: "#1a1a1a",
      contrastText: "#fff",
      contrastBackground: "#fff",
    },
    inYourFace: {
      color: "#ef476f",
      contrastText: "#fff",
      contrastBackground: "#fff",
    },
    calmAndWarm: {
      color: "#ffd166",
      contrastText: "#303030",
      contrastBackground: "#303030",
    },
    niceAndSharp: {
      color: "#06d6a0",
      contrastText: "#404040",
      contrastBackground: "#404040",
    },
    deeperWins: {
      color: "#073b4c",
      contrastText: "#fff",
      contrastBackground: "#fff",
    },
  },
  input: {
    height: "40px",
    borderRadius: "8px",
    borderWidth: "1px",
  },
  bigInput: {
    height: "40px",
    borderRadius: "20px",
    borderWidth: "0",
  },
  // palette are colors named by where they are used
  palette: {
    input: {
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
    bigInput: {
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
    button: {
      primary: {
        background: "#ef476f",
        text: "",
      },
      secondary: {
        background: "",
        text: "",
      },
      tertiary: {
        background: "",
        text: "",
      },
    },
    heading: {},
    body: {},
    text: {},
    background: {},
  },
  fonts: {
    // Paragraphs etc.
    body: "ABeeZee, sans-serif",
    // Buttons etc.
    ui: "Lexend, sans-serif",
    // Headings etc.
    heading: "Lexend, sans-serif",
  },
  breakpoints: {
    small: 550,
    medium: 900,
  },
};
export type OakTheme = typeof theme;
export type OakFontName = keyof OakTheme["fonts"];
export type OakBreakpointName = keyof OakTheme["breakpoints"];
export type OakColorName = keyof OakTheme["colors"];
export type OakPaletteName = keyof OakTheme["palette"];
export type OakPaletteOrColorName = OakPaletteName | OakColorName;
export type PropsWithTheme<Props = unknown> = ThemedStyledProps<
  Props,
  DefaultTheme
>;

export default theme;
