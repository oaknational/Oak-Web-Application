import Image, { ImageProps } from "next/image";
import styled from "styled-components";

import { box, BoxProps } from "../SharedComponents/Box";

export type OakImageProps = ImageProps & BoxProps;
/**
 * OakImage is a wrapper round next/image which adds convenience style
 * props to the api
 */
const OakImage = styled(Image)`
  ${box}
`;

export default OakImage;
