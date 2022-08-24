import { FC } from "react";
import Link from "next/link";
import styled from "styled-components";

import P, { Heading } from "../Typography";
import Flex from "../Flex";
import Icon from "../Icon";

const Home = styled(Heading)`
  opacity: 0.6;
  text-decoration: underline;
`;

const LocationIcon = styled(Icon)`
  opacity: 0.6;
`;

type MenuListElementProps = {
  fontFamily?: string;
  fontSize?: string;
  href: string;
  linkText: string;
};

type MenuLinkProps = {
  menuLinks: MenuListElementProps[];
};

const MenuListElement: FC<MenuListElementProps> = (props) => {
  const { href, linkText } = props;
  return (
    <li>
      <P $fontFamily={"heading"} $fontSize={[32]} $mt={[20]}>
        <Link href={href}>{linkText}</Link>
      </P>
    </li>
  );
};

const MenuLinks: FC<MenuLinkProps> = (props) => {
  const { menuLinks } = props;

  return (
    <>
      <Flex $alignItems={"center"}>
        <LocationIcon variant="minimal" name="ArrowRight" size={[48]} />
        <Home tag={"h2"} $fontSize={[32]} $color={"black"}>
          <Link href={"/"}>Home</Link>
        </Home>
      </Flex>
      <ul role="list">
        {menuLinks.map((link) => (
          <MenuListElement {...link} />
        ))}
      </ul>
    </>
  );
};

export default MenuLinks;
