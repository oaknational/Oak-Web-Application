import { FC } from "react";
import Link from "next/link";
import { useTheme } from "styled-components";

import Flex from "../Flex";
import FixedHeader from "../FixedHeader";
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
import Breadcrumbs from "../Breadcrumbs";
import { useBreadcrumbContext } from "../../context/Breadcrumb";

const SiteHeader: FC = () => {
  const theme = useTheme();
  const { toggleMenu } = useMenuContext();
  const { track } = useAnalytics();
  const { breadcrumbs } = useBreadcrumbContext();

  return (
    <FixedHeader $background={theme.header.background}>
      <Link href={"/"}>
        <a>
          <Logo title={"Oak National Academy"} height={48} width={104} />
        </a>
      </Link>
      <Flex
        $ml={[0, 20, 48]}
        $mr={20}
        $display={["none", "flex"]}
        $minWidth={0}
      >
        <Breadcrumbs breadcrumbs={breadcrumbs} />
      </Flex>
      <Flex
        $alignItems={"center"}
        $display={["none", "flex"]}
        $ml={["auto"]}
        $font="heading-7"
      >
        <OakLink
          page="pupils-home"
          htmlAnchorProps={{
            onClick: () => track.classroomSelected({ navigatedFrom: "header" }),
          }}
        >
          Classroom
        </OakLink>
        <Span $ml={24} $mr={32}>
          <OakLink
            page="teachers-home"
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
        icon={"Hamburger"}
        variant={"minimal"}
        size={"header"}
        onClick={() => {
          toggleMenu();
        }}
      />
      <Menu>
        <MenuLinks menuSections={menuSections} />
      </Menu>
      <Toast />
    </FixedHeader>
  );
};

export default SiteHeader;
