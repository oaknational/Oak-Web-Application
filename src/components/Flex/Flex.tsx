import styled from "styled-components";

import background, { BackgroundProps } from "../../styles/utils/background";
import flex, { FlexCssProps } from "../../styles/utils/flex";
import position, { PositionProps } from "../../styles/utils/position";
import spacing, { SpacingProps } from "../../styles/utils/spacing";

export type FlexProps = FlexCssProps &
  SpacingProps &
  BackgroundProps &
  PositionProps;
const Flex = styled.div<FlexProps>`
  ${flex}
  ${spacing}
  ${background}
  ${position}
`;

export default Flex;
