import styled from "styled-components";

import Flex from "../Flex";

/**
 * BackgroundGraphic is a component for any presentational illustration
 * which sits behind content.
 *
 * ## Usage
 *
 * It should wrap around the content that you want it to sit behind.
 *
 * ## Note
 *
 * Currently it takes no options, but as we implement more pages, it should
 * take props to select the graphic, the size, and other options.
 */
const BackgroundGraphic = styled(Flex)`
  background-image: url("images/pen/loopLarge.svg");
  background-size: 66%;
  background-repeat: no-repeat;
  background-position: center center;
`;

BackgroundGraphic.defaultProps = {
  $flexDirection: "column",
};

export default BackgroundGraphic;
