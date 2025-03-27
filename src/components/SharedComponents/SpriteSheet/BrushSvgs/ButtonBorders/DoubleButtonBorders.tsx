import { OakSvg } from "@oaknational/oak-components";
import { FC } from "react";
import styled, { css } from "styled-components";

import { ButtonBackground } from "@/components/SharedComponents/Button/common";
import getColorByName from "@/styles/themeHelpers/getColorByName";

interface ButtonBorderProps {
  background: ButtonBackground;
}

const getButtonBorderStyles = (props: ButtonBorderProps) => css`
  position: absolute;
  color: ${getColorByName(props.background)};
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
const ButtonBorderTopInner = styled(OakSvg)<ButtonBorderProps>`
  ${getButtonBorderStyles}
  height: 5px;
  left: 0;
  width: 100%;
  bottom: calc(100% - 2px);
`;

const ButtonBorderTopMiddle = styled(OakSvg)<ButtonBorderProps>`
  ${getButtonBorderStyles}
  height: 5px;
  left: 0;
  width: 100%;
  bottom: calc(100% + 1px);
  ${focus}
  color: ${() => getColorByName("lemon")};
`;

const ButtonBorderTopOuter = styled(OakSvg)<ButtonBorderProps>`
  ${getButtonBorderStyles}
  height: 5px;
  left: 0;
  width: 100%;
  bottom: calc(100% + 4px);
  ${focus}
  color: ${() => getColorByName("grey60")};
`;

/* RIGHT */
const ButtonBorderRightInner = styled(OakSvg)<ButtonBorderProps>`
  ${getButtonBorderStyles}
  width: 9px;
  left: 100%;
  top: -3px;
  left: calc(100% - 5px);
  height: calc(100% + 3px);
`;

const ButtonBorderRightMiddle = styled(OakSvg)<ButtonBorderProps>`
  ${getButtonBorderStyles}
  width: 9px;
  left: 100%;
  top: -5px;
  left: calc(100% - 2px);
  height: calc(100% + 7px);
  ${focus}
  color: ${() => getColorByName("lemon")};
`;

const ButtonBorderRightOuter = styled(OakSvg)<ButtonBorderProps>`
  ${getButtonBorderStyles}
  width: 12px;
  left: calc(100% - 2px);
  top: -8px;
  height: calc(100% + 12px);
  ${focus}
  color: ${() => getColorByName("grey60")};
`;

/* BOTTOM */
const ButtonBorderBottomInner = styled(OakSvg)<ButtonBorderProps>`
  ${getButtonBorderStyles}
  height: 6px;
  top: calc(100% - 4px);
  left: 0;
  width: 100%;
`;

const ButtonBorderBottomMiddle = styled(OakSvg)<ButtonBorderProps>`
  ${getButtonBorderStyles}
  height: 6px;
  top: calc(100% - 1px);
  left: 0;
  width: calc(100% + 4px);
  ${focus}
  color: ${() => getColorByName("lemon")};
`;

const ButtonBorderBottomOuter = styled(OakSvg)<ButtonBorderProps>`
  ${getButtonBorderStyles}
  height: 6px;
  top: calc(100% + 1px);
  left: 0;
  width: calc(100% + 5px);
  ${focus}
  color: ${() => getColorByName("grey60")};
`;

/* LEFT */
const ButtonBorderLeftInner = styled(OakSvg)<ButtonBorderProps>`
  ${getButtonBorderStyles}
  width: 7px;
  top: -1px;
  right: calc(100% - 3px);
  height: calc(100% + 3px);
`;

const ButtonBorderLeftMiddle = styled(OakSvg)<ButtonBorderProps>`
  ${getButtonBorderStyles}
  width: 7px;
  top: -4px;
  right: calc(100% - 1px);
  height: calc(100% + 8px);
  ${focus}
  color: ${() => getColorByName("lemon")};
`;

const ButtonBorderLeftOuter = styled(OakSvg)<ButtonBorderProps>`
  ${getButtonBorderStyles}
  width: 10px;
  top: -7px;
  right: calc(100% - 1px);
  height: calc(100% + 14px);
  ${focus}
  color: ${() => getColorByName("grey60")};
`;

type ButtonBordersProps = ButtonBorderProps;
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
