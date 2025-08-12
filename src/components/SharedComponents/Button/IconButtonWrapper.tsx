import styled, { css } from "styled-components";

import {
  ButtonBackground,
  ButtonSize,
  ButtonVariant,
  getButtonColor,
  getIconButtonHeight,
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
    height: ${getIconButtonHeight(props.size, props.variant)}px;
    width: ${getIconButtonHeight(props.size, props.variant)}px;
    min-width: ${getIconButtonHeight(props.size, props.variant)}px;
    color: ${getButtonColor(props.background, props.variant)};
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default IconButtonWrapper;
