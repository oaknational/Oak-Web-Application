import styled, { css } from "styled-components";

import {
  ButtonSize,
  ButtonVariant,
  getButtonFlexDirection,
  getButtonHeight,
  getButtonPadding,
  getButtonBackground,
  getButtonColor,
  IconPosition,
} from "./common";

export type ButtonWrapperProps = {
  size: ButtonSize;
  iconPosition: IconPosition;
  variant: ButtonVariant;
};
const ButtonWrapper = styled.div<ButtonWrapperProps>`
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
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default ButtonWrapper;
