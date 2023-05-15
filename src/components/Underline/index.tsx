import React from "react";
import styled from "styled-components";

const UnderlineSpan = styled.span`
  display: inline-block;
  border-bottom: 2px solid black;
  padding-bottom: 2px;
  min-width: 48px;
  position: relative;
`;

const Underline = () => {
  return <UnderlineSpan data-testid={"underline"} />;
};

export default Underline;
