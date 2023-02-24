import React, { FC } from "react";
import styled, { css } from "styled-components";

import getColorByName from "../../../../styles/themeHelpers/getColorByName";
import Svg from "../../../Svg";
import { OakColorName } from "../../../../styles/theme/types";
import { getBreakpoint } from "../../../../styles/utils/responsive";

const brushBorder = css<{ color: OakColorName }>`
  position: absolute;
  color: ${(props) => getColorByName(props.color)};
  mask-position: center;
`;

export const svgSymbols = {
  Top: () => (
    <symbol
      id="svg-sprite-brush-border-top"
      viewBox="0 0 608 13"
      preserveAspectRatio="none"
    >
      <path
        d="M608 12.9952H0V6.58964C9.4145 4.8402 19.066 4.00414 28.739 4.10013C43.8554 4.85537 59.1496 3.48474 74.3728 3.1211L90.2005 2.84138C98.559 2.61761 106.882 2.4218 115.098 2.44978C229.165 2.7295 343.232 3.34488 457.298 3.34488C477.43 3.34488 497.597 2.75747 517.764 2.14208C531.422 1.7225 545.08 1.30292 558.738 1.0232C566.777 0.85537 574.815 1.55467 582.818 1.86236C586.126 1.86236 589.433 2.25397 592.706 2.19803C597.889 2.00388 603.071 2.60235 607.964 3.96027"
        fill="currentColor"
      />
    </symbol>
  ),

  Right: () => (
    <symbol
      id="svg-sprite-brush-border-right"
      viewBox="0 0 7 381"
      preserveAspectRatio="none"
    >
      <path
        d="M5.95062 347.767C5.84838 355.359 5.51951 362.45 5.01823 367.872C4.51695 373.294 3.87318 376.723 3.19306 377.594C2.43071 378.792 1.66876 379.901 0.899662 380.831L0.946416 0.629639C1.65555 3.72393 3.98492 8.81233 4.517 14.8221C5.25211 23.0541 5.82473 32.9368 6.20066 43.8804C6.57133 54.8207 6.73441 66.5972 6.67982 78.4841C6.61613 92.4154 6.78382 106.273 6.76792 120.208C6.72772 141.198 6.63974 162.184 6.5299 182.723C6.37026 217.64 5.84139 253.158 6.04976 287.743C6.10718 308.293 6.40211 327.43 5.95062 347.767Z"
        fill="currentColor"
      />
    </symbol>
  ),
  Bottom: () => (
    <symbol
      id="svg-sprite-brush-border-bottom"
      viewBox="0 0 608 13"
      preserveAspectRatio="none"
    >
      <path
        d="M608.142 0.86792V5.42188C601.598 5.91828 594.984 6.30677 588.404 6.50101C567.469 7.1485 546.51 7.61612 525.527 7.90389C523.002 7.90389 520.477 7.90389 517.952 7.90389C507.568 7.90389 497.112 7.60173 486.692 7.60173H317.514V6.8895C259.403 7.58015 201.256 8.18447 143.251 9.04778C136.992 9.04778 130.839 10.6881 124.545 11.3571C120.076 11.8486 115.563 12.1801 111.03 12.3499C104.238 12.6305 97.2672 12.9111 90.3678 12.8679H89.7632C84.642 12.8679 79.5208 11.724 74.3996 11.724C65.4731 11.724 56.6177 12.2636 47.62 12.5442H39.9382C30.087 12.5442 20.2003 12.8463 10.4558 12.3284C6.94877 12.1692 3.45845 11.8954 0 11.5082L0 0.86792H608.142Z"
        fill="currentColor"
      />
    </symbol>
  ),
  Left: () => (
    <symbol
      id="svg-sprite-brush-border-left"
      viewBox="0 0 12 383"
      preserveAspectRatio="none"
    >
      <path
        d="M11.9999 0.745605V382.868C10.1262 381.366 8.31313 378.46 6.62678 374.256C4.4417 368.142 3.54618 351.778 2.13125 339.807C1.8626 337.482 2.00588 334.21 1.77304 331.712C-0.215015 308.631 0.626776 286.24 1.25364 262.814C1.50047 244.757 1.41656 226.63 1.0029 208.644C0.841702 187.544 0.805881 166.444 0.447672 145.43C0.125284 126.828 0.77006 108.312 0.0894627 89.2789C-0.304567 78.6859 0.734239 66.8872 1.182 55.6914C1.46857 48.371 1.88051 41.2229 2.13125 33.9886C2.75812 16.0753 4.47752 5.91292 8.27454 3.58763C9.52827 2.81253 10.7462 1.86519 11.9999 0.745605Z"
        fill="currentColor"
      />
    </symbol>
  ),
};

const hideBrushOnMobile = css`
  @media (max-width: ${getBreakpoint("small")}px) {
    display: none;
  }
`;

const TOP_THICKNESS = 12;
const RIGHT_THICKNESS = 8;
const BOTTOM_THICKNESS = 11;
const LEFT_THICKNESS = 8;

const brushBorderTop = css`
  ${brushBorder}
  height: ${TOP_THICKNESS}px;
  left: 0;
  bottom: calc(100% - 2px);
`;

const brushBorderRight = css`
  ${brushBorder}
  width: ${RIGHT_THICKNESS}px;
  top: -${TOP_THICKNESS - 4}px;
  left: calc(100% - 2px);
  height: calc(100% + ${TOP_THICKNESS}px);
`;

const brushBorderBottom = css`
  ${brushBorder}
  height: ${BOTTOM_THICKNESS}px;
  top: calc(100% - 1px);
  left: 0;
`;

const brushBorderLeft = css`
  ${brushBorder}
  width: ${LEFT_THICKNESS}px;
  bottom: -${10}px;
  right: calc(100% - 1px);
  height: calc(100% + 4px + ${BOTTOM_THICKNESS}px);
`;

const BrushBorderTop = styled(Svg)`
  ${brushBorderTop}
  ${(props) => props.hideOnMobileV && hideBrushOnMobile}
`;
const BrushBorderRight = styled(Svg)`
  ${brushBorderRight}
  ${(props) => props.hideOnMobileH && hideBrushOnMobile}
`;
const BrushBorderBottom = styled(Svg)`
  ${brushBorderBottom}
  ${(props) => props.hideOnMobileV && hideBrushOnMobile}
`;
const BrushBorderLeft = styled(Svg)`
  ${brushBorderLeft}
  ${(props) => props.hideOnMobileH && hideBrushOnMobile}
`;

type BrushBordersProps = {
  color: OakColorName;
  hideOnMobileH?: boolean;
  hideOnMobileV?: boolean;
};
/**
 * Presentational component just for the borders for the brush cards.
 * This is a single component which renders four spans, one for each side of
 * the border. Attempts at using border-image or mask-image were futile, so
 * resorted to this 'four span' technique.
 *
 * ## Usage
 * Just drop this component inside a Card or other relatively positioned
 * container, and it will act as a visual border around that component.
 *
 * ## Note
 * Importantly, the SVGs for the border should have `preserveAspectRatio="none"`,
 * which allows them to be stretched whilst still preserving the effect of being
 * a painted or drawn line.
 */
const BrushBorders: FC<BrushBordersProps> = (props) => {
  return (
    <div aria-hidden="true" data-testid="brush-borders">
      <BrushBorderTop name="brush-border-top" {...props} />
      <BrushBorderRight name="brush-border-right" {...props} />
      <BrushBorderBottom name="brush-border-bottom" {...props} />
      <BrushBorderLeft name="brush-border-left" {...props} />
    </div>
  );
};

export default BrushBorders;
