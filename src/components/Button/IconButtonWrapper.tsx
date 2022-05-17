import styled, { css } from "styled-components";

import { ButtonSize, getButtonHeight } from "./common";

type IconButtonWrapperProps = {
  size: ButtonSize;
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
  `}

  :disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default IconButtonWrapper;
