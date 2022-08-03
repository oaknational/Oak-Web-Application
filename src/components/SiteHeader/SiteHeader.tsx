import { FC, useContext } from "react";
import Link from "next/link";
import styled, { useTheme } from "styled-components";

import Flex, { FlexProps } from "../Flex";
import flex from "../../styles/utils/flex";
import P from "../Typography";
import Icon from "../Icon";
import FixedHeader from "../FixedHeader";
import IconButton from "../Button/IconButton";
import { menuContext } from "../../context/Menu/MenuProvider";
import { Menu } from "../Menu";

const HomeLink = styled.a<FlexProps>`
  ${flex}
`;

const SiteHeader: FC = () => {
  const theme = useTheme();

  const { toggleMenu } = useContext(menuContext);

  return (
    <FixedHeader $background={theme.header.background}>
      <Link href={"/"} passHref>
        <HomeLink $alignItems="center">
          <Icon name="Home" width={96} height={48} $mr={8} />
        </HomeLink>
      </Link>
      <Flex $alignItems={"center"} $display={["none", "flex"]}>
        <P $ml={[0]}>
          <Link href={"https://classroom.thenational.academy/"}>Classroom</Link>
        </P>
        <P $ml={[24]} $mr={[]}>
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
        <P>Menu content...</P>
      </Menu>
    </FixedHeader>
  );
};

export default SiteHeader;
