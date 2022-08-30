import { FC } from "react";
import Link from "next/link";
import { useTheme } from "styled-components";
import { useRouter } from "next/router";

import Flex from "../Flex";
import P from "../Typography";
import FixedHeader from "../FixedHeader";
import { Menu } from "../Menu";
import Logo from "../Logo";
import MenuLinks from "../MenuLinks";
import { useMenuContext } from "../../context/Menu";
import IconButton from "../Button/IconButton";
import { MenuListItemProps } from "../MenuLinks/types";
import {
  getHelpUrl,
  getPupilsUrl,
  getTeachersUrl,
} from "../../common-lib/urls";
import useAnalytics from "../../context/Analytics/useAnalytics";

const SiteHeader: FC = () => {
  const theme = useTheme();
  const { toggleMenu } = useMenuContext();
  const { asPath } = useRouter();
  const { track } = useAnalytics();

  const menuLinks: Omit<MenuListItemProps, "currentPath">[] = [
    {
      href: getTeachersUrl(),
      target: "_blank",
      onClick: () => track.teacherHubSelected({ navigatedFrom: "header" }),
      linkText: "Teacher hub",
      fontFamily: "heading",
      fontSize: [32],
      $mt: [20],
      arrowSize: [48],
    },
    {
      href: getPupilsUrl(),
      target: "_blank",
      onClick: () => track.teacherHubSelected({ navigatedFrom: "header" }),
      linkText: "Classroom",
      fontSize: [32],
      fontFamily: "heading",
      $mt: [16],
      arrowSize: [48],
    },
    {
      href: "/lesson-planning",
      linkText: "Plan a lesson",
      fontSize: [24],
      fontFamily: "heading",
      $mt: [32],
      arrowSize: [30],
    },
    {
      href: "/develop-your-curriculum",
      linkText: "Develop your curriculum",
      fontSize: [24],
      fontFamily: "heading",
      $mt: [12],
      arrowSize: [30],
    },
    {
      href: "/blog",
      linkText: "Blog",
      fontSize: [16],
      fontFamily: "ui",
      $mt: [32],
      arrowSize: [20],
    },
    {
      href: "/about-us/who-we-are",
      linkText: "About us",
      fontSize: [16],
      fontFamily: "ui",
      $mt: [8],
      arrowSize: [20],
    },
    {
      href: "/contact-us",
      linkText: "Contact us",
      fontSize: [16],
      fontFamily: "ui",
      $mt: [8],
      arrowSize: [20],
    },
    {
      href: getHelpUrl(),
      linkText: "Help",
      fontSize: [16],
      fontFamily: "ui",
      $mt: [8],
      arrowSize: [20],
    },
  ];

  return (
    <FixedHeader $background={theme.header.background}>
      <Link href={"/"}>
        <a>
          <Logo title={"Oak National Academy"} height={48} width={104} />
        </a>
      </Link>
      <Flex $alignItems={"center"} $display={["none", "flex"]} $ml={["auto"]}>
        <P>
          <Link href={getPupilsUrl()}>
            <a
              onClick={() =>
                track.classroomSelected({ navigatedFrom: "header" })
              }
              target="_blank"
            >
              Classroom
            </a>
          </Link>
        </P>
        <P $ml={24} $mr={32}>
          <Link href={getTeachersUrl()}>
            <a
              onClick={() =>
                track.teacherHubSelected({ navigatedFrom: "header" })
              }
              target="_blank"
            >
              Teacher Hub
            </a>
          </Link>
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
        <MenuLinks menuLinks={menuLinks} currentPath={asPath} />
      </Menu>
    </FixedHeader>
  );
};

export default SiteHeader;
