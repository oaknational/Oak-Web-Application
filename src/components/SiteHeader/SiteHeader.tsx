import { FC } from "react";
import Link from "next/link";
import styled, { useTheme } from "styled-components";

import Flex from "../Flex";
import P, { Heading } from "../Typography";
import FixedHeader from "../FixedHeader";
import { Menu } from "../Menu";
import Logo from "../Logo";
import { useMenuContext } from "../../context/Menu";
import IconButton from "../Button/IconButton";
import Icon from "../Icon";

const Home = styled(Heading)`
  opacity: 0.6;
  text-decoration: underline;
`;

const LocationIcon = styled(Icon)`
  opacity: 0.6;
`;

const SiteHeader: FC = () => {
  const theme = useTheme();

  const { toggleMenu } = useMenuContext();

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
        size={"small"}
        onClick={() => {
          toggleMenu();
        }}
      />
      <Menu>
        {/* TODO:
         * move menu contents into new component using fixture
         * add urls for new pages
         * add moving arrow
         */}
        <Flex $alignItems={"center"}>
          <LocationIcon variant="minimal" name="ArrowRight" size={[48]} />
          <Home tag={"h2"} $fontSize={[32]} $color={"black"}>
            <Link href={"/"}>Home</Link>
          </Home>
        </Flex>
        <ul role="list">
          <li>
            <P $fontFamily={"heading"} $fontSize={[32]} $mt={[20]}>
              <Link href={"https://teachers.thenational.academy/"}>
                Teacher Hub
              </Link>
            </P>
          </li>
          <li>
            <P $fontFamily={"heading"} $fontSize={[32]} $mt={[16]}>
              <Link href={"https://classroom.thenational.academy/"}>
                Classroom
              </Link>
            </P>
          </li>
          <li>
            <P $fontFamily={"heading"} $fontSize={[24]} $mt={[32]}>
              <Link href={"/"}>Develop Your Curriculum</Link>
            </P>
          </li>
          <li>
            <P $fontFamily={"heading"} $fontSize={[24]} $mt={[12]}>
              <Link href={"/"}>Support Your Team</Link>
            </P>
          </li>
          <li>
            <P $fontFamily={"heading"} $fontSize={[24]} $mt={[12]}>
              <Link href={"/"}>Plan a lesson</Link>
            </P>
          </li>
          <li>
            <P $fontFamily={"ui"} $fontSize={[16]} $mt={[32]}>
              <Link href={"/"}>Blogs</Link>
            </P>
          </li>
          <li>
            <P $fontFamily={"ui"} $fontSize={[16]} $mt={[8]}>
              <Link href={"/"}>Webinars</Link>
            </P>
          </li>
          <li>
            <P $fontFamily={"ui"} $fontSize={[16]} $mt={[8]}>
              <Link href={"/"}>About us</Link>
            </P>
          </li>
          <li>
            <P $fontFamily={"ui"} $fontSize={[16]} $mt={[8]}>
              <Link href={"/"}>Contact us</Link>
            </P>
          </li>
          <li>
            <P $fontFamily={"ui"} $fontSize={[16]} $mt={[8]}>
              <Link href={"/"}>Help</Link>
            </P>
          </li>
        </ul>
      </Menu>
    </FixedHeader>
  );
};

export default SiteHeader;
