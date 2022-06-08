import React, { FC } from "react";
import styled, { css } from "styled-components";

import display, { DisplayProps } from "../../styles/utils/display";
import { margin, MarginProps } from "../../styles/utils/spacing";
import typography, {
  heading,
  HeadingSize,
  text,
  TextSize,
  TypographyProps,
} from "../../styles/utils/typography";

type BaseTextProps = MarginProps & TypographyProps & DisplayProps;
const baseTextStyles = css<BaseTextProps>`
  ${typography}
  font-family: inherit;
  font-weight: inherit;
  margin: 0;
  ${margin}
  ${display}
`;

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

type HeadingProps = BaseTextProps & HeadingTagProps & { size: HeadingSize };

export const Heading = styled(HeadingTag)<HeadingProps>`
  ${baseTextStyles}
  ${heading}
`;

type TextProps = BaseTextProps & {
  size?: TextSize;
  lineClamp?: number;
};
export const Text = styled.p<TextProps>`
  ${baseTextStyles}
  ${text}
`;

type SpanProps = BaseTextProps;
export const Span = styled.span<SpanProps>`
  color: inherit;
  ${baseTextStyles}
`;
