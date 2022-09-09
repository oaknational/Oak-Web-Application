import { forwardRef, ReactNode } from "react";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import styled, { css } from "styled-components";

import { zIndexMap } from "../../styles/utils/zIndex";
import { HTMLAnchorProps } from "../Button/common";
import { DROP_SHADOW } from "../../styles/utils/dropShadow";

type HoverStyles = ("underline-link-text" | "drop-shadow")[];
/**
 * 'CardLinkProps' is the combination of AnchorElement props and Next's Link
 * props. We use the href prop from next/link so omit it from Anchor props
 */
export type CardLinkProps = {
  children: ReactNode;
  hoverStyles?: HoverStyles;
} & Omit<HTMLAnchorProps, "href" | "ref"> &
  Omit<NextLinkProps, "as" | "passHref" | "children">;

const CardLinkA = styled.a<{ hoverStyles: HoverStyles }>`
  ::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: ${zIndexMap.inFront};
  }

  :hover {
    ${(props) =>
      props.hoverStyles.includes("underline-link-text") &&
      css`
        text-decoration: underline;
      `}

    ${(props) =>
      props.hoverStyles.includes("drop-shadow") &&
      css`
        ::after {
          box-shadow: ${DROP_SHADOW.interactiveCardHover};
        }
      `}
  }
`;

/**
 * A convenience component to use in a Card component which makes the card
 * clickable as a link.
 */
const CardLink = forwardRef<HTMLAnchorElement, CardLinkProps>(
  (
    {
      href,
      prefetch,
      replace,
      scroll,
      shallow,
      locale,
      hoverStyles = [],
      ...cardLinkProps
    },
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
        <CardLinkA ref={ref} hoverStyles={hoverStyles} {...cardLinkProps} />
      </NextLink>
    );
  }
);

export default CardLink;
