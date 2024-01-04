import { FC } from "react";

import ButtonAsLink from "../SharedComponents/Button/ButtonAsLink";
import TagPromotional from "../TagPromotional";

import { BurgerMenuLink, linkIsHref } from "./types";

import Flex from "@/components/SharedComponents/Flex";

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
