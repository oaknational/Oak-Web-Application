import { FC } from "react";
import styled from "styled-components";

import getColor from "../../styles/themeHelpers/getColor";
import { OakColorName } from "../../styles/theme";
import { margin, MarginProps } from "../../styles/utils/spacing";

import ChevronRight from "./ChevronRight.icon";
import OpenExternal from "./OpenExternal.icon";
import Download from "./Download.icon";
import Share from "./Share.icon";
import Star from "./Star.icon";
import Search from "./Search.icon";
import Home from "./Home.icon";

export const ICON_NAMES = [
  "ChevronRight",
  "OpenExternal",
  "Download",
  "Share",
  "Star",
  "Search",
  "Home",
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
};

const IconOuterWrapper = styled.span<MarginProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  ${margin}
`;
const IconInnerWrapper = styled.span<{ color?: OakColorName }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => getColor(props.color)};
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
  const { name, size = 24, width, height, color, ...marginProps } = props;
  const IconComponent = icons[name];

  const innerWidth = width || size;
  const innerHeight = height || size;

  const outerHeight = props.outerHeight || innerHeight;
  const outerWidth = props.outerWidth || innerWidth;

  return (
    <IconOuterWrapper
      style={{ height: `${outerHeight}px`, width: `${outerWidth}px` }}
      {...marginProps}
    >
      <IconInnerWrapper
        color={color}
        style={{ height: `${innerHeight}px`, width: `${innerWidth}px` }}
      >
        <IconComponent />
      </IconInnerWrapper>
    </IconOuterWrapper>
  );
};

export default Icon;
