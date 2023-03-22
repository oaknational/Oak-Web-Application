import { FC } from "react";
import Link from "next/link";
import styled from "styled-components";

import { OakLinkPropsWithoutChildren, transformOakLinkProps } from "../OakLink";

import ButtonInner, { ButtonInnerProps } from "./ButtonInner";
import useButtonAsLinkProps from "./useButtonAsLinkProps";
import buttonStyles, {
  ButtonStylesProps,
  getButtonStylesProps,
} from "./button.styles";
import { CommonButtonProps, defaultButtonProps } from "./common";

const StyledNextLink = styled.a<ButtonStylesProps>`
  ${buttonStyles}
  ${({ disabled }) =>
    disabled === true &&
    `
   pointer-events: none;
  `}
`;
export type ButtonAsLinkProps = CommonButtonProps &
  OakLinkPropsWithoutChildren &
  Pick<ButtonInnerProps, "currentStyles"> & {
    disabled?: boolean;
    hrefQuery?: Record<string, string>;
  };
const ButtonAsLink: FC<ButtonAsLinkProps> = (props) => {
  const { nextLinkProps, ...transformedProps } = transformOakLinkProps(props);
  const {
    label,
    labelSuffixA11y,
    shouldHideLabel,
    icon,
    "aria-label": ariaLabel,
    iconBackground,
    disabled,
    isCurrent,
    currentStyles,
    hrefQuery,
    ...linkProps
  } = transformedProps;

  const { size, variant, $iconPosition, background } =
    getButtonStylesProps(transformedProps);

  const defaultTitle =
    ariaLabel || labelSuffixA11y ? `${label} ${labelSuffixA11y}` : "";

  const nextListPropsHrefQuery = hrefQuery
    ? {
        ...nextLinkProps,
        href: { pathname: linkProps.href, query: { ...hrefQuery } },
      }
    : nextLinkProps;

  return (
    <Link {...nextListPropsHrefQuery} passHref legacyBehavior>
      <StyledNextLink
        {...linkProps}
        onClick={disabled ? (e) => e.preventDefault() : linkProps.onClick}
        {...useButtonAsLinkProps()}
        title={linkProps.title || defaultTitle}
        aria-label={ariaLabel}
        size={size}
        variant={variant}
        background={background}
        $iconPosition={$iconPosition}
        disabled={disabled}
        // see: https://www.scottohara.me/blog/2021/05/28/disabled-links.html
        aria-disabled={disabled}
      >
        <ButtonInner
          label={label}
          labelSuffixA11y={labelSuffixA11y}
          shouldHideLabel={shouldHideLabel}
          icon={icon}
          $iconPosition={$iconPosition}
          iconBackground={iconBackground}
          size={size}
          background={background}
          variant={variant}
          disabled={disabled}
          isCurrent={isCurrent}
          currentStyles={currentStyles}
        />
      </StyledNextLink>
    </Link>
  );
};

ButtonAsLink.defaultProps = defaultButtonProps;

export default ButtonAsLink;
