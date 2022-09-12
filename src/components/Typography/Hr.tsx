import styled from "styled-components";

import { OakColorName } from "../../styles/theme";
import getColorByName from "../../styles/themeHelpers/getColorByName";
import { margin, MarginProps } from "../../styles/utils/spacing";

type BorderWidth = 1 | 2;

type HrProps = MarginProps & {
  $color?: OakColorName;
  thickness?: BorderWidth;
};

const Hr = styled.hr<HrProps>`
  border-color: transparent;
  background-color: transparent;
  border-top-color: ${(props) => getColorByName(props.$color)};
  border-width: ${(props) => props.thickness}px;
  ${margin};
`;
/**
 * Hr is a just a styled `hr` (Horizontal rule), which takes color and margin props.
 */
Hr.defaultProps = {
  $color: "grey2",
  $mv: 24,
};

export default Hr;
