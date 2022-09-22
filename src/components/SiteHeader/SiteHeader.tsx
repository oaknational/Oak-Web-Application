import { FC } from "react";
import Link from "next/link";
import { useTheme } from "styled-components";

import Flex from "../Flex";
import P from "../Typography";
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

const SiteHeader: FC = () => {
  const theme = useTheme();
  const { toggleMenu } = useMenuContext();
  const { track } = useAnalytics();

  return (
    <FixedHeader $background={theme.header.background}>
      <Link href={"/"}>
        <a>
          <Logo title={"Oak National Academy"} height={48} width={104} />
        </a>
      </Link>
      <Flex $alignItems={"center"} $display={["none", "flex"]} $ml={["auto"]}>
        <P $fontFamily={"ui"}>
          <OakLink
            page="pupils-home"
            htmlAnchorProps={{
              onClick: () =>
                track.classroomSelected({ navigatedFrom: "header" }),
            }}
          >
            Classroom
          </OakLink>
        </P>
        <P $ml={24} $mr={32} $fontFamily={"ui"}>
          <OakLink
            page="teachers-home"
            htmlAnchorProps={{
              onClick: () =>
                track.teacherHubSelected({ navigatedFrom: "header" }),
            }}
          >
            Teacher Hub
          </OakLink>
        </P>
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
