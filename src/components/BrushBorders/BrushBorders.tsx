import { FC } from "react";
import styled, { css } from "styled-components";

const BORDER_THICKNESS_PX = 3;
const BORDER_OFFSET_PX = -Math.floor(BORDER_THICKNESS_PX / 2);

const brushBorder = css`
  display: block;
  position: absolute;
  background: ${(props) => props.theme.colors.grey9};
  mask-position: center;
  mask-repeat: no-repeat;
  mask-size: 100% 100%;
`;
const brushBorderTop = css`
  ${brushBorder}
  height: ${BORDER_THICKNESS_PX}px;
  top: ${BORDER_OFFSET_PX}px;
  right: ${BORDER_OFFSET_PX}px;
  left: ${BORDER_OFFSET_PX}px;
  mask-image: url("/brushstrokes/brushborder-top.svg");
`;

const brushBorderRight = css`
  ${brushBorder}
  width: ${BORDER_THICKNESS_PX}px;
  top: 31px;
  right: ${BORDER_OFFSET_PX}px;
  bottom: ${BORDER_OFFSET_PX}px;
  mask-image: url("/brushstrokes/brushborder-right.svg");
`;

const brushBorderBottom = css`
  ${brushBorder}
  height: ${BORDER_THICKNESS_PX}px;
  bottom: ${BORDER_OFFSET_PX}px;
  right: ${BORDER_OFFSET_PX}px;
  left: ${BORDER_OFFSET_PX}px;
  mask-image: url("/brushstrokes/brushborder-bottom.svg");
`;

const brushBorderLeft = css`
  ${brushBorder}
  width: ${BORDER_THICKNESS_PX}px;
  top: ${BORDER_OFFSET_PX}px;
  left: ${BORDER_OFFSET_PX}px;
  bottom: ${BORDER_OFFSET_PX}px;
  mask-image: url("/brushstrokes/brushborder-left.svg");
`;

const BrushBorderTop = styled.span`
  ${brushBorderTop}
`;
const BrushBorderRight = styled.span`
  ${brushBorderRight}
`;

const BrushBorderBottom = styled.span`
  ${brushBorderBottom}
`;
const BrushBorderLeft = styled.span`
  ${brushBorderLeft}
`;

/**
 * Presentational component just for the brush-stroke borders. This is a single
 * component which renders four spans, one for each side of the border.
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
const BrushBorders: FC = () => {
  return (
    <div aria-hidden="true" data-testid="brush-borders">
      <BrushBorderTop />
      <BrushBorderRight />
      <BrushBorderBottom />
      <BrushBorderLeft />
    </div>
  );
};

export default BrushBorders;
