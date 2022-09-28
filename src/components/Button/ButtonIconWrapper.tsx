import styled, { css } from "styled-components";

import { IconPosition } from "./common";

type ButtonIconWrapperProps = {
  iconPosition: IconPosition;
};
const ButtonIconWrapper = styled.span<ButtonIconWrapperProps>`
  display: inline-flex;
  position: relative;
  align-items: center;
  ${(props) => css`
    margin-right: ${props.iconPosition === "leading" ? 8 : 0}px;
    margin-left: ${props.iconPosition === "trailing" ? 8 : 0}px;
  `}
`;

export default ButtonIconWrapper;
