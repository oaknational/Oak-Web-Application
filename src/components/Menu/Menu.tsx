import { FC, useContext } from "react";
import styled from "styled-components";

import { menuContext } from "../../context/Menu/MenuProvider";
import Flex from "../Flex";

type SideMenuProps = {
  open: boolean;
};

const SideMenu = styled(Flex)<SideMenuProps>`
  height: 100vh;
  width: 300px;
  position: fixed;
  z-index: 1;
  top: 0;
  right: 0;
  transform: ${(props) =>
    props.open ? "translate3D(0, 0, 0)" : "translate3D(300px, 0, 0)"};
  overflow-x: hidden; /* Disable horizontal scroll */
  transition: 0.5s; /* 0.5 second transition effect to slide in the sidenav */
`;

const Menu: FC = ({ children }) => {
  const { toggleMenu, open } = useContext(menuContext);

  return (
    <SideMenu open={open} $flexDirection={"column"}>
      {children}
    </SideMenu>
  );
};

export default Menu;
