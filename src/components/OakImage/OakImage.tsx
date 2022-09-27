import Image, { ImageProps } from "next/future/image";
import styled from "styled-components";

import { box, BoxProps } from "../Box";

export type OakImageProps = ImageProps & BoxProps;
/**
 * OakImage is a wrapper round next/future/image which adds convenience style
 * props to the api
 */
const OakImage = styled(Image)`
  ${box}
`;

export default OakImage;
