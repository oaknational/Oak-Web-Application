import { FC } from "react";
import styled, { useTheme } from "styled-components";

import { OakColorName, PixelSpacing } from "../../styles/theme";
import spacing, { SpacingProps } from "../../styles/utils/spacing";
import color, { ColorProps } from "../../styles/utils/color";
import Svg from "../Svg/Svg";
import size, { SizeProps } from "../../styles/utils/size";
import { ResponsiveValues } from "../../styles/utils/responsive";
import { IconSvgName } from "../SpriteSheet/IconSvgs";
import { GraphicSvgName } from "../SpriteSheet/GraphicSvgs";
import { LessonElementSvgName } from "../SpriteSheet/LessonElementSvgs";

export type IconName = IconSvgName | GraphicSvgName | LessonElementSvgName;
type IconVariant = "minimal" | "brush";

type RotateValue = 0 | 180;
type TransformProps = { rotate?: RotateValue; flip?: boolean };
const IconOuterWrapper = styled.span<
  SizeProps & TransformProps & { variant: IconVariant } & SpacingProps
>`
  position: relative;
  display: inline-block;
  transform: rotate(${(props) => props.rotate}deg);
  transform: scaleY(${(props) => (props.flip ? -1 : 1)});
  ${size}
  ${spacing}
`;

const IconWrapper = styled.span<SpacingProps & ColorProps>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
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
  size?: ResponsiveValues<PixelSpacing>;
  width?: ResponsiveValues<PixelSpacing>;
  height?: ResponsiveValues<PixelSpacing>;
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
    $pa = variant === "brush" ? 4 : undefined,
    $color,
    $background,
    ...rootProps
  } = props;

  const outerWidth = width || size;
  const outerHeight = height || size;

  const theme = useTheme();
  const $foregroundColor =
    $color || ($background ? theme.contrastColors[$background] : undefined);

  return (
    <IconOuterWrapper
      variant={variant}
      $height={outerHeight}
      $minHeight={outerHeight}
      $width={outerWidth}
      $minWidth={outerWidth}
      {...rootProps}
    >
      {variant === "brush" && (
        <IconBackground $color={$background}>
          <Svg name="icon-brush-background" />
        </IconBackground>
      )}
      <IconWrapper $pa={$pa} $color={$foregroundColor}>
        <Svg name={name} />
      </IconWrapper>
    </IconOuterWrapper>
  );
};

export default Icon;
