import { css } from "styled-components";

import { margin, MarginProps } from "../../styles/utils/spacing";

import {
  ButtonSize,
  ButtonVariant,
  CommonIconButtonProps,
  DEFAULT_BUTTON_SIZE,
  DEFAULT_BUTTON_VARIANT,
  getButtonBackground,
  getButtonColor,
  getButtonHeight,
} from "./common";

export type IconButtonStylesProps = MarginProps & {
  size: ButtonSize;
  variant: ButtonVariant;
};
export const getIconButtonStylesProps = (
  props: CommonIconButtonProps
): IconButtonStylesProps => {
  const { variant = DEFAULT_BUTTON_VARIANT, size = DEFAULT_BUTTON_SIZE } =
    props;

  return { size, variant };
};
const iconButtonStyles = css<IconButtonStylesProps>`
  display: flex;
  align-items: center;
  justify-content: center;

  ${(props) => css`
    height: ${getButtonHeight(props.size)}px;
    width: ${getButtonHeight(props.size)}px;
    min-width: ${getButtonHeight(props.size)}px;
    border-radius: ${getButtonHeight(props.size) / 2}px;
    background-color: ${getButtonBackground(props.variant)};
    color: ${getButtonColor(props.variant)};
  `}

  :disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${margin}
`;

export default iconButtonStyles;
