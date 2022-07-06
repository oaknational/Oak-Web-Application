import React, { FC } from "react";
import styled from "styled-components";

import { FlexProps } from "../Flex";

import Card from "./Card";

const StyledCardAsLink = styled(Card)`
  &:focus-within {
    outline: 5px auto -webkit-focus-ring-color;
  }
`;

const CardLink = styled.a`
  ::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
`;

interface CardAsLinkProps extends FlexProps {
  href: string;
  target?: "_self" | "_blank";
  ariaLabel: string;
}

/**
 * Behaves the same way as a Card but
 * contains a link
 * whose click target stretches across the entire component.
 * Takes the same props as Card + href and target
 */
const CardAsLink: FC<CardAsLinkProps> = ({
  children,
  href,
  target = "_self",
  ariaLabel,
  ...cardProps
}) => {
  return (
    <StyledCardAsLink position="relative" {...cardProps}>
      <CardLink aria-label={ariaLabel} target={target} href={href} />
      {children}
    </StyledCardAsLink>
  );
};

export default CardAsLink;
