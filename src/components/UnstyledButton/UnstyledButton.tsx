import styled from "styled-components";

import typography from "../../styles/utils/typography";

const UnstyledButton = styled.button`
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  text-align: left;
  font-family: unset;
  ${typography}
`;

export default UnstyledButton;
