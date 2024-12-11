import { FC } from "react";
import styled from "styled-components";

import Flex, { FlexProps } from "@/components/SharedComponents/Flex.deprecated";

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

  return (
    <Group role="group" {...flexProps}>
      {children}
    </Group>
  );
};

export default ButtonGroup;
