import type { MouseEventHandler } from "react";
import styled from "styled-components";
import {
  OakFlex,
  OakFlexProps,
  OakSmallPrimaryInvertedButton,
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
            element={"a"}
            href={href}
            onClick={onClick}
            selected={isCurrent}
            aria-current={isCurrent ? "page" : undefined}
            $mr={"spacing-24"}
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

/**
 * This could potentially be replaced with Tabs in the Oak Design Kit once implemented
 * https://www.figma.com/design/YcWQMMhHPVVmc47cHHEEAl/Oak-Design-Kit?node-id=8866-11234&p=f&m=dev
 */
const StyledTabularLink = styled(OakSmallPrimaryInvertedButton)`
  a,
  a:hover {
    border-color: transparent;
    background: transparent;
  }

  a[aria-current="page"] {
    padding-top: 0.05rem;
  }

  a[aria-current="page"]:hover div svg {
    display: block;
  }

  svg {
    color: var(--Tokens-Border-border-primary, #222);
    bottom: -10px;
  }
`;
