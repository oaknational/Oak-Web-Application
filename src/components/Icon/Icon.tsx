import { FC } from "react";
import styled, { css, useTheme } from "styled-components";

import { PixelSpacing } from "../../styles/theme";
import color, { ColorProps } from "../../styles/utils/color";
import Svg, { SvgProps } from "../Svg/Svg";
import size, { SizeProps } from "../../styles/utils/size";
import { ResponsiveValues } from "../../styles/utils/responsive";
import { IconSvgName } from "../SpriteSheet/IconSvgs";
import { GraphicSvgName } from "../SpriteSheet/GraphicSvgs";
import { LessonElementSvgName } from "../SpriteSheet/LessonElementSvgs";
import { box, BoxProps } from "../Box";

import useIconAnimation from "./useIconAnimation";

export type IconName = IconSvgName | GraphicSvgName | LessonElementSvgName;
type IconVariant = "minimal" | "brush";

type RotateValue = 0 | 180;
type RotateProps = { rotate?: RotateValue };
type IconOuterWrapperProps = { variant: IconVariant } & SizeProps &
  RotateProps &
  BoxProps;
const IconOuterWrapper = styled.span<IconOuterWrapperProps>`
  position: relative;
  display: inline-block;
  ${(props) =>
    typeof props.rotate === "number" &&
    css`
      transform: rotate(${props.rotate}deg);
    `}

  ${size}
  ${box}
`;

const IconWrapper = styled.span<BoxProps>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  ${box}
`;

export const BackgroundIcon = styled(Svg)<ColorProps>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  ${color}
`;

const SPECIAL_ICON_SVG_PROPS: Partial<Record<IconName, SvgProps>> = {
  ChevronDown: {
    name: "ChevronUp",
    $transform: "rotate(-180deg)",
  },
};

export type IconSize = ResponsiveValues<PixelSpacing>;
type IconProps = Partial<IconOuterWrapperProps> &
  BoxProps & {
    name: IconName;
    variant?: IconVariant;
    /**
     * size in pixels is the value for width and height if they are not separately provided
     */
    size?: IconSize;
    width?: IconSize;
    height?: IconSize;
    animateTo?: IconName;
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
    $pa = variant === "brush" ? 4 : undefined,
    $color,
    $background,
    animateTo,
    ...rootProps
  } = props;

  const outerWidth = width || size;
  const outerHeight = height || size;

  const theme = useTheme();
  /**
   * by default, the color will take the css `color` value of its closest ancester
   * (because in the SVG, the color is set to `currentColor`). Use `$color` prop to
   * override this value.
   */
  const $foregroundColor =
    $color ||
    (typeof $background === "string"
      ? theme.contrastColors[$background]
      : Array.isArray($background)
      ? $background.map(($) => ($ ? theme.contrastColors[$] : null))
      : undefined);

  const svgProps = SPECIAL_ICON_SVG_PROPS[name] ?? { name };

  const { stage, rotate, scale } = useIconAnimation({
    shouldAnimate: Boolean(animateTo),
  });

  if (stage === "out" && animateTo) {
    svgProps.name = animateTo;
  }

  return (
    <IconOuterWrapper
      aria-hidden={true}
      variant={variant}
      $height={outerHeight}
      $minHeight={outerHeight}
      $width={outerWidth}
      $minWidth={outerWidth}
      {...rootProps}
    >
      {variant === "brush" && (
        <BackgroundIcon name="icon-brush-background" $color={$background} />
      )}
      <IconWrapper
        $pa={$pa}
        $color={$foregroundColor}
        $transition="transform 0.8s ease-in-out"
        $transform={rotate}
      >
        <Svg
          {...svgProps}
          $transition="transform 0.4s ease-out"
          $transform={scale}
        />
      </IconWrapper>
    </IconOuterWrapper>
  );
};

export default Icon;
