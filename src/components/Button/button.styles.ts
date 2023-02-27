import { css } from "styled-components";

import getColorByLocation from "../../styles/themeHelpers/getColorByLocation";
import getColorByName from "../../styles/themeHelpers/getColorByName";
import { HOVER_SHADOW_TRANSITION } from "../../styles/transitions";
import opacity, { OpacityProps } from "../../styles/utils/opacity";
import margin, { MarginProps } from "../../styles/utils/spacing";
import { getBreakpoint } from "../../styles/utils/responsive";
import { BackgroundIcon } from "../Icon/Icon";

import {
  ButtonFocusUnderline,
  ButtonMinimalFocusUnderline,
  ButtonStyledAsLinkFocusUnderline,
} from "./ButtonInner";
import ButtonLabel from "./ButtonLabel";
import {
  ButtonSize,
  ButtonVariant,
  getButtonFlexDirection,
  getButtonHeight,
  getButtonPadding,
  getButtonColor,
  IconPosition,
  CommonButtonProps,
  DEFAULT_BUTTON_VARIANT,
  DEFAULT_BUTTON_SIZE,
  DEFAULT_ICON_POSITION,
  DEFAULT_BUTTON_BACKGROUND,
  ButtonBackground,
  getButtonBackground,
  getButtonDropShadowColor,
} from "./common";
import { iconFocusUnderline } from "./IconFocusUnderline";

export type ButtonStylesProps = OpacityProps &
  MarginProps & {
    size: ButtonSize;
    $iconPosition: IconPosition;
    variant: ButtonVariant;
    background: ButtonBackground;
    $fullWidth?: boolean;
    disabled?: boolean;
    $focusStyles?: [];
  };
export const getButtonStylesProps = (
  props: CommonButtonProps
): ButtonStylesProps => {
  const {
    variant = DEFAULT_BUTTON_VARIANT,
    $iconPosition = DEFAULT_ICON_POSITION,
    size = DEFAULT_BUTTON_SIZE,
    background = DEFAULT_BUTTON_BACKGROUND,
    $fullWidth,
    $focusStyles,
    disabled,
  } = props;

  return {
    size,
    $iconPosition,
    variant,
    $fullWidth,
    background: disabled ? "grey6" : background,
    $focusStyles,
  };
};

const buttonStyles = css<ButtonStylesProps>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  max-width: 100%;
  position: relative;
  text-decoration: none;
  ${opacity}
  ${(props) => css`
    width: ${props.$fullWidth && "100%"};
    flex-direction: ${getButtonFlexDirection(props.$iconPosition)};
    height: ${getButtonHeight(props.size, props.variant)}px;
    padding: 0 ${getButtonPadding(props.size, props.variant, "button")}px;
    background-color: ${props.disabled
      ? getColorByName("grey6")
      : getButtonBackground(props.background, props.variant)};
    color: ${getButtonColor(props.background, props.variant)};
  `}

  transition: ${HOVER_SHADOW_TRANSITION};

  :focus {
    outline: none;
  }

  ${ButtonFocusUnderline} {
    display: none;
  }

  ${ButtonMinimalFocusUnderline} {
    display: none;
  }

  ${ButtonStyledAsLinkFocusUnderline} {
    display: none;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 4px;
  }

  ${(props) =>
    props.variant === "brush" &&
    css`
      :hover {
        box-shadow: ${props.disabled
          ? getButtonDropShadowColor("grey6")
          : getButtonDropShadowColor(props.background)};
      }

      :focus ${ButtonFocusUnderline} {
        display: block;
        bottom: -4px;
        left: -4px;
        width: calc(100% + 8px);
        height: 10px;
        transform: rotate(-1deg);
      }

      :disabled {
        background-color: ${getColorByLocation(
          ({ theme }) => theme.button.disabled.background
        )};
        cursor: not-allowed;
      }

      :hover ${ButtonLabel} {
        text-decoration: underline;
      }
    `}

  ${(props) =>
    props.variant === "minimal" &&
    css`
      & ${BackgroundIcon} {
        transition: filter 0.3s ease-in-out;
      }

      :hover ${BackgroundIcon} {
        filter: drop-shadow(0 0 3px rgb(0 0 0 / 50%));
      }

      :focus ${ButtonMinimalFocusUnderline} {
        display: block;
        bottom: -4px;
        left: 0;
        width: 100%;
        height: 7px;
      }

      ${ButtonMinimalFocusUnderline} {
        filter: drop-shadow(1px 4px 0px rgb(0 0 0));
      }

      ${iconFocusUnderline}
    `}

  ${(props) =>
    props.variant === "buttonStyledAsLink" &&
    css`
      &:hover,
      &:focus {
        & ${ButtonStyledAsLinkFocusUnderline} {
          display: block;
        }
      }

      @media (max-width: ${getBreakpoint("small")}px) {
        & ${ButtonStyledAsLinkFocusUnderline} {
          display: block;
        }
      }
    `}

  ${margin}
`;

export default buttonStyles;
