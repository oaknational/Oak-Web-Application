import { FC } from "react";
import { OakFlex } from "@oaknational/oak-components";

import { ResolveOakHrefProps } from "@/common-lib/urls";
import TagPromotional from "@/components/SharedComponents/TagPromotional";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";

type HrefLink = { href: string };

export type BurgerMenuLink = {
  text: string;
  new: boolean;
  external: boolean;
  linkTo: ResolveOakHrefProps | HrefLink;
  ariaLabel?: string;
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
    <OakFlex $alignItems="center" $gap="all-spacing-2">
      <ButtonAsLink
        icon={link.external ? "external" : undefined}
        aria-label={`${link.ariaLabel ?? link.text}${
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
    </OakFlex>
  );
};

export default AppHeaderBurgerMenuLink;
