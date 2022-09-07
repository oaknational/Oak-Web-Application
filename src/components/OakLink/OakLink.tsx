import Link, { LinkProps } from "next/link";
import { FC } from "react";

import {
  isOakExternalUrl,
  OakExternalUrl,
  OakInternalPath,
} from "../../common-lib/urls";
import { HTMLAnchorProps } from "../Button/common";

export type OakLinkProps = LinkProps & {
  // eslint-disable-next-line @typescript-eslint/ban-types
  href: OakInternalPath | OakExternalUrl | (string & {});
  htmlAnchorProps?: HTMLAnchorProps;
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
  const { children, href, ...linkProps } = props;

  const isExternal = isOakExternalUrl(href);
  const target = isExternal ? "_blank" : undefined;

  return (
    <Link href={href} {...linkProps}>
      <a target={target}>{children}</a>
    </Link>
  );
};

export default OakLink;
