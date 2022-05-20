import { FC } from "react";
import styled from "styled-components";

const StyledVisuallyHidden = styled.div`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

const VisuallyHidden: FC = (props) => {
  return <StyledVisuallyHidden {...props} />;
};

export default VisuallyHidden;
