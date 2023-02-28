import { FC } from "react";
import styled, { css } from "styled-components";

import getColorByName from "../../../../styles/themeHelpers/getColorByName";
import { ButtonBackground } from "../../../Button/common";
import Svg from "../../../Svg";

const buttonBorder = css<{ background: ButtonBackground }>`
  position: absolute;
  color: ${(props) => getColorByName(props.background)};
  mask-position: center;
`;

export const svgSymbols = {
  Top: () => (
    <symbol
      id="svg-sprite-button-border-top"
      viewBox="0 0 148 4"
      preserveAspectRatio="none"
    >
      <path
        d="M148 4H0V2c2.291-.583 4.64-.997 6.994-.965 3.68.252 7.402-.205 11.107-.326l3.852-.094c2.034-.074 4.06-.14 6.06-.13 27.76.093 55.521.298 83.283.298 4.899 0 9.807-.196 14.716-.4 3.324-.14 6.648-.28 9.972-.374 1.956-.056 3.913.177 5.86.28.805 0 1.61.13 2.407.112A9.304 9.304 0 0 1 148 1"
        fill="currentColor"
      />
    </symbol>
  ),
  Right: () => (
    <symbol
      id="svg-sprite-button-border-right"
      viewBox="0 0 7 60"
      preserveAspectRatio="none"
    >
      <path
        d="M6.794 51.163c-.094 1.1-.505 2.13-1.166 2.92-.66.79-1.531 1.293-2.469 1.426A85.33 85.33 0 0 1 0 56V1a7.917 7.917 0 0 1 2.695 1.979 13.042 13.042 0 0 1 2.519 4.19c.583 1.58.884 3.283.884 5.004 0 2.018.32 4.022.386 6.04.078 3.039.089 6.078.067 9.052 0 5.056-.509 10.203 0 15.208.21 2.974.74 5.742.243 8.69Z"
        fill="currentColor"
      />
    </symbol>
  ),
  Bottom: () => (
    <symbol
      id="svg-sprite-button-border-bottom"
      viewBox="0 0 148 6"
      preserveAspectRatio="none"
    >
      <path
        d="M148 0v2c-1.593.268-3.216.54-4.817.645-5.095.349-10.196.601-15.302.756h-1.844c-2.527 0-5.071-.163-7.607-.163H77.258c-14.142.373-28.293.315-42.41.78-1.523 0-3.02.885-4.552 1.246a21.336 21.336 0 0 1-3.289.535c-1.653.152-3.35.224-5.028.201h-.147c-1.247 0-2.493-.538-3.74-.538-2.172 0-4.327.29-6.516.442h-1.87c-2.397 0-4.804.163-7.175-.116-.853-.086-1.703-.577-2.545-.786V0H148Z"
        fill="currentColor"
      />
    </symbol>
  ),
  Left: () => (
    <symbol
      id="svg-sprite-button-border-left"
      viewBox="0 0 7 60"
      preserveAspectRatio="none"
    >
      <path
        d="M7 2v57c-1.093-.232-2.151-.351-3.135-1-1.275-.944-1.797-2.8-2.623-4.648-.156-.358-.073-.864-.209-1.25C-.127 48.54.365 45.084.73 41.468a60.562 60.562 0 0 0-.146-8.363C.49 29.847.469 26.59.26 23.346c-.188-2.872.188-5.73-.209-8.668-.23-1.636.376-3.457.637-5.185.168-1.13.408-2.234.554-3.35C1.608 3.376 3.5 3.5 4.826 3 5.431 2.772 6.27 2.173 7 2Z"
        fill="currentColor"
      />
    </symbol>
  ),
};

const TOP_THICKNESS = 4;
const RIGHT_THICKNESS = 7;
const BOTTOM_THICKNESS = 6;
const LEFT_THICKNESS = 7;
const buttonBorderTop = css`
  ${buttonBorder}
  height: ${TOP_THICKNESS}px;
  left: 0;
  bottom: calc(100% - 1px);
`;

const buttonBorderRight = css`
  ${buttonBorder}
  width: ${RIGHT_THICKNESS}px;
  top: -${TOP_THICKNESS - 1}px;
  left: calc(100% - 1px);
  height: calc(100% - 2px + ${TOP_THICKNESS + BOTTOM_THICKNESS}px);
`;

const buttonBorderBottom = css`
  ${buttonBorder}
  height: ${BOTTOM_THICKNESS}px;
  height: 6px;
  top: calc(100% - 1px);
  left: 0;
`;

const buttonBorderLeft = css`
  ${buttonBorder}
  width: ${LEFT_THICKNESS}px;
  top: -${TOP_THICKNESS - 1}px;
  right: calc(100% - 1px);
  height: calc(100% - 2px + ${TOP_THICKNESS + BOTTOM_THICKNESS}px);
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
      <ButtonBorderTop name="button-border-top" {...props} />
      <ButtonBorderRight name="button-border-right" {...props} />
      <ButtonBorderBottom name="button-border-bottom" {...props} />
      <ButtonBorderLeft name="button-border-left" {...props} />
    </div>
  );
};

export default ButtonBorders;
