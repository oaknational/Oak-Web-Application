import { ThemedStyledProps, DefaultTheme } from "styled-components";
import { z } from "zod";

import { BadgeConfig } from "../../components/Badge";
import { CheckboxConfig } from "../../components/Checkbox";
import { LessonControlConfig } from "../../components/LessonControl";

/**
 * @todo parse theme with zod
 */
const OakColorNameZod = z.union([
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

export type OakColorName = z.infer<typeof OakColorNameZod>;
export type OakFontName = "body" | "ui" | "heading";
/**
 * ColorValue could be hex, rgb, rgba, hsla, e.g. "#414243"
 */
type ColorValue = string;
/**
 * FontValue should be a font name with fallback(s), e.g. "Lexend, sans-serif"
 */
type FontValue = string;

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
  name: string;
  colors: Record<OakColorName, ColorValue>;
  contrastColors: Record<OakColorName, OakColorName>;
  fonts: Record<OakFontName, FontValue>;
  input: InputConfig;
  bigInput: InputConfig;
  button: ButtonConfig;
  badge: BadgeConfig;
  lessonControl: LessonControlConfig;
  checkbox: CheckboxConfig;
};

export type PropsWithTheme<Props = unknown> = ThemedStyledProps<
  Props,
  DefaultTheme
>;
