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
  href: LinkProps["href"];
  nextLinkProps?: Omit<LinkProps, "href">;
  htmlAnchorProps?: HTMLAnchorProps;
  disabled?: boolean;
};
const ButtonAsLink: FC<ButtonAsLinkProps> = (props) => {
  const {
    href,
    label,
    labelSuffixA11y,
    shouldHideLabel,
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
    <Link {...nextLinkProps} href={href} passHref={!disabled}>
      <StyledA
        {...htmlAnchorProps}
        onClick={disabled ? (e) => e.preventDefault() : htmlAnchorProps.onClick}
        {...useButtonAsLinkProps()}
        title={htmlAnchorProps.title || ariaLabel || label}
        aria-label={ariaLabel}
        size={size}
        variant={variant}
        background={background}
        iconPosition={iconPosition}
        disabled={disabled}
        // see: https://www.scottohara.me/blog/2021/05/28/disabled-links.html
        aria-disabled={disabled}
        {...styleProps}
      >
        <ButtonInner
          label={label}
          labelSuffixA11y={labelSuffixA11y}
          shouldHideLabel={shouldHideLabel}
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
