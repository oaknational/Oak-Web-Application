import { FC } from "react";
import styled from "styled-components";

import color, { ColorProps } from "../../styles/utils/color";
import opacity, { OpacityProps } from "../../styles/utils/opacity";
import { margin, MarginProps } from "../../styles/utils/spacing";
import typography, { TypographyProps } from "../../styles/utils/typography";

const HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;
export type HeadingTag = typeof HEADING_TAGS[number];
type HeadingTagProps = {
  tag: HeadingTag;
};
export const HeadingTagComponent: FC<HeadingTagProps> = (props) => {
  const { tag, ...otherProps } = props;
  const Tag = tag;
  return <Tag {...otherProps} />;
};

export type HeadingProps = TypographyProps &
  HeadingTagProps &
  ColorProps &
  OpacityProps &
  MarginProps;

const Heading = styled(HeadingTagComponent)<HeadingProps>`
  ${typography}
  ${margin}
  ${color}
  ${opacity}
`;

export default Heading;
