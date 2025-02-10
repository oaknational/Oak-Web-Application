import { FC, HTMLProps, RefObject, useEffect, useRef } from "react";
import styled, { useTheme } from "styled-components";
import { Transition, TransitionStatus } from "react-transition-group";
import { useRouter } from "next/router";
import { FocusOn } from "react-focus-on";
import {
  OakIcon,
  OakBox,
  OakBoxProps,
  oakBoxCss,
  OakFlex,
  OakFlexProps,
  oakFlexCss,
} from "@oaknational/oak-components";

import { useMenuContext } from "@/context/Menu/";
import Logo from "@/components/AppComponents/Logo";
import { OAK_SOCIALS } from "@/components/SharedComponents/SocialButtons/SocialButtons";
import MenuBackdrop from "@/components/AppComponents/MenuBackdrop";
import { OakColorName, PixelSpacing } from "@/styles/theme/types";
import SocialButtons from "@/components/SharedComponents/SocialButtons";
import IconButton from "@/components/SharedComponents/Button/IconButton";
import Flex from "@/components/SharedComponents/Flex.deprecated";

export type MenuConfig = {
  width: PixelSpacing;
  background: OakColorName;
};

export type TransitionProps = {
  state: TransitionStatus;
};
const transitionDuration = 250;

export const SideMenu = styled(Flex)<TransitionProps>`
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

type AppHeaderMenuProps = HTMLProps<HTMLButtonElement> & {
  menuButtonRef: RefObject<HTMLButtonElement> | null;
};

const NavMenuList = styled("nav")<OakFlexProps & OakBoxProps>`
  ${oakBoxCss}
  ${oakFlexCss}
`;

const AppHeaderMenu: FC<AppHeaderMenuProps> = ({ children, menuButtonRef }) => {
  const { open, closeMenu } = useMenuContext();
  const theme = useTheme();
  const { menu: menuConfig } = theme;
  const { pathname } = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

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
        <OakBox $position="absolute" ref={ref} $zIndex="modal-dialog">
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
              aria-expanded={open}
            >
              <OakIcon
                iconName="looping-line-1"
                $colorFilter={"pink"}
                $zIndex={"behind"}
                $objectFit={"fill"}
                $display={["none", "block"]}
                $position={"absolute"}
                $width={"100%"}
                $height={"100%"}
              />
              <OakIcon
                iconName="looping-line-2"
                $colorFilter={"pink"}
                $zIndex={"behind"}
                $objectFit={"fill"}
                $display={["block", "none"]}
                $position={"absolute"}
                $width={"100%"}
                $height={"100%"}
              />
              <OakBox
                $position={"fixed"}
                $top={"all-spacing-5"}
                $right={"all-spacing-4"}
              >
                <IconButton
                  aria-label="Close Menu"
                  icon={"cross"}
                  variant={"minimal"}
                  size={"large"}
                  onClick={closeMenu}
                  ref={closeButtonRef}
                  aria-expanded={open}
                />
              </OakBox>
              <NavMenuList
                $flexDirection={"column"}
                $overflowY={"auto"}
                $flexGrow={1}
                $pv={["inner-padding-s", "inner-padding-xl7"]}
                $ph={["inner-padding-m", "inner-padding-xl7"]}
              >
                {/* Mobile logo */}
                <OakFlex
                  $justifyContent={"left"}
                  $display={["flex", "none"]}
                  $mb={["space-between-m2", "space-between-none"]}
                >
                  <Logo variant="with text" height={48} width={104} />
                </OakFlex>
                {children}
                {/* Desktop logo */}
                <OakFlex
                  $mt={"auto"}
                  $pt={"inner-padding-xl4"}
                  $justifyContent={"space-between"}
                  $alignItems={"flex-end"}
                >
                  <SocialButtons for="Oak National Academy" {...OAK_SOCIALS} />
                  <OakFlex
                    $display={["none", "flex"]}
                    $mb={"space-between-sssx"}
                  >
                    <Logo variant="with text" width={150} height={63} />
                  </OakFlex>
                </OakFlex>
              </NavMenuList>
            </SideMenu>
          </FocusOn>
        </OakBox>
      )}
    </Transition>
  );
};

export default AppHeaderMenu;
