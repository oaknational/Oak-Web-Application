import { FC } from "react";
import styled, { css } from "styled-components";

import { ResponsiveValues } from "../../styles/utils/responsive";
import { margin, MarginProps } from "../../styles/utils/spacing";
import typography, { TypographyProps } from "../../styles/utils/typography";

export const HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

export type HeadingTag = typeof HEADING_TAGS[number];

type HeadingTagProps = {
  tag: HeadingTag;
};
const HeadingTag: FC<HeadingTagProps> = (props) => {
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
export const headingDefaults = css`
  font-weight: 600;
  font-family: Lexend, sans-serif;
  line-height: 1.2;
`;

type HeadingProps = Omit<TypographyProps, "fontSize"> &
  HeadingTagProps & {
    fontSize: ResponsiveValues<HeadingFontSize>;
  } & MarginProps;

const Heading = styled(HeadingTag)<HeadingProps>`
  ${headingDefaults}
  ${margin}
  ${typography}
`;

export default Heading;
