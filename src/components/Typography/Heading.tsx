import { CSSProperties, FC } from "react";
import styled from "styled-components";

import { OakFontName } from "../../styles/theme";
import color from "../../styles/utils/color";
import { ResponsiveValues } from "../../styles/utils/responsive";
import { margin, MarginProps } from "../../styles/utils/spacing";
import typography, { TypographyProps } from "../../styles/utils/typography";

export const HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

export type HeadingTag = typeof HEADING_TAGS[number];

export type HeadingTagProps = {
  tag: HeadingTag;
  textAlign?: CSSProperties["textAlign"];
};
export const HeadingTagComponent: FC<HeadingTagProps> = (props) => {
  const { tag, ...otherProps } = props;
  const Tag = tag;
  return <Tag {...otherProps} />;
};

const headingSizes = {
  56: "56px",
  48: "48px",
  40: "40px",
  32: "32px",
  24: "24px",
  20: "20px",
  16: "16px",
};
export type HeadingFontSize = keyof typeof headingSizes;
const DEFAULT_HEADING_FONT: OakFontName = "heading";
export const headingDefaults = {
  $fontFamily: DEFAULT_HEADING_FONT,
  $lineHeight: 1.2,
};

export type HeadingProps = Omit<TypographyProps, "fontSize"> &
  HeadingTagProps & {
    $fontSize: ResponsiveValues<HeadingFontSize>;
  } & MarginProps;

const Heading = styled(HeadingTagComponent)<HeadingProps>`
  ${headingDefaults}
  ${margin}
  ${typography}
  ${color}
`;

Heading.defaultProps = headingDefaults;

export default Heading;
