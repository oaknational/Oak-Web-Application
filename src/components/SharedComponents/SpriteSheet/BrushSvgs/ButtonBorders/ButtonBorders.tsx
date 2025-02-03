import { FC } from "react";
import styled, { css } from "styled-components";
import { OakSvg } from "@oaknational/oak-components";

import getColorByName from "@/styles/themeHelpers/getColorByName";
import { ButtonBackground } from "@/components/SharedComponents/Button/common";
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
  bottom: calc(100% - 1px);
  transition: ${HOVER_SHADOW_TRANSITION};
`;

const buttonBorderRight = css`
  ${buttonBorder}
  width: 7px;
  top: -2px;
  left: calc(100% - 1px);
  height: calc(100% + 3px);
  transition: ${HOVER_SHADOW_TRANSITION};
`;

const buttonBorderBottom = css`
  ${buttonBorder}
  height: 6px;
  top: calc(100% - 1px);
  left: 0;
  transition: ${HOVER_SHADOW_TRANSITION};
`;

const buttonBorderLeft = css`
  ${buttonBorder}
  width: 7px;
  top: -1px;
  right: calc(100% - 1px);
  height: calc(100% + 5px);
  transition: ${HOVER_SHADOW_TRANSITION};
`;

const ButtonBorderTop = styled(OakSvg)`
  ${buttonBorderTop}
`;
const ButtonBorderRight = styled(OakSvg)`
  ${buttonBorderRight}
`;
const ButtonBorderBottom = styled(OakSvg)`
  ${buttonBorderBottom}
`;
const ButtonBorderLeft = styled(OakSvg)`
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
