import { css } from "styled-components";

import {
  ButtonBackground,
  ButtonSize,
  ButtonVariant,
  CommonIconButtonProps,
  DEFAULT_BUTTON_SIZE,
  DEFAULT_BUTTON_VARIANT,
  DEFAULT_BUTTON_BACKGROUND,
  getButtonColor,
  getIconButtonHeight,
} from "../common";

import { margin, MarginProps } from "@/styles/utils/spacing";
import { iconFocusUnderline } from "@/components/SharedComponents/Button/IconFocusUnderline";
import { BackgroundIcon } from "@/components/SharedComponents/Icon.deprecated/Icon.deprecated";

const disabledStyles = css`
  opacity: 0.5;
  cursor: not-allowed;
`;

export type IconButtonStylesProps = MarginProps & {
  size: ButtonSize;
  variant: ButtonVariant;
  background: ButtonBackground;
  rotate?: number;
  disabled?: boolean;
};
export const getIconButtonStylesProps = (
  props: CommonIconButtonProps,
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
    height: ${getIconButtonHeight(props.size, props.variant)}px;
    width: ${getIconButtonHeight(props.size, props.variant)}px;
    min-width: ${getIconButtonHeight(props.size, props.variant)}px;
    color: ${getButtonColor(props.background, props.variant)};
  `}

  &:disabled {
    ${disabledStyles}
  }

  ${(props) => props.disabled && disabledStyles}

  & ${BackgroundIcon} {
    transition: filter 0.3s ease-in-out;
  }

  &:hover ${BackgroundIcon} {
    filter: drop-shadow(0 0 3px rgb(0 0 0 / 50%));
  }

  &:focus {
    outline: none;
  }

  ${iconFocusUnderline}
  ${margin}
`;

export default iconButtonStyles;
