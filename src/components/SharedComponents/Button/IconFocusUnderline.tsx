import styled, { css } from "styled-components";

import Svg from "@/components/SharedComponents/Svg";
import type { SvgProps } from "@/components/SharedComponents/Svg";
import type { OakColorName } from "@/styles/theme";
import getColorByName from "@/styles/themeHelpers/getColorByName";
import type { SvgName } from "@/components/SharedComponents/SpriteSheet/getSvgId";

// In styled-components v6, the .attrs method doesn't properly propagate types
// Create a component that defaults the name prop to avoid TS errors
export type IconFocusUnderlineProps = {
  $color: OakColorName;
  name?: never; // Prevent the name prop from being set on this component
};

// Create a component that sets the name prop to "underline-1"
export const IconFocusUnderline = styled((props: IconFocusUnderlineProps) => {
  // Pass all props to Svg including the fixed name prop
  return <Svg {...props} name={"underline-1" as SvgName} />;
})<IconFocusUnderlineProps>`
  color: ${(props) => getColorByName(props.$color)};
  position: absolute;
`;

export const iconFocusUnderline = css`
  ${IconFocusUnderline} {
    display: none;
  }

  :focus ${IconFocusUnderline} {
    display: block;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 8px;
    transform: rotate(-2deg);
    filter: drop-shadow(1px 2px 0 rgb(0 0 0));
  }
`;
