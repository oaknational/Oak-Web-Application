import { FC, useRef } from "react";

import Flex from "../Flex";
import { HeaderUnderline, StyledHeader } from "../Header";
import { Menu } from "../Menu";
import Logo from "../Logo";
import MenuLinks from "../MenuLinks";
import { useMenuContext } from "../../context/Menu";
import IconButton from "../Button/IconButton";
import OakLink from "../OakLink";
import useAnalytics from "../../context/Analytics/useAnalytics";
import { menuSections } from "../../browser-lib/fixtures/menuSections";
import Toast from "../Toast";
import { Span } from "../Typography";
import { HeaderProps } from "../Layout/Layout";
import Breadcrumbs from "../Breadcrumbs";

const SiteHeader: FC<HeaderProps> = ({ breadcrumbs }) => {
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
    >
      <OakLink page="home">
        <Logo height={48} width={104} />
      </OakLink>
      <Flex
        $ml={[0, 20, 48]}
        $mr={20}
        $display={["none", "flex"]}
        $minWidth={0}
      >
        {breadcrumbs && <Breadcrumbs breadcrumbs={breadcrumbs} />}
      </Flex>
      <Flex
        $alignItems={"center"}
        $display={["none", "flex"]}
        $ml={["auto"]}
        $font="heading-7"
      >
        <OakLink
          page="classroom"
          data-testid="SiteHeaderClassroomLink"
          htmlAnchorProps={{
            onClick: () => track.classroomSelected({ navigatedFrom: "header" }),
          }}
        >
          Classroom
        </OakLink>
        <Span $ml={24} $mr={32} $whiteSpace={"nowrap"}>
          <OakLink
            page="teacher-hub"
            htmlAnchorProps={{
              onClick: () =>
                track.teacherHubSelected({ navigatedFrom: "header" }),
            }}
          >
            Teacher Hub
          </OakLink>
        </Span>
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
      <Menu menuButtonRef={menuButtonRef}>
        <MenuLinks menuSections={menuSections} />
      </Menu>
      <Toast />
      <HeaderUnderline />
    </StyledHeader>
  );
};

export default SiteHeader;
