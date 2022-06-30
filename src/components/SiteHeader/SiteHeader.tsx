import { FC } from "react";
import Link from "next/link";
import styled, { css } from "styled-components";

import background from "../../styles/utils/background";
import Flex, { FlexProps } from "../Flex";
import flex from "../../styles/utils/flex";
import P, { Span } from "../Typography";
import Icon from "../Icon";

const baseHeaderStyles = css`
  width: 100%;
  min-height: 72px;
`;

const StyledSiteHeader = styled.header<FlexProps>`
  ${baseHeaderStyles}
  padding: 12px;
  position: fixed;
  z-index: 1;
  ${flex}
  ${background}
`;

const HeadingSpacer = styled.div`
  ${baseHeaderStyles}
`;

const HomeLink = styled.a<FlexProps>`
  ${flex}
`;

const SiteHeader: FC = () => {
  return (
    <div>
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
            <Link href={"https://classroom.thenational.academy/"}>
              Classroom
            </Link>
          </P>
          <P ml={[48]}>
            <Link href={"https://teachers.thenational.academy/"}>
              Teacher Hub
            </Link>
          </P>
        </Flex>
      </StyledSiteHeader>
      <HeadingSpacer />
    </div>
  );
};

export default SiteHeader;
