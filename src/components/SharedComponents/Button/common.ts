import {
  DetailedHTMLProps,
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
} from "react";

import { ResponsiveValues } from "@/styles/utils/responsive";
import { FontVariant } from "@/styles/utils/typography";
import { OakColorName } from "@/styles/theme";
import { PixelSpacing, PropsWithTheme } from "@/styles/theme/types";
import getColorByName from "@/styles/themeHelpers/getColorByName";
import getTextColorForBackground from "@/styles/themeHelpers/getTextColorForBackground";
import { OpacityProps } from "@/styles/utils/opacity";
import { MarginProps } from "@/styles/utils/spacing";
import { IconName } from "@/components/SharedComponents/Icon.deprecated";
import { ColorProps } from "@/styles/utils/color";

export type ButtonHoverStyle = "underline-link-text" | "drop-shadow";
export type ButtonVariant =
  | "brush"
  | "brushNav"
  | "minimal"
  | "minimalNav"
  | "buttonStyledAsLink"
  | "flat";
export type ButtonBackground = OakColorName;
export type IconPosition = "leading" | "trailing";
export type ButtonSize = "small" | "medium" | "large" | "xs";

const SMALL_BUTTON_ICON_SIZE = 28;
const SMALL_BUTTON_HEIGHT = 40;

const MEDIUM_BUTTON_ICON_SIZE = 32;
const MEDIUM_BUTTON_HEIGHT = 44;

const LARGE_BUTTON_ICON_SIZE = 36;
const LARGE_BUTTON_HEIGHT = 48;

export const buttonFlexDirectionMap: Record<
  IconPosition,
  "row" | "row-reverse"
> = {
  leading: "row",
  trailing: "row-reverse",
};
export const getButtonFlexDirection = ($iconPosition: IconPosition) =>
  buttonFlexDirectionMap[$iconPosition];

interface ButtonConfig {
  height: PixelSpacing;
  iconOuterHeight: PixelSpacing;
  iconInnerHeight: PixelSpacing;
  paddingH: PixelSpacing;
}
const DEFAULT_BUTTON_CONFIG: ButtonConfig = {
  height: 0,
  iconOuterHeight: 0,
  iconInnerHeight: 0,
  paddingH: 0,
};

const BUTTON_CONFIGS: Record<
  `${ButtonSize}-${ButtonVariant}-${"button" | "icon-button"}`,
  ButtonConfig
