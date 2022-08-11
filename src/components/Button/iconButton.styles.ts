import { css } from "styled-components";

import { margin, MarginProps } from "../../styles/utils/spacing";
import { BackgroundIcon } from "../Icon/Icon";

import {
  ButtonBackground,
  ButtonSize,
  ButtonVariant,
  CommonIconButtonProps,
  DEFAULT_BUTTON_SIZE,
  DEFAULT_BUTTON_VARIANT,
  DEFAULT_BUTTON_BACKGROUND,
  getButtonColor,
  getButtonHeight,
} from "./common";

export type IconButtonStylesProps = MarginProps & {
  size: ButtonSize;
  variant: ButtonVariant;
  background: ButtonBackground;
  rotate?: number;
};
export const getIconButtonStylesProps = (
  props: CommonIconButtonProps
): IconButtonStylesProps => {
  const {
    background = DEFAULT_BUTTON_BACKGROUND,
    variant = DEFAULT_BUTTON_VARIANT,
    size = DEFAULT_BUTTON_SIZE,
  } = props;

  return { size, variant, background };
};
const iconButtonStyles = css<IconButtonStylesProps>`
  display: flex;
  align-items: center;
  justify-content: center;

  ${(props) => css`
    height: ${getButtonHeight(props.size)}px;
    width: ${getButtonHeight(props.size)}px;
    min-width: ${getButtonHeight(props.size)}px;
    color: ${getButtonColor(props.background, props.variant)};
  `}

  :disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  & ${BackgroundIcon} {
    transition: filter 0.3s ease-in-out;
  }

  :hover ${BackgroundIcon} {
    filter: drop-shadow(0 0 3px rgb(0 0 0 / 50%));
  }

  ${margin}
`;

export default iconButtonStyles;
