import { FC } from "react";
import styled, { css } from "styled-components";

import getColorByName from "../../styles/themeHelpers/getColorByName";
import { OakColorName } from "../../styles/theme";
import { margin, MarginProps } from "../../styles/utils/spacing";

import ChevronRight from "./ChevronRight.icon";
import OpenExternal from "./OpenExternal.icon";
import Download from "./Download.icon";
import Share from "./Share.icon";
import Star from "./Star.icon";
import Search from "./Search.icon";
import Home from "./Home.icon";
import Tick from "./Tick.icon";
import ArrowRight from "./ArrowRight.icon";
import Hamburger from "./HamburgerIcon";

export const ICON_NAMES = [
  "ChevronRight",
  "OpenExternal",
  "Download",
  "Share",
  "Star",
  "Search",
  "Home",
  "Tick",
  "ArrowRight",
  "Hamburger",
] as const;
export type IconName = typeof ICON_NAMES[number];
export const icons: Record<IconName, FC> = {
  ChevronRight,
  OpenExternal,
  Download,
  Share,
  Star,
  Search,
  Home,
  Tick,
  ArrowRight,
  Hamburger,
};

type SizeProps = { height: number; width: number };
const size = css<SizeProps>`
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
`;

const IconOuterWrapper = styled.span<SizeProps & MarginProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  ${size}
  ${margin}
`;
const IconInnerWrapper = styled.span<SizeProps & { color?: OakColorName }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => getColorByName(props.color)};
  ${size}
`;

type IconProps = MarginProps & {
  name: IconName;
  /**
   * size in pixels is the value for width and height if they are not separately provided
   */
  size?: number;
  width?: number;
  height?: number;
  outerWidth?: number;
  outerHeight?: number;
  /**
   * by default, the color will take the css `color` value of its closest ancester
   * (because in the SVG, the color is set to `currentColor`). Use `color` prop to
   * override this value.
   */
  color?: OakColorName;
};
const Icon: FC<IconProps> = (props) => {
  const { name, size = 24, width, height, color, ...rootProps } = props;
  const IconComponent = icons[name];

  const innerWidth = width || size;
  const innerHeight = height || size;

  const outerHeight = props.outerHeight || innerHeight;
  const outerWidth = props.outerWidth || innerWidth;

  return (
    <IconOuterWrapper height={outerHeight} width={outerWidth} {...rootProps}>
      <IconInnerWrapper color={color} height={innerHeight} width={innerWidth}>
        <IconComponent />
      </IconInnerWrapper>
    </IconOuterWrapper>
  );
};

export default Icon;
