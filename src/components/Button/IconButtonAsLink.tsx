import { AnchorHTMLAttributes, DetailedHTMLProps, FC } from "react";
import Link, { LinkProps } from "next/link";
import styled from "styled-components";

import useButtonAsLinkProps from "./useButtonAsLinkProps";
import IconButtonInner from "./IconButtonInner";
import { CommonIconButtonProps } from "./common";
import iconButtonStyles, {
  getIconButtonStylesProps,
  IconButtonStylesProps,
} from "./iconButton.styles";

const StyledA = styled.a<IconButtonStylesProps>`
  ${iconButtonStyles}
`;

type IconButtonAsLinkProps = CommonIconButtonProps & {
  "aria-label": string;
  href: LinkProps["href"];
  disabled?: boolean;
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
    icon,
    iconColorOverride,
    "aria-label": ariaLabel,
    href,
    nextLinkProps,
    anchorProps,
    disabled,
    ...styleProps
  } = props;

  const { size, variant, background } = getIconButtonStylesProps(props);

  return (
    <Link {...nextLinkProps} href={href} passHref={!disabled}>
      <StyledA
        {...anchorProps}
        {...useButtonAsLinkProps()}
        aria-label={ariaLabel}
        size={size}
        variant={variant}
        background={background}
        disabled={disabled}
        // see: https://www.scottohara.me/blog/2021/05/28/disabled-links.html
        aria-disabled={disabled}
        role="link"
        {...styleProps}
      >
        <IconButtonInner
          icon={icon}
          size={size}
          variant={variant}
          background={background}
          iconColorOverride={iconColorOverride}
        />
      </StyledA>
    </Link>
  );
};

export default IconButtonAsLink;
