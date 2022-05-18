import styled, { css } from "styled-components";

import {
  ButtonSize,
  ButtonVariant,
  getButtonBackground,
  getButtonColor,
  getButtonHeight,
} from "./common";

type IconButtonWrapperProps = {
  size: ButtonSize;
  variant: ButtonVariant;
};
const IconButtonWrapper = styled.div<IconButtonWrapperProps>`
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
`;

export default IconButtonWrapper;
