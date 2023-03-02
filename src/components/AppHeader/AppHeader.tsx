import { FC, useRef } from "react";

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

/**
 * Header for logging in and using search -
 * header for the app, not a landing page
 *
 */
const AppHeader: FC<HeaderProps> = () => {
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { openMenu } = useMenuContext();

  return (
    <FixedHeader $background="pastelTurquoise">
      <Flex
        $justifyContent={"space-between"}
        $flexGrow={1}
        $alignItems={"center"}
      >
        <OakLink page={"beta-teachers-home"}>
          <Logo title={"Oak National Academy"} height={48} width={104} />
        </OakLink>
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
