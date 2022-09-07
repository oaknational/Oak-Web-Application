import { FC } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { Heading } from "../Typography";
import Flex from "../Flex";

import { MenuLinkSize, MenuLinksProps } from "./types";
import MenuLink from "./MenuLink";
import MenuLinkActiveIcon from "./MenuLinkActiveIcon";

// const renderLocationIcon = ({
//   href,
//   currentPath,
//   arrowSize,
//   $mr,
// }: Pick<MenuLinkProps, "href" | "currentPath" | "arrowSize"> & {
//   $mr: PixelSpacing;
// }) => {
//   return isSubPath({ currentPath, href }) ? (
//     <Flex $mr={$mr}>
//       <Icon
//         variant="minimal"
//         name="ArrowRight"
//         size={arrowSize}
//         $opacity={0.6}
//       />
//     </Flex>
//   ) : null;
// };

const MenuLinks: FC<MenuLinksProps> = (props) => {
  const { menuSections } = props;
  const { asPath: currentPath } = useRouter();

  return (
    <>
      <Flex data-testid={`home-link`} $alignItems={"center"}>
        {/* {renderLocationIcon({
          currentPath,
          href: "/",
          arrowSize: [48],
          $mr: 16,
        })} */}
        <MenuLinkActiveIcon href="/" />
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
        {Object.entries(menuSections).map(([size, links]) =>
          links.map((link) => (
            <MenuLink
              size={size as MenuLinkSize}
              key={link.linkText}
              {...link}
            />
          ))
        )}
      </ul>
    </>
  );
};

export default MenuLinks;
