import { FC, HTMLProps, RefObject, useEffect, useRef } from "react";
import styled, { useTheme } from "styled-components";
import { Transition, TransitionStatus } from "react-transition-group";
import { useRouter } from "next/router";
import { FocusOn } from "react-focus-on";

import { useMenuContext } from "../../context/Menu/";
import { OakColorName, PixelSpacing } from "../../styles/theme/types";
import Flex from "../Flex";
import IconButton from "../Button/IconButton";
import Logo from "../Logo";
import SocialButtons from "../SocialButtons";
import Svg from "../Svg";
import Box from "../Box";
import { OAK_SOCIALS } from "../SocialButtons/SocialButtons";

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
  visibility: ${(props) => {
    switch (props.state) {
      case "entering":
        return "visible";
      case "entered":
        return "visible";
      case "exiting":
        return "visible";
      case "exited":
        return "hidden";
    }
  }};
`;

type MenuProps = HTMLProps<HTMLButtonElement> & {
  menuButtonRef: RefObject<HTMLButtonElement> | null;
};

const Menu: FC<MenuProps> = ({ children, menuButtonRef }) => {
  const { open, closeMenu } = useMenuContext();
  const theme = useTheme();
  const { menu: menuConfig } = theme;
  const { pathname } = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const displaySignpost = pathname.startsWith("/beta");

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  const giveFocus = () => {
    closeButtonRef.current?.focus();
  };

  const removeFocus = () => {
    menuButtonRef?.current?.focus();
  };

  return (
    <Transition
      nodeRef={ref}
      timeout={transitionDuration}
      in={open}
      onEntering={giveFocus}
      onExited={removeFocus}
    >
      {(state) => (
        <Box $position="absolute" ref={ref}>
          <MenuBackdrop state={state} />
          <FocusOn
            enabled={open}
            onClickOutside={closeMenu}
            onEscapeKey={closeMenu}
          >
            <SideMenu
              data-testid={"menu"}
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
                name="looping-line-1"
                $display={["none", "block"]}
                $color={"pupilsPink"}
                $zIndex={"behind"}
                $cover
              />
              <Svg
                name="looping-line-2"
                $display={["block", "none"]}
                $color={"pupilsPink"}
                $zIndex={"behind"}
                $cover
              />
              <Box $position={"fixed"} $top={20} $right={16}>
                <IconButton
                  aria-label="Close Menu"
                  icon={"cross"}
                  variant={"minimal"}
                  size={"large"}
                  onClick={closeMenu}
                  ref={closeButtonRef}
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
                {displaySignpost && (
                  <SideBarEarlyAccessSignpost
                    mb={64}
                    display={["none", "flex"]}
                  />
                )}
                <Flex
                  $justifyContent={"left"}
                  $display={["flex", "none"]}
                  $mb={[36, 0]}
                >
                  <Logo height={48} width={104} />
                </Flex>
                {displaySignpost && (
                  <SideBarEarlyAccessSignpost
                    mb={64}
                    display={["none", "flex"]}
                  />
                )}
                {children}
                {/* Desktop logo */}
                <Flex
                  $mt={"auto"}
                  $pt={48}
                  $justifyContent={"space-between"}
                  $alignItems={"flex-end"}
                >
                  <SocialButtons for="Oak National Academy" {...OAK_SOCIALS} />
                  <Flex $display={["none", "flex"]} $mb={6}>
                    <Logo width={150} height={63} />
                  </Flex>
                </Flex>
              </Flex>
            </SideMenu>
          </FocusOn>
        </Box>
      )}
    </Transition>
  );
};

export default Menu;
