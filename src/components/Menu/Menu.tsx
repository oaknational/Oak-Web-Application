import { FC, useEffect, useRef } from "react";
import styled, { useTheme } from "styled-components";
import { FocusScope } from "react-aria";
import { Transition, TransitionStatus } from "react-transition-group";
import { useRouter } from "next/router";

import { useMenuContext } from "../../context/Menu/";
import { OakColorName, PixelSpacing } from "../../styles/theme/types";
import Flex from "../Flex";
import IconButton from "../Button/IconButton";
import Logo from "../Logo";
import SocialButtons from "../SocialButtons";
import Svg from "../Svg";
import Box from "../Box";

import MenuBackdrop from "./MenuBackdrop";

export type MenuConfig = {
  width: PixelSpacing;
  background: OakColorName;
};

export type TransitionProps = {
  state: TransitionStatus;
};
const transitionDuration = 250;

const SideMenu = styled(Flex)<TransitionProps>`
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

const Menu: FC = ({ children }) => {
  const { open, toggleMenu, closeMenu } = useMenuContext();
  const theme = useTheme();
  const { menu: menuConfig } = theme;
  const { pathname } = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  return (
    <Transition nodeRef={ref} timeout={transitionDuration} in={open}>
      {(state) => (
        <Box $position="absolute" ref={ref}>
          <MenuBackdrop state={state} />
          <FocusScope contain restoreFocus autoFocus>
            <SideMenu
              $position="fixed"
              $top={0}
              $right={0}
              $height="100%"
              $maxWidth="100%"
              $width={menuConfig.width}
              $flexDirection={"column"}
              $background={menuConfig.background}
              state={state}
              $zIndex={"neutral"}
            >
              <Svg
                name="LoopingLine"
                $display={["none", "block"]}
                $color={"pupilsPink"}
                $zIndex={"behind"}
                $cover
              />
              <Svg
                name="LoopingLine2"
                $display={["block", "none"]}
                $color={"pupilsPink"}
                $zIndex={"behind"}
                $cover
              />
              <Box $position={"fixed"} $top={20} $right={16}>
                <IconButton
                  aria-label="Close Menu"
                  icon={"Cross"}
                  variant={"minimal"}
                  size={"header"}
                  onClick={toggleMenu}
                />
              </Box>
              <Flex
                $flexDirection={"column"}
                $overflowY={"auto"}
                $flexGrow={1}
                $pv={[12, 72]}
                $ph={[16, 72]}
              >
                {/* Mobile logo */}
                <Flex
                  $justifyContent={"left"}
                  $display={["flex", "none"]}
                  $mb={[36, 0]}
                >
                  <Logo
                    title={"Oak National Academy"}
                    height={48}
                    width={104}
                  />
                </Flex>
                {children}
                {/* Desktop logo */}
                <Flex
                  $mt={"auto"}
                  $pt={48}
                  $justifyContent={"space-between"}
                  $alignItems={"flex-end"}
                >
                  <SocialButtons />
                  <Flex $display={["none", "flex"]} $mb={6}>
                    <Logo
                      title={"Oak National Academy"}
                      width={150}
                      height={63}
                    />
                  </Flex>
                </Flex>
              </Flex>
            </SideMenu>
          </FocusScope>
        </Box>
      )}
    </Transition>
  );
};

export default Menu;
