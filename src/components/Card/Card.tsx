import styled from "styled-components";

import border, { BorderProps } from "../../styles/utils/border";
import Flex from "../Flex/Flex";

const Card = styled(Flex)<BorderProps>`
  ${border}
`;

Card.defaultProps = {
  $pa: 24,
  $flexDirection: "column",
  $flexGrow: 1,
  $borderRadius: 12,
  $position: "relative",
};

export default Card;
