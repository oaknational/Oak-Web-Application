import { css } from "styled-components";


import responsive, { ResponsiveValues } from "./responsive";

type ImageSizeValue = number | null
export type ImageSizeValues = ResponsiveValues<ImageSizeValue>;

const parse = (value?: ImageSizeValue) => {
    switch (typeof value) {
      case "string":
        return value;
      case "number":
        return `${value}px`;
    }
  };

export type ImageSizeProps = {
  $imageWidth?: ImageSizeValues;
  $imageHeight?: ImageSizeValues;

};

const imageSize = css<ImageSizeProps>`
  ${responsive("width", (props) => props.$imageWidth, parse)}
  ${responsive("height", (props) => props.$imageHeight, parse)}
`
export default imageSize;