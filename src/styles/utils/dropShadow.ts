import { css } from "styled-components";

import responsive from "./responsive";

type DropShadowVariant = "grey20" | "notificationCard";
export type DropShadowProps = {
  $dropShadow?: DropShadowVariant;
};
const dropShadowMap: Record<DropShadowVariant, string> = {
  grey20: "0 8px 8px rgba(92, 92, 92, 20%)",
  notificationCard: "0px 4px 16px rgba(84, 84, 84, 0.3)",
};
const parseDropShadow = (variant?: DropShadowVariant | null) => {
  if (!variant) {
    return;
  }

  return dropShadowMap[variant];
};
const dropShadow = css`
  ${responsive<DropShadowProps, DropShadowVariant>(
    "box-shadow",
    (props) => props.$dropShadow,
    parseDropShadow
  )}
`;

export default dropShadow;
