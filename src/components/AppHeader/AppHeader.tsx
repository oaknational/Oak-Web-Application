import { FC, useRef } from "react";
import styled from "styled-components";

import Flex from "../Flex";
import Logo from "../Logo";
import { HeaderProps } from "../Layout/Layout";
import OakLink from "../OakLink";
import Svg from "../Svg";
import Box from "../Box";
import { Menu } from "../Menu";
import IconButton from "../Button/IconButton";
import { useMenuContext } from "../../context/Menu";
import { P } from "../Typography";
import BurgerMenuSections from "../BurgerMenuSections/BurgerMenuSections";

import { betaMenuSections } from "@/browser-lib/fixtures/betaMenuSections";
import background from "@/styles/utils/background";
import { OakTheme, PropsWithTheme } from "@/styles/theme";

// TODO: pull out into generic header components
const headerConfig = (theme: OakTheme) => theme.header;
const headerHeight = ({ theme }: PropsWithTheme) => headerConfig(theme).height;
const StyledHeader = styled(Flex)`
  ${background}
  padding: 12px 16px;
  width: 100%;
  min-height: ${headerHeight}px;
`;

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
          <P $ml={[6, 40]} $font={["heading-light-7", "heading-light-6"]}>
            Teachers - early access
          </P>
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
      <Box
        $position="absolute"
        $zIndex="behind"
        $height={4}
        $top={56}
        $right={0}
        $left={0}
      >
        <Svg name="header-underline" $color="black" />
      </Box>
    </StyledHeader>
  );
};

export default AppHeader;
