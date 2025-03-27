import { FC } from "react";
import styled, { css, useTheme } from "styled-components";
import { box } from "@/components/SharedComponents/Box";
import colorUtil from "@/styles/utils/color";
import sizeUtil from "@/styles/utils/size";
import transformUtil from "@/styles/utils/transform";
import transitionUtil from "@/styles/utils/transition";
import { padding } from "@/styles/utils/spacing";
import getColorByName from "@/styles/themeHelpers/getColorByName";
import responsive from "@/styles/utils/responsive";
import useIconAnimation from "./useIconAnimation";
import Svg from "@/components/SharedComponents/Svg";
import { UiIconName } from "@/image-data";

import type { BoxProps } from "@/components/SharedComponents/Box";
import type { ColorProps } from "@/styles/utils/color";
import type { SizeProps } from "@/styles/utils/size";
import type { TransformProps } from "@/styles/utils/transform";
import type { TransitionProps } from "@/styles/utils/transition";
import type { PaddingProps } from "@/styles/utils/spacing";
import type { OakColorName } from "@/styles/theme/types";
import type { ResponsiveValues } from "@/styles/utils/responsive";
import type { PixelSpacing } from "@/styles/theme/types";
import type { SvgProps } from "@/components/SharedComponents/Svg";

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

  ${sizeUtil}
  ${box}
  vertical-align: ${(props) => props.verticalAlign};
`;

const IconWrapper = styled.div<
  ColorProps & SizeProps & TransformProps & TransitionProps & PaddingProps
>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  ${responsive<ColorProps, OakColorName>(
    "color",
    (props) => props.$color,
    getColorByName,
  )}
  ${sizeUtil}
  ${transformUtil}
  ${transitionUtil}
  ${padding}
`;

export const BackgroundIcon = styled(Svg)<ColorProps>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  ${colorUtil}
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

  const theme = useTheme();

  // Handle foreground color safely to ensure it's a valid OakColorName or undefined
  let $foregroundColor: OakColorName | undefined = $color as
    | OakColorName
    | undefined;

  if (!$foregroundColor && $background) {
    if (typeof $background === "string") {
      $foregroundColor = theme.contrastColors[
        $background as OakColorName
      ] as OakColorName;
    } else if (Array.isArray($background)) {
      // Use first valid background color's contrast instead of mapping to an array
      const firstValidBackground = $background.find(
        (bg) => bg !== undefined && bg !== null,
      );
      $foregroundColor = firstValidBackground
        ? (theme.contrastColors[
            firstValidBackground as OakColorName
          ] as OakColorName)
        : undefined;
    }
  }

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
