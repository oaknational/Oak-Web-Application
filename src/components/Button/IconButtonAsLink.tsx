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

const StyledNextLink = styled.a<IconButtonStylesProps>`
  ${iconButtonStyles}
`;

type IconButtonAsLinkProps = OakLinkPropsWithoutChildren &
  CommonIconButtonProps & {
    "aria-label": string;
    disabled?: boolean;
  };

const IconButtonAsLink: FC<IconButtonAsLinkProps> = (props) => {
  const { nextLinkProps, ...transformedProps } = transformOakLinkProps(props);
  const {
    icon,
    iconColorOverride,
    "aria-label": ariaLabel,
    disabled,
    iconAnimateTo,
    ...linkProps
  } = transformedProps;

  const { size, variant, background } = getIconButtonStylesProps(props);

  return (
    <Link {...nextLinkProps} passHref legacyBehavior>
      <StyledNextLink
        {...useButtonAsLinkProps()}
        {...linkProps}
        title={linkProps.title || ariaLabel}
        onClick={disabled ? (e) => e.preventDefault() : linkProps.onClick}
        aria-label={ariaLabel}
        size={size}
        variant={variant}
        background={background}
        disabled={disabled}
        aria-disabled={disabled}
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
    </Link>
  );
};

export default IconButtonAsLink;
