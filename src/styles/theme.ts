import { DefaultTheme, ThemedStyledProps } from "styled-components";
import { z } from "zod";

const OakColor = z.union([
  z.literal("white"),
  z.literal("black"),
  z.literal("transparent"),
  z.literal("inherit"),
  z.literal("grey1"),
  z.literal("grey2"),
  z.literal("grey3"),
  z.literal("grey4"),
  z.literal("grey5"),
  z.literal("grey6"),
  z.literal("grey7"),
  z.literal("grey8"),
  z.literal("grey9"),
  z.literal("grey10"),
  z.literal("inYourFace"),
  z.literal("calmAndWarm"),
  z.literal("niceAndSharp"),
  z.literal("deeperWins"),
]);

export type OakColorName = z.infer<typeof OakColor>;
export type OakFontName = "body" | "ui" | "heading";
/**
 * ColorValue could be hex, rgb, rgba, hsla, e.g. "#414243"
 */
type ColorValue = string;
/**
 * FontValue should be a font name with fallback(s), e.g. "Lexend, sans-serif"
 */
type FontValue = string;

type BadgeConfig = {
  size: string;
  circleSize: string;
  fontSize: string;
  // px currently in fitting with Icon api
  iconSize: number;
  starColor: OakColorName;
  circleColor: OakColorName;
  textColor: OakColorName;
};
type ButtonConfig = {
  disabled: {
    background: OakColorName;
    text: OakColorName;
  };
  primary: {
    background: OakColorName;
    text: OakColorName;
  };
  secondary: {
    background: OakColorName;
    text: OakColorName;
  };
  tertiary: {
    background: OakColorName;
    text: OakColorName;
  };
};
type InputConfig = {
  height: string;
  borderRadius: string;
  borderWidth: string;
  states: {
    default: InputStateConfig;
    active: InputStateConfig;
    valid: InputStateConfig;
    invalid: InputStateConfig;
    disabled: InputStateConfig;
  };
};

type InputStateConfig = {
  text: OakColorName;
  placeholder: OakColorName;
  icon: OakColorName;
  border: OakColorName;
};

export type OakTheme = {
  colors: Record<OakColorName, ColorValue>;
  contrastColors: Record<OakColorName, OakColorName>;
  fonts: Record<OakFontName, FontValue>;
  input: InputConfig;
  bigInput: InputConfig;
  button: ButtonConfig;
  badge: BadgeConfig;
};

export const theme: OakTheme = {
  colors: {
    white: "white",
    black: "black",
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

export type PropsWithTheme<Props = unknown> = ThemedStyledProps<
  Props,
  DefaultTheme
>;

export default theme;
