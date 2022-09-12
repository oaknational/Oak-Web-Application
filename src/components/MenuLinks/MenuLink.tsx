import { FC } from "react";

import { isOakHref } from "../../common-lib/urls";
import useAnalytics from "../../context/Analytics/useAnalytics";
import { PixelSpacing } from "../../styles/theme";
import { FontSize } from "../../styles/utils/typography";
import Flex from "../Flex";
import OakLink from "../OakLink";
import { LI, Span } from "../Typography";

import MenuLinkActiveIcon from "./MenuLinkActiveIcon";
import { MenuLinkProps, MenuLinkSize } from "./types";
import useIsCurrent from "./useIsCurrent";

const MARGIN_TOP: Record<MenuLinkSize, PixelSpacing[]> = {
  small: [8],
  medium: [12],
  large: [16],
};
const FONT_SIZE: Record<MenuLinkSize, FontSize[]> = {
  small: [16],
  medium: [24],
  large: [32],
};
const SECTION_PADDING_TOP: Record<MenuLinkSize, PixelSpacing[]> = {
  small: [32],
  medium: [32],
  large: [0],
};

const MenuLink: FC<MenuLinkProps & { isFirstOfSection: boolean }> = (props) => {
  const { href, activeLinkHrefMatch, linkText, size, isFirstOfSection } = props;
  const isCurrent = useIsCurrent({ href: activeLinkHrefMatch || href });
  const { track } = useAnalytics();

  const onClick = () => {
    if (!isOakHref(href)) {
      // ensure that href is an OakHref for typesafety of below switch statement
      return;
    }
    switch (href) {
      case "https://teachers.thenational.academy":
        return track.teacherHubSelected({ navigatedFrom: "menu" });
      case "https://classroom.thenational.academy":
        return track.classroomSelected({ navigatedFrom: "menu" });
    }
  };

  return (
    <LI>
      <Flex
        data-testid={`${href.slice(1)}-link`}
        $alignItems={"center"}
        $mt={isFirstOfSection ? 0 : MARGIN_TOP[size]}
        $pt={isFirstOfSection ? SECTION_PADDING_TOP[size] : 0}
      >
        {isCurrent && <MenuLinkActiveIcon href={href} size={size} />}
        <Span
          $fontFamily="heading"
          $fontSize={FONT_SIZE[size]}
          $lineHeight={1.2}
          $opacity={isCurrent ? 0.6 : 1}
        >
          <OakLink href={href} htmlAnchorProps={{ onClick }}>
            {linkText}
          </OakLink>
        </Span>
      </Flex>
    </LI>
  );
};

export default MenuLink;
