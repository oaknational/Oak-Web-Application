import styled from "styled-components";

import background, { BackgroundProps } from "../../styles/utils/background";
import position, { PositionProps } from "../../styles/utils/position";
import size, { SizeProps } from "../../styles/utils/size";
import spacing, { SpacingProps } from "../../styles/utils/spacing";

export type BoxProps = PositionProps &
  SizeProps &
  SpacingProps &
  BackgroundProps;

/**
 * Box exposes position, size, spacing, and background props on a div.
 */
const Box = styled.div<BoxProps>`
  ${position}
  ${size}
  ${spacing}
  ${background}
`;

export default Box;
