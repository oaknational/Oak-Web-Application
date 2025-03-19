import { OakSvg } from "@oaknational/oak-components";
import { FC } from "react";
import styled, { css } from "styled-components";

import { ButtonBackground } from "@/components/SharedComponents/Button/common";
import getColorByName from "@/styles/themeHelpers/getColorByName";
import { HOVER_SHADOW_TRANSITION } from "@/styles/transitions";

interface ButtonBorderProps {
  background: ButtonBackground;
}

const getButtonBorderStyles = (props: ButtonBorderProps) => css`
  position: absolute;
  color: ${getColorByName(props.background)};
  mask-position: center;
`;

const ButtonBorderTop = styled(OakSvg)<ButtonBorderProps>`
  ${getButtonBorderStyles}
  height: 4px;
  left: 0;
  bottom: calc(100% - 1px);
  transition: ${HOVER_SHADOW_TRANSITION};
`;

const ButtonBorderRight = styled(OakSvg)<ButtonBorderProps>`
  ${getButtonBorderStyles}
  width: 7px;
  top: -2px;
  left: calc(100% - 1px);
  height: calc(100% + 3px);
  transition: ${HOVER_SHADOW_TRANSITION};
`;

const ButtonBorderBottom = styled(OakSvg)<ButtonBorderProps>`
  ${getButtonBorderStyles}
  height: 6px;
  top: calc(100% - 1px);
  left: 0;
  transition: ${HOVER_SHADOW_TRANSITION};
`;

const ButtonBorderLeft = styled(OakSvg)<ButtonBorderProps>`
  ${getButtonBorderStyles}
  width: 7px;
  top: -1px;
  right: calc(100% - 1px);
  height: calc(100% + 5px);
  transition: ${HOVER_SHADOW_TRANSITION};
`;

type ButtonBordersProps = ButtonBorderProps;
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
