import { FC, useContext } from "react";
import styled, { useTheme } from "styled-components";

import { menuContext } from "../../context/Menu/MenuProvider";
import { OakColorName } from "../../styles/theme/types";
import getColorByName from "../../styles/themeHelpers/getColorByName";
import Flex from "../Flex";
import IconButton from "../Button/IconButton";

export type MenuConfig = {
  width: string;
  color: OakColorName;
  background: OakColorName;
};

type SideMenuProps = {
  open: boolean;
};

const SideMenu = styled(Flex)<SideMenuProps & MenuConfig>`
  background: ${(props) => getColorByName(props.background)};
  height: 100vh;
  width: ${(props) => props.width};
  position: fixed;
  z-index: 1;
  top: 0;
  right: 0;
  padding: 16px;
  transform: ${(props) =>
    props.open ? "translate3D(0, 0, 0)" : `translate3D(${props.width}, 0, 0)`};
  overflow-x: hidden; /* Disable horizontal scroll */
  transition: transform 0.3s ease-in-out;
`;

const MenuHeader = styled(Flex)`
  width: 100%;
`;

const Menu: FC = ({ children }) => {
  const { toggleMenu, open } = useContext(menuContext);
  const theme = useTheme();
  const { menu } = theme;
  const { background, color, width } = menu;

  return (
    <SideMenu
      open={open}
      $flexDirection={"column"}
      background={background}
      color={color}
      width={width}
    >
      <nav>
        <MenuHeader $justifyContent={"right"}>
          <IconButton
            aria-label="Menu"
            icon={"Close"}
            variant={"minimal"}
            onClick={() => {
              toggleMenu();
            }}
          />
        </MenuHeader>
        {children}
      </nav>
    </SideMenu>
  );
};

export default Menu;
