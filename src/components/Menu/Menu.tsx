import { FC, useContext } from "react";
import styled, { useTheme } from "styled-components";
import { FocusScope } from "react-aria";
import { Transition, TransitionStatus } from "react-transition-group";

import { menuContext } from "../../context/Menu/MenuProvider";
import { OakColorName } from "../../styles/theme/types";
import getColorByName from "../../styles/themeHelpers/getColorByName";
import Flex from "../Flex";
import IconButton from "../Button/IconButton";

import MenuBackdrop from "./MenuBackdrop";

export type MenuConfig = {
  width: string;
  color: OakColorName;
  background: OakColorName;
};

export type TransitionProps = {
  state: TransitionStatus;
};
const transitionDuration = 250;

const SideMenu = styled(Flex)<MenuConfig & TransitionProps>`
  background: ${(props) => getColorByName(props.background)};
  height: 100%;
  position: fixed;
  z-index: 1;
  top: 0;
  right: 0;
  padding: 16px;
  transition: transform ${transitionDuration}ms ease-in-out;
  transform: ${(props) => {
    switch (props.state) {
      case "entering":
        return "translate3D(0, 0, 0)";
      case "entered":
        return "translate3D(0, 0, 0)";
      case "exiting":
        return "translate3D(100%, 0, 0)";
      case "exited":
        return "translate3D(100%, 0, 0)";
    }
  }};
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
    <Transition timeout={transitionDuration} in={open} unmountOnExit>
      {(state) => (
        <>
          <MenuBackdrop state={state} />
          <FocusScope contain restoreFocus autoFocus>
            <SideMenu
              $flexDirection={"column"}
              background={background}
              color={color}
              width={width}
              state={state}
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
          </FocusScope>
        </>
      )}
    </Transition>
  );
};

export default Menu;
