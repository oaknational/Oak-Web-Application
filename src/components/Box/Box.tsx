import styled from "styled-components";

import background, { BackgroundProps } from "../../styles/utils/background";
import position, { PositionProps } from "../../styles/utils/position";
import spacing, { SpacingProps } from "../../styles/utils/spacing";

export type BoxProps = PositionProps & SpacingProps & BackgroundProps;

const Box = styled.div<BoxProps>`
  ${position}
  ${spacing}
  ${background}
`;

export default Box;
