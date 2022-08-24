import { FC } from "react";
import Link from "next/link";
import styled from "styled-components";

import P, { Heading } from "../Typography";
import Flex from "../Flex";
import Icon from "../Icon";

import { MenuLinkProps, MenuListElementProps } from "./types";

const Home = styled(Heading)`
  opacity: 0.6;
  text-decoration: underline;
`;

const LocationIcon = styled(Icon)`
  opacity: 0.6;
`;

const MenuListElement: FC<MenuListElementProps> = (props) => {
  const { href, linkText, fontFamily, fontSize, $mt, currentPath } = props;
  return (
    <li>
      <Flex $alignItems={"center"} $mt={$mt}>
        {renderLocationIcon({ currentPath, href })}
        <P $fontFamily={fontFamily} $fontSize={fontSize} $mt={0}>
          <Link href={href}>{linkText}</Link>
        </P>
      </Flex>
    </li>
  );
};

const renderLocationIcon = ({
  href,
  currentPath,
}: Pick<MenuListElementProps, "href" | "currentPath">) => {
  return currentPath === href ? (
    <LocationIcon variant="minimal" name="ArrowRight" size={[48]} />
  ) : null;
};

const MenuLinks: FC<MenuLinkProps> = (props) => {
  const { menuLinks, currentPath } = props;

  return (
    <>
      <Flex $alignItems={"center"}>
        {renderLocationIcon({ currentPath, href: "/" })}
        <Home tag={"h2"} $fontSize={[32]} $color={"black"}>
          <Link href={"/"}>Home</Link>
        </Home>
      </Flex>
      <ul role="list">
        {menuLinks.map((link) => (
          <MenuListElement
            key={link.linkText}
            {...link}
            currentPath={currentPath}
          />
        ))}
      </ul>
    </>
  );
};

export default MenuLinks;
