import { MouseEventHandler } from "react";
import styled, { css } from "styled-components";

import background, { BackgroundProps } from "@/styles/utils/background";
import border, { BorderProps } from "@/styles/utils/border";
import color, { ColorProps } from "@/styles/utils/color";
import cover, { CoverProps } from "@/styles/utils/cover";
import display, { DisplayProps } from "@/styles/utils/display";
import dropShadow, { DropShadowProps } from "@/styles/utils/dropShadow";
import opacity, { OpacityProps } from "@/styles/utils/opacity";
import position, { PositionProps } from "@/styles/utils/position";
import size, { SizeProps } from "@/styles/utils/size";
import spacing, { SpacingProps } from "@/styles/utils/spacing";
import transform, { TransformProps } from "@/styles/utils/transform";
import transition, { TransitionProps } from "@/styles/utils/transition";
import typography, { TypographyProps } from "@/styles/utils/typography";
import zIndex, { ZIndexProps } from "@/styles/utils/zIndex";
import customScrollbar from "@/styles/utils/customScrollbar";

type HTMLProps = {
  onClick?: MouseEventHandler;
};

export type BoxProps = { children?: React.ReactNode } & CoverProps &
  PositionProps &
  SizeProps &
  SpacingProps &
  BackgroundProps &
  ColorProps &
  BorderProps &
  DropShadowProps &
  DisplayProps &
  ZIndexProps &
  TransformProps &
  TransitionProps &
  TypographyProps &
  OpacityProps &
  HTMLProps;

export const box = css<BoxProps>`
  ${cover}
  ${position}
  ${size}
  ${spacing}
  ${background}
  ${color}
  ${border}
  ${dropShadow}
  ${display}
  ${zIndex}
  ${transform}
  ${transition}
  ${opacity}
  ${typography}
  ${customScrollbar}
  ${(props) =>
    /* onClick might be passed in the useClickableCard pattern */
    props.onClick &&
    css`
      &:hover {
        cursor: pointer;
      }
    `}
`;

/**
 * Box exposes position, size, spacing, and background props on a div.
 */
const Box = styled.div<BoxProps>`
  ${box}
`;

export default Box;
