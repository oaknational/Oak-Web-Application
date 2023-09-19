import { css } from "styled-components";

import getColorByLocation from "../../styles/themeHelpers/getColorByLocation";
import { HOVER_SHADOW_TRANSITION } from "../../styles/transitions";
import opacity, { OpacityProps } from "../../styles/utils/opacity";
import margin, { MarginProps } from "../../styles/utils/spacing";
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
    $hoverStyles?: string[];
    "aria-disabled"?: boolean;
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
    background: disabled && variant !== "brushNav" ? "grey6" : background, // we don't discolor brushNav buttons when disabled
    $focusStyles,
    disabled,
  };
};

const disabledStyles = css`
  cursor: not-allowed;
`;

const buttonStyles = css<ButtonStylesProps>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  max-width: 100%;
  position: relative;
  text-decoration: none;
  ${opacity}
  ${(props) => {
    return css`
      width: ${props.$fullWidth && "100%"};
      flex-direction: ${getButtonFlexDirection(props.$iconPosition)};
      height: ${getButtonHeight(props.size, props.variant)}px;
      padding: 0 ${getButtonPadding(props.size, props.variant, "button")}px;
      background-color: ${getButtonBackground(
        props.background,
        props.variant,
        props["aria-disabled"]
      )};
      color: ${getButtonColor(props.background, props.variant)};
    `;
  }}
  transition: ${HOVER_SHADOW_TRANSITION};

  :focus {
    outline: none;
  }

  :disabled {
    ${disabledStyles}
  }

  ${(props) => props["aria-disabled"] && disabledStyles}

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
    (props.variant === "brush" || props.variant === "brushNav") &&
    css`
      :hover {
        box-shadow: ${props["aria-disabled"]
          ? "none"
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
    (props.variant === "minimal" || props.variant === "minimalNav") &&
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
    props.$hoverStyles &&
    props.$hoverStyles.includes("underline-link-text") &&
    !props.disabled &&
    css`
      :hover:not(:focus) ${ButtonLabel} {
        text-decoration: underline;
      }
    `}

  ${(props) =>
    props.variant === "buttonStyledAsLink" &&
    css`
      &:focus {
        & ${ButtonStyledAsLinkFocusUnderline} {
          display: block;
        }
      }

      :hover:not(:focus) ${ButtonLabel} {
        text-decoration: underline;
      }
    `}

  ${margin}
`;

export default buttonStyles;
