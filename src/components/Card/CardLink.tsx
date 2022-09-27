import { forwardRef, ReactNode } from "react";
import styled, { css } from "styled-components";
import Link from "next/link";

import {
  getOakLinkLinkProps,
  getOakLinkAnchorProps,
  OakLinkProps,
} from "../OakLink/OakLink";
import { zIndexMap } from "../../styles/utils/zIndex";
import { DROP_SHADOW } from "../../styles/utils/dropShadow";
import Svg from "../Svg";
import getColorByName from "../../styles/themeHelpers/getColorByName";
import { HOVER_SHADOW_TRANSITION } from "../../styles/transitions";

export const CardLinkFocusUnderline = styled(Svg).attrs((props) => ({
  ...props,
  name: "Underline1",
}))`
  display: none;
  position: absolute;
  bottom: -9px;
  left: -2px;
  right: 0;
  width: calc(100% + 2);
  height: 10px;
  transform: rotate(-0.3deg);
  color: ${getColorByName("teachersYellow")};
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
  hideDefaultFocus?: boolean;
  hoverStyles?: HoverStyles;
} & OakLinkProps;

const CardLinkA = styled.a<{
  hoverStyles: HoverStyles;
  hideDefaultFocus?: boolean;
}>`
  ::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: ${zIndexMap.inFront};
    transition: ${HOVER_SHADOW_TRANSITION};
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

  :focus {
    ${(props) =>
      props.hideDefaultFocus &&
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
  ({ hideDefaultFocus, hoverStyles = [], ...props }, ref) => {
    return (
      <Link {...getOakLinkLinkProps(props)} passHref>
        <CardLinkA
          ref={ref}
          hideDefaultFocus={hideDefaultFocus}
          hoverStyles={hoverStyles}
          {...getOakLinkAnchorProps(props)}
        />
      </Link>
    );
  }
);

export default CardLink;
