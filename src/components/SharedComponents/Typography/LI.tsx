import styled, { css, CSSProperties } from "styled-components";

import flex from "../../../styles/utils/flex";
import responsive, { ResponsiveValues } from "../../../styles/utils/responsive";
import typography, { TypographyProps } from "../../../styles/utils/typography";
import { GridAreaProps } from "../../Grid";
import { gridArea } from "../../Grid/GridArea";
import { box } from "../Box";

import { FlexProps } from "@/components/SharedComponents/Flex";

type ListItemProps = {
  listStyle?: ResponsiveValues<CSSProperties["listStyle"]>;
};

const listItem = css<ListItemProps>`
  ${responsive("list-style", (props) => props.listStyle)}
`;

/**
 * Styled `li` (list item) component.
 *
 * ## Usage
 *
 * Places where we directly want to style a list item
 *
 * */
const LI = styled.li<FlexProps & TypographyProps & ListItemProps>`
  ${box}
  ${flex}
  ${typography}
  ${listItem}
`;

LI.defaultProps = {
  $display: "revert",
};

/**
 * Styled LI with properties of GridArea
 */
export const GridAreaListItem = styled(LI)<GridAreaProps & FlexProps>`
  display: flex;
  list-style: none;
  ${gridArea}
  ${flex}
  ${box}
`;

export default LI;
