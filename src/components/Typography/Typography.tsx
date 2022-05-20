import React, { FC } from "react";
import styled from "styled-components";

import {
  heading,
  HeadingSize,
  text,
  TextSize,
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
