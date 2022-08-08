import { FC } from "react";
import styled, { css, useTheme } from "styled-components";

import { OakColorName, PixelSpacing } from "../../styles/theme";
import spacing, { SpacingProps } from "../../styles/utils/spacing";
import color, { ColorProps } from "../../styles/utils/color";
import { SvgProps } from "../SpriteSheet/getSvgId";
import Svg from "../Svg/Svg";

import Download from "./Download.icon";
import Home from "./Home.icon";
import ChevronRight from "./ChevronRight.icon";
import ChevronDown from "./ChevronDown.icon";
import OpenExternal from "./OpenExternal.icon";
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

export const ICON_NAMES = [
  "Download",
  "Home",
  "ArrowRight",
  "ChevronRight",
  "ChevronDown",
  "OpenExternal",
  "Share",
  "Star",
  "Search",
  "Newspaper",
  "Tick",
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
] as const;
export type IconName = typeof ICON_NAMES[number];
export const iconSymbols: Record<IconName, FC<SvgProps>> = {
  Download,
  Home,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  OpenExternal,
  Share,
  Star,
  Search,
  Newspaper,
  Tick,
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
};
export const icons: Record<IconName, FC> = ICON_NAMES.reduce((accum, name) => {
  accum[name] = () => <Svg name={name} />;

  return accum;
}, {} as Record<IconName, FC>);

type IconVariant = "minimal" | "brush";
type SizeProps = { height: number; width: number };
const size = css<SizeProps>`
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
`;

type RotateValue = 0 | 180;
type TransformProps = { rotate?: RotateValue; flip?: boolean };
const IconOuterWrapper = styled.span<
  SizeProps & TransformProps & { variant: IconVariant }
>`
  transform: rotate(${(props) => props.rotate}deg);
  transform: scaleY(${(props) => (props.flip ? -1 : 1)});
  display: inline-flex;
  align-items: center;
  justify-content: center;
  ${size}
`;

const IconWrapper = styled.span<SpacingProps & ColorProps>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  ${color}
  ${spacing}
`;

const IconBackground = styled.span<ColorProps>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  ${color}
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
    $color,
    $background,
    ...rootProps
  } = props;
  const IconComponent = icons[name];

  const outerWidth = width || size;
  const outerHeight = height || size;

  const theme = useTheme();
  const $foregroundColor =
    $color || ($background ? theme.contrastColors[$background] : undefined);

  return (
    <IconOuterWrapper
      variant={variant}
      height={outerHeight}
      width={outerWidth}
      {...rootProps}
    >
      {variant === "brush" && (
        <IconBackground $color={$background}>
          <Svg name="icon-brush-background" />
        </IconBackground>
      )}
      <IconWrapper $pa={$pa} $color={$foregroundColor}>
        <IconComponent />
      </IconWrapper>
    </IconOuterWrapper>
  );
};

export default Icon;
