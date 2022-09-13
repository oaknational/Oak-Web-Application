import Link, { LinkProps } from "next/link";
import { FC } from "react";

import {
  isExternalHref,
  MaybeOakHref,
  resolveOakHref,
  ResolveOakHrefProps,
} from "../../common-lib/urls";
import { HTMLAnchorProps } from "../Button/common";

export type OakLinkProps = Omit<LinkProps, "href"> & {
  htmlAnchorProps?: HTMLAnchorProps;
} & (
    | {
        // href type pattern below is to allow any string value whilst offering OakHref autocomplete
        // eslint-disable-next-line @typescript-eslint/ban-types
        href: MaybeOakHref;
      }
    | ResolveOakHrefProps
  );

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
  const href = "href" in props ? props.href : resolveOakHref(props);
  const { children, htmlAnchorProps, ...linkProps } = props;

  const isExternal = isExternalHref(href);
  const target = isExternal ? "_blank" : undefined;

  return (
    <Link href={href} {...linkProps}>
      <a target={target} {...htmlAnchorProps}>
        {children}
      </a>
    </Link>
  );
};

export default OakLink;