> = {
  "small-minimal-button": {
    height: 30,
    iconOuterHeight: 30,
    iconInnerHeight: 20,
    paddingH: 0,
  },
  "large-minimal-button": {
    height: 36,
    iconOuterHeight: 36,
    iconInnerHeight: 30,
    paddingH: 0,
  },
  "small-minimalNav-button": {
    height: 44,
    iconOuterHeight: 30,
    iconInnerHeight: 20,
    paddingH: 10,
  },
  "large-minimalNav-button": {
    height: 50,
    iconOuterHeight: 36,
    iconInnerHeight: 30,
    paddingH: 10,
  },
  "small-buttonStyledAsLink-button": {
    height: 30,
    iconOuterHeight: 30,
    iconInnerHeight: 20,
    paddingH: 0,
  },
  "large-buttonStyledAsLink-button": {
    height: 36,
    iconOuterHeight: 36,
    iconInnerHeight: 30,
    paddingH: 0,
  },
  "small-brush-button": {
    height: 44,
    iconOuterHeight: 30,
    iconInnerHeight: 20,
    paddingH: 10,
  },
  "large-brush-button": {
    height: 50,
    iconOuterHeight: 36,
    iconInnerHeight: 30,
    paddingH: 10,
  },
  "small-brushNav-button": {
    height: 44,
    iconOuterHeight: 30,
    iconInnerHeight: 20,
    paddingH: 10,
  },
  "large-brushNav-button": {
    height: 50,
    iconOuterHeight: 36,
    iconInnerHeight: 30,
    paddingH: 10,
  },
  "small-minimal-icon-button": {
    height: 20,
    iconOuterHeight: 20,
    iconInnerHeight: 20,
    paddingH: 0,
  },
  "large-minimal-icon-button": {
    height: 30,
    iconOuterHeight: 30,
    iconInnerHeight: 30,
    paddingH: 0,
  },
  "small-minimalNav-icon-button": {
    height: 20,
    iconOuterHeight: 20,
    iconInnerHeight: 20,
    paddingH: 0,
  },
  "large-minimalNav-icon-button": {
    height: 30,
    iconOuterHeight: 30,
    iconInnerHeight: 30,
    paddingH: 0,
  },
  "small-buttonStyledAsLink-icon-button": {
    height: 20,
    iconOuterHeight: 20,
    iconInnerHeight: 20,
    paddingH: 0,
  },
  "large-buttonStyledAsLink-icon-button": {
    height: 30,
    iconOuterHeight: 30,
    iconInnerHeight: 30,
    paddingH: 0,
  },
  "small-brush-icon-button": {
    height: 30,
    iconOuterHeight: 30,
    iconInnerHeight: 20,
    paddingH: 0,
  },
  "large-brush-icon-button": {
    height: 36,
    iconOuterHeight: 36,
    iconInnerHeight: 30,
    paddingH: 0,
  },
  "small-brushNav-icon-button": {
    height: 30,
    iconOuterHeight: 30,
    iconInnerHeight: 20,
    paddingH: 0,
  },
  "large-brushNav-icon-button": {
    height: 36,
    iconOuterHeight: 36,
    iconInnerHeight: 30,
    paddingH: 0,
  },
  "xs-brush-button": DEFAULT_BUTTON_CONFIG,
  "xs-brush-icon-button": DEFAULT_BUTTON_CONFIG,
  "xs-brushNav-button": {
    height: 40,
    iconOuterHeight: 30,
    iconInnerHeight: 20,
    paddingH: 10,
  },
  "xs-brushNav-icon-button": DEFAULT_BUTTON_CONFIG,
  "xs-minimal-button": DEFAULT_BUTTON_CONFIG,
  "xs-minimal-icon-button": DEFAULT_BUTTON_CONFIG,
  "xs-minimalNav-button": DEFAULT_BUTTON_CONFIG,
  "xs-minimalNav-icon-button": DEFAULT_BUTTON_CONFIG,
  "xs-buttonStyledAsLink-button": DEFAULT_BUTTON_CONFIG,
  "xs-buttonStyledAsLink-icon-button": DEFAULT_BUTTON_CONFIG,
  "xs-flat-button": DEFAULT_BUTTON_CONFIG,
  "xs-flat-icon-button": DEFAULT_BUTTON_CONFIG,
  "medium-brush-button": DEFAULT_BUTTON_CONFIG,
  "medium-brush-icon-button": DEFAULT_BUTTON_CONFIG,
  "medium-brushNav-button": DEFAULT_BUTTON_CONFIG,
  "medium-brushNav-icon-button": DEFAULT_BUTTON_CONFIG,
  "medium-minimal-button": DEFAULT_BUTTON_CONFIG,
  "medium-minimal-icon-button": DEFAULT_BUTTON_CONFIG,
  "medium-minimalNav-button": DEFAULT_BUTTON_CONFIG,
  "medium-minimalNav-icon-button": DEFAULT_BUTTON_CONFIG,
  "medium-buttonStyledAsLink-button": {
    height: 30,
    iconOuterHeight: 0,
    iconInnerHeight: 0,
    paddingH: 0,
  },
  "medium-buttonStyledAsLink-icon-button": DEFAULT_BUTTON_CONFIG,
  "medium-flat-button": DEFAULT_BUTTON_CONFIG,
  "medium-flat-icon-button": DEFAULT_BUTTON_CONFIG,
  "large-flat-button": DEFAULT_BUTTON_CONFIG,
  "small-flat-button": DEFAULT_BUTTON_CONFIG,
  "small-flat-icon-button": DEFAULT_BUTTON_CONFIG,
  "large-flat-icon-button": DEFAULT_BUTTON_CONFIG,
};

const getButtonConfig = (
  size: ButtonSize,
  variant: ButtonVariant,
  buttonOrIconButton: "button" | "icon-button",
): ButtonConfig => BUTTON_CONFIGS[`${size}-${variant}-${buttonOrIconButton}`];

export const getIconButtonHeight = (
  size: ButtonSize,
  variant: ButtonVariant,
): PixelSpacing => {
  const config = getButtonConfig(size, variant, "icon-button");

  return config.height;
};

