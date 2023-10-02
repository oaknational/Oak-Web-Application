import { FC } from "react";

import ButtonAsLink from "../Button/ButtonAsLink";
import TagPromotional from "../TagPromotional";
import Flex from "../Flex/Flex";

import { BurgerMenuLink, linkIsHref } from "./types";

export type BurgerMenuLinkProps = {
  link: BurgerMenuLink;
};
const BurgerMenuLinkButton: FC<BurgerMenuLinkProps> = (props) => {
  const { link } = props;

  const linkTo = linkIsHref(link.linkTo)
    ? { href: link.linkTo.href, page: null }
    : link.linkTo;

  return (
    <Flex $alignItems="center" $gap={10}>
      <ButtonAsLink
        icon={link.external ? "external" : undefined}
        aria-label={`${link.text}${
          link.external ? " (opens in a new tab)" : ""
        }`}
        label={link.text}
        $iconPosition="trailing"
        iconBackground="transparent"
        variant="buttonStyledAsLink"
        size="large"
        {...linkTo}
      />
      {link.new && <TagPromotional size="small" />}
    </Flex>
  );
};

export default BurgerMenuLinkButton;
