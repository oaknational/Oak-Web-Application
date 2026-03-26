// Can uncomment and replace box with OakBox and oakBoxCss when CMSImage is removed
import { OakBoxProps, oakBoxCss } from "@oaknational/oak-components";
import Image, { ImageProps } from "next/image";
import styled from "styled-components";

// import { box, BoxProps } from "@/components/SharedComponents/Box";

// export type OwaImageProps = ImageProps & BoxProps;
export type OwaImageProps = ImageProps & OakBoxProps;

/**
 * OwaImage is a wrapper round next/image which adds convenience style
 * props to the api
 */
const OwaImage = styled(Image)<OwaImageProps>`
  ${oakBoxCss}
`;

export default OwaImage;
