import {
  DetailedHTMLProps,
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
} from "react";
import styled from "styled-components";

import { zIndexMap } from "../../styles/utils/zIndex";
import OakLink, { OakLinkProps } from "../OakLink/OakLink";

/**
 * 'CardLinkProps' is the combination of AnchorElement props and Next's Link
 * props. We use the href prop from next/link so omit it from Anchor props
 */
export type CardLinkProps = { children: ReactNode } & Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>,
  "href" | "ref"
> &
  Omit<OakLinkProps, "as" | "passHref" | "children">;

const CardLinkA = styled.a`
  ::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: ${zIndexMap.inFront};
  }
`;
/**
 * A convenience component to use in a Card component which makes the card
 * clickable as a link.
 */
const CardLink = forwardRef<HTMLAnchorElement, CardLinkProps>(
  (
    { href, prefetch, replace, scroll, shallow, locale, ...cardLinkProps },
    ref
  ) => {
    return (
      <OakLink
        href={href}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        locale={locale}
        passHref
      >
        <CardLinkA ref={ref} {...cardLinkProps} />
      </OakLink>
    );
  }
);

export default CardLink;
