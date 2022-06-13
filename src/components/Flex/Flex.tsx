import styled from "styled-components";

import Box, { BoxProps } from "../Box";
import background from "../../styles/utils/background";
import position from "../../styles/utils/position";
import spacing from "../../styles/utils/spacing";
import flex, { FlexCssProps } from "../../styles/utils/flex";

export type FlexProps = FlexCssProps & BoxProps;
const Flex = styled(Box)<FlexProps>`
  ${flex}
  ${spacing}
  ${background}
  ${position}
`;

export default Flex;
