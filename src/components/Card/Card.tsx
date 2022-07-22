import styled from "styled-components";

import border, { BorderProps } from "../../styles/utils/border";
import Flex from "../Flex/Flex";

/**
 * @todo ts should be able to infer card props from e.g. 'spacing'
 * and 'background' util types
 */

const Card = styled(Flex)<BorderProps>`
  position: relative;
  flex-grow: 1;

  /* overflow: hidden; introduced to mantain border radius on card images  */
  overflow: hidden;
  ${border}
`;

Card.defaultProps = {
  pa: 24,
  flexDirection: "column",
  borderRadius: 12,
};

export default Card;
