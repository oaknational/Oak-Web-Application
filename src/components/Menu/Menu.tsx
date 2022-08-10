import { FC } from "react";
import styled, { useTheme } from "styled-components";
import { FocusScope } from "react-aria";
import { Transition, TransitionStatus } from "react-transition-group";

import { useMenuContext } from "../../context/Menu/";
import { OakColorName } from "../../styles/theme/types";
import getColorByName from "../../styles/themeHelpers/getColorByName";
import Flex from "../Flex";
import zIndex, { ZIndexProps } from "../../styles/utils/zIndex";
import IconButton from "../Button/IconButton";
import Logo from "../Logo";

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

const SideMenu = styled(Flex)<MenuConfig & TransitionProps & ZIndexProps>`
  ${zIndex}
  background: ${(props) => getColorByName(props.background)};
  height: 100%;
  position: fixed;
  top: 0;
  right: 0;
  padding: 0 0 0 16px;
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
  $width: ["100%", "40%"],
};

const MenuHeader = styled(Flex)`
  width: 100%;
  min-height: 72px;
`;

const Menu: FC = ({ children }) => {
  const { open, toggleMenu } = useMenuContext();
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
              $zIndex={"neutral"}
            >
              <MenuHeader
                $justifyContent={"right"}
                $alignItems={"center"}
                $pr={16}
              >
                <IconButton
                  aria-label="Close Menu"
                  icon={"Cross"}
                  variant={"minimal"}
                  size={"header"}
                  onClick={() => {
                    toggleMenu();
                  }}
                />
              </MenuHeader>
              <Flex $flexDirection={"column"} $overflow={"auto"} $flexGrow={1}>
                {children}
                <Flex
                  $justifyContent={"right"}
                  $mt={"auto"}
                  $mb={72}
                  $mr={[0, 72]}
                >
                  <Logo
                    title={"Oak National Academy"}
                    width={150}
                    height={63}
                  />
                </Flex>
              </Flex>
            </SideMenu>
          </FocusScope>
        </>
      )}
    </Transition>
  );
};

export default Menu;
