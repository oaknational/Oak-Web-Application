import { FC } from "react";
import styled, { css } from "styled-components";

const brushBorder = css`
  display: block;
  position: absolute;
  background: #080808;
  mask-position: center;
  mask-repeat: no-repeat;
  mask-size: 100% 100%;
`;
export const brushBorderTop = css`
  ${brushBorder}
  height: 10px;
  top: -5px;
  right: 1px;
  left: -3px;
  mask-image: url("/brushstrokes/brushborder-top.svg");
`;

export const brushBorderRight = css`
  ${brushBorder}
  width: 10px;
  top: 31px;
  right: -5px;
  bottom: -4px;
  mask-image: url("/brushstrokes/brushborder-right.svg");
`;

export const brushBorderBottom = css`
  ${brushBorder}
  height: 10px;
  bottom: -5px;
  right: -4px;
  left: -3px;
  mask-image: url("/brushstrokes/brushborder-bottom.svg");
`;

export const brushBorderLeft = css`
  ${brushBorder}
  width: 10px;
  top: -5px;
  left: -3px;
  bottom: -5px;
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
 *
 * Just drop this component inside a Card or other relatively positioned
 * container, and it will act as a visual border around that component.
 */
const BrushBorders: FC = () => {
  return (
    <>
      <BrushBorderTop />
      <BrushBorderRight />
      <BrushBorderBottom />
      <BrushBorderLeft />
    </>
  );
};

export default BrushBorders;
