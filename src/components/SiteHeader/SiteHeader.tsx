import { FC } from "react";
import Link from "next/link";
import styled, { useTheme } from "styled-components";

import Flex, { FlexProps } from "../Flex";
import flex from "../../styles/utils/flex";
import P from "../Typography";
import Icon from "../Icon";
import FixedHeader from "../FixedHeader";
import IconButton from "../Button/IconButton";

const HomeLink = styled.a<FlexProps>`
  ${flex}
`;

const SiteHeader: FC = () => {
  const theme = useTheme();
  return (
    <FixedHeader $background={theme.header.background}>
      <Link href={"/"} passHref>
        <HomeLink $alignItems="center">
          <Icon name="Home" width={96} height={48} $mr={8} />
        </HomeLink>
      </Link>
      <Flex $alignItems={"center"} $mt={[16, 0, 0]}>
        <P $ml={[0]}>
          <Link href={"https://classroom.thenational.academy/"}>Classroom</Link>
        </P>
        <P $ml={[24]}>
          <Link href={"https://teachers.thenational.academy/"}>
            Teacher Hub
          </Link>
        </P>
        <IconButton
          aria-label="Menu"
          icon={"Hamburger"}
          onClick={() => {
            console.log("open menu");
          }}
        />
      </Flex>
    </FixedHeader>
  );
};

export default SiteHeader;
