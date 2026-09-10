import styled from "styled-components";
import { FC } from "react";
import { OakFlex, OakFlexProps } from "@oaknational/oak-components";

const Group = styled(OakFlex)`
  & > *:not(:last-child) {
    margin-right: 12px;
  }
`;

export type ButtonGroupProps = OakFlexProps;
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
