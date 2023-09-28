import { FC, useRef } from "react";

import Flex from "../Flex";
import Logo from "../Logo";
import { HeaderProps } from "../Layout/Layout";
import OakLink from "../OakLink";
import { Menu } from "../Menu";
import IconButton from "../Button/IconButton";
import { useMenuContext } from "../../context/Menu";
import BurgerMenuSections from "../BurgerMenuSections/BurgerMenuSections";

import { StyledHeader, HeaderUnderline } from "@/components/Header";
import { betaMenuSections } from "@/browser-lib/fixtures/betaMenuSections";

/**
 * Header for logging in and using search -
 * header for the app, not a landing page
 *
 */
const AppHeader: FC<HeaderProps> = () => {
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { openMenu } = useMenuContext();

  return (
    <StyledHeader
      $background="white"
      as="header"
      $justifyContent={["space-between"]}
      $alignItems={["center"]}
      $zIndex="fixedHeader"
      $position={"relative"}
    >
      <Flex
        $justifyContent={"space-between"}
        $flexGrow={1}
        $alignItems={"center"}
      >
        <Flex $justifyContent={"center"} $alignItems={"center"}>
          <OakLink page={"home"}>
            <Logo height={48} width={104} />
          </OakLink>
        </Flex>
        <IconButton
          aria-label="Menu"
          icon={"hamburger"}
          variant={"minimal"}
          size={"large"}
          ref={menuButtonRef}
          onClick={openMenu}
        />
        <Menu menuButtonRef={menuButtonRef}>
          <BurgerMenuSections menuSections={betaMenuSections} />
        </Menu>
      </Flex>
      <HeaderUnderline />
    </StyledHeader>
  );
};

export default AppHeader;
