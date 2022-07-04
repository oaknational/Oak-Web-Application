import { FC } from "react";
import Link from "next/link";
import styled from "styled-components";

import SearchForm from "../SearchForm";
import Flex, { FlexProps } from "../Flex";
import Icon from "../Icon";
import flex from "../../styles/utils/flex";
import { Span } from "../Typography";
import Menu from "../Menu";
import FixedHeader from "../FixedHeader";

const HomeLink = styled.a<FlexProps>`
  ${flex}
`;

/**
 * Header for logging in and using search -
 * header for the app, not a landing page
 *
 */
const AppHeader: FC = () => {
  return (
    <FixedHeader background="grey3">
      <Flex mr={40} justifyContent={"space-between"}>
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
        <SearchForm />
      </Flex>
      <Menu>
        <p>Hello joe</p>
      </Menu>
    </FixedHeader>
  );
};

export default AppHeader;
