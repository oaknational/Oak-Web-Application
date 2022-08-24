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

const SiteHeader: FC = () => {
  const theme = useTheme();

  const { toggleMenu } = useMenuContext();
  const menuLinks = [
    { href: "link-a", linkText: "a" },
    { href: "link-b", linkText: "b" },
    { href: "link-c", linkText: "c" },
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
        <MenuLinks menuLinks={menuLinks} />
      </Menu>
    </FixedHeader>
  );
};

export default SiteHeader;
