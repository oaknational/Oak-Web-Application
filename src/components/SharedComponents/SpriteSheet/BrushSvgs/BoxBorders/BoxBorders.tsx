import { FC } from "react";
import styled from "styled-components";
import { OakBox } from "@oaknational/oak-components";

import { BoxBorderTop } from "./BoxBorderTop";
import { BoxBorderRight } from "./BoxBorderRight";
import { BoxBorderLeft } from "./BoxBorderLeft";
import { BoxBorderBottom } from "./BoxBorderBottom";

import { ZIndex } from "@/styles/utils/zIndex";
import { OakColorName } from "@/styles/theme/types";
import { BoxProps, box } from "@/components/SharedComponents/Box";

export const gapPositionMap = {
  rightTop: "90%",
  bottomRight: "90%",
  bottomRightCorner: "99%",
} as const;

export type GapPosition = keyof typeof gapPositionMap;

const getBorderHeight = (gapPosition: GapPosition | undefined) => {
  if (gapPosition === "rightTop") return gapPositionMap.rightTop;
  if (gapPosition === "bottomRightCorner")
    return gapPositionMap.bottomRightCorner;
  return "100%";
};

const getBorderWidth = (gapPosition: GapPosition | undefined) => {
  if (gapPosition === "bottomRight") return gapPositionMap.bottomRight;
  if (gapPosition === "bottomRightCorner")
    return gapPositionMap.bottomRightCorner;
  return "100%";
};

export type BoxBordersProps = {
  gapPosition?: GapPosition;
  $zIndex?: ZIndex;
  hideTop?: boolean;
  hideBottom?: boolean;
  hideRight?: boolean;
  hideLeft?: boolean;
  $color?: OakColorName;
  hideOnMobileH?: boolean;
  hideOnMobileV?: boolean;
};

const StyledSvg = styled.svg<BoxProps>`
  ${box};
  transition: all 0.3s ease;
`;

export type BoxBorderProps = BoxProps & {
  name:
    | "box-border-top"
    | "box-border-right"
    | "box-border-bottom"
    | "box-border-left";
  className?: string;
  hideOnMobileH?: boolean;
  hideOnMobileV?: boolean;
  color?: OakColorName;
  filter?: string;
};

const BoxBorder: FC<BoxBorderProps> = (props) => {
  return (
    <StyledSvg
      aria-hidden={true}
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      {...props}
    >
      {props.name === "box-border-top" && <BoxBorderTop />}
      {props.name === "box-border-right" && <BoxBorderRight />}
      {props.name === "box-border-left" && <BoxBorderLeft />}
      {props.name === "box-border-bottom" && <BoxBorderBottom />}
    </StyledSvg>
  );
};

/**
 * Presentational component just for the brush-stroke borders. This is a single
 * component which renders four spans, one for each side of the border.
 *
 * ## Usage
 * Just drop this component inside a Card or other relatively positioned
 * container, and it will act as a visual border around that component. gapPosition, hideTop and
 * hideBottom props are available.
 *
 * ## Note
 * Importantly, the SVGs for the border should have `preserveAspectRatio="none"`,
 * which allows them to be stretched whilst still preserving the effect of being
 * a painted or drawn line.
 */
const BoxBorders: FC<BoxBordersProps> = (props) => {
  const { gapPosition } = props;
  return (
    <OakBox aria-hidden="true" data-testid="brush-borders">
      {!props.hideTop && (
        <BoxBorder
          name="box-border-top"
          {...props}
          $cover
          $bottom={"unset"}
          $height={3}
        />
      )}
      {!props.hideRight && (
        <BoxBorder
          name="box-border-right"
          {...props}
          $cover
          $width={3}
          $top={"unset"}
          $left={"unset"}
          $bottom={gapPosition === "bottomRightCorner" ? "5%" : undefined}
          $height={getBorderHeight(gapPosition)}
        />
      )}

      {!props.hideBottom && (
        <BoxBorder
          name="box-border-bottom"
          {...props}
          $cover
          $height={3}
          $top={"unset"}
          $width={getBorderWidth(gapPosition)}
        />
      )}
      {!props.hideLeft && (
        <BoxBorder
          name="box-border-left"
          {...props}
          $cover
          $width={3}
          $right={"unset"}
        />
      )}
    </OakBox>
  );
};

export default BoxBorders;
