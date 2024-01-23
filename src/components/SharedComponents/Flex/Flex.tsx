import styled from "styled-components";

import Box, { BoxProps } from "../Box";

import flex, { FlexCssProps } from "@/styles/utils/flex";

export type FlexProps = FlexCssProps & BoxProps;
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

Flex.defaultProps = {
  $display: "flex",
};

export default Flex;
