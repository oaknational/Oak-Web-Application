import { FC } from "react";
import { OakFlex } from "@oaknational/oak-components";

import { ResolveOakHrefProps } from "@/common-lib/urls";
import TagPromotional from "@/components/SharedComponents/TagPromotional";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import useAnalytics from "@/context/Analytics/useAnalytics";

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
  const { track } = useAnalytics();

  const linkTo = linkIsHref(link.linkTo)
    ? { href: link.linkTo.href, page: null }
    : link.linkTo;

  return (
    <OakFlex $alignItems="center" $gap="spacing-8">
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
        onClick={() => {
          if ("keyStageSlug" in linkTo) {
            track.browseRefinedAccessed({
              platform: "owa",
              product: "teacher lesson resources",
              engagementIntent: "refine",
              componentType: "hamburger_menu_button",
              eventVersion: "2.0.0",
              analyticsUseCase: "Teacher",
              filterType: "Key stage filter",
              filterValue: link.text,
              activeFilters: [],
            });
          }
        }}
        {...linkTo}
      />
      {link.new && <TagPromotional size="small" />}
    </OakFlex>
  );
};

export default AppHeaderBurgerMenuLink;
