import { css } from "styled-components";

import getColor from "../../styles/themeHelpers/getColor";
import margin, { MarginProps } from "../../styles/utils/spacing";

import {
  ButtonSize,
  ButtonVariant,
  getButtonFlexDirection,
  getButtonHeight,
  getButtonPadding,
  getButtonBackground,
  getButtonColor,
  IconPosition,
  CommonButtonProps,
  DEFAULT_BUTTON_VARIANT,
  DEFAULT_BUTTON_SIZE,
  DEFAULT_ICON_POSITION,
} from "./common";

export type ButtonStylesProps = MarginProps & {
  size: ButtonSize;
  iconPosition: IconPosition;
  variant: ButtonVariant;
};
export const getButtonStylesProps = (
  props: CommonButtonProps
): ButtonStylesProps => {
  const {
    variant = DEFAULT_BUTTON_VARIANT,
    iconPosition = DEFAULT_ICON_POSITION,
    size = DEFAULT_BUTTON_SIZE,
  } = props;

  return { size, iconPosition, variant };
};
const buttonStyles = css<ButtonStylesProps>`
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  max-width: 100%;

  ${(props) => css`
    flex-direction: ${getButtonFlexDirection(props.iconPosition)};
    height: ${getButtonHeight(props.size)}px;
    border-radius: ${getButtonHeight(props.size) / 2}px;
    padding: 0 ${getButtonPadding(props.size)}px;
    background-color: ${getButtonBackground(props.variant)};
    color: ${getButtonColor(props.variant)};
  `}

  :disabled {
    background-color: ${getColor((theme) => theme.button.disabled.background)};
    cursor: not-allowed;
  }

  ${margin}
`;

export default buttonStyles;
