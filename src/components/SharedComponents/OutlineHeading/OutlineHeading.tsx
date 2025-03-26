import styled, { css } from "styled-components";

import color from "@/styles/utils/color";
import responsive, { ResponsiveValues } from "@/styles/utils/responsive";
import { margin } from "@/styles/utils/spacing";
import typography from "@/styles/utils/typography";
import {
  HeadingProps,
  HeadingTagComponent,
} from "@/components/SharedComponents/Typography/Heading.deprecated";

export const outlineShadow = `-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000}`;
const outlineShadowLight = `-1px -1px 0 #878787, 1px -1px 0 #878787, -1px 1px 0 #878787, 1px 1px 0 #878787}`;

type OutlineHeadingProps = Omit<HeadingProps, "$fontSize">;
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
const OutlineHeading = styled(HeadingTagComponent)<
  OutlineHeadingProps & {
    $fontSize: OutlineSizeResponsive;
    $lightShadow?: boolean | null;
  }
>`
  color: white;
  text-shadow: ${(props) =>
    props.$lightShadow ? outlineShadowLight : outlineShadow};
  ${fontSize}
  ${margin}
  ${typography}
  ${color}
`;

// Apply the pa11y-ignore class when rendering
export default (
  props: OutlineHeadingProps & {
    $fontSize: OutlineSizeResponsive;
    $lightShadow?: boolean | null;
  },
) => <OutlineHeading className="pa11y-ignore" {...props} />;
