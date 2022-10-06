import {
  DetailedHTMLProps,
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
} from "react";

import { OakColorName } from "../../styles/theme";
import { PixelSpacing, PropsWithTheme } from "../../styles/theme/types";
import getColorByName from "../../styles/themeHelpers/getColorByName";
import getTextColorForBackground from "../../styles/themeHelpers/getTextColorForBackground";
import { OpacityProps } from "../../styles/utils/opacity";
import { MarginProps } from "../../styles/utils/spacing";
import { IconName } from "../Icon";

export type ButtonVariant = "brush" | "minimal";
export type ButtonBackground = OakColorName;
export type IconPosition = "leading" | "trailing";
export type ButtonSize = "small" | "large" | "tiny" | "header";
/**
 * @todo move to theme
 */
const SMALL_BUTTON_ICON_SIZE = 28;
const SMALL_BUTTON_HEIGHT = 40;
const SMALL_BUTTON_PADDING_X = 8;

const LARGE_BUTTON_ICON_SIZE = 36;
const LARGE_BUTTON_HEIGHT = 48;
const LARGE_BUTTON_PADDING_X = 8;

const TINY_BUTTON_ICON_SIZE = 16;
const TINY_BUTTON_HEIGHT = 16;
const TINY_BUTTON_PADDING_X = 12;

// we're gonna need a lot more variants so starting semantic naming
const HEADER_BUTTON_ICON_SIZE = 28;
const HEADER_BUTTON_HEIGHT = 30;
const HEADER_BUTTON_PADDING_X = 8;

export const buttonFlexDirectionMap: Record<
  IconPosition,
  "row" | "row-reverse"
> = {
  leading: "row",
  trailing: "row-reverse",
};
export const getButtonFlexDirection = (iconPosition: IconPosition) =>
  buttonFlexDirectionMap[iconPosition];
export const buttonSizeHeightMap: Record<ButtonSize, PixelSpacing> = {
  tiny: TINY_BUTTON_HEIGHT,
  small: SMALL_BUTTON_HEIGHT,
  large: LARGE_BUTTON_HEIGHT,
  header: HEADER_BUTTON_HEIGHT,
};
export const getButtonHeight = (size: ButtonSize) => buttonSizeHeightMap[size];
export const getButtonBackground = (
  background: ButtonBackground,
  variant: ButtonVariant
) => (variant === "minimal" ? "transparent" : getColorByName(background));
export const getButtonColor = (
  background: ButtonBackground,
  variant: ButtonVariant
) => (variant === "minimal" ? "black" : getTextColorForBackground(background));
export const getButtonIconBackground =
  (background: ButtonBackground) => (props: PropsWithTheme) =>
    props.theme.buttonIconBackgroundColors[background] ||
    props.theme.contrastColors[background];
const DEFAULT_DROP_SHADOW_COLOR = "1px 3px 10px 2px rgb(0 0 40)";
export const getButtonDropShadowColor =
  (background: ButtonBackground) => (props: PropsWithTheme) =>
    props.theme.buttonDropShadows[background] || DEFAULT_DROP_SHADOW_COLOR;

const buttonPaddingMap: Record<ButtonSize, PixelSpacing> = {
  tiny: TINY_BUTTON_PADDING_X,
  small: SMALL_BUTTON_PADDING_X,
  large: LARGE_BUTTON_PADDING_X,
  header: HEADER_BUTTON_PADDING_X,
};
export const getButtonPadding = (size: ButtonSize) => buttonPaddingMap[size];
export const buttonIconSizeMap: Record<ButtonSize, PixelSpacing> = {
  tiny: TINY_BUTTON_ICON_SIZE,
  small: SMALL_BUTTON_ICON_SIZE,
  large: LARGE_BUTTON_ICON_SIZE,
  header: HEADER_BUTTON_ICON_SIZE,
};
export const DEFAULT_BUTTON_SIZE: ButtonSize = "small";
export const DEFAULT_BUTTON_VARIANT: ButtonVariant = "brush";
export const DEFAULT_ICON_POSITION: IconPosition = "leading";
export const DEFAULT_BUTTON_BACKGROUND: ButtonBackground = "black";

export type CommonButtonProps = OpacityProps &
  MarginProps & {
    id?: string;
    label: string;
    variant?: ButtonVariant;
    background?: ButtonBackground;
    icon?: IconName;
    iconPosition?: IconPosition;
    iconBackground?: OakColorName;
    size?: ButtonSize;
    "aria-label"?: string;
    fullWidth?: boolean;
    focusStyles?: [];
  };
export const defaultButtonProps: Partial<CommonButtonProps> = {
  variant: DEFAULT_BUTTON_VARIANT,
  iconPosition: DEFAULT_ICON_POSITION,
  size: DEFAULT_BUTTON_SIZE,
};

export type HTMLButtonProps = Omit<
  DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
  "ref"
>;

export type HTMLAnchorProps = Omit<
  DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>,
  "ref"
>;

export type CommonIconButtonProps = Omit<
  CommonButtonProps,
  "label" | "iconPosition"
> & {
  icon: IconName;
  "aria-label": string;
  iconColorOverride?: OakColorName;
};
