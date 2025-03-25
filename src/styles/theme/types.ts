import { NextFont } from "next/dist/compiled/@next/font/dist/types";
import { z } from "zod";

import { MenuConfig } from "@/components/AppComponents/AppHeaderMenu";
import { HeaderConfig } from "@/components/AppComponents/StyledHeader/StyledHeader";
import { BadgeConfig } from "@/components/GenericPagesComponents/CurriculumTabBadge";
import { CheckboxConfig } from "@/components/SharedComponents/Checkbox";
import { SelectListBoxConfig } from "@/components/SharedComponents/ListBox/ListBox";
import { VideoStyleConfig } from "@/components/SharedComponents/VideoPlayer/VideoPlayer";
import { ResponsiveValues } from "../utils/responsive";

const sizePropertyStringValues = [
  "auto",
  "none",
  "max-content",
  "min-content",
  "fit-content",
] as const;
export type SizePropertyString = (typeof sizePropertyStringValues)[number];
export function isSizePropertyString(
  value: unknown,
): value is SizePropertyString {
  if (typeof value === "string") {
    const allowedValues: readonly string[] = sizePropertyStringValues;
    return allowedValues.includes(value);
  }
  return false;
}

/**
 * Adds a finite list of pixel values which we're allowed to use throughout the
 * app's styles.
 * Keeping this list finite and explicit means that that (1) consistency is
 * encouraged and (2) if we want to migrate our styles to a static css solution
 * e.g. Vanilla Extract, then we can (otherwise we rely on runtime css to
 * generate classes for adhoc pixel values).
 * @todo use negative number type
 * @see https://stackoverflow.com/questions/21224922/is-there-a-way-to-represent-a-non-negative-integer-in-typescript-so-that-the-com
 */
const pixelSpacingValues = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32,
  34, 36, 40, 44, 46, 48, 50, 52, 56, 58, 60, 64, 66, 72, 80, 92, 96, 110, 120,
  130, 140, 150, 160, 166, 172, 180, 195, 200, 220, 240, 270, 300, 320, 340,
  350, 360, 380, 400, 420, 450, 480, 510, 524, 580, 600, 640, 720, 734, 740,
  812, 840, 870, 900, 960, 1280, 1600, 3200, 9600,
] as const;
export type PixelSpacing = (typeof pixelSpacingValues)[number];
export function isPixelSpacing(value: unknown): value is PixelSpacing {
  if (typeof value === "number") {
    const allowedValues: readonly number[] = pixelSpacingValues;
    return allowedValues.includes(value);
  }
  return false;
}

const nullablePixelSpacingValues = [...pixelSpacingValues, null] as const;
export type NullablePixelSpacing = (typeof nullablePixelSpacingValues)[number];
export function isNullablePixelSpacing(
  value: unknown,
): value is NullablePixelSpacing {
  if (value === null) {
    return true;
  }
  if (typeof value === "number") {
    const allowedValues: readonly number[] = pixelSpacingValues;
    return isPixelSpacing(value);
  }
  return false;
}

const negativePixelSpacingValues = [
  -72, -54, -36, -32, -28, -24, -20, -16, -12, -8, -4, -2,
] as const;
export type NegativePixelSpacing = (typeof negativePixelSpacingValues)[number];
export function isNegativePixelSpacing(
  value: unknown,
): value is NegativePixelSpacing {
  if (typeof value === "number") {
    const allowedValues: readonly number[] = negativePixelSpacingValues;
    return allowedValues.includes(value);
  }
  return false;
}

const percentSpacingValues = [
  "100%",
  "99%",
  "95%",
  "90%",
  "85%",
  "80%",
  "70%",
  "65%",
  "60%",
  "55%",
  "50%",
  "40%",
  "30%",
  "33%",
  "25%",
  "20%",
  "15%",
  "10%",
  "5%",
  // vw units sometimes needed to fix edge cases
  "28vw",
] as const;
export type PercentSpacing = (typeof percentSpacingValues)[number];
export function isPercentSpacing(value: unknown): value is PercentSpacing {
  if (typeof value === "string") {
    const allowedValues: readonly string[] = percentSpacingValues;
    return allowedValues.includes(value);
  }
  return false;
}

const calcValues = percentSpacingValues.flatMap((percentSpacing) => {
  return nullablePixelSpacingValues.map((nullablePixelSpacing) => {
    return `calc(${percentSpacing} - ${nullablePixelSpacing}px)` as const;
  });
});
export type CalcValues = (typeof calcValues)[number];
export function isCalcValues(value: unknown): value is CalcValues {
  if (typeof value === "string") {
    const allowedValues: readonly string[] = calcValues;
    return allowedValues.includes(value);
  }
  return false;
}

export type SizeValue =
  | SizePropertyString
  | PercentSpacing
  | NullablePixelSpacing
  | CalcValues;
