import Link, { LinkProps } from "next/link";
import { FC, ReactNode } from "react";

import {
  isExternalHref,
  MaybeOakHref,
  resolveOakHref,
  ResolveOakHrefProps,
} from "../../common-lib/urls";
import { HTMLAnchorProps } from "../Button/common";

export type OakLinkProps = Omit<LinkProps, "href"> & {
  children: ReactNode;
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
  const { children, htmlAnchorProps, ...linkProps } = props;
  return { href, ...linkProps };
};
export const getOakLinkAnchorProps = (props: OakLinkProps): HTMLAnchorProps => {
  const href = getOakLinkHref(props);
  const { children, htmlAnchorProps } = props;

  const isExternal = isExternalHref(href);
  const target = isExternal ? "_blank" : undefined;

  return {
    children,
    target,
    ...htmlAnchorProps,
  };
};

/**
 * OakLink renders a next/link with correct props by taking typed values
 * for page name etc.
 * It's intended to help centralise information about our url structures,
 * and to facilitate behaviour link "open in a new tab" and tracking.
 *
 * @tood add track props
 * @todo currently this allows href as any string, do we want to further
 * restrict it?
 */
const OakLink: FC<OakLinkProps> = (props) => {
  return (
    <Link {...getOakLinkLinkProps(props)}>
      <a {...getOakLinkAnchorProps(props)} />
    </Link>
  );
};

export default OakLink;
