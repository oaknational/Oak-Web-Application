import { FC } from "react";
import Link from "next/link";
import styled from "styled-components";

import P, { Heading } from "../Typography";
import Flex from "../Flex";
import Icon from "../Icon";
import { PixelSpacing } from "../../styles/theme";

import { MenuLinkProps, MenuListElementProps } from "./types";

const Home = styled(Heading)``;

const LocationIcon = styled(Icon)`
  opacity: 0.6;
`;

const isSubPath = ({
  currentPath,
  href,
}: Pick<MenuListElementProps, "currentPath" | "href">) => {
  if (href === "/") {
    return currentPath === "/";
  }
  return currentPath.startsWith(href);
};

const MenuListElement: FC<MenuListElementProps> = (props) => {
  const { href, linkText, fontFamily, fontSize, $mt, currentPath, arrowSize } =
    props;

  return (
    <li>
      <Flex
        data-testid={`${href.slice(1)}-link`}
        $alignItems={"center"}
        $mt={$mt}
      >
        {renderLocationIcon({
          currentPath,
          href,
          arrowSize,
          $mr: (fontSize[0] / 2) as PixelSpacing,
        })}
        <P
          $fontFamily={fontFamily}
          $fontSize={fontSize}
          $mt={0}
          $textDecoration={
            isSubPath({ href, currentPath }) ? "underline" : "none"
          }
          $opacity={isSubPath({ href, currentPath }) ? 0.6 : 1}
        >
          <Link href={href}>{linkText}</Link>
        </P>
      </Flex>
    </li>
  );
};

const renderLocationIcon = ({
  href,
  currentPath,
  arrowSize,
  $mr,
}: Pick<MenuListElementProps, "href" | "currentPath" | "arrowSize"> & {
  $mr: PixelSpacing;
}) => {
  return isSubPath({ currentPath, href }) ? (
    <Flex $mr={$mr}>
      <LocationIcon variant="minimal" name="ArrowRight" size={arrowSize} />
    </Flex>
  ) : null;
};

const MenuLinks: FC<MenuLinkProps> = (props) => {
  const { menuLinks, currentPath } = props;

  return (
    <>
      <Flex data-testid={`home-link`} $alignItems={"center"}>
        {renderLocationIcon({
          currentPath,
          href: "/",
          arrowSize: [48],
          $mr: 16,
        })}
        <Home
          tag={"h2"}
          $fontSize={[32]}
          $color={"black"}
          $textDecoration={currentPath === "/" ? "underline" : "none"}
          $opacity={currentPath === "/" ? 0.6 : 1}
        >
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
