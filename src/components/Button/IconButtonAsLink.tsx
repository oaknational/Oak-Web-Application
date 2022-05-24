import { AnchorHTMLAttributes, DetailedHTMLProps, FC } from "react";
import Link, { LinkProps } from "next/link";
import styled from "styled-components";

import { MarginProps } from "../../styles/utils/spacing";

import IconButtonInner, { IconButtonInnerProps } from "./IconButtonInner";
import useButtonAsLinkProps from "./useButtonAsLinkProps";
import { outermostElementStyles } from "./common";

const StyledA = styled.a<MarginProps>`
  ${outermostElementStyles}
`;

type IconButtonAsLinkProps = MarginProps &
  IconButtonInnerProps & {
    "aria-label": string;
    href: string;
    nextLinkProps?: Omit<LinkProps, "href">;
    anchorProps?: Omit<
      DetailedHTMLProps<
        AnchorHTMLAttributes<HTMLAnchorElement>,
        HTMLAnchorElement
      >,
      "ref" | "aria-label"
    >;
  };

const IconButtonAsLink: FC<IconButtonAsLinkProps> = (props) => {
  const {
    variant,
    size,
    icon,
    iconColorOverride,
    "aria-label": ariaLabel,
    href,
    nextLinkProps,
    anchorProps,
    ...styleProps
  } = props;

  return (
    <Link {...nextLinkProps} href={href} passHref>
      <StyledA
        {...anchorProps}
        {...useButtonAsLinkProps()}
        aria-label={ariaLabel}
        {...styleProps}
      >
        <IconButtonInner
          icon={icon}
          size={size}
          variant={variant}
          iconColorOverride={iconColorOverride}
        />
      </StyledA>
    </Link>
  );
};

export default IconButtonAsLink;
