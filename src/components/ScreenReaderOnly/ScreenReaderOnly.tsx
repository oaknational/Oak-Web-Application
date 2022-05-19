import { FC } from "react";
import styled from "styled-components";

const StyledScreenReaderOnly = styled.span`
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

/**
 *
 * @description This component will visually hide its contents but will still be available
 * to screen readers, assitive technology, and scrapers.
 */
const ScreenReaderOnly: FC = (props) => {
  return <StyledScreenReaderOnly {...props} />;
};

export default ScreenReaderOnly;
