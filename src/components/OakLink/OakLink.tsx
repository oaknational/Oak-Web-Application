import Link, { LinkProps } from "next/link";
import { forwardRef, ReactNode } from "react";
import styled, { css } from "styled-components";

import {
  isExternalHref,
  MaybeOakHref,
  resolveOakHref,
  ResolveOakHrefProps,
} from "../../common-lib/urls";
import flex from "../../styles/utils/flex";
import { OmitKeepDiscriminated } from "../../utils/generics";
import { box } from "../Box";
import { HTMLAnchorProps } from "../Button/common";
import { FlexProps } from "../Flex";

import FocusUnderline, { focusUnderlineStyles } from "./FocusUnderline";

type FocusStyle = "underline";
type FocusStylesProps = {
  focusStyles?: FocusStyle[];
};
type StyleProps = FlexProps &
  FocusStylesProps & {
    /**
     * isHovered is used to show hover styles (for example if a clickable card
     * is hovered), and this link is the click target for it.
     */
    isHovered?: boolean;
    /**
     * Set 'inline=true' if the link is in amongst a block of text. Styles will
     * be affected: text-decoration: underline;
     */
    $isInline?: boolean;
  };

const inlineStyles = css`
  display: inline;
  text-decoration: underline;
  color: ${(props) => props.theme.colors.hyperlink};
`;
const hoverStyles = css`
  text-decoration: underline;
`;

const StyledNextLink = styled(Link)<StyleProps>`
  ${box}
  ${flex}
  ${(props) => props.$isInline && inlineStyles}
  ${(props) => props.focusStyles?.includes("underline") && focusUnderlineStyles}

  ${(props) => props.isHovered && hoverStyles}
  :hover {
    ${hoverStyles}
  }
`;

export type OakLinkProps = Omit<LinkProps, "href" | "passHref" | "as"> &
  StyleProps & {
    children: ReactNode;
    className?: string;
    htmlAnchorProps?: HTMLAnchorProps;
  } & (
    | {
        /**
         * To encourage the use of 'page' prop (which will get resolved to an href)
         * you must pass page={null} when passing 'href' directly
         */
        page: null;
        href: MaybeOakHref;
      }
    | ResolveOakHrefProps
  );
export type OakLinkPropsWithoutChildren = OmitKeepDiscriminated<
  OakLinkProps,
  "children"
>;

const getOakLinkHref = (props: OakLinkPropsWithoutChildren) => {
  const href = "href" in props ? props.href : resolveOakHref(props);

  return href;
};

export const transformOakLinkProps = <T extends OakLinkPropsWithoutChildren>(
  props: T
) => {
  const { htmlAnchorProps, ...linkProps } = props;
  const href = getOakLinkHref(props);

  const isExternal = isExternalHref(href);
  const target = isExternal ? "_blank" : undefined;

  return {
    target,
    href,
    role: "link",
    ...htmlAnchorProps,
    ...linkProps,
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
  const transformedProps = transformOakLinkProps(props);
  return (
    <StyledNextLink ref={ref} {...transformedProps}>
      {props.children}
      {props.focusStyles?.includes("underline") && (
        <FocusUnderline $color={"teachersYellow"} />
      )}
    </StyledNextLink>
  );
});

export default OakLink;
