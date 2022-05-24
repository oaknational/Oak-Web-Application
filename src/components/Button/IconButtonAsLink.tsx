import { AnchorHTMLAttributes, DetailedHTMLProps, FC } from "react";
import Link, { LinkProps } from "next/link";
import styled from "styled-components";

import IconButtonInner, { IconButtonInnerProps } from "./IconButtonInner";
import useButtonAsLinkProps from "./useButtonAsLinkProps";
import { outermostElementStyles } from "./common";

const StyledA = styled.a`
  ${outermostElementStyles}
`;

type IconButtonAsLinkProps = IconButtonInnerProps & {
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
  } = props;

  return (
    <Link {...nextLinkProps} href={href} passHref>
      <StyledA
        {...anchorProps}
        {...useButtonAsLinkProps()}
        aria-label={ariaLabel}
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
