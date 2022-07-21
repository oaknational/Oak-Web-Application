import { FC } from "react";
import styled, { css } from "styled-components";

import getColorByName from "../../styles/themeHelpers/getColorByName";
import { OakColorName, PixelSpacing } from "../../styles/theme";
import { margin, MarginProps } from "../../styles/utils/spacing";

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
import Worksheet from "./Worksheet.icon";
import LessonSlides from "./LessonSlides.icon";
import Video from "./Video.icon";
import Quiz from "./Quiz.icon";
import PenLookUp from "./PenLookUp.icon";

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
  "Worksheet",
  "Video",
  "LessonSlides",
  "Quiz",
  "PenLookUp",
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
  Worksheet,
  Video,
  LessonSlides,
  Quiz,
  PenLookUp,
};

type SizeProps = { height: number; width: number };
const size = css<SizeProps>`
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
`;

type TransformProps = { rotate?: number; flip?: boolean };

const IconOuterWrapper = styled.span<SizeProps & MarginProps & TransformProps>`
  transform: rotate(${(props) => props.rotate}deg);
  transform: scaleY(${(props) => (props.flip ? -1 : 1)});
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

type IconProps = MarginProps &
  TransformProps & {
    name: IconName;
    /**
     * size in pixels is the value for width and height if they are not separately provided
     */
    size?: PixelSpacing;
    width?: PixelSpacing;
    height?: PixelSpacing;
    outerWidth?: PixelSpacing;
    outerHeight?: PixelSpacing;
    rotate?: number;
    flip?: boolean;
    /**
     * by default, the color will take the css `color` value of its closest ancester
     * (because in the SVG, the color is set to `currentColor`). Use `color` prop to
     * override this value.
     */
    color?: OakColorName;
  };
/**
 * The `<Icon />` component should be the go to component wherever you seen an
 * icon.
 * The exception to this is if the icon is clickable, in which case you should
 * use an `<IconButton />` component (which uses `<Icon />` internally).
 */
const Icon: FC<IconProps> = (props) => {
  const {
    name,
    size = 24,
    width,
    height,
    color,
    rotate,
    flip,
    ...rootProps
  } = props;
  const IconComponent = icons[name];

  const innerWidth = width || size;
  const innerHeight = height || size;

  const outerHeight = props.outerHeight || innerHeight;
  const outerWidth = props.outerWidth || innerWidth;

  return (
    <IconOuterWrapper
      rotate={rotate}
      flip={flip}
      height={outerHeight}
      width={outerWidth}
      {...rootProps}
    >
      <IconInnerWrapper color={color} height={innerHeight} width={innerWidth}>
        <IconComponent />
      </IconInnerWrapper>
    </IconOuterWrapper>
  );
};

export default Icon;
