import styled from "styled-components";

import border, { BorderProps } from "../../styles/utils/border";
import Flex from "../Flex/Flex";

/**
 * @todo ts should be able to infer card props from e.g. 'spacing'
 * and 'background' util types
 */

type CardProps = {
  minHeight?: number;
};

const Card = styled(Flex)<BorderProps & CardProps>`
  position: relative;
  min-height: ${(props) => props.minHeight}px;
  flex-grow: 1;
  ${border}
`;

Card.defaultProps = {
  pa: 24,
  flexDirection: "column",
  borderRadius: 12,
  minHeight: 200,
};

export default Card;
