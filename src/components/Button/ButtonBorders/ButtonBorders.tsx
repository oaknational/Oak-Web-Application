import { FC } from "react";
import styled, { css } from "styled-components";

import getColorByName from "../../../styles/themeHelpers/getColorByName";
import { ButtonBackground } from "../common";

const BORDER_THICKNESS_PX = 3;

const buttonBorder = css<{ background: ButtonBackground }>`
  position: absolute;
  color: ${(props) => getColorByName(props.background)};
  mask-position: center;
`;

export const buttonSymbols = {
  Top: () => (
    <symbol
      id="svg-sprite-button-border-top"
      viewBox="0 0 148 6"
      preserveAspectRatio="none"
    >
      <path
        transform="translate(0 0.8)"
        d="M148.01 5.25572H0V2.96572C2.29184 2.3403 4.64137 2.04141 6.99613 2.07572C10.676 2.34572 14.3992 1.85572 18.1051 1.72572L21.9582 1.62572C23.9929 1.54572 26.019 1.47572 28.0192 1.48572C55.7872 1.58572 83.5553 1.80572 111.323 1.80572C116.224 1.80572 121.134 1.59572 126.043 1.37572C129.368 1.22572 132.693 1.07572 136.018 0.97572C137.974 0.91572 139.931 1.16572 141.88 1.27572C142.685 1.27572 143.49 1.41572 144.287 1.39572C145.548 1.32631 146.81 1.54027 148.001 2.02572"
        fill="currentColor"
      />
    </symbol>
  ),
  Right: () => (
    <symbol
      id="svg-sprite-button-border-right"
      viewBox="0 0 7 57"
      preserveAspectRatio="none"
    >
      <path
        transform="translate(-0.6 0)"
        d="M6.33564 51.5325C6.25485 52.6438 5.90218 53.6841 5.33576 54.4819C4.76934 55.2796 4.023 55.7871 3.21978 55.9208C2.32063 56.1033 1.42149 56.2726 0.512897 56.4159L0.541992 0.848877C1.4009 1.29481 2.18589 1.97507 2.85009 2.84909C3.76737 4.04621 4.50046 5.4863 5.0056 7.0834C5.50449 8.68007 5.76125 10.401 5.76006 12.1401C5.75899 14.1783 6.03238 16.2036 6.08809 18.2418C6.15273 21.3122 6.16059 24.3826 6.14008 27.3876C6.13741 32.4961 5.69936 37.6959 6.13204 42.7525C6.31028 45.7576 6.76307 48.5538 6.33564 51.5325Z"
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
        transform="translate(0 -0.3)"
        d="M148.062 0.255859V2.36586C146.468 2.59586 144.858 2.77586 143.256 2.86586C138.159 3.16586 133.056 3.38253 127.948 3.51586C127.333 3.51586 126.718 3.51586 126.104 3.51586C123.575 3.51586 121.03 3.37586 118.493 3.37586H77.3038V3.04586C63.1557 3.36586 48.9989 3.64586 34.8767 4.04586C33.3528 4.04586 31.8549 4.80586 30.3223 5.11586C29.2343 5.34358 28.1357 5.49718 27.0321 5.57586C25.3783 5.70586 23.6812 5.83586 22.0014 5.81586H21.8542C20.6074 5.81586 19.3606 5.28586 18.1137 5.28586C15.9404 5.28586 13.7845 5.53586 11.5938 5.66586H9.72358C7.32515 5.66586 4.91807 5.80586 2.54562 5.56586C1.69179 5.49211 0.842013 5.36525 0 5.18586L0 0.255859H148.062Z"
        fill="currentColor"
      />
    </symbol>
  ),
  Left: () => (
    <symbol
      id="svg-sprite-button-border-left"
      viewBox="0 0 7 58"
      preserveAspectRatio="none"
    >
      <path
        d="M7.00002 0.0012207V57.1464C5.90703 56.9218 4.8494 56.4872 3.86569 55.8585C2.59106 54.944 2.06867 52.497 1.2433 50.7068C1.08659 50.359 1.17017 49.8696 1.03435 49.4961C-0.125355 46.0445 0.36569 42.6959 0.731361 39.1927C0.875342 36.4923 0.826397 33.7815 0.585093 31.0917C0.491063 27.9363 0.470167 24.7809 0.261212 21.6383C0.0731523 18.8564 0.449272 16.0874 0.0522568 13.2411C-0.177594 11.6569 0.428376 9.89247 0.68957 8.21817C0.856735 7.12344 1.09703 6.05446 1.2433 4.97261C1.60897 2.29372 2.61196 0.773975 4.82688 0.426235C5.55823 0.310322 6.26868 0.168651 7.00002 0.0012207Z"
        fill="currentColor"
      />
    </symbol>
  ),
};
const buttonBorderTop = css`
  ${buttonBorder}
  height: ${BORDER_THICKNESS_PX}px;
  left: 0;
  bottom: 100%;
  transform: translate(0, 0);
`;

const buttonBorderRight = css`
  ${buttonBorder}
  width: ${BORDER_THICKNESS_PX}px;
  top: -${BORDER_THICKNESS_PX}px;
  left: 100%;
`;

const buttonBorderBottom = css`
  ${buttonBorder}
  height: ${BORDER_THICKNESS_PX}px;
  top: 100%;
  left: 0;
  transform: translate(0, -0.2px);
`;

const buttonBorderLeft = css`
  ${buttonBorder}
  width: ${BORDER_THICKNESS_PX}px;
  top: -${BORDER_THICKNESS_PX}px;
  right: 100%;
  transform: translate(0.8px, 0);
`;

const ButtonBorderTop = styled.svg`
  ${buttonBorderTop}
`;
const ButtonBorderRight = styled.svg`
  ${buttonBorderRight}
`;
const ButtonBorderBottom = styled.svg`
  ${buttonBorderBottom}
`;
const ButtonBorderLeft = styled.svg`
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
      <ButtonBorderTop
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        {...props}
      >
        <use xlinkHref="#svg-sprite-button-border-top" />
      </ButtonBorderTop>
      <ButtonBorderRight
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="calc(100% + 6px)"
        {...props}
      >
        <use xlinkHref="#svg-sprite-button-border-right" />
      </ButtonBorderRight>
      <ButtonBorderBottom
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        {...props}
      >
        <use xlinkHref="#svg-sprite-button-border-bottom" />
      </ButtonBorderBottom>
      <ButtonBorderLeft
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="calc(100% + 6px)"
        {...props}
      >
        <use xlinkHref="#svg-sprite-button-border-left" />
      </ButtonBorderLeft>
    </div>
  );
};

export default ButtonBorders;
