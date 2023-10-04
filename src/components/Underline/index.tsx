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
  return (
    <UnderlineSpan
      data-testid={"underline"}
      // This is an empty box with a line under it, to indicate an answer would go here.
      role="presentation"
      title="An empty space to write an answer in"
    />
  );
};

export default Underline;
