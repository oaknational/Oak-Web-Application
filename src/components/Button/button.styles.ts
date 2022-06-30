import { css } from "styled-components";

import getColorByLocation from "../../styles/themeHelpers/getColorByLocation";
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
  fullWidth?: boolean;
};
export const getButtonStylesProps = (
  props: CommonButtonProps
): ButtonStylesProps => {
  const {
    variant = DEFAULT_BUTTON_VARIANT,
    iconPosition = DEFAULT_ICON_POSITION,
    size = DEFAULT_BUTTON_SIZE,
    fullWidth,
  } = props;

  return { size, iconPosition, variant, fullWidth };
};
const buttonStyles = css<ButtonStylesProps>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  max-width: 100%;

  ${(props) => css`
    width: ${props.fullWidth && "100%"};
    flex-direction: ${getButtonFlexDirection(props.iconPosition)};
    height: ${getButtonHeight(props.size)}px;
    border-radius: ${getButtonHeight(props.size) / 2}px;
    padding: 0 ${getButtonPadding(props.size)}px;
    background-color: ${getButtonBackground(props.variant)};
    color: ${getButtonColor(props.variant)};
  `}

  :disabled {
    background-color: ${getColorByLocation(
      ({ theme }) => theme.button.disabled.background
    )};
    cursor: not-allowed;
  }

  ${margin}
`;

export default buttonStyles;