export function isSizeValue(value: unknown): value is SizeValue {
  if (isSizePropertyString(value)) {
    return true;
  }
  if (isPercentSpacing(value)) {
    return true;
  }
  if (isNullablePixelSpacing(value)) {
    return true;
  }
  if (isCalcValues(value)) {
    return true;
  }
  console.warn(`Invalid size value: ${value}`);
  return false;
}
export type SizeValues = ResponsiveValues<SizeValue>;
export function isSizeValues(value: unknown): value is SizeValues {
  if (isSizeValue(value)) {
    return true;
  }
  if (Array.isArray(value)) {
    return value.every(isSizeValue);
  }
  return false;
}

export type Unset = "unset";

/**
 * @todo parse theme with zod
 */
export const OakColorNameZod = z.union([
  z.literal("white"),
  z.literal("black"),
  z.literal("transparent"),
  z.literal("inherit"),
  z.literal("oakGreen"),
  z.literal("mint"),
  z.literal("mint50"),
  z.literal("mint30"),
  z.literal("aqua"),
  z.literal("aqua50"),
  z.literal("aqua30"),
  z.literal("lemon"),
  z.literal("lemon50"),
  z.literal("lemon30"),
  z.literal("lavender"),
  z.literal("lavender50"),
  z.literal("lavender30"),
  z.literal("lavender60"),
  z.literal("pink"),
  z.literal("pink50"),
  z.literal("pink30"),
  z.literal("pink60"),
  z.literal("amber"),
  z.literal("amber50"),
  z.literal("amber30"),
  z.literal("blue"),
  z.literal("magenta"),
  z.literal("purple"),
  z.literal("teal"),
  z.literal("red"),
  z.literal("grey10"),
  z.literal("grey20"),
  z.literal("grey30"),
  z.literal("grey40"),
  z.literal("grey50"),
  z.literal("grey60"),
  z.literal("grey70"),
  z.literal("grey80"),
  z.literal("navy"),
  z.literal("navy110"),
  z.literal("navy120"),
]);

export type OakColorName = z.infer<typeof OakColorNameZod>;
export type OakFontName = "body" | "ui" | "heading" | "headingLight";
/**
 * ColorValue could be hex, rgb, rgba, hsla, e.g. "#414243"
 */
export type ColorValue = string;
/**
 * FontValue should be a font name with fallback(s), e.g. "Lexend, sans-serif"
 */
export type FontValue = NextFont | string;

/**
 * ShadowValue represents a CSS box-shadow value, e.g. "5px 3px 16px 0px #2332a3"
 */
export type ShadowValue =
  | `${number}px ${number}px ${number}px ${number}px ${string}`
  | `${number}px ${number}px ${number}px ${string}`;

// Convert type definitions to interfaces to comply with ESLint rules
export interface ButtonConfig {
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
}

export interface InputConfig {
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
}

export interface InputStateConfig {
  text: OakColorName;
  placeholder: OakColorName;
  icon: OakColorName;
  border: OakColorName;
  background: OakColorName;
}

export interface ToggleStyleConfig {
  on: {
    labelColor: OakColorName;
    background: OakColorName;
    switchColor: OakColorName;
  };
  off: {
    labelColor: OakColorName;
    background: OakColorName;
    switchColor: OakColorName;
  };
  disabled: {
    labelColor: OakColorName;
    background: OakColorName;
    switchColor: OakColorName;
  };
}

// This should be defined as interface to be exported
export interface OakTheme {
  name: string;
  colors: Record<OakColorName, ColorValue>;
  contrastColors: Partial<Record<OakColorName, OakColorName>>;
  buttonIconBackgroundColors: Partial<Record<OakColorName, OakColorName>>;
  buttonDropShadows: Partial<Record<OakColorName, OakColorName | ShadowValue>>;
  buttonFocusUnderlineColors: Partial<Record<OakColorName, OakColorName>>;
  fonts: {
    body: FontValue;
    ui: FontValue;
    heading: FontValue;
    headingLight: FontValue;
    bold?: string;
    headingBold?: string;
  };

  buttons: ButtonConfig;
  input: InputConfig;
  toggle: ToggleStyleConfig;
  checkbox: CheckboxConfig;
  listBox: SelectListBoxConfig;
  headerMenu: MenuConfig;
  videoPlayer: VideoStyleConfig;
  header: HeaderConfig;
  badge: BadgeConfig;
  menu?: {
    background: OakColorName;
    width: SizeValue;
  };
  selectListBox?: {
    states: {
      default: {
        background: OakColorName;
        color: OakColorName;
      };
      isFocused: {
        background: OakColorName;
        color: OakColorName;
        weight?: number;
      };
      isFocusedSelected: {
        color: OakColorName;
      };
      isFocusedNotSelected: {
        color: OakColorName;
      };
    };
  };
  video?: {
    controls: {
      primary: OakColorName;
      secondary: OakColorName;
      tertiary: OakColorName;
    };
  };
}

export interface PropsWithTheme {
  theme: OakTheme;
}
