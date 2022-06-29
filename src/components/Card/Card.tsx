import styled from "styled-components";

import Flex from "../Flex/Flex";

/**
 * @todo ts should be able to infer card props from e.g. 'spacing'
 * and 'background' util types
 */

const Card = styled(Flex)`
  min-height: 200px;
  border-radius: 12px;
  flex-grow: 1;
`;

Card.defaultProps = {
  pa: 24,
  flexDirection: "column",
};

export default Card;
