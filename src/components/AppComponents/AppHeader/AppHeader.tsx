import { FC, useRef } from "react";

import Logo from "@/components/AppComponents/Logo";
import { HeaderProps } from "@/components/AppComponents/Layout/Layout";
import OakLink from "@/components/OakLink";
import { AppHeaderMenu } from "@/components/AppComponents/AppHeaderMenu";
import { useMenuContext } from "@/context/Menu";
import AppHeaderBurgerMenuSections from "@/components/AppComponents/AppHeaderBurgerMenuSections";
import { ActiveLinkUnderline } from "@/components/OakLink/OakLink";
import IconButton from "@/components/SharedComponents/Button/IconButton";
import Flex from "@/components/SharedComponents/Flex";
import Box from "@/components/SharedComponents/Box";
import { StyledHeader } from "@/components/AppComponents/StyledHeader";
import { AppHeaderUnderline } from "@/components/AppComponents/AppHeaderUnderline";
import { betaMenuSections } from "@/browser-lib/fixtures/betaMenuSections";
import Icon from "@/components/SharedComponents/Icon";
import useAnalytics from "@/context/Analytics/useAnalytics";

/**
 * Header for logging in and using search -
 * header for the app, not a landing page
 *
 */
const AppHeader: FC<HeaderProps> = () => {
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { openMenu, open } = useMenuContext();
  const { track } = useAnalytics();

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
            <Box $display={["block", "none"]}>
              <Logo height={48} width={31} variant="without text" />
            </Box>
            <Box $display={["none", "block"]}>
              <Logo variant="with text" height={48} width={104} />
            </Box>
          </OakLink>
        </Flex>
        <Flex $alignItems={"center"} $gap={24} $font="heading-7">
          <OakLink
            page={"home"}
            $focusStyles={["underline"]}
            $isSelected={true}
          >
            Teachers
            <ActiveLinkUnderline name="horizontal-rule" />
          </OakLink>
          <Flex $alignItems="center" $gap={4}>
            <OakLink
              page="classroom"
              $focusStyles={["underline"]}
              htmlAnchorProps={{
                onClick: () =>
                  track.classroomSelected({ navigatedFrom: "header" }),
                "aria-label": "Pupils (opens in a new tab)",
              }}
            >
              Pupils
            </OakLink>
            <Icon name="external" />
          </Flex>
          <IconButton
            aria-label="Menu"
            icon={"hamburger"}
            variant={"minimal"}
            size={"large"}
            ref={menuButtonRef}
            onClick={openMenu}
            aria-expanded={open}
          />
        </Flex>

        <AppHeaderMenu menuButtonRef={menuButtonRef}>
          <AppHeaderBurgerMenuSections menuSections={betaMenuSections} />
        </AppHeaderMenu>
      </Flex>
      <AppHeaderUnderline />
    </StyledHeader>
  );
};

export default AppHeader;
