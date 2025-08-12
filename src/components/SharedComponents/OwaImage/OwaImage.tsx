import Image, { ImageProps } from "next/image";
import styled from "styled-components";

import { box, BoxProps } from "@/components/SharedComponents/Box";

export type OwaImageProps = ImageProps & BoxProps;
/**
 * OwaImage is a wrapper round next/image which adds convenience style
 * props to the api
 */
const OwaImage = styled(Image)<BoxProps>`
  ${box}
`;

export default OwaImage;
