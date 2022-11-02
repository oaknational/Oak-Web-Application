import { FC } from "react";
import Link from "next/link";
import styled from "styled-components";

import { OakLinkPropsWithoutChildren, transformOakLinkProps } from "../OakLink";

import useButtonAsLinkProps from "./useButtonAsLinkProps";
import IconButtonInner from "./IconButtonInner";
import { CommonIconButtonProps } from "./common";
import iconButtonStyles, {
  getIconButtonStylesProps,
  IconButtonStylesProps,
} from "./iconButton.styles";

const StyledNextLink = styled(Link)<IconButtonStylesProps>`
  ${iconButtonStyles}
`;

type IconButtonAsLinkProps = OakLinkPropsWithoutChildren &
  CommonIconButtonProps & {
    "aria-label": string;
    href: string;
    disabled?: boolean;
  };

const IconButtonAsLink: FC<IconButtonAsLinkProps> = (props) => {
  const transformedProps = transformOakLinkProps(props);
  const {
    icon,
    iconColorOverride,
    "aria-label": ariaLabel,
    href,
    disabled,
    iconAnimateTo,
    ...linkProps
  } = transformedProps;

  const { size, variant, background } = getIconButtonStylesProps(props);

  return (
    <StyledNextLink
      {...useButtonAsLinkProps()}
      title={linkProps.title || ariaLabel}
      onClick={disabled ? (e) => e.preventDefault() : linkProps.onClick}
      aria-label={ariaLabel}
      size={size}
      variant={variant}
      background={background}
      disabled={disabled}
      // see: https://www.scottohara.me/blog/2021/05/28/disabled-links.html
      aria-disabled={disabled}
      href={href}
      {...linkProps}
    >
      <IconButtonInner
        icon={icon}
        size={size}
        variant={variant}
        background={background}
        iconColorOverride={iconColorOverride}
        iconAnimateTo={iconAnimateTo}
      />
    </StyledNextLink>
  );
};

export default IconButtonAsLink;
