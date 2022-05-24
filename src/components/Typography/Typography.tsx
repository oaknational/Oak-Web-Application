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

export const HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

export type HeadingTag = typeof HEADING_TAGS[number];

const RawHeading = styled.span`
  ${heading}
`;

type HeadingProps = {
  tag: HeadingTag;
  size: HeadingSize;
};

export const Heading: FC<HeadingProps> = (props) => {
  const { tag, ...htmlAttrs } = props;
  return <RawHeading as={tag} {...htmlAttrs} />;
};

type TextProps = {
  size?: TextSize;
};
export const Text = styled.p<TextProps>`
  ${text}
`;

type BaseTextProps = MarginProps & TypographyProps & DisplayProps;
const baseTextStyles = css<BaseTextProps>`
  font-family: inherit;
  font-weight: inherit;
  margin: 0;
  ${margin}
  ${typography}
  ${display}
`;

type SpanProps = BaseTextProps;
export const Span = styled.span<SpanProps>`
  color: inherit;
  ${baseTextStyles}
`;
