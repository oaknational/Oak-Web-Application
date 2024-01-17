import { FC } from "react";

import { ResolveOakHrefProps } from "@/common-lib/urls";
import TagPromotional from "@/components/SharedComponents/TagPromotional";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import Flex from "@/components/SharedComponents/Flex";

type HrefLink = { href: string };

export type BurgerMenuLink = {
  text: string;
  new: boolean;
  external: boolean;
  linkTo: ResolveOakHrefProps | HrefLink;
};

export type AppHeaderBurgerMenuLinkProps = {
  link: BurgerMenuLink;
};

export const linkIsHref = (input: unknown): input is HrefLink => {
  return typeof (input as HrefLink).href === "string";
};

const AppHeaderBurgerMenuLink: FC<AppHeaderBurgerMenuLinkProps> = (props) => {
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

export default AppHeaderBurgerMenuLink;
