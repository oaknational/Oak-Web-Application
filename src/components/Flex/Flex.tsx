import styled from "styled-components";

import Box, { BoxProps } from "../Box";
import background from "../../styles/utils/background";
import position from "../../styles/utils/position";
import spacing from "../../styles/utils/spacing";
import flex, { FlexCssProps } from "../../styles/utils/flex";

export type FlexProps = FlexCssProps & BoxProps;
/**
 * Flex sets `display: flex;` and exposes various flex props, along with Box
 * props
 */
const Flex = styled(Box)<FlexProps>`
  ${flex}
  ${spacing}
  ${background}
  ${position}
`;

export default Flex;
