import { forwardRef, ReactNode } from "react";
import styled, { css } from "styled-components";
import Link from "next/link";
import { OakSvg, OakSvgProps } from "@oaknational/oak-components";

import {
  OwaLinkProps,
  transformOwaLinkProps,
} from "@/components/SharedComponents/OwaLink";
import { zIndexMap } from "@/styles/utils/zIndex";
import { DROP_SHADOW } from "@/styles/utils/dropShadow";
import getColorByName from "@/styles/themeHelpers/getColorByName";
import { HOVER_SHADOW_TRANSITION } from "@/styles/transitions";

export const CardLinkFocusUnderline = styled(OakSvg).attrs<{
  name?: OakSvgProps["name"];
}>({
  name: "underline",
})`
  display: none;
  position: absolute;
  bottom: -9px;
  left: -2px;
  right: 0;
  width: calc(100% + 2);
  height: 10px;
  transform: rotate(-0.3deg);
  color: ${getColorByName("lemon")};
  filter: drop-shadow(2px 4px 0 rgb(0 0 0));
  z-index: ${zIndexMap.inFront};
`;

type HoverStyles = ("underline-link-text" | "drop-shadow")[];
/**
 * 'CardLinkProps' is the combination of AnchorElement props and Next's Link
 * props. We use the href prop from next/link so omit it from Anchor props
 */
export type CardLinkProps = {
  children: ReactNode;
  $hideDefaultFocus?: boolean;
  $hoverStyles?: HoverStyles;
} & OwaLinkProps;

type StyleProps = {
  $hoverStyles: HoverStyles;
  $hideDefaultFocus?: boolean;
};

const StyledNextLink = styled.a<StyleProps>`
  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: ${zIndexMap.inFront};
    transition: ${HOVER_SHADOW_TRANSITION};
  }

  &:hover {
    ${(props) =>
      props.$hoverStyles.includes("underline-link-text") &&
      css`
        text-decoration: underline;
      `}

    ${(props) =>
      props.$hoverStyles.includes("drop-shadow") &&
      css`
        &::after {
          box-shadow: ${DROP_SHADOW.interactiveCardHover};
        }
      `}
  }

  &:focus {
    ${(props) =>
      props.$hideDefaultFocus &&
      css`
        outline: none;
      `}

    & + ${CardLinkFocusUnderline} {
      display: block;
    }
  }
`;

/**
 * A convenience component to use in a Card component which makes the card
 * clickable as a link.
 */
const CardLink = forwardRef<HTMLAnchorElement, CardLinkProps>(
  ({ $hideDefaultFocus, $hoverStyles = [], ...props }, ref) => {
    const { nextLinkProps, ...transformedProps } = transformOwaLinkProps(props);

    return (
      <Link {...nextLinkProps} passHref legacyBehavior>
        <StyledNextLink
          ref={ref}
          $hideDefaultFocus={$hideDefaultFocus}
          $hoverStyles={$hoverStyles}
          {...transformedProps}
        />
      </Link>
    );
  },
);

export default CardLink;
