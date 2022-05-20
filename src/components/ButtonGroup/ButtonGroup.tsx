import { FC } from "react";
import styled from "styled-components";

const Group = styled.div`
  display: flex;
  flex-wrap: wrap;
  & > * {
    margin-bottom: 8px;
  }
  & *:not(:last-child) {
    margin-right: 12px;
  }
`;

/**
 * @todo run time check that all children are Button or IconButton components
 */
const ButtonGroup: FC = (props) => {
  const { children } = props;

  return <Group>{children}</Group>;
};

export default ButtonGroup;
