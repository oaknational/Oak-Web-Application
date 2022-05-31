import {
  DetailedHTMLProps,
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
} from "react";

import { OakColorName, PropsWithTheme } from "../../styles/theme";
import { MarginProps } from "../../styles/utils/spacing";
import { IconName } from "../Icon";

export type ButtonVariant = "primary" | "secondary" | "tertiary";
export type IconPosition = "leading" | "trailing";
export type ButtonSize = "small" | "large";
/**
 * @todo move to theme
 */
const SMALL_BUTTON_ICON_SIZE = 16;
const SMALL_BUTTON_HEIGHT = 40;
const SMALL_BUTTON_PADDING_X = 12;

const LARGE_BUTTON_ICON_SIZE = 24;
const LARGE_BUTTON_HEIGHT = 48;
const LARGE_BUTTON_PADDING_X = 16;

export const buttonFlexDirectionMap: Record<
  IconPosition,
  "row" | "row-reverse"
> = {
  leading: "row",
  trailing: "row-reverse",
};
export const getButtonFlexDirection = (iconPosition: IconPosition) =>
  buttonFlexDirectionMap[iconPosition];
export const buttonSizeHeightMap: Record<ButtonSize, number> = {
  small: SMALL_BUTTON_HEIGHT,
  large: LARGE_BUTTON_HEIGHT,
};
export const getButtonHeight = (size: ButtonSize) => buttonSizeHeightMap[size];
export const getButtonBackground =
  (variant: ButtonVariant) => (props: PropsWithTheme) =>
    props.theme.button[variant].background;
export const getButtonColor =
  (variant: ButtonVariant) => (props: PropsWithTheme) =>
    props.theme.button[variant].text;

const buttonPaddingMap: Record<ButtonSize, number> = {
  small: SMALL_BUTTON_PADDING_X,
  large: LARGE_BUTTON_PADDING_X,
};
export const getButtonPadding = (size: ButtonSize) => buttonPaddingMap[size];
export const buttonIconSizeMap: Record<ButtonSize, number> = {
  small: SMALL_BUTTON_ICON_SIZE,
  large: LARGE_BUTTON_ICON_SIZE,
};
export const DEFAULT_BUTTON_SIZE: ButtonSize = "small";
export const DEFAULT_BUTTON_VARIANT: ButtonVariant = "primary";
export const DEFAULT_ICON_POSITION: IconPosition = "leading";

export type CommonButtonProps = MarginProps & {
  label: string;
  variant?: ButtonVariant;
  icon?: IconName;
  iconPosition?: IconPosition;
  size?: ButtonSize;
  "aria-label"?: string;
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
