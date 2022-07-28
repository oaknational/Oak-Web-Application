import { FC } from "react";
import styled, { css } from "styled-components";

import { OakColorName, PixelSpacing } from "../../styles/theme";
import spacing, { SpacingProps } from "../../styles/utils/spacing";
import color, { ColorProps } from "../../styles/utils/color";
import background, { BackgroundProps } from "../../styles/utils/background";

import ChevronRight from "./ChevronRight.icon";
import ChevronDown from "./ChevronDown.icon";
import OpenExternal from "./OpenExternal.icon";
import Download from "./Download.icon";
import Share from "./Share.icon";
import Star from "./Star.icon";
import Search from "./Search.icon";
import Home from "./Home.icon";
import Newspaper from "./Newspaper.icon";
import Tick from "./Tick.icon";
import ArrowRight from "./ArrowRight.icon";
import Play from "./Play.icon";
import GraduationCap from "./GraduationCap.icon";
import University from "./University.icon";
import PaperPlane from "./PaperPlane.icon";
import Instagram from "./Instagram.icon";
import Twitter from "./Twitter.icon";
import Facebook from "./Facebook.icon";
import Close from "./Close.icon";

export const ICON_NAMES = [
  "ChevronRight",
  "ChevronDown",
  "OpenExternal",
  "Download",
  "Share",
  "Star",
  "Search",
  "Home",
  "Newspaper",
  "Tick",
  "ArrowRight",
  "Play",
  "GraduationCap",
  "University",
  "PaperPlane",
  "Instagram",
  "Facebook",
  "Twitter",
  "Close",
] as const;
export type IconName = typeof ICON_NAMES[number];
export const icons: Record<IconName, FC> = {
  ChevronRight,
  ChevronDown,
  OpenExternal,
  Download,
  Share,
  Star,
  Search,
  Home,
  Newspaper,
  Tick,
  ArrowRight,
  Play,
  GraduationCap,
  University,
  PaperPlane,
  Instagram,
  Facebook,
  Twitter,
  Close,
};

type SizeProps = { height: number; width: number };
const size = css<SizeProps>`
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
`;

const IconOuterWrapper = styled.span<
  SizeProps & SpacingProps & ColorProps & BackgroundProps
>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  mask-image: url("/buttons/icon-button-background.svg");
  mask-position: center;
  mask-repeat: no-repeat;
  mask-size: 100% 100%;
  ${size}
  ${spacing}
  ${color}
  ${background}
`;

type IconProps = SpacingProps & {
  name: IconName;
  /**
   * size in pixels is the value for width and height if they are not separately provided
   */
  size?: PixelSpacing;
  width?: PixelSpacing;
  height?: PixelSpacing;
  /**
   * by default, the color will take the css `color` value of its closest ancester
   * (because in the SVG, the color is set to `currentColor`). Use `$color` prop to
   * override this value.
   */
  $color?: OakColorName;
  $background?: OakColorName;
};
/**
 * The `<Icon />` component should be the go to component wherever you seen an
 * icon.
 * The exception to this is if the icon is clickable, in which case you should
 * use an `<IconButton />` component (which uses `<Icon />` internally).
 */
const Icon: FC<IconProps> = (props) => {
  const { name, size = 24, width, height, $pa = 8, ...rootProps } = props;
  const IconComponent = icons[name];

  const outerWidth = width || size;
  const outerHeight = height || size;

  return (
    <IconOuterWrapper
      height={outerHeight}
      width={outerWidth}
      $pa={$pa}
      {...rootProps}
    >
      <IconComponent />
    </IconOuterWrapper>
  );
};

export default Icon;
