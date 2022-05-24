import styled from "styled-components";

import background, { BackgroundProps } from "../../styles/utils/background";
import position, { PositionProps } from "../../styles/utils/position";
import spacing, { SpacingProps } from "../../styles/utils/spacing";

export type FlexProps = SpacingProps & BackgroundProps & PositionProps;
const Flex = styled.div<FlexProps>`
  ${spacing}
  ${background}
  ${position}
`;

export default Flex;
