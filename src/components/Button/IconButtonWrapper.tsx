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
  display: flex;
  align-items: center;
  justify-content: center;

  ${(props) => css`
    height: ${getButtonHeight(props.size, props.variant)}px;
    width: ${getButtonHeight(props.size, props.variant)}px;
    min-width: ${getButtonHeight(props.size, props.variant)}px;
    color: ${getButtonColor(props.background, props.variant)};
  `}

  :disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default IconButtonWrapper;
