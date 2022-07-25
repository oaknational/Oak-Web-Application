import { DetailedHTMLProps, forwardRef, InputHTMLAttributes } from "react";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import styled from "styled-components";

/**
 * 'CardLinkProps' is the combination of AnchorElement props and Next's Link
 * props. We use the href prop from next/link so omit it from Anchor props
 */
export type CardLinkProps = Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>,
  "href" | "ref"
> &
  Omit<NextLinkProps, "as" | "passHref" | "children">;

const CardLinkA = styled.a`
  ::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  &:focus-within {
    outline: 5px auto -webkit-focus-ring-color;
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
      <NextLink
        href={href}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        locale={locale}
        passHref
      >
        <CardLinkA ref={ref} {...cardLinkProps} />
      </NextLink>
    );
  }
);

export default CardLink;
