import { FC } from "react";
import Link, { LinkProps } from "next/link";
import styled from "styled-components";

import ButtonInner from "./ButtonInner";
import useButtonAsLinkProps from "./useButtonAsLinkProps";
import buttonStyles, {
  ButtonStylesProps,
  getButtonStylesProps,
} from "./button.styles";
import {
  CommonButtonProps,
  defaultButtonProps,
  HTMLAnchorProps,
} from "./common";

const StyledA = styled.a<ButtonStylesProps>`
  ${buttonStyles}
  ${({ disabled }) =>
    disabled === true &&
    `
   pointer-events: none;
  `}
`;
export type ButtonAsLinkProps = CommonButtonProps & {
  href: string;
  nextLinkProps?: Omit<LinkProps, "href">;
  htmlAnchorProps?: HTMLAnchorProps;
  disabled?: boolean;
};
const ButtonAsLink: FC<ButtonAsLinkProps> = (props) => {
  const {
    href,
    label,
    icon,
    "aria-label": ariaLabel,
    nextLinkProps,
    htmlAnchorProps = {},
    iconBackground,
    disabled = false,
    ...styleProps
  } = props;

  const { size, variant, iconPosition, background } =
    getButtonStylesProps(props);

  return (
    <Link {...nextLinkProps} href={href} passHref>
      <StyledA
        {...htmlAnchorProps}
        {...useButtonAsLinkProps()}
        title={htmlAnchorProps.title || ariaLabel || label}
        aria-label={ariaLabel || label}
        size={size}
        variant={variant}
        background={background}
        iconPosition={iconPosition}
        disabled={disabled}
        {...styleProps}
      >
        <ButtonInner
          label={label}
          icon={icon}
          iconPosition={iconPosition}
          iconBackground={iconBackground}
          size={size}
          background={background}
          variant={variant}
          disabled={disabled}
        />
      </StyledA>
    </Link>
  );
};

ButtonAsLink.defaultProps = defaultButtonProps;

export default ButtonAsLink;
