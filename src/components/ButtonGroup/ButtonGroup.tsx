import { FC } from "react";
import styled from "styled-components";

import Flex, { FlexProps } from "../Flex";

const Group = styled(Flex)`
  & > *:not(:last-child) {
    margin-right: 12px;
  }
`;

export type ButtonGroupProps = FlexProps;
const ButtonGroup: FC<ButtonGroupProps> = (props) => {
  /**
   * @todo run time check that all children are Button or IconButton components
   */
  const { children, ...flexProps } = props;

  return <Group {...flexProps}>{children}</Group>;
};

export default ButtonGroup;
