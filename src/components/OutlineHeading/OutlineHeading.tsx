import styled, { css } from "styled-components";

import color from "../../styles/utils/color";
import responsive, { ResponsiveValues } from "../../styles/utils/responsive";
import { margin } from "../../styles/utils/spacing";
import typography from "../../styles/utils/typography";
import {
  headingDefaults,
  HeadingProps,
  HeadingTagComponent,
} from "../Typography/Heading";

export const outlineShadow =
  "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000";

type OutlineHeadingProps = Omit<HeadingProps, "$fontSize">;
type OutlineSize = 40 | 50 | 100 | 120;
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
const OutlineHeading = styled(HeadingTagComponent).attrs({
  className: "pa11y-ignore",
})<OutlineHeadingProps & { $fontSize: OutlineSizeResponsive }>`
  color: white;
  text-shadow: ${outlineShadow};
  ${fontSize}
  ${headingDefaults}
  ${margin}
  ${typography}
  ${color}
`;

export default OutlineHeading;
