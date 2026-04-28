import { OakSvg } from "@oaknational/oak-components";
import { LinkProps } from "next/link";
import { ReactNode } from "react";
import styled, { css } from "styled-components";

import { box } from "../../Box";
import { focusUnderlineStyles } from "../../FocusUnderline";
import { newFocusUnderlineStyles } from "../../NewFocusUnderline";
import { HTMLAnchorProps } from "../common";

import { OmitKeepDiscriminated } from "@/utils/generics";
import flex from "@/styles/utils/flex";
import { FlexProps } from "@/components/SharedComponents/Flex.deprecated";
import {
  MaybeOakHref,
  ResolveOakHrefProps,
  resolveOakHref,
  isExternalHref,
} from "@/common-lib/urls";

// DELETE THIS FILE OMCE BUTTONASLINK REMOVED

type FocusStyle = "underline" | "new-underline";
type FocusStylesProps = {
  $focusStyles?: FocusStyle[];
};
type StyleProps = FlexProps &
  FocusStylesProps & {
    /**
     * $isHovered is used to show hover styles (for example if a clickable card
     * is hovered), and this link is the click target for it.
     */
    $isHovered?: boolean;
    /**
     * Set 'inline=true' if the link is in amongst a block of text. Styles will
     * be affected: text-decoration: underline;
     */
    $isInline?: boolean;
    $hideDefaultFocus?: boolean;
    $isSelected?: boolean;
  };

const inlineStyles = css`
  display: inline;
  text-decoration: underline;
  color: ${(props) => props.theme.colors.navy};
`;
const $hoverStyles = css`
  text-decoration: underline;
`;

export const $selectedStyle = css`
  transition-duration: 0s;
  transition-delay: 0s;
`;

const StyledNextLink = styled.a<StyleProps>`
  overflow-wrap: break-word;
  ${box}
  ${flex}
  ${(props) => props.$isInline && inlineStyles}
  ${(props) =>
    props.$focusStyles?.includes("underline") && focusUnderlineStyles}
    ${(props) =>
    props.$focusStyles?.includes("new-underline") && newFocusUnderlineStyles}
  ${(props) => props.$isHovered && $hoverStyles}

  ${(props) => props.$isSelected && $selectedStyle}
  :hover {
    ${$hoverStyles}
  }

  :focus {
    ${(props) =>
      props.$hideDefaultFocus &&
      css`
        outline: none;
      `}
  }
`;

export const ActiveLinkUnderline = styled(OakSvg)`
  position: absolute;
  height: 8px;
  bottom: -29px;
  @media (max-width: 768px) {
    bottom: -20px;
  }
  left: 0px;
  ${StyledNextLink}:focus & {
    display: none;
  }
`;

export type OwaLinkProps = Omit<LinkProps, "href" | "passHref" | "as"> &
  StyleProps & {
    children: ReactNode;
    disabled?: boolean;
    className?: string;
    htmlAnchorProps?: HTMLAnchorProps;
    /**
     * is this the current (selected) item in a nav.
     * Should style the link appropriately and give correct aria-current attribute
     */
    isCurrent?: boolean;
    role?: string;
    rel?: string;
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
export type OwaLinkPropsWithoutChildren = OmitKeepDiscriminated<
  OwaLinkProps,
  "children"
>;

export const getOwaLinkHref = (props: OwaLinkPropsWithoutChildren) => {
  const href = "href" in props ? props.href : resolveOakHref(props);
  return href;
};

export const transformOwaLinkProps = <T extends OwaLinkPropsWithoutChildren>(
  props: T,
) => {
  const {
    htmlAnchorProps,
    disabled,
    scroll,
    shallow,
    prefetch,
    isCurrent,
    role,
    rel,
    ...linkProps
  } = props;
  const href = getOwaLinkHref(props);

  const isExternal = isExternalHref(href);
  const target = isExternal ? "_blank" : undefined;

  const nextLinkProps = {
    scroll,
    shallow,
    prefetch,
    /**
     * @see https://www.scottohara.me/blog/2021/05/28/disabled-links.html
     **/
    href: disabled ? "" : href,
  };

  const ariaCurrent: HTMLAnchorProps["aria-current"] = isCurrent
    ? "page"
    : undefined;

  return {
    target,
    role: role || "link",
    disabled,
    nextLinkProps,
    isCurrent,
    rel,
    ["aria-current"]: ariaCurrent,
    ...htmlAnchorProps,
    ...linkProps,
  };
};
