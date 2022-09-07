import { FC } from "react";

import { PixelSpacing } from "../../styles/theme";
import { FontSize } from "../../styles/utils/typography";
import Flex from "../Flex";
import OakLink from "../OakLink";
import { P } from "../Typography";

import MenuLinkActiveIcon from "./MenuLinkActiveIcon";
import { MenuLinkProps, MenuLinkSize } from "./types";

const MARGIN_TOP: Record<MenuLinkSize, PixelSpacing[]> = {
  small: [20],
  medium: [20],
  large: [20],
};
const FONT_SIZE: Record<MenuLinkSize, FontSize[]> = {
  small: [16],
  medium: [24],
  large: [32],
};

const MenuLink: FC<MenuLinkProps> = (props) => {
  const { href, linkText, size } = props;

  return (
    <li>
      <Flex
        data-testid={`${href.slice(1)}-link`}
        $alignItems={"center"}
        $mt={MARGIN_TOP[size]}
      >
        {/* {renderLocationIcon({
          currentPath,
          href,
          arrowSize,
          $mr: (fontSize[0] / 2) as PixelSpacing,
        })} */}
        <MenuLinkActiveIcon href={href} />
        <P
          $fontFamily="heading"
          $fontSize={FONT_SIZE[size]}
          $mt={0}
          // $textDecoration={
          //   isSubPath({ href, currentPath }) ? "underline" : "none"
          // }
          // $opacity={isSubPath({ href, currentPath }) ? 0.6 : 1}
        >
          <OakLink
            href={href}
            htmlAnchorProps={
              {
                // onClick,
              }
            }
          >
            {linkText}
          </OakLink>
        </P>
      </Flex>
    </li>
  );
};

export default MenuLink;
