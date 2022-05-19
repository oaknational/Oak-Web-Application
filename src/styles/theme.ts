import { DefaultTheme, ThemedStyledProps } from "styled-components";

const theme = {
  // colors is list of all colors, with it's default contrast color
  colors: {
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

  // palette are colors named by where they are used
  palette: {
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
    body: "Open Sans, Helvetica, Arial, sans-serif",
    ui: "Montserrat, Helvetica, Arial, sans-serif",
    title: "Montserrat, Helvetica, Arial, sans-serif",
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
