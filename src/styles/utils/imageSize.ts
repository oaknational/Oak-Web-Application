import { css } from "styled-components";

import responsive, { ResponsiveValues } from "./responsive";
import { getRemUnits } from "./getRemUnits";

type ImageSizeValue = number | null;
export type ImageSizeValues = ResponsiveValues<ImageSizeValue>;

const parse = (value?: ImageSizeValue) => {
  return getRemUnits(value);
};

export type ImageSizeProps = {
  $imageWidth?: ImageSizeValues;
  $imageHeight?: ImageSizeValues;
};

const imageSize = css<ImageSizeProps>`
  ${responsive("width", (props) => props.$imageWidth, parse)}
  ${responsive("height", (props) => props.$imageHeight, parse)}
`;
export default imageSize;
