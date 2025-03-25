import { FC } from "react";
import Link from "next/link";
import styled from "styled-components";

import {
  ButtonVariant,
  CommonButtonProps,
  defaultButtonProps,
} from "../common";

import {
  OwaLinkPropsWithoutChildren,
  transformOwaLinkProps,
} from "@/components/SharedComponents/OwaLink";
import useButtonAsLinkProps from "@/components/SharedComponents/Button/useButtonAsLinkProps";
import buttonStyles, {
  ButtonStylesProps,
  getButtonStylesProps,
} from "@/components/SharedComponents/Button/button.styles";
import ButtonInner, {
  ButtonInnerProps,
} from "@/components/SharedComponents/Button/ButtonInner";

const StyledNextLink = styled.a<ButtonStylesProps>`
  ${buttonStyles}
  ${({ disabled }) =>
    disabled === true &&
    `
   pointer-events: none;
  `}
`;

export type ButtonAsLinkProps = CommonButtonProps &
  OwaLinkPropsWithoutChildren &
  Pick<ButtonInnerProps, "currentStyles"> & {
    disabled?: boolean;
    variant?: ButtonVariant;
  };

const ButtonAsLink: FC<ButtonAsLinkProps> = (props) => {
  props = {
    ...defaultButtonProps,
    ...props,
  };
  const { nextLinkProps, ...transformedProps } = transformOwaLinkProps(props);
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
    $font,
    variant = defaultButtonProps.variant || "brush",
    ...linkProps
  } = transformedProps;

  const { size, $iconPosition, background } = getButtonStylesProps({
    ...transformedProps,
    variant,
  });

  // aria-label overrides label.
  // If labelSuffixA11y is provided, it is appended to the label.
  const defaultTitle =
    ariaLabel ?? (labelSuffixA11y ? `${label} ${labelSuffixA11y}` : label);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      e.preventDefault();
    } else {
      linkProps.onClick?.(e);
      e.currentTarget.blur();
    }
  };

  return (
    <Link {...nextLinkProps} passHref legacyBehavior>
      <StyledNextLink
        {...linkProps}
        onClick={handleClick}
        {...useButtonAsLinkProps()}
        title={linkProps.title || defaultTitle}
        aria-label={ariaLabel}
        size={size}
        variant={variant}
        background={background}
        $iconPosition={$iconPosition}
        icon={icon}
        disabled={disabled}
        // see: https://www.scottohara.me/blog/2021/05/28/disabled-links.html
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
      >
        <ButtonInner
          label={label}
          labelSuffixA11y={labelSuffixA11y}
          shouldHideLabel={shouldHideLabel}
          icon={icon}
          $iconPosition={$iconPosition}
          iconBackground={disabled ? "grey50" : iconBackground}
          size={size}
          background={background}
          variant={variant}
          disabled={disabled}
          isCurrent={isCurrent}
          currentStyles={currentStyles}
          $font={$font}
        />
      </StyledNextLink>
    </Link>
  );
};

export default ButtonAsLink;
