import { FC } from "react";

import { isOakPage, resolveOakHref } from "../../common-lib/urls";
import useAnalytics from "../../context/Analytics/useAnalytics";
import { PixelSpacing } from "../../styles/theme";
import { FontVariant } from "../../styles/utils/typography";
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
const FONT_VARIANT: Record<MenuLinkSize, FontVariant[]> = {
  small: ["heading-7"],
  medium: ["heading-5"],
  large: ["heading-4"],
};
const SECTION_PADDING_TOP: Record<MenuLinkSize, PixelSpacing[]> = {
  small: [32],
  medium: [32],
  large: [0],
};

const MenuLink: FC<MenuLinkProps & { isFirstOfSection: boolean }> = (props) => {
  const { page, activeLinkHrefMatch, linkText, size, isFirstOfSection } = props;
  const href = resolveOakHref({ page });
  const isCurrent = useIsCurrent({ href: activeLinkHrefMatch || href });
  const { track } = useAnalytics();

  const onClick = () => {
    if (!isOakPage(page)) {
      // ensure that href is an OakHref for typesafety of below switch statement
      return;
    }
    switch (page) {
      case "teachers-home":
        return track.teacherHubSelected({ navigatedFrom: "menu" });
      case "pupils-home":
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
        <Span $font={FONT_VARIANT[size]} $opacity={isCurrent ? 0.6 : 1}>
          <OakLink page={page} htmlAnchorProps={{ onClick }}>
            {linkText}
          </OakLink>
        </Span>
      </Flex>
    </LI>
  );
};

export default MenuLink;
