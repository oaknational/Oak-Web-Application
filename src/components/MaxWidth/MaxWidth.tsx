import styled from "styled-components";

import Flex from "../Flex";

const MaxWidth = styled(Flex)`
  flex-direction: column;
  flex-grow: 1;
  padding: 0 12px;
  width: 100%;
  align-self: center;
  justify-content: "center";
  align-items: "center";
`;

/**
 * This component will visually hide its contents but will still be available
 * to screen readers, assitive technology, and scrapers.
 * ## Usage
 * Use this component in places where content shouldn't be visible, but should
 * be accessible to assistive technology.
 */
MaxWidth.defaultProps = {
  $maxWidth: 1200,
};

export default MaxWidth;
