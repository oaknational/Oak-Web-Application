import styled from "styled-components";

import background, { BackgroundProps } from "../../styles/utils/background";
import spacing, { SpacingProps } from "../../styles/utils/spacing";

/**
 * @todo ts should be able to infer card props from e.g. 'spacing'
 * and 'background' util types
 */
type CardProps = SpacingProps & BackgroundProps;
const Card = styled.div<CardProps>`
  ${spacing}
  ${background}
  min-height: 200px;
  border-radius: 12px;
`;

Card.defaultProps = {
  pa: 24,
  // background: "inYourFace",
};

export default Card;
