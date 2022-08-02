import { ThemedStyledProps, DefaultTheme } from "styled-components";
import { z } from "zod";

import { BadgeConfig } from "../../components/Badge";
import { CheckboxConfig } from "../../components/Checkbox";
import { SelectListBoxConfig } from "../../components/DropdownSelect/ListBox";
import { HeaderConfig } from "../../components/FixedHeader/FixedHeader";
import { LessonControlConfig } from "../../components/LessonControl";
import { ToggleStyleConfig } from "../../components/Toggle/Toggle";

export type PixelSpacing =
  | 0
  | 4
  | 8
  | 12
  | 16
  | 20
  | 24
  | 32
  | 40
  | 48
  | 56
  | 64
  | 72
  | 80
  | 96
  | 120
  | 200
  | 1200;

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
  z.literal("oakGrey1"),
  z.literal("oakGrey2"),
  z.literal("oakGrey3"),
  z.literal("pastelTurqoise"),
  z.literal("warning"),
  z.literal("failure"),
  z.literal("success"),
  z.literal("pupilsAccentGreen"),
  z.literal("pupilsAccentPink"),
  z.literal("pupilsGreen"),
  z.literal("pupilsLightGreen"),
  z.literal("pupilsLimeGreen"),
  z.literal("pupilsPink"),
  z.literal("teachersAccentBlue"),
  z.literal("teachersGreen"),
  z.literal("teachersYellow"),
  z.literal("teachersPastelYellow"),
  z.literal("teachersPastelBlue"),
  z.literal("teachersRed"),
  z.literal("teachersPurple"),
  z.literal("teachersLilac"),
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
  minimal: {
    background: OakColorName;
    text: OakColorName;
  };
};
type InputConfig = {
  height: string;
  borderRadius: string;
  borderWidth: string;
  fontSize: string;
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
  background: OakColorName;
};

export type OakTheme = {
  header: HeaderConfig;
  name: string;
  colors: Record<OakColorName, ColorValue>;
  contrastColors: Record<OakColorName, OakColorName>;
  buttonIconBackgroundColors: Partial<Record<OakColorName, OakColorName>>;
  fonts: Record<OakFontName, FontValue>;
  input: InputConfig;
  bigInput: InputConfig;
  button: ButtonConfig;
  badge: BadgeConfig;
  lessonControl: LessonControlConfig;
  checkbox: CheckboxConfig;
  selectListBox: SelectListBoxConfig;
  toggle: ToggleStyleConfig;
};

export type PropsWithTheme<Props = unknown> = ThemedStyledProps<
  Props,
  DefaultTheme
>;
