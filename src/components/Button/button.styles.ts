import { css } from "styled-components";

import getColorByLocation from "../../styles/themeHelpers/getColorByLocation";
import { HOVER_SHADOW_TRANSITION } from "../../styles/transitions";
import margin, { MarginProps } from "../../styles/utils/spacing";
import { BackgroundIcon } from "../Icon/Icon";

import { ButtonFocusUnderline } from "./ButtonInner";
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

export type ButtonStylesProps = MarginProps & {
  size: ButtonSize;
  iconPosition: IconPosition;
  variant: ButtonVariant;
  background: ButtonBackground;
  fullWidth?: boolean;
  disabled?: boolean;
  focusStyles?: [];
};
export const getButtonStylesProps = (
  props: CommonButtonProps
): ButtonStylesProps => {
  const {
    variant = DEFAULT_BUTTON_VARIANT,
    iconPosition = DEFAULT_ICON_POSITION,
    size = DEFAULT_BUTTON_SIZE,
    background = DEFAULT_BUTTON_BACKGROUND,
    fullWidth,
    focusStyles,
  } = props;

  return { size, iconPosition, variant, fullWidth, background, focusStyles };
};
const buttonStyles = css<ButtonStylesProps>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  max-width: 100%;
  position: relative;
  ${(props) => css`
    width: ${props.fullWidth && "100%"};
    flex-direction: ${getButtonFlexDirection(props.iconPosition)};
    height: ${getButtonHeight(props.size)}px;
    padding: 0 ${getButtonPadding(props.size)}px;
    background-color: ${getButtonBackground(props.background, props.variant)};
    color: ${getButtonColor(props.background, props.variant)};
  `}

  transition: ${HOVER_SHADOW_TRANSITION};

  :focus {
    outline: none;
  }

  ${ButtonFocusUnderline} {
    display: none;
  }

  ${(props) =>
    props.variant === "brush" &&
    css`
      :hover {
        box-shadow: ${getButtonDropShadowColor(props.background)};
      }

      :focus ${ButtonFocusUnderline} {
        display: block;
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

      ${ButtonFocusUnderline} {
        filter: drop-shadow(2px 6px 0px rgb(0 0 0));
      }
    `}

  ${margin}
`;

export default buttonStyles;
