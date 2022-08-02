import { FC } from "react";
import styled, { css } from "styled-components";

import getColorByName from "../../../styles/themeHelpers/getColorByName";
import { ButtonBackground } from "../common";

const BORDER_THICKNESS_PX = 3;

const buttonBorder = css<{ background: ButtonBackground }>`
  display: block;
  position: absolute;
  background: ${(props) => getColorByName(props.background)};
  mask-position: center;
  mask-repeat: no-repeat;
  mask-size: 100% 100%;
`;
const buttonBorderTop = css`
  ${buttonBorder}
  height: ${BORDER_THICKNESS_PX}px;
  right: 0;
  left: 0;
  bottom: 100%;
  transform: translate(0, 0);
  mask-image: url("/buttons/button-border-top.svg");
`;

const buttonBorderRight = css`
  ${buttonBorder}
  width: ${BORDER_THICKNESS_PX}px;
  top: -2.3px;
  left: 100%;
  bottom: -1.2px;
  mask-image: url("/buttons/button-border-right.svg");
`;

const buttonBorderBottom = css`
  ${buttonBorder}
  height: ${BORDER_THICKNESS_PX}px;
  top: 100%;
  right: 0;
  left: 0;
  transform: translate(0, -0.2px);
  mask-image: url("/buttons/button-border-bottom.svg");
`;

const buttonBorderLeft = css`
  ${buttonBorder}
  width: ${BORDER_THICKNESS_PX}px;
  top: -1.1px;
  right: 100%;
  bottom: -2.9px;
  transform: translate(0.8px, 0);
  mask-image: url("/buttons/button-border-left.svg");
`;

const ButtonBorderTop = styled.span`
  ${buttonBorderTop}
`;
const ButtonBorderRight = styled.span`
  ${buttonBorderRight}
`;
const ButtonBorderBottom = styled.span`
  ${buttonBorderBottom}
`;
const ButtonBorderLeft = styled.span`
  ${buttonBorderLeft}
`;

type ButtonBordersProps = {
  background: ButtonBackground;
};
/**
 * Presentational component just for the borders for the brush button variant.
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
const ButtonBorders: FC<ButtonBordersProps> = (props) => {
  return (
    <div aria-hidden="true" data-testid="button-borders">
      <ButtonBorderTop {...props} />
      <ButtonBorderRight {...props} />
      <ButtonBorderBottom {...props} />
      <ButtonBorderLeft {...props} />
    </div>
  );
};

export default ButtonBorders;
