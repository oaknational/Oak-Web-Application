import { FC } from "react";
import Link from "next/link";
import styled from "styled-components";

import background from "../../styles/utils/background";
import Flex, { FlexProps } from "../Flex";
import Icon from "../Icon";
import flex from "../../styles/utils/flex";
import P, { Span } from "../Typography";

const StyledSiteHeader = styled.header<FlexProps>`
  width: 100%;
  min-height: 72px;
  padding: 12px;
  ${flex}
  ${background}
`;

const HomeLink = styled.a<FlexProps>`
  ${flex}
`;

const SiteHeader: FC = () => {
  return (
    <StyledSiteHeader
      background={"madangGreen"}
      justifyContent={["left", "space-between"]}
      alignItems={["flex-start", "center"]}
      flexDirection={["column", "row"]}
    >
      <Link href={"/"} passHref>
        <HomeLink alignItems="center">
          <Icon name="Home" size={32} mr={8} />
          <Span
            fontFamily="heading"
            fontWeight={600}
            fontSize={20}
            lineHeight={1}
          >
            Oak
          </Span>
        </HomeLink>
      </Link>
      <Flex alignItems={"center"} mt={[16, 0]}>
        <P>
          <Link href={"/beta/onboarding"}>Join the Beta</Link>
        </P>
        <P ml={[16, 48, 48]}>
          <Link href={"https://classroom.thenational.academy/"}>Classroom</Link>
        </P>
        <P ml={[16, 48, 48]}>
          <Link href={"https://teachers.thenational.academy/"}>
            Teacher Hub
          </Link>
        </P>
      </Flex>
    </StyledSiteHeader>
  );
};

export default SiteHeader;
