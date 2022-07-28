import styled from "styled-components";

import Flex from "../Flex";

/**
 * This component will provide a default maxWidth and ph value, it take Flex props.
 * ## Usage
 * Use this component on pages to limit the max-width to a specific container.
 * This will make it easier to create full browser width or custom width containers on the same page
 * with different background colors / image url.
 */
const MaxWidth = styled(Flex)`
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  align-self: center;
  justify-content: "center";
  align-items: "center";
`;

MaxWidth.defaultProps = {
  maxWidth: 1200,
  ph: 12,
};

export default MaxWidth;
