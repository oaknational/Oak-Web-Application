import styled from "styled-components";

import border, { BorderProps } from "../../styles/utils/border";
import Flex from "../Flex/Flex";

/**
 * @todo ts should be able to infer card props from e.g. 'spacing'
 * and 'background' util types
 */

const Card = styled(Flex)<BorderProps>`
  ${border}
  min-height: 200px;
  flex-grow: 1;
`;

Card.defaultProps = {
  pa: 24,
  flexDirection: "column",
  borderRadius: 12,
};

export default Card;
