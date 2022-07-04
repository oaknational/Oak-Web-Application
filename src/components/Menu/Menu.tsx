import { FC, useState } from "react";
import styled from "styled-components";

import IconButton from "../Button/IconButton";

const MenuNav = styled.nav`
  position: static;
  display: block;
`;

interface FlyOutMenuProps {
  visible: boolean;
}

const FlyOutMenu = styled.div<FlyOutMenuProps>`
  // TODO: replace with sliding transition etc
  display: ${(props) => (props.visible ? "block" : "none")};
  position: absolute;
  z-index: 1;
  background: white;
  left: 0;
  top: 72px;
  width: 100vw;
`;

const Menu: FC = (props) => {
  const [expanded, setExpanded] = useState(false);
  const { children } = props;

  console.log(expanded);

  return (
    <MenuNav>
      <IconButton
        icon={"Hamburger"}
        background-color={"transparent"}
        aria-label={"menu"}
        onClick={() => {
          setExpanded(!expanded);
        }}
      />
      <FlyOutMenu visible={expanded}>{children}</FlyOutMenu>
    </MenuNav>
  );
};

export default Menu;