export const buttonSizeHeightMap: Record<ButtonSize, PixelSpacing> = {
  small: SMALL_BUTTON_HEIGHT,
  medium: MEDIUM_BUTTON_HEIGHT,
  large: LARGE_BUTTON_HEIGHT,
  xs: SMALL_BUTTON_HEIGHT,
};

export const getButtonHeight = (size: ButtonSize, variant: ButtonVariant) => {
  return getButtonConfig(size, variant, "button").height;
};
export const getButtonBackground = (
  background: ButtonBackground,
  variant: ButtonVariant,
  disabled?: boolean,
) => {
  if (
    variant === "minimal" ||
    variant === "minimalNav" ||
    variant === "buttonStyledAsLink"
  ) {
    return "transparent";
  } else if (variant === "brush" && disabled) {
    return getColorByName("grey50");
  } else {
    return getColorByName(background);
  }
};
export const getButtonColor = (
  background: ButtonBackground,
  variant: ButtonVariant,
  disabled?: boolean,
) =>
  variant === "minimal" ||
  variant === "buttonStyledAsLink" ||
  variant === "minimalNav"
    ? disabled
      ? getColorByName("grey50")
      : "black"
    : getTextColorForBackground(background);
export const getButtonIconBackground =
  (background: ButtonBackground) => (props: PropsWithTheme) =>
    props.theme.buttonIconBackgroundColors[background] ||
    props.theme.contrastColors[background];
const DEFAULT_DROP_SHADOW_COLOR = "1px 3px 10px 2px rgb(0 0 40)";
export const getButtonDropShadowColor =
  (background: ButtonBackground) => (props: PropsWithTheme) =>
    props.theme.buttonDropShadows[background] || DEFAULT_DROP_SHADOW_COLOR;

export const getButtonPadding = (
  size: ButtonSize,
  variant: ButtonVariant,
  buttonOrIconButton: "button" | "icon-button",
) => getButtonConfig(size, variant, buttonOrIconButton).paddingH;
export const buttonIconSizeMap: Record<ButtonSize, PixelSpacing> = {
  small: SMALL_BUTTON_ICON_SIZE,
  medium: MEDIUM_BUTTON_ICON_SIZE,
  large: LARGE_BUTTON_ICON_SIZE,
  xs: SMALL_BUTTON_ICON_SIZE,
};
export const DEFAULT_BUTTON_SIZE: ButtonSize = "small";
export const DEFAULT_BUTTON_VARIANT: ButtonVariant = "brush";
export const DEFAULT_ICON_POSITION: IconPosition = "leading";
export const DEFAULT_BUTTON_BACKGROUND: ButtonBackground = "black";

export type CommonButtonProps = { children?: React.ReactNode } & OpacityProps &
  MarginProps &
  ColorProps & {
    id?: string;
    label: string;
    /**
     * labelSuffixA11y will be appended to the label but not be visible. It is
     * intended to give screen reader users more context which might otherwise
     * be derived by visual context.
     * @example label: "See bio", labelSuffixA11y: "for Joan Baez"
     * @see https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html#examples
     */
    labelSuffixA11y?: string;
    /**
     * shouldHideLabel will hide the label visually (though it will still be)
     * accessible to screen readers at breakpoints depending on the array
     * passed.
     * @example shouldHideLabel: [false, true] will hide the label on mobile
     * only
     * This is for the pattern where a button sometimes collapses to only show
     * the icon on mobile.
     */
    shouldHideLabel?: boolean[];
    variant?: ButtonVariant;
    background?: ButtonBackground;
    icon?: IconName;
    subjectIcon?: string;
    $iconPosition?: IconPosition;
    iconBackground?: OakColorName;
    size?: ButtonSize;
    $font?: ResponsiveValues<FontVariant>;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "aria-label"?: string;
    $fullWidth?: boolean;
    $focusStyles?: [];
    $hoverStyles?: ButtonHoverStyle[];
    disabled?: boolean;
  };
export const defaultButtonProps: Partial<CommonButtonProps> = {
  variant: DEFAULT_BUTTON_VARIANT,
  $iconPosition: DEFAULT_ICON_POSITION,
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
  "label" | "$iconPosition"
> & {
  icon: IconName;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  "aria-label": string;
  iconColorOverride?: OakColorName;
  iconAnimateTo?: IconName;
};
