import styled, { css } from "styled-components";
import { OakHeading, OakHeadingProps } from "@oaknational/oak-components";

import responsive, { ResponsiveValues } from "@/styles/utils/responsive";

export const outlineShadow = `-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000}`;
const outlineShadowLight = `-1px -1px 0 #878787, 1px -1px 0 #878787, -1px 1px 0 #878787, 1px 1px 0 #878787}`;

type OutlineHeadingProps = Omit<OakHeadingProps, "$fontSize">;
type OutlineSize = 24 | 32 | 40 | 50 | 60 | 100 | 120;
type OutlineSizeResponsive = ResponsiveValues<OutlineSize>;

const parse = (value?: unknown) => {
  switch (typeof value) {
    case "string":
      return value;
    case "number":
      return `${value}px`;
  }
};
const fontSize = css<{ $fontSize?: OutlineSizeResponsive }>`
  ${responsive("font-size", (props) => props.$fontSize, parse)}
`;

// Pa11y complains about the "color" being white on white
// Todo: use the theme to ensure the shadow color is the contrast color
const OutlineHeading = styled(OakHeading).attrs({
  className: "pa11y-ignore",
})<
  OutlineHeadingProps & {
    $fontSize: OutlineSizeResponsive;
    $lightShadow?: boolean | null;
  }
>`
  color: white;
  text-shadow: ${(props) =>
    props.$lightShadow ? outlineShadowLight : outlineShadow};
  ${fontSize}
`;

export default OutlineHeading;
