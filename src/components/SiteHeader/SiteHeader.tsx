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
import { MenuListElementProps } from "../MenuLinks/types";

const SiteHeader: FC = () => {
  const theme = useTheme();

  const { toggleMenu } = useMenuContext();
  const { pathname } = useRouter();

  const menuLinks: Omit<MenuListElementProps, "currentPath">[] = [
    {
      href: "https://teachers.thenational.academy",
      linkText: "Teacher hub",
      fontFamily: "heading",
      fontSize: [32],
      $mt: [20],
    },
    {
      href: "https://classroom.thenational.academy/",
      linkText: "Classroom",
      fontSize: [32],
      fontFamily: "heading",
      $mt: [16],
    },
    {
      href: "/lesson-planning",
      linkText: "Plan a Lesson",
      fontSize: [24],
      fontFamily: "heading",
      $mt: [32],
    },
    {
      href: "/develop-your-curriculum",
      linkText: "Develop Your Curriculum",
      fontSize: [24],
      fontFamily: "heading",
      $mt: [12],
    },
    {
      href: "/blog",
      linkText: "Blogs",
      fontSize: [16],
      fontFamily: "ui",
      $mt: [32],
    },
    {
      href: "/about-us/who-we-are",
      linkText: "About us",
      fontSize: [16],
      fontFamily: "ui",
      $mt: [8],
    },
    {
      href: "/contact-us",
      linkText: "Contact Us",
      fontSize: [16],
      fontFamily: "ui",
      $mt: [8],
    },
    {
      href: "https://support.thenational.academy",
      linkText: "Help",
      fontSize: [16],
      fontFamily: "ui",
      $mt: [8],
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
          <Link href={"https://classroom.thenational.academy/"}>Classroom</Link>
        </P>
        <P $ml={24} $mr={32}>
          <Link href={"https://teachers.thenational.academy/"}>
            Teacher Hub
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
        <MenuLinks menuLinks={menuLinks} currentPath={pathname} />
      </Menu>
    </FixedHeader>
  );
};

export default SiteHeader;
