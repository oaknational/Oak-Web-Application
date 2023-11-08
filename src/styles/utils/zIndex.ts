import { css } from "styled-components";

import responsive, { ResponsiveValues } from "./responsive";

export const zIndexMap = {
  behind: -1,
  neutral: 0,
  inFront: 1,
  mobileFilters: 2,
  fixedHeader: 100,
  modalCloseButton: 150,
  modalDialog: 300,
} as const;

export type ZIndex = keyof typeof zIndexMap | null;

export type ZIndexProps = {
  $zIndex?: ResponsiveValues<ZIndex>;
};
export const parseZIndex = (value?: ZIndex | null) => {
  return value ? zIndexMap[value] : value;
};
const zIndex = css<ZIndexProps>`
  ${responsive("z-index", (props) => props.$zIndex, parseZIndex)}
`;

export default zIndex;
