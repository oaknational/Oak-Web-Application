import { FC } from "react";
import styled, { css } from "styled-components";
import { OakSvg } from "@oaknational/oak-components";

import getColorByName from "@/styles/themeHelpers/getColorByName";
import { ButtonBackground } from "@/components/SharedComponents/Button/common";

type DoubleBorderProps = { background: ButtonBackground };
const buttonBorder = css<DoubleBorderProps>`
  position: absolute;
  color: ${(props) => getColorByName(props.background)};
  mask-position: center;
  transition: none;
`;

const focus = css`
  display: none;
  &:focus {
    display: block;
  }
`;

/* TOP */
const buttonBorderTop = css<DoubleBorderProps>`
  ${buttonBorder}
  height: 5px;
  left: 0;
  width: 100%;
`;

const topInner = css<DoubleBorderProps>`
  ${buttonBorderTop}
  bottom: calc(100% - 2px);
`;
const topMiddle = css<DoubleBorderProps>`
  ${buttonBorderTop}
  ${focus}
  bottom: calc(100% + 1px);
  color: ${() => getColorByName("lemon")};
`;
const topOuter = css<DoubleBorderProps>`
  ${buttonBorderTop} ${focus}
  bottom: calc(100% + 4px);
  color: ${() => getColorByName("grey60")};
`;

/* RIGHT */
const buttonBorderRight = css<DoubleBorderProps>`
  ${buttonBorder}
  width: 9px;
  left: 100%;
`;

const rightInner = css<DoubleBorderProps>`
  ${buttonBorderRight}
  top: -3px;
  left: calc(100% - 5px);
  height: calc(100% + 3px);
`;
const rightMiddle = css<DoubleBorderProps>`
  ${buttonBorderRight} ${focus}
  top: -5px;
  left: calc(100% - 2px);
  height: calc(100% + 7px);
  color: ${() => getColorByName("lemon")};
`;
const rightOuter = css<DoubleBorderProps>`
  ${buttonBorderRight} ${focus}
  color: ${() => getColorByName("grey60")};
  width: 12px;
  left: calc(100% - 2px);
  top: -8px;
  color: ${() => getColorByName("grey60")};
  height: calc(100% + 12px);
`;

/* BOTTOM */
const buttonBorderBottom = css<DoubleBorderProps>`
  ${buttonBorder}
  height: 6px;
  top: 100%;
  left: 0;
  width: calc(100% + 6px);
`;

const bottomInner = css<DoubleBorderProps>`
  ${buttonBorderBottom}
  top: calc(100% - 4px);
  width: 100%;
`;
const bottomMiddle = css<DoubleBorderProps>`
  ${buttonBorderBottom} ${focus}
  width: calc(100% + 4px);
  top: calc(100% - 1px);
  color: ${() => getColorByName("lemon")};
`;
const bottomOuter = css<DoubleBorderProps>`
  ${buttonBorderBottom} ${focus}
  width: calc(100% + 5px);
  top: calc(100% + 1px);
  color: ${() => getColorByName("grey60")};
`;

/* LEFT */
const buttonBorderLeft = css<DoubleBorderProps>`
  ${buttonBorder}
  width: 7px;
`;

const leftInner = css<DoubleBorderProps>`
  ${buttonBorderLeft}
  top: -1px;
  right: calc(100% - 3px);
  height: calc(100% + 3px);
`;
const leftMiddle = css<DoubleBorderProps>`
  ${buttonBorderLeft} ${focus}
  top: -4px;
  right: calc(100% - 1px);
  height: calc(100% + 8px);
  color: ${() => getColorByName("lemon")};
`;
const leftOuter = css<DoubleBorderProps>`
  ${buttonBorderLeft} ${focus}
  color: ${() => getColorByName("grey60")};
  width: 10px;
  top: -7px;
  right: calc(100% - 1px);
  height: calc(100% + 14px);
`;

const ButtonBorderTopInner = styled(OakSvg)<DoubleBorderProps>`
  ${topInner}
`;
const ButtonBorderTopMiddle = styled(OakSvg)<DoubleBorderProps>`
  ${topMiddle}
`;
const ButtonBorderTopOuter = styled(OakSvg)<DoubleBorderProps>`
  ${topOuter}
`;
const ButtonBorderRightInner = styled(OakSvg)<DoubleBorderProps>`
  ${rightInner}
`;
const ButtonBorderRightMiddle = styled(OakSvg)<DoubleBorderProps>`
  ${rightMiddle}
`;
const ButtonBorderRightOuter = styled(OakSvg)<DoubleBorderProps>`
  ${rightOuter}
`;
const ButtonBorderBottomInner = styled(OakSvg)<DoubleBorderProps>`
  ${bottomInner}
`;
const ButtonBorderBottomMiddle = styled(OakSvg)<DoubleBorderProps>`
  ${bottomMiddle}
`;
const ButtonBorderBottomOuter = styled(OakSvg)<DoubleBorderProps>`
  ${bottomOuter}
`;
const ButtonBorderLeftInner = styled(OakSvg)<DoubleBorderProps>`
  ${leftInner}
`;
const ButtonBorderLeftMiddle = styled(OakSvg)<DoubleBorderProps>`
  ${leftMiddle}
`;
const ButtonBorderLeftOuter = styled(OakSvg)<DoubleBorderProps>`
  ${leftOuter}
`;

type ButtonBordersProps = {
  background: ButtonBackground;
};
/**
 * Presentational component to be used to create a border with a focus outline
 *
 * ## Usage
 * Use in button components to add an svg border with an additional double border on focus
 *
 * ## Note
 * Importantly, the SVGs for the border should have `preserveAspectRatio="none"`,
 * which allows them to be stretched whilst still preserving the effect of being
 * a painted or drawn line.
 */
export const DoubleButtonBorders: FC<ButtonBordersProps> = (props) => {
  return (
    <div aria-hidden="true" data-testid="button-borders" {...props}>
      <ButtonBorderTopOuter name="button-border-top" {...props} />
      <ButtonBorderTopMiddle name="button-border-top" {...props} />
      <ButtonBorderTopInner name="button-border-top" {...props} />

      <ButtonBorderRightOuter name="button-border-right" {...props} />
      <ButtonBorderRightMiddle name="button-border-right" {...props} />
      <ButtonBorderRightInner name="button-border-right" {...props} />

      <ButtonBorderBottomOuter name="button-border-bottom" {...props} />
      <ButtonBorderBottomMiddle name="button-border-bottom" {...props} />
      <ButtonBorderBottomInner name="button-border-bottom" {...props} />

      <ButtonBorderLeftOuter name="button-border-left" {...props} />
      <ButtonBorderLeftMiddle name="button-border-left" {...props} />
      <ButtonBorderLeftInner name="button-border-left" {...props} />
    </div>
  );
};
