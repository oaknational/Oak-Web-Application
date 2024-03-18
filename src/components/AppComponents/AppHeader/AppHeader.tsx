import { FC, useRef } from "react";
import { OakFlex } from "@oaknational/oak-components";

import Logo from "@/components/AppComponents/Logo";
import { HeaderProps } from "@/components/AppComponents/Layout/Layout";
import OwaLink from "@/components/SharedComponents/OwaLink";
import { AppHeaderMenu } from "@/components/AppComponents/AppHeaderMenu";
import { useMenuContext } from "@/context/Menu";
import AppHeaderBurgerMenuSections from "@/components/AppComponents/AppHeaderBurgerMenuSections";
import { ActiveLinkUnderline } from "@/components/SharedComponents/OwaLink/OwaLink";
import IconButton from "@/components/SharedComponents/Button/IconButton";
import Box from "@/components/SharedComponents/Box";
import { StyledHeader } from "@/components/AppComponents/StyledHeader";
import { AppHeaderUnderline } from "@/components/AppComponents/AppHeaderUnderline";
import { burgerMenuSections } from "@/browser-lib/fixtures/burgerMenuSections";
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
      <OakFlex
        $justifyContent={"space-between"}
        $flexGrow={1}
        $alignItems={"center"}
      >
        <OakFlex $justifyContent={"center"} $alignItems={"center"}>
          <OwaLink page={"home"}>
            <Box $display={["block", "none"]}>
              <Logo height={48} width={31} variant="without text" />
            </Box>
            <Box $display={["none", "block"]}>
              <Logo variant="with text" height={48} width={104} />
            </Box>
          </OwaLink>
        </OakFlex>
        <OakFlex $alignItems={"center"} $gap="all-spacing-6" $font="heading-7">
          <OwaLink
            page={"home"}
            $focusStyles={["underline"]}
            $isSelected={true}
          >
            Teachers
            <ActiveLinkUnderline name="horizontal-rule" />
          </OwaLink>
          <OakFlex $alignItems="center" $gap="all-spacing-1">
            <OwaLink
              page="classroom"
              $focusStyles={["underline"]}
              htmlAnchorProps={{
                onClick: () =>
                  track.classroomSelected({ navigatedFrom: "header" }),
                "aria-label": "Pupils (opens in a new tab)",
              }}
            >
              Pupils
            </OwaLink>
            <Icon name="external" />
          </OakFlex>
          <IconButton
            aria-label="Menu"
            icon={"hamburger"}
            variant={"minimal"}
            size={"large"}
            ref={menuButtonRef}
            onClick={openMenu}
            aria-expanded={open}
          />
        </OakFlex>

        <AppHeaderMenu menuButtonRef={menuButtonRef}>
          <AppHeaderBurgerMenuSections
            burgerMenuSections={burgerMenuSections}
          />
        </AppHeaderMenu>
      </OakFlex>
      <AppHeaderUnderline />
    </StyledHeader>
  );
};

export default AppHeader;
