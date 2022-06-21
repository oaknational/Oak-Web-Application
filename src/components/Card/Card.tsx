import styled from "styled-components";

import background, { BackgroundProps } from "../../styles/utils/background";
import position from "../../styles/utils/position";
import spacing, { SpacingProps } from "../../styles/utils/spacing";
import { BoxProps } from "../Box";

/**
 * @todo ts should be able to infer card props from e.g. 'spacing'
 * and 'background' util types
 */
export type CardProps = SpacingProps & BackgroundProps & BoxProps;
const Card = styled.div<CardProps>`
  ${spacing}
  ${background}
  ${position}
  min-height: 200px;
  border-radius: 12px;
  flex-grow: 1;
`;

Card.defaultProps = {
  pa: 24,
  // background: "inYourFace",
};

export default Card;
