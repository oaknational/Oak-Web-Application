import { FC } from "react";
import styled from "styled-components";

import color, { ColorProps } from "@/styles/utils/color";
import opacity, { OpacityProps } from "@/styles/utils/opacity";
import { margin, MarginProps } from "@/styles/utils/spacing";
import typography, { TypographyProps } from "@/styles/utils/typography";

const HEADING_TAGS = ["div", "h1", "h2", "h3", "h4", "h5", "h6"] as const;
export type HeadingTag = (typeof HEADING_TAGS)[number];
type HeadingTagProps = {
  children?: React.ReactNode;
  id?: string;
  tag: HeadingTag;
  ariaLabel?: string;
  ariaHidden?: boolean;
};
export function getNextHeadingTag(tag: HeadingTag): HeadingTag {
  const index = HEADING_TAGS.findIndex((headingTag) => headingTag === tag);

  const nextTag = HEADING_TAGS[index + 1];

  if (!nextTag) {
    return tag;
  }

  return nextTag;
}

export const HeadingTagComponent: FC<HeadingTagProps> = (props) => {
  const { tag, ariaLabel, ariaHidden, ...otherProps } = props;
  const Tag = tag;
  return (
    <Tag {...otherProps} aria-label={ariaLabel} aria-hidden={ariaHidden} />
  );
};

/**
 * @deprecated use OakHeadingProps from oak-components instead
 */
export type HeadingProps = TypographyProps &
  HeadingTagProps &
  ColorProps &
  OpacityProps &
  MarginProps;

/**
 * @deprecated use OakHeading from oak-components instead
 */
const Heading = styled(HeadingTagComponent)<HeadingProps>`
  ${typography}
  ${margin}
  ${color}
  ${opacity}
`;

export default Heading;
