import { FC, useState } from "react";
import styled from "styled-components";

import IconButton from "../Button/IconButton";

interface FlyOutMenuProps {
  visible: boolean;
}

const FlyOutMenu = styled.div<FlyOutMenuProps>`
  // TODO: replace with sliding transition etc
  display: ${(visible) => (visible ? "flex" : "none")};
`;

const Menu: FC = (props) => {
  const [expanded, setExpanded] = useState(false);
  const { children } = props;

  return (
    <nav>
      <IconButton
        icon={"Hamburger"}
        background-color={"transparent"}
        aria-label={"menu"}
        onClick={() => {
          setExpanded(!expanded);
        }}
      />
      <FlyOutMenu visible={expanded}>{children}</FlyOutMenu>
    </nav>
  );
};

export default Menu;
