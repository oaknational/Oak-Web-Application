import styled from "styled-components";

import background, { BackgroundProps } from "../../styles/utils/background";
import border, { BorderProps } from "../../styles/utils/border";
import display, { DisplayProps } from "../../styles/utils/display";
import dropShadow, { DropShadowProps } from "../../styles/utils/dropShadow";
import position, { PositionProps } from "../../styles/utils/position";
import size, { SizeProps } from "../../styles/utils/size";
import spacing, { SpacingProps } from "../../styles/utils/spacing";
import transform, { TransformProps } from "../../styles/utils/transform";
import zIndex, { ZIndexProps } from "../../styles/utils/zIndex";

export type BoxProps = PositionProps &
  SizeProps &
  SpacingProps &
  BackgroundProps &
  BorderProps &
  DropShadowProps &
  DisplayProps &
  ZIndexProps &
  TransformProps;

/**
 * Box exposes position, size, spacing, and background props on a div.
 */
const Box = styled.div<BoxProps>`
  ${position}
  ${size}
  ${spacing}
  ${background}
  ${border}
  ${dropShadow}
  ${display}
  ${zIndex}
  ${transform}
`;

export default Box;
