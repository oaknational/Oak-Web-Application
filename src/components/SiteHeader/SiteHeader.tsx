import { FC } from "react";
import Link from "next/link";
import { useTheme } from "styled-components";

import Flex from "../Flex";
import P, { Span } from "../Typography";
import FixedHeader from "../FixedHeader";
import IconButton from "../Button/IconButton";
import { useMenuContext } from "../../context/Menu/";
import { Menu } from "../Menu";
import Logo from "../Logo";

const SiteHeader: FC = () => {
  const theme = useTheme();

  const { toggleMenu } = useMenuContext();

  return (
    <FixedHeader $background={theme.header.background}>
      <Link href={"/"}>
        <a>
          <Logo title={"Oak National Academy"} />
        </a>
      </Link>
      <Flex $alignItems={"center"} $display={["none", "flex"]} $ml={["auto"]}>
        <P>
          <Link href={"https://classroom.thenational.academy/"}>Classroom</Link>
        </P>
        <P $ml={24} $mr={24}>
          <Link href={"https://teachers.thenational.academy/"}>
            Teacher Hub
          </Link>
        </P>
      </Flex>
      <IconButton
        aria-label="Menu"
        icon={"Hamburger"}
        variant={"minimal"}
        onClick={() => {
          toggleMenu();
        }}
      />
      <Menu>
        <Link href={"/"}>Home</Link>
        <ul role="list">
          <li>
            <Span $fontFamily={"heading"} $fontSize={[32]}>
              <Link href={"https://teachers.thenational.academy/"}>
                Teacher Hub
              </Link>
            </Span>
          </li>
          <li>
            <Span $fontFamily={"heading"} $fontSize={[32]}>
              <Link href={"https://classroom.thenational.academy/"}>
                Classroom
              </Link>
            </Span>
          </li>
        </ul>
      </Menu>
    </FixedHeader>
  );
};

export default SiteHeader;
