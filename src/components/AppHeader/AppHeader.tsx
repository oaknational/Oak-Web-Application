import { FC, useRef } from "react";
import styled from "styled-components";

import Flex from "../Flex";
import Logo from "../Logo";
import { HeaderProps } from "../Layout/Layout";
import OakLink from "../OakLink";
import { Menu } from "../Menu";
import IconButton from "../Button/IconButton";
import { useMenuContext } from "../../context/Menu";
import BurgerMenuSections from "../BurgerMenuSections/BurgerMenuSections";
import { ActiveLinkUnderline } from "../OakLink/OakLink";
import Box from "../Box";

import { StyledHeader, HeaderUnderline } from "@/components/Header";
import { betaMenuSections } from "@/browser-lib/fixtures/betaMenuSections";
import Icon from "@/components/Icon";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { getBreakpoint } from "@/styles/utils/responsive";

const DesktopWrapper = styled(Box)`
  @media (max-width: ${getBreakpoint("small")}px) {
    display: none;
  }
`;

const MobileWrapper = styled(Box)`
  @media (min-width: ${getBreakpoint("small")}px) {
    display: none;
  }
`;

/**
 * Header for logging in and using search -
 * header for the app, not a landing page
 *
 */
const AppHeader: FC<HeaderProps> = () => {
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { openMenu } = useMenuContext();
  const { track } = useAnalytics();

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
            <MobileWrapper>
              <Logo height={48} width={31} variant="without text" />
            </MobileWrapper>
            <DesktopWrapper>
              <Logo variant="with text" height={48} width={104} />
            </DesktopWrapper>
          </OakLink>
        </Flex>
        <Flex $alignItems={"center"} $gap={24} $font="heading-7">
          <OakLink
            page={null}
            href={"/teachers"}
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
              }}
            >
              Classroom
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
          />
        </Flex>

        <Menu menuButtonRef={menuButtonRef}>
          <BurgerMenuSections menuSections={betaMenuSections} />
        </Menu>
      </Flex>
      <HeaderUnderline />
    </StyledHeader>
  );
};

export default AppHeader;
