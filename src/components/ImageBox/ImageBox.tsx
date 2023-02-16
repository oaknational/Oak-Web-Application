import styled from "styled-components";

import imageSize, { ImageSizeProps } from "../../styles/utils/imageSize";
import Box, { BoxProps } from "../Box";

export type ImageBoxProps = BoxProps & ImageSizeProps;
/**
 * ImageBox sets allows you to set imageHeight and imaggeWidth, along with Box
 * props.
 *
 * ## Usage
 * This Component is used only as a container for an OakImage and allows you to
 * set the width and height of the image to any number. you must also set the
 * layout of the OakImage component to Fill
 *
 */
const ImageBox = styled(Box)<ImageBoxProps>`
  ${imageSize}
`;

export default ImageBox;
