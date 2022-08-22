import styled from "styled-components";

import ellipsis from "../../styles/ellipsis";
import { Span } from "../Typography";

const ButtonLabel = styled(Span)`
  ${ellipsis}
`;

ButtonLabel.defaultProps = {
  $fontFamily: "ui",
};

export default ButtonLabel;
