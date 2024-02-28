import styled from "styled-components";

import Flex from "@/components/SharedComponents/Flex.deprecated";

/**
 * This component will provide a default maxWidth and ph value, it take Flex props.
 * ## Usage
 * Use this component on pages to limit the max-width to a specific container.
 * This will make it easier to create full browser width or custom width containers on the same page
 * with different background colors / image url.
 */
const MaxWidth = styled(Flex)``;

MaxWidth.defaultProps = {
  $maxWidth: [480, 1280],
  $ph: [0, 12],
  $flexDirection: "column",
  $flexGrow: 1,
  $width: "100%",
  // $justifyContent: "center",
  // $alignItems: "center",
  $mh: "auto",
};

export default MaxWidth;
