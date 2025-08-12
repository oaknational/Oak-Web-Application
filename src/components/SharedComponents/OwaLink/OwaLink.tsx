import Link, { LinkProps } from "next/link";
import { forwardRef, ReactNode } from "react";
import styled, { css } from "styled-components";
import { OakSvg } from "@oaknational/oak-components";

import {
  isExternalHref,
  MaybeOakHref,
  resolveOakHref,
  ResolveOakHrefProps,
} from "@/common-lib/urls";
import { OmitKeepDiscriminated } from "@/utils/generics";
import { box } from "@/components/SharedComponents/Box";
import { HTMLAnchorProps } from "@/components/SharedComponents/Button/common";
import FocusUnderline, {
  focusUnderlineStyles,
} from "@/components/SharedComponents/FocusUnderline";
import NewFocusUnderline, {
  newFocusUnderlineStyles,
} from "@/components/SharedComponents/NewFocusUnderline";
import flex from "@/styles/utils/flex";
import { FlexProps } from "@/components/SharedComponents/Flex.deprecated";

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
  &:hover {
    ${$hoverStyles}
  }

  &:focus {
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
    ["aria-current"]: ariaCurrent,
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
const OwaLink = forwardRef<HTMLAnchorElement, OwaLinkProps>((props, ref) => {
  const { nextLinkProps, ...transformedProps } = transformOwaLinkProps(props);
  return (
    <Link {...nextLinkProps} legacyBehavior passHref>
      <StyledNextLink ref={ref} {...transformedProps}>
        <>
          {props.children}
          {props.$focusStyles?.includes("underline") && (
            <FocusUnderline $color={"lemon"} />
          )}
          {props.$focusStyles?.includes("new-underline") && (
            <NewFocusUnderline />
          )}
        </>
      </StyledNextLink>
    </Link>
  );
});

export default OwaLink;
