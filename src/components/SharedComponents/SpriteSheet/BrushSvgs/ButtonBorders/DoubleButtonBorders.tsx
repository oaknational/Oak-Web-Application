import { FC } from "react";
import styled, { css } from "styled-components";
import { OakSvg } from "@oaknational/oak-components";

import getColorByName from "@/styles/themeHelpers/getColorByName";
import { ButtonBackground } from "@/components/SharedComponents/Button/common";

const buttonBorder = css<{ background: ButtonBackground }>`
  position: absolute;
  color: ${(props) => getColorByName(props.background)};
  mask-position: center;
  transition: none;
`;

const focus = css`
  display: none;
  :focus {
    display: block;
  }
`;

/* TOP */
const buttonBorderTop = css<{ background: ButtonBackground }>`
  ${buttonBorder}
  height: 5px;
  left: 0;
  width: 100%;
`;

const topInner = css<{ background: ButtonBackground }>`
  ${buttonBorderTop}
  bottom: calc(100% - 2px);
`;
const topMiddle = css<{ background: ButtonBackground }>`
  ${buttonBorderTop}
  ${focus}
  bottom: calc(100% + 1px);
  color: ${() => getColorByName("lemon")};
`;
const topOuter = css<{ background: ButtonBackground }>`
  ${buttonBorderTop} ${focus}
  bottom: calc(100% + 4px);
  color: ${() => getColorByName("grey60")};
`;

/* RIGHT */
const buttonBorderRight = css<{ background: ButtonBackground }>`
  ${buttonBorder}
  width: 9px;
  left: 100%;
`;

const rightInner = css<{ background: ButtonBackground }>`
  ${buttonBorderRight}
  top: -3px;
  left: calc(100% - 5px);
  height: calc(100% + 3px);
`;
const rightMiddle = css<{ background: ButtonBackground }>`
  ${buttonBorderRight} ${focus}
  top: -5px;
  left: calc(100% - 2px);
  height: calc(100% + 7px);
  color: ${() => getColorByName("lemon")};
`;
const rightOuter = css<{ background: ButtonBackground }>`
  ${buttonBorderRight} ${focus}
  color: ${() => getColorByName("grey60")};
  width: 12px;
  left: calc(100% - 2px);
  top: -8px;
  color: ${() => getColorByName("grey60")};
  height: calc(100% + 12px);
`;

/* BOTTOM */
const buttonBorderBottom = css<{ background: ButtonBackground }>`
  ${buttonBorder}
  height: 6px;
  top: 100%;
  left: 0;
  width: calc(100% + 6px);
`;

const bottomInner = css<{ background: ButtonBackground }>`
  ${buttonBorderBottom}
  top: calc(100% - 4px);
  width: 100%;
`;
const bottomMiddle = css<{ background: ButtonBackground }>`
  ${buttonBorderBottom} ${focus}
  width: calc(100% + 4px);
  top: calc(100% - 1px);
  color: ${() => getColorByName("lemon")};
`;
const bottomOuter = css<{ background: ButtonBackground }>`
  ${buttonBorderBottom} ${focus}
  width: calc(100% + 5px);
  top: calc(100% + 1px);
  color: ${() => getColorByName("grey60")};
`;

/* LEFT */
const buttonBorderLeft = css<{ background: ButtonBackground }>`
  ${buttonBorder}
  width: 7px;
`;

const leftInner = css<{ background: ButtonBackground }>`
  ${buttonBorderLeft}
  top: -1px;
  right: calc(100% - 3px);
  height: calc(100% + 3px);
`;
const leftMiddle = css<{ background: ButtonBackground }>`
  ${buttonBorderLeft} ${focus}
  top: -4px;
  right: calc(100% - 1px);
  height: calc(100% + 8px);
  color: ${() => getColorByName("lemon")};
`;
const leftOuter = css<{ background: ButtonBackground }>`
  ${buttonBorderLeft} ${focus}
  color: ${() => getColorByName("grey60")};
  width: 10px;
  top: -7px;
  right: calc(100% - 1px);
  height: calc(100% + 14px);
`;

const ButtonBorderTopInner = styled(OakSvg)<{ background: ButtonBackground }>`
  ${topInner}
`;
const ButtonBorderTopMiddle = styled(OakSvg)<{ background: ButtonBackground }>`
  ${topMiddle}
`;
const ButtonBorderTopOuter = styled(OakSvg)<{ background: ButtonBackground }>`
  ${topOuter}
`;
const ButtonBorderRightInner = styled(OakSvg)<{ background: ButtonBackground }>`
  ${rightInner}
`;
const ButtonBorderRightMiddle = styled(OakSvg)<{
  background: ButtonBackground;
}>`
  ${rightMiddle}
`;
const ButtonBorderRightOuter = styled(OakSvg)<{ background: ButtonBackground }>`
  ${rightOuter}
`;
const ButtonBorderBottomInner = styled(OakSvg)<{
  background: ButtonBackground;
}>`
  ${bottomInner}
`;
const ButtonBorderBottomMiddle = styled(OakSvg)<{
  background: ButtonBackground;
}>`
  ${bottomMiddle}
`;
const ButtonBorderBottomOuter = styled(OakSvg)<{
  background: ButtonBackground;
}>`
  ${bottomOuter}
`;
const ButtonBorderLeftInner = styled(OakSvg)<{ background: ButtonBackground }>`
  ${leftInner}
`;
const ButtonBorderLeftMiddle = styled(OakSvg)<{ background: ButtonBackground }>`
  ${leftMiddle}
`;
const ButtonBorderLeftOuter = styled(OakSvg)<{ background: ButtonBackground }>`
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
