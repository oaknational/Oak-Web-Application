import styled from "styled-components";

import ellipsis from "../../styles/ellipsis";
import typography from "../../styles/utils/typography";
import { Span } from "../Typography";

const ButtonLabel = styled(Span)`
  ${typography}
  ${ellipsis}
`;

ButtonLabel.defaultProps = {
  $font: "heading-7",
};

export default ButtonLabel;
