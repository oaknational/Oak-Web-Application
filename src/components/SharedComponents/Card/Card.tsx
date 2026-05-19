import styled from "styled-components";
import { OakFlex, OakFlexProps } from "@oaknational/oak-components";

export type CardProps = OakFlexProps;
const Card = styled(OakFlex)``;

Card.defaultProps = {
  $pa: "spacing-24",
  $flexDirection: "column",
  $flexGrow: 1,
  $position: "relative",
};

export default Card;
