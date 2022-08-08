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
import IllustrationClassroom from "./IllustrationClassroom.icon";
import IllustrationStayUpToDate from "./IllustrationStayUpToDate.icon";
import Hamburger from "./Hamburger.icon";

export const ICON_NAMES = [
  "ChevronRight",
  "ChevronDown",
  "OpenExternal",
  "Download",
  "Share",
  "Star",
  "Search",
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
  "IllustrationClassroom",
  "IllustrationStayUpToDate",
  "Hamburger",
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
  IllustrationClassroom,
  IllustrationStayUpToDate,
  Hamburger,
};

type IconVariant = "minimal" | "brush";
type SizeProps = { height: number; width: number };
const size = css<SizeProps>`
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
`;

type RotateValue = 0 | 180;
type TransformProps = { rotate?: RotateValue; flip?: boolean };
const IconOuterWrapper = styled.span<
  SizeProps &
    SpacingProps &
    ColorProps &
    BackgroundProps &
    TransformProps & { variant: IconVariant }
>`
  transform: rotate(${(props) => props.rotate}deg);
  transform: scaleY(${(props) => (props.flip ? -1 : 1)});
  display: inline-flex;
  align-items: center;
  justify-content: center;
  ${(props) =>
    props.variant === "brush" &&
    css`
      mask-image: url("/buttons/icon-button-background.svg");
      mask-position: center;
      mask-repeat: no-repeat;
      mask-size: 100% 100%;
    `}
  ${size}
  ${spacing}
  ${color}
  ${background}
`;

type IconProps = SpacingProps & {
  name: IconName;
  variant?: IconVariant;
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
  const {
    name,
    variant = "minimal",
    size = 24,
    width,
    height,
    $pa = 8,
    ...rootProps
  } = props;
  const IconComponent = icons[name];

  const outerWidth = width || size;
  const outerHeight = height || size;

  return (
    <IconOuterWrapper
      variant={variant}
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
