import styled from "styled-components";

import Box, { BoxProps } from "../Box";
import background from "../../styles/utils/background";
import position from "../../styles/utils/position";
import spacing from "../../styles/utils/spacing";
import flex, { FlexCssProps } from "../../styles/utils/flex";
import border, { BorderProps } from "../../styles/utils/border";
import display, { DisplayProps } from "../../styles/utils/display";

export type FlexProps = FlexCssProps & BoxProps & BorderProps & DisplayProps;
/**
 * Flex sets `display: flex;` and exposes various flex props, along with Box
 * props
 */
const Flex = styled(Box)<FlexProps>`
  ${flex}
  ${display}
  ${spacing}
  ${background}
  ${position}
  ${border}
`;

export default Flex;
