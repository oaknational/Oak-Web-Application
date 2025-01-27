import { FC } from "react";
import styled from "styled-components";
import {
  OakBox,
  OakBoxProps,
  oakBoxCss,
  OakColorToken,
  oakZIndexTokens,
} from "@oaknational/oak-components";

import { BoxBorderTop } from "./BoxBorderTop";
import { BoxBorderRight } from "./BoxBorderRight";
import { BoxBorderLeft } from "./BoxBorderLeft";
import { BoxBorderBottom } from "./BoxBorderBottom";

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
  $zIndex?: keyof typeof oakZIndexTokens | null;
  hideTop?: boolean;
  hideBottom?: boolean;
  hideRight?: boolean;
  hideLeft?: boolean;
  $color?: OakColorToken;
  hideOnMobileH?: boolean;
  hideOnMobileV?: boolean;
};

const StyledSvg = styled.svg<OakBoxProps>`
  ${oakBoxCss};
  transition: all 0.3s ease;
`;

export type StyledBoxBorderProps = OakBoxProps & {
  name:
    | "box-border-top"
    | "box-border-right"
    | "box-border-bottom"
    | "box-border-left";
  className?: string;
  hideOnMobileH?: boolean;
  hideOnMobileV?: boolean;
  color?: OakColorToken;
  filter?: string;
  gapPosition?: GapPosition;
};

const StyledBoxBorderTop: FC<StyledBoxBorderProps> = (props) => {
  return (
    <StyledSvg
      aria-hidden={true}
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      $position={"absolute"}
      $objectFit={"cover"}
      $top={"all-spacing-0"}
      $right={"all-spacing-0"}
      $left={"all-spacing-0"}
      $bottom={"all-spacing-0"}
      {...props}
      style={{
        bottom: "unset",
        height: "3px",
      }}
    >
      <BoxBorderTop />
    </StyledSvg>
  );
};

const StyledBoxBorderRight: FC<StyledBoxBorderProps> = (props) => {
  return (
    <StyledSvg
      aria-hidden={true}
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      $position={"absolute"}
      $objectFit={"cover"}
      $top={"all-spacing-0"}
      $right={"all-spacing-0"}
      $left={"all-spacing-0"}
      $bottom={"all-spacing-0"}
      {...props}
      style={{
        top: "unset",
        left: "unset",
        bottom: props.gapPosition === "bottomRightCorner" ? "5%" : undefined,
        width: "3px",
        height: getBorderHeight(props.gapPosition),
      }}
    >
      <BoxBorderRight />
    </StyledSvg>
  );
};

const StyledBoxBorderBottom: FC<StyledBoxBorderProps> = (props) => {
  return (
    <StyledSvg
      aria-hidden={true}
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      $position={"absolute"}
      $objectFit={"cover"}
      $top={"all-spacing-0"}
      $right={"all-spacing-0"}
      $left={"all-spacing-0"}
      $bottom={"all-spacing-0"}
      {...props}
      style={{
        top: "unset",
        height: "3px",
        width: getBorderWidth(props.gapPosition),
      }}
    >
      <BoxBorderBottom />
    </StyledSvg>
  );
};

const StyledBoxBorderLeft: FC<StyledBoxBorderProps> = (props) => {
  return (
    <StyledSvg
      aria-hidden={true}
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      $position={"absolute"}
      $objectFit={"cover"}
      $top={"all-spacing-0"}
      $right={"all-spacing-0"}
      $left={"all-spacing-0"}
      $bottom={"all-spacing-0"}
      {...props}
      style={{
        right: "unset",
        width: "3px",
      }}
    >
      <BoxBorderLeft />
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
  return (
    <OakBox aria-hidden="true" data-testid="brush-borders">
      {!props.hideTop && (
        <StyledBoxBorderTop name="box-border-top" {...props} />
      )}
      {!props.hideRight && (
        <StyledBoxBorderRight name="box-border-right" {...props} />
      )}

      {!props.hideBottom && (
        <StyledBoxBorderBottom name="box-border-bottom" {...props} />
      )}
      {!props.hideLeft && (
        <StyledBoxBorderLeft name="box-border-left" {...props} />
      )}
    </OakBox>
  );
};

export default BoxBorders;
