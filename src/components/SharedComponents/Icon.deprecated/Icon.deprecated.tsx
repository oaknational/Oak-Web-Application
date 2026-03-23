import { OakBox, OakBoxProps } from "@oaknational/oak-components";
import { CSSProperties, FC } from "react";
import styled, { css } from "styled-components";

import useIconAnimation from "./useIconAnimation";

import { PixelSpacing } from "@/styles/theme";
import { getRemUnits } from "@/styles/utils/getRemUnits";
import responsive, { ResponsiveValues } from "@/styles/utils/responsive";
import { UiIconName } from "@/image-data";
import Svg, { SvgProps } from "@/components/SharedComponents/Svg";

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
  $iconWidth?: ResponsiveValues<PixelSpacing>;
  $iconMinWidth?: ResponsiveValues<PixelSpacing>;
  $iconHeight?: ResponsiveValues<PixelSpacing>;
  $iconMinHeight?: ResponsiveValues<PixelSpacing>;
} & RotateProps &
  OakBoxProps;
const IconOuterWrapper = styled(OakBox).attrs({ as: "span" })<IconOuterWrapperProps>`
  position: relative;
  display: inline-block;
  ${(props) =>
    typeof props.rotate === "number" &&
    css`
      transform: rotate(${props.rotate}deg);
    `}

  ${responsive("width", (props) => props.$iconWidth, getRemUnits)}
  ${responsive("min-width", (props) => props.$iconMinWidth, getRemUnits)}
  ${responsive("height", (props) => props.$iconHeight, getRemUnits)}
  ${responsive("min-height", (props) => props.$iconMinHeight, getRemUnits)}
  vertical-align: ${(props) => props.verticalAlign};
`;

const IconWrapper = styled(OakBox).attrs({ as: "span" })<OakBoxProps>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export const BackgroundIcon = styled(Svg)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const AnimatedSvg = styled(Svg)`
  transition: transform 0.4s ease-out;
`;

const SPECIAL_ICON_SVG_PROPS: Partial<Record<IconName, SvgProps>> = {
  "chevron-down": {
    name: "chevron-up",
    $transform: "rotate(-180deg)",
  },
};

export type IconSize = ResponsiveValues<PixelSpacing>;
const getContrastingIconColor = (
  background: string | undefined,
): OakBoxProps["$color"] => {
  switch (background) {
    case undefined:
    case "transparent":
      return undefined;
    case "bg-inverted":
    case "navy":
    case "navy110":
    case "navy120":
    case "bg-decorative1-main":
    case "bg-decorative2-main":
    case "bg-decorative3-main":
    case "bg-decorative4-main":
    case "bg-decorative5-main":
    case "bg-decorative6-main":
      return "icon-inverted";
    default:
      return "icon-primary";
  }
};

type IconProps = Omit<
  OakBoxProps,
  "$background" | "$color" | "$height" | "$minHeight" | "$width" | "$minWidth"
> & {
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
  $background?: OakBoxProps["$background"];
  $color?: OakBoxProps["$color"];
  style?: CSSProperties;
  className?: string;
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
  const solidBackground =
    typeof $background === "string" ? $background : undefined;
  const foregroundColor = $color ?? getContrastingIconColor(solidBackground);
  const padding =
    typeof $pa === "number"
      ? (`spacing-${$pa}` as OakBoxProps["$pa"])
      : $pa;

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
      $iconHeight={outerHeight}
      $iconMinHeight={outerHeight}
      $iconWidth={outerWidth}
      $iconMinWidth={outerWidth}
      verticalAlign={verticalAlign}
      {...rootProps}
    >
      {variant === "brush" && (
        <BackgroundIcon name="icon-background" $color={$background} />
      )}
      <IconWrapper
        $pa={padding}
        $color={foregroundColor}
        style={{ transition: "transform 0.8s ease-in-out" }}
        $transform={rotate}
      >
        <AnimatedSvg
          {...svgProps}
          $transform={svgProps.$transform || scale}
        />
      </IconWrapper>
    </IconOuterWrapper>
  );
};

export default Icon;
