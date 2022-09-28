import Link, { LinkProps } from "next/link";
import { forwardRef, ReactNode } from "react";
import styled from "styled-components";

import {
  isExternalHref,
  MaybeOakHref,
  resolveOakHref,
  ResolveOakHrefProps,
} from "../../common-lib/urls";
import flex from "../../styles/utils/flex";
import { HTMLAnchorProps } from "../Button/common";
import { FlexProps } from "../Flex";

const OakLinkA = styled.a`
  ${flex}
`;

export type OakLinkProps = Omit<LinkProps, "href" | "passHref"> &
  FlexProps & {
    children: ReactNode;
    className?: string;
    htmlAnchorProps?: HTMLAnchorProps;
  } & (
    | {
        /**
         * To encourage the ues of 'page' prop (which will get resolved to an href)
         * you must pass page={null} when passing 'href' directly
         */
        page: null;
        // href type pattern below is to allow any string value whilst offering OakHref autocomplete
        // eslint-disable-next-line @typescript-eslint/ban-types
        href: MaybeOakHref;
      }
    | ResolveOakHrefProps
  );

const getOakLinkHref = (props: OakLinkProps) => {
  const href = "href" in props ? props.href : resolveOakHref(props);

  return href;
};
export const getOakLinkLinkProps = (props: OakLinkProps): LinkProps => {
  const href = getOakLinkHref(props);

  const { as, replace, scroll, shallow, prefetch, locale } = props;

  return { href, as, replace, scroll, shallow, prefetch, locale };
};
export const getOakLinkAnchorProps = (
  props: OakLinkProps
): HTMLAnchorProps & FlexProps => {
  const href = getOakLinkHref(props);
  const {
    as,
    replace,
    scroll,
    shallow,
    prefetch,
    locale,
    children,
    className,
    htmlAnchorProps,
    ...styleProps
  } = props;

  const isExternal = isExternalHref(href);
  const target = isExternal ? "_blank" : undefined;

  return {
    children,
    target,
    className,
    ...styleProps,
    ...htmlAnchorProps,
  };
};

/**
 * OakLink renders a next/link with correct props by taking typed values
 * for page name etc.
 * It's intended to help centralise information about our url structures,
 * and to facilitate behaviour link "open in a new tab" and tracking.
 *
 * @todo add track props
 * @todo currently this allows href as any string, do we want to further
 * restrict it?
 */
const OakLink = forwardRef<HTMLAnchorElement, OakLinkProps>((props, ref) => {
  return (
    <Link {...getOakLinkLinkProps(props)} passHref>
      <OakLinkA ref={ref} {...getOakLinkAnchorProps(props)} />
    </Link>
  );
});

OakLink.defaultProps = {
  $display: "inline",
};

export default OakLink;
