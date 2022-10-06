import styled, { css } from "styled-components";

import {
  ButtonBackground,
  ButtonSize,
  ButtonVariant,
  getButtonColor,
  getButtonHeight,
} from "./common";

type IconButtonWrapperProps = {
  size: ButtonSize;
  variant: ButtonVariant;
  background: ButtonBackground;
};
const IconButtonWrapper = styled.div<IconButtonWrapperProps>`
  position: relative;
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
`;

export default IconButtonWrapper;
