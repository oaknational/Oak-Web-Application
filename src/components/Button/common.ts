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
export const buttonBackroundMap: Record<ButtonVariant, string> = {
  primary: "var(--color-button-primary)",
  secondary: "var(--color-button-secondary)",
  tertiary: "var(--color-button-tertiary)",
};
export const getButtonBackground = (variant: ButtonVariant) =>
  buttonBackroundMap[variant];
export const buttonColorMap: Record<ButtonVariant, string> = {
  primary: "var(--color-button-primary-contrast)",
  secondary: "var(--color-button-secondary-contrast)",
  tertiary: "var(--color-button-tertiary-contrast)",
};
export const getButtonColor = (variant: ButtonVariant) =>
  buttonColorMap[variant];
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
