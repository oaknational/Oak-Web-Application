import React, { FC } from "react";
import styled, { css } from "styled-components";

import getColorByName from "../../../../styles/themeHelpers/getColorByName";
import Svg from "../../../Svg";
import { OakColorName } from "../../../../styles/theme/types";
import { getBreakpoint } from "../../../../styles/utils/responsive";

import { $selectedStyle } from "@/components/OakLink/OakLink";

const brushBorder = css<{ color: OakColorName }>`
  position: absolute;
  color: ${(props) => getColorByName(props.color)};
  mask-position: center;
`;

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
  ${$selectedStyle}
  height: ${TOP_THICKNESS}px;
  left: 0;
  bottom: calc(100% - 2px);
`;

const brushBorderRight = css`
  ${brushBorder}
  ${$selectedStyle}
  width: ${RIGHT_THICKNESS}px;
  top: -${TOP_THICKNESS - 4}px;
  left: calc(100% - 2px);
  height: calc(100% + ${TOP_THICKNESS}px);
`;

const brushBorderBottom = css`
  ${brushBorder}
  ${$selectedStyle}
  height: ${BOTTOM_THICKNESS}px;
  top: calc(100% - 1px);
  left: 0;
`;

const brushBorderLeft = css`
  ${brushBorder}
  ${$selectedStyle}
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
  isSelected?: boolean;
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
      <BrushBorderTop name="button-border-top" {...props} />
      <BrushBorderRight name="button-border-right" {...props} />
      <BrushBorderBottom name="button-border-bottom" {...props} />
      <BrushBorderLeft name="button-border-left" {...props} />
    </div>
  );
};

export default BrushBorders;
