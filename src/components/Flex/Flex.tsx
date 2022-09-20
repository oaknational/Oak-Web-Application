import styled from "styled-components";

import Box, { BoxProps } from "../Box";
import flex, { FlexCssProps } from "../../styles/utils/flex";
import { HTMLDivProps } from "../ClickableCard/ClickableCard";

export type FlexProps<HTMLProps = HTMLDivProps> = FlexCssProps &
  BoxProps &
  HTMLProps;
/**
 * Flex sets `display: flex;` and exposes various flex props, along with Box
 * props.
 *
 * ## Usage
 * Before adding props to this component, think about whether it makes sense
 * to add it to Box instead, as this component extends that.
 */
const Flex = styled(Box)<FlexProps>`
  ${flex}
`;

export default Flex;
