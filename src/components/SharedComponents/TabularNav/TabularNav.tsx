import type { MouseEventHandler } from "react";
import styled from "styled-components";
import {
  OakFlex,
  OakFlexProps,
  OakSecondaryLink,
  OakTypography,
} from "@oaknational/oak-components";

import { resolveOakHref, ResolveOakHrefProps } from "@/common-lib/urls";

/**
 * TabularNav is a 'nav' component which renders 'minimal' (text-link) link
 * buttons as children. The 'current' item is styled different to differentiate
 * it.
 *
 * ## Usage
 *
 * Used for example in the 'unit listing' page to filter by 'tier' (where
 * tiers are available).
 */
type TabularNavLink = ResolveOakHrefProps & {
  label: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  isCurrent?: boolean;
};

const TabularNav = ({
  label,
  links,
  ...flexProps
}: OakFlexProps & {
  label: string;
  links: TabularNavLink[];
}) => {
  return (
    <OakFlex as="nav" aria-label={label} $pv={"spacing-4"} {...flexProps}>
      {links.map((link, i) => {
        const { label: linkLabel, onClick, isCurrent, ...hrefProps } = link;
        const href = resolveOakHref(hrefProps);
        return (
          <StyledTabularLink
            href={href}
            onClick={onClick}
            aria-current={isCurrent ? "page" : undefined}
            data-current={isCurrent ? "true" : undefined}
            key={`TabularNav-${link.page}-${i}`}
          >
            <OakTypography $font={"heading-7"} as="span">
              {linkLabel}
            </OakTypography>
          </StyledTabularLink>
        );
      })}
    </OakFlex>
  );
};

export default TabularNav;

const StyledTabularLink = styled(OakSecondaryLink)`
  text-decoration: none;
  margin-right: 24px;

  &[data-current="true"] {
    text-decoration: underline;
  }
`;
