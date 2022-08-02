import { FC, useContext } from "react";
import styled, { useTheme } from "styled-components";

import { menuContext } from "../../context/Menu/MenuProvider";
import { OakColorName } from "../../styles/theme/types";
import getColorByName from "../../styles/themeHelpers/getColorByName";
import Flex from "../Flex";
import IconButton from "../Button/IconButton";

import MenuBackdrop from "./MenuBackdrop";

type MenuConfig = {
  width: string;
  color: OakColorName;
  background: OakColorName;
};

type SideMenuProps = {
  open: boolean;
};

const MenuWrapper = styled.div`
  position: absolute;
`;

const SideMenu = styled(Flex)<SideMenuProps & MenuConfig>`
  background: ${(props) => getColorByName(props.background)};
  height: 100%;
  position: fixed;
  z-index: 1;
  top: 0;
  right: 0;
  padding: 16px;
  transform: ${(props) =>
    props.open ? "translate3D(0, 0, 0)" : `translate3D(100%, 0, 0)`};
  overflow-x: hidden;
  transition: transform 0.3s ease-in-out;
`;

SideMenu.defaultProps = {
  $width: ["100%", "50%"],
};

const MenuHeader = styled(Flex)`
  width: 100%;
`;

const Menu: FC = ({ children }) => {
  const { toggleMenu, open } = useContext(menuContext);
  const theme = useTheme();
  const { menu } = theme;
  const { background, color, width } = menu;

  return (
    <MenuWrapper>
      <MenuBackdrop />
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
    </MenuWrapper>
  );
};

export default Menu;
