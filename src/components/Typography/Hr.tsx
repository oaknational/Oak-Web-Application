import styled from "styled-components";

import { OakColorName } from "../../styles/theme";
import getColorByName from "../../styles/themeHelpers/getColorByName";
import { margin, MarginProps } from "../../styles/utils/spacing";

type HrProps = MarginProps & { color?: OakColorName };

const Hr = styled.hr<HrProps>`
  border-color: transparent;
  background-color: transparent;
  border-top-color: ${(props) => getColorByName(props.color)};
  ${margin}
`;

Hr.defaultProps = {
  color: "grey2",
  mv: 24,
};

export default Hr;
