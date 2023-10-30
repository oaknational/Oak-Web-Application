import { FC } from "react";
import styled, { css } from "styled-components";

import getColorByName from "@/styles/themeHelpers/getColorByName";
import { ButtonBackground } from "@/components/Button/common";
import Svg from "@/components/Svg";
import { HOVER_SHADOW_TRANSITION } from "@/styles/transitions";

const buttonBorder = css<{ background: ButtonBackground }>`
  position: absolute;
  color: ${(props) => getColorByName(props.background)};
  mask-position: center;
`;

const buttonBorderTop = css`
  ${buttonBorder}
  height: 4px;
  left: 0;
  bottom: calc(100% + 1px);
  z-index: -1;
  width: calc(100% + 5px);
  transition: ${HOVER_SHADOW_TRANSITION};
`;

const buttonBorderRight = css`
  ${buttonBorder}
  width: 9px;
  top: -5px;
  left: 100%;
  z-index: -1;
  height: calc(100% + 7px);
  transition: ${HOVER_SHADOW_TRANSITION};
`;

const buttonBorderBottom = css`
  ${buttonBorder}
  height: 8px;
  top: 100%;
  left: 0;
  width: calc(100% + 6px);
  z-index: -1;
  transition: ${HOVER_SHADOW_TRANSITION};
`;

const buttonBorderLeft = css`
  ${buttonBorder}
  width: 9px;
  top: -3px;
  right: 100%;
  height: calc(100% + 10px);
  z-index: -1;
  transition: ${HOVER_SHADOW_TRANSITION};
`;

const ButtonBorderTop = styled(Svg)`
  ${buttonBorderTop}
`;
const ButtonBorderRight = styled(Svg)`
  ${buttonBorderRight}
`;
const ButtonBorderBottom = styled(Svg)`
  ${buttonBorderBottom}
`;
const ButtonBorderLeft = styled(Svg)`
  ${buttonBorderLeft}
`;

type ButtonBordersProps = {
  background: ButtonBackground;
};
/**
 * Presentational component to be used to create a second border around buttons
 *
 * ## Usage
 * Use in conjunction with normal ButtonBorders to create a double border effect
 *
 * ## Note
 * Importantly, the SVGs for the border should have `preserveAspectRatio="none"`,
 * which allows them to be stretched whilst still preserving the effect of being
 * a painted or drawn line.
 */
export const DoubleButtonBorders: FC<ButtonBordersProps> = (props) => {
  return (
    <div aria-hidden="true" data-testid="button-borders">
      <ButtonBorderTop name="button-border-top" {...props} />
      <ButtonBorderRight name="button-border-right" {...props} />
      <ButtonBorderBottom name="button-border-bottom" {...props} />
      <ButtonBorderLeft name="button-border-left" {...props} />
    </div>
  );
};
