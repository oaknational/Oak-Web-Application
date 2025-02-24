import { FC } from "react";
import styled, { css, useTheme } from "styled-components";

import useIconAnimation from "./useIconAnimation";

import { PixelSpacing } from "@/styles/theme";
import color, { ColorProps } from "@/styles/utils/color";
import size, { SizeProps } from "@/styles/utils/size";
import { ResponsiveValues } from "@/styles/utils/responsive";
import { UiIconName } from "@/image-data";
import Svg, { SvgProps } from "@/components/SharedComponents/Svg";
import { box, BoxProps } from "@/components/SharedComponents/Box";

export type IconName = UiIconName;
export type IconVariant = "minimal" | "brush" | "buttonStyledAsLink";

export const isIconVariant = (variant: string): variant is IconVariant =>
  ["minimal", "brush", "buttonStyledAsLink"].includes(variant);

type VerticalAlign = "baseline" | "bottom";

type RotateValue = 0 | 180;
type RotateProps = { rotate?: RotateValue };
type IconOuterWrapperProps = {
  variant: IconVariant;
  verticalAlign?: VerticalAlign;
} & SizeProps &
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
  vertical-align: ${(props) => props.verticalAlign};
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
  "chevron-down": {
    name: "chevron-up",
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
    verticalAlign?: VerticalAlign;
  };
/**
 * The `<Icon />` component should be the go to component wherever you seen an
 * icon.
 * The exception to this is if the icon is clickable, in which case you should
 * use an `<IconButton />` component (which uses `<Icon />` internally).
 * @deprecated use OakIcon from oak-components instead
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
    verticalAlign = "baseline",
    ...rootProps
  } = props;

  const outerWidth = width || size;
  const outerHeight = height || size;

  //const theme = useTheme();
  /**
   * by default, the color will take the css `color` value of its closest ancester
   * (because in the SVG, the color is set to `currentColor`). Use `$color` prop to
   * override this value.
   */
  const $foregroundColor = $color;

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
      verticalAlign={verticalAlign}
      {...rootProps}
    >
      {variant === "brush" && (
        <BackgroundIcon name="icon-background" $color={$background} />
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
          $transform={svgProps.$transform || scale}
        />
      </IconWrapper>
    </IconOuterWrapper>
  );
};

export default Icon;
