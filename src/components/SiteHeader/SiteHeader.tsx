import { FC } from "react";
import Link from "next/link";
import styled from "styled-components";

import Flex, { FlexProps } from "../Flex";
import flex from "../../styles/utils/flex";
import P, { Span } from "../Typography";
import Icon from "../Icon";
import FixedHeader from "../FixedHeader";

const HomeLink = styled.a<FlexProps>`
  ${flex}
`;

const SiteHeader: FC = () => {
  return (
    <FixedHeader $background={"pupilsLightGreen"}>
      <Link href={"/"} passHref>
        <HomeLink $alignItems="center">
          <Icon name="Home" size={32} $mr={8} />
          <Span $fontFamily="heading" $fontSize={20} $lineHeight={1}>
            Oak
          </Span>
        </HomeLink>
      </Link>
      <Flex $alignItems={"center"} $mt={[16, 0, 0]}>
        <P>
          <Link href={"/beta/onboarding"}>Join the Beta</Link>
        </P>
        <P $ml={[16, 48, 48]}>
          <Link href={"https://classroom.thenational.academy/"}>Classroom</Link>
        </P>
        <P $ml={[16, 48, 48]}>
          <Link href={"https://teachers.thenational.academy/"}>
            Teacher Hub
          </Link>
        </P>
      </Flex>
    </FixedHeader>
  );
};

export default SiteHeader;
