import styled from "styled-components";
import { OakSpan } from "@oaknational/oak-components";

import ellipsis from "@/styles/ellipsis";
import typography from "@/styles/utils/typography";

const ButtonLabel = styled(OakSpan)`
  display: inline-block;
  vertical-align: text-top;
  max-width: 100%;
  ${typography}
  ${ellipsis}
`;

ButtonLabel.defaultProps = {
  $font: "heading-7",
};

export default ButtonLabel;
