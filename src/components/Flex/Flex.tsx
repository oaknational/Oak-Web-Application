import styled from "styled-components";

import background, { BackgroundProps } from "../../styles/utils/background";
import spacing, { SpacingProps } from "../../styles/utils/spacing";

const Flex = styled.div<SpacingProps & BackgroundProps>`
  ${spacing}
  ${background}
`;

export default Flex;
