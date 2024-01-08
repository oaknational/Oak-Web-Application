import styled from "styled-components";

import Flex, { FlexProps } from "@/components/SharedComponents/Flex";

export type CardProps = FlexProps;
const Card = styled(Flex)``;

Card.defaultProps = {
  $pa: 24,
  $flexDirection: "column",
  $flexGrow: 1,
  $position: "relative",
};

export default Card;
