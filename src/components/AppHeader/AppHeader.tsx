import { FC, useRef } from "react";
import { useRouter } from "next/router";

import Flex from "../Flex";
import FixedHeader from "../FixedHeader";
import Logo from "../Logo";
import { HeaderProps } from "../Layout/Layout";
import OakLink from "../OakLink";
import Svg from "../Svg";
import Box from "../Box";
import { Menu } from "../Menu";
import IconButton from "../Button/IconButton";
import { useMenuContext } from "../../context/Menu";
import MenuLinks from "../MenuLinks";
import { menuSections } from "../../browser-lib/fixtures/menuSections";
import { P } from "../Typography";
/**
 * Header for logging in and using search -
 * header for the app, not a landing page
 *
 */
const AppHeader: FC<HeaderProps> = () => {
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { openMenu } = useMenuContext();
  const { pathname } = useRouter();
  const displayMenu = pathname.startsWith("/beta");

  if (displayMenu) {
    if (!menuSections.large[0]) {
      return null;
    }
    menuSections.large[0].linkText = "Home (early access)";
    menuSections.large[0].page = "beta-teachers-home";
  }

  return (
    <FixedHeader $background="pastelTurquoise">
      <Flex
        $justifyContent={"space-between"}
        $flexGrow={1}
        $alignItems={"center"}
      >
        <Flex $justifyContent={"center"} $alignItems={"center"}>
          <OakLink page={"beta-teachers-home"}>
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
          <MenuLinks menuSections={menuSections} />
        </Menu>
      </Flex>
      <Box
        $position="absolute"
        $zIndex={"behind"}
        $height={[8, 12]}
        $bottom={[4, -4]}
        $right={0}
        $left={0}
      >
        <Svg name="header-underline" $color="teachersHighlight" />
      </Box>
    </FixedHeader>
  );
};

export default AppHeader;
