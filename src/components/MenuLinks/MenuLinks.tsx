import { FC } from "react";
import Link from "next/link";

import P, { Heading } from "../Typography";
import Flex from "../Flex";
import Icon from "../Icon";
import { PixelSpacing } from "../../styles/theme";

import { MenuLinkProps, MenuListItemProps } from "./types";

const isSubPath = ({
  currentPath,
  href,
}: Pick<MenuListItemProps, "currentPath" | "href">) => {
  if (href === "/") {
    return currentPath === "/";
  }
  return `${currentPath}/`.startsWith(`${href}/`);
};

const MenuListItem: FC<MenuListItemProps> = (props) => {
  const {
    href,
    linkText,
    fontFamily,
    fontSize,
    $mt,
    currentPath,
    arrowSize,
    onClick,
    target,
  } = props;

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
          <Link href={href}>
            <a onClick={onClick} target={target}>
              {linkText}
            </a>
          </Link>
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
}: Pick<MenuListItemProps, "href" | "currentPath" | "arrowSize"> & {
  $mr: PixelSpacing;
}) => {
  return isSubPath({ currentPath, href }) ? (
    <Flex $mr={$mr}>
      <Icon
        variant="minimal"
        name="ArrowRight"
        size={arrowSize}
        $opacity={0.6}
      />
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
        <Heading
          tag={"h2"}
          $fontSize={[32]}
          $color={"black"}
          $textDecoration={currentPath === "/" ? "underline" : "none"}
          $opacity={currentPath === "/" ? 0.6 : 1}
        >
          <Link href={"/"}>Home</Link>
        </Heading>
      </Flex>
      <ul role="list">
        {menuLinks.map((link) => (
          <MenuListItem
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
