import { css } from "styled-components";

import responsive from "./responsive";

type DropShadowVariant =
  | "grey20"
  | "notificationCard"
  | "interactiveCardHover"
  | "subjectCardHover"
  | "subjectCard"
  | "expandableContainerHover"
  | "none";
export type DropShadowProps = {
  $dropShadow?: DropShadowVariant;
};
export const DROP_SHADOW: Record<DropShadowVariant, string> = {
  grey20: "0 8px 8px rgba(92, 92, 92, 20%)",
  notificationCard: "0px 4px 16px rgba(84, 84, 84, 0.3)",
  interactiveCardHover: "3px 3px 8px rgba(0, 0, 0, 70%)",
  subjectCardHover: "0px 8px 0px 0px rgba(0, 0, 0, 1)",
  subjectCard: "0px 0px 0px 0px rgba(0, 0, 0, 0)",
  expandableContainerHover: "inset 0px -8px 0px 0px rgba(0, 0, 0, 1)",
  none: "none",
};
const parseDropShadow = (variant?: DropShadowVariant | null) => {
  if (!variant) {
    return;
  }

  return DROP_SHADOW[variant];
};
const dropShadow = css`
  ${responsive<DropShadowProps, DropShadowVariant>(
    "box-shadow",
    (props) => props.$dropShadow,
    parseDropShadow,
  )}
`;

export default dropShadow;
