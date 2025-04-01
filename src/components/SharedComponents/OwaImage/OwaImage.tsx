import Image, { ImageProps } from "next/image";
import styled from "styled-components";

import { box, BoxProps } from "@/components/SharedComponents/Box";

export type OwaImageProps = Omit<ImageProps, keyof BoxProps> & BoxProps;
/**
 * OwaImage is a wrapper round next/image which adds convenience style
 * props to the api
 */
const OwaImage = styled(Image)<OwaImageProps>`
  ${box}
`;

export default OwaImage;
